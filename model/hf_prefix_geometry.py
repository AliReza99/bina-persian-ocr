# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: OpenMDW-1.1

"""Learned content-normalized positional interpolation shared with serving."""

def _normalized_2d_position_pages(
    torch_module,
    *,
    patches,
    pos_embed,
    source_rows: int,
    source_cols: int,
    image_sizes,
    patch_size: int,
    content_sizes=None,
    content_normalized: bool = False,
):
    """Mirror training's per-page normalized-2D position interpolation.

    Keep this helper independent of vLLM imports so the export contract can be
    exercised on the login node.  vLLM supplies one concatenated raw-patch
    sequence, whereas training embeds each page separately; splitting before
    interpolation makes the two representations numerically identical.
    """

    source_rows = int(source_rows)
    source_cols = int(source_cols)
    patch_size = int(patch_size)
    if source_rows <= 0 or source_cols <= 0 or patch_size <= 0:
        raise ValueError(
            "normalized 2D positions require positive source grid and patch size"
        )
    if source_rows * source_cols != int(pos_embed.shape[1]):
        raise ValueError(
            "RADIO learned positional field shape is inconsistent: "
            f"source={source_rows}x{source_cols} tokens={int(pos_embed.shape[1])}"
        )

    positional_grid = pos_embed.reshape(
        1, source_rows, source_cols, -1
    ).permute(0, 3, 1, 2)
    normalized_content_sizes = None
    if content_sizes is not None:
        normalized_content_sizes = [
            tuple(int(value) for value in size) for size in content_sizes
        ]
        if len(normalized_content_sizes) != len(image_sizes):
            raise ValueError(
                "Content-size count must match image-size count: "
                f"content_sizes={len(normalized_content_sizes)} "
                f"image_sizes={len(image_sizes)}"
            )
    if content_normalized and normalized_content_sizes is None:
        raise ValueError("content-normalized 2D positions require content_sizes")

    positioned_pages = []
    cursor = 0
    for image_index, (raw_height, raw_width) in enumerate(image_sizes):
        height, width = int(raw_height), int(raw_width)
        if height % patch_size or width % patch_size:
            raise ValueError(
                f"Page shape {(height, width)} is not aligned to patch size {patch_size}"
            )
        rows, cols = height // patch_size, width // patch_size
        patch_count = rows * cols
        page = patches[:, cursor : cursor + patch_count]
        if int(page.shape[1]) != patch_count:
            raise ValueError(
                "Normalized position split ended inside a page: "
                f"page={(height, width)} expected={patch_count} actual={int(page.shape[1])}"
            )
        cursor += patch_count
        if content_normalized:
            content_height, content_width = normalized_content_sizes[image_index]
            if content_height <= 0 or content_width <= 0:
                raise ValueError(
                    "content size must be positive, got "
                    f"{(content_height, content_width)}"
                )
            if content_height > height or content_width > width:
                raise ValueError(
                    "content size cannot exceed padded image: "
                    f"content={(content_height, content_width)} image={(height, width)}"
                )
            content_rows = (content_height + patch_size - 1) // patch_size
            content_cols = (content_width + patch_size - 1) // patch_size
            if min(content_rows, content_cols) == 1:
                # Match training's safe area-preserving path for augmentation
                # crops whose visible content spans only one patch in an axis.
                page_positions = torch_module.nn.functional.adaptive_avg_pool2d(
                    positional_grid.float(), (content_rows, content_cols)
                )
            else:
                page_positions = torch_module.nn.functional.interpolate(
                    positional_grid.float(),
                    size=(content_rows, content_cols),
                    mode="bilinear",
                    align_corners=False,
                    antialias=True,
                )
            row_starts = (
                torch_module.arange(rows, device=page.device, dtype=torch_module.float32)
                * patch_size
            )
            col_starts = (
                torch_module.arange(cols, device=page.device, dtype=torch_module.float32)
                * patch_size
            )
            row_extents = (content_height - row_starts).clamp(
                min=0.0, max=float(patch_size)
            )
            col_extents = (content_width - col_starts).clamp(
                min=0.0, max=float(patch_size)
            )
            normalized_y = (
                row_starts + 0.5 * row_extents
            ).clamp(max=float(content_height)) / float(content_height)
            normalized_x = (
                col_starts + 0.5 * col_extents
            ).clamp(max=float(content_width)) / float(content_width)
            grid_y, grid_x = torch_module.meshgrid(
                normalized_y, normalized_x, indexing="ij"
            )
            sampling_grid = torch_module.stack(
                (2.0 * grid_x - 1.0, 2.0 * grid_y - 1.0), dim=-1
            )
            page_positions = torch_module.nn.functional.grid_sample(
                page_positions,
                sampling_grid.unsqueeze(0),
                mode="bilinear",
                padding_mode="border",
                align_corners=False,
            ).to(dtype=page.dtype)
        else:
            page_positions = torch_module.nn.functional.interpolate(
                positional_grid.float(),
                size=(rows, cols),
                mode="bilinear",
                align_corners=False,
                antialias=True,
            ).to(dtype=page.dtype)
        page_positions = page_positions.flatten(2).permute(0, 2, 1)
        positioned_pages.append(page + page_positions)
    if cursor != int(patches.shape[1]):
        raise ValueError(
            f"Normalized position split consumed {cursor} of {int(patches.shape[1])} patches"
        )
    return torch_module.cat(positioned_pages, dim=1)

