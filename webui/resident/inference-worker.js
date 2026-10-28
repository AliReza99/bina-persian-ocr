var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x2)(function(x2) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x2 + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs
var ort_webgpu_bundle_min_exports = {};
__export(ort_webgpu_bundle_min_exports, {
  InferenceSession: () => Pc,
  LoraAdapter: () => Uc,
  TRACE: () => Ya,
  TRACE_EVENT_BEGIN: () => Ye,
  TRACE_EVENT_END: () => Je,
  TRACE_FUNC_BEGIN: () => xe,
  TRACE_FUNC_END: () => Le,
  Tensor: () => Ie,
  default: () => Ip,
  env: () => K,
  registerBackend: () => st
});
var nn = Object.defineProperty;
var Oc = Object.getOwnPropertyDescriptor;
var Mc = Object.getOwnPropertyNames;
var Cc = Object.prototype.hasOwnProperty;
var on = ((a) => typeof __require < "u" ? __require : typeof Proxy < "u" ? new Proxy(a, { get: (r, s) => (typeof __require < "u" ? __require : r)[s] }) : a)(function(a) {
  if (typeof __require < "u") return __require.apply(this, arguments);
  throw Error('Dynamic require of "' + a + '" is not supported');
});
var G = (a, r, s) => () => {
  if (s) throw s[0];
  try {
    return a && (r = a(a = 0)), r;
  } catch (f2) {
    throw s = [f2], f2;
  }
};
var Mt = (a, r) => {
  for (var s in r) nn(a, s, { get: r[s], enumerable: true });
};
var Dc = (a, r, s, f2) => {
  if (r && typeof r == "object" || typeof r == "function") for (let i2 of Mc(r)) !Cc.call(a, i2) && i2 !== s && nn(a, i2, { get: () => r[i2], enumerable: !(f2 = Oc(r, i2)) || f2.enumerable });
  return a;
};
var Kt = (a) => Dc(nn({}, "__esModule", { value: true }), a);
var Ct;
var qe;
var Wa;
var st;
var Fa;
var Ga;
var $a;
var Qt = G(() => {
  "use strict";
  Ct = /* @__PURE__ */ new Map(), qe = [], Wa = /* @__PURE__ */ new WeakMap(), st = (a, r, s) => {
    if (r && typeof r.init == "function" && typeof r.createInferenceSessionHandler == "function") {
      let f2 = Ct.get(a);
      if (f2 === void 0) Ct.set(a, { backend: r, priority: s });
      else {
        if (f2.priority > s) return;
        if (f2.priority === s && f2.backend !== r) throw new Error(`cannot register backend "${a}" using priority ${s}`);
      }
      if (s >= 0) {
        let i2 = qe.indexOf(a);
        i2 !== -1 && qe.splice(i2, 1);
        for (let p = 0; p < qe.length; p++) if (Ct.get(qe[p]).priority <= s) {
          qe.splice(p, 0, a);
          return;
        }
        qe.push(a);
      }
      return;
    }
    throw new TypeError("not a valid backend");
  }, Fa = async (a) => {
    let r = Ct.get(a);
    if (!r) return "backend not found.";
    if (r.initialized) return r.backend;
    if (r.aborted) return r.error;
    {
      let s = !!r.initPromise;
      try {
        if (!s) {
          let f2 = r.backend, i2 = Wa.get(f2);
          r.initPromise = i2 ? i2.then(async () => f2.init(a), async () => f2.init(a)) : f2.init(a), Wa.set(f2, r.initPromise);
        }
        return await r.initPromise, r.initialized = true, r.backend;
      } catch (f2) {
        return s || (r.error = `${f2}`, r.aborted = true), r.error;
      } finally {
        delete r.initPromise;
      }
    }
  }, Ga = async (a) => {
    let r = a.executionProviders || [], s = r.map((b) => typeof b == "string" ? b : b.name), f2 = s.length === 0 ? qe : s, i2, p = [], g = /* @__PURE__ */ new Set();
    for (let b of f2) {
      let v = await Fa(b);
      typeof v == "string" ? p.push({ name: b, err: v }) : (i2 || (i2 = v), i2 === v && g.add(b));
    }
    if (!i2) throw new Error(`no available backend found. ERR: ${p.map((b) => `[${b.name}] ${b.err}`).join(", ")}`);
    for (let { name: b, err: v } of p) s.includes(b) && console.warn(`removing requested execution provider "${b}" from session options because it is not available: ${v}`);
    let d = r.filter((b) => g.has(typeof b == "string" ? b : b.name));
    return [i2, new Proxy(a, { get: (b, v) => v === "executionProviders" ? d : Reflect.get(b, v) })];
  }, $a = async () => {
    let a = [];
    for (let s of qe) {
      if (typeof Ct.get(s).backend.createLoraAdapterHandler != "function") continue;
      let f2 = await Fa(s);
      if (typeof f2 != "string") return f2;
      a.push({ name: s, err: f2 });
    }
    let r = a.length === 0 ? "" : ` ERR: ${a.map((s) => `[${s.name}] ${s.err}`).join(", ")}`;
    throw new Error(`no available backend supports LoRA adapters.${r}`);
  };
});
var za = G(() => {
  "use strict";
  Qt();
});
var Va;
var ja = G(() => {
  "use strict";
  Va = "1.31.1";
});
var Ha;
var oe;
var an = G(() => {
  "use strict";
  ja();
  Ha = "warning", oe = { wasm: {}, webgl: {}, webgpu: {}, versions: { common: Va }, set logLevel(a) {
    if (a !== void 0) {
      if (typeof a != "string" || ["verbose", "info", "warning", "error", "fatal"].indexOf(a) === -1) throw new Error(`Unsupported logging level: ${a}`);
      Ha = a;
    }
  }, get logLevel() {
    return Ha;
  } };
  Object.defineProperty(oe, "logLevel", { enumerable: true });
});
var K;
var qa = G(() => {
  "use strict";
  an();
  K = oe;
});
var Ya;
var Ja;
var xe;
var Le;
var Ye;
var Je;
var er = G(() => {
  "use strict";
  an();
  Ya = (a, r) => {
    (typeof oe.trace > "u" ? !oe.wasm.trace : !oe.trace) || console.timeStamp(`${a}::ORT::${r}`);
  }, Ja = (a, r) => {
    let s = new Error().stack?.split(/\r\n|\r|\n/g) || [], f2 = false;
    for (let i2 = 0; i2 < s.length; i2++) {
      if (f2 && !s[i2].includes("TRACE_FUNC")) {
        let p = `FUNC_${a}::${s[i2].trim().split(" ")[1]}`;
        r && (p += `::${r}`), Ya("CPU", p);
        return;
      }
      s[i2].includes("TRACE_FUNC") && (f2 = true);
    }
  }, xe = (a) => {
    (typeof oe.trace > "u" ? !oe.wasm.trace : !oe.trace) || Ja("BEGIN", a);
  }, Le = (a) => {
    (typeof oe.trace > "u" ? !oe.wasm.trace : !oe.trace) || Ja("END", a);
  }, Ye = (a) => {
    (typeof oe.trace > "u" ? !oe.wasm.trace : !oe.trace) || console.time(`ORT::${a}`);
  }, Je = (a) => {
    (typeof oe.trace > "u" ? !oe.wasm.trace : !oe.trace) || console.timeEnd(`ORT::${a}`);
  };
});
var wt;
var sn = G(() => {
  "use strict";
  Qt();
  er();
  wt = class a {
    constructor(r, s) {
      this.backend = r, this.handler = s;
    }
    static async create(r) {
      if (xe(), typeof r != "string" && !(r instanceof Uint8Array)) throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
      let s = await $a(), f2 = await s.createLoraAdapterHandler(r);
      return Le(), new a(s, f2);
    }
    async release() {
      return this.handler.dispose();
    }
  };
});
var Xa;
var Za;
var Ka = G(() => {
  "use strict";
  Xa = (a, r) => {
    let s = typeof document < "u" ? document.createElement("canvas") : new OffscreenCanvas(1, 1);
    s.width = a.dims[3], s.height = a.dims[2];
    let f2 = s.getContext("2d");
    if (f2 != null) {
      let i2, p;
      r?.tensorLayout !== void 0 && r.tensorLayout === "NHWC" ? (i2 = a.dims[2], p = a.dims[3]) : (i2 = a.dims[3], p = a.dims[2]);
      let g = r?.format !== void 0 ? r.format : "RGB", d = r?.norm, b, v;
      d === void 0 || d.mean === void 0 ? b = [255, 255, 255, 255] : typeof d.mean == "number" ? b = [d.mean, d.mean, d.mean, d.mean] : (b = [d.mean[0], d.mean[1], d.mean[2], 0], d.mean[3] !== void 0 && (b[3] = d.mean[3])), d === void 0 || d.bias === void 0 ? v = [0, 0, 0, 0] : typeof d.bias == "number" ? v = [d.bias, d.bias, d.bias, d.bias] : (v = [d.bias[0], d.bias[1], d.bias[2], 0], d.bias[3] !== void 0 && (v[3] = d.bias[3]));
      let T = p * i2, S = 0, E = T, x2 = T * 2, L = -1;
      g === "RGBA" ? (S = 0, E = T, x2 = T * 2, L = T * 3) : g === "RGB" ? (S = 0, E = T, x2 = T * 2) : g === "RBG" && (S = 0, x2 = T, E = T * 2);
      for (let D = 0; D < p; D++) for (let H = 0; H < i2; H++) {
        let B = (a.data[S++] - v[0]) * b[0], O = (a.data[E++] - v[1]) * b[1], Y = (a.data[x2++] - v[2]) * b[2], R = L === -1 ? 255 : (a.data[L++] - v[3]) * b[3];
        f2.fillStyle = "rgba(" + B + "," + O + "," + Y + "," + R + ")", f2.fillRect(H, D, 1, 1);
      }
      if ("toDataURL" in s) return s.toDataURL();
      throw new Error("toDataURL is not supported");
    } else throw new Error("Can not access image data");
  }, Za = (a, r) => {
    let s = typeof document < "u" ? document.createElement("canvas").getContext("2d") : new OffscreenCanvas(1, 1).getContext("2d"), f2;
    if (s != null) {
      let i2, p, g;
      r?.tensorLayout !== void 0 && r.tensorLayout === "NHWC" ? (i2 = a.dims[2], p = a.dims[1], g = a.dims[3]) : (i2 = a.dims[3], p = a.dims[2], g = a.dims[1]);
      let d = r !== void 0 && r.format !== void 0 ? r.format : "RGB", b = r?.norm, v, T;
      b === void 0 || b.mean === void 0 ? v = [255, 255, 255, 255] : typeof b.mean == "number" ? v = [b.mean, b.mean, b.mean, b.mean] : (v = [b.mean[0], b.mean[1], b.mean[2], 255], b.mean[3] !== void 0 && (v[3] = b.mean[3])), b === void 0 || b.bias === void 0 ? T = [0, 0, 0, 0] : typeof b.bias == "number" ? T = [b.bias, b.bias, b.bias, b.bias] : (T = [b.bias[0], b.bias[1], b.bias[2], 0], b.bias[3] !== void 0 && (T[3] = b.bias[3]));
      let S = p * i2;
      if (r !== void 0 && (r.format !== void 0 && g === 4 && r.format !== "RGBA" || g === 3 && r.format !== "RGB" && r.format !== "BGR")) throw new Error("Tensor format doesn't match input tensor dims");
      let E = 4, x2 = 0, L = 1, D = 2, H = 3, B = 0, O = S, Y = S * 2, R = -1;
      d === "RGBA" ? (B = 0, O = S, Y = S * 2, R = S * 3) : d === "RGB" ? (B = 0, O = S, Y = S * 2) : d === "RBG" && (B = 0, Y = S, O = S * 2), f2 = s.createImageData(i2, p);
      for (let V = 0; V < p * i2; x2 += E, L += E, D += E, H += E, V++) f2.data[x2] = (a.data[B++] - T[0]) * v[0], f2.data[L] = (a.data[O++] - T[1]) * v[1], f2.data[D] = (a.data[Y++] - T[2]) * v[2], f2.data[H] = R === -1 ? 255 : (a.data[R++] - T[3]) * v[3];
    } else throw new Error("Can not access image data");
    return f2;
  };
});
var un;
var Qa;
var es;
var ts;
var rs;
var ns;
var os = G(() => {
  "use strict";
  tr();
  un = (a, r) => {
    if (a === void 0) throw new Error("Image buffer must be defined");
    if (r.height === void 0 || r.width === void 0) throw new Error("Image height and width must be defined");
    if (r.tensorLayout === "NHWC") throw new Error("NHWC Tensor layout is not supported yet");
    let { height: s, width: f2 } = r, i2 = r.norm ?? { mean: 255, bias: 0 }, p, g;
    typeof i2.mean == "number" ? p = [i2.mean, i2.mean, i2.mean, i2.mean] : p = [i2.mean[0], i2.mean[1], i2.mean[2], i2.mean[3] ?? 255], typeof i2.bias == "number" ? g = [i2.bias, i2.bias, i2.bias, i2.bias] : g = [i2.bias[0], i2.bias[1], i2.bias[2], i2.bias[3] ?? 0];
    let d = r.format !== void 0 ? r.format : "RGBA", b = r.tensorFormat !== void 0 && r.tensorFormat !== void 0 ? r.tensorFormat : "RGB", v = s * f2, T = b === "RGBA" ? new Float32Array(v * 4) : new Float32Array(v * 3), S = 4, E = 0, x2 = 1, L = 2, D = 3, H = 0, B = v, O = v * 2, Y = -1;
    d === "RGB" && (S = 3, E = 0, x2 = 1, L = 2, D = -1), b === "RGBA" ? Y = v * 3 : b === "RBG" ? (H = 0, O = v, B = v * 2) : b === "BGR" && (O = 0, B = v, H = v * 2);
    for (let V = 0; V < v; V++, E += S, L += S, x2 += S, D += S) T[H++] = (a[E] + g[0]) / p[0], T[B++] = (a[x2] + g[1]) / p[1], T[O++] = (a[L] + g[2]) / p[2], Y !== -1 && D !== -1 && (T[Y++] = (a[D] + g[3]) / p[3]);
    return b === "RGBA" ? new ie("float32", T, [1, 4, s, f2]) : new ie("float32", T, [1, 3, s, f2]);
  }, Qa = async (a, r) => {
    let s = typeof HTMLImageElement < "u" && a instanceof HTMLImageElement, f2 = typeof ImageData < "u" && a instanceof ImageData, i2 = typeof ImageBitmap < "u" && a instanceof ImageBitmap, p = typeof a == "string", g, d = r ?? {}, b = () => {
      if (typeof document < "u") return document.createElement("canvas");
      if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(1, 1);
      throw new Error("Canvas is not supported");
    }, v = (T) => typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement || T instanceof OffscreenCanvas ? T.getContext("2d") : null;
    if (s) {
      let T = b();
      T.width = a.width, T.height = a.height;
      let S = v(T);
      if (S != null) {
        let E = a.height, x2 = a.width;
        if (r !== void 0 && r.resizedHeight !== void 0 && r.resizedWidth !== void 0 && (E = r.resizedHeight, x2 = r.resizedWidth), r !== void 0) {
          if (d = r, r.tensorFormat !== void 0) throw new Error("Image input config format must be RGBA for HTMLImageElement");
          d.tensorFormat = "RGBA", d.height = E, d.width = x2;
        } else d.tensorFormat = "RGBA", d.height = E, d.width = x2;
        S.drawImage(a, 0, 0), g = S.getImageData(0, 0, x2, E).data;
      } else throw new Error("Can not access image data");
    } else if (f2) {
      let T, S;
      if (r !== void 0 && r.resizedWidth !== void 0 && r.resizedHeight !== void 0 ? (T = r.resizedHeight, S = r.resizedWidth) : (T = a.height, S = a.width), r !== void 0 && (d = r), d.format = "RGBA", d.height = T, d.width = S, r !== void 0) {
        let E = b();
        E.width = S, E.height = T;
        let x2 = v(E);
        if (x2 != null) x2.putImageData(a, 0, 0), g = x2.getImageData(0, 0, S, T).data;
        else throw new Error("Can not access image data");
      } else g = a.data;
    } else if (i2) {
      if (r === void 0) throw new Error("Please provide image config with format for Imagebitmap");
      let T = b();
      T.width = a.width, T.height = a.height;
      let S = v(T);
      if (S != null) {
        let E = a.height, x2 = a.width;
        return S.drawImage(a, 0, 0, x2, E), g = S.getImageData(0, 0, x2, E).data, d.height = E, d.width = x2, un(g, d);
      } else throw new Error("Can not access image data");
    } else {
      if (p) return new Promise((T, S) => {
        let E = b(), x2 = v(E);
        if (!a || !x2) return S();
        let L = new Image();
        L.crossOrigin = "Anonymous", L.src = a, L.onload = () => {
          E.width = L.width, E.height = L.height, x2.drawImage(L, 0, 0, E.width, E.height);
          let D = x2.getImageData(0, 0, E.width, E.height);
          d.height = E.height, d.width = E.width, T(un(D.data, d));
        };
      });
      throw new Error("Input data provided is not supported - aborted tensor creation");
    }
    if (g !== void 0) return un(g, d);
    throw new Error("Input data provided is not supported - aborted tensor creation");
  }, es = (a, r) => {
    let { width: s, height: f2, download: i2, dispose: p } = r, g = [1, f2, s, 4];
    return new ie({ location: "texture", type: "float32", texture: a, dims: g, download: i2, dispose: p });
  }, ts = (a, r) => {
    let { dataType: s, dims: f2, download: i2, dispose: p } = r;
    return new ie({ location: "gpu-buffer", type: s ?? "float32", gpuBuffer: a, dims: f2, download: i2, dispose: p });
  }, rs = (a, r) => {
    let { dataType: s, dims: f2, download: i2, dispose: p } = r;
    return new ie({ location: "ml-tensor", type: s ?? "float32", mlTensor: a, dims: f2, download: i2, dispose: p });
  }, ns = (a, r, s) => new ie({ location: "cpu-pinned", type: a, data: r, dims: s ?? [r.length] });
});
var it;
var Dt;
var as;
var ss;
var is = G(() => {
  "use strict";
  it = /* @__PURE__ */ new Map([["float32", Float32Array], ["uint8", Uint8Array], ["int8", Int8Array], ["uint16", Uint16Array], ["int16", Int16Array], ["int32", Int32Array], ["bool", Uint8Array], ["float64", Float64Array], ["uint32", Uint32Array], ["int4", Uint8Array], ["uint4", Uint8Array]]), Dt = /* @__PURE__ */ new Map([[Float32Array, "float32"], [Uint8Array, "uint8"], [Int8Array, "int8"], [Uint16Array, "uint16"], [Int16Array, "int16"], [Int32Array, "int32"], [Float64Array, "float64"], [Uint32Array, "uint32"]]), as = false, ss = () => {
    if (!as) {
      as = true;
      let a = typeof BigInt64Array < "u" && BigInt64Array.from, r = typeof BigUint64Array < "u" && BigUint64Array.from, s = globalThis.Float16Array, f2 = typeof s < "u" && s.from;
      a && (it.set("int64", BigInt64Array), Dt.set(BigInt64Array, "int64")), r && (it.set("uint64", BigUint64Array), Dt.set(BigUint64Array, "uint64")), f2 ? (it.set("float16", s), Dt.set(s, "float16")) : it.set("float16", Uint16Array);
    }
  };
});
var us;
var fs;
var cs = G(() => {
  "use strict";
  tr();
  us = (a) => {
    let r = 1;
    for (let s = 0; s < a.length; s++) {
      let f2 = a[s];
      if (typeof f2 != "number" || !Number.isSafeInteger(f2)) throw new TypeError(`dims[${s}] must be an integer, got: ${f2}`);
      if (f2 < 0) throw new RangeError(`dims[${s}] must be a non-negative integer, got: ${f2}`);
      r *= f2;
    }
    return r;
  }, fs = (a, r) => {
    switch (a.location) {
      case "cpu":
        return new ie(a.type, a.data, r);
      case "cpu-pinned":
        return new ie({ location: "cpu-pinned", data: a.data, type: a.type, dims: r });
      case "texture":
        return new ie({ location: "texture", texture: a.texture, type: a.type, dims: r });
      case "gpu-buffer":
        return new ie({ location: "gpu-buffer", gpuBuffer: a.gpuBuffer, type: a.type, dims: r });
      case "ml-tensor":
        return new ie({ location: "ml-tensor", mlTensor: a.mlTensor, type: a.type, dims: r });
      default:
        throw new Error(`tensorReshape: tensor location ${a.location} is not supported`);
    }
  };
});
var ie;
var tr = G(() => {
  "use strict";
  Ka();
  os();
  is();
  cs();
  ie = class {
    constructor(r, s, f2) {
      ss();
      let i2, p;
      if (typeof r == "object" && "location" in r) switch (this.dataLocation = r.location, i2 = r.type, p = r.dims, r.location) {
        case "cpu-pinned": {
          let d = it.get(i2);
          if (!d) throw new TypeError(`unsupported type "${i2}" to create tensor from pinned buffer`);
          if (!(r.data instanceof d)) throw new TypeError(`buffer should be of type ${d.name}`);
          this.cpuData = r.data;
          break;
        }
        case "texture": {
          if (i2 !== "float32") throw new TypeError(`unsupported type "${i2}" to create tensor from texture`);
          this.gpuTextureData = r.texture, this.downloader = r.download, this.disposer = r.dispose;
          break;
        }
        case "gpu-buffer": {
          if (i2 !== "float32" && i2 !== "float16" && i2 !== "int32" && i2 !== "int64" && i2 !== "uint32" && i2 !== "uint8" && i2 !== "bool" && i2 !== "uint4" && i2 !== "int4") throw new TypeError(`unsupported type "${i2}" to create tensor from gpu buffer`);
          this.gpuBufferData = r.gpuBuffer, this.downloader = r.download, this.disposer = r.dispose;
          break;
        }
        case "ml-tensor": {
          if (i2 !== "float32" && i2 !== "float16" && i2 !== "int32" && i2 !== "int64" && i2 !== "uint32" && i2 !== "uint64" && i2 !== "int8" && i2 !== "uint8" && i2 !== "bool" && i2 !== "uint4" && i2 !== "int4") throw new TypeError(`unsupported type "${i2}" to create tensor from MLTensor`);
          this.mlTensorData = r.mlTensor, this.downloader = r.download, this.disposer = r.dispose;
          break;
        }
        default:
          throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`);
      }
      else {
        let d, b;
        if (typeof r == "string") if (i2 = r, b = f2, r === "string") {
          if (!Array.isArray(s)) throw new TypeError("A string tensor's data must be a string array.");
          d = s;
        } else {
          let v = it.get(r);
          if (v === void 0) throw new TypeError(`Unsupported tensor type: ${r}.`);
          if (Array.isArray(s)) {
            if (r === "float16" && v === Uint16Array || r === "uint4" || r === "int4") throw new TypeError(`Creating a ${r} tensor from number array is not supported. Please use ${v.name} as data.`);
            r === "uint64" || r === "int64" ? d = v.from(s, BigInt) : d = v.from(s);
          } else if (s instanceof v) d = s;
          else if (s instanceof Uint8ClampedArray) if (r === "uint8") d = Uint8Array.from(s);
          else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");
          else if (r === "float16" && s instanceof Uint16Array && v !== Uint16Array) d = new globalThis.Float16Array(s.buffer, s.byteOffset, s.length);
          else throw new TypeError(`A ${i2} tensor's data must be type of ${v}`);
        }
        else if (b = s, Array.isArray(r)) {
          if (r.length === 0) throw new TypeError("Tensor type cannot be inferred from an empty array.");
          let v = typeof r[0];
          if (v === "string") i2 = "string", d = r;
          else if (v === "boolean") i2 = "bool", d = Uint8Array.from(r);
          else throw new TypeError(`Invalid element type of data array: ${v}.`);
        } else if (r instanceof Uint8ClampedArray) i2 = "uint8", d = Uint8Array.from(r);
        else {
          let v = Dt.get(r.constructor);
          if (v === void 0) throw new TypeError(`Unsupported type for tensor data: ${r.constructor}.`);
          i2 = v, d = r;
        }
        if (b === void 0) b = [d.length];
        else if (!Array.isArray(b)) throw new TypeError("A tensor's dims must be a number array");
        p = b, this.cpuData = d, this.dataLocation = "cpu";
      }
      let g = us(p);
      if (this.cpuData && g !== this.cpuData.length && !((i2 === "uint4" || i2 === "int4") && Math.ceil(g / 2) === this.cpuData.length)) throw new Error(`Tensor's size(${g}) does not match data length(${this.cpuData.length}).`);
      this.type = i2, this.dims = p, this.size = g;
    }
    static async fromImage(r, s) {
      return Qa(r, s);
    }
    static fromTexture(r, s) {
      return es(r, s);
    }
    static fromGpuBuffer(r, s) {
      return ts(r, s);
    }
    static fromMLTensor(r, s) {
      return rs(r, s);
    }
    static fromPinnedBuffer(r, s, f2) {
      return ns(r, s, f2);
    }
    toDataURL(r) {
      return Xa(this, r);
    }
    toImageData(r) {
      return Za(this, r);
    }
    get data() {
      if (this.ensureValid(), !this.cpuData) throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");
      return this.cpuData;
    }
    get location() {
      return this.dataLocation;
    }
    get texture() {
      if (this.ensureValid(), !this.gpuTextureData) throw new Error("The data is not stored as a WebGL texture.");
      return this.gpuTextureData;
    }
    get gpuBuffer() {
      if (this.ensureValid(), !this.gpuBufferData) throw new Error("The data is not stored as a WebGPU buffer.");
      return this.gpuBufferData;
    }
    get mlTensor() {
      if (this.ensureValid(), !this.mlTensorData) throw new Error("The data is not stored as a WebNN MLTensor.");
      return this.mlTensorData;
    }
    async getData(r) {
      switch (this.ensureValid(), this.dataLocation) {
        case "cpu":
        case "cpu-pinned":
          return this.data;
        case "texture":
        case "gpu-buffer":
        case "ml-tensor": {
          if (!this.downloader) throw new Error("The current tensor is not created with a specified data downloader.");
          if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
          try {
            this.isDownloading = true;
            let s = await this.downloader();
            return this.downloader = void 0, this.dataLocation = "cpu", this.cpuData = s, r && this.disposer && (this.disposer(), this.disposer = void 0), s;
          } finally {
            this.isDownloading = false;
          }
        }
        default:
          throw new Error(`cannot get data from location: ${this.dataLocation}`);
      }
    }
    dispose() {
      if (this.isDownloading) throw new Error("The current tensor is being downloaded.");
      this.disposer && (this.disposer(), this.disposer = void 0), this.cpuData = void 0, this.gpuTextureData = void 0, this.gpuBufferData = void 0, this.mlTensorData = void 0, this.downloader = void 0, this.isDownloading = void 0, this.dataLocation = "none";
    }
    ensureValid() {
      if (this.dataLocation === "none") throw new Error("The tensor is disposed.");
    }
    reshape(r) {
      if (this.ensureValid(), this.downloader || this.disposer) throw new Error("Cannot reshape a tensor that owns GPU resource.");
      return fs(this, r);
    }
  };
});
var Ie;
var fn = G(() => {
  "use strict";
  tr();
  Ie = ie;
});
var rr;
var ds = G(() => {
  "use strict";
  Qt();
  sn();
  fn();
  er();
  rr = class a {
    constructor(r, s) {
      this.handler = r, this.backend = s;
    }
    async run(r, s, f2) {
      xe(), Ye("InferenceSession.run");
      let i2 = {}, p = {};
      if (typeof r != "object" || r === null || r instanceof Ie || Array.isArray(r)) throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");
      let g = true;
      if (typeof s == "object") {
        if (s === null) throw new TypeError("Unexpected argument[1]: cannot be null.");
        if (s instanceof Ie) throw new TypeError("'fetches' cannot be a Tensor");
        if (Array.isArray(s)) {
          if (s.length === 0) throw new TypeError("'fetches' cannot be an empty array.");
          g = false;
          for (let T of s) {
            if (typeof T != "string") throw new TypeError("'fetches' must be a string array or an object.");
            if (this.outputNames.indexOf(T) === -1) throw new RangeError(`'fetches' contains invalid output name: ${T}.`);
            i2[T] = null;
          }
          if (typeof f2 == "object" && f2 !== null) p = f2;
          else if (typeof f2 < "u") throw new TypeError("'options' must be an object.");
        } else {
          let T = false, S = Object.getOwnPropertyNames(s);
          for (let E of this.outputNames) if (S.indexOf(E) !== -1) {
            let x2 = s[E];
            (x2 === null || x2 instanceof Ie) && (T = true, g = false, i2[E] = x2);
          }
          if (T) {
            if (typeof f2 == "object" && f2 !== null) p = f2;
            else if (typeof f2 < "u") throw new TypeError("'options' must be an object.");
          } else p = s;
        }
      } else if (typeof s < "u") throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");
      for (let T of this.inputNames) if (typeof r[T] > "u") throw new Error(`input '${T}' is missing in 'feeds'.`);
      if (g) for (let T of this.outputNames) i2[T] = null;
      let d;
      if (p.activeLoraAdapters !== void 0) {
        if (!Array.isArray(p.activeLoraAdapters)) throw new TypeError("'activeLoraAdapters' must be an array.");
        d = p.activeLoraAdapters.map((T) => {
          if (!(T instanceof wt)) throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");
          if (T.backend !== this.backend) throw new Error("LoRA adapter was created by a different backend than the session.");
          return T.handler;
        });
      }
      let b = await this.handler.run(r, i2, p, d), v = {};
      for (let T in b) if (Object.hasOwnProperty.call(b, T)) {
        let S = b[T];
        S instanceof Ie ? v[T] = S : v[T] = new Ie(S.type, S.data, S.dims);
      }
      return Je("InferenceSession.run"), Le(), v;
    }
    async release() {
      return this.handler.dispose();
    }
    static async create(r, s, f2, i2) {
      xe(), Ye("InferenceSession.create");
      let p, g = {};
      if (typeof r == "string") {
        if (p = r, typeof s == "object" && s !== null) g = s;
        else if (typeof s < "u") throw new TypeError("'options' must be an object.");
      } else if (r instanceof Uint8Array) {
        if (p = r, typeof s == "object" && s !== null) g = s;
        else if (typeof s < "u") throw new TypeError("'options' must be an object.");
      } else if (r instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && r instanceof SharedArrayBuffer) {
        let T = r, S = 0, E = r.byteLength;
        if (typeof s == "object" && s !== null) g = s;
        else if (typeof s == "number") {
          if (S = s, !Number.isSafeInteger(S)) throw new RangeError("'byteOffset' must be an integer.");
          if (S < 0 || S >= T.byteLength) throw new RangeError(`'byteOffset' is out of range [0, ${T.byteLength}).`);
          if (E = r.byteLength - S, typeof f2 == "number") {
            if (E = f2, !Number.isSafeInteger(E)) throw new RangeError("'byteLength' must be an integer.");
            if (E <= 0 || S + E > T.byteLength) throw new RangeError(`'byteLength' is out of range (0, ${T.byteLength - S}].`);
            if (typeof i2 == "object" && i2 !== null) g = i2;
            else if (typeof i2 < "u") throw new TypeError("'options' must be an object.");
          } else if (typeof f2 < "u") throw new TypeError("'byteLength' must be a number.");
        } else if (typeof s < "u") throw new TypeError("'options' must be an object.");
        p = new Uint8Array(T, S, E);
      } else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");
      let [d, b] = await Ga(g), v = await d.createInferenceSessionHandler(p, b);
      return Je("InferenceSession.create"), Le(), new a(v, d);
    }
    startProfiling() {
      this.handler.startProfiling();
    }
    endProfiling() {
      this.handler.endProfiling();
    }
    get inputNames() {
      return this.handler.inputNames;
    }
    get outputNames() {
      return this.handler.outputNames;
    }
    get inputMetadata() {
      return this.handler.inputMetadata;
    }
    get outputMetadata() {
      return this.handler.outputMetadata;
    }
  };
});
var Pc;
var ls = G(() => {
  "use strict";
  ds();
  Pc = rr;
});
var Uc;
var ps = G(() => {
  "use strict";
  sn();
  Uc = wt;
});
var ms = G(() => {
  "use strict";
});
var hs = G(() => {
  "use strict";
});
var bs = G(() => {
  "use strict";
});
var gs = G(() => {
  "use strict";
});
var cn = {};
Mt(cn, { InferenceSession: () => Pc, LoraAdapter: () => Uc, TRACE: () => Ya, TRACE_EVENT_BEGIN: () => Ye, TRACE_EVENT_END: () => Je, TRACE_FUNC_BEGIN: () => xe, TRACE_FUNC_END: () => Le, Tensor: () => Ie, env: () => K, registerBackend: () => st });
var We = G(() => {
  "use strict";
  za();
  qa();
  ls();
  ps();
  fn();
  ms();
  hs();
  er();
  bs();
  gs();
});
var nr = G(() => {
  "use strict";
});
var Ts = {};
Mt(Ts, { default: () => _c });
var ws;
var vs;
var _c;
var Es = G(() => {
  "use strict";
  dn();
  Xe();
  or();
  ws = "ort-wasm-proxy-worker", vs = globalThis.self?.name === ws;
  vs && (self.onmessage = (a) => {
    let { type: r, in: s } = a.data;
    try {
      switch (r) {
        case "init-wasm":
          ar(s.wasm).then(() => {
            sr(s).then(() => {
              postMessage({ type: r });
            }, (f2) => {
              postMessage({ type: r, err: f2 });
            });
          }, (f2) => {
            postMessage({ type: r, err: f2 });
          });
          break;
        case "init-ep": {
          let { epName: f2, env: i2 } = s;
          ir(i2, f2).then(() => {
            postMessage({ type: r });
          }, (p) => {
            postMessage({ type: r, err: p });
          });
          break;
        }
        case "copy-from": {
          let { buffer: f2 } = s, i2 = Pt(f2);
          postMessage({ type: r, out: i2 });
          break;
        }
        case "create": {
          let { model: f2, options: i2 } = s;
          ur(f2, i2).then((p) => {
            postMessage({ type: r, out: p });
          }, (p) => {
            postMessage({ type: r, err: p });
          });
          break;
        }
        case "release":
          fr(s), postMessage({ type: r });
          break;
        case "run": {
          let { sessionId: f2, inputIndices: i2, inputs: p, outputIndices: g, options: d } = s;
          cr(f2, i2, p, g, new Array(g.length).fill(null), d).then((b) => {
            b.some((v) => v[3] !== "cpu") ? postMessage({ type: r, err: "Proxy does not support non-cpu tensor location." }) : postMessage({ type: r, out: b }, lr([...p, ...b]));
          }, (b) => {
            postMessage({ type: r, err: b });
          });
          break;
        }
        case "end-profiling":
          dr(s), postMessage({ type: r });
          break;
        default:
      }
    } catch (f2) {
      postMessage({ type: r, err: f2 });
    }
  });
  _c = vs ? null : (a) => new Worker(a ?? ge, { type: "module", name: ws });
});
var As = {};
Mt(As, { default: () => Rc });
async function Ss(a = {}) {
  var r = a, s = !!globalThis.window, f2 = !!globalThis.WorkerGlobalScope, i2 = f2 && self.name?.startsWith("em-pthread");
  r.mountExternalData = (e, t) => {
    e.startsWith("./") && (e = e.substring(2)), (r.md || (r.md = /* @__PURE__ */ new Map())).set(e, t);
  }, r.unmountExternalData = () => {
    delete r.md, delete r.af, delete r.$e, delete r.bf;
  }, globalThis.SharedArrayBuffer ?? new WebAssembly.Memory({ initial: 0, maximum: 0, shared: true }).buffer.constructor;
  let p = () => {
    let e = (t) => (...n) => {
      let o = Me;
      return n = t(...n), Me != o ? new Promise((u, c) => {
        Wr = { resolve: u, reject: c };
      }) : n;
    };
    ((t) => {
      for (let n of t) r[n] = e(r[n]);
    })("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBindInput".split(" ")), typeof jsepRunAsync < "u" && (r._OrtRun = jsepRunAsync(r._OrtRun), r._OrtRunWithBinding = jsepRunAsync(r._OrtRunWithBinding)), p = void 0;
  };
  r.asyncInit = () => {
    p?.();
  };
  var g, d, b = (e, t) => {
    throw t;
  }, v = import.meta.url, T = "";
  if (s || f2) {
    try {
      T = new URL(".", v).href;
    } catch {
    }
    f2 && (d = (e) => {
      var t = new XMLHttpRequest();
      return t.open("GET", e, false), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
    }), g = async (e) => {
      if (J(e)) return new Promise((n, o) => {
        var u = new XMLHttpRequest();
        u.open("GET", e, true), u.responseType = "arraybuffer", u.onload = () => {
          u.status == 200 || u.status == 0 && u.response ? n(u.response) : o(u.status);
        }, u.onerror = o, u.send(null);
      });
      var t = await fetch(e, { credentials: "same-origin" });
      if (t.ok) return t.arrayBuffer();
      throw Error(t.status + " : " + t.url);
    };
  }
  var S, E, x2, L, D, H, B = console.log.bind(console), O = console.error.bind(console), Y = B, R = O, V = false, J = (e) => e.startsWith("file://");
  function l() {
    je.buffer != ee.buffer && de();
  }
  if (i2) {
    let e = function(t) {
      try {
        var n = t.data, o = n.gd;
        if (o === "load") {
          let u = [];
          self.onmessage = (c) => u.push(c), H = () => {
            postMessage({ gd: "loaded" });
            for (let c of u) e(c);
            self.onmessage = e;
          };
          for (let c of n.Ce) r[c] && !r[c].proxy || (r[c] = (...h) => {
            postMessage({ gd: "callHandler", Be: c, args: h });
          }, c == "print" && (Y = r[c]), c == "printErr" && (R = r[c]));
          je = n.Ue, de(), E = n.Ve, pt(), Zt();
        } else if (o === "run") {
          (function(u) {
            var c = (l(), w)[u + 52 >>> 2 >>> 0];
            u = (l(), w)[u + 56 >>> 2 >>> 0], Ho(c, c - u), U(c);
          })(n.cd), Zr(n.cd, 0, 0, 1, 0, 0), xn(), Rr(n.cd), Q || (Io(), Q = true);
          try {
            gi(n.He, n.rd);
          } catch (u) {
            if (u != "unwind") throw u;
          }
        } else n.target !== "setimmediate" && (o === "checkMailbox" ? Q && Gt() : o && (R(`worker: received unknown command ${o}`), R(n)));
      } catch (u) {
        throw Go(), u;
      }
    };
    var dd = e, Q = false;
    self.onunhandledrejection = (t) => {
      throw t.reason || t;
    }, self.onmessage = e;
  }
  var ee, te, De, Be, M, w, ne, Ee, P, ce, Ke, X = false;
  function de() {
    var e = je.buffer;
    r.HEAP8 = ee = new Int8Array(e), De = new Int16Array(e), r.HEAPU8 = te = new Uint8Array(e), Be = new Uint16Array(e), r.HEAP32 = M = new Int32Array(e), r.HEAPU32 = w = new Uint32Array(e), ne = new Float32Array(e), Ee = new Float64Array(e), P = new BigInt64Array(e), ce = new BigUint64Array(e);
  }
  function re() {
    X = true, i2 ? H() : ke.ic();
  }
  function Z(e) {
    throw R(e = "Aborted(" + e + ")"), V = true, e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info."), D?.(e), e;
  }
  function Or() {
    return { a: { qa: $f, f: yi, E: wi, j: vi, p: Ti, l: Ei, fa: Si, b: Ai, da: xi, hc: Cn, r: Li, ea: _n, Wa: Rn, dc: Nn, fc: kn, Xa: Wn, Ua: Fn, Na: Gn, Ta: $n, oa: zn, ec: Vn, bc: jn, Va: Hn, cc: qn, ab: Ii, Da: Oi, Yb: Mi, Wb: Di, Ca: Ui, O: _i, K: Ri, Xb: Ni, ka: Vi, Zb: ji, Qa: Hi, $b: Yi, Ga: Ji, Ub: Xi, Ea: Zi, Pa: Rr, Za: Ki, V: ru, n: iu, c: Ur, sb: uu, w: fu, N: cu, B: du, k: lu, o: to, tb: pu, J: mu, T: hu, g: bu, u: gu, m: yu, i: wu, Ka: vu, La: Tu, Ma: Eu, Ia: ao, Ja: so, Vb: io, cb: Au, $a: Iu, U: Bu, rb: Ou, Fa: Mu, _a: xu, Z: Cu, Ya: Du, ac: Pu, I: Su, fb: Uu, $: _u, pa: Ht, _b: Nu, eb: Ru, db: ku, nb: Zu, A: Ku, sa: Qu, ra: ef, pb: tf, _: rf, v: nf, mb: of, lb: af, kb: sf, ob: uf, ib: ff, hb: cf, gb: df, Ra: wo, Sa: vo, gc: Qe, Y: To, Ha: Eo, ma: So, Oa: Ao, la: xo, Hb: Ic, va: Tc, Ib: Lc, wa: vc, H: ic, e: Hf, s: Vf, x: zf, D: nc, Kb: gc, W: bc, z: Xf, xa: yc, ba: Ec, ha: hc, Lb: mc, Ba: Yf, za: fc, Nb: dc, ya: pc, Ob: cc, ua: xc, ca: wc, d: jf, C: Jf, q: qf, Gb: Bc, t: Kf, y: ac, F: Zf, G: Qf, L: sc, Pb: uc, R: Sc, ia: rc, aa: Ac, Rb: tc, Aa: ec2, Mb: lc, Qb: oc, h: pf, a: je, bb: ye, Jb: mf, X: hf, M: bf, na: gf, Fb: yf, ja: wf, S: vf, Cb: Tf, Db: Ef, xb: Sf, yb: Af, P: xf, zb: Lf, Ab: If, ta: Bf, Tb: Of, qb: Mf, Q: Cf, jb: Df, Eb: Pf, ub: Uf, vb: Rf, wb: Nf, ga: kf, Bb: Wf, Sb: Ff } };
  }
  async function pt() {
    function e(o, u) {
      var c = ke = o.exports;
      o = {};
      for (let [h, m] of Object.entries(c)) typeof m == "function" ? (c = Qi(m), o[h] = c) : o[h] = m;
      return ke = o, ke = (function() {
        var h = ke, m = (A) => (F) => A(F) >>> 0, y = (A) => () => A() >>> 0;
        return (h = Object.assign({}, h)).jc = m(h.jc), h.Uc = y(h.Uc), h.Wc = m(h.Wc), h.Id = /* @__PURE__ */ ((A) => (F, j) => A(F, j) >>> 0)(h.Id), h.Nd = m(h.Nd), h.Od = y(h.Od), h.Sd = m(h.Sd), h;
      })(), Sn.push(ke.zd), Lo = (o = ke).jc, Io = o.kc, r._OrtInit = o.lc, r._OrtGetLastError = o.mc, r._OrtCreateSessionOptions = o.nc, r._OrtAppendExecutionProvider = o.oc, r._OrtGetEpDevices = o.pc, r._OrtEpDevice_EpName = o.qc, r._OrtAppendExecutionProviderV2 = o.rc, r._OrtAddFreeDimensionOverride = o.sc, r._OrtAddSessionConfigEntry = o.tc, r._OrtReleaseSessionOptions = o.uc, r._OrtCreateSession = o.vc, r._OrtReleaseSession = o.wc, r._OrtGetInputOutputCount = o.xc, r._OrtGetInputOutputMetadata = o.yc, r._OrtFree = o.zc, r._OrtCreateTensor = o.Ac, r._OrtGetTensorData = o.Bc, r._OrtReleaseTensor = o.Cc, r._OrtCreateLoraAdapter = o.Dc, r._OrtReleaseLoraAdapter = o.Ec, r._OrtCreateRunOptions = o.Fc, r._OrtAddRunConfigEntry = o.Gc, r._OrtRunOptionsAddActiveLoraAdapter = o.Hc, r._OrtReleaseRunOptions = o.Ic, r._OrtCreateBinding = o.Jc, r._OrtBindInput = o.Kc, r._OrtBindOutput = o.Lc, r._OrtClearBoundOutputs = o.Mc, r._OrtReleaseBinding = o.Nc, r._OrtRunWithBinding = o.Oc, r._OrtRun = o.Pc, r._OrtEndProfiling = o.Qc, Bo = r._OrtCreateWebGpuInstance = o.Rc, r._wgpuCreateInstance = o.Sc, jr = r._OrtGetWebGpuDevice = o.Tc, Jt = o.Uc, ve = r._free = o.Vc, nt = r._malloc = o.Wc, Oo = r._wgpuBufferRelease = o.Xc, Mo = o.Yc, Co = o.Zc, Do = o._c, Po = o.$c, Uo = o.ad, _o = o.dd, Ro = o.ed, No = o.od, ko = o.pd, Wo = o.qd, Hr = o.sd, qr = o.td, Yr = o.ud, Jr = o.vd, Bt = o.wd, Xr = o.xd, Fo = o.yd, Zr = o.Bd, Go = o.Cd, $o = o.Dd, zo = o.Ed, Kr = o.Fd, Vo = o.Gd, jo = o.Hd, Qr = o.Id, W = o.Jd, Ot = o.Kd, Ho = o.Ld, U = o.Md, Xt = o.Nd, _ = o.Od, qo = o.Pd, en = o.Qd, Yo = o.Rd, Jo = o.Sd, Xo = o.Td, tn = o.Ud, Zo = o.Vd, Ko = o.Wd, Qo = o.Xd, ea = o.Yd, ta = o.Zd, ra = o._d, na = o.$d, oa = o.ae, aa = o.be, sa = o.ce, ia = o.de, ua = o.ee, fa = o.fe, ca = o.ge, da = o.he, la = o.ie, pa = o.je, ma = o.ke, ha = o.le, ba = o.me, ga = o.oe, ya = o.pe, wa = o.qe, va = o.re, Ta = o.se, Ea = o.te, Sa = o.ue, Aa = o.Ie, xa = o.Je, La = o.Ke, Ia = o.Le, Ba = o.Me, Oa = o.Ne, Ma = o.Oe, Ca = o.Pe, Da = o.Qe, Pa = o.Re, Ua = o.Te, _a2 = o.vf, Ra = o.wf, Na = o.xf, ka = o.yf, E = u, ke;
    }
    var t, n = Or();
    return r.instantiateWasm ? new Promise((o) => {
      r.instantiateWasm(n, (u, c) => {
        o(e(u, c));
      });
    }) : i2 ? e(new WebAssembly.Instance(E, Or()), E) : (Ke ??= r.locateFile ? r.locateFile ? r.locateFile("ort-wasm-simd-threaded.asyncify.wasm", T) : T + "ort-wasm-simd-threaded.asyncify.wasm" : new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href, t = await (async function(o) {
      var u = Ke;
      if (!S && !J(u)) try {
        var c = fetch(u, { credentials: "same-origin" });
        return await WebAssembly.instantiateStreaming(c, o);
      } catch (h) {
        R(`wasm streaming compile failed: ${h}`), R("falling back to ArrayBuffer instantiation");
      }
      return (async function(h, m) {
        try {
          var y = await (async function(A) {
            if (!S) try {
              var F = await g(A);
              return new Uint8Array(F);
            } catch {
            }
            if (A == Ke && S) A = new Uint8Array(S);
            else {
              if (!d) throw "both async and sync fetching of the wasm failed";
              A = d(A);
            }
            return A;
          })(h);
          return await WebAssembly.instantiate(y, m);
        } catch (A) {
          R(`failed to asynchronously prepare wasm: ${A}`), Z(A);
        }
      })(u, o);
    })(n), e(t.instance, t.module));
  }
  class $e {
    name = "ExitStatus";
    constructor(t) {
      this.message = `Program terminated with exit(${t})`, this.status = t;
    }
  }
  var xt = (e) => {
    e.terminate(), e.onmessage = () => {
    };
  }, kt = [], be = 0, he = null, ze = (e) => {
    Pe.length == 0 && (In(), Ln(Pe[0]));
    var t = Pe.pop();
    if (!t) return 6;
    Lt.push(t), et2[e.cd] = t, t.cd = e.cd;
    var n = { gd: "run", He: e.Ge, rd: e.rd, cd: e.cd };
    return t.postMessage(n, e.we), 0;
  }, k = 0, N = (e, t, ...n) => {
    var o, u = 16 * n.length, c = _(), h = Xt(u), m = h >>> 3;
    for (o of n) typeof o == "bigint" ? ((l(), P)[m++ >>> 0] = 1n, (l(), P)[m++ >>> 0] = o) : ((l(), P)[m++ >>> 0] = 0n, (l(), Ee)[m++ >>> 0] = o);
    return e = $o(e, 0, u, h, t), U(c), e;
  };
  function ye(e) {
    if (i2) return N(0, 1, e);
    if (x2 = e, !(0 < k)) {
      for (var t of Lt) xt(t);
      for (t of Pe) xt(t);
      Pe = [], Lt = [], et2 = {}, V = true;
    }
    b(0, new $e(e));
  }
  function Ve(e) {
    if (i2) return N(1, 0, e);
    Qe(e);
  }
  var Qe = (e) => {
    if (x2 = e, i2) throw Ve(e), "unwind";
    ye(e);
  }, Pe = [], Lt = [], Sn = [], et2 = {}, An = (e) => {
    var t = e.cd;
    delete et2[t], Pe.push(e), Lt.splice(Lt.indexOf(e), 1), e.cd = 0, zo(t);
  };
  function xn() {
    Sn.forEach((e) => e());
  }
  var Ln = (e) => new Promise((t) => {
    e.onmessage = (u) => {
      var c = u.data;
      if (u = c.gd, c.nd && c.nd != Jt()) {
        var h = et2[c.nd];
        h ? h.postMessage(c, c.we) : R(`Internal error! Worker sent a message "${u}" to target pthread ${c.nd}, but that thread no longer exists!`);
      } else u === "checkMailbox" ? Gt() : u === "spawnThread" ? ze(c) : u === "cleanupThread" ? le(() => {
        An(et2[c.Se]);
      }) : u === "loaded" ? (e.loaded = true, t(e)) : c.target === "setimmediate" ? e.postMessage(c) : u === "uncaughtException" ? e.onerror(c.error) : u === "callHandler" ? r[c.Be](...c.args) : u && R(`worker sent an unknown command ${u}`);
    }, e.onerror = (u) => {
      throw R(`worker sent an error! ${u.filename}:${u.lineno}: ${u.message}`), u;
    };
    var n, o = [];
    for (n of []) r.propertyIsEnumerable(n) && o.push(n);
    e.postMessage({ gd: "load", Ce: o, Ue: je, Ve: E });
  });
  function In() {
    var e = new Worker((() => {
      let t = URL;
      return import.meta.url > "file:" && import.meta.url < "file;" ? new t("ort.webgpu.bundle.min.mjs", import.meta.url) : new URL(import.meta.url);
    })(), { type: "module", workerData: "em-pthread", name: "em-pthread" });
    Pe.push(e);
  }
  var je, gi = (e, t) => {
    k = 0, e = tn(e, t), 0 < k ? x2 = e : Kr(e);
  }, Wt = [], Ft = 0, ae = (e) => -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
  function yi(e) {
    var t = new Mr(e >>>= 0);
    return (l(), ee)[t.hd + 12 >>> 0] == 0 && (Bn(t, true), Ft--), On(t, false), Wt.push(t), Jo(e);
  }
  var mt = 0, wi = () => {
    W(0, 0);
    var e = Wt.pop();
    qo(e.Ad), mt = 0;
  };
  function Bn(e, t) {
    t = t ? 1 : 0, (l(), ee)[e.hd + 12 >>> 0] = t;
  }
  function On(e, t) {
    t = t ? 1 : 0, (l(), ee)[e.hd + 13 >>> 0] = t;
  }
  class Mr {
    constructor(t) {
      this.Ad = t, this.hd = t - 24;
    }
  }
  var Cr = (e) => {
    var t = mt;
    if (!t) return Ot(0), 0;
    var n = new Mr(t);
    (l(), w)[n.hd + 16 >>> 2 >>> 0] = t;
    var o = (l(), w)[n.hd + 4 >>> 2 >>> 0];
    if (!o) return Ot(0), t;
    for (var u of e) {
      if (u === 0 || u === o) break;
      if (Yo(u, o, n.hd + 16)) return Ot(u), t;
    }
    return Ot(o), t;
  };
  function vi() {
    return Cr([]);
  }
  function Ti(e) {
    return Cr([e >>> 0]);
  }
  function Ei(e, t, n, o) {
    return Cr([e >>> 0, t >>> 0, n >>> 0, o >>> 0]);
  }
  var Si = () => {
    var e = Wt.pop();
    e || Z("no exception to throw");
    var t = e.Ad;
    throw (l(), ee)[e.hd + 13 >>> 0] == 0 && (Wt.push(e), On(e, true), Bn(e, false), Ft++), en(t), mt = t;
  };
  function Ai(e, t, n) {
    var o = new Mr(e >>>= 0);
    throw t >>>= 0, n >>>= 0, (l(), w)[o.hd + 16 >>> 2 >>> 0] = 0, (l(), w)[o.hd + 4 >>> 2 >>> 0] = t, (l(), w)[o.hd + 8 >>> 2 >>> 0] = n, en(e), Ft++, mt = e;
  }
  var xi = () => Ft;
  function Mn(e, t, n, o) {
    return i2 ? N(2, 1, e, t, n, o) : Cn(e, t, n, o);
  }
  function Cn(e, t, n, o) {
    if (e >>>= 0, t >>>= 0, n >>>= 0, o >>>= 0, !globalThis.SharedArrayBuffer) return 6;
    var u = [];
    return i2 && u.length === 0 ? Mn(e, t, n, o) : (e = { Ge: n, cd: e, rd: o, we: u }, i2 ? (e.gd = "spawnThread", postMessage(e, u), 0) : ze(e));
  }
  function Li(e) {
    throw mt ||= e >>> 0, mt;
  }
  var Dn = globalThis.TextDecoder && new TextDecoder(), Pn = (e, t, n, o) => {
    if (n = t + n, o) return n;
    for (; e[t] && !(t >= n); ) ++t;
    return t;
  }, Un = (e, t = 0, n, o) => {
    if (16 < (n = Pn(e, t >>>= 0, n, o)) - t && e.buffer && Dn) return Dn.decode(e.buffer instanceof ArrayBuffer ? e.subarray(t, n) : e.slice(t, n));
    for (o = ""; t < n; ) {
      var u = e[t++];
      if (128 & u) {
        var c = 63 & e[t++];
        if ((224 & u) == 192) o += String.fromCharCode((31 & u) << 6 | c);
        else {
          var h = 63 & e[t++];
          65536 > (u = (240 & u) == 224 ? (15 & u) << 12 | c << 6 | h : (7 & u) << 18 | c << 12 | h << 6 | 63 & e[t++]) ? o += String.fromCharCode(u) : (u -= 65536, o += String.fromCharCode(55296 | u >> 10, 56320 | 1023 & u));
        }
      } else o += String.fromCharCode(u);
    }
    return o;
  }, ht = (e, t, n) => (e >>>= 0) ? Un((l(), te), e, t, n) : "";
  function _n(e, t, n) {
    return i2 ? N(3, 1, e, t, n) : 0;
  }
  function Rn(e, t) {
    if (i2) return N(4, 1, e, t);
  }
  function Nn(e, t) {
    if (i2) return N(5, 1, e, t);
  }
  function kn(e, t, n) {
    if (i2) return N(6, 1, e, t, n);
  }
  function Wn(e, t, n) {
    return i2 ? N(7, 1, e, t, n) : 0;
  }
  function Fn(e, t) {
    if (i2) return N(8, 1, e, t);
  }
  function Gn(e, t, n) {
    if (i2) return N(9, 1, e, t, n);
  }
  function $n(e, t, n, o) {
    if (i2) return N(10, 1, e, t, n, o);
  }
  function zn(e, t, n, o) {
    if (i2) return N(11, 1, e, t, n, o);
  }
  function Vn(e, t, n, o) {
    if (i2) return N(12, 1, e, t, n, o);
  }
  function jn(e) {
    if (i2) return N(13, 1, e);
  }
  function Hn(e, t) {
    if (i2) return N(14, 1, e, t);
  }
  function qn(e, t, n) {
    if (i2) return N(15, 1, e, t, n);
  }
  var Ii = () => Z(""), Oe = (e) => {
    e >>>= 0;
    for (var t = ""; ; ) {
      var n = (l(), te)[e++ >>> 0];
      if (!n) return t;
      t += String.fromCharCode(n);
    }
  }, Dr = {}, Pr = {}, Bi = {}, bt = class extends Error {
    constructor(e) {
      super(e), this.name = "BindingError";
    }
  };
  function Ue(e, t, n = {}) {
    return (function(o, u, c = {}) {
      var h = u.name;
      if (!o) throw new bt(`type "${h}" must have a positive integer typeid pointer`);
      if (Pr.hasOwnProperty(o)) {
        if (c.De) return;
        throw new bt(`Cannot register type '${h}' twice`);
      }
      Pr[o] = u, delete Bi[o], Dr.hasOwnProperty(o) && (u = Dr[o], delete Dr[o], u.forEach((m) => m()));
    })(e, t, n);
  }
  var Yn = (e, t, n) => {
    switch (t) {
      case 1:
        return n ? (o) => (l(), ee)[o >>> 0] : (o) => (l(), te)[o >>> 0];
      case 2:
        return n ? (o) => (l(), De)[o >>> 1 >>> 0] : (o) => (l(), Be)[o >>> 1 >>> 0];
      case 4:
        return n ? (o) => (l(), M)[o >>> 2 >>> 0] : (o) => (l(), w)[o >>> 2 >>> 0];
      case 8:
        return n ? (o) => (l(), P)[o >>> 3 >>> 0] : (o) => (l(), ce)[o >>> 3 >>> 0];
      default:
        throw new TypeError(`invalid integer width (${t}): ${e}`);
    }
  };
  function Oi(e, t, n, o, u) {
    e >>>= 0, n >>>= 0, t = Oe(t >>> 0);
    let c = (h) => h;
    if (o = o === 0n) {
      let h = 8 * n;
      c = (m) => BigInt.asUintN(h, m), u = c(u);
    }
    Ue(e, { name: t, bd: c, kd: (h, m) => (typeof m == "number" && (m = BigInt(m)), m), jd: Yn(t, n, !o), ld: null });
  }
  function Mi(e, t, n, o) {
    Ue(e >>>= 0, { name: t = Oe(t >>> 0), bd: function(u) {
      return !!u;
    }, kd: function(u, c) {
      return c ? n : o;
    }, jd: function(u) {
      return this.bd((l(), te)[u >>> 0]);
    }, ld: null });
  }
  var Jn = [], tt = [0, 1, , 1, null, 1, true, 1, false, 1];
  function Ur(e) {
    9 < (e >>>= 0) && --tt[e + 1] === 0 && (tt[e] = void 0, Jn.push(e));
  }
  var we = (e) => {
    if (!e) throw new bt(`Cannot use deleted val. handle = ${e}`);
    return tt[e];
  }, Se = (e) => {
    switch (e) {
      case void 0:
        return 2;
      case null:
        return 4;
      case true:
        return 6;
      case false:
        return 8;
      default:
        let t = Jn.pop() || tt.length;
        return tt[t] = e, tt[t + 1] = 1, t;
    }
  };
  function _r(e) {
    return this.bd((l(), w)[e >>> 2 >>> 0]);
  }
  var Ci = { name: "emscripten::val", bd: (e) => {
    var t = we(e);
    return Ur(e), t;
  }, kd: (e, t) => Se(t), jd: _r, ld: null };
  function Di(e) {
    return Ue(e >>> 0, Ci);
  }
  var Pi = (e, t) => {
    switch (t) {
      case 4:
        return function(n) {
          return this.bd((l(), ne)[n >>> 2 >>> 0]);
        };
      case 8:
        return function(n) {
          return this.bd((l(), Ee)[n >>> 3 >>> 0]);
        };
      default:
        throw new TypeError(`invalid float width (${t}): ${e}`);
    }
  };
  function Ui(e, t, n) {
    n >>>= 0, Ue(e >>>= 0, { name: t = Oe(t >>> 0), bd: (o) => o, kd: (o, u) => u, jd: Pi(t, n), ld: null });
  }
  function _i(e, t, n, o, u) {
    e >>>= 0, n >>>= 0, t = Oe(t >>> 0);
    let c = (m) => m;
    if (o === 0) {
      var h = 32 - 8 * n;
      c = (m) => m << h >>> h, u = c(u);
    }
    Ue(e, { name: t, bd: c, kd: (m, y) => y, jd: Yn(t, n, o !== 0), ld: null });
  }
  function Ri(e, t, n) {
    function o(c) {
      var h = (l(), w)[c >>> 2 >>> 0];
      return c = (l(), w)[c + 4 >>> 2 >>> 0], new u((l(), ee).buffer, c, h);
    }
    var u = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array][t];
    Ue(e >>>= 0, { name: n = Oe(n >>> 0), bd: o, jd: o }, { De: true });
  }
  var _e = (e, t, n) => {
    var o = (l(), te);
    if (t >>>= 0, 0 < n) {
      var u = t;
      n = t + n - 1;
      for (var c = 0; c < e.length; ++c) {
        var h = e.codePointAt(c);
        if (127 >= h) {
          if (t >= n) break;
          o[t++ >>> 0] = h;
        } else if (2047 >= h) {
          if (t + 1 >= n) break;
          o[t++ >>> 0] = 192 | h >> 6, o[t++ >>> 0] = 128 | 63 & h;
        } else if (65535 >= h) {
          if (t + 2 >= n) break;
          o[t++ >>> 0] = 224 | h >> 12, o[t++ >>> 0] = 128 | h >> 6 & 63, o[t++ >>> 0] = 128 | 63 & h;
        } else {
          if (t + 3 >= n) break;
          o[t++ >>> 0] = 240 | h >> 18, o[t++ >>> 0] = 128 | h >> 12 & 63, o[t++ >>> 0] = 128 | h >> 6 & 63, o[t++ >>> 0] = 128 | 63 & h, c++;
        }
      }
      o[t >>> 0] = 0, e = t - u;
    } else e = 0;
    return e;
  }, Re = (e) => {
    for (var t = 0, n = 0; n < e.length; ++n) {
      var o = e.charCodeAt(n);
      127 >= o ? t++ : 2047 >= o ? t += 2 : 55296 <= o && 57343 >= o ? (t += 4, ++n) : t += 3;
    }
    return t;
  };
  function Ni(e, t) {
    Ue(e >>>= 0, { name: t = Oe(t >>> 0), bd(n) {
      var o = (l(), w)[n >>> 2 >>> 0];
      return o = ht(n + 4, o, true), ve(n), o;
    }, kd(n, o) {
      o instanceof ArrayBuffer && (o = new Uint8Array(o));
      var u = typeof o == "string";
      if (!(u || ArrayBuffer.isView(o) && o.BYTES_PER_ELEMENT == 1)) throw new bt("Cannot pass non-string to std::string");
      var c = u ? Re(o) : o.length, h = nt(4 + c + 1), m = h + 4;
      return (l(), w)[h >>> 2 >>> 0] = c, u ? _e(o, m, c + 1) : (l(), te).set(o, m >>> 0), n !== null && n.push(ve, h), h;
    }, jd: _r, ld(n) {
      ve(n);
    } });
  }
  var Xn = globalThis.TextDecoder ? new TextDecoder("utf-16le") : void 0, ki = (e, t, n) => {
    if (e >>>= 1, 16 < (t = Pn((l(), Be), e, t / 2, n)) - e && Xn) return Xn.decode((l(), Be).slice(e, t));
    for (n = ""; e < t; ++e) {
      var o = (l(), Be)[e >>> 0];
      n += String.fromCharCode(o);
    }
    return n;
  }, Wi = (e, t, n) => {
    if (n ??= 2147483647, 2 > n) return 0;
    var o = t;
    n = (n -= 2) < 2 * e.length ? n / 2 : e.length;
    for (var u = 0; u < n; ++u) {
      var c = e.charCodeAt(u);
      (l(), De)[t >>> 1 >>> 0] = c, t += 2;
    }
    return (l(), De)[t >>> 1 >>> 0] = 0, t - o;
  }, Fi = (e) => 2 * e.length, Gi = (e, t, n) => {
    var o = "";
    e >>>= 2;
    for (var u = 0; !(u >= t / 4); u++) {
      var c = (l(), w)[e + u >>> 0];
      if (!c && !n) break;
      o += String.fromCodePoint(c);
    }
    return o;
  }, $i = (e, t, n) => {
    if (t >>>= 0, n ??= 2147483647, 4 > n) return 0;
    var o = t;
    n = o + n - 4;
    for (var u = 0; u < e.length; ++u) {
      var c = e.codePointAt(u);
      if (65535 < c && u++, (l(), M)[t >>> 2 >>> 0] = c, (t += 4) + 4 > n) break;
    }
    return (l(), M)[t >>> 2 >>> 0] = 0, t - o;
  }, zi = (e) => {
    for (var t = 0, n = 0; n < e.length; ++n) 65535 < e.codePointAt(n) && n++, t += 4;
    return t;
  };
  function Vi(e, t, n) {
    if (e >>>= 0, t >>>= 0, n = Oe(n >>>= 0), t === 2) var o = ki, u = Wi, c = Fi;
    else o = Gi, u = $i, c = zi;
    Ue(e, { name: n, bd: (h) => {
      var m = (l(), w)[h >>> 2 >>> 0];
      return m = o(h + 4, m * t, true), ve(h), m;
    }, kd: (h, m) => {
      if (typeof m != "string") throw new bt(`Cannot pass non-string to C++ string type ${n}`);
      var y = c(m), A = nt(4 + y + t);
      return (l(), w)[A >>> 2 >>> 0] = y / t, u(m, A + 4, y + t), h !== null && h.push(ve, A), A;
    }, jd: _r, ld(h) {
      ve(h);
    } });
  }
  function ji(e, t) {
    Ue(e >>>= 0, { Ee: true, name: t = Oe(t >>> 0), bd: () => {
    }, kd: () => {
    } });
  }
  function Hi(e) {
    Zr(e >>> 0, !f2, 1, !s, 131072, false), xn();
  }
  var le = (e) => {
    if (!V) try {
      if (e(), !(0 < k)) try {
        i2 ? Jt() && Kr(x2) : Qe(x2);
      } catch (t) {
        t instanceof $e || t == "unwind" || b(0, t);
      }
    } catch (t) {
      t instanceof $e || t == "unwind" || b(0, t);
    }
  }, qi = !Atomics.waitAsync || globalThis.navigator?.userAgent && 91 > Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./) || [])[2]);
  function Rr(e) {
    e >>>= 0, qi || (Atomics.waitAsync((l(), M), e >>> 2, e).value.then(Gt), e += 128, Atomics.store((l(), M), e >>> 2, 1));
  }
  var Gt = () => le(() => {
    var e = Jt();
    e && (Rr(e), jo());
  });
  function Yi(e, t) {
    (e >>>= 0) == t >>> 0 ? setTimeout(Gt) : i2 ? postMessage({ nd: e, gd: "checkMailbox" }) : (e = et2[e]) && e.postMessage({ gd: "checkMailbox" });
  }
  var Nr = [];
  function Ji(e, t, n, o, u) {
    for (t >>>= 0, u >>>= 0, Nr.length = 0, n = u >>> 3, o = u + o >>> 3; n < o; ) {
      var c;
      c = (l(), P)[n++ >>> 0] ? (l(), P)[n++ >>> 0] : (l(), Ee)[n++ >>> 0], Nr.push(c);
    }
    return (t ? rn[t] : Gf[e])(...Nr);
  }
  var Xi = () => {
    k = 0;
  };
  function Zi(e) {
    e >>>= 0, i2 ? postMessage({ gd: "cleanupThread", Se: e }) : An(et2[e]);
  }
  function Ki(e) {
  }
  var $t = (e) => {
    try {
      e();
    } catch (t) {
      Z(t);
    }
  };
  function Qi(e) {
    var t = (...n) => {
      zt.push(e);
      try {
        return e(...n);
      } finally {
        V || (zt.pop(), Me && He === 1 && zt.length === 0 && (He = 0, k += 1, $t(Ra), typeof Fibers < "u" && Fibers.df()));
      }
    };
    return Qn.set(e, t), t;
  }
  var He = 0, Me = null, Zn = 0, zt = [], kr = /* @__PURE__ */ new Map(), Kn = /* @__PURE__ */ new Map(), Qn = /* @__PURE__ */ new Map(), eu = 0, Wr = null, tu = [], eo = (e) => (function(t) {
    if (!V) {
      if (He === 0) {
        var n = false, o = false;
        t((u = 0) => {
          if (!V && (Zn = u, n = true, o)) {
            He = 2, $t(() => Na(Me)), typeof MainLoop < "u" && MainLoop.Ae && MainLoop.resume(), u = false;
            try {
              var c = (function() {
                var y = (l(), M)[Me + 8 >>> 2 >>> 0];
                return y = Kn.get(y), y = Qn.get(y), --k, y();
              })();
            } catch (y) {
              c = y, u = true;
            }
            var h = false;
            if (!Me) {
              var m = Wr;
              m && (Wr = null, (u ? m.reject : m.resolve)(c), h = true);
            }
            if (u && !h) throw c;
          }
        }), o = true, n || (He = 1, Me = (function() {
          var u = nt(65548), c = u + 12;
          if ((l(), w)[u >>> 2 >>> 0] = c, (l(), w)[u + 4 >>> 2 >>> 0] = c + 65536, c = zt[0], !kr.has(c)) {
            var h = eu++;
            kr.set(c, h), Kn.set(h, c);
          }
          return c = kr.get(c), (l(), M)[u + 8 >>> 2 >>> 0] = c, u;
        })(), typeof MainLoop < "u" && MainLoop.Ae && MainLoop.pause(), $t(() => _a2(Me)));
      } else He === 2 ? (He = 0, $t(ka), ve(Me), Me = null, tu.forEach(le)) : Z(`invalid state: ${He}`);
      return Zn;
    }
  })((t) => {
    e().then(t);
  });
  function ru(e) {
    return e >>>= 0, eo(async () => {
      var t = await we(e);
      return Se(t);
    });
  }
  var Fr = [], nu = (e) => {
    var t = Fr.length;
    return Fr.push(e), t;
  }, ou = (e, t) => {
    for (var n = Array(e), o = 0; o < e; ++o) {
      var u = o, c = (l(), w)[t + 4 * o >>> 2 >>> 0], h = Pr[c];
      if (h === void 0) throw e = `parameter ${o}`, c = Lo(c), t = Oe(c), ve(c), new bt(`${e} has unknown type ${t}`);
      n[u] = h;
    }
    return n;
  }, au = (e, t, n) => {
    var o = [];
    return e = e(o, n), o.length && ((l(), w)[t >>> 2 >>> 0] = Se(o)), e;
  }, su = {}, Vt = (e) => {
    var t = su[e];
    return t === void 0 ? Oe(e) : t;
  };
  function iu(e, t, n) {
    var [o, ...u] = ou(e, t >>> 0);
    t = o.kd.bind(o);
    var c = u.map((y) => y.jd.bind(y));
    e--;
    var h = { toValue: we };
    switch (e = c.map((y, A) => {
      var F = `argFromPtr${A}`;
      return h[F] = y, `${F}(args${A ? "+" + 8 * A : ""})`;
    }), n) {
      case 0:
        var m = "toValue(handle)";
        break;
      case 2:
        m = "new (toValue(handle))";
        break;
      case 3:
        m = "";
        break;
      case 1:
        h.getStringOrSymbol = Vt, m = "toValue(handle)[getStringOrSymbol(methodName)]";
    }
    return m += `(${e})`, o.Ee || (h.toReturnWire = t, h.emval_returnValue = au, m = `return emval_returnValue(toReturnWire, destructorsRef, ${m})`), m = `return function (handle, methodName, destructorsRef, args) {
  ${m}
  }`, n = new Function(Object.keys(h), m)(...Object.values(h)), m = `methodCaller<(${u.map((y) => y.name)}) => ${o.name}>`, nu(Object.defineProperty(n, "name", { value: m }));
  }
  function uu(e, t) {
    return t >>>= 0, (e = we(e >>> 0)) == we(t);
  }
  function fu(e) {
    return (e >>>= 0) ? (e = Vt(e), Se(globalThis[e])) : Se(globalThis);
  }
  function cu(e) {
    return e = Vt(e >>> 0), Se(r[e]);
  }
  function du(e, t) {
    return t >>>= 0, e = we(e >>> 0), t = we(t), Se(e[t]);
  }
  function lu(e) {
    9 < (e >>>= 0) && (tt[e + 1] += 1);
  }
  function to(e, t, n, o, u) {
    return Fr[e >>> 0](t >>> 0, n >>> 0, o >>> 0, u >>> 0);
  }
  function pu(e, t, n, o, u) {
    return to(e >>> 0, t >>> 0, n >>> 0, o >>> 0, u >>> 0);
  }
  function mu() {
    return Se([]);
  }
  function hu(e) {
    e = we(e >>> 0);
    for (var t = Array(e.length), n = 0; n < e.length; n++) t[n] = e[n];
    return Se(t);
  }
  function bu(e) {
    return Se(Vt(e >>> 0));
  }
  function gu() {
    return Se({});
  }
  function yu(e) {
    for (var t = we(e >>>= 0); t.length; ) {
      var n = t.pop();
      t.pop()(n);
    }
    Ur(e);
  }
  function wu(e, t, n) {
    t >>>= 0, n >>>= 0, e = we(e >>> 0), t = we(t), n = we(n), e[t] = n;
  }
  function vu(e, t) {
    e = ae(e), t >>>= 0, e = new Date(1e3 * e), (l(), M)[t >>> 2 >>> 0] = e.getUTCSeconds(), (l(), M)[t + 4 >>> 2 >>> 0] = e.getUTCMinutes(), (l(), M)[t + 8 >>> 2 >>> 0] = e.getUTCHours(), (l(), M)[t + 12 >>> 2 >>> 0] = e.getUTCDate(), (l(), M)[t + 16 >>> 2 >>> 0] = e.getUTCMonth(), (l(), M)[t + 20 >>> 2 >>> 0] = e.getUTCFullYear() - 1900, (l(), M)[t + 24 >>> 2 >>> 0] = e.getUTCDay(), e = (e.getTime() - Date.UTC(e.getUTCFullYear(), 0, 1, 0, 0, 0, 0)) / 864e5 | 0, (l(), M)[t + 28 >>> 2 >>> 0] = e;
  }
  var ro = (e) => e % 4 == 0 && (e % 100 != 0 || e % 400 == 0), no = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], oo = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function Tu(e, t) {
    e = ae(e), t >>>= 0, e = new Date(1e3 * e), (l(), M)[t >>> 2 >>> 0] = e.getSeconds(), (l(), M)[t + 4 >>> 2 >>> 0] = e.getMinutes(), (l(), M)[t + 8 >>> 2 >>> 0] = e.getHours(), (l(), M)[t + 12 >>> 2 >>> 0] = e.getDate(), (l(), M)[t + 16 >>> 2 >>> 0] = e.getMonth(), (l(), M)[t + 20 >>> 2 >>> 0] = e.getFullYear() - 1900, (l(), M)[t + 24 >>> 2 >>> 0] = e.getDay();
    var n = (ro(e.getFullYear()) ? no : oo)[e.getMonth()] + e.getDate() - 1 | 0;
    (l(), M)[t + 28 >>> 2 >>> 0] = n, (l(), M)[t + 36 >>> 2 >>> 0] = -60 * e.getTimezoneOffset(), n = new Date(e.getFullYear(), 6, 1).getTimezoneOffset();
    var o = new Date(e.getFullYear(), 0, 1).getTimezoneOffset();
    e = 0 | (n != o && e.getTimezoneOffset() == Math.min(o, n)), (l(), M)[t + 32 >>> 2 >>> 0] = e;
  }
  function Eu(e) {
    e >>>= 0;
    var t = new Date((l(), M)[e + 20 >>> 2 >>> 0] + 1900, (l(), M)[e + 16 >>> 2 >>> 0], (l(), M)[e + 12 >>> 2 >>> 0], (l(), M)[e + 8 >>> 2 >>> 0], (l(), M)[e + 4 >>> 2 >>> 0], (l(), M)[e >>> 2 >>> 0], 0), n = (l(), M)[e + 32 >>> 2 >>> 0], o = t.getTimezoneOffset(), u = new Date(t.getFullYear(), 6, 1).getTimezoneOffset(), c = new Date(t.getFullYear(), 0, 1).getTimezoneOffset(), h = Math.min(c, u);
    return 0 > n ? (l(), M)[e + 32 >>> 2 >>> 0] = +(u != c && h == o) : 0 < n != (h == o) && (u = Math.max(c, u), t.setTime(t.getTime() + 6e4 * ((0 < n ? h : u) - o))), (l(), M)[e + 24 >>> 2 >>> 0] = t.getDay(), n = (ro(t.getFullYear()) ? no : oo)[t.getMonth()] + t.getDate() - 1 | 0, (l(), M)[e + 28 >>> 2 >>> 0] = n, (l(), M)[e >>> 2 >>> 0] = t.getSeconds(), (l(), M)[e + 4 >>> 2 >>> 0] = t.getMinutes(), (l(), M)[e + 8 >>> 2 >>> 0] = t.getHours(), (l(), M)[e + 12 >>> 2 >>> 0] = t.getDate(), (l(), M)[e + 16 >>> 2 >>> 0] = t.getMonth(), (l(), M)[e + 20 >>> 2 >>> 0] = t.getYear(), e = t.getTime(), BigInt(isNaN(e) ? -1 : e / 1e3);
  }
  function ao(e, t, n, o, u, c, h) {
    return i2 ? N(16, 1, e, t, n, o, u, c, h) : -52;
  }
  function so(e, t, n, o, u, c) {
    if (i2) return N(17, 1, e, t, n, o, u, c);
  }
  var It = {}, Su = () => performance.timeOrigin + performance.now();
  function io(e, t) {
    if (i2) return N(18, 1, e, t);
    if (It[e] && (clearTimeout(It[e].id), delete It[e]), !t) return 0;
    var n = setTimeout(() => {
      delete It[e], le(() => Vo(e, performance.timeOrigin + performance.now()));
    }, t);
    return It[e] = { id: n, cf: t }, 0;
  }
  function Au(e, t, n, o) {
    e >>>= 0, t >>>= 0, n >>>= 0, o >>>= 0;
    var u = (/* @__PURE__ */ new Date()).getFullYear(), c = new Date(u, 0, 1).getTimezoneOffset();
    u = new Date(u, 6, 1).getTimezoneOffset();
    var h = Math.max(c, u);
    (l(), w)[e >>> 2 >>> 0] = 60 * h, (l(), M)[t >>> 2 >>> 0] = +(c != u), e = (t = (m) => {
      var y = Math.abs(m);
      return `UTC${0 <= m ? "-" : "+"}${String(Math.floor(y / 60)).padStart(2, "0")}${String(y % 60).padStart(2, "0")}`;
    })(c), t = t(u), u < c ? (_e(e, n, 17), _e(t, o, 17)) : (_e(e, o, 17), _e(t, n, 17));
  }
  var xu = () => Date.now(), Lu = 1;
  function Iu(e, t, n) {
    if (n >>>= 0, !(0 <= e && 3 >= e)) return 28;
    if (e === 0) e = Date.now();
    else {
      if (!Lu) return 52;
      e = performance.timeOrigin + performance.now();
    }
    return e = Math.round(1e6 * e), (l(), P)[n >>> 3 >>> 0] = BigInt(e), 0;
  }
  var Gr = [], uo = (e, t) => {
    Gr.length = 0;
    for (var n; n = (l(), te)[e++ >>> 0]; ) {
      var o = n != 105;
      t += (o &= n != 112) && t % 8 ? 4 : 0, Gr.push(n == 112 ? (l(), w)[t >>> 2 >>> 0] : n == 106 ? (l(), P)[t >>> 3 >>> 0] : n == 105 ? (l(), M)[t >>> 2 >>> 0] : (l(), Ee)[t >>> 3 >>> 0]), t += o ? 8 : 4;
    }
    return Gr;
  };
  function Bu(e, t, n) {
    return e >>>= 0, t = uo(t >>> 0, n >>> 0), rn[e](...t);
  }
  function Ou(e, t, n) {
    return e >>>= 0, t = uo(t >>> 0, n >>> 0), rn[e](...t);
  }
  var Mu = () => {
  };
  function Cu(e, t) {
    return R(ht(e >>> 0, t >>> 0));
  }
  var Du = () => {
    throw k += 1, "unwind";
  };
  function Pu() {
    return 4294901760;
  }
  var Uu = () => 1, _u = () => navigator.hardwareConcurrency, rt = {}, fo = (e) => {
    var t = Re(e) + 1, n = nt(t);
    return n && _e(e, n, t), n;
  }, jt = (e) => {
    var t;
    return (t = /\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(e)) ? +t[1] : (t = /:(\d+):\d+(?:\)|$)/.exec(e)) ? 2147483648 | +t[1] : 0;
  }, co = (e) => {
    for (var t of e) (e = jt(t)) && (rt[e] = t);
  };
  function Ru() {
    var e = Error().stack.toString().split(`
`);
    return e[0] == "Error" && e.shift(), co(e), rt.ne = jt(e[3]), rt.Fe = e, rt.ne;
  }
  function Ht(e) {
    if (!(e = rt[e >>> 0])) return 0;
    var t;
    if (t = /^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(e)) e = t[1];
    else if (t = /^\s+at (.*) \(.*\)$/.exec(e)) e = t[1];
    else {
      if (!(t = /^(.+?)@/.exec(e))) return 0;
      e = t[1];
    }
    return ve(Ht.ve ?? 0), Ht.ve = fo(e), Ht.ve;
  }
  function Nu(e) {
    e >>>= 0;
    var t = (l(), te).length;
    if (e <= t || 4294901760 < e) return false;
    for (var n = 1; 4 >= n; n *= 2) {
      var o = t * (1 + 0.2 / n);
      o = Math.min(o, e + 100663296);
      e: {
        o = (Math.min(4294901760, 65536 * Math.ceil(Math.max(e, o) / 65536)) - je.buffer.byteLength + 65535) / 65536 | 0;
        try {
          je.grow(o), de();
          var u = 1;
          break e;
        } catch {
        }
        u = void 0;
      }
      if (u) return true;
    }
    return false;
  }
  function ku(e, t, n) {
    if (e >>>= 0, t >>>= 0, rt.ne == e) var o = rt.Fe;
    else (o = Error().stack.toString().split(`
`))[0] == "Error" && o.shift(), co(o);
    for (var u = 3; o[u] && jt(o[u]) != e; ) ++u;
    for (e = 0; e < n && o[e + u]; ++e) (l(), M)[t + 4 * e >>> 2 >>> 0] = jt(o[e + u]);
    return e;
  }
  var Ce = (e) => {
    var t = Re(e) + 1, n = Xt(t);
    return _e(e, n, t), n;
  }, gt = (e) => (l(), w)[e >>> 2 >>> 0] + 4294967296 * (l(), M)[e + 4 >>> 2 >>> 0], se = [], lo = (e, t) => {
    se[e >>> 0] = t;
  }, Ne = [], qt = [], yt = (e, t) => {
    qt[e] = new Promise((n) => t.finally(() => n(e)));
  }, C = (e) => {
    if (e) return se[e >>> 0];
  }, $r = (e, t) => {
    for (e = (l(), w)[e >>> 2 >>> 0]; e; e = (l(), w)[e >>> 2 >>> 0]) t[(l(), M)[e + 4 >>> 2 >>> 0]](e);
  }, Yt = (e, t, n) => {
    (l(), w)[e >>> 2 >>> 0] = t, (l(), w)[e + 4 >>> 2 >>> 0] = n;
  }, po = (e) => {
    var t = (l(), w)[e >>> 2 >>> 0];
    return e = (l(), w)[e + 4 >>> 2 >>> 0], ht(t, e);
  }, Ae = (e) => {
    var t = (l(), w)[e >>> 2 >>> 0];
    return e = (l(), w)[e + 4 >>> 2 >>> 0], t ? ht(t, e) : e === 0 ? "" : void 0;
  }, Wu = (e) => {
    var t = Ae(e + 4), n = (n = (l(), w)[e + 12 >>> 2 >>> 0]) ? C(n) : "auto";
    if (e += 16) {
      var o = C((l(), w)[e + 4 >>> 2 >>> 0]), u = (l(), w)[e + 16 >>> 2 >>> 0], c = (l(), w)[e + 20 >>> 2 >>> 0];
      if (u) {
        for (var h = {}, m = 0; m < u; ++m) {
          var y = c + 24 * m;
          h[po(y + 4)] = (l(), Ee)[y + 16 >>> 3 >>> 0];
        }
        u = h;
      } else u = void 0;
      e = { module: o, constants: u, entryPoint: Ae(e + 8) };
    } else e = void 0;
    return { label: t, layout: n, compute: e };
  }, mo = (e, t) => {
    function n(c, h, m, y = 0) {
      c = e[c] ?? y, (l(), w)[h + m >>> 2 >>> 0] = c;
    }
    function o(c, h, m, y = 0) {
      h += m, c = e[c] ?? y, (l(), w)[h >>> 2 >>> 0] = c, y = (l(), w)[h >>> 2 >>> 0], (l(), w)[h + 4 >>> 2 >>> 0] = (c - y) / 4294967296;
    }
    var u = (l(), w)[t >>> 2 >>> 0];
    n("maxTextureDimension1D", t, 4), n("maxTextureDimension2D", t, 8), n("maxTextureDimension3D", t, 12), n("maxTextureArrayLayers", t, 16), n("maxBindGroups", t, 20), n("maxBindGroupsPlusVertexBuffers", t, 24), n("maxBindingsPerBindGroup", t, 28), n("maxDynamicUniformBuffersPerPipelineLayout", t, 32), n("maxDynamicStorageBuffersPerPipelineLayout", t, 36), n("maxSampledTexturesPerShaderStage", t, 40), n("maxSamplersPerShaderStage", t, 44), n("maxStorageBuffersPerShaderStage", t, 48), n("maxStorageTexturesPerShaderStage", t, 52), n("maxUniformBuffersPerShaderStage", t, 56), n("minUniformBufferOffsetAlignment", t, 80), n("minStorageBufferOffsetAlignment", t, 84), o("maxUniformBufferBindingSize", t, 64), o("maxStorageBufferBindingSize", t, 72), n("maxVertexBuffers", t, 88), o("maxBufferSize", t, 96), n("maxVertexAttributes", t, 104), n("maxVertexBufferArrayStride", t, 108), n("maxInterStageShaderVariables", t, 112), n("maxColorAttachments", t, 116), n("maxColorAttachmentBytesPerSample", t, 120), n("maxComputeWorkgroupStorageSize", t, 124), n("maxComputeInvocationsPerWorkgroup", t, 128), n("maxComputeWorkgroupSizeX", t, 132), n("maxComputeWorkgroupSizeY", t, 136), n("maxComputeWorkgroupSizeZ", t, 140), n("maxComputeWorkgroupsPerDimension", t, 144), n("maxImmediateSize", t, 148), u !== 0 && (l(), n("maxStorageBuffersInVertexStage", u, 8, e.maxStorageBuffersPerShaderStage), n("maxStorageBuffersInFragmentStage", u, 16, e.maxStorageBuffersPerShaderStage), n("maxStorageTexturesInVertexStage", u, 12, e.maxStorageTexturesPerShaderStage), n("maxStorageTexturesInFragmentStage", u, 20, e.maxStorageTexturesPerShaderStage));
  }, Fu = (e, t) => {
    (l(), w)[t + 52 >>> 2 >>> 0] = e.subgroupMinSize, (l(), w)[t + 56 >>> 2 >>> 0] = e.subgroupMaxSize;
    var n = fo(e.vendor + e.architecture + e.device + e.description), o = Re(e.vendor);
    Yt(t + 4, n, o), n += o, o = Re(e.architecture), Yt(t + 12, n, o), n += o, o = Re(e.device), Yt(t + 20, n, o), n += o, o = Re(e.description), Yt(t + 28, n, o), n += o, (l(), M)[t + 36 >>> 2 >>> 0] = 2, n = e.isFallbackAdapter ? 3 : 4, (l(), M)[t + 40 >>> 2 >>> 0] = n, (l(), w)[t + 44 >>> 2 >>> 0] = 0, (l(), w)[t + 48 >>> 2 >>> 0] = 0, $r(t, { 327739: (u) => {
      let c = 0, h = 0;
      if (e.subgroupMatrixConfigs) {
        c = e.subgroupMatrixConfigs.length, h = nt(20 * c);
        for (let [m, y] of e.subgroupMatrixConfigs.entries()) {
          let A = h + 20 * m, F = bo.indexOf(y.componentType), j = bo.indexOf(y.resultComponentType);
          (l(), M)[A >>> 2 >>> 0] = F, (l(), M)[A + 4 >>> 2 >>> 0] = j, (l(), w)[A + 8 >>> 2 >>> 0] = y.M, (l(), w)[A + 12 >>> 2 >>> 0] = y.N, (l(), w)[A + 16 >>> 2 >>> 0] = y.K;
        }
      }
      (l(), w)[u + 12 >>> 2 >>> 0] = h, (l(), w)[u + 8 >>> 2 >>> 0] = c;
    } });
  }, Gu = [, , "uniform", "storage", "read-only-storage"], $u = [, "validation", "out-of-memory", "internal"], zu = [, "compatibility", "core"], ho = { 1: "core-features-and-limits", 2: "depth-clip-control", 3: "depth32float-stencil8", 4: "texture-compression-bc", 5: "texture-compression-bc-sliced-3d", 6: "texture-compression-etc2", 7: "texture-compression-astc", 8: "texture-compression-astc-sliced-3d", 9: "timestamp-query", 10: "indirect-first-instance", 11: "shader-f16", 12: "rg11b10ufloat-renderable", 13: "bgra8unorm-storage", 14: "float32-filterable", 15: "float32-blendable", 16: "clip-distances", 17: "dual-source-blending", 18: "subgroups", 19: "texture-formats-tier1", 20: "texture-formats-tier2", 21: "primitive-index", 22: "texture-component-swizzle", 23: "subgroup-size-control", 327692: "chromium-experimental-unorm16-texture-formats", 327729: "chromium-experimental-multi-draw-indirect", 327732: "chromium-experimental-subgroup-matrix" }, Vu = [, "low-power", "high-performance"], ju = [, "occlusion", "timestamp"], Hu = [, , "filtering", "non-filtering", "comparison"], qu = [, , "write-only", "read-only", "read-write"], bo = [, "f32", "f16", "u32", "i32", "u8", "i8"], Yu = [, "r8unorm", "r8snorm", "r8uint", "r8sint", "r16unorm", "r16snorm", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32float", "r32uint", "r32sint", "rg16unorm", "rg16snorm", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rgb9e5ufloat", "rg32float", "rg32uint", "rg32sint", "rgba16unorm", "rgba16snorm", "rgba16uint", "rgba16sint", "rgba16float", "rgba32float", "rgba32uint", "rgba32sint", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"], Ju = [, , "float", "unfilterable-float", "depth", "sint", "uint"], go = [, "1d", "2d", "2d-array", "cube", "cube-array", "3d"], Xu = { undefined: 1, unknown: 1, destroyed: 2 };
  function Zu(e, t, n, o, u, c) {
    t = ae(t), n = ae(n), o >>>= 0, u >>>= 0, c >>>= 0;
    var h = C(e >>> 0);
    if (e = {}, c) {
      var m = (l(), w)[c + 12 >>> 2 >>> 0];
      if (m) {
        var y = (l(), w)[c + 16 >>> 2 >>> 0];
        e.requiredFeatures = Array.from((l(), w).subarray(y >>> 2 >>> 0, y + 4 * m >>> 2 >>> 0), (I) => ho[I]);
      }
      if (m = (l(), w)[c + 20 >>> 2 >>> 0]) {
        let I = function(pe, ue, ot, at = false) {
          ue += ot, (ue = (l(), w)[ue >>> 2 >>> 0]) == 4294967295 || at && ue == 0 || (A[pe] = ue);
        }, q = function(pe, ue, ot) {
          ue += ot, ot = (l(), w)[ue >>> 2 >>> 0];
          var at = (l(), w)[ue + 4 >>> 2 >>> 0];
          ot == 4294967295 && at == 4294967295 || (A[pe] = gt(ue));
        };
        var F = I, j = q;
        y = (l(), w)[m >>> 2 >>> 0];
        var A = {};
        I("maxTextureDimension1D", m, 4), I("maxTextureDimension2D", m, 8), I("maxTextureDimension3D", m, 12), I("maxTextureArrayLayers", m, 16), I("maxBindGroups", m, 20), I("maxBindGroupsPlusVertexBuffers", m, 24), I("maxBindingsPerBindGroup", m, 28), I("maxDynamicUniformBuffersPerPipelineLayout", m, 32), I("maxDynamicStorageBuffersPerPipelineLayout", m, 36), I("maxSampledTexturesPerShaderStage", m, 40), I("maxSamplersPerShaderStage", m, 44), I("maxStorageBuffersPerShaderStage", m, 48), I("maxStorageTexturesPerShaderStage", m, 52), I("maxUniformBuffersPerShaderStage", m, 56), I("minUniformBufferOffsetAlignment", m, 80), I("minStorageBufferOffsetAlignment", m, 84), q("maxUniformBufferBindingSize", m, 64), q("maxStorageBufferBindingSize", m, 72), I("maxVertexBuffers", m, 88), q("maxBufferSize", m, 96), I("maxVertexAttributes", m, 104), I("maxVertexBufferArrayStride", m, 108), I("maxInterStageShaderVariables", m, 112), I("maxColorAttachments", m, 116), I("maxColorAttachmentBytesPerSample", m, 120), I("maxComputeWorkgroupStorageSize", m, 124), I("maxComputeInvocationsPerWorkgroup", m, 128), I("maxComputeWorkgroupSizeX", m, 132), I("maxComputeWorkgroupSizeY", m, 136), I("maxComputeWorkgroupSizeZ", m, 140), I("maxComputeWorkgroupsPerDimension", m, 144), I("maxImmediateSize", m, 148, true), y !== 0 && (l(), "maxStorageBuffersInVertexStage" in GPUSupportedLimits.prototype && (I("maxStorageBuffersInVertexStage", y, 8), I("maxStorageTexturesInVertexStage", y, 12), I("maxStorageBuffersInFragmentStage", y, 16), I("maxStorageTexturesInFragmentStage", y, 20))), e.requiredLimits = A;
      }
      (m = (l(), w)[c + 24 >>> 2 >>> 0]) && (m = { label: Ae(m + 4) }, e.defaultQueue = m), e.label = Ae(c + 4);
    }
    k += 1, yt(t, h.requestDevice(e).then((I) => {
      --k, le(() => {
        se[u >>> 0] = I.queue, se[o >>> 0] = I, k += 1, yt(n, I.lost.then((q) => {
          le(() => {
            I.onuncapturederror = () => {
            };
            var pe = _(), ue = Ce(q.message);
            qr(n, Xu[q.reason], ue), U(pe);
          }), --k;
        })), I.onuncapturederror = (q) => {
          var pe = 5;
          q.error instanceof GPUValidationError ? pe = 2 : q.error instanceof GPUOutOfMemoryError ? pe = 3 : q.error instanceof GPUInternalError && (pe = 4);
          var ue = _();
          q = Ce(q.error.message), Fo(o, pe, q), U(ue);
        }, "adapterInfo" in I || (I.adapterInfo = h.info), Xr(t, 1, o, 0);
      });
    }, (I) => {
      --k, le(() => {
        var q = _(), pe = Ce(I.message);
        Xr(t, 3, o, pe), n && qr(n, 4, pe), U(q);
      });
    }));
  }
  function Ku(e) {
    var t = C(e >>>= 0), n = Ne[e];
    if (n) {
      for (var o = 0; o < n.length; ++o) n[o]();
      delete Ne[e];
    }
    t.destroy();
  }
  function Qu(e, t, n) {
    n >>>= 0;
    var o = C(e >>>= 0);
    n == 4294967295 && (n = void 0);
    try {
      var u = o.getMappedRange(t >>> 0, n);
    } catch {
      return 0;
    }
    var c = Qr(16, u.byteLength);
    return (l(), te).set(new Uint8Array(u), c >>> 0), Ne[e].push(() => ve(c)), c;
  }
  function ef(e, t, n) {
    n >>>= 0;
    var o = C(e >>>= 0);
    n == 4294967295 && (n = void 0);
    try {
      var u = o.getMappedRange(t >>> 0, n);
    } catch {
      return 0;
    }
    var c = Qr(16, u.byteLength);
    return (l(), te).fill(0, c, u.byteLength), Ne[e].push(() => {
      new Uint8Array(u).set((l(), te).subarray(c >>> 0, c + u.byteLength >>> 0)), ve(c);
    }), c;
  }
  function tf(e, t, n, o, u) {
    e >>>= 0, t = ae(t), n = ae(n), u >>>= 0;
    var c = C(e);
    Ne[e] = [], u == 4294967295 && (u = void 0), k += 1, yt(t, c.mapAsync(n, o >>> 0, u).then(() => {
      --k, le(() => {
        Yr(t, 1, 0);
      });
    }, (h) => {
      --k, le(() => {
        _();
        var m = Ce(h.message);
        Yr(t, h.name === "AbortError" ? 4 : h.name === "OperationError" ? 3 : 0, m), delete Ne[e];
      });
    }));
  }
  function rf(e) {
    var t = C(e >>>= 0), n = Ne[e];
    if (n) {
      for (var o = 0; o < n.length; ++o) n[o]();
      delete Ne[e], t.unmap();
    }
  }
  function nf(e) {
    delete se[e >>> 0];
  }
  function of(e, t, n) {
    e >>>= 0, t >>>= 0, n >>>= 0;
    var o = !!(l(), w)[t + 32 >>> 2 >>> 0];
    t = { label: Ae(t + 4), usage: (l(), w)[t + 16 >>> 2 >>> 0], size: gt(t + 24), mappedAtCreation: o }, e = C(e);
    try {
      var u = e.createBuffer(t);
    } catch {
      return false;
    }
    return se[n >>> 0] = u, o && (Ne[n] = []), true;
  }
  function af(e, t, n, o) {
    e >>>= 0, t = ae(t), o >>>= 0, n = Wu(n >>> 0), e = C(e), k += 1, yt(t, e.createComputePipelineAsync(n).then((u) => {
      --k, le(() => {
        se[o >>> 0] = u, Hr(t, 1, o, 0);
      });
    }, (u) => {
      --k, le(() => {
        var c = _(), h = Ce(u.message);
        Hr(t, u.reason === "validation" ? 3 : u.reason === "internal" ? 4 : 0, o, h), U(c);
      });
    }));
  }
  function sf(e, t, n) {
    e >>>= 0, t >>>= 0, n >>>= 0;
    var o = (l(), w)[t >>> 2 >>> 0], u = (l(), M)[o + 4 >>> 2 >>> 0];
    t = { label: Ae(t + 4), code: "" }, u === 2 && (t.code = po(o + 8)), e = C(e).createShaderModule(t), se[n >>> 0] = e;
  }
  var uf = (e) => {
    (e = C(e)).onuncapturederror = null, e.destroy();
  };
  function ff(e, t) {
    t = ae(t), e = C(e >>> 0), k += 1, yt(t, e.popErrorScope().then((n) => {
      --k, le(() => {
        var o = 5;
        n ? n instanceof GPUValidationError ? o = 2 : n instanceof GPUOutOfMemoryError ? o = 3 : n instanceof GPUInternalError && (o = 4) : o = 1;
        var u = _(), c = n ? Ce(n.message) : 0;
        Jr(t, 1, o, c), U(u);
      });
    }, (n) => {
      --k, le(() => {
        var o = _(), u = Ce(n.message);
        Jr(t, 1, 5, u), U(o);
      });
    }));
  }
  function cf(e, t, n, o) {
    if (t = ae(t), o >>>= 0, n >>>= 0) {
      var u = { featureLevel: zu[(l(), M)[n + 4 >>> 2 >>> 0]], powerPreference: Vu[(l(), M)[n + 8 >>> 2 >>> 0]], forceFallbackAdapter: !!(l(), w)[n + 12 >>> 2 >>> 0] };
      (e = (l(), w)[n >>> 2 >>> 0]) !== 0 && (l(), u.ff = !!(l(), w)[e + 8 >>> 2 >>> 0]);
    }
    "gpu" in navigator ? (k += 1, yt(t, navigator.gpu.requestAdapter(u).then((c) => {
      --k, le(() => {
        if (c) se[o >>> 0] = c, Bt(t, 1, o, 0);
        else {
          var h = _(), m = Ce("WebGPU not available on this browser (requestAdapter returned null)");
          Bt(t, 3, o, m), U(h);
        }
      });
    }, (c) => {
      --k, le(() => {
        var h = _(), m = Ce(c.message);
        Bt(t, 4, o, m), U(h);
      });
    }))) : (u = _(), e = Ce("WebGPU not available on this browser (navigator.gpu is not available)"), Bt(t, 3, o, e), U(u));
  }
  function df(e, t, n) {
    return e >>>= 0, t >>>= 0, n >>>= 0, eo(async () => {
      var o = [];
      if (n) {
        var u = (l(), M)[n >>> 2 >>> 0];
        o.length = t + 1, o[t] = new Promise((m) => setTimeout(m, u, 0));
      } else o.length = t;
      for (var c = 0; c < t; ++c) {
        var h = gt(e + 8 * c);
        if (!(h in qt)) return h;
        o[c] = qt[h];
      }
      return o = await Promise.race(o), delete qt[o], o;
    });
  }
  var zr, Vr = {}, yo = () => {
    if (!zr) {
      var e, t = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: (globalThis.navigator?.language ?? "C").replace("-", "_") + ".UTF-8", _: "./this.program" };
      for (e in Vr) Vr[e] === void 0 ? delete t[e] : t[e] = Vr[e];
      var n = [];
      for (e in t) n.push(`${e}=${t[e]}`);
      zr = n;
    }
    return zr;
  };
  function wo(e, t) {
    if (i2) return N(19, 1, e, t);
    e >>>= 0, t >>>= 0;
    var n, o = 0, u = 0;
    for (n of yo()) {
      var c = t + o;
      (l(), w)[e + u >>> 2 >>> 0] = c, o += _e(n, c, 1 / 0) + 1, u += 4;
    }
    return 0;
  }
  function vo(e, t) {
    if (i2) return N(20, 1, e, t);
    e >>>= 0, t >>>= 0;
    var n = yo();
    for (var o of ((l(), w)[e >>> 2 >>> 0] = n.length, e = 0, n)) e += Re(o) + 1;
    return (l(), w)[t >>> 2 >>> 0] = e, 0;
  }
  function To(e) {
    return i2 ? N(21, 1, e) : 52;
  }
  function Eo(e, t, n, o, u) {
    return i2 ? N(22, 1, e, t, n, o, u) : 52;
  }
  function So(e, t, n, o) {
    return i2 ? N(23, 1, e, t, n, o) : 52;
  }
  function Ao(e, t, n, o) {
    return i2 ? N(24, 1, e, t, n, o) : 70;
  }
  var lf = [null, [], []];
  function xo(e, t, n, o) {
    if (i2) return N(25, 1, e, t, n, o);
    t >>>= 0, n >>>= 0, o >>>= 0;
    for (var u = 0, c = 0; c < n; c++) {
      var h = (l(), w)[t >>> 2 >>> 0], m = (l(), w)[t + 4 >>> 2 >>> 0];
      t += 8;
      for (var y = 0; y < m; y++) {
        var A = e, F = (l(), te)[h + y >>> 0], j = lf[A];
        F === 0 || F === 10 ? ((A === 1 ? Y : R)(Un(j)), j.length = 0) : j.push(F);
      }
      u += m;
    }
    return (l(), w)[o >>> 2 >>> 0] = u, 0;
  }
  function pf(e) {
    return e >>> 0;
  }
  function mf(e, t) {
    return mo(C(e >>> 0).limits, t >>> 0), 1;
  }
  function hf(e, t) {
    return C(e >>> 0).features.has(ho[t]);
  }
  function bf(e) {
    return BigInt(C(e >>> 0).size);
  }
  function gf(e) {
    return BigInt(C(e >>> 0).usage);
  }
  function yf(e, t) {
    if (e >>>= 0, t >>>= 0) {
      var n = Ae(t + 4);
      n = { label: n, timestampWrites: t = (t = (l(), w)[t + 12 >>> 2 >>> 0]) !== 0 ? { querySet: C((l(), w)[t + 4 >>> 2 >>> 0]), beginningOfPassWriteIndex: (l(), w)[t + 8 >>> 2 >>> 0], endOfPassWriteIndex: (l(), w)[t + 12 >>> 2 >>> 0] } : void 0 };
    }
    return t = C(e), e = Uo(0), n = t.beginComputePass(n), se[e >>> 0] = n, e;
  }
  function wf(e, t, n, o) {
    n = ae(n), (o = ae(o)) == -1 && (o = void 0), (e = C(e >>> 0)).clearBuffer(C(t >>> 0), n, o);
  }
  function vf(e, t, n, o, u, c) {
    n = ae(n), u = ae(u), c = ae(c), C(e >>> 0).copyBufferToBuffer(C(t >>> 0), n, C(o >>> 0), u, c);
  }
  function Tf(e) {
    var t = C(e >>> 0);
    return e = Do(0), t = t.finish(), se[e >>> 0] = t, e;
  }
  function Ef(e, t, n, o, u, c) {
    c = ae(c), C(e >>> 0).resolveQuerySet(C(t >>> 0), n, o, C(u >>> 0), c);
  }
  function Sf(e, t, n, o) {
    C(e >>> 0).dispatchWorkgroups(t, n, o);
  }
  function Af(e, t, n) {
    n = ae(n), C(e >>> 0).dispatchWorkgroupsIndirect(C(t >>> 0), n);
  }
  function xf(e) {
    C(e >>> 0).end();
  }
  function Lf(e, t, n, o, u) {
    o >>>= 0, u >>>= 0, e = C(e >>> 0), n = C(n >>> 0), o == 0 ? e.setBindGroup(t, n) : e.setBindGroup(t, n, (l(), w), u >>> 2, o);
  }
  function If(e, t) {
    C(e >>> 0).setPipeline(C(t >>> 0));
  }
  function Bf(e, t, n) {
    C(e >>> 0).ef(C(t >>> 0), n);
  }
  function Of(e, t) {
    function n(u) {
      var c = (l(), w)[u + 8 >>> 2 >>> 0], h = (l(), w)[u + 32 >>> 2 >>> 0], m = (l(), w)[u + 36 >>> 2 >>> 0], y = 0;
      return $r(u, { 14: (A) => {
        y = (l(), w)[A + 8 >>> 2 >>> 0];
      } }), c ? ((h = gt(u + 24)) == -1 && (h = void 0), c = { buffer: C(c), offset: gt(u + 16), size: h }) : c = C(h || m || y), { binding: (l(), w)[u + 4 >>> 2 >>> 0], resource: c };
    }
    e >>>= 0, t = { label: Ae((t >>>= 0) + 4), layout: C((l(), w)[t + 12 >>> 2 >>> 0]), entries: (function(u, c) {
      for (var h = [], m = 0; m < u; ++m) h.push(n(c + 40 * m));
      return h;
    })((l(), w)[t + 16 >>> 2 >>> 0], (l(), w)[t + 20 >>> 2 >>> 0]) }, e = C(e);
    var o = Mo(0);
    return lo(o, e.createBindGroup(t)), o;
  }
  function Mf(e, t) {
    function n(y) {
      var A = (l(), w)[y + 4 >>> 2 >>> 0];
      if (A) return { type: Gu[A], hasDynamicOffset: !!(l(), w)[y + 8 >>> 2 >>> 0], minBindingSize: gt(y + 16) };
    }
    function o(y) {
      if (y = (l(), w)[y + 4 >>> 2 >>> 0]) return { type: Hu[y] };
    }
    function u(y) {
      var A = (l(), w)[y + 4 >>> 2 >>> 0];
      if (A) return { sampleType: Ju[A], viewDimension: go[(l(), M)[y + 8 >>> 2 >>> 0]], multisampled: !!(l(), w)[y + 12 >>> 2 >>> 0] };
    }
    function c(y) {
      var A = (l(), w)[y + 4 >>> 2 >>> 0];
      if (A) return { access: qu[A], format: Yu[(l(), M)[y + 8 >>> 2 >>> 0]], viewDimension: go[(l(), M)[y + 12 >>> 2 >>> 0]] };
    }
    function h(y) {
      var A = { binding: (l(), w)[y + 4 >>> 2 >>> 0], visibility: (l(), w)[y + 8 >>> 2 >>> 0], buffer: n(y + 24), sampler: o(y + 48), texture: u(y + 56), storageTexture: c(y + 72) };
      return $r(y, { 13: () => {
        A.externalTexture = {};
      } }), A;
    }
    e >>>= 0, t = { label: Ae((t >>>= 0) + 4), entries: (function(y, A) {
      for (var F = [], j = 0; j < y; ++j) F.push(h(A + 88 * j));
      return F;
    })((l(), w)[t + 12 >>> 2 >>> 0], (l(), w)[t + 16 >>> 2 >>> 0]) }, e = C(e);
    var m = Co(0);
    return lo(m, e.createBindGroupLayout(t)), m;
  }
  function Cf(e, t) {
    var n;
    return e >>>= 0, (t >>>= 0) && (n = { label: Ae(t + 4) }), t = C(e), e = Po(0), n = t.createCommandEncoder(n), se[e >>> 0] = n, e;
  }
  function Df(e, t) {
    e >>>= 0, t >>>= 0;
    for (var n = (l(), w)[t + 12 >>> 2 >>> 0], o = (l(), w)[t + 16 >>> 2 >>> 0], u = [], c = 0; c < n; ++c) u.push(C((l(), w)[o + 4 * c >>> 2 >>> 0]));
    return t = { label: Ae(t + 4), bindGroupLayouts: u, immediateSize: (l(), w)[t + 20 >>> 2 >>> 0] }, n = C(e), e = _o(0), t = n.createPipelineLayout(t), se[e >>> 0] = t, e;
  }
  function Pf(e, t) {
    e >>>= 0, t >>>= 0, t = { type: ju[(l(), M)[t + 12 >>> 2 >>> 0]], count: (l(), w)[t + 16 >>> 2 >>> 0] };
    var n = C(e);
    return e = Ro(0), t = n.createQuerySet(t), se[e >>> 0] = t, e;
  }
  function Uf(e, t) {
    return Fu(C(e >>> 0).adapterInfo, t >>> 0), 1;
  }
  var _f = { "core-features-and-limits": 1, "depth-clip-control": 2, "depth32float-stencil8": 3, "texture-compression-bc": 4, "texture-compression-bc-sliced-3d": 5, "texture-compression-etc2": 6, "texture-compression-astc": 7, "texture-compression-astc-sliced-3d": 8, "timestamp-query": 9, "indirect-first-instance": 10, "shader-f16": 11, "rg11b10ufloat-renderable": 12, "bgra8unorm-storage": 13, "float32-filterable": 14, "float32-blendable": 15, "clip-distances": 16, "dual-source-blending": 17, subgroups: 18, "texture-formats-tier1": 19, "texture-formats-tier2": 20, "primitive-index": 21, "texture-component-swizzle": 22, "subgroup-size-control": 23, "chromium-experimental-unorm16-texture-formats": 327692, "chromium-experimental-multi-draw-indirect": 327729, "chromium-experimental-subgroup-matrix": 327732 };
  function Rf(e, t) {
    t >>>= 0;
    var n = C(e >>> 0);
    e = nt(4 * n.features.size);
    var o = 0, u = 0;
    for (let c of n.features) 0 <= (n = _f[c]) && ((l(), M)[e + o >>> 2 >>> 0] = n, o += 4, u++);
    (l(), w)[t + 4 >>> 2 >>> 0] = e, (l(), w)[t >>> 2 >>> 0] = u;
  }
  function Nf(e, t) {
    return mo(C(e >>> 0).limits, t >>> 0), 1;
  }
  function kf(e, t) {
    C(e >>> 0).pushErrorScope($u[t]);
  }
  function Wf(e, t, n) {
    t >>>= 0, n >>>= 0, e = C(e >>> 0), t = Array.from((l(), M).subarray(n >>> 2 >>> 0, n + 4 * t >>> 2 >>> 0), (o) => C(o)), e.submit(t);
  }
  function Ff(e, t, n, o, u) {
    n = ae(n), o >>>= 0, u >>>= 0, e = C(e >>> 0), t = C(t >>> 0), o = (l(), te).subarray(o >>> 0, o + u >>> 0), e.writeBuffer(t, n, o, 0, u);
  }
  i2 || (function() {
    for (var e = r.numThreads - 1; e--; ) In();
    kt.push(async () => {
      var t = (async function() {
        if (!i2) return Promise.all(Pe.map(Ln));
      })();
      be++, await t, --be == 0 && he && (t = he, he = null, t());
    });
  })(), i2 || (je = new WebAssembly.Memory({ initial: 256, maximum: 65536, shared: true }), de()), r.wasmBinary && (S = r.wasmBinary), r.stackSave = () => _(), r.stackRestore = (e) => U(e), r.stackAlloc = (e) => Xt(e), r.setValue = function(e, t, n = "i8") {
    switch (n.endsWith("*") && (n = "*"), n) {
      case "i1":
      case "i8":
        (l(), ee)[e >>> 0] = t;
        break;
      case "i16":
        (l(), De)[e >>> 1 >>> 0] = t;
        break;
      case "i32":
        (l(), M)[e >>> 2 >>> 0] = t;
        break;
      case "i64":
        (l(), P)[e >>> 3 >>> 0] = BigInt(t);
        break;
      case "float":
        (l(), ne)[e >>> 2 >>> 0] = t;
        break;
      case "double":
        (l(), Ee)[e >>> 3 >>> 0] = t;
        break;
      case "*":
        (l(), w)[e >>> 2 >>> 0] = t;
        break;
      default:
        Z(`invalid type for setValue: ${n}`);
    }
  }, r.getValue = function(e, t = "i8") {
    switch (t.endsWith("*") && (t = "*"), t) {
      case "i1":
      case "i8":
        return (l(), ee)[e >>> 0];
      case "i16":
        return (l(), De)[e >>> 1 >>> 0];
      case "i32":
        return (l(), M)[e >>> 2 >>> 0];
      case "i64":
        return (l(), P)[e >>> 3 >>> 0];
      case "float":
        return (l(), ne)[e >>> 2 >>> 0];
      case "double":
        return (l(), Ee)[e >>> 3 >>> 0];
      case "*":
        return (l(), w)[e >>> 2 >>> 0];
      default:
        Z(`invalid type for getValue: ${t}`);
    }
  }, r.UTF8ToString = ht, r.stringToUTF8 = _e, r.lengthBytesUTF8 = Re;
  var Lo, Io, Bo, jr, Jt, ve, nt, Oo, Mo, Co, Do, Po, Uo, _o, Ro, No, ko, Wo, Hr, qr, Yr, Jr, Bt, Xr, Fo, Zr, Go, $o, zo, Kr, Vo, jo, Qr, W, Ot, Ho, U, Xt, _, qo, en, Yo, Jo, Xo, tn, Zo, Ko, Qo, ea, ta, ra, na, oa, aa, sa, ia, ua, fa, ca, da, la, pa, ma, ha, ba, ga, ya, wa, va, Ta, Ea, Sa, Aa, xa, La, Ia, Ba, Oa, Ma, Ca, Da, Pa, Ua, _a2, Ra, Na, ka, ke, Gf = [ye, Ve, Mn, _n, Rn, Nn, kn, Wn, Fn, Gn, $n, zn, Vn, jn, Hn, qn, ao, so, io, wo, vo, To, Eo, So, Ao, xo], rn = { 1428092: (e, t, n, o, u) => {
    if (r === void 0 || !r.md) return 1;
    if ((e = ht(Number(e >>> 0))).startsWith("./") && (e = e.substring(2)), !(e = r.md.get(e))) return 2;
    if (t = Number(t >>> 0), n = Number(n >>> 0), o = Number(o >>> 0), t + n > e.byteLength) return 3;
    try {
      let c = e.subarray(t, t + n);
      switch (u) {
        case 0:
          (l(), te).set(c, o >>> 0);
          break;
        case 1:
          r.xe ? r.xe(o, c) : r.Ze(o, c);
          break;
        default:
          return 4;
      }
      return 0;
    } catch {
      return 4;
    }
  }, 1428916: () => typeof navigator < "u" && navigator.gpu ? 1 : 0, 1428988: (e, t, n) => {
    r.ze(e, (l(), te).subarray(t >>> 0, t + n >>> 0));
  }, 1429052: () => r.Xe(), 1429094: (e) => {
    r.ye(e);
  }, 1429131: () => typeof wasmOffsetConverter < "u" };
  function $f() {
    return typeof wasmOffsetConverter < "u";
  }
  function zf(e, t, n, o) {
    var u = _();
    try {
      return sa(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Vf(e, t, n) {
    var o = _();
    try {
      return oa(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      W(1, 0);
    }
  }
  function jf(e) {
    var t = _();
    try {
      ta(e);
    } catch (n) {
      if (U(t), n !== n + 0) throw n;
      W(1, 0);
    }
  }
  function Hf(e, t) {
    var n = _();
    try {
      return tn(e, t);
    } catch (o) {
      if (U(n), o !== o + 0) throw o;
      W(1, 0);
    }
  }
  function qf(e, t, n) {
    var o = _();
    try {
      Xo(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      W(1, 0);
    }
  }
  function Yf(e, t, n, o) {
    var u = _();
    try {
      return da(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Jf(e, t) {
    var n = _();
    try {
      ia(e, t);
    } catch (o) {
      if (U(n), o !== o + 0) throw o;
      W(1, 0);
    }
  }
  function Xf(e, t, n, o, u, c, h) {
    var m = _();
    try {
      return na(e, t, n, o, u, c, h);
    } catch (y) {
      if (U(m), y !== y + 0) throw y;
      W(1, 0);
    }
  }
  function Zf(e, t, n, o, u, c) {
    var h = _();
    try {
      Zo(e, t, n, o, u, c);
    } catch (m) {
      if (U(h), m !== m + 0) throw m;
      W(1, 0);
    }
  }
  function Kf(e, t, n, o) {
    var u = _();
    try {
      Qo(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Qf(e, t, n, o, u, c, h) {
    var m = _();
    try {
      fa(e, t, n, o, u, c, h);
    } catch (y) {
      if (U(m), y !== y + 0) throw y;
      W(1, 0);
    }
  }
  function ec2(e, t, n, o, u, c, h) {
    var m = _();
    try {
      ca(e, t, n, o, u, c, h);
    } catch (y) {
      if (U(m), y !== y + 0) throw y;
      W(1, 0);
    }
  }
  function tc(e, t, n, o, u, c, h, m) {
    var y = _();
    try {
      va(e, t, n, o, u, c, h, m);
    } catch (A) {
      if (U(y), A !== A + 0) throw A;
      W(1, 0);
    }
  }
  function rc(e, t, n, o, u, c, h, m, y, A, F, j) {
    var I = _();
    try {
      la(e, t, n, o, u, c, h, m, y, A, F, j);
    } catch (q) {
      if (U(I), q !== q + 0) throw q;
      W(1, 0);
    }
  }
  function nc(e, t, n, o, u) {
    var c = _();
    try {
      return ua(e, t, n, o, u);
    } catch (h) {
      if (U(c), h !== h + 0) throw h;
      W(1, 0);
    }
  }
  function oc(e, t, n, o, u, c) {
    var h = _();
    try {
      Ta(e, t, n, o, u, c);
    } catch (m) {
      if (U(h), m !== m + 0) throw m;
      W(1, 0);
    }
  }
  function ac(e, t, n, o, u) {
    var c = _();
    try {
      ra(e, t, n, o, u);
    } catch (h) {
      if (U(c), h !== h + 0) throw h;
      W(1, 0);
    }
  }
  function sc(e, t, n, o, u, c, h, m) {
    var y = _();
    try {
      aa(e, t, n, o, u, c, h, m);
    } catch (A) {
      if (U(y), A !== A + 0) throw A;
      W(1, 0);
    }
  }
  function ic(e) {
    var t = _();
    try {
      return Ea(e);
    } catch (n) {
      if (U(t), n !== n + 0) throw n;
      W(1, 0);
    }
  }
  function uc(e, t, n, o, u, c, h, m, y) {
    var A = _();
    try {
      Ko(e, t, n, o, u, c, h, m, y);
    } catch (F) {
      if (U(A), F !== F + 0) throw F;
      W(1, 0);
    }
  }
  function fc(e, t, n) {
    var o = _();
    try {
      return ea(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      W(1, 0);
    }
  }
  function cc(e, t) {
    var n = _();
    try {
      return Pa(e, t);
    } catch (o) {
      if (U(n), o !== o + 0) throw o;
      return W(1, 0), 0n;
    }
  }
  function dc(e, t, n, o) {
    var u = _();
    try {
      return Sa(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function lc(e, t, n, o, u, c, h) {
    var m = _();
    try {
      Ua(e, t, n, o, u, c, h);
    } catch (y) {
      if (U(m), y !== y + 0) throw y;
      W(1, 0);
    }
  }
  function pc(e) {
    var t = _();
    try {
      return pa(e);
    } catch (n) {
      if (U(t), n !== n + 0) throw n;
      return W(1, 0), 0n;
    }
  }
  function mc(e, t, n, o, u) {
    var c = _();
    try {
      return Aa(e, t, n, o, u);
    } catch (h) {
      if (U(c), h !== h + 0) throw h;
      W(1, 0);
    }
  }
  function hc(e, t, n, o, u, c) {
    var h = _();
    try {
      return xa(e, t, n, o, u, c);
    } catch (m) {
      if (U(h), m !== m + 0) throw m;
      W(1, 0);
    }
  }
  function bc(e, t, n, o, u, c) {
    var h = _();
    try {
      return ya(e, t, n, o, u, c);
    } catch (m) {
      if (U(h), m !== m + 0) throw m;
      W(1, 0);
    }
  }
  function gc(e, t, n, o, u, c) {
    var h = _();
    try {
      return La(e, t, n, o, u, c);
    } catch (m) {
      if (U(h), m !== m + 0) throw m;
      W(1, 0);
    }
  }
  function yc(e, t, n, o, u, c, h, m) {
    var y = _();
    try {
      return wa(e, t, n, o, u, c, h, m);
    } catch (A) {
      if (U(y), A !== A + 0) throw A;
      W(1, 0);
    }
  }
  function wc(e, t, n, o, u) {
    var c = _();
    try {
      return Ia(e, t, n, o, u);
    } catch (h) {
      if (U(c), h !== h + 0) throw h;
      return W(1, 0), 0n;
    }
  }
  function vc(e, t, n, o) {
    var u = _();
    try {
      return Ba(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Tc(e, t, n, o) {
    var u = _();
    try {
      return Oa(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Ec(e, t, n, o, u, c, h, m, y, A, F, j) {
    var I = _();
    try {
      return Ma(e, t, n, o, u, c, h, m, y, A, F, j);
    } catch (q) {
      if (U(I), q !== q + 0) throw q;
      W(1, 0);
    }
  }
  function Sc(e, t, n, o, u, c, h, m, y, A, F) {
    var j = _();
    try {
      Ca(e, t, n, o, u, c, h, m, y, A, F);
    } catch (I) {
      if (U(j), I !== I + 0) throw I;
      W(1, 0);
    }
  }
  function Ac(e, t, n, o, u, c, h, m, y, A, F, j, I, q, pe, ue) {
    var ot = _();
    try {
      Da(e, t, n, o, u, c, h, m, y, A, F, j, I, q, pe, ue);
    } catch (at) {
      if (U(ot), at !== at + 0) throw at;
      W(1, 0);
    }
  }
  function xc(e, t, n) {
    var o = _();
    try {
      return ha(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      return W(1, 0), 0n;
    }
  }
  function Lc(e, t, n) {
    var o = _();
    try {
      return ma(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      W(1, 0);
    }
  }
  function Ic(e, t, n) {
    var o = _();
    try {
      return ba(e, t, n);
    } catch (u) {
      if (U(o), u !== u + 0) throw u;
      W(1, 0);
    }
  }
  function Bc(e, t, n, o) {
    var u = _();
    try {
      ga(e, t, n, o);
    } catch (c) {
      if (U(u), c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Zt() {
    if (0 < be) he = Zt;
    else if (i2) L?.(r), re();
    else {
      for (var e = kt; 0 < e.length; ) e.shift()(r);
      0 < be ? he = Zt : (r.calledRun = true, V || (re(), L?.(r)));
    }
  }
  return i2 || (ke = await pt(), Zt()), r.PTR_SIZE = 4, r.webgpuInit = (e) => {
    let t = /* @__PURE__ */ new WeakMap(), n, o, u = 1;
    r.webgpuRegisterDevice = (m) => {
      if (o !== void 0) throw Error("another WebGPU EP inference session is being created.");
      if (m) {
        var y = t.get(m);
        if (!y) {
          let A = ((F, j = 0) => {
            var I = Wo(j);
            return j = ko(j, I), se[I >>> 0] = F.queue, se[j >>> 0] = F, j;
          })(m, y = Bo());
          y = [u++, y, A], t.set(m, y);
        }
        return n = m, o = y[0], y;
      }
      n = void 0, o = 0;
    };
    let c = /* @__PURE__ */ new Map();
    r.webgpuOnCreateSession = (m) => {
      if (o !== void 0) {
        var y = o;
        if (o = void 0, m) {
          let A = jr(y);
          c.set(m, A), y === 0 && e(n ?? C(A));
        }
        n = void 0;
      }
    }, r.webgpuOnReleaseSession = (m) => {
      c.delete(m);
    };
    let h = /* @__PURE__ */ Symbol("gpuBufferMetadata");
    r.webgpuRegisterBuffer = (m, y, A) => {
      if (A) return m[h] = [A, NaN], A;
      if (A = m[h]) return A[1]++, A[0];
      if ((y = c.get(y)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      return y = ((F, j = 0) => (F.mapState === "unmapped" || Z(), j = No(j), se[j >>> 0] = F, j))(m, y), m[h] = [y, 1], y;
    }, r.webgpuUnregisterBuffer = (m) => {
      let y = m[h];
      if (!y) throw Error("Buffer is not registered");
      y[1]--, y[1] === 0 && (Oo(y[0]), delete m[h]);
    }, r.webgpuGetBuffer = (m) => C(m), r.webgpuCreateDownloader = (m, y, A) => {
      if ((A = c.get(A)) === void 0) throw Error("Invalid session handle passed to webgpuRegisterBuffer");
      let F = C(A), j = 16 * Math.ceil(Number(y) / 16);
      return async () => {
        let I = F.createBuffer({ size: j, usage: 9 });
        try {
          let q = F.createCommandEncoder();
          return q.copyBufferToBuffer(m, 0, I, 0, j), F.queue.submit([q.finish()]), await I.mapAsync(GPUMapMode.READ), I.getMappedRange().slice(0, y);
        } finally {
          I.destroy();
        }
      };
    }, r.xe = (m, y) => {
      var A = y.buffer;
      let F = y.byteOffset, j = y.byteLength;
      if (y = 16 * Math.ceil(Number(j) / 16), m = C(m), !n) {
        var I = jr(o);
        n = C(I);
      }
      let q = (I = n.createBuffer({ mappedAtCreation: true, size: y, usage: 6 })).getMappedRange();
      new Uint8Array(q).set(new Uint8Array(A, F, j)), I.unmap(), (A = n.createCommandEncoder()).copyBufferToBuffer(I, 0, m, 0, y), n.queue.submit([A.finish()]), I.destroy();
    };
  }, r.webnnInit = (e) => {
    let t = e[0];
    [r.Xe, r.ye, r.webnnEnsureTensor, r.ze, r.webnnDownloadTensor, r.We, r.webnnEnableTraceEvent] = e.slice(1), r.webnnReleaseTensorId = r.ye, r.webnnUploadTensor = r.ze, r.webnnRegisterMLContext = r.We, r.webnnOnRunStart = (n) => t.onRunStart(n), r.webnnOnRunEnd = t.onRunEnd.bind(t), r.webnnOnReleaseSession = (n) => {
      t.onReleaseSession(n);
    }, r.webnnCreateMLTensorDownloader = (n, o) => t.createMLTensorDownloader(n, o), r.webnnRegisterMLTensor = (n, o, u, c) => t.registerMLTensor(n, o, u, c), r.webnnCreateMLContext = (n) => t.createMLContext(n), r.webnnRegisterGraphInput = t.registerGraphInput.bind(t), r.webnnIsGraphInput = t.isGraphInput.bind(t), r.webnnRegisterGraphOutput = t.registerGraphOutput.bind(t), r.webnnIsGraphOutput = t.isGraphOutput.bind(t), r.webnnCreateTemporaryTensor = t.createTemporaryTensor.bind(t), r.webnnIsGraphInputOutputTypeSupported = t.isGraphInputOutputTypeSupported.bind(t);
  }, X ? r : new Promise((e, t) => {
    L = e, D = t;
  });
}
var Rc;
var Nc;
var xs = G(() => {
  "use strict";
  Rc = Ss, Nc = globalThis.self?.name?.startsWith("em-pthread");
  Nc && Ss();
});
var Bs;
var pn;
var kc;
var ge;
var Os;
var ln;
var Wc;
var Fc;
var Ms;
var Gc;
var Ls;
var Cs;
var Is;
var Ds;
var or = G(() => {
  "use strict";
  nr();
  Bs = typeof location > "u" ? void 0 : location.origin, pn = import.meta.url > "file:" && import.meta.url < "file;", kc = () => {
    if (true) {
      if (pn) {
        let a = URL;
        return new URL(new a("ort.webgpu.bundle.min.mjs", import.meta.url).href, Bs).href;
      }
      return import.meta.url;
    }
  }, ge = kc(), Os = () => {
    if (ge && !ge.startsWith("blob:")) return ge.substring(0, ge.lastIndexOf("/") + 1);
  }, ln = (a, r) => {
    try {
      let s = r ?? ge;
      return (s ? new URL(a, s) : new URL(a)).origin === Bs;
    } catch {
      return false;
    }
  }, Wc = (a, r) => {
    let s = r ?? ge;
    try {
      return (s ? new URL(a, s) : new URL(a)).href;
    } catch {
      return;
    }
  }, Fc = (a, r) => `${r ?? "./"}${a}`, Ms = async (a) => {
    let s = await (await fetch(a, { credentials: "same-origin" })).blob();
    return URL.createObjectURL(s);
  }, Gc = async (a) => (await import(
    /*webpackIgnore:true*/
    /*@vite-ignore*/
    a
  )).default, Ls = (Es(), Kt(Ts)).default, Cs = async () => {
    if (!ge) throw new Error("Failed to load proxy worker: cannot determine the script source URL.");
    if (ln(ge)) return [void 0, Ls()];
    let a = await Ms(ge);
    return [a, Ls(a)];
  }, Is = (xs(), Kt(As)).default, Ds = async (a, r, s, f2) => {
    let i2 = Is && !(a || r);
    if (i2) if (ge) i2 = ln(ge) || f2 && !s;
    else if (f2 && !s) i2 = true;
    else throw new Error("cannot determine the script source URL.");
    if (i2) return [void 0, Is];
    {
      let p = "ort-wasm-simd-threaded.asyncify.mjs", g = a ?? Wc(p, r), d = s && g && !ln(g, r), b = d ? await Ms(g) : g ?? Fc(p, r);
      return [d ? b : void 0, await Gc(b)];
    }
  };
});
var mn;
var hn;
var pr;
var Ps;
var $c;
var zc;
var Vc;
var ar;
var $;
var Xe = G(() => {
  "use strict";
  or();
  hn = false, pr = false, Ps = false, $c = () => {
    if (typeof SharedArrayBuffer > "u") return false;
    try {
      return typeof MessageChannel < "u" && new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)), WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 5, 4, 1, 3, 1, 1, 10, 11, 1, 9, 0, 65, 0, 254, 16, 2, 0, 26, 11]));
    } catch {
      return false;
    }
  }, zc = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 2, 1, 0, 10, 30, 1, 28, 0, 65, 0, 253, 15, 253, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 253, 186, 1, 26, 11]));
    } catch {
      return false;
    }
  }, Vc = () => {
    try {
      return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 19, 1, 17, 0, 65, 1, 253, 15, 65, 2, 253, 15, 65, 3, 253, 15, 253, 147, 2, 11]));
    } catch {
      return false;
    }
  }, ar = async (a) => {
    if (hn) return Promise.resolve();
    if (pr) throw new Error("multiple calls to 'initializeWebAssembly()' detected.");
    if (Ps) throw new Error("previous call to 'initializeWebAssembly()' failed.");
    pr = true;
    let r = a.initTimeout, s = a.numThreads;
    if (a.simd !== false) {
      if (a.simd === "relaxed") {
        if (!Vc()) throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.");
      } else if (!zc()) throw new Error("WebAssembly SIMD is not supported in the current environment.");
    }
    let f2 = $c();
    s > 1 && !f2 && (typeof self < "u" && !self.crossOriginIsolated && console.warn("env.wasm.numThreads is set to " + s + ", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."), console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."), a.numThreads = s = 1);
    let i2 = a.wasmPaths, p = typeof i2 == "string" ? i2 : void 0, g = i2?.mjs, d = g?.href ?? g, b = i2?.wasm, v = b?.href ?? b, T = a.wasmBinary, [S, E] = await Ds(d, p, s > 1, !!T || !!v), x2 = false, L = [];
    if (r > 0 && L.push(new Promise((D) => {
      setTimeout(() => {
        x2 = true, D();
      }, r);
    })), L.push(new Promise((D, H) => {
      let B = { numThreads: s };
      if (T) B.wasmBinary = T, B.locateFile = (O) => O;
      else if (v || p) B.locateFile = (O) => v ?? p + O;
      else if (d && d.indexOf("blob:") !== 0) B.locateFile = (O) => new URL(O, d).href;
      else if (S) {
        let O = Os();
        O && (B.locateFile = (Y) => O + Y);
      }
      E(B).then((O) => {
        pr = false, hn = true, mn = O, D(), S && URL.revokeObjectURL(S);
      }, (O) => {
        pr = false, Ps = true, H(O);
      });
    })), await Promise.race(L), x2) throw new Error(`WebAssembly backend initializing failed due to timeout: ${r}ms`);
  }, $ = () => {
    if (hn && mn) return mn;
    throw new Error("WebAssembly is not initialized yet.");
  };
});
var me;
var Ut;
var z;
var mr = G(() => {
  "use strict";
  Xe();
  me = (a, r) => {
    let s = $(), f2 = s.lengthBytesUTF8(a) + 1, i2 = s._malloc(f2);
    return s.stringToUTF8(a, i2, f2), r.push(i2), i2;
  }, Ut = (a, r, s, f2) => {
    if (typeof a == "object" && a !== null) {
      if (s.has(a)) throw new Error("Circular reference in options");
      s.add(a);
    }
    Object.entries(a).forEach(([i2, p]) => {
      let g = r ? r + i2 : i2;
      if (typeof p == "object") Ut(p, g + ".", s, f2);
      else if (typeof p == "string" || typeof p == "number") f2(g, p.toString());
      else if (typeof p == "boolean") f2(g, p ? "1" : "0");
      else throw new Error(`Can't handle extra config type: ${typeof p}`);
    });
  }, z = (a) => {
    let r = $(), s = r.stackSave();
    try {
      let f2 = r.PTR_SIZE, i2 = r.stackAlloc(2 * f2);
      r._OrtGetLastError(i2, i2 + f2);
      let p = Number(r.getValue(i2, f2 === 4 ? "i32" : "i64")), g = r.getValue(i2 + f2, "*"), d = g ? r.UTF8ToString(g) : "";
      throw new Error(`${a} ERROR_CODE: ${p}, ERROR_MESSAGE: ${d}`);
    } finally {
      r.stackRestore(s);
    }
  };
});
var Us;
var _s = G(() => {
  "use strict";
  Xe();
  mr();
  Us = (a, r) => {
    let s = $(), f2 = 0, i2 = [], p = a || {};
    try {
      if (a?.logSeverityLevel === void 0) p.logSeverityLevel = 2;
      else if (typeof a.logSeverityLevel != "number" || !Number.isInteger(a.logSeverityLevel) || a.logSeverityLevel < 0 || a.logSeverityLevel > 4) throw new Error(`log severity level is not valid: ${a.logSeverityLevel}`);
      if (a?.logVerbosityLevel === void 0) p.logVerbosityLevel = 0;
      else if (typeof a.logVerbosityLevel != "number" || !Number.isInteger(a.logVerbosityLevel)) throw new Error(`log verbosity level is not valid: ${a.logVerbosityLevel}`);
      a?.terminate === void 0 && (p.terminate = false);
      let g = 0;
      a?.tag !== void 0 && (g = me(a.tag, i2)), f2 = s._OrtCreateRunOptions(p.logSeverityLevel, p.logVerbosityLevel, !!p.terminate, g), f2 === 0 && z("Can't create run options."), a?.extra !== void 0 && Ut(a.extra, "", /* @__PURE__ */ new WeakSet(), (d, b) => {
        let v = me(d, i2), T = me(b, i2);
        s._OrtAddRunConfigEntry(f2, v, T) !== 0 && z(`Can't set a run config entry: ${d} - ${b}.`);
      });
      for (let d of r) s._OrtRunOptionsAddActiveLoraAdapter(f2, d) !== 0 && z("Can't add an active LoRA adapter.");
      return [f2, i2];
    } catch (g) {
      throw f2 !== 0 && s._OrtReleaseRunOptions(f2), i2.forEach((d) => s._free(d)), g;
    }
  };
});
var jc;
var Hc;
var qc;
var _t;
var Fe;
var Yc;
var Jc;
var Xc;
var Rs;
var Ns = G(() => {
  "use strict";
  Xe();
  mr();
  jc = (a) => {
    switch (a) {
      case "disabled":
        return 0;
      case "basic":
        return 1;
      case "extended":
        return 2;
      case "layout":
        return 3;
      case "all":
        return 99;
      default:
        throw new Error(`unsupported graph optimization level: ${a}`);
    }
  }, Hc = (a) => {
    switch (a) {
      case "sequential":
        return 0;
      case "parallel":
        return 1;
      default:
        throw new Error(`unsupported execution mode: ${a}`);
    }
  }, qc = (a) => {
    a.extra || (a.extra = {}), a.extra.session || (a.extra.session = {});
    let r = a.extra.session;
    r.use_ort_model_bytes_directly || (r.use_ort_model_bytes_directly = "1"), a.executionProviders && a.executionProviders.some((s) => (typeof s == "string" ? s : s.name) === "webgpu") && (a.enableMemPattern = false);
  }, _t = (a, r, s, f2) => {
    let i2 = me(r, f2), p = me(s, f2);
    $()._OrtAddSessionConfigEntry(a, i2, p) !== 0 && z(`Can't set a session config entry: ${r} - ${s}.`);
  }, Fe = (a, r, s, f2) => {
    let i2 = me(r, f2), p = me(s, f2);
    a.push([i2, p]);
  }, Yc = 9, Jc = () => {
    let a = $(), r = a.stackSave();
    try {
      let s = a.stackAlloc(a.PTR_SIZE), f2 = a.stackAlloc(a.PTR_SIZE), i2 = a._OrtGetEpDevices(s, f2);
      if (i2 === Yc) return;
      i2 !== 0 && z("Can't get execution provider devices.");
      let p = Number(a.getValue(s, "*")), g = Number(a.getValue(f2, "*")), d = /* @__PURE__ */ new Map();
      for (let b = 0; b < g; b++) {
        let v = Number(a.getValue(p + b * a.PTR_SIZE, "*")), T = a.UTF8ToString(a._OrtEpDevice_EpName(v)), S = d.get(T);
        S ? S.push(v) : d.set(T, [v]);
      }
      return d;
    } finally {
      a.stackRestore(r);
    }
  }, Xc = async (a, r, s) => {
    let f2 = r.executionProviders;
    for (let i2 of f2) {
      let p = typeof i2 == "string" ? i2 : i2.name, g = [], d;
      switch (p) {
        case "webnn":
          if (p = "WEBNN", _t(a, "session.disable_quant_qdq", "1", s), _t(a, "session.disable_qdq_constant_folding", "1", s), typeof i2 != "string") {
            let x2 = i2?.deviceType;
            x2 && _t(a, "deviceType", x2, s);
          }
          break;
        case "webgpu":
          {
            p = "WebGPU";
            let E = Jc();
            if (E !== void 0 && (p = "WebGpuExecutionProvider", d = E.get(p), d === void 0)) {
              let D = [...E.keys()].join(", ") || "(none)";
              throw new Error(`no execution provider device is registered for: ${p}. registered: ${D}.`);
            }
            let x2;
            if (typeof i2 != "string") {
              let D = i2;
              if (D.device) if (typeof GPUDevice < "u" && D.device instanceof GPUDevice) x2 = D.device;
              else throw new Error("Invalid GPU device set in WebGPU EP options.");
              let { enableGraphCapture: H } = r;
              if (typeof H == "boolean" && H && Fe(g, "enableGraphCapture", "1", s), typeof D.preferredLayout == "string" && Fe(g, "preferredLayout", D.preferredLayout, s), D.forceCpuNodeNames) {
                let B = Array.isArray(D.forceCpuNodeNames) ? D.forceCpuNodeNames : [D.forceCpuNodeNames];
                Fe(g, "forceCpuNodeNames", B.join(`
`), s);
              }
              D.validationMode && Fe(g, "validationMode", D.validationMode, s), typeof D.enableMatmulFp32Accumulation == "boolean" && Fe(g, "enableMatmulFp32Accumulation", D.enableMatmulFp32Accumulation ? "1" : "0", s);
              for (let B of ["storageBufferCacheMode", "uniformBufferCacheMode", "queryResolveBufferCacheMode", "defaultBufferCacheMode"]) {
                let O = D[B];
                if (O) {
                  if (O !== "disabled" && O !== "lazyRelease" && O !== "simple" && O !== "bucket") throw new Error(`${B} must be one of 'disabled', 'lazyRelease', 'simple' or 'bucket': ${O}`);
                  Fe(g, B, O, s);
                }
              }
            }
            let L = $().webgpuRegisterDevice(x2);
            if (L) {
              let [D, H, B] = L;
              Fe(g, "deviceId", D.toString(), s), Fe(g, "webgpuInstance", H.toString(), s), Fe(g, "webgpuDevice", B.toString(), s);
            }
          }
          break;
        case "wasm":
        case "cpu":
          continue;
        default:
          throw new Error(`not supported execution provider: ${p}`);
      }
      let b = g.length, v = 0, T = 0;
      if (b > 0) {
        v = $()._malloc(b * $().PTR_SIZE), s.push(v), T = $()._malloc(b * $().PTR_SIZE), s.push(T);
        for (let E = 0; E < b; E++) $().setValue(v + E * $().PTR_SIZE, g[E][0], "*"), $().setValue(T + E * $().PTR_SIZE, g[E][1], "*");
      }
      let S;
      if (d !== void 0) {
        let E = $()._malloc($().PTR_SIZE);
        s.push(E), $().setValue(E, d[0], "*"), S = await $()._OrtAppendExecutionProviderV2(a, E, 1, v, T, b);
      } else {
        let E = me(p, s);
        S = await $()._OrtAppendExecutionProvider(a, E, v, T, b);
      }
      S !== 0 && z(`Can't append execution provider: ${p}.`);
    }
  }, Rs = async (a) => {
    let r = $(), s = 0, f2 = [], i2 = a || {};
    qc(i2);
    try {
      let p = jc(i2.graphOptimizationLevel ?? "all"), g = Hc(i2.executionMode ?? "sequential"), d = typeof i2.logId == "string" ? me(i2.logId, f2) : 0, b = i2.logSeverityLevel ?? 2;
      if (!Number.isInteger(b) || b < 0 || b > 4) throw new Error(`log severity level is not valid: ${b}`);
      let v = i2.logVerbosityLevel ?? 0;
      if (!Number.isInteger(v) || v < 0 || v > 4) throw new Error(`log verbosity level is not valid: ${v}`);
      let T = typeof i2.optimizedModelFilePath == "string" ? me(i2.optimizedModelFilePath, f2) : 0;
      if (s = r._OrtCreateSessionOptions(p, !!i2.enableCpuMemArena, !!i2.enableMemPattern, g, !!i2.enableProfiling, 0, d, b, v, T), s === 0 && z("Can't create session options."), i2.executionProviders && await Xc(s, i2, f2), i2.enableGraphCapture !== void 0) {
        if (typeof i2.enableGraphCapture != "boolean") throw new Error(`enableGraphCapture must be a boolean value: ${i2.enableGraphCapture}`);
        _t(s, "enableGraphCapture", i2.enableGraphCapture.toString(), f2);
      }
      if (i2.freeDimensionOverrides) for (let [S, E] of Object.entries(i2.freeDimensionOverrides)) {
        if (typeof S != "string") throw new Error(`free dimension override name must be a string: ${S}`);
        if (typeof E != "number" || !Number.isInteger(E) || E < 0) throw new Error(`free dimension override value must be a non-negative integer: ${E}`);
        let x2 = me(S, f2);
        r._OrtAddFreeDimensionOverride(s, x2, E) !== 0 && z(`Can't set a free dimension override: ${S} - ${E}.`);
      }
      return i2.extra !== void 0 && Ut(i2.extra, "", /* @__PURE__ */ new WeakSet(), (S, E) => {
        _t(s, S, E, f2);
      }), [s, f2];
    } catch (p) {
      throw s !== 0 && r._OrtReleaseSessionOptions(s) !== 0 && z("Can't release session options."), f2.forEach((g) => r._free(g)), p;
    }
  };
});
var Ze;
var hr;
var vt;
var ft;
var Rt;
var br;
var gr;
var bn;
var ct = G(() => {
  "use strict";
  Ze = (a) => {
    switch (a) {
      case "int8":
        return 3;
      case "uint8":
        return 2;
      case "bool":
        return 9;
      case "int16":
        return 5;
      case "uint16":
        return 4;
      case "int32":
        return 6;
      case "uint32":
        return 12;
      case "float16":
        return 10;
      case "float32":
        return 1;
      case "float64":
        return 11;
      case "string":
        return 8;
      case "int64":
        return 7;
      case "uint64":
        return 13;
      case "int4":
        return 22;
      case "uint4":
        return 21;
      default:
        throw new Error(`unsupported data type: ${a}`);
    }
  }, hr = (a) => {
    switch (a) {
      case 3:
        return "int8";
      case 2:
        return "uint8";
      case 9:
        return "bool";
      case 5:
        return "int16";
      case 4:
        return "uint16";
      case 6:
        return "int32";
      case 12:
        return "uint32";
      case 10:
        return "float16";
      case 1:
        return "float32";
      case 11:
        return "float64";
      case 8:
        return "string";
      case 7:
        return "int64";
      case 13:
        return "uint64";
      case 22:
        return "int4";
      case 21:
        return "uint4";
      default:
        throw new Error(`unsupported data type: ${a}`);
    }
  }, vt = (a, r) => {
    let s = [-1, 4, 1, 1, 2, 2, 4, 8, -1, 1, 2, 8, 4, 8, -1, -1, -1, -1, -1, -1, -1, 0.5, 0.5][a], f2 = typeof r == "number" ? r : r.reduce((i2, p) => i2 * p, 1);
    return s > 0 ? Math.ceil(f2 * s) : void 0;
  }, ft = (a) => {
    switch (a) {
      case "float16":
        return typeof Float16Array < "u" ? Float16Array : Uint16Array;
      case "float32":
        return Float32Array;
      case "uint8":
        return Uint8Array;
      case "int8":
        return Int8Array;
      case "uint16":
        return Uint16Array;
      case "int16":
        return Int16Array;
      case "int32":
        return Int32Array;
      case "bool":
        return Uint8Array;
      case "float64":
        return Float64Array;
      case "uint32":
        return Uint32Array;
      case "int64":
        return BigInt64Array;
      case "uint64":
        return BigUint64Array;
      default:
        throw new Error(`unsupported type: ${a}`);
    }
  }, Rt = (a) => {
    switch (a) {
      case "verbose":
        return 0;
      case "info":
        return 1;
      case "warning":
        return 2;
      case "error":
        return 3;
      case "fatal":
        return 4;
      default:
        throw new Error(`unsupported logging level: ${a}`);
    }
  }, br = (a) => a === "float32" || a === "float16" || a === "int32" || a === "int64" || a === "uint32" || a === "uint8" || a === "bool" || a === "uint4" || a === "int4", gr = (a) => a === "float32" || a === "float16" || a === "int32" || a === "int64" || a === "uint32" || a === "uint64" || a === "int8" || a === "uint8" || a === "bool" || a === "uint4" || a === "int4", bn = (a) => {
    switch (a) {
      case "none":
        return 0;
      case "cpu":
        return 1;
      case "cpu-pinned":
        return 2;
      case "texture":
        return 3;
      case "gpu-buffer":
        return 4;
      case "ml-tensor":
        return 5;
      default:
        throw new Error(`unsupported data location: ${a}`);
    }
  };
});
var dt;
var yr = G(() => {
  "use strict";
  nr();
  dt = async (a) => {
    if (typeof a == "string") if (false) try {
      let { readFile: r } = on("node:fs/promises");
      return new Uint8Array(await r(a));
    } catch (r) {
      if (r.code === "ERR_FS_FILE_TOO_LARGE") {
        let { createReadStream: s } = on("node:fs"), f2 = s(a), i2 = [];
        for await (let p of f2) i2.push(p);
        return new Uint8Array(Buffer.concat(i2));
      }
      throw r;
    }
    else {
      let r = await fetch(a);
      if (!r.ok) throw new Error(`failed to load external data file: ${a}`);
      let s = r.headers.get("Content-Length"), f2 = s ? parseInt(s, 10) : 0;
      if (f2 < 1073741824) return new Uint8Array(await r.arrayBuffer());
      {
        if (!r.body) throw new Error(`failed to load external data file: ${a}, no response body.`);
        let i2 = r.body.getReader(), p;
        try {
          p = new ArrayBuffer(f2);
        } catch (d) {
          if (d instanceof RangeError) {
            let b = Math.ceil(f2 / 65536);
            p = new WebAssembly.Memory({ initial: b, maximum: b }).buffer;
          } else throw d;
        }
        let g = 0;
        for (; ; ) {
          let { done: d, value: b } = await i2.read();
          if (d) break;
          let v = b.byteLength;
          new Uint8Array(p, g, v).set(b), g += v;
        }
        return new Uint8Array(p, 0, f2);
      }
    }
    else return a instanceof Blob ? new Uint8Array(await a.arrayBuffer()) : a instanceof Uint8Array ? a : new Uint8Array(a);
  };
});
var ks;
var Ws = G(() => {
  "use strict";
  ct();
  ks = (a, r) => new (ft(r))(a);
});
var Zc;
var Kc;
var Fs;
var Gs;
var $s;
var Qc;
var fe;
var gn = G(() => {
  "use strict";
  ct();
  Zc = ["V", "I", "W", "E", "F"], Kc = (a, r) => {
    console.log(`[${Zc[a]},${(/* @__PURE__ */ new Date()).toISOString()}]${r}`);
  }, $s = (a, r) => {
    Fs = a, Gs = r;
  }, Qc = (a, r) => {
    let s = Rt(a), f2 = Rt(Fs);
    s >= f2 && Kc(s, typeof r == "function" ? r() : r);
  }, fe = (...a) => {
    Gs && Qc(...a);
  };
});
var Vs;
var ed;
var js;
var td;
var zs;
var rd;
var Hs;
var wr;
var vr;
var yn;
var qs;
var Ys = G(() => {
  "use strict";
  ct();
  gn();
  Vs = /* @__PURE__ */ new Map([["float32", 32], ["float16", 16], ["int32", 32], ["uint32", 32], ["int64", 64], ["uint64", 64], ["int8", 8], ["uint8", 8], ["int4", 4], ["uint4", 4]]), ed = (a, r) => {
    if (r === "int32") return a;
    let s = Vs.get(r);
    if (!s) throw new Error(`WebNN backend does not support data type: ${r}`);
    let f2 = s / 8;
    if (a.byteLength % f2 !== 0) throw new Error(`Invalid Uint8Array length - must be a multiple of ${f2}.`);
    let i2 = a.byteLength / f2, p = new (ft(r))(a.buffer, a.byteOffset, i2);
    switch (r) {
      case "int64":
      case "uint64": {
        let g = new Int32Array(i2);
        for (let d = 0; d < i2; d++) {
          let b = p[d];
          if (b > 2147483647n || b < -2147483648n) throw new Error("Can not convert int64 data to int32 - value out of range.");
          g[d] = Number(b);
        }
        return new Uint8Array(g.buffer);
      }
      case "int8":
      case "uint8":
      case "uint32": {
        if (r === "uint32" && p.some((d) => d > 2147483647)) throw new Error("Can not convert uint32 data to int32 - value out of range.");
        let g = Int32Array.from(p, Number);
        return new Uint8Array(g.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from ${r} to 'int32'`);
    }
  }, js = (a, r) => {
    if (r === "int32") return a;
    if (a.byteLength % 4 !== 0) throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");
    let s = a.byteLength / 4, f2 = new Int32Array(a.buffer, a.byteOffset, s);
    switch (r) {
      case "int64": {
        let i2 = BigInt64Array.from(f2, BigInt);
        return new Uint8Array(i2.buffer);
      }
      case "uint64": {
        if (f2.some((p) => p < 0)) throw new Error("Can not convert int32 data to uin64 - negative value found.");
        let i2 = BigUint64Array.from(f2, BigInt);
        return new Uint8Array(i2.buffer);
      }
      case "int8": {
        if (f2.some((p) => p < -128 || p > 127)) throw new Error("Can not convert int32 data to int8 - value out of range.");
        let i2 = Int8Array.from(f2, Number);
        return new Uint8Array(i2.buffer);
      }
      case "uint8": {
        if (f2.some((i2) => i2 < 0 || i2 > 255)) throw new Error("Can not convert int32 data to uint8 - value out of range.");
        return Uint8Array.from(f2, Number);
      }
      case "uint32": {
        if (f2.some((p) => p < 0)) throw new Error("Can not convert int32 data to uint32 - negative value found.");
        let i2 = Uint32Array.from(f2, Number);
        return new Uint8Array(i2.buffer);
      }
      default:
        throw new Error(`Unsupported data conversion from 'int32' to ${r}`);
    }
  }, td = 1, zs = () => td++, rd = /* @__PURE__ */ new Map([["int8", "int32"], ["uint8", "int32"], ["uint32", "int32"], ["int64", "int32"]]), Hs = (a, r) => {
    let s = Vs.get(a);
    if (!s) throw new Error(`WebNN backend does not support data type: ${a}`);
    return r.length > 0 ? Math.ceil(r.reduce((f2, i2) => f2 * i2) * s / 8) : 0;
  }, wr = class {
    constructor(r) {
      this.isDataConverted = false;
      let { sessionId: s, context: f2, tensor: i2, dataType: p, shape: g, fallbackDataType: d } = r;
      this.sessionId = s, this.mlContext = f2, this.mlTensor = i2, this.dataType = p, this.tensorShape = g, this.fallbackDataType = d;
    }
    get tensor() {
      return this.mlTensor;
    }
    get type() {
      return this.dataType;
    }
    get fallbackType() {
      return this.fallbackDataType;
    }
    get shape() {
      return this.tensorShape;
    }
    get byteLength() {
      return Hs(this.dataType, this.tensorShape);
    }
    destroy() {
      fe("verbose", () => "[WebNN] TensorWrapper.destroy"), this.mlTensor.destroy();
    }
    write(r) {
      this.mlContext.writeTensor(this.mlTensor, r);
    }
    async read(r) {
      if (this.fallbackDataType) {
        let s = await this.mlContext.readTensor(this.mlTensor), f2 = js(new Uint8Array(s), this.dataType);
        if (r) {
          (r instanceof ArrayBuffer ? new Uint8Array(r) : new Uint8Array(r.buffer, r.byteOffset, r.byteLength)).set(f2);
          return;
        } else return new Uint8Array(f2).buffer;
      } else return r ? this.mlContext.readTensor(this.mlTensor, r) : this.mlContext.readTensor(this.mlTensor);
    }
    canReuseTensor(r, s, f2) {
      return this.mlContext === r && this.dataType === s && this.tensorShape.length === f2.length && this.tensorShape.every((i2, p) => i2 === f2[p]);
    }
    setIsDataConverted(r) {
      this.isDataConverted = r;
    }
  }, vr = class {
    constructor(r, s) {
      this.tensorManager = r;
      this.wrapper = s;
    }
    get tensorWrapper() {
      return this.wrapper;
    }
    releaseTensor() {
      this.tensorWrapper && (this.tensorManager.releaseTensor(this.tensorWrapper), this.wrapper = void 0);
    }
    async ensureTensor(r, s, f2, i2) {
      let p = this.tensorManager.getMLContext(r), g = this.tensorManager.getMLOpSupportLimits(r), d;
      if (!g?.input.dataTypes.includes(s)) {
        if (d = rd.get(s), !d || !g?.input.dataTypes.includes(d)) throw new Error(`WebNN backend does not support data type: ${s}`);
        fe("verbose", () => `[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${s} to ${d}`);
      }
      if (this.wrapper) {
        if (this.wrapper.canReuseTensor(p, s, f2)) return this.wrapper.tensor;
        if (i2) {
          if (this.wrapper.byteLength !== Hs(s, f2)) throw new Error("Unable to copy data to tensor with different size.");
          this.activeUpload = new Uint8Array(await this.wrapper.read());
        }
        this.tensorManager.releaseTensor(this.wrapper);
      }
      let b = typeof MLTensorUsage > "u" ? void 0 : MLTensorUsage.READ | MLTensorUsage.WRITE;
      return this.wrapper = await this.tensorManager.getCachedTensor(r, s, f2, b, true, true, d), i2 && this.activeUpload && (this.wrapper.write(this.activeUpload), this.activeUpload = void 0), this.wrapper.tensor;
    }
    upload(r) {
      let s = r;
      if (this.wrapper) {
        if (this.wrapper.fallbackType) if (this.wrapper.fallbackType === "int32") s = ed(r, this.wrapper.type), this.wrapper.setIsDataConverted(true);
        else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);
        if (r.byteLength === this.wrapper.byteLength) {
          this.wrapper.write(s);
          return;
        } else fe("verbose", () => "Data size does not match tensor size. Releasing tensor."), this.releaseTensor();
      }
      this.activeUpload ? this.activeUpload.set(s) : this.activeUpload = new Uint8Array(s);
    }
    async download(r) {
      if (this.activeUpload) {
        let s = this.wrapper?.isDataConverted ? js(this.activeUpload, this.wrapper?.type) : this.activeUpload;
        if (r) {
          r instanceof ArrayBuffer ? new Uint8Array(r).set(s) : new Uint8Array(r.buffer, r.byteOffset, r.byteLength).set(s);
          return;
        } else return s.buffer;
      }
      if (!this.wrapper) throw new Error("Tensor has not been created.");
      return r ? this.wrapper.read(r) : this.wrapper.read();
    }
  }, yn = class {
    constructor(r) {
      this.backend = r;
      this.tensorTrackersById = /* @__PURE__ */ new Map();
      this.freeTensors = [];
      this.externalTensors = /* @__PURE__ */ new Set();
    }
    getMLContext(r) {
      let s = this.backend.getMLContext(r);
      if (!s) throw new Error("MLContext not found for session.");
      return s;
    }
    getMLOpSupportLimits(r) {
      return this.backend.getMLOpSupportLimits(r);
    }
    reserveTensorId() {
      let r = zs();
      return this.tensorTrackersById.set(r, new vr(this)), r;
    }
    releaseTensorId(r) {
      let s = this.tensorTrackersById.get(r);
      s && (this.tensorTrackersById.delete(r), s.tensorWrapper && this.releaseTensor(s.tensorWrapper));
    }
    async ensureTensor(r, s, f2, i2, p) {
      fe("verbose", () => `[WebNN] TensorManager.ensureTensor {tensorId: ${s}, dataType: ${f2}, shape: ${i2}, copyOld: ${p}}`);
      let g = this.tensorTrackersById.get(s);
      if (!g) throw new Error("Tensor not found.");
      return g.ensureTensor(r, f2, i2, p);
    }
    upload(r, s) {
      let f2 = this.tensorTrackersById.get(r);
      if (!f2) throw new Error("Tensor not found.");
      f2.upload(s);
    }
    async download(r, s) {
      fe("verbose", () => `[WebNN] TensorManager.download {tensorId: ${r}, dstBuffer: ${s?.byteLength}}`);
      let f2 = this.tensorTrackersById.get(r);
      if (!f2) throw new Error("Tensor not found.");
      return f2.download(s);
    }
    releaseTensorsForSession(r) {
      for (let s of this.freeTensors) s.sessionId === r && s.destroy();
      this.freeTensors = this.freeTensors.filter((s) => s.sessionId !== r);
    }
    registerTensor(r, s, f2, i2) {
      let p = this.getMLContext(r), g = zs(), d = new wr({ sessionId: r, context: p, tensor: s, dataType: f2, shape: i2 });
      return this.tensorTrackersById.set(g, new vr(this, d)), this.externalTensors.add(d), g;
    }
    async getCachedTensor(r, s, f2, i2, p, g, d) {
      let b = this.getMLContext(r);
      for (let [T, S] of this.freeTensors.entries()) if (S.canReuseTensor(b, s, f2)) {
        fe("verbose", () => `[WebNN] Reusing tensor {dataType: ${s}, ${d ? `fallbackDataType: ${d},` : ""} shape: ${f2}`);
        let E = this.freeTensors.splice(T, 1)[0];
        return E.sessionId = r, E;
      }
      fe("verbose", () => `[WebNN] MLContext.createTensor {dataType: ${s}, ${d ? `fallbackDataType: ${d},` : ""} shape: ${f2}}`);
      let v = await b.createTensor({ dataType: d ?? s, shape: f2, dimensions: f2, usage: i2, writable: p, readable: g });
      return new wr({ sessionId: r, context: b, tensor: v, dataType: s, shape: f2, fallbackDataType: d });
    }
    releaseTensor(r) {
      this.externalTensors.has(r) && this.externalTensors.delete(r), this.freeTensors.push(r);
    }
  }, qs = (...a) => new yn(...a);
});
var Js = {};
Mt(Js, { WebNNBackend: () => wn });
var Tr;
var nd;
var wn;
var Xs = G(() => {
  "use strict";
  ct();
  Xe();
  Ws();
  Ys();
  gn();
  Tr = /* @__PURE__ */ new Map([[1, "float32"], [10, "float16"], [6, "int32"], [12, "uint32"], [7, "int64"], [13, "uint64"], [22, "int4"], [21, "uint4"], [3, "int8"], [2, "uint8"], [9, "uint8"]]), nd = (a, r) => {
    if (a === r) return true;
    if (a === void 0 || r === void 0) return false;
    let s = Object.keys(a).sort(), f2 = Object.keys(r).sort();
    return s.length === f2.length && s.every((i2, p) => i2 === f2[p] && a[i2] === r[i2]);
  }, wn = class {
    constructor(r) {
      this.tensorManager = qs(this);
      this.mlContextBySessionId = /* @__PURE__ */ new Map();
      this.sessionIdsByMLContext = /* @__PURE__ */ new Map();
      this.mlContextCache = [];
      this.sessionGraphInputs = /* @__PURE__ */ new Map();
      this.sessionGraphOutputs = /* @__PURE__ */ new Map();
      this.temporaryGraphInputs = [];
      this.temporaryGraphOutputs = [];
      this.temporarySessionTensorIds = /* @__PURE__ */ new Map();
      this.mlOpSupportLimitsBySessionId = /* @__PURE__ */ new Map();
      $s(r.logLevel, !!r.debug);
    }
    get currentSessionId() {
      if (this.activeSessionId === void 0) throw new Error("No active session");
      return this.activeSessionId;
    }
    onRunStart(r) {
      fe("verbose", () => `[WebNN] onRunStart {sessionId: ${r}}`), this.activeSessionId = r;
    }
    onRunEnd(r) {
      fe("verbose", () => `[WebNN] onRunEnd {sessionId: ${r}}`);
      let s = this.temporarySessionTensorIds.get(r);
      if (s) {
        for (let f2 of s) fe("verbose", () => `[WebNN] releasing temporary tensor {tensorId: ${f2}}`), this.tensorManager.releaseTensorId(f2);
        this.temporarySessionTensorIds.delete(r), this.activeSessionId = void 0;
      }
    }
    async createMLContext(r) {
      if (r instanceof GPUDevice) {
        let f2 = this.mlContextCache.findIndex((i2) => i2.gpuDevice === r);
        if (f2 !== -1) return this.mlContextCache[f2].mlContext;
        {
          let i2 = await navigator.ml.createContext(r);
          return this.mlContextCache.push({ gpuDevice: r, mlContext: i2 }), i2;
        }
      } else if (r === void 0) {
        let f2 = this.mlContextCache.findIndex((i2) => i2.options === void 0 && i2.gpuDevice === void 0);
        if (f2 !== -1) return this.mlContextCache[f2].mlContext;
        {
          let i2 = await navigator.ml.createContext();
          return this.mlContextCache.push({ mlContext: i2 }), i2;
        }
      }
      let s = this.mlContextCache.findIndex((f2) => nd(f2.options, r));
      if (s !== -1) return this.mlContextCache[s].mlContext;
      {
        let f2 = await navigator.ml.createContext(r);
        return this.mlContextCache.push({ options: r, mlContext: f2 }), f2;
      }
    }
    registerMLContext(r, s) {
      this.mlContextBySessionId.set(r, s);
      let f2 = this.sessionIdsByMLContext.get(s);
      f2 || (f2 = /* @__PURE__ */ new Set(), this.sessionIdsByMLContext.set(s, f2)), f2.add(r), this.mlOpSupportLimitsBySessionId.has(r) || this.mlOpSupportLimitsBySessionId.set(r, s.opSupportLimits()), this.temporaryGraphInputs.length > 0 && (this.sessionGraphInputs.set(r, this.temporaryGraphInputs), this.temporaryGraphInputs = []), this.temporaryGraphOutputs.length > 0 && (this.sessionGraphOutputs.set(r, this.temporaryGraphOutputs), this.temporaryGraphOutputs = []);
    }
    onReleaseSession(r) {
      this.sessionGraphInputs.delete(r), this.sessionGraphOutputs.delete(r);
      let s = this.mlContextBySessionId.get(r);
      if (!s) return;
      this.tensorManager.releaseTensorsForSession(r), this.mlContextBySessionId.delete(r), this.mlOpSupportLimitsBySessionId.delete(r);
      let f2 = this.sessionIdsByMLContext.get(s);
      if (f2.delete(r), f2.size === 0) {
        this.sessionIdsByMLContext.delete(s);
        let i2 = this.mlContextCache.findIndex((p) => p.mlContext === s);
        i2 !== -1 && this.mlContextCache.splice(i2, 1);
      }
    }
    getMLContext(r) {
      return this.mlContextBySessionId.get(r);
    }
    getMLOpSupportLimits(r) {
      return this.mlOpSupportLimitsBySessionId.get(r);
    }
    reserveTensorId() {
      return this.tensorManager.reserveTensorId();
    }
    releaseTensorId(r) {
      fe("verbose", () => `[WebNN] releaseTensorId {tensorId: ${r}}`), this.tensorManager.releaseTensorId(r);
    }
    async ensureTensor(r, s, f2, i2, p) {
      let g = Tr.get(f2);
      if (!g) throw new Error(`Unsupported ONNX data type: ${f2}`);
      return this.tensorManager.ensureTensor(r ?? this.currentSessionId, s, g, i2, p);
    }
    async createTemporaryTensor(r, s, f2) {
      fe("verbose", () => `[WebNN] createTemporaryTensor {onnxDataType: ${s}, shape: ${f2}}`);
      let i2 = Tr.get(s);
      if (!i2) throw new Error(`Unsupported ONNX data type: ${s}`);
      let p = this.tensorManager.reserveTensorId();
      await this.tensorManager.ensureTensor(r, p, i2, f2, false);
      let g = this.temporarySessionTensorIds.get(r);
      return g ? g.push(p) : this.temporarySessionTensorIds.set(r, [p]), p;
    }
    uploadTensor(r, s) {
      if (!$().shouldTransferToMLTensor) throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");
      fe("verbose", () => `[WebNN] uploadTensor {tensorId: ${r}, data: ${s.byteLength}}`), this.tensorManager.upload(r, s);
    }
    async downloadTensor(r, s) {
      return this.tensorManager.download(r, s);
    }
    createMLTensorDownloader(r, s) {
      return async () => {
        let f2 = await this.tensorManager.download(r);
        return ks(f2, s);
      };
    }
    registerMLTensor(r, s, f2, i2) {
      let p = Tr.get(f2);
      if (!p) throw new Error(`Unsupported ONNX data type: ${f2}`);
      let g = this.tensorManager.registerTensor(r, s, p, i2);
      return fe("verbose", () => `[WebNN] registerMLTensor {tensor: ${s}, dataType: ${p}, dimensions: ${i2}} -> {tensorId: ${g}}`), g;
    }
    registerGraphInput(r) {
      this.temporaryGraphInputs.push(r);
    }
    registerGraphOutput(r) {
      this.temporaryGraphOutputs.push(r);
    }
    isGraphInput(r, s) {
      let f2 = this.sessionGraphInputs.get(r);
      return f2 ? f2.includes(s) : false;
    }
    isGraphOutput(r, s) {
      let f2 = this.sessionGraphOutputs.get(r);
      return f2 ? f2.includes(s) : false;
    }
    isGraphInputOutputTypeSupported(r, s, f2 = true) {
      let i2 = Tr.get(Ze(s)), p = this.mlOpSupportLimitsBySessionId.get(r);
      return typeof i2 > "u" ? false : f2 ? !!p?.input.dataTypes.includes(i2) : !!p?.output.dataTypes.includes(i2);
    }
    flush() {
    }
  };
});
var od;
var sr;
var ir;
var lt;
var ad;
var Zs;
var Pt;
var ur;
var fr;
var Er;
var sd;
var Tt;
var Qs;
var ei;
var Ks;
var cr;
var dr;
var lr;
var dn = G(() => {
  "use strict";
  We();
  _s();
  Ns();
  ct();
  Xe();
  mr();
  yr();
  od = (a, r) => {
    $()._OrtInit(a, r) !== 0 && z("Can't initialize onnxruntime.");
  }, sr = async (a) => {
    od(a.wasm.numThreads, Rt(a.logLevel));
  }, ir = async (a, r) => {
    $().asyncInit?.();
    let s = a.webgpu.adapter;
    if (r === "webgpu") {
      if (typeof navigator > "u" || !navigator.gpu) throw new Error("WebGPU is not supported in current environment");
      if (s) {
        if (typeof s.limits != "object" || typeof s.features != "object" || typeof s.requestDevice != "function") throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.");
      } else {
        let f2 = a.webgpu.powerPreference;
        if (f2 !== void 0 && f2 !== "low-power" && f2 !== "high-performance") throw new Error(`Invalid powerPreference setting: "${f2}"`);
        let i2 = a.webgpu.forceFallbackAdapter;
        if (i2 !== void 0 && typeof i2 != "boolean") throw new Error(`Invalid forceFallbackAdapter setting: "${i2}"`);
        if (s = await navigator.gpu.requestAdapter({ powerPreference: f2, forceFallbackAdapter: i2 }), !s) throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.');
      }
    }
    if (r === "webnn" && (typeof navigator > "u" || !navigator.ml)) throw new Error("WebNN is not supported in current environment");
    if (r === "webgpu" && $().webgpuInit((f2) => {
      a.webgpu.device = f2;
    }), r === "webnn") {
      let f2 = new (Xs(), Kt(Js)).WebNNBackend(a);
      $().webnnInit([f2, () => f2.reserveTensorId(), (i2) => f2.releaseTensorId(i2), async (i2, p, g, d, b) => f2.ensureTensor(i2, p, g, d, b), (i2, p) => {
        f2.uploadTensor(i2, p);
      }, async (i2, p) => f2.downloadTensor(i2, p), (i2, p) => f2.registerMLContext(i2, p), !!a.trace]);
    }
  }, lt = /* @__PURE__ */ new Map(), ad = (a) => {
    let r = $(), s = r.stackSave();
    try {
      let f2 = r.PTR_SIZE, i2 = r.stackAlloc(2 * f2);
      r._OrtGetInputOutputCount(a, i2, i2 + f2) !== 0 && z("Can't get session input/output count.");
      let g = f2 === 4 ? "i32" : "i64";
      return [Number(r.getValue(i2, g)), Number(r.getValue(i2 + f2, g))];
    } finally {
      r.stackRestore(s);
    }
  }, Zs = (a, r) => {
    let s = $(), f2 = s.stackSave(), i2 = 0;
    try {
      let p = s.PTR_SIZE, g = s.stackAlloc(2 * p);
      s._OrtGetInputOutputMetadata(a, r, g, g + p) !== 0 && z("Can't get session input/output metadata.");
      let b = Number(s.getValue(g, "*"));
      i2 = Number(s.getValue(g + p, "*"));
      let v = s.HEAP32[i2 / 4];
      if (v === 0) return [b, 0];
      let T = s.HEAPU32[i2 / 4 + 1], S = [];
      for (let E = 0; E < T; E++) {
        let x2 = Number(s.getValue(i2 + 8 + E * p, "*"));
        S.push(x2 !== 0 ? s.UTF8ToString(x2) : Number(s.getValue(i2 + 8 + (E + T) * p, "*")));
      }
      return [b, v, S];
    } finally {
      s.stackRestore(f2), i2 !== 0 && s._OrtFree(i2);
    }
  }, Pt = (a) => {
    let r = $(), s = r._malloc(a.byteLength);
    if (s === 0) throw new Error(`Can't create a session. failed to allocate a buffer of size ${a.byteLength}.`);
    return r.HEAPU8.set(a, s), [s, a.byteLength];
  }, ur = async (a, r) => {
    let s, f2, i2 = $();
    Array.isArray(a) ? [s, f2] = a : a.buffer === i2.HEAPU8.buffer ? [s, f2] = [a.byteOffset, a.byteLength] : [s, f2] = Pt(a);
    let p = 0, g = 0, d = 0, b = [], v = [], T = [];
    try {
      if ([g, b] = await Rs(r), r?.externalData && i2.mountExternalData) {
        let R = [];
        for (let V of r.externalData) {
          let J = typeof V == "string" ? V : V.path, l = typeof V == "string" ? V : V.data;
          R.push(dt(l).then((Q) => {
            i2.mountExternalData(J, Q);
          }));
        }
        await Promise.all(R);
      }
      for (let R of r?.executionProviders ?? []) if ((typeof R == "string" ? R : R.name) === "webnn") {
        if (i2.shouldTransferToMLTensor = false, typeof R != "string") {
          let J = R, l = J?.context, Q = J?.gpuDevice, ee = J?.deviceType, te = J?.powerPreference;
          l ? i2.currentContext = l : Q ? i2.currentContext = await i2.webnnCreateMLContext(Q) : i2.currentContext = await i2.webnnCreateMLContext({ deviceType: ee, powerPreference: te });
        } else i2.currentContext = await i2.webnnCreateMLContext();
        break;
      }
      p = await i2._OrtCreateSession(s, f2, g), i2.webgpuOnCreateSession?.(p), p === 0 && z("Can't create a session."), i2.jsepOnCreateSession?.(), i2.currentContext && (i2.webnnRegisterMLContext(p, i2.currentContext), i2.currentContext = void 0, i2.shouldTransferToMLTensor = true);
      let [S, E] = ad(p), x2 = !!r?.enableGraphCapture, L = [], D = [], H = [], B = [], O = [];
      for (let R = 0; R < S; R++) {
        let [V, J, l] = Zs(p, R);
        V === 0 && z("Can't get an input name."), v.push(V);
        let Q = i2.UTF8ToString(V);
        L.push(Q), H.push(J === 0 ? { name: Q, isTensor: false } : { name: Q, isTensor: true, type: hr(J), shape: l });
      }
      for (let R = 0; R < E; R++) {
        let [V, J, l] = Zs(p, R + S);
        V === 0 && z("Can't get an output name."), T.push(V);
        let Q = i2.UTF8ToString(V);
        D.push(Q), B.push(J === 0 ? { name: Q, isTensor: false } : { name: Q, isTensor: true, type: hr(J), shape: l });
        {
          if (x2 && r?.preferredOutputLocation === void 0) {
            O.push("gpu-buffer");
            continue;
          }
          let ee = typeof r?.preferredOutputLocation == "string" ? r.preferredOutputLocation : r?.preferredOutputLocation?.[Q] ?? "cpu", te = i2.webnnIsGraphOutput;
          if (ee === "cpu" && te && te(p, Q)) {
            O.push("ml-tensor-cpu-output");
            continue;
          }
          if (ee !== "cpu" && ee !== "cpu-pinned" && ee !== "gpu-buffer" && ee !== "ml-tensor") throw new Error(`Not supported preferred output location: ${ee}.`);
          if (x2 && ee !== "gpu-buffer") throw new Error(`Not supported preferred output location: ${ee}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);
          O.push(ee);
        }
      }
      let Y = null;
      return O.some((R) => R === "gpu-buffer" || R === "ml-tensor" || R === "ml-tensor-cpu-output") && (d = i2._OrtCreateBinding(p), d === 0 && z("Can't create IO binding."), Y = { handle: d, outputPreferredLocations: O, outputPreferredLocationsEncoded: O.map((R) => R === "ml-tensor-cpu-output" ? "ml-tensor" : R).map((R) => bn(R)) }), lt.set(p, [p, v, T, Y, x2, false]), [p, L, D, H, B];
    } catch (S) {
      throw v.forEach((E) => i2._OrtFree(E)), T.forEach((E) => i2._OrtFree(E)), d !== 0 && i2._OrtReleaseBinding(d) !== 0 && z("Can't release IO binding."), p !== 0 && i2._OrtReleaseSession(p) !== 0 && z("Can't release session."), S;
    } finally {
      i2._free(s), g !== 0 && i2._OrtReleaseSessionOptions(g) !== 0 && z("Can't release session options."), b.forEach((S) => i2._free(S)), i2.unmountExternalData?.();
    }
  }, fr = (a) => {
    let r = $(), s = lt.get(a);
    if (!s) throw new Error(`cannot release session. invalid session id: ${a}`);
    let [f2, i2, p, g, d] = s;
    g && (d && r._OrtClearBoundOutputs(g.handle) !== 0 && z("Can't clear bound outputs."), r._OrtReleaseBinding(g.handle) !== 0 && z("Can't release IO binding.")), r.jsepOnReleaseSession?.(a), r.webnnOnReleaseSession?.(a), r.webgpuOnReleaseSession?.(a), i2.forEach((b) => r._OrtFree(b)), p.forEach((b) => r._OrtFree(b)), r._OrtReleaseSession(f2) !== 0 && z("Can't release session."), lt.delete(a);
  }, Er = /* @__PURE__ */ new Map(), sd = 1, Tt = /* @__PURE__ */ new Map(), Qs = (a) => {
    let r = $(), s = r._malloc(a.byteLength);
    if (s === 0) throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${a.byteLength}.`);
    try {
      r.HEAPU8.set(a, s);
      let f2 = r._OrtCreateLoraAdapter(s, a.byteLength);
      f2 === 0 && z("Can't create a LoRA adapter.");
      let i2 = sd++;
      return Er.set(i2, f2), i2;
    } finally {
      r._free(s);
    }
  }, ei = (a) => {
    let r = $(), s = Er.get(a);
    if (s === void 0) throw new Error(`cannot release LoRA adapter. invalid adapter id: ${a}`);
    if (Tt.has(a)) throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${a}`);
    r._OrtReleaseLoraAdapter(s) !== 0 && z("Can't release LoRA adapter."), Er.delete(a);
  }, Ks = async (a, r, s, f2, i2, p, g = false) => {
    if (!a) {
      r.push(0);
      return;
    }
    let d = $(), b = d.PTR_SIZE, v = a[0], T = a[1], S = a[3], E = S, x2, L;
    if (v === "string" && (S === "gpu-buffer" || S === "ml-tensor")) throw new Error("String tensor is not supported on GPU.");
    if (g && S !== "gpu-buffer") throw new Error(`External buffer must be provided for input/output index ${p} when enableGraphCapture is true.`);
    if (S === "gpu-buffer") {
      let B = a[2].gpuBuffer;
      L = vt(Ze(v), T);
      {
        let O = d.webgpuRegisterBuffer;
        if (!O) throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');
        x2 = O(B, f2);
      }
    } else if (S === "ml-tensor") {
      let B = a[2].mlTensor;
      L = vt(Ze(v), T);
      let O = d.webnnRegisterMLTensor;
      if (!O) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
      x2 = O(f2, B, Ze(v), T);
    } else {
      let B = a[2];
      if (Array.isArray(B)) {
        L = b * B.length, x2 = d._malloc(L), s.push(x2);
        for (let O = 0; O < B.length; O++) {
          if (typeof B[O] != "string") throw new TypeError(`tensor data at index ${O} is not a string`);
          d.setValue(x2 + O * b, me(B[O], s), "*");
        }
      } else {
        let O = d.webnnIsGraphInput, Y = d.webnnIsGraphOutput;
        if (v !== "string" && O && Y) {
          let R = d.UTF8ToString(i2);
          if (O(f2, R) || Y(f2, R)) {
            let V = Ze(v);
            L = vt(V, T), E = "ml-tensor";
            let J = d.webnnCreateTemporaryTensor, l = d.webnnUploadTensor;
            if (!J || !l) throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');
            let Q = await J(f2, V, T);
            l(Q, new Uint8Array(B.buffer, B.byteOffset, B.byteLength)), x2 = Q;
          } else L = B.byteLength, x2 = d._malloc(L), s.push(x2), d.HEAPU8.set(new Uint8Array(B.buffer, B.byteOffset, L), x2);
        } else L = B.byteLength, x2 = d._malloc(L), s.push(x2), d.HEAPU8.set(new Uint8Array(B.buffer, B.byteOffset, L), x2);
      }
    }
    let D = d.stackSave(), H = d.stackAlloc(4 * T.length);
    try {
      T.forEach((O, Y) => d.setValue(H + Y * b, O, b === 4 ? "i32" : "i64"));
      let B = d._OrtCreateTensor(Ze(v), x2, L, H, T.length, bn(E));
      B === 0 && z(`Can't create tensor for input/output. session=${f2}, index=${p}.`), r.push(B);
    } finally {
      d.stackRestore(D);
    }
  }, cr = async (a, r, s, f2, i2, p, g = []) => {
    let d = $(), b = d.PTR_SIZE, v = lt.get(a);
    if (!v) throw new Error(`cannot run inference. invalid session id: ${a}`);
    let T = v[0], S = v[1], E = v[2], x2 = v[3], L = v[4], D = v[5], H = [];
    if (g.length > 0) {
      if (x2) throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");
      for (let w of g) {
        let ne = Er.get(w);
        if (ne === void 0) throw new Error(`cannot run inference. invalid LoRA adapter id: ${w}`);
        H.push(ne);
      }
    }
    let B = r.length, O = f2.length, Y = 0, R = [], V = [], J = [], l = [], Q = [], ee = d.stackSave(), te = d.stackAlloc(B * b), De = d.stackAlloc(B * b), Be = d.stackAlloc(O * b), M = d.stackAlloc(O * b);
    try {
      for (let P of g) Tt.set(P, (Tt.get(P) ?? 0) + 1);
      [Y, R] = Us(p, H), Ye("wasm prepareInputOutputTensor");
      for (let P = 0; P < B; P++) await Ks(s[P], V, l, a, S[r[P]], r[P], L);
      for (let P = 0; P < O; P++) await Ks(i2[P], J, l, a, E[f2[P]], B + f2[P], L);
      Je("wasm prepareInputOutputTensor");
      for (let P = 0; P < B; P++) d.setValue(te + P * b, V[P], "*"), d.setValue(De + P * b, S[r[P]], "*");
      for (let P = 0; P < O; P++) d.setValue(Be + P * b, J[P], "*"), d.setValue(M + P * b, E[f2[P]], "*");
      if (x2 && !D) {
        let { handle: P, outputPreferredLocations: ce, outputPreferredLocationsEncoded: Ke } = x2;
        if (S.length !== B) throw new Error(`input count from feeds (${B}) is expected to be always equal to model's input count (${S.length}).`);
        Ye("wasm bindInputsOutputs");
        for (let X = 0; X < B; X++) {
          let de = r[X];
          await d._OrtBindInput(P, S[de], V[X]) !== 0 && z(`Can't bind input[${X}] for session=${a}.`);
        }
        for (let X = 0; X < O; X++) {
          let de = f2[X];
          i2[X]?.[3] ? (Q.push(J[X]), d._OrtBindOutput(P, E[de], J[X], 0) !== 0 && z(`Can't bind pre-allocated output[${X}] for session=${a}.`)) : d._OrtBindOutput(P, E[de], 0, Ke[de]) !== 0 && z(`Can't bind output[${X}] to ${ce[X]} for session=${a}.`);
        }
        Je("wasm bindInputsOutputs"), lt.set(a, [T, S, E, x2, L, true]);
      }
      d.jsepOnRunStart?.(T), d.webnnOnRunStart?.(T);
      let w;
      x2 ? w = await d._OrtRunWithBinding(T, x2.handle, O, Be, Y) : w = await d._OrtRun(T, De, te, B, M, O, Be, Y), w !== 0 && z("failed to call OrtRun().");
      let ne = [], Ee = [];
      Ye("wasm ProcessOutputTensor");
      for (let P = 0; P < O; P++) {
        let ce = Number(d.getValue(Be + P * b, "*"));
        if (ce === J[P] || Q.includes(J[P])) {
          ne.push(i2[P]), ce !== J[P] && d._OrtReleaseTensor(ce) !== 0 && z("Can't release tensor.");
          continue;
        }
        let Ke = d.stackSave(), X = d.stackAlloc(4 * b), de = false, re, Z = 0;
        try {
          d._OrtGetTensorData(ce, X, X + b, X + 2 * b, X + 3 * b) !== 0 && z(`Can't access output tensor data on index ${P}.`);
          let pt = b === 4 ? "i32" : "i64", $e = Number(d.getValue(X, pt));
          Z = d.getValue(X + b, "*");
          let xt = d.getValue(X + b * 2, "*"), kt = Number(d.getValue(X + b * 3, pt)), be = [];
          for (let k = 0; k < kt; k++) be.push(Number(d.getValue(xt + k * b, pt)));
          d._OrtFree(xt) !== 0 && z("Can't free memory for tensor dims.");
          let he = be.reduce((k, N) => k * N, 1);
          re = hr($e);
          let ze = x2?.outputPreferredLocations[f2[P]];
          if (re === "string") {
            if (ze === "gpu-buffer" || ze === "ml-tensor") throw new Error("String tensor is not supported on GPU.");
            let k = [];
            for (let N = 0; N < he; N++) {
              let ye = d.getValue(Z + N * b, "*"), Ve = d.getValue(Z + (N + 1) * b, "*"), Qe = N === he - 1 ? void 0 : Ve - ye;
              k.push(d.UTF8ToString(ye, Qe));
            }
            ne.push([re, be, k, "cpu"]);
          } else if (ze === "gpu-buffer" && he > 0) {
            let k = d.webgpuGetBuffer;
            if (!k) throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');
            let N = k(Z), ye = vt($e, he);
            if (ye === void 0 || !br(re)) throw new Error(`Unsupported data type: ${re}`);
            de = true;
            {
              d.webgpuRegisterBuffer(N, a, Z);
              let Ve = d.webgpuCreateDownloader(N, ye, a);
              ne.push([re, be, { gpuBuffer: N, download: async () => {
                let Qe = await Ve();
                return new (ft(re))(Qe);
              }, dispose: () => {
                d._OrtReleaseTensor(ce) !== 0 && z("Can't release tensor.");
              } }, "gpu-buffer"]);
            }
          } else if (ze === "ml-tensor" && he > 0) {
            let k = d.webnnEnsureTensor, N = d.webnnIsGraphInputOutputTypeSupported;
            if (!k || !N) throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');
            if (vt($e, he) === void 0 || !gr(re)) throw new Error(`Unsupported data type: ${re}`);
            if (!N(a, re, false)) throw new Error(`preferredLocation "ml-tensor" for ${re} output is not supported by current WebNN Context.`);
            let Ve = await k(a, Z, $e, be, false);
            de = true, ne.push([re, be, { mlTensor: Ve, download: d.webnnCreateMLTensorDownloader(Z, re), dispose: () => {
              d.webnnReleaseTensorId(Z), d._OrtReleaseTensor(ce);
            } }, "ml-tensor"]);
          } else if (ze === "ml-tensor-cpu-output" && he > 0) {
            let k = d.webnnCreateMLTensorDownloader(Z, re)(), N = ne.length;
            de = true, Ee.push((async () => {
              let ye = [N, await k];
              return d.webnnReleaseTensorId(Z), d._OrtReleaseTensor(ce), ye;
            })()), ne.push([re, be, [], "cpu"]);
          } else {
            let k = ft(re), N = new k(he);
            new Uint8Array(N.buffer, N.byteOffset, N.byteLength).set(d.HEAPU8.subarray(Z, Z + N.byteLength)), ne.push([re, be, N, "cpu"]);
          }
        } finally {
          d.stackRestore(Ke), re === "string" && Z && d._free(Z), de || d._OrtReleaseTensor(ce);
        }
      }
      x2 && !L && (d._OrtClearBoundOutputs(x2.handle) !== 0 && z("Can't clear bound outputs."), lt.set(a, [T, S, E, x2, L, false]));
      for (let [P, ce] of await Promise.all(Ee)) ne[P][2] = ce;
      return Je("wasm ProcessOutputTensor"), ne;
    } finally {
      d.webnnOnRunEnd?.(T), d.stackRestore(ee), s.forEach((w) => {
        w && w[3] === "gpu-buffer" && d.webgpuUnregisterBuffer(w[2].gpuBuffer);
      }), i2.forEach((w) => {
        w && w[3] === "gpu-buffer" && d.webgpuUnregisterBuffer(w[2].gpuBuffer);
      }), V.forEach((w) => d._OrtReleaseTensor(w)), J.forEach((w) => d._OrtReleaseTensor(w)), l.forEach((w) => d._free(w)), Y !== 0 && d._OrtReleaseRunOptions(Y), R.forEach((w) => d._free(w));
      for (let w of g) {
        let ne = Tt.get(w) - 1;
        ne === 0 ? Tt.delete(w) : Tt.set(w, ne);
      }
    }
  }, dr = (a) => {
    let r = $(), s = lt.get(a);
    if (!s) throw new Error("invalid session id");
    let f2 = s[0], i2 = r._OrtEndProfiling(f2);
    i2 === 0 && z("Can't get an profile file name."), r._OrtFree(i2);
  }, lr = (a) => {
    let r = [];
    for (let s of a) {
      let f2 = s[2];
      !Array.isArray(f2) && "buffer" in f2 && r.push(f2.buffer);
    }
    return r;
  };
});
var Ge;
var Te;
var Nt;
var Ar;
var xr;
var Sr;
var vn;
var Tn;
var Et;
var St;
var ud;
var ti;
var ri;
var ni;
var oi;
var ai;
var si;
var ii;
var ui;
var fi;
var Lr = G(() => {
  "use strict";
  We();
  dn();
  Xe();
  or();
  yr();
  Ge = () => !!K.wasm.proxy && typeof document < "u", Nt = false, Ar = false, xr = false, Tn = /* @__PURE__ */ new Map(), Et = (a, r) => {
    let s = Tn.get(a);
    s ? s.push(r) : Tn.set(a, [r]);
  }, St = () => {
    if (Nt || !Ar || xr || !Te) throw new Error("worker not ready");
  }, ud = (a) => {
    switch (a.data.type) {
      case "init-wasm":
        Nt = false, a.data.err ? (xr = true, vn[1](a.data.err)) : (Ar = true, vn[0]()), Sr && (URL.revokeObjectURL(Sr), Sr = void 0);
        break;
      case "init-ep":
      case "copy-from":
      case "create":
      case "release":
      case "run":
      case "end-profiling": {
        let r = Tn.get(a.data.type);
        a.data.err ? r.shift()[1](a.data.err) : r.shift()[0](a.data.out);
        break;
      }
      default:
    }
  }, ti = async () => {
    if (!Ar) {
      if (Nt) throw new Error("multiple calls to 'initWasm()' detected.");
      if (xr) throw new Error("previous call to 'initWasm()' failed.");
      if (Nt = true, Ge()) return new Promise((a, r) => {
        Te?.terminate(), Cs().then(([s, f2]) => {
          try {
            Te = f2, Te.onerror = (p) => r(p), Te.onmessage = ud, vn = [a, r];
            let i2 = { type: "init-wasm", in: K };
            !i2.in.wasm.wasmPaths && (s || pn) && (i2.in.wasm.wasmPaths = { wasm: new URL("ort-wasm-simd-threaded.asyncify.wasm", import.meta.url).href }), Te.postMessage(i2), Sr = s;
          } catch (i2) {
            r(i2);
          }
        }, r);
      });
      try {
        await ar(K.wasm), await sr(K), Ar = true;
      } catch (a) {
        throw xr = true, a;
      } finally {
        Nt = false;
      }
    }
  }, ri = async (a) => {
    if (Ge()) return St(), new Promise((r, s) => {
      Et("init-ep", [r, s]);
      let f2 = { type: "init-ep", in: { epName: a, env: K } };
      Te.postMessage(f2);
    });
    await ir(K, a);
  }, ni = async (a) => Ge() ? (St(), new Promise((r, s) => {
    Et("copy-from", [r, s]);
    let f2 = { type: "copy-from", in: { buffer: a } };
    Te.postMessage(f2, [a.buffer]);
  })) : Pt(a), oi = async (a, r) => {
    if (Ge()) {
      if (r?.preferredOutputLocation) throw new Error('session option "preferredOutputLocation" is not supported for proxy.');
      return St(), new Promise((s, f2) => {
        Et("create", [s, f2]);
        let i2 = { type: "create", in: { model: a, options: { ...r } } }, p = [];
        a instanceof Uint8Array && p.push(a.buffer), Te.postMessage(i2, p);
      });
    } else return ur(a, r);
  }, ai = async (a) => {
    if (Ge()) return St(), new Promise((r, s) => {
      Et("release", [r, s]);
      let f2 = { type: "release", in: a };
      Te.postMessage(f2);
    });
    fr(a);
  }, si = async (a) => {
    if (Ge()) throw new Error("LoRA adapter is not supported for proxy.");
    let r = typeof a == "string" ? await dt(a) : a;
    return Qs(r);
  }, ii = async (a) => {
    if (Ge()) throw new Error("LoRA adapter is not supported for proxy.");
    ei(a);
  }, ui = async (a, r, s, f2, i2, p, g) => {
    if (Ge()) {
      if (g.length > 0) throw new Error("LoRA adapter is not supported for proxy.");
      if (s.some((d) => d[3] !== "cpu")) throw new Error("input tensor on GPU is not supported for proxy.");
      if (i2.some((d) => d)) throw new Error("pre-allocated output tensor is not supported for proxy.");
      return St(), new Promise((d, b) => {
        Et("run", [d, b]);
        let v = s, T = { type: "run", in: { sessionId: a, inputIndices: r, inputs: v, outputIndices: f2, options: p } };
        Te.postMessage(T, lr(v));
      });
    } else return cr(a, r, s, f2, i2, p, g);
  }, fi = async (a) => {
    if (Ge()) return St(), new Promise((r, s) => {
      Et("end-profiling", [r, s]);
      let f2 = { type: "end-profiling", in: a };
      Te.postMessage(f2);
    });
    dr(a);
  };
});
var At;
var En = G(() => {
  "use strict";
  We();
  Lr();
  At = class {
    async loadAdapter(r) {
      xe(), this.adapterId = await si(r), Le();
    }
    async dispose() {
      return ii(this.adapterId);
    }
  };
});
var ci;
var fd;
var Ir;
var di = G(() => {
  "use strict";
  We();
  En();
  Lr();
  ct();
  nr();
  yr();
  ci = (a, r) => {
    switch (a.location) {
      case "cpu":
        return [a.type, a.dims, a.data, "cpu"];
      case "gpu-buffer":
        return [a.type, a.dims, { gpuBuffer: a.gpuBuffer }, "gpu-buffer"];
      case "ml-tensor":
        return [a.type, a.dims, { mlTensor: a.mlTensor }, "ml-tensor"];
      default:
        throw new Error(`invalid data location: ${a.location} for ${r()}`);
    }
  }, fd = (a) => {
    switch (a[3]) {
      case "cpu":
        return new Ie(a[0], a[2], a[1]);
      case "gpu-buffer": {
        let r = a[0];
        if (!br(r)) throw new Error(`not supported data type: ${r} for deserializing GPU tensor`);
        let { gpuBuffer: s, download: f2, dispose: i2 } = a[2];
        return Ie.fromGpuBuffer(s, { dataType: r, dims: a[1], download: f2, dispose: i2 });
      }
      case "ml-tensor": {
        let r = a[0];
        if (!gr(r)) throw new Error(`not supported data type: ${r} for deserializing MLTensor tensor`);
        let { mlTensor: s, download: f2, dispose: i2 } = a[2];
        return Ie.fromMLTensor(s, { dataType: r, dims: a[1], download: f2, dispose: i2 });
      }
      default:
        throw new Error(`invalid data location: ${a[3]}`);
    }
  }, Ir = class {
    async fetchModelAndCopyToWasmMemory(r) {
      return ni(await dt(r));
    }
    async loadModel(r, s) {
      xe();
      let f2;
      typeof r == "string" ? f2 = await this.fetchModelAndCopyToWasmMemory(r) : f2 = r, [this.sessionId, this.inputNames, this.outputNames, this.inputMetadata, this.outputMetadata] = await oi(f2, s), Le();
    }
    async dispose() {
      return ai(this.sessionId);
    }
    async run(r, s, f2, i2 = []) {
      xe();
      let p = i2.map((L) => {
        if (!(L instanceof At)) throw new Error("LoRA adapter was not created by the WebAssembly backend.");
        return L.adapterId;
      }), g = [], d = [];
      Object.entries(r).forEach((L) => {
        let D = L[0], H = L[1], B = this.inputNames.indexOf(D);
        if (B === -1) throw new Error(`invalid input '${D}'`);
        g.push(H), d.push(B);
      });
      let b = [], v = [];
      Object.entries(s).forEach((L) => {
        let D = L[0], H = L[1], B = this.outputNames.indexOf(D);
        if (B === -1) throw new Error(`invalid output '${D}'`);
        b.push(H), v.push(B);
      });
      let T = g.map((L, D) => ci(L, () => `input "${this.inputNames[d[D]]}"`)), S = b.map((L, D) => L ? ci(L, () => `output "${this.outputNames[v[D]]}"`) : null), E = await ui(this.sessionId, d, T, v, S, f2, p), x2 = {};
      for (let L = 0; L < E.length; L++) x2[this.outputNames[v[L]]] = b[L] ?? fd(E[L]);
      return Le(), x2;
    }
    startProfiling() {
    }
    endProfiling() {
      fi(this.sessionId);
    }
  };
});
var li;
var pi = G(() => {
  "use strict";
  li = (a) => {
    if (a?.epContextDataRead) throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web');
  };
});
var hi = {};
Mt(hi, { OnnxruntimeWebAssemblyBackend: () => Br, initializeFlags: () => mi, wasmBackend: () => cd });
var mi;
var Br;
var cd;
var bi = G(() => {
  "use strict";
  We();
  En();
  Lr();
  di();
  pi();
  mi = () => {
    (typeof K.wasm.initTimeout != "number" || K.wasm.initTimeout < 0) && (K.wasm.initTimeout = 0);
    let a = K.wasm.simd;
    if (typeof a != "boolean" && a !== void 0 && a !== "fixed" && a !== "relaxed" && (console.warn(`Property "env.wasm.simd" is set to unknown value "${a}". Reset it to \`false\` and ignore SIMD feature checking.`), K.wasm.simd = false), typeof K.wasm.proxy != "boolean" && (K.wasm.proxy = false), typeof K.wasm.trace != "boolean" && (K.wasm.trace = false), typeof K.wasm.numThreads != "number" || !Number.isInteger(K.wasm.numThreads) || K.wasm.numThreads <= 0) if (typeof self < "u" && !self.crossOriginIsolated) K.wasm.numThreads = 1;
    else {
      let r = typeof navigator > "u" ? on("node:os").cpus().length : navigator.hardwareConcurrency;
      K.wasm.numThreads = Math.min(4, Math.ceil((r || 1) / 2));
    }
  }, Br = class {
    async init(r) {
      mi(), await ti(), await ri(r);
    }
    async createInferenceSessionHandler(r, s) {
      li(s);
      let f2 = new Ir();
      return await f2.loadModel(r, s), f2;
    }
    async createLoraAdapterHandler(r) {
      let s = new At();
      return await s.loadAdapter(r), s;
    }
  }, cd = new Br();
});
We();
We();
We();
var ys = "1.31.1";
var Ip = cn;
{
  let a = (bi(), Kt(hi)).wasmBackend;
  st("webgpu", a, 5), st("webnn", a, 5), st("cpu", a, 10), st("wasm", a, 10);
}
Object.defineProperty(K.versions, "web", { value: ys, enumerable: true });

// artifacts/bina04-koochik-18404-release-20261027/browser/repetition-guard.js
function repeatedPassageGuard(windowSize = 64) {
  const seen = /* @__PURE__ */ new Map();
  return (ids) => {
    if (ids.length < windowSize) return null;
    const start = ids.length - windowSize, key = ids.slice(start).join(","), first = seen.get(key);
    if (first !== void 0 && start - first >= windowSize) return { reason: "repeated_exact_token_passage", window_tokens: windowSize, first_start: first, repeat_start: start, stopped_after_tokens: ids.length };
    if (first === void 0) seen.set(key, start);
    return null;
  };
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/@huggingface/tokenizers/dist/tokenizers.mjs
var DictionarySplitter = class {
  /**
   * @param dictionary The dictionary of words to use for splitting.
   */
  constructor(dictionary) {
    this.trie = this._build_trie(dictionary);
  }
  /**
   * Builds a trie from the given dictionary.
   * @param dictionary The dictionary of words to build the trie from.
   * @returns The root node of the trie.
   * @private
   */
  _build_trie(dictionary) {
    const trie = /* @__PURE__ */ Object.create(null);
    for (const word of dictionary) {
      let node = trie;
      for (let i2 = 0; i2 < word.length; ++i2) {
        const char = word[i2];
        node = node[char] ??= /* @__PURE__ */ Object.create(null);
      }
      node.end = word;
    }
    return trie;
  }
  /**
   * Splits the input text into tokens based on the dictionary.
   * @param text The input text to split.
   * @returns An array of tokens.
   */
  split(text) {
    const result = [];
    const n = text.length;
    let start = 0;
    let i2 = 0;
    while (i2 < n) {
      let node = this.trie;
      let match = null;
      let j = i2;
      while (j < n && (node = node[text[j]])) {
        if (node.end) {
          match = node.end;
        }
        ++j;
      }
      if (match) {
        if (i2 > start) {
          result.push(text.slice(start, i2));
        }
        result.push(match);
        i2 += match.length;
        start = i2;
      } else {
        ++i2;
      }
    }
    if (start < n) {
      result.push(text.slice(start));
    }
    return result;
  }
};
var DictionarySplitter_default = DictionarySplitter;
var AddedToken = class {
  /**
   * Creates a new instance of AddedToken.
   * @param config Added token configuration object.
   */
  constructor(config2) {
    this.content = config2.content;
    this.id = config2.id;
    this.single_word = config2.single_word ?? false;
    this.lstrip = config2.lstrip ?? false;
    this.rstrip = config2.rstrip ?? false;
    this.special = config2.special ?? false;
    this.normalized = config2.normalized ?? !this.special;
  }
};
var AddedToken_default = AddedToken;
var compile_unicode_regexp = (source, flags) => {
  try {
    return new RegExp(source, flags);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    const property_names = /* @__PURE__ */ new Map();
    const rewritten = source.replace(
      /(\\[pP])\{([^}=]+)\}/g,
      (text, p, n, offset) => {
        let preceding_backslashes = 0;
        for (let i2 = offset - 1; i2 >= 0 && source[i2] === "\\"; --i2) {
          ++preceding_backslashes;
        }
        if (preceding_backslashes % 2 === 1) return text;
        let property_name = property_names.get(n);
        if (property_name === void 0) {
          try {
            new RegExp(`\\p{${n}}`, "u");
            property_name = n;
          } catch {
            property_name = `Script=${n}`;
          }
          property_names.set(n, property_name);
        }
        return `${p}{${property_name}}`;
      }
    );
    if (rewritten === source) throw error;
    try {
      return new RegExp(rewritten, flags);
    } catch {
      throw error;
    }
  }
};
var clean_up_tokenization = (text) => text.replace(/ \./g, ".").replace(/ \?/g, "?").replace(/ \!/g, "!").replace(/ ,/g, ",").replace(/ \' /g, "'").replace(/ n't/g, "n't").replace(/ 'm/g, "'m").replace(/ 's/g, "'s").replace(/ 've/g, "'ve").replace(/ 're/g, "'re");
var create_pattern = (pattern, invert = true) => {
  if (pattern.Regex !== void 0) {
    const regex = rewrite_oniguruma_to_js(
      normalize_bloom_split_char_class(pattern.Regex)
    );
    return compile_unicode_regexp(regex, "gu");
  } else if (pattern.String !== void 0) {
    const escaped = escape_reg_exp(pattern.String);
    return new RegExp(invert ? escaped : `(${escaped})`, "gu");
  } else {
    console.warn("Unknown pattern type:", pattern);
    return null;
  }
};
var UNICODE_WORD_CHARS_IN_CLASS = "\\p{Alphabetic}\\p{M}\\p{Nd}\\p{Pc}";
var UNICODE_WORD_CHARS = `${UNICODE_WORD_CHARS_IN_CLASS}\\u00B2\\u00B3\\u00B9\\u00BC-\\u00BE`;
var UNICODE_WORD_CLASS = `[${UNICODE_WORD_CHARS}]`;
var UNICODE_NON_WORD_CLASS = `[^${UNICODE_WORD_CHARS}]`;
var UNICODE_WORD_BOUNDARY = `(?:(?<!${UNICODE_WORD_CLASS})(?=${UNICODE_WORD_CLASS})|(?<=${UNICODE_WORD_CLASS})(?!${UNICODE_WORD_CLASS}))`;
var UNICODE_NON_WORD_BOUNDARY = `(?:(?<!${UNICODE_WORD_CLASS})(?!${UNICODE_WORD_CLASS})|(?<=${UNICODE_WORD_CLASS})(?=${UNICODE_WORD_CLASS}))`;
var LINE_START_ANCHOR = "(?:(?<![\\s\\S])|(?<=\\n))";
var LINE_END_ANCHOR = "(?:(?=\\n)|(?![\\s\\S]))";
var HEX_DIGIT_CHARS = "0-9A-Fa-f";
var ESCAPE_REWRITES = /* @__PURE__ */ new Map([
  ["A", "(?<![\\s\\S])"],
  ["z", "(?![\\s\\S])"],
  ["Z", "(?=\\n?(?![\\s\\S]))"],
  // \Z permits a single optional final \n (not \r\n)
  ["h", `[${HEX_DIGIT_CHARS}]`],
  ["H", `[^${HEX_DIGIT_CHARS}]`],
  ["w", UNICODE_WORD_CLASS],
  ["W", UNICODE_NON_WORD_CLASS],
  ["d", "\\p{Nd}"],
  ["D", "\\P{Nd}"],
  ["s", "\\p{White_Space}"],
  // JS \s wrongly adds U+FEFF and misses \x85
  ["S", "\\P{White_Space}"],
  ["b", UNICODE_WORD_BOUNDARY],
  ["B", UNICODE_NON_WORD_BOUNDARY],
  ["a", "\\x07"],
  ["e", "\\x1B"]
]);
var CLASS_ESCAPE_REWRITES = /* @__PURE__ */ new Map([
  ["h", HEX_DIGIT_CHARS],
  ["w", UNICODE_WORD_CHARS_IN_CLASS],
  ["d", "\\p{Nd}"],
  ["D", "\\P{Nd}"],
  ["s", "\\p{White_Space}"],
  ["S", "\\P{White_Space}"],
  ["a", "\\x07"],
  ["e", "\\x1B"]
]);
var CLASS_COMPLEMENT_ALTERNATIVES = /* @__PURE__ */ new Map([
  ["W", `[^${UNICODE_WORD_CHARS_IN_CLASS}]`],
  ["H", `[^${HEX_DIGIT_CHARS}]`]
]);
var RAW_WHITESPACE_ESCAPES = /* @__PURE__ */ new Map([
  ["\n", "\\n"],
  ["\r", "\\r"],
  ["	", "\\t"],
  ["\f", "\\f"],
  ["\v", "\\v"]
]);
var POSIX_CLASS_FRAGMENTS = /* @__PURE__ */ new Map([
  ["alpha", "\\p{Alphabetic}"],
  ["alnum", "\\p{Alphabetic}\\p{Nd}"],
  ["digit", "\\p{Nd}"],
  ["lower", "\\p{Lowercase}"],
  ["upper", "\\p{Uppercase}"],
  ["space", "\\p{White_Space}"],
  ["blank", "\\t\\p{Zs}"],
  ["punct", "\\p{P}\\p{S}"],
  ["cntrl", "\\p{Cc}"],
  ["word", UNICODE_WORD_CHARS_IN_CLASS],
  ["xdigit", HEX_DIGIT_CHARS]
]);
var JS_SYNTAX_CHARS = "^$\\.*+?()[]{}|/";
var GROUP_PREFIX_RE = /^\(\?(?:<[=!]|<[A-Za-z_][A-Za-z0-9_]*>|[:=!>])/;
var BRACED_ESCAPE_RE = /^\\([pPxu])\{([^}]*)\}/;
var QUANTIFIER_BRACE_RE = /^\{(\d+(?:,\d*)?|,\d+)\}/;
var POSIX_BRACKET_RE = /^\[:(\^?)(\p{Alphabetic}+):\]/u;
var EMPTY_NEGATED_POSIX_BRACKET_RE = /^\[:\^:\]/;
var UNSUPPORTED_POSIX_BRACKET_RE = /^\[(?:\.[^\]]*\.\]|=[^\]]*=\])/;
var FIXED_WIDTH_ESCAPE_RE = /^(?:\\x[0-9A-Fa-f]{2}|\\u[0-9A-Fa-f]{4}|\\c[A-Za-z])/;
var is_ascii_letter = (char) => char >= "A" && char <= "Z" || char >= "a" && char <= "z";
var character_at = (text, index) => String.fromCodePoint(text.codePointAt(index));
var get_ascii_folded_hex_atom = (hex) => {
  if (!/^[0-9A-Fa-f]{1,8}$/.test(hex)) return null;
  const code_point = Number.parseInt(hex, 16);
  if (code_point > 127) return null;
  const letter = String.fromCharCode(code_point);
  return is_ascii_letter(letter) ? `[${letter.toLowerCase()}${letter.toUpperCase()}]` : null;
};
var normalize_bloom_split_char_class = (regex) => regex.replace(/\[\^\(\\s\|\[([^\]]+)\]\)\]/g, "[^()|\\s$1]");
var ANY_CODE_POINT = "[\\s\\S]";
var MAX_CHARACTER_CLASS_NESTING_DEPTH = 256;
var create_character_class_operand = () => ({
  fragment: "",
  alternatives: [],
  tail: null,
  contains_complex_set: false
});
var throw_character_class_range_error = (index) => {
  throw new SyntaxError(
    `Unsupported range with a set-valued character-class operand at index ${index}`
  );
};
var add_character_class_atom = (operand, atom, index, contains_complex_set = true) => {
  if (operand.tail === "range") throw_character_class_range_error(index);
  operand.alternatives.push(atom);
  operand.tail = "set";
  operand.contains_complex_set = operand.contains_complex_set || contains_complex_set;
};
var append_character_class_fragment = (operand, fragment, set_valued = false, index = -1) => {
  if (set_valued && operand.tail === "range") {
    throw_character_class_range_error(index);
  }
  if (operand.tail === "range") {
    operand.fragment += fragment;
    operand.tail = "complete_range";
    return;
  }
  operand.fragment += fragment;
  operand.tail = set_valued ? "set" : "scalar";
  operand.contains_complex_set = operand.contains_complex_set || set_valued;
};
var rewrite_character_class_escape = (regex, index, operand) => {
  const braced = BRACED_ESCAPE_RE.exec(regex.slice(index));
  if (braced) {
    const [text, kind, body] = braced;
    if (kind === "P" && body === "Word") {
      add_character_class_atom(
        operand,
        `[^${UNICODE_WORD_CHARS_IN_CLASS}]`,
        index
      );
    } else {
      const replacement2 = kind === "x" ? `\\u{${body}}` : kind === "p" && body === "Word" ? UNICODE_WORD_CHARS_IN_CLASS : text;
      append_character_class_fragment(
        operand,
        replacement2,
        kind === "p" || kind === "P",
        index
      );
    }
    return index + text.length;
  }
  const fixed_width = FIXED_WIDTH_ESCAPE_RE.exec(regex.slice(index));
  if (fixed_width) {
    append_character_class_fragment(operand, fixed_width[0]);
    return index + fixed_width[0].length;
  }
  if (index + 1 >= regex.length) {
    throw new SyntaxError(
      `Unterminated escape in character class at index ${index}`
    );
  }
  const next = character_at(regex, index + 1);
  const next_end = index + 1 + next.length;
  const raw_whitespace = RAW_WHITESPACE_ESCAPES.get(next);
  if (raw_whitespace !== void 0) {
    append_character_class_fragment(operand, raw_whitespace);
    return next_end;
  }
  const complement = CLASS_COMPLEMENT_ALTERNATIVES.get(next);
  if (complement !== void 0) {
    add_character_class_atom(operand, complement, index);
    return next_end;
  }
  const rewrite = CLASS_ESCAPE_REWRITES.get(next);
  let replacement;
  let set_valued = false;
  if (rewrite !== void 0) {
    replacement = rewrite;
    set_valued = next !== "a" && next !== "e";
  } else if (/[A-Za-z0-9]/.test(next)) {
    replacement = `\\${next}`;
  } else if (JS_SYNTAX_CHARS.includes(next) || next === "-") {
    replacement = `\\${next}`;
  } else {
    replacement = next;
  }
  append_character_class_fragment(operand, replacement, set_valued, index);
  return next_end;
};
var compile_character_set_union = (pieces) => {
  if (pieces.length === 1) return pieces[0];
  return `(?:(?=(?:${pieces.join("|")}))${ANY_CODE_POINT})`;
};
var compile_character_class_operand = (operand) => {
  const pieces = operand.fragment.length === 0 ? operand.alternatives : [`[${operand.fragment}]`, ...operand.alternatives];
  return compile_character_set_union(pieces);
};
var get_ascii_fold_additions = (positive_atom) => {
  const membership = compile_unicode_regexp(`^(?:${positive_atom})$`, "u");
  let additions = "";
  for (let offset = 0; offset < 26; ++offset) {
    const upper = String.fromCharCode(65 + offset);
    const lower = String.fromCharCode(97 + offset);
    const has_upper = membership.test(upper);
    const has_lower = membership.test(lower);
    if (has_upper !== has_lower) additions += has_upper ? lower : upper;
  }
  return additions;
};
var parse_character_class = (regex, start, ascii_fold, apply_ascii_fold = true, nesting_depth = 1) => {
  if (nesting_depth > MAX_CHARACTER_CLASS_NESTING_DEPTH) {
    throw new SyntaxError(
      `Maximum character-class nesting depth of ${MAX_CHARACTER_CLASS_NESTING_DEPTH} exceeded at index ${start}`
    );
  }
  let i2 = start + 1;
  const negated = regex[i2] === "^";
  if (negated) ++i2;
  const first_content_index = i2;
  const operands = [create_character_class_operand()];
  let operand = operands[0];
  let contains_nested_negated_complex_set = false;
  while (i2 < regex.length) {
    const char = character_at(regex, i2);
    if (char === "\\") {
      i2 = rewrite_character_class_escape(regex, i2, operand);
      continue;
    }
    if (char === "]") {
      if (i2 === first_content_index) {
        append_character_class_fragment(operand, "\\]");
        ++i2;
        continue;
      }
      if (operand.tail === null) {
        if (operands.length > 1) {
          throw new SyntaxError(
            `Malformed character-class intersection with an empty operand at index ${i2}`
          );
        }
        throw new SyntaxError(`Empty character class at index ${start}`);
      }
      const contains_complex_set = operands.some(
        (candidate) => candidate.contains_complex_set
      );
      if (negated && operands.length > 1 && contains_nested_negated_complex_set) {
        throw new SyntaxError(
          `Unsupported outer-negated character-class intersection with a nested negated class containing a Unicode property, POSIX class, or shorthand at index ${start}`
        );
      }
      const first_atom = compile_character_class_operand(operands[0]);
      let positive_atom = first_atom;
      if (operands.length > 1) {
        let lookaheads = "";
        for (let j = 1; j < operands.length; ++j) {
          lookaheads += `(?=${compile_character_class_operand(operands[j])})`;
        }
        positive_atom = `(?:${lookaheads}${first_atom})`;
      }
      const is_direct_class = operands.length === 1 && operand.alternatives.length === 0;
      let direct_fragment = operand.fragment;
      if (ascii_fold && apply_ascii_fold) {
        const additions = get_ascii_fold_additions(positive_atom);
        if (additions.length > 0) {
          if (is_direct_class) {
            direct_fragment += additions;
            positive_atom = `[${direct_fragment}]`;
          } else {
            positive_atom = compile_character_set_union([
              positive_atom,
              `[${additions}]`
            ]);
          }
        }
      }
      const atom = negated ? is_direct_class ? `[^${direct_fragment}]` : `(?:(?!${positive_atom})${ANY_CODE_POINT})` : positive_atom;
      return {
        atom,
        end: i2 + 1,
        negated,
        contains_complex_set,
        contains_nested_negated_complex_set
      };
    }
    if (regex.startsWith("&&", i2)) {
      if (operand.tail === null) {
        throw new SyntaxError(
          `Malformed character-class intersection with an empty operand at index ${i2}`
        );
      }
      operand = create_character_class_operand();
      operands.push(operand);
      i2 += 2;
      continue;
    }
    if (char === "[") {
      const suffix = regex.slice(i2);
      if (EMPTY_NEGATED_POSIX_BRACKET_RE.test(suffix)) {
        throw new SyntaxError(
          `Malformed empty negated POSIX character class at index ${i2}`
        );
      }
      const posix = POSIX_BRACKET_RE.exec(suffix);
      if (posix) {
        const [, posix_negated, name] = posix;
        const fragment = POSIX_CLASS_FRAGMENTS.get(name);
        if (fragment === void 0) {
          throw new SyntaxError(
            `Unsupported POSIX character class "${name}" at index ${i2}`
          );
        }
        if (ascii_fold && posix_negated && (name === "lower" || name === "upper")) {
          throw new SyntaxError(
            `Unsupported negated POSIX ${name} class inside an inline case-insensitive group`
          );
        }
        if (posix_negated) {
          add_character_class_atom(operand, `[^${fragment}]`, i2);
        } else {
          append_character_class_fragment(operand, fragment, true, i2);
        }
        i2 += posix[0].length;
        continue;
      }
      if (UNSUPPORTED_POSIX_BRACKET_RE.test(suffix)) {
        throw new SyntaxError(
          `Unsupported POSIX collating or equivalence bracket expression at index ${i2}`
        );
      }
      const nested = parse_character_class(
        regex,
        i2,
        ascii_fold,
        false,
        nesting_depth + 1
      );
      add_character_class_atom(
        operand,
        nested.atom,
        i2,
        nested.contains_complex_set
      );
      contains_nested_negated_complex_set ||= nested.contains_nested_negated_complex_set || nested.negated && nested.contains_complex_set;
      i2 = nested.end;
      continue;
    }
    if (char === "-") {
      const is_terminal_literal = regex[i2 + 1] === "]" || regex.startsWith("&&", i2 + 1);
      if (operand.tail === "set" && !is_terminal_literal) {
        throw_character_class_range_error(i2);
      }
      if (operand.tail === null || operand.tail === "range" || operand.tail === "complete_range" || is_terminal_literal) {
        append_character_class_fragment(operand, "\\-");
      } else {
        operand.fragment += "-";
        operand.tail = "range";
      }
      ++i2;
      continue;
    }
    append_character_class_fragment(
      operand,
      char === "^" && operand.fragment.length === 0 ? "\\^" : char
    );
    i2 += char.length;
  }
  throw new SyntaxError(
    `${operands.length > 1 ? "Unterminated character-class intersection" : "Unterminated character class"} at index ${start}`
  );
};
var rewrite_oniguruma_to_js = (regex) => {
  let out = "";
  let atom_start = -1;
  let last_was_quantifier = false;
  let ascii_fold = false;
  const group_states = [];
  const emit_atom = (text) => {
    atom_start = out.length;
    out += text;
    last_was_quantifier = false;
  };
  for (let i2 = 0; i2 < regex.length; ) {
    const char = character_at(regex, i2);
    if (char === "\\") {
      const braced = BRACED_ESCAPE_RE.exec(regex.slice(i2));
      if (braced) {
        const [text, kind, body] = braced;
        let replacement2 = text;
        if (kind === "x") {
          const code_point_escape = `\\u{${body}}`;
          replacement2 = ascii_fold ? get_ascii_folded_hex_atom(body) ?? code_point_escape : code_point_escape;
        } else if (body === "Word") {
          replacement2 = kind === "p" ? UNICODE_WORD_CLASS : UNICODE_NON_WORD_CLASS;
        }
        emit_atom(replacement2);
        i2 += text.length;
        continue;
      }
      const fixed_width = FIXED_WIDTH_ESCAPE_RE.exec(regex.slice(i2));
      if (fixed_width) {
        const text = fixed_width[0];
        const replacement2 = ascii_fold && text[1] !== "c" ? get_ascii_folded_hex_atom(text.slice(2)) ?? text : text;
        emit_atom(replacement2);
        i2 += text.length;
        continue;
      }
      if (i2 + 1 >= regex.length) {
        out += char;
        break;
      }
      const next = character_at(regex, i2 + 1);
      i2 += 1 + next.length;
      if (next === "G") {
        continue;
      }
      const raw_whitespace = RAW_WHITESPACE_ESCAPES.get(next);
      if (raw_whitespace !== void 0) {
        emit_atom(raw_whitespace);
        continue;
      }
      const rewrite = ESCAPE_REWRITES.get(next);
      let replacement;
      if (rewrite !== void 0) {
        replacement = rewrite;
      } else if (/[A-Za-z0-9]/.test(next)) {
        replacement = `\\${next}`;
      } else if (JS_SYNTAX_CHARS.includes(next)) {
        replacement = `\\${next}`;
      } else {
        replacement = next;
      }
      emit_atom(replacement);
      continue;
    }
    switch (char) {
      case "[": {
        const parsed = parse_character_class(regex, i2, ascii_fold);
        emit_atom(parsed.atom);
        i2 = parsed.end;
        continue;
      }
      case "]":
        emit_atom("\\]");
        ++i2;
        continue;
      case ".":
        emit_atom("[^\\n]");
        ++i2;
        continue;
      case "^":
        emit_atom(LINE_START_ANCHOR);
        ++i2;
        continue;
      case "$":
        emit_atom(LINE_END_ANCHOR);
        ++i2;
        continue;
      case "(": {
        const inline_case_insensitive = regex.startsWith("(?i:", i2);
        const source_prefix = inline_case_insensitive ? "(?i:" : GROUP_PREFIX_RE.exec(regex.slice(i2))?.[0] ?? "(";
        const output_prefix = inline_case_insensitive ? "(?:" : source_prefix === "(?>" ? "(?:" : source_prefix;
        group_states.push([out.length, ascii_fold]);
        if (inline_case_insensitive) ascii_fold = true;
        out += output_prefix;
        last_was_quantifier = false;
        i2 += source_prefix.length;
        continue;
      }
      case ")":
        out += char;
        [atom_start, ascii_fold] = group_states.pop() ?? [-1, false];
        last_was_quantifier = false;
        ++i2;
        continue;
      case "|":
        out += char;
        atom_start = -1;
        last_was_quantifier = false;
        ++i2;
        continue;
      case "{": {
        const quant = QUANTIFIER_BRACE_RE.exec(regex.slice(i2));
        if (!quant || atom_start < 0) {
          emit_atom("\\{");
          ++i2;
          continue;
        }
        const body = quant[1].startsWith(",") ? `0${quant[1]}` : quant[1];
        i2 += quant[0].length;
        const following = regex[i2];
        if (following === "+" || following === "*") {
          out = `${out.slice(0, atom_start)}(?:${out.slice(atom_start)}{${body}})${following}`;
          ++i2;
        } else {
          out += `{${body}}`;
        }
        last_was_quantifier = true;
        continue;
      }
      case "}":
        emit_atom("\\}");
        ++i2;
        continue;
      case "+":
        if (last_was_quantifier) {
          ++i2;
          continue;
        }
        out += char;
        last_was_quantifier = true;
        ++i2;
        continue;
      case "*":
      case "?":
        out += char;
        last_was_quantifier = true;
        ++i2;
        continue;
      default:
        emit_atom(
          ascii_fold && is_ascii_letter(char) ? `[${char.toLowerCase()}${char.toUpperCase()}]` : char
        );
        i2 += char.length;
        continue;
    }
  }
  return out;
};
var escape_reg_exp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var fuse_unk = (arr, tokens_to_ids, unk_token_id) => {
  const fused = [];
  let i2 = 0;
  while (i2 < arr.length) {
    fused.push(arr[i2]);
    const token_id = tokens_to_ids.get(arr[i2]) ?? unk_token_id;
    if (token_id !== unk_token_id) {
      ++i2;
      continue;
    }
    while (++i2 < arr.length && (tokens_to_ids.get(arr[i2]) ?? unk_token_id) === unk_token_id) {
      if (tokens_to_ids.get(fused.at(-1)) !== unk_token_id) {
        fused[fused.length - 1] += arr[i2];
      }
    }
  }
  return fused;
};
var is_chinese_char = (cp) => cp >= 19968 && cp <= 40959 || cp >= 13312 && cp <= 19903 || cp >= 131072 && cp <= 173791 || cp >= 173824 && cp <= 177983 || cp >= 177984 && cp <= 178207 || cp >= 178208 && cp <= 183983 || cp >= 63744 && cp <= 64255 || cp >= 194560 && cp <= 195103;
var is_integral_number = (x2) => Number.isInteger(x2) || typeof x2 === "bigint";
var len = (s) => {
  let length = 0;
  for (const c of s) ++length;
  return length;
};
var lowercase_and_remove_accents = (text) => remove_accents(text.toLowerCase());
var merge_arrays = (...arrs) => Array.prototype.concat.apply([], arrs);
var object_to_map = (obj) => new Map(Object.entries(obj));
var regex_split = (text, regex) => {
  const result = [];
  let prev = 0;
  for (const match of text.matchAll(regex)) {
    const full_match = match[0];
    if (prev < match.index) {
      result.push(text.slice(prev, match.index));
    }
    if (full_match.length > 0) {
      result.push(full_match);
    }
    prev = match.index + full_match.length;
  }
  if (prev < text.length) {
    result.push(text.slice(prev));
  }
  return result;
};
var remove_accents = (text) => text.replace(/\p{M}/gu, "");
var validate_object = (obj, name, required_keys = []) => {
  if (!obj || Array.isArray(obj) || typeof obj !== "object") {
    return `${name} must be a valid object`;
  }
  for (const key of required_keys) {
    if (!(key in obj)) {
      return `${name} must contain a "${key}" property`;
    }
  }
  return null;
};
var whitespace_split = (text) => text.match(/\S+/g) || [];
var Callable = class {
  /**
   * Creates a new instance of the Callable class.
   */
  constructor() {
    const closure = function(...args) {
      return closure._call(...args);
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
};
var Callable_default = Callable;
var Normalizer = class extends Callable_default {
  /**
   * @param config The configuration object for the normalizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
  }
  /**
   * Alias for {@link Normalizer#normalize}.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  _call(text) {
    return this.normalize(text);
  }
};
var Normalizer_default = Normalizer;
var BertNormalizer = class extends Normalizer_default {
  /**
   * Adds whitespace around any CJK (Chinese, Japanese, or Korean) character in the input text.
   *
   * @param text The input text to tokenize.
   * @returns The tokenized text with whitespace added around CJK characters.
   */
  tokenize_chinese_chars(text) {
    const output = [];
    for (let i2 = 0; i2 < text.length; ++i2) {
      const char = text[i2];
      const cp = char.charCodeAt(0);
      if (is_chinese_char(cp)) {
        output.push(" ");
        output.push(char);
        output.push(" ");
      } else {
        output.push(char);
      }
    }
    return output.join("");
  }
  /**
   * Strips accents from the given text.
   * @param text The text to strip accents from.
   * @returns The text with accents removed.
   */
  strip_accents(text) {
    return text.normalize("NFD").replace(/\p{Mn}/gu, "");
  }
  /**
   * Checks whether `char` is a control character.
   * @param char The character to check.
   * @returns Whether `char` is a control character.
   */
  is_control(char) {
    switch (char) {
      case "	":
      case "\n":
      case "\r":
        return false;
      default:
        return /^\p{Cc}|\p{Cf}|\p{Co}|\p{Cs}$/u.test(char);
    }
  }
  /**
   * Performs invalid character removal and whitespace cleanup on text.
   * @param text The text to clean.
   * @returns The cleaned text.
   */
  clean_text(text) {
    const output = [];
    for (const char of text) {
      const cp = char.charCodeAt(0);
      if (cp === 0 || cp === 65533 || this.is_control(char)) {
        continue;
      }
      if (/^\s$/.test(char)) {
        output.push(" ");
      } else {
        output.push(char);
      }
    }
    return output.join("");
  }
  /**
   * Normalizes the given text based on the configuration.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(text) {
    if (this.config.clean_text) {
      text = this.clean_text(text);
    }
    if (this.config.handle_chinese_chars) {
      text = this.tokenize_chinese_chars(text);
    }
    if (this.config.lowercase) {
      text = text.toLowerCase();
      if (this.config.strip_accents !== false) {
        text = this.strip_accents(text);
      }
    } else if (this.config.strip_accents) {
      text = this.strip_accents(text);
    }
    return text;
  }
};
var BertNormalizer_default = BertNormalizer;
var Precompiled = class extends Normalizer_default {
  /**
   * Create a new instance of Precompiled normalizer.
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.charsmap = config2.precompiled_charsmap ?? null;
  }
  /**
   * Normalizes the given text by applying the precompiled charsmap.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(text) {
    text = text.replace(
      /[\u0001-\u0008\u000B\u000E-\u001F\u007F\u008F\u009F]/gm,
      ""
    );
    text = text.replace(
      /[\u0009\u000A\u000C\u000D\u00A0\u1680\u2000-\u200F\u2028\u2029\u202F\u205F\u2581\u3000\uFEFF\uFFFD]/gm,
      " "
    );
    if (text.includes("\uFF5E")) {
      const parts = text.split("\uFF5E");
      text = parts.map((part) => part.normalize("NFKC")).join("\uFF5E");
    } else {
      text = text.normalize("NFKC");
    }
    return text;
  }
};
var Precompiled_default = Precompiled;
var Sequence = class extends Normalizer_default {
  /**
   * Create a new instance of NormalizerSequence.
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.normalizers = (config2.normalizers ?? []).map(
      (x2) => create_normalizer_default(x2)
    );
  }
  /**
   * Apply a sequence of Normalizers to the input text.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(text) {
    return this.normalizers.reduce((t, normalizer) => {
      return normalizer ? normalizer.normalize(t) : t;
    }, text);
  }
};
var Sequence_default = Sequence;
var Replace = class extends Normalizer_default {
  /**
   * @param config The configuration object for the normalizer.
   */
  constructor(config2) {
    super(config2);
    this.pattern = create_pattern(this.config.pattern ?? {});
  }
  /**
   * Normalize the input text by replacing the pattern with the content.
   * @param text The input text to be normalized.
   * @returns The normalized text after replacing the pattern with the content.
   */
  normalize(text) {
    return this.pattern === null ? text : text.replaceAll(this.pattern, this.config.content ?? "");
  }
};
var Replace_default = Replace;
var UnicodeNormalizer = class extends Normalizer_default {
  constructor() {
    super(...arguments);
    this.form = "NFC";
  }
  /**
   * Normalize the input text by applying Unicode normalization.
   * @param text The input text to be normalized.
   * @returns The normalized text.
   */
  normalize(text) {
    text = text.normalize(this.form);
    return text;
  }
};
var UnicodeNormalizer_default = UnicodeNormalizer;
var NFC = class extends UnicodeNormalizer_default {
  constructor() {
    super(...arguments);
    this.form = "NFC";
  }
};
var NFC_default = NFC;
var NFD = class extends UnicodeNormalizer_default {
  constructor() {
    super(...arguments);
    this.form = "NFD";
  }
};
var NFD_default = NFD;
var NFKC = class extends UnicodeNormalizer_default {
  constructor() {
    super(...arguments);
    this.form = "NFKC";
  }
};
var NFKC_default = NFKC;
var NFKD = class extends UnicodeNormalizer_default {
  constructor() {
    super(...arguments);
    this.form = "NFKD";
  }
};
var NFKD_default = NFKD;
var Strip = class extends Normalizer_default {
  /**
   * Strip leading and/or trailing whitespace from the input text.
   * @param text The input text.
   * @returns The normalized text.
   */
  normalize(text) {
    if (this.config.strip_left && this.config.strip_right) {
      text = text.trim();
    } else {
      if (this.config.strip_left) {
        text = text.trimStart();
      }
      if (this.config.strip_right) {
        text = text.trimEnd();
      }
    }
    return text;
  }
};
var Strip_default = Strip;
var StripAccents = class extends Normalizer_default {
  /**
   * Remove all accents from the text.
   * @param text The input text.
   * @returns The normalized text without accents.
   */
  normalize(text) {
    return remove_accents(text);
  }
};
var StripAccents_default = StripAccents;
var Lowercase = class extends Normalizer_default {
  /**
   * Lowercases the input string.
   * @param {string} text The text to normalize.
   * @returns {string} The normalized text.
   */
  normalize(text) {
    return text.toLowerCase();
  }
};
var Lowercase_default = Lowercase;
var Prepend = class extends Normalizer_default {
  /**
   * Prepends the input string.
   * @param text The text to normalize.
   * @returns The normalized text.
   */
  normalize(text) {
    text = this.config.prepend + text;
    return text;
  }
};
var Prepend_default = Prepend;
function create_normalizer(config2) {
  if (config2 === null) return null;
  switch (config2.type) {
    case "BertNormalizer":
      return new BertNormalizer_default(config2);
    case "Precompiled":
      return new Precompiled_default(config2);
    case "Sequence":
      return new Sequence_default(config2);
    case "Replace":
      return new Replace_default(config2);
    case "NFC":
      return new NFC_default(config2);
    case "NFD":
      return new NFD_default(config2);
    case "NFKC":
      return new NFKC_default(config2);
    case "NFKD":
      return new NFKD_default(config2);
    case "Strip":
      return new Strip_default(config2);
    case "StripAccents":
      return new StripAccents_default(config2);
    case "Lowercase":
      return new Lowercase_default(config2);
    case "Prepend":
      return new Prepend_default(config2);
    default:
      throw new Error(`Unknown Normalizer type: ${config2.type}`);
  }
}
var create_normalizer_default = create_normalizer;
var PreTokenizer = class extends Callable_default {
  /**
   * Tokenizes the given text into pre-tokens.
   * @param text The text or array of texts to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of pre-tokens.
   */
  pre_tokenize(text, options) {
    return (Array.isArray(text) ? text.map((x2) => this.pre_tokenize_text(x2, options)) : this.pre_tokenize_text(text, options)).flat();
  }
  /**
   * Alias for {@link PreTokenizer#pre_tokenize}.
   * @param text The text or array of texts to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of pre-tokens.
   */
  _call(text, options) {
    return this.pre_tokenize(text, options);
  }
};
var PreTokenizer_default = PreTokenizer;
var BYTES_TO_UNICODE = (() => {
  const bs2 = [
    ...Array.from(
      { length: "~".charCodeAt(0) - "!".charCodeAt(0) + 1 },
      (_, i2) => i2 + "!".charCodeAt(0)
    ),
    ...Array.from(
      { length: "\xAC".charCodeAt(0) - "\xA1".charCodeAt(0) + 1 },
      (_, i2) => i2 + "\xA1".charCodeAt(0)
    ),
    ...Array.from(
      { length: "\xFF".charCodeAt(0) - "\xAE".charCodeAt(0) + 1 },
      (_, i2) => i2 + "\xAE".charCodeAt(0)
    )
  ];
  const cs2 = bs2.slice();
  let n = 0;
  for (let b = 0; b < 256; ++b) {
    if (!bs2.includes(b)) {
      bs2.push(b);
      cs2.push(256 + n);
      n += 1;
    }
  }
  const ccs = cs2.map((n2) => String.fromCharCode(n2));
  return Object.fromEntries(bs2.map((b, i2) => [b, ccs[i2]]));
})();
var reverse_dictionary = (data) => Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
var UNICODE_TO_BYTES = reverse_dictionary(BYTES_TO_UNICODE);
var PUNCTUATION_REGEX = "\\p{P}\\u0021-\\u002F\\u003A-\\u0040\\u005B-\\u0060\\u007B-\\u007E";
var ByteLevel = class extends PreTokenizer_default {
  /**
   * Creates a new instance of the `ByteLevelPreTokenizer` class.
   * @param config The configuration object.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this.add_prefix_space = this.config.add_prefix_space ?? false;
    this.trim_offsets = this.config.trim_offsets ?? false;
    this.use_regex = this.config.use_regex ?? true;
    this.pattern = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
    this.byte_encoder = BYTES_TO_UNICODE;
    this.text_encoder = new TextEncoder();
  }
  /**
   * Tokenizes a single piece of text using byte-level tokenization.
   * @param text The text to tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens.
   */
  pre_tokenize_text(text, options) {
    if (this.add_prefix_space && !text.startsWith(" ")) {
      text = " " + text;
    }
    const tokens = this.use_regex ? text.match(this.pattern) || [] : [text];
    return tokens.map(
      (token) => Array.from(
        this.text_encoder.encode(token),
        (byte) => this.byte_encoder[byte]
      ).join("")
    );
  }
};
var ByteLevel_default = ByteLevel;
var Whitespace = class extends PreTokenizer_default {
  /**
   * Pre-tokenizes the input text by splitting it on word boundaries.
   * @param text The text to be pre-tokenized.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens produced by splitting the input text on whitespace.
   */
  pre_tokenize_text(text, options) {
    return text.match(/\w+|[^\w\s]+/g) || [];
  }
};
var Whitespace_default = Whitespace;
var Metaspace = class extends PreTokenizer_default {
  /**
   * @param config The configuration object for the MetaspacePreTokenizer.
   */
  constructor(config2) {
    super();
    this.replacement = config2.replacement ?? "\u2581";
    this.str_rep = config2.str_rep || this.replacement;
    this.prepend_scheme = config2.prepend_scheme ?? "always";
  }
  /**
   * This method takes a string, replaces spaces with the replacement character,
   * adds a prefix space if requested, and returns a new list of tokens.
   * @param text The text to pre-tokenize.
   * @param options The options for the pre-tokenization.
   * @returns A new list of pre-tokenized tokens.
   */
  pre_tokenize_text(text, options) {
    const { section_index = void 0 } = options ?? {};
    let normalized = text.replaceAll(" ", this.str_rep);
    if (
      // We add a prefix space if:
      //  (1) The normalized token does not already start with the replacement character.
      !normalized.startsWith(this.replacement) && // and (2) either:
      //  (a) prepend_scheme is 'always'
      //  (b) prepend_scheme is 'first' and this is the first section
      (this.prepend_scheme === "always" || this.prepend_scheme === "first" && section_index === 0)
    ) {
      normalized = this.str_rep + normalized;
    }
    return [normalized];
  }
};
var Metaspace_default = Metaspace;
var Split = class extends PreTokenizer_default {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this.pattern = create_pattern(
      this.config.pattern ?? {},
      this.config.invert ?? true
    );
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(text) {
    if (this.pattern === null) {
      return [];
    }
    if (this.config.invert) {
      return (text.match(this.pattern) || []).filter((x2) => x2);
    } else if (this.config.behavior?.toLowerCase() === "removed") {
      return text.split(this.pattern).filter((x2) => x2);
    } else {
      return regex_split(text, this.pattern);
    }
  }
};
var Split_default = Split;
var Punctuation = class extends PreTokenizer_default {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this.pattern = new RegExp(
      `[^${PUNCTUATION_REGEX}]+|[${PUNCTUATION_REGEX}]+`,
      "gu"
    );
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(text) {
    return text.match(this.pattern) || [];
  }
};
var Punctuation_default = Punctuation;
var Digits = class extends PreTokenizer_default {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
    const digit_pattern = `[^\\d]+|\\d${this.config.individual_digits ? "" : "+"}`;
    this.pattern = new RegExp(digit_pattern, "gu");
  }
  /**
   * Tokenizes text by splitting it using the given pattern.
   * @param text The text to tokenize.
   * @returns An array of tokens.
   */
  pre_tokenize_text(text) {
    return text.match(this.pattern) || [];
  }
};
var Digits_default = Digits;
var BertPreTokenizer = class extends PreTokenizer_default {
  /**
   * A PreTokenizer that splits text into wordpieces using a basic tokenization scheme
   * similar to that used in the original implementation of BERT.
   */
  constructor() {
    super();
    this.pattern = new RegExp(
      `[^\\s${PUNCTUATION_REGEX}]+|[${PUNCTUATION_REGEX}]`,
      "gu"
    );
  }
  /**
   * Tokenizes a single text using the BERT pre-tokenization scheme.
   *
   * @param text The text to tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns An array of tokens.
   */
  pre_tokenize_text(text, options) {
    return text.trim().match(this.pattern) || [];
  }
};
var BertPreTokenizer_default = BertPreTokenizer;
var Replace2 = class extends PreTokenizer_default {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this.pattern = create_pattern(this.config.pattern ?? {});
    this.content = this.config.content ?? "";
  }
  /**
   * Pre-tokenizes the input text by replacing certain characters.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by replacing certain characters.
   */
  pre_tokenize_text(text) {
    if (this.pattern === null) {
      return [text];
    }
    return [text.replaceAll(this.pattern, this.config.content ?? "")];
  }
};
var Replace_default2 = Replace2;
var Sequence2 = class extends PreTokenizer_default {
  /**
   * Creates an instance of PreTokenizerSequence.
   * @param config The configuration object for the pre-tokenizer sequence.
   */
  constructor(config2) {
    super();
    this.tokenizers = (config2.pretokenizers ?? []).map(
      (x2) => create_pre_tokenizer_default(x2)
    );
  }
  /**
   * Applies each pre-tokenizer in the sequence to the input text in turn.
   * @param text The text to pre-tokenize.
   * @param options Additional options for the pre-tokenization logic.
   * @returns The pre-tokenized text.
   */
  pre_tokenize_text(text, options) {
    return this.tokenizers.reduce(
      (pre_tokenized_text, tokenizer2) => {
        return tokenizer2 ? tokenizer2.pre_tokenize(pre_tokenized_text, options) : pre_tokenized_text;
      },
      [text]
    );
  }
};
var Sequence_default2 = Sequence2;
var WhitespaceSplit = class extends PreTokenizer_default {
  /**
   * Pre-tokenizes the input text by splitting it on whitespace characters.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by splitting the input text on whitespace.
   */
  pre_tokenize_text(text) {
    return whitespace_split(text);
  }
};
var WhitespaceSplit_default = WhitespaceSplit;
var FixedLength = class extends PreTokenizer_default {
  /**
   * @param config The configuration options for the pre-tokenizer.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this._length = config2.length;
  }
  /**
   * Pre-tokenizes the input text by splitting it into fixed-length tokens.
   * @param text The text to be pre-tokenized.
   * @returns An array of tokens produced by splitting the input text into fixed-length tokens.
   */
  pre_tokenize_text(text) {
    const tokens = [];
    for (let i2 = 0; i2 < text.length; i2 += this._length) {
      tokens.push(text.slice(i2, i2 + this._length));
    }
    return tokens;
  }
};
var FixedLength_default = FixedLength;
function create_pre_tokenizer(config2) {
  if (config2 === null) return null;
  switch (config2.type) {
    case "BertPreTokenizer":
      return new BertPreTokenizer_default();
    case "Sequence":
      return new Sequence_default2(config2);
    case "Whitespace":
      return new Whitespace_default();
    case "WhitespaceSplit":
      return new WhitespaceSplit_default();
    case "Metaspace":
      return new Metaspace_default(config2);
    case "ByteLevel":
      return new ByteLevel_default(config2);
    case "Split":
      return new Split_default(config2);
    case "Punctuation":
      return new Punctuation_default(config2);
    case "Digits":
      return new Digits_default(config2);
    case "Replace":
      return new Replace_default2(config2);
    case "FixedLength":
      return new FixedLength_default(config2);
    default:
      throw new Error(`Unknown PreTokenizer type: ${config2.type}`);
  }
}
var create_pre_tokenizer_default = create_pre_tokenizer;
var TokenizerModel = class extends Callable_default {
  /**
   * Creates a new instance of TokenizerModel.
   * @param config The configuration object for the TokenizerModel.
   */
  constructor(config2) {
    super();
    this.config = config2;
    this.vocab = [];
    this.tokens_to_ids = /* @__PURE__ */ new Map();
    this.unk_token_id = void 0;
    this.unk_token = void 0;
    this.end_of_word_suffix = void 0;
    this.fuse_unk = this.config.fuse_unk ?? false;
  }
  /**
   * Internal function to call the TokenizerModel instance.
   * @param tokens The tokens to encode.
   * @returns The encoded tokens.
   */
  _call(tokens) {
    let result = this.encode(tokens);
    if (this.fuse_unk) {
      result = fuse_unk(result, this.tokens_to_ids, this.unk_token_id);
    }
    return result;
  }
};
var TokenizerModel_default = TokenizerModel;
var WordPieceTokenizer = class extends TokenizerModel_default {
  /**
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.max_input_chars_per_word = 100;
    this.tokens_to_ids = object_to_map(config2.vocab);
    this.unk_token_id = this.tokens_to_ids.get(config2.unk_token);
    this.unk_token = config2.unk_token;
    this.max_input_chars_per_word = config2.max_input_chars_per_word ?? 100;
    this.vocab = new Array(this.tokens_to_ids.size);
    for (const [key, value] of this.tokens_to_ids) {
      this.vocab[value] = key;
    }
  }
  /**
   * Encodes an array of tokens using WordPiece encoding.
   * @param tokens The tokens to encode.
   * @returns An array of encoded tokens.
   */
  encode(tokens) {
    const output_tokens = [];
    for (const token of tokens) {
      const chars = [...token];
      if (chars.length > this.max_input_chars_per_word) {
        output_tokens.push(this.unk_token);
        continue;
      }
      let is_unknown = false;
      let start = 0;
      const sub_tokens = [];
      while (start < chars.length) {
        let end = chars.length;
        let current_substring = null;
        while (start < end) {
          let substr = chars.slice(start, end).join("");
          if (start > 0) {
            substr = this.config.continuing_subword_prefix + substr;
          }
          if (this.tokens_to_ids.has(substr)) {
            current_substring = substr;
            break;
          }
          --end;
        }
        if (current_substring === null) {
          is_unknown = true;
          break;
        }
        sub_tokens.push(current_substring);
        start = end;
      }
      if (is_unknown) {
        output_tokens.push(this.unk_token);
      } else {
        output_tokens.push(...sub_tokens);
      }
    }
    return output_tokens;
  }
};
var WordPiece_default = WordPieceTokenizer;
var CharTrieNode = class _CharTrieNode {
  /**
   * Create a new CharTrieNode.
   * @param is_leaf Whether the node is a leaf node or not.
   * @param children A map containing the node's children, where the key is a character and the value is a `CharTrieNode`.
   */
  constructor(is_leaf, children) {
    this.is_leaf = is_leaf;
    this.children = children;
  }
  /**
   * Returns a new `CharTrieNode` instance with default values.
   * @returns A new `CharTrieNode` instance with `is_leaf` set to `false` and an empty `children` map.
   */
  static default() {
    return new _CharTrieNode(false, /* @__PURE__ */ new Map());
  }
};
var CharTrie = class {
  constructor() {
    this.root = CharTrieNode.default();
  }
  /**
   * Adds one or more `texts` to the trie.
   * @param texts The strings to add to the trie.
   */
  extend(texts) {
    for (const text of texts) {
      this.push(text);
    }
  }
  /**
   * Adds text to the trie.
   * @param text The string to add to the trie.
   */
  push(text) {
    let node = this.root;
    for (const ch of text) {
      let child = node.children.get(ch);
      if (child === void 0) {
        child = CharTrieNode.default();
        node.children.set(ch, child);
      }
      node = child;
    }
    node.is_leaf = true;
  }
  /**
   * Searches the trie for stored strings that match `chars` starting at `start`.
   * @param chars The input characters to search.
   * @param start The index to start searching from.
   * @yields Each stored string that is a prefix of `chars` starting at `start`.
   */
  *common_prefix_search(chars, start = 0) {
    let node = this.root;
    if (node === void 0) return;
    let prefix = "";
    for (let i2 = start; i2 < chars.length; ++i2) {
      const ch = chars[i2];
      prefix += ch;
      node = node.children.get(ch);
      if (node === void 0) return;
      if (node.is_leaf) {
        yield prefix;
      }
    }
  }
};
var CharTrie_default = CharTrie;
var TokenLatticeNode = class _TokenLatticeNode {
  /**
   * Represents a node in a token lattice for a given sentence.
   * @param token_id The ID of the token associated with this node.
   * @param node_id The ID of this node.
   * @param pos The starting position of the token in the sentence.
   * @param length The length of the token.
   * @param score The score associated with the token.
   */
  constructor(token_id, node_id, pos, length, score) {
    this.token_id = token_id;
    this.node_id = node_id;
    this.pos = pos;
    this.length = length;
    this.score = score;
    this.prev = null;
    this.backtrace_score = 0;
  }
  /**
   * Returns a clone of this node.
   * @returns A clone of this node.
   */
  clone() {
    const n = new _TokenLatticeNode(
      this.token_id,
      this.node_id,
      this.pos,
      this.length,
      this.score
    );
    n.prev = this.prev;
    n.backtrace_score = this.backtrace_score;
    return n;
  }
};
var TokenLattice = class {
  /**
   * Creates a new TokenLattice instance.
   *
   * @param sentence The input sentence to be tokenized.
   * @param bos_token_id The beginning-of-sequence token ID.
   * @param eos_token_id The end-of-sequence token ID.
   */
  constructor(sentence, bos_token_id, eos_token_id) {
    this.chars = Array.from(sentence);
    this.len = this.chars.length;
    this.bos_token_id = bos_token_id;
    this.eos_token_id = eos_token_id;
    this.nodes = [];
    this.begin_nodes = Array.from(
      { length: this.len + 1 },
      () => []
    );
    this.end_nodes = Array.from({ length: this.len + 1 }, () => []);
    const bos = new TokenLatticeNode(this.bos_token_id ?? 0, 0, 0, 0, 0);
    const eos = new TokenLatticeNode(
      this.eos_token_id ?? 0,
      1,
      this.len,
      0,
      0
    );
    this.nodes.push(bos.clone());
    this.nodes.push(eos.clone());
    this.begin_nodes[this.len].push(eos);
    this.end_nodes[0].push(bos);
  }
  /**
   * Inserts a new token node into the token lattice.
   *
   * @param pos The starting position of the token.
   * @param length The length of the token.
   * @param score The score of the token.
   * @param token_id The token ID of the token.
   */
  insert(pos, length, score, token_id) {
    const node_id = this.nodes.length;
    const node = new TokenLatticeNode(token_id, node_id, pos, length, score);
    this.begin_nodes[pos].push(node);
    this.end_nodes[pos + length].push(node);
    this.nodes.push(node);
  }
  /**
   * Implements the Viterbi algorithm to compute the most likely sequence of tokens.
   *
   * @returns The most likely sequence of tokens.
   */
  viterbi() {
    const len2 = this.len;
    let pos = 0;
    while (pos <= len2) {
      if (this.begin_nodes[pos].length == 0) {
        return [];
      }
      for (let rnode of this.begin_nodes[pos]) {
        rnode.prev = null;
        let best_score = 0;
        let best_node = null;
        for (let lnode of this.end_nodes[pos]) {
          const score = lnode.backtrace_score + rnode.score;
          if (best_node === null || score > best_score) {
            best_node = lnode.clone();
            best_score = score;
          }
        }
        if (best_node !== null) {
          rnode.prev = best_node;
          rnode.backtrace_score = best_score;
        } else {
          return [];
        }
      }
      ++pos;
    }
    const results = [];
    const root = this.begin_nodes[len2][0];
    const prev = root.prev;
    if (prev === null) {
      return [];
    }
    let node = prev.clone();
    while (node.prev !== null) {
      results.push(node.clone());
      const n = node.clone();
      node = n.prev.clone();
    }
    results.reverse();
    return results;
  }
  /**
   * Get the text piece for a given node.
   * @param node The node to get the piece for.
   * @returns The array of nodes representing the most likely sequence of tokens.
   */
  piece(node) {
    return this.chars.slice(node.pos, node.pos + node.length).join("");
  }
  /**
   * @returns The most likely sequence of tokens.
   */
  tokens() {
    const nodes = this.viterbi();
    return nodes.map((x2) => this.piece(x2));
  }
  /**
   * @returns The most likely sequence of token ids.
   */
  token_ids() {
    const nodes = this.viterbi();
    return nodes.map((x2) => x2.token_id);
  }
};
var TokenLattice_default = TokenLattice;
function min(arr) {
  if (arr.length === 0) throw new Error("Array must not be empty");
  let min_value = arr[0];
  let index_of_min = 0;
  for (let i2 = 1; i2 < arr.length; ++i2) {
    if (arr[i2] < min_value) {
      min_value = arr[i2];
      index_of_min = i2;
    }
  }
  return [min_value, index_of_min];
}
var Unigram = class extends TokenizerModel_default {
  /**
   * Create a new Unigram tokenizer model.
   * @param config The configuration object for the Unigram model.
   * @param eos_token
   */
  constructor(config2, eos_token) {
    super(config2);
    const vocab_size = config2.vocab.length;
    this.vocab = new Array(vocab_size);
    this.scores = new Array(vocab_size);
    for (let i2 = 0; i2 < vocab_size; ++i2) {
      [this.vocab[i2], this.scores[i2]] = config2.vocab[i2];
    }
    this.unk_token_id = config2.unk_id;
    this.unk_token = this.vocab[config2.unk_id];
    this.tokens_to_ids = new Map(this.vocab.map((x2, i2) => [x2, i2]));
    this.bos_token = " ";
    this.bos_token_id = this.tokens_to_ids.get(this.bos_token);
    this.eos_token = eos_token;
    this.eos_token_id = this.tokens_to_ids.get(this.eos_token);
    this.unk_token = this.vocab[this.unk_token_id];
    this.min_score = min(this.scores)[0];
    this.unk_score = this.min_score - 10;
    this.scores[this.unk_token_id] = this.unk_score;
    this.trie = new CharTrie_default();
    this.trie.extend(this.vocab);
    this.fuse_unk = true;
  }
  /**
   * Populates lattice nodes.
   * @param lattice The token lattice to populate with nodes.
   */
  populate_nodes(lattice) {
    const chars = lattice.chars;
    const mblen = 1;
    let begin_pos = 0;
    while (begin_pos < chars.length) {
      let has_single_node = false;
      const prefixed_tokens = this.trie.common_prefix_search(chars, begin_pos);
      for (const token of prefixed_tokens) {
        const token_id = this.tokens_to_ids.get(token);
        const token_score = this.scores[token_id];
        const n = len(token);
        lattice.insert(begin_pos, n, token_score, token_id);
        if (!has_single_node && n === mblen) {
          has_single_node = true;
        }
      }
      if (!has_single_node) {
        lattice.insert(begin_pos, mblen, this.unk_score, this.unk_token_id);
      }
      begin_pos += mblen;
    }
  }
  /**
   * Encodes an array of tokens into an array of subtokens using the unigram model.
   *
   * @param normalized The normalized string.
   * @returns An array of subtokens obtained by encoding the input tokens using the unigram model.
   */
  tokenize(normalized) {
    const lattice = new TokenLattice_default(
      normalized,
      this.bos_token_id,
      this.eos_token_id
    );
    this.populate_nodes(lattice);
    return lattice.tokens();
  }
  /**
   * Encodes an array of tokens using Unigram encoding.
   * @param tokens The tokens to encode.
   * @returns An array of encoded tokens.
   */
  encode(tokens) {
    const to_return = [];
    for (const token of tokens) {
      const tokenized = this.tokenize(token);
      to_return.push(...tokenized);
    }
    return to_return;
  }
};
var Unigram_default = Unigram;
var PriorityQueue = class {
  /**
   * Create a new PriorityQueue.
   * @param comparator Comparator function to determine priority. Defaults to a MaxHeap.
   * @param max_size Maximum size of the queue. Defaults to Infinity.
   */
  constructor(comparator = (a, b) => a > b, max_size = Infinity) {
    this._heap = [];
    this._comparator = comparator;
    this._max_size = max_size;
  }
  /**
   * The size of the queue
   */
  get size() {
    return this._heap.length;
  }
  /**
   * Check if the queue is empty.
   * @returns `true` if the queue is empty, `false` otherwise.
   */
  is_empty() {
    return this.size === 0;
  }
  /**
   * Return the element with the highest priority in the queue.
   * @returns The highest priority element in the queue.
   */
  peek() {
    return this._heap[0];
  }
  /**
   * Add one or more elements to the queue.
   * @param values The values to push into the queue.
   * @returns The new size of the queue.
   */
  push(...values) {
    return this.extend(values);
  }
  /**
   * Add multiple elements to the queue.
   * @param values The values to push into the queue.
   * @returns The new size of the queue.
   */
  extend(values) {
    for (const value of values) {
      if (this.size < this._max_size) {
        this._heap.push(value);
        this._sift_up();
      } else {
        const smallest = this._smallest();
        if (this._comparator(value, this._heap[smallest])) {
          this._heap[smallest] = value;
          this._sift_up_from(smallest);
        }
      }
    }
    return this.size;
  }
  /**
   * Remove and return the element with the highest priority in the queue.
   * @returns The element with the highest priority in the queue.
   */
  pop() {
    const popped_value = this.peek();
    const bottom = this.size - 1;
    if (bottom > 0) {
      this._swap(0, bottom);
    }
    this._heap.pop();
    this._sift_down();
    return popped_value;
  }
  /**
   * Replace the element with the highest priority in the queue with a new value.
   * @param value The new value.
   * @returns The replaced value.
   */
  replace(value) {
    const replaced_value = this.peek();
    this._heap[0] = value;
    this._sift_down();
    return replaced_value;
  }
  /**
   * Compute the index for the parent of the node at index `i`.
   * @param i The index of the node to get the parent of.
   * @returns The index of the parent node.
   * @private
   */
  _parent(i2) {
    return (i2 + 1 >>> 1) - 1;
  }
  /**
   * Compute the index for the left child of the node at index `i`.
   * @param i The index of the node to get the left child of.
   * @returns The index of the left child.
   * @private
   */
  _left(i2) {
    return (i2 << 1) + 1;
  }
  /**
   * Compute the index for the right child of the node at index `i`.
   * @param i The index of the node to get the right child of.
   * @returns The index of the right child.
   * @private
   */
  _right(i2) {
    return i2 + 1 << 1;
  }
  /**
   * Check if the element at index `i` is greater than the element at index `j`.
   * @param i The index of the first element to compare.
   * @param j The index of the second element to compare.
   * @returns `true` if the element at index `i` is greater than the element at index `j`, `false` otherwise.
   * @private
   */
  _greater(i2, j) {
    return this._comparator(this._heap[i2], this._heap[j]);
  }
  /**
   * Swap the elements at indices `i` and `j`.
   * @param i The index of the first element to swap.
   * @param j The index of the second element to swap.
   * @private
   */
  _swap(i2, j) {
    const temp = this._heap[i2];
    this._heap[i2] = this._heap[j];
    this._heap[j] = temp;
  }
  /**
   * Maintain the heap property by updating positions in the heap,
   * starting at the last element and moving up the heap.
   * @private
   */
  _sift_up() {
    this._sift_up_from(this.size - 1);
  }
  /**
   * Helper function to sift up from a given node.
   * @param node The index of the node to start sifting up from.
   */
  _sift_up_from(node) {
    while (node > 0 && this._greater(node, this._parent(node))) {
      this._swap(node, this._parent(node));
      node = this._parent(node);
    }
  }
  /**
   * Maintain the heap property by updating positions in the heap,
   * starting at the first element and moving down the heap.
   * @private
   */
  _sift_down() {
    let node = 0;
    while (this._left(node) < this.size && this._greater(this._left(node), node) || this._right(node) < this.size && this._greater(this._right(node), node)) {
      const max_child = this._right(node) < this.size && this._greater(this._right(node), this._left(node)) ? this._right(node) : this._left(node);
      this._swap(node, max_child);
      node = max_child;
    }
  }
  /**
   * Get the index of the smallest element in the heap. Since we use an array-based heap,
   * the index can be computed without needing to traverse the heap.
   * @private
   */
  _smallest() {
    return 2 ** Math.floor(Math.log2(this.size)) - 1;
  }
};
var PriorityQueue_default = PriorityQueue;
var LRUCache = class {
  /**
   * Creates an LRUCache instance.
   * @param capacity The maximum number of items the cache can hold.
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = /* @__PURE__ */ new Map();
  }
  /**
   * Retrieves the value associated with the given key and marks the key as recently used.
   * @param key The key to retrieve.
   * @returns The value associated with the key, or undefined if the key does not exist.
   */
  get(key) {
    if (!this.cache.has(key)) return void 0;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  /**
   * Inserts or updates the key-value pair in the cache.
   * If the key already exists, it is updated and marked as recently used.
   * If the cache exceeds its capacity, the least recently used item is evicted.
   * @param key The key to add or update.
   * @param value The value to associate with the key.
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
  }
  /**
   * Clears the cache.
   */
  clear() {
    this.cache.clear();
  }
};
var LRUCache_default = LRUCache;
var BPE = class extends TokenizerModel_default {
  /**
   * Create a BPE instance.
   * @param config The configuration object for BPE.
   */
  constructor(config2) {
    super(config2);
    this.tokens_to_ids = object_to_map(config2.vocab);
    this.unk_token_id = this.tokens_to_ids.get(config2.unk_token);
    this.unk_token = config2.unk_token;
    this.vocab = new Array(this.tokens_to_ids.size);
    for (const [key, value] of this.tokens_to_ids) {
      this.vocab[value] = key;
    }
    const use_new_merge_format = Array.isArray(config2.merges[0]);
    this.merges = use_new_merge_format ? config2.merges : config2.merges.map(
      (x2) => x2.split(" ", 2)
    );
    this.bpe_ranks = new Map(this.merges.map((x2, i2) => [JSON.stringify(x2), i2]));
    this.end_of_word_suffix = config2.end_of_word_suffix;
    this.continuing_subword_suffix = config2.continuing_subword_suffix ?? null;
    this.byte_fallback = this.config.byte_fallback ?? false;
    if (this.byte_fallback) {
      this.text_encoder = new TextEncoder();
    }
    this.ignore_merges = this.config.ignore_merges ?? false;
    this.max_length_to_cache = 256;
    this.cache_capacity = 1e4;
    this.cache = new LRUCache_default(this.cache_capacity);
  }
  /**
   * Clears the cache.
   */
  clear_cache() {
    this.cache.clear();
  }
  /**
   * Apply Byte-Pair-Encoding (BPE) to a given token. Efficient heap-based priority
   * queue implementation adapted from https://github.com/belladoreai/llama-tokenizer-js.
   * @param token The token to encode.
   * @returns The BPE encoded tokens.
   */
  bpe(token) {
    if (token.length === 0) {
      return [];
    }
    const cached = this.cache.get(token);
    if (cached !== void 0) {
      return cached;
    }
    const word = Array.from(token);
    if (this.end_of_word_suffix) {
      word[word.length - 1] += this.end_of_word_suffix;
    }
    let result = [];
    if (word.length > 1) {
      const queue2 = new PriorityQueue_default((a, b) => a.score < b.score);
      let starting_node = {
        token: word[0],
        bias: 0,
        prev: null,
        next: null
      };
      let previous_node = starting_node;
      for (let i2 = 1; i2 < word.length; ++i2) {
        const current_node = {
          bias: i2 / word.length,
          // Add fractional component to break ties
          token: word[i2],
          prev: previous_node,
          next: null
        };
        previous_node.next = current_node;
        this.add_node(queue2, previous_node);
        previous_node = current_node;
      }
      while (!queue2.is_empty()) {
        const node = queue2.pop();
        if (node.deleted || !node.next || node.next.deleted) continue;
        node.deleted = true;
        node.next.deleted = true;
        if (node.prev) {
          const new_previous_node = { ...node.prev };
          node.prev.deleted = true;
          node.prev = new_previous_node;
          if (new_previous_node.prev) {
            new_previous_node.prev.next = new_previous_node;
          } else {
            starting_node = new_previous_node;
          }
        }
        const merged = {
          token: node.token + node.next.token,
          bias: node.bias,
          prev: node.prev,
          next: node.next.next
        };
        if (merged.prev) {
          merged.prev.next = merged;
          this.add_node(queue2, merged.prev);
        } else {
          starting_node = merged;
        }
        if (merged.next) {
          merged.next.prev = merged;
          this.add_node(queue2, merged);
        }
      }
      for (let current_node = starting_node; current_node !== null; current_node = current_node.next) {
        result.push(current_node.token);
      }
    } else {
      result = word;
    }
    if (this.continuing_subword_suffix) {
      for (let i2 = 0; i2 < result.length - 1; ++i2) {
        result[i2] += this.continuing_subword_suffix;
      }
    }
    if (token.length < this.max_length_to_cache) {
      this.cache.put(token, result);
    }
    return result;
  }
  /**
   * Helper function to add a node to the priority queue.
   * @param queue
   * @param node
   */
  add_node(queue2, node) {
    const rank = this.bpe_ranks.get(
      JSON.stringify([node.token, node.next.token])
    );
    if (rank !== void 0) {
      node.score = rank + node.bias;
      queue2.push(node);
    }
  }
  /**
   * Encodes the input sequence of tokens using the BPE algorithm and returns the resulting subword tokens.
   * @param tokens The input sequence of tokens to encode.
   * @returns The resulting subword tokens after applying the BPE algorithm to the input sequence of tokens.
   */
  encode(tokens) {
    const output_tokens = [];
    for (const token of tokens) {
      if (this.ignore_merges && this.tokens_to_ids.has(token)) {
        output_tokens.push(token);
        continue;
      }
      const bpe_token_list = this.bpe(token);
      for (const t of bpe_token_list) {
        if (this.tokens_to_ids.has(t)) {
          output_tokens.push(t);
        } else if (this.byte_fallback) {
          const byte_tokens = Array.from(this.text_encoder.encode(t)).map(
            (x2) => `<0x${x2.toString(16).toUpperCase().padStart(2, "0")}>`
          );
          if (byte_tokens.every((x2) => this.tokens_to_ids.has(x2))) {
            output_tokens.push(...byte_tokens);
          } else if (this.unk_token != null) {
            output_tokens.push(this.unk_token);
          }
        } else if (this.unk_token != null) {
          output_tokens.push(this.unk_token);
        }
      }
    }
    return output_tokens;
  }
};
var BPE_default = BPE;
var Legacy = class extends TokenizerModel_default {
  /**
   * Create a Legacy tokenizer model instance.
   * @param config The configuration object for Legacy tokenizer model.
   * @param more_config Additional configuration object for the Legacy tokenizer model.
   */
  constructor(config2, more_config) {
    super(config2);
    const vocab = config2.vocab;
    this.tokens_to_ids = object_to_map(
      more_config.target_lang ? vocab[more_config.target_lang] : vocab
    );
    this.bos_token = more_config.bos_token;
    this.bos_token_id = this.tokens_to_ids.get(this.bos_token);
    this.eos_token = more_config.eos_token;
    this.eos_token_id = this.tokens_to_ids.get(this.eos_token);
    this.pad_token = more_config.pad_token;
    this.pad_token_id = this.tokens_to_ids.get(this.pad_token);
    this.unk_token = more_config.unk_token;
    this.unk_token_id = this.tokens_to_ids.get(this.unk_token);
    this.vocab = new Array(this.tokens_to_ids.size);
    for (const [key, value] of this.tokens_to_ids) {
      this.vocab[value] = key;
    }
  }
  encode(tokens) {
    return tokens;
  }
};
var Legacy_default = Legacy;
function create_tokenizer_model(model_config, config2) {
  switch (model_config.type) {
    case "WordPiece":
      return new WordPiece_default(model_config);
    case "Unigram":
      return new Unigram_default(model_config, config2.eos_token);
    case "BPE":
      return new BPE_default(model_config);
    default:
      if (model_config.vocab) {
        if (Array.isArray(model_config.vocab)) {
          return new Unigram_default(model_config, config2.eos_token);
        } else if (Object.hasOwn(model_config, "continuing_subword_prefix") && Object.hasOwn(model_config, "unk_token")) {
          if (Object.hasOwn(model_config, "merges")) {
            return new BPE_default(model_config);
          } else {
            return new WordPiece_default(model_config);
          }
        } else {
          return new Legacy_default(model_config, {
            target_lang: config2.target_lang,
            bos_token: config2.bos_token,
            eos_token: config2.eos_token,
            pad_token: config2.pad_token,
            unk_token: config2.unk_token
          });
        }
      }
      throw new Error(
        `Unknown TokenizerModel type: ${model_config?.type}`
      );
  }
}
var create_tokenizer_model_default = create_tokenizer_model;
var PostProcessor = class extends Callable_default {
  /**
   * @param config The configuration for the post-processor.
   */
  constructor(config2) {
    super();
    this.config = config2;
  }
  /**
   * Alias for {@link PostProcessor#post_process}.
   * @param tokens The text or array of texts to post-process.
   * @param args Additional arguments required by the post-processing logic.
   * @returns The post-processed tokens.
   */
  _call(tokens, ...args) {
    return this.post_process(tokens, ...args);
  }
};
var PostProcessor_default = PostProcessor;
var TemplateProcessing = class extends PostProcessor_default {
  /**
   * Replaces special tokens in the template with actual tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns An object containing the list of tokens with the special tokens replaced with actual tokens.
   */
  post_process(tokens, tokens_pair = null, add_special_tokens = true) {
    const type = tokens_pair === null ? this.config.single : this.config.pair;
    let processed_tokens = [];
    let types = [];
    for (const item of type) {
      if ("SpecialToken" in item) {
        if (add_special_tokens) {
          processed_tokens.push(item.SpecialToken.id);
          types.push(item.SpecialToken.type_id);
        }
      } else if ("Sequence" in item) {
        if (item.Sequence.id === "A") {
          processed_tokens = merge_arrays(processed_tokens, tokens);
          types = merge_arrays(
            types,
            new Array(tokens.length).fill(item.Sequence.type_id)
          );
        } else if (item.Sequence.id === "B") {
          processed_tokens = merge_arrays(processed_tokens, tokens_pair);
          types = merge_arrays(
            types,
            new Array(tokens_pair.length).fill(item.Sequence.type_id)
          );
        }
      }
    }
    return { tokens: processed_tokens, token_type_ids: types };
  }
};
var TemplateProcessing_default = TemplateProcessing;
var ByteLevel2 = class extends PostProcessor_default {
  /**
   * Post process the given tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @returns An object containing the post-processed tokens.
   */
  post_process(tokens, tokens_pair = null) {
    return { tokens, tokens_pair };
  }
};
var ByteLevel_default2 = ByteLevel2;
var BertProcessing = class extends PostProcessor_default {
  /**
   * @param config The configuration for the post-processor.
   * @param config.cls The special tokens to add to the beginning of the input.
   * @param config.sep The special tokens to add to the end of the input.
   */
  constructor(config2) {
    super(config2);
    this.sep = config2.sep;
    this.cls = config2.cls;
  }
  /**
   * Adds the special tokens to the beginning and end of the input.
   * @param tokens The input tokens.
   * @param tokens_pair An optional second set of input tokens.
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns The post-processed tokens with the special tokens added to the beginning and end.
   */
  post_process(tokens, tokens_pair = null, add_special_tokens = true) {
    if (add_special_tokens) {
      tokens = merge_arrays([this.cls[0]], tokens, [this.sep[0]]);
    }
    let token_type_ids = new Array(tokens.length).fill(0);
    if (tokens_pair) {
      const middle = [];
      const after = add_special_tokens ? [this.sep[0]] : [];
      tokens = merge_arrays(tokens, middle, tokens_pair, after);
      token_type_ids = merge_arrays(
        token_type_ids,
        new Array(tokens_pair.length + middle.length + after.length).fill(1)
      );
    }
    return { tokens, token_type_ids };
  }
};
var BertProcessing_default = BertProcessing;
var RobertaProcessing = class extends PostProcessor_default {
  /**
   * @param config The configuration for the post-processor.
   * @param config.cls The special tokens to add to the beginning of the input.
   * @param config.sep The special tokens to add to the end of the input.
   */
  constructor(config2) {
    super(config2);
    this.sep = config2.sep;
    this.cls = config2.cls;
  }
  /**
   * Adds the special tokens to the beginning and end of the input.
   * @param tokens The input tokens.
   * @param tokens_pair An optional second set of input tokens.
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns The post-processed tokens with the special tokens added to the beginning and end.
   */
  post_process(tokens, tokens_pair, add_special_tokens = true) {
    if (add_special_tokens) {
      tokens = merge_arrays([this.cls[0]], tokens, [this.sep[0]]);
    }
    let token_type_ids = new Array(tokens.length).fill(0);
    if (tokens_pair) {
      const middle = add_special_tokens ? [this.sep[0]] : [];
      const after = add_special_tokens ? [this.sep[0]] : [];
      tokens = merge_arrays(tokens, middle, tokens_pair, after);
      token_type_ids = merge_arrays(
        token_type_ids,
        new Array(tokens_pair.length + middle.length + after.length).fill(1)
      );
    }
    return { tokens, token_type_ids };
  }
};
var RobertaProcessing_default = RobertaProcessing;
var Sequence3 = class extends PostProcessor_default {
  /**
   * Creates a new instance of Sequence post-processor.
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.processors = (config2.processors ?? []).map((x2) => create_post_processor_default(x2));
  }
  /**
   * Post process the given tokens.
   * @param tokens The list of tokens for the first sequence.
   * @param tokens_pair The list of tokens for the second sequence (optional).
   * @param add_special_tokens Whether to add the special tokens to the beginning and end of the input.
   * @returns An object containing the post-processed tokens.
   */
  post_process(tokens, tokens_pair = null, add_special_tokens = true) {
    let processed_tokens = { tokens, tokens_pair };
    for (const processor of this.processors) {
      processed_tokens = processor.post_process(
        processed_tokens.tokens,
        processed_tokens.tokens_pair,
        add_special_tokens
      );
    }
    return processed_tokens;
  }
};
var Sequence_default3 = Sequence3;
function create_post_processor(config2) {
  if (config2 === null) return null;
  switch (config2.type) {
    case "TemplateProcessing":
      return new TemplateProcessing_default(config2);
    case "ByteLevel":
      return new ByteLevel_default2(config2);
    case "BertProcessing":
      return new BertProcessing_default(config2);
    case "RobertaProcessing":
      return new RobertaProcessing_default(config2);
    case "Sequence":
      return new Sequence_default3(config2);
    default:
      throw new Error(`Unknown PostProcessor type: ${config2.type}`);
  }
}
var create_post_processor_default = create_post_processor;
var Decoder = class extends Callable_default {
  /**
   * Creates an instance of `Decoder`.
   * @param config The configuration object.
   **/
  constructor(config2) {
    super();
    this.config = config2;
    this.added_tokens = [];
    this.end_of_word_suffix = null;
    this.trim_offsets = "trim_offsets" in config2 ? config2.trim_offsets : false;
  }
  /**
   * Calls the `decode` method.
   *
   * @param tokens The list of tokens.
   * @returns The decoded string.
   */
  _call(tokens) {
    return this.decode(tokens);
  }
  /**
   * Decodes a list of tokens.
   * @param tokens The list of tokens.
   * @returns The decoded string.
   */
  decode(tokens) {
    return this.decode_chain(tokens).join("");
  }
};
var Decoder_default = Decoder;
var ByteLevel3 = class extends Decoder_default {
  /**
   * Create a `ByteLevelDecoder` object.
   */
  constructor(config2) {
    super(config2);
    this.byte_decoder = UNICODE_TO_BYTES;
    this.text_decoder = new TextDecoder("utf-8", {
      fatal: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ignoreBOM: true
    });
    this.end_of_word_suffix = null;
  }
  /**
   * Convert an array of tokens to string by decoding each byte.
   * @param tokens Array of tokens to be decoded.
   * @returns The decoded string.
   */
  convert_tokens_to_string(tokens) {
    const text = tokens.join("");
    const byte_array = new Uint8Array(
      [...text].map((c) => this.byte_decoder[c])
    );
    return this.text_decoder.decode(byte_array);
  }
  decode_chain(tokens) {
    const sub_texts = [];
    let current_sub_text = [];
    for (const token of tokens) {
      if (this.added_tokens.find((x2) => x2.content === token) !== void 0) {
        if (current_sub_text.length > 0) {
          sub_texts.push(this.convert_tokens_to_string(current_sub_text));
          current_sub_text = [];
        }
        sub_texts.push(token);
      } else {
        current_sub_text.push(token);
      }
    }
    if (current_sub_text.length > 0) {
      sub_texts.push(this.convert_tokens_to_string(current_sub_text));
    }
    return sub_texts;
  }
};
var ByteLevel_default3 = ByteLevel3;
var WordPiece = class extends Decoder_default {
  /**
   * Creates a new instance of WordPieceDecoder.
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.cleanup = config2.cleanup;
  }
  decode_chain(tokens) {
    return tokens.map((token, i2) => {
      if (i2 !== 0) {
        const prefix = this.config.prefix;
        if (prefix && token.startsWith(prefix)) {
          token = token.replace(prefix, "");
        } else {
          token = " " + token;
        }
      }
      if (this.cleanup) {
        token = clean_up_tokenization(token);
      }
      return token;
    });
  }
};
var WordPiece_default2 = WordPiece;
var Metaspace2 = class extends Decoder_default {
  /**
   * Constructs a new MetaspaceDecoder object.
   * @param config The configuration object for the MetaspaceDecoder.
   */
  constructor(config2) {
    super(config2);
    this.replacement = config2.replacement ?? "\u2581";
  }
  decode_chain(tokens) {
    const result = [];
    for (let i2 = 0; i2 < tokens.length; ++i2) {
      let normalized = tokens[i2].replaceAll(this.replacement, " ");
      if (i2 == 0 && normalized.startsWith(" ")) {
        normalized = normalized.substring(1);
      }
      result.push(normalized);
    }
    return result;
  }
};
var Metaspace_default2 = Metaspace2;
var BPE2 = class extends Decoder_default {
  constructor(config2) {
    super(config2);
    this.suffix = config2.suffix ?? "";
  }
  decode_chain(tokens) {
    return tokens.map((token, i2) => {
      return token.replaceAll(this.suffix, i2 === tokens.length - 1 ? "" : " ");
    });
  }
};
var BPE_default2 = BPE2;
var CTC = class extends Decoder_default {
  constructor(config2) {
    super(config2);
    this.pad_token = config2.pad_token ?? "";
    this.word_delimiter_token = config2.word_delimiter_token ?? "";
    this.cleanup = config2.cleanup;
  }
  /**
   * Converts a connectionist-temporal-classification (CTC) output tokens into a single string.
   * @param tokens Array of tokens to be decoded.
   * @returns The decoded string.
   */
  convert_tokens_to_string(tokens) {
    if (tokens.length === 0) return "";
    const grouped_tokens = [tokens[0]];
    for (let i2 = 1; i2 < tokens.length; ++i2) {
      if (tokens[i2] !== grouped_tokens.at(-1)) {
        grouped_tokens.push(tokens[i2]);
      }
    }
    const filtered_tokens = grouped_tokens.filter(
      (token) => token !== this.pad_token
    );
    let text = filtered_tokens.join("");
    if (this.cleanup) {
      text = clean_up_tokenization(text).replaceAll(this.word_delimiter_token, " ").trim();
    }
    return text;
  }
  decode_chain(tokens) {
    return [this.convert_tokens_to_string(tokens)];
  }
};
var CTC_default = CTC;
var Sequence4 = class extends Decoder_default {
  /**
   * Creates a new instance of DecoderSequence.
   * @param config The configuration object.
   */
  constructor(config2) {
    super(config2);
    this.decoders = (config2.decoders ?? []).map((x2) => create_decoder_default(x2));
  }
  decode_chain(tokens) {
    return this.decoders.reduce((toks, decoder) => {
      return decoder.decode_chain(toks);
    }, tokens);
  }
};
var Sequence_default4 = Sequence4;
var Replace3 = class extends Decoder_default {
  /**
   * @param config The configuration object for the decoder.
   */
  constructor(config2) {
    super(config2);
    this.pattern = create_pattern(this.config.pattern);
  }
  decode_chain(tokens) {
    const content = this.config.content ?? "";
    const pattern = this.pattern;
    return pattern === null ? tokens : tokens.map((token) => token.replaceAll(pattern, content));
  }
};
var Replace_default3 = Replace3;
var Fuse = class extends Decoder_default {
  decode_chain(tokens) {
    return [tokens.join("")];
  }
};
var Fuse_default = Fuse;
var Strip2 = class extends Decoder_default {
  constructor(config2) {
    super(config2);
    this.content = config2.content ?? "";
    this.start = config2.start ?? 0;
    this.stop = config2.stop ?? 0;
  }
  decode_chain(tokens) {
    return tokens.map((token) => {
      let start_cut = 0;
      for (let i2 = 0; i2 < this.start; ++i2) {
        if (token[i2] === this.content) {
          start_cut = i2 + 1;
          continue;
        } else {
          break;
        }
      }
      let stop_cut = token.length;
      for (let i2 = 0; i2 < this.stop; ++i2) {
        const index = token.length - i2 - 1;
        if (token[index] === this.content) {
          stop_cut = index;
          continue;
        } else {
          break;
        }
      }
      return token.slice(start_cut, stop_cut);
    });
  }
};
var Strip_default2 = Strip2;
var ByteFallback = class extends Decoder_default {
  constructor(config2) {
    super(config2);
    this.text_decoder = new TextDecoder();
  }
  decode_chain(tokens) {
    const new_tokens = [];
    let previous_byte_tokens = [];
    for (const token of tokens) {
      let bytes = null;
      if (token.length === 6 && token.startsWith("<0x") && token.endsWith(">")) {
        const byte = parseInt(token.slice(3, 5), 16);
        if (!isNaN(byte)) {
          bytes = byte;
        }
      }
      if (bytes !== null) {
        previous_byte_tokens.push(bytes);
      } else {
        if (previous_byte_tokens.length > 0) {
          const string = this.text_decoder.decode(
            Uint8Array.from(previous_byte_tokens)
          );
          new_tokens.push(string);
          previous_byte_tokens = [];
        }
        new_tokens.push(token);
      }
    }
    if (previous_byte_tokens.length > 0) {
      const string = this.text_decoder.decode(
        Uint8Array.from(previous_byte_tokens)
      );
      new_tokens.push(string);
      previous_byte_tokens = [];
    }
    return new_tokens;
  }
};
var ByteFallback_default = ByteFallback;
function create_decoder(config2) {
  if (config2 === null) return null;
  switch (config2.type) {
    case "ByteLevel":
      return new ByteLevel_default3(config2);
    case "WordPiece":
      return new WordPiece_default2(config2);
    case "Metaspace":
      return new Metaspace_default2(config2);
    case "BPEDecoder":
      return new BPE_default2(config2);
    case "CTC":
      return new CTC_default(config2);
    case "Sequence":
      return new Sequence_default4(config2);
    case "Replace":
      return new Replace_default3(config2);
    case "Fuse":
      return new Fuse_default(config2);
    case "Strip":
      return new Strip_default2(config2);
    case "ByteFallback":
      return new ByteFallback_default(config2);
    default:
      throw new Error(`Unknown Decoder type: ${config2.type}`);
  }
}
var create_decoder_default = create_decoder;
var Tokenizer = class {
  constructor(tokenizer2, config2) {
    const tokenizer_error = validate_object(tokenizer2, "Tokenizer", [
      "model",
      "decoder",
      "post_processor",
      "pre_tokenizer",
      "normalizer"
    ]);
    if (tokenizer_error) {
      throw new Error(tokenizer_error);
    }
    const config_error = validate_object(config2, "Config");
    if (config_error) {
      throw new Error(config_error);
    }
    this.tokenizer = tokenizer2;
    this.config = config2;
    this.normalizer = create_normalizer_default(this.tokenizer.normalizer);
    this.pre_tokenizer = create_pre_tokenizer_default(this.tokenizer.pre_tokenizer);
    this.model = create_tokenizer_model_default(this.tokenizer.model, this.config);
    this.post_processor = create_post_processor_default(this.tokenizer.post_processor);
    this.decoder = create_decoder_default(this.tokenizer.decoder);
    this.special_tokens = [];
    this.all_special_ids = [];
    this.added_tokens = [];
    const unnormalized_contents = [];
    const normalized_contents = [];
    this.added_tokens_map = /* @__PURE__ */ new Map();
    for (const added_token of this.tokenizer.added_tokens) {
      const token = new AddedToken_default(added_token);
      this.added_tokens.push(token);
      this.model.tokens_to_ids.set(token.content, token.id);
      this.model.vocab[token.id] = token.content;
      if (token.special) {
        this.special_tokens.push(token.content);
        this.all_special_ids.push(token.id);
      }
      this.added_tokens_map.set(token.content, token);
      if (token.normalized && this.normalizer !== null) {
        const normalized_content = this.normalizer(token.content);
        normalized_contents.push(normalized_content);
        this.added_tokens_map.set(normalized_content, token);
      } else {
        unnormalized_contents.push(token.content);
      }
    }
    (this.config.additional_special_tokens ?? []).forEach((token) => {
      if (!this.special_tokens.includes(token)) this.special_tokens.push(token);
    });
    if (this.decoder) {
      this.decoder.added_tokens = this.added_tokens;
      this.decoder.end_of_word_suffix = this.model.end_of_word_suffix;
    }
    this.splitter_unnormalized = new DictionarySplitter_default(unnormalized_contents);
    this.splitter_normalized = new DictionarySplitter_default(normalized_contents);
    this.remove_space = this.config.remove_space;
    this.clean_up_tokenization_spaces = this.config.clean_up_tokenization_spaces ?? true;
    this.do_lowercase_and_remove_accent = this.config.do_lowercase_and_remove_accent ?? false;
  }
  // Implementation
  encode(text, {
    text_pair = null,
    add_special_tokens = true,
    return_token_type_ids = null
  } = {}) {
    const { tokens, token_type_ids } = this.tokenize_helper(text, {
      text_pair,
      add_special_tokens
    });
    const input_ids = tokens.map(
      (t) => this.added_tokens_map.get(t)?.id ?? this.model.tokens_to_ids.get(t) ?? this.model.unk_token_id
    );
    const result = {
      ids: input_ids,
      tokens,
      attention_mask: new Array(input_ids.length).fill(1)
    };
    if (return_token_type_ids && token_type_ids) {
      result.token_type_ids = token_type_ids;
    }
    return result;
  }
  decode(token_ids, options = {}) {
    if (!Array.isArray(token_ids) || token_ids.length === 0 || !is_integral_number(token_ids[0])) {
      throw Error("token_ids must be a non-empty array of integers.");
    }
    let tokens = token_ids.map(
      (i2) => this.model.vocab[Number(i2)] ?? this.model.unk_token
    );
    if (options.skip_special_tokens) {
      tokens = tokens.filter((x2) => !this.special_tokens.includes(x2));
    }
    let decoded = this.decoder ? this.decoder(tokens) : tokens.join(" ");
    if (this.decoder && this.decoder.end_of_word_suffix) {
      decoded = decoded.replaceAll(this.decoder.end_of_word_suffix, " ");
      if (options.skip_special_tokens) {
        decoded = decoded.trim();
      }
    }
    if (options.clean_up_tokenization_spaces ?? this.clean_up_tokenization_spaces) {
      decoded = clean_up_tokenization(decoded);
    }
    return decoded;
  }
  /**
   * Converts a string into a sequence of tokens.
   * @param text The sequence to be encoded.
   * @param options An optional object containing the following properties:
   * @returns The list of tokens.
   */
  tokenize(text, { text_pair = null, add_special_tokens = false } = {}) {
    return this.tokenize_helper(text, { text_pair, add_special_tokens }).tokens;
  }
  encode_text(text) {
    if (text === null) {
      return null;
    }
    const sections = this.splitter_unnormalized.split(text);
    sections.forEach((section, i2) => {
      const added_token = this.added_tokens_map.get(section);
      if (added_token) {
        if (added_token.lstrip && i2 > 0) {
          sections[i2 - 1] = sections[i2 - 1].trimEnd();
        }
        if (added_token.rstrip && i2 < sections.length - 1) {
          sections[i2 + 1] = sections[i2 + 1].trimStart();
        }
      }
    });
    return sections.flatMap((processed_text, section_index) => {
      if (processed_text.length === 0) {
        return [];
      }
      if (this.added_tokens_map.has(processed_text)) {
        return [processed_text];
      }
      if (this.remove_space === true) {
        processed_text = processed_text.trim().split(/\s+/).join(" ");
      }
      if (this.do_lowercase_and_remove_accent) {
        processed_text = lowercase_and_remove_accents(processed_text);
      }
      if (this.normalizer !== null) {
        processed_text = this.normalizer(processed_text);
      }
      if (processed_text.length === 0) {
        return [];
      }
      const subsections = this.splitter_normalized.split(processed_text);
      subsections.forEach((subsection, j) => {
        const added_token = this.added_tokens_map.get(subsection);
        if (added_token) {
          if (added_token.lstrip && j > 0) {
            subsections[j - 1] = subsections[j - 1].trimEnd();
          }
          if (added_token.rstrip && j < subsections.length - 1) {
            subsections[j + 1] = subsections[j + 1].trimStart();
          }
        }
      });
      return subsections.flatMap((subsection) => {
        if (subsection.length === 0) {
          return [];
        }
        if (this.added_tokens_map.has(subsection)) {
          return [subsection];
        }
        const section_tokens = this.pre_tokenizer !== null ? this.pre_tokenizer(subsection, {
          section_index
        }) : [subsection];
        return this.model(section_tokens);
      });
    });
  }
  tokenize_helper(text, { text_pair = null, add_special_tokens = true }) {
    const tokens1 = this.encode_text(text);
    const tokens2 = this.encode_text(text_pair || null);
    return this.post_processor ? this.post_processor(tokens1, tokens2, add_special_tokens) : { tokens: merge_arrays(tokens1 ?? [], tokens2 ?? []) };
  }
  /**
   * Converts a token string to its corresponding token ID.
   * @param token The token string to convert.
   * @returns The token ID, or undefined if the token is not in the vocabulary.
   */
  token_to_id(token) {
    return this.model.tokens_to_ids.get(token);
  }
  /**
   * Converts a token ID to its corresponding token string.
   * @param id The token ID to convert.
   * @returns The token string, or undefined if the ID is not in the vocabulary.
   */
  id_to_token(id) {
    return this.model.vocab[id];
  }
  /**
   * Returns a mapping of token IDs to AddedToken objects for all added tokens.
   * @returns A Map where keys are token IDs and values are AddedToken objects.
   */
  get_added_tokens_decoder() {
    const decoder = /* @__PURE__ */ new Map();
    for (const token of this.added_tokens) {
      decoder.set(token.id, token);
    }
    return decoder;
  }
  /**
   * Get the underlying vocabulary
   * @param with_added_tokens Whether to include the added tokens
   * @returns The vocabulary
   */
  get_vocab(with_added_tokens = true) {
    const vocab = /* @__PURE__ */ new Map();
    for (let i2 = 0; i2 < this.model.vocab.length; ++i2) {
      const token = this.model.vocab[i2];
      if (with_added_tokens || !this.added_tokens_map.has(token)) {
        vocab.set(token, i2);
      }
    }
    return vocab;
  }
};
var Tokenizer_default = Tokenizer;

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fflate/esm/browser.js
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd2 = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd2, mb, r) {
  var s = cd2.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd2[i2])
      ++l[cd2[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd2[i2]) {
        var sv = i2 << 4 | cd2[i2];
        var r_1 = mb - cd2[i2];
        var v = le[cd2[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd2[i2]) {
        co[i2] = rev[le[cd2[i2] - 1]++] >> 15 - cd2[i2];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st2, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st2.f && !st2.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st2.i != 2;
  var noSt = st2.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st2.f || 0, pos = st2.p || 0, bt = st2.b || 0, lm = st2.l, dm = st2.d, lbt = st2.m, dbt = st2.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st2.b = bt += l, st2.p = pos = t * 8, st2.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt2 = ldt.subarray(0, hLit), dt2 = ldt.subarray(hLit);
        lbt = max(lt2);
        dbt = max(dt2);
        lm = hMap(lt2, lbt, 1);
        dm = hMap(dt2, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt2 = fd2[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt2 += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt2) {
          var shift = dl - dt2, dend = Math.min(dt2, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt2];
      }
    }
    st2.l = lm, st2.p = lpos, st2.b = bt, st2.f = final;
    if (lm)
      final = 1, st2.m = lbt, st2.d = dm, st2.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var et = /* @__PURE__ */ new u8(0);
var zls = function(d, dict) {
  if ((d[0] & 15) != 8 || d[0] >> 4 > 7 || (d[0] << 8 | d[1]) % 31)
    err(6, "invalid zlib data");
  if ((d[1] >> 5 & 1) == +!dict)
    err(6, "invalid zlib data: " + (d[1] & 32 ? "need" : "unexpected") + " dictionary");
  return (d[1] >> 3 & 4) + 2;
};
var Inflate = /* @__PURE__ */ (function() {
  function Inflate2(opts, cb) {
    if (typeof opts == "function")
      cb = opts, opts = {};
    this.ondata = cb;
    var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
    this.s = { i: 0, b: dict ? dict.length : 0 };
    this.o = new u8(32768);
    this.p = new u8(0);
    if (dict)
      this.o.set(dict);
  }
  Inflate2.prototype.e = function(c) {
    if (!this.ondata)
      err(5);
    if (this.d)
      err(4);
    if (!this.p.length)
      this.p = c;
    else if (c.length) {
      var n = new u8(this.p.length + c.length);
      n.set(this.p), n.set(c, this.p.length), this.p = n;
    }
  };
  Inflate2.prototype.c = function(final) {
    this.s.i = +(this.d = final || false);
    var bts = this.s.b;
    var dt2 = inflt(this.p, this.s, this.o);
    this.ondata(slc(dt2, bts, this.s.b), this.d);
    this.o = slc(dt2, this.s.b - 32768), this.s.b = this.o.length;
    this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
  };
  Inflate2.prototype.push = function(chunk, final) {
    this.e(chunk), this.c(final);
  };
  return Inflate2;
})();
var Unzlib = /* @__PURE__ */ (function() {
  function Unzlib2(opts, cb) {
    Inflate.call(this, opts, cb);
    this.v = opts && opts.dictionary ? 2 : 1;
  }
  Unzlib2.prototype.push = function(chunk, final) {
    Inflate.prototype.e.call(this, chunk);
    if (this.v) {
      if (this.p.length < 6 && !final)
        return;
      this.p = this.p.subarray(zls(this.p, this.v - 1)), this.v = 0;
    }
    if (final) {
      if (this.p.length < 4)
        err(6, "invalid zlib data");
      this.p = this.p.subarray(0, -4);
    }
    Inflate.prototype.c.call(this, final);
  };
  return Unzlib2;
})();
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var td2 = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td2.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/iobuffer/lib/text.js
function decode(bytes, encoding = "utf8") {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(bytes);
}
var encoder = new TextEncoder();
function encode(str) {
  return encoder.encode(str);
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/iobuffer/lib/iobuffer.js
var defaultByteLength = 1024 * 8;
var hostBigEndian = (() => {
  const array = new Uint8Array(4);
  const view = new Uint32Array(array.buffer);
  return !((view[0] = 1) & array[0]);
})();
var typedArrays = {
  int8: globalThis.Int8Array,
  uint8: globalThis.Uint8Array,
  int16: globalThis.Int16Array,
  uint16: globalThis.Uint16Array,
  int32: globalThis.Int32Array,
  uint32: globalThis.Uint32Array,
  uint64: globalThis.BigUint64Array,
  int64: globalThis.BigInt64Array,
  float32: globalThis.Float32Array,
  float64: globalThis.Float64Array
};
var IOBuffer = class _IOBuffer {
  /**
   * Reference to the internal ArrayBuffer object.
   */
  buffer;
  /**
   * Byte length of the internal ArrayBuffer.
   */
  byteLength;
  /**
   * Byte offset of the internal ArrayBuffer.
   */
  byteOffset;
  /**
   * Byte length of the internal ArrayBuffer.
   */
  length;
  /**
   * The current offset of the buffer's pointer.
   */
  offset;
  lastWrittenByte;
  littleEndian;
  _data;
  _mark;
  _marks;
  /**
   * Create a new IOBuffer.
   * @param data - The data to construct the IOBuffer with.
   * If data is a number, it will be the new buffer's length<br>
   * If data is `undefined`, the buffer will be initialized with a default length of 8Kb<br>
   * If data is an ArrayBuffer, SharedArrayBuffer, an ArrayBufferView (Typed Array), an IOBuffer instance,
   * or a Node.js Buffer, a view will be created over the underlying ArrayBuffer.
   * @param options - An object for the options.
   * @returns A new IOBuffer instance.
   */
  constructor(data = defaultByteLength, options = {}) {
    let dataIsGiven = false;
    if (typeof data === "number") {
      data = new ArrayBuffer(data);
    } else {
      dataIsGiven = true;
      this.lastWrittenByte = data.byteLength;
    }
    const offset = options.offset ? options.offset >>> 0 : 0;
    const byteLength = data.byteLength - offset;
    let dvOffset = offset;
    if (ArrayBuffer.isView(data) || data instanceof _IOBuffer) {
      if (data.byteLength !== data.buffer.byteLength) {
        dvOffset = data.byteOffset + offset;
      }
      data = data.buffer;
    }
    if (dataIsGiven) {
      this.lastWrittenByte = byteLength;
    } else {
      this.lastWrittenByte = 0;
    }
    this.buffer = data;
    this.length = byteLength;
    this.byteLength = byteLength;
    this.byteOffset = dvOffset;
    this.offset = 0;
    this.littleEndian = true;
    this._data = new DataView(this.buffer, dvOffset, byteLength);
    this._mark = 0;
    this._marks = [];
  }
  /**
   * Checks if the memory allocated to the buffer is sufficient to store more
   * bytes after the offset.
   * @param byteLength - The needed memory in bytes.
   * @returns `true` if there is sufficient space and `false` otherwise.
   */
  available(byteLength = 1) {
    return this.offset + byteLength <= this.length;
  }
  /**
   * Check if little-endian mode is used for reading and writing multi-byte
   * values.
   * @returns `true` if little-endian mode is used, `false` otherwise.
   */
  isLittleEndian() {
    return this.littleEndian;
  }
  /**
   * Set little-endian mode for reading and writing multi-byte values.
   * @returns This.
   */
  setLittleEndian() {
    this.littleEndian = true;
    return this;
  }
  /**
   * Check if big-endian mode is used for reading and writing multi-byte values.
   * @returns `true` if big-endian mode is used, `false` otherwise.
   */
  isBigEndian() {
    return !this.littleEndian;
  }
  /**
   * Switches to big-endian mode for reading and writing multi-byte values.
   * @returns This.
   */
  setBigEndian() {
    this.littleEndian = false;
    return this;
  }
  /**
   * Move the pointer n bytes forward.
   * @param n - Number of bytes to skip.
   * @returns This.
   */
  skip(n = 1) {
    this.offset += n;
    return this;
  }
  /**
   * Move the pointer n bytes backward.
   * @param n - Number of bytes to move back.
   * @returns This.
   */
  back(n = 1) {
    this.offset -= n;
    return this;
  }
  /**
   * Move the pointer to the given offset.
   * @param offset - The offset to move to.
   * @returns This.
   */
  seek(offset) {
    this.offset = offset;
    return this;
  }
  /**
   * Store the current pointer offset.
   * @see {@link IOBuffer#reset}
   * @returns This.
   */
  mark() {
    this._mark = this.offset;
    return this;
  }
  /**
   * Move the pointer back to the last pointer offset set by mark.
   * @see {@link IOBuffer#mark}
   * @returns This.
   */
  reset() {
    this.offset = this._mark;
    return this;
  }
  /**
   * Push the current pointer offset to the mark stack.
   * @see {@link IOBuffer#popMark}
   * @returns This.
   */
  pushMark() {
    this._marks.push(this.offset);
    return this;
  }
  /**
   * Pop the last pointer offset from the mark stack, and set the current
   * pointer offset to the popped value.
   * @see {@link IOBuffer#pushMark}
   * @returns This.
   */
  popMark() {
    const offset = this._marks.pop();
    if (offset === void 0) {
      throw new Error("Mark stack empty");
    }
    this.seek(offset);
    return this;
  }
  /**
   * Move the pointer offset back to 0.
   * @returns This.
   */
  rewind() {
    this.offset = 0;
    return this;
  }
  /**
   * Make sure the buffer has sufficient memory to write a given byteLength at
   * the current pointer offset.
   * If the buffer's memory is insufficient, this method will create a new
   * buffer (a copy) with a length that is twice (byteLength + current offset).
   * @param byteLength - The needed memory in bytes.
   * @returns This.
   */
  ensureAvailable(byteLength = 1) {
    if (!this.available(byteLength)) {
      const lengthNeeded = this.offset + byteLength;
      const newLength = lengthNeeded * 2;
      const newArray = new Uint8Array(newLength);
      newArray.set(new Uint8Array(this.buffer));
      this.buffer = newArray.buffer;
      this.length = newLength;
      this.byteLength = newLength;
      this._data = new DataView(this.buffer);
    }
    return this;
  }
  /**
   * Read a byte and return false if the byte's value is 0, or true otherwise.
   * Moves pointer forward by one byte.
   * @returns The read boolean.
   */
  readBoolean() {
    return this.readUint8() !== 0;
  }
  /**
   * Read a signed 8-bit integer and move pointer forward by 1 byte.
   * @returns The read byte.
   */
  readInt8() {
    return this._data.getInt8(this.offset++);
  }
  /**
   * Read an unsigned 8-bit integer and move pointer forward by 1 byte.
   * @returns The read byte.
   */
  readUint8() {
    return this._data.getUint8(this.offset++);
  }
  /**
   * Alias for {@link IOBuffer#readUint8}.
   * @returns The read byte.
   */
  readByte() {
    return this.readUint8();
  }
  /**
   * Read `n` bytes and move pointer forward by `n` bytes.
   * @param n - Number of bytes to read.
   * @returns The read bytes.
   */
  readBytes(n = 1) {
    return this.readArray(n, "uint8");
  }
  /**
   * Creates an array of corresponding to the type `type` and size `size`.
   * For example, type `uint8` will create a `Uint8Array`.
   * @param size - size of the resulting array
   * @param type - number type of elements to read
   * @returns The read array.
   */
  readArray(size, type) {
    const bytes = typedArrays[type].BYTES_PER_ELEMENT * size;
    const offset = this.byteOffset + this.offset;
    const slice = this.buffer.slice(offset, offset + bytes);
    if (this.littleEndian === hostBigEndian && type !== "uint8" && type !== "int8") {
      const slice2 = new Uint8Array(this.buffer.slice(offset, offset + bytes));
      slice2.reverse();
      const returnArray2 = new typedArrays[type](slice2.buffer);
      this.offset += bytes;
      returnArray2.reverse();
      return returnArray2;
    }
    const returnArray = new typedArrays[type](slice);
    this.offset += bytes;
    return returnArray;
  }
  /**
   * Read a 16-bit signed integer and move pointer forward by 2 bytes.
   * @returns The read value.
   */
  readInt16() {
    const value = this._data.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  /**
   * Read a 16-bit unsigned integer and move pointer forward by 2 bytes.
   * @returns The read value.
   */
  readUint16() {
    const value = this._data.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  /**
   * Read a 32-bit signed integer and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readInt32() {
    const value = this._data.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 32-bit unsigned integer and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readUint32() {
    const value = this._data.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 32-bit floating number and move pointer forward by 4 bytes.
   * @returns The read value.
   */
  readFloat32() {
    const value = this._data.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  /**
   * Read a 64-bit floating number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readFloat64() {
    const value = this._data.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 64-bit signed integer number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readBigInt64() {
    const value = this._data.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 64-bit unsigned integer number and move pointer forward by 8 bytes.
   * @returns The read value.
   */
  readBigUint64() {
    const value = this._data.getBigUint64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  /**
   * Read a 1-byte ASCII character and move pointer forward by 1 byte.
   * @returns The read character.
   */
  readChar() {
    return String.fromCharCode(this.readInt8());
  }
  /**
   * Read `n` 1-byte ASCII characters and move pointer forward by `n` bytes.
   * @param n - Number of characters to read.
   * @returns The read characters.
   */
  readChars(n = 1) {
    let result = "";
    for (let i2 = 0; i2 < n; i2++) {
      result += this.readChar();
    }
    return result;
  }
  /**
   * Read the next `n` bytes, return a UTF-8 decoded string and move pointer
   * forward by `n` bytes.
   * @param n - Number of bytes to read.
   * @returns The decoded string.
   */
  readUtf8(n = 1) {
    return decode(this.readBytes(n));
  }
  /**
   * Read the next `n` bytes, return a string decoded with `encoding` and move pointer
   * forward by `n` bytes.
   * If no encoding is passed, the function is equivalent to @see {@link IOBuffer#readUtf8}
   * @param n - Number of bytes to read.
   * @param encoding - The encoding to use. Default is 'utf8'.
   * @returns The decoded string.
   */
  decodeText(n = 1, encoding = "utf8") {
    return decode(this.readBytes(n), encoding);
  }
  /**
   * Write 0xff if the passed value is truthy, 0x00 otherwise and move pointer
   * forward by 1 byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeBoolean(value) {
    this.writeUint8(value ? 255 : 0);
    return this;
  }
  /**
   * Write `value` as an 8-bit signed integer and move pointer forward by 1 byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt8(value) {
    this.ensureAvailable(1);
    this._data.setInt8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as an 8-bit unsigned integer and move pointer forward by 1
   * byte.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint8(value) {
    this.ensureAvailable(1);
    this._data.setUint8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * An alias for {@link IOBuffer#writeUint8}.
   * @param value - The value to write.
   * @returns This.
   */
  writeByte(value) {
    return this.writeUint8(value);
  }
  /**
   * Write all elements of `bytes` as uint8 values and move pointer forward by
   * `bytes.length` bytes.
   * @param bytes - The array of bytes to write.
   * @returns This.
   */
  writeBytes(bytes) {
    this.ensureAvailable(bytes.length);
    for (let i2 = 0; i2 < bytes.length; i2++) {
      this._data.setUint8(this.offset++, bytes[i2]);
    }
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 16-bit signed integer and move pointer forward by 2
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt16(value) {
    this.ensureAvailable(2);
    this._data.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 16-bit unsigned integer and move pointer forward by 2
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint16(value) {
    this.ensureAvailable(2);
    this._data.setUint16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit signed integer and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeInt32(value) {
    this.ensureAvailable(4);
    this._data.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit unsigned integer and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeUint32(value) {
    this.ensureAvailable(4);
    this._data.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 32-bit floating number and move pointer forward by 4
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeFloat32(value) {
    this.ensureAvailable(4);
    this._data.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit floating number and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeFloat64(value) {
    this.ensureAvailable(8);
    this._data.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit signed bigint and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeBigInt64(value) {
    this.ensureAvailable(8);
    this._data.setBigInt64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write `value` as a 64-bit unsigned bigint and move pointer forward by 8
   * bytes.
   * @param value - The value to write.
   * @returns This.
   */
  writeBigUint64(value) {
    this.ensureAvailable(8);
    this._data.setBigUint64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  /**
   * Write the charCode of `str`'s first character as an 8-bit unsigned integer
   * and move pointer forward by 1 byte.
   * @param str - The character to write.
   * @returns This.
   */
  writeChar(str) {
    return this.writeUint8(str.charCodeAt(0));
  }
  /**
   * Write the charCodes of all `str`'s characters as 8-bit unsigned integers
   * and move pointer forward by `str.length` bytes.
   * @param str - The characters to write.
   * @returns This.
   */
  writeChars(str) {
    for (let i2 = 0; i2 < str.length; i2++) {
      this.writeUint8(str.charCodeAt(i2));
    }
    return this;
  }
  /**
   * UTF-8 encode and write `str` to the current pointer offset and move pointer
   * forward according to the encoded length.
   * @param str - The string to write.
   * @returns This.
   */
  writeUtf8(str) {
    return this.writeBytes(encode(str));
  }
  /**
   * Export a Uint8Array view of the internal buffer.
   * The view starts at the byte offset and its length
   * is calculated to stop at the last written byte or the original length.
   * @returns A new Uint8Array view.
   */
  toArray() {
    return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
  }
  /**
   *  Get the total number of bytes written so far, regardless of the current offset.
   * @returns - Total number of bytes.
   */
  getWrittenByteLength() {
    return this.lastWrittenByte - this.byteOffset;
  }
  /**
   * Update the last written byte offset
   * @private
   */
  _updateLastWrittenByte() {
    if (this.offset > this.lastWrittenByte) {
      this.lastWrittenByte = this.offset;
    }
  }
};

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/crc.js
var crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 3988292384 ^ c >>> 1;
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}
var initialCrc = 4294967295;
function updateCrc(currentCrc, data, length) {
  let c = currentCrc;
  for (let n = 0; n < length; n++) {
    c = crcTable[(c ^ data[n]) & 255] ^ c >>> 8;
  }
  return c;
}
function crc(data, length) {
  return (updateCrc(initialCrc, data, length) ^ initialCrc) >>> 0;
}
function checkCrc(buffer, crcLength, chunkName) {
  const expectedCrc = buffer.readUint32();
  const actualCrc = crc(new Uint8Array(buffer.buffer, buffer.byteOffset + buffer.offset - crcLength - 4, crcLength), crcLength);
  if (actualCrc !== expectedCrc) {
    throw new Error(`CRC mismatch for chunk ${chunkName}. Expected ${expectedCrc}, found ${actualCrc}`);
  }
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/unfilter.js
function unfilterNone(currentLine, newLine, bytesPerLine) {
  for (let i2 = 0; i2 < bytesPerLine; i2++) {
    newLine[i2] = currentLine[i2];
  }
}
function unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  for (; i2 < bytesPerPixel; i2++) {
    newLine[i2] = currentLine[i2];
  }
  for (; i2 < bytesPerLine; i2++) {
    newLine[i2] = currentLine[i2] + newLine[i2 - bytesPerPixel] & 255;
  }
}
function unfilterUp(currentLine, newLine, prevLine, bytesPerLine) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2];
    }
  } else {
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + prevLine[i2] & 255;
    }
  }
}
function unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2];
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + (newLine[i2 - bytesPerPixel] >> 1) & 255;
    }
  } else {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2] + (prevLine[i2] >> 1) & 255;
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + (newLine[i2 - bytesPerPixel] + prevLine[i2] >> 1) & 255;
    }
  }
}
function unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel) {
  let i2 = 0;
  if (prevLine.length === 0) {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2];
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + newLine[i2 - bytesPerPixel] & 255;
    }
  } else {
    for (; i2 < bytesPerPixel; i2++) {
      newLine[i2] = currentLine[i2] + prevLine[i2] & 255;
    }
    for (; i2 < bytesPerLine; i2++) {
      newLine[i2] = currentLine[i2] + paethPredictor(newLine[i2 - bytesPerPixel], prevLine[i2], prevLine[i2 - bytesPerPixel]) & 255;
    }
  }
}
function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc)
    return a;
  else if (pb <= pc)
    return b;
  else
    return c;
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/apply_unfilter.js
function applyUnfilter(filterType, currentLine, newLine, prevLine, passLineBytes, bytesPerPixel) {
  switch (filterType) {
    case 0:
      unfilterNone(currentLine, newLine, passLineBytes);
      break;
    case 1:
      unfilterSub(currentLine, newLine, passLineBytes, bytesPerPixel);
      break;
    case 2:
      unfilterUp(currentLine, newLine, prevLine, passLineBytes);
      break;
    case 3:
      unfilterAverage(currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      break;
    case 4:
      unfilterPaeth(currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      break;
    default:
      throw new Error(`Unsupported filter: ${filterType}`);
  }
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/decode_interlace_adam7.js
var uint16 = new Uint16Array([255]);
var uint8 = new Uint8Array(uint16.buffer);
var osIsLittleEndian = uint8[0] === 255;
function decodeInterlaceAdam7(params) {
  const { data, width, height, channels, depth } = params;
  const passes = [
    { x: 0, y: 0, xStep: 8, yStep: 8 },
    // Pass 1
    { x: 4, y: 0, xStep: 8, yStep: 8 },
    // Pass 2
    { x: 0, y: 4, xStep: 4, yStep: 8 },
    // Pass 3
    { x: 2, y: 0, xStep: 4, yStep: 4 },
    // Pass 4
    { x: 0, y: 2, xStep: 2, yStep: 4 },
    // Pass 5
    { x: 1, y: 0, xStep: 2, yStep: 2 },
    // Pass 6
    { x: 0, y: 1, xStep: 1, yStep: 2 }
    // Pass 7
  ];
  const bytesPerPixel = Math.ceil(depth / 8) * channels;
  const resultData = new Uint8Array(height * width * bytesPerPixel);
  let offset = 0;
  for (let passIndex = 0; passIndex < 7; passIndex++) {
    const pass = passes[passIndex];
    const passWidth = Math.ceil((width - pass.x) / pass.xStep);
    const passHeight = Math.ceil((height - pass.y) / pass.yStep);
    if (passWidth <= 0 || passHeight <= 0)
      continue;
    const passLineBytes = passWidth * bytesPerPixel;
    const prevLine = new Uint8Array(passLineBytes);
    for (let y = 0; y < passHeight; y++) {
      const filterType = data[offset++];
      const currentLine = data.subarray(offset, offset + passLineBytes);
      offset += passLineBytes;
      const newLine = new Uint8Array(passLineBytes);
      applyUnfilter(filterType, currentLine, newLine, prevLine, passLineBytes, bytesPerPixel);
      prevLine.set(newLine);
      for (let x2 = 0; x2 < passWidth; x2++) {
        const outputX = pass.x + x2 * pass.xStep;
        const outputY = pass.y + y * pass.yStep;
        if (outputX >= width || outputY >= height)
          continue;
        for (let i2 = 0; i2 < bytesPerPixel; i2++) {
          resultData[(outputY * width + outputX) * bytesPerPixel + i2] = newLine[x2 * bytesPerPixel + i2];
        }
      }
    }
  }
  if (depth === 16) {
    const uint16Data = new Uint16Array(resultData.buffer);
    if (osIsLittleEndian) {
      for (let k = 0; k < uint16Data.length; k++) {
        uint16Data[k] = swap16(uint16Data[k]);
      }
    }
    return uint16Data;
  } else {
    return resultData;
  }
}
function swap16(val) {
  return (val & 255) << 8 | val >> 8 & 255;
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/decode_interlace_null.js
var uint162 = new Uint16Array([255]);
var uint82 = new Uint8Array(uint162.buffer);
var osIsLittleEndian2 = uint82[0] === 255;
var empty = new Uint8Array(0);
function decodeInterlaceNull(params) {
  const { data, width, height, channels, depth } = params;
  const bytesPerPixel = Math.ceil(depth / 8) * channels;
  const bytesPerLine = Math.ceil(depth / 8 * channels * width);
  const newData = new Uint8Array(height * bytesPerLine);
  let prevLine = empty;
  let offset = 0;
  let currentLine;
  let newLine;
  for (let i2 = 0; i2 < height; i2++) {
    currentLine = data.subarray(offset + 1, offset + 1 + bytesPerLine);
    newLine = newData.subarray(i2 * bytesPerLine, (i2 + 1) * bytesPerLine);
    switch (data[offset]) {
      case 0:
        unfilterNone(currentLine, newLine, bytesPerLine);
        break;
      case 1:
        unfilterSub(currentLine, newLine, bytesPerLine, bytesPerPixel);
        break;
      case 2:
        unfilterUp(currentLine, newLine, prevLine, bytesPerLine);
        break;
      case 3:
        unfilterAverage(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
        break;
      case 4:
        unfilterPaeth(currentLine, newLine, prevLine, bytesPerLine, bytesPerPixel);
        break;
      default:
        throw new Error(`Unsupported filter: ${data[offset]}`);
    }
    prevLine = newLine;
    offset += bytesPerLine + 1;
  }
  if (depth === 16) {
    const uint16Data = new Uint16Array(newData.buffer);
    if (osIsLittleEndian2) {
      for (let k = 0; k < uint16Data.length; k++) {
        uint16Data[k] = swap162(uint16Data[k]);
      }
    }
    return uint16Data;
  } else {
    return newData;
  }
}
function swap162(val) {
  return (val & 255) << 8 | val >> 8 & 255;
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/signature.js
var pngSignature = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
function checkSignature(buffer) {
  if (!hasPngSignature(buffer.readBytes(pngSignature.length))) {
    throw new Error("wrong PNG signature");
  }
}
function hasPngSignature(array) {
  if (array.length < pngSignature.length) {
    return false;
  }
  for (let i2 = 0; i2 < pngSignature.length; i2++) {
    if (array[i2] !== pngSignature[i2]) {
      return false;
    }
  }
  return true;
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/helpers/text.js
var textChunkName = "tEXt";
var NULL = 0;
var latin1Decoder = new TextDecoder("latin1");
function validateKeyword(keyword) {
  validateLatin1(keyword);
  if (keyword.length === 0 || keyword.length > 79) {
    throw new Error("keyword length must be between 1 and 79");
  }
}
var latin1Regex = /^[\u0000-\u00FF]*$/;
function validateLatin1(text) {
  if (!latin1Regex.test(text)) {
    throw new Error("invalid latin1 text");
  }
}
function decodetEXt(text, buffer, length) {
  const keyword = readKeyword(buffer);
  text[keyword] = readLatin1(buffer, length - keyword.length - 1);
}
function readKeyword(buffer) {
  buffer.mark();
  while (buffer.readByte() !== NULL) {
  }
  const end = buffer.offset;
  buffer.reset();
  const keyword = latin1Decoder.decode(buffer.readBytes(end - buffer.offset - 1));
  buffer.skip(1);
  validateKeyword(keyword);
  return keyword;
}
function readLatin1(buffer, length) {
  return latin1Decoder.decode(buffer.readBytes(length));
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/internal_types.js
var ColorType = {
  UNKNOWN: -1,
  GREYSCALE: 0,
  TRUECOLOUR: 2,
  INDEXED_COLOUR: 3,
  GREYSCALE_ALPHA: 4,
  TRUECOLOUR_ALPHA: 6
};
var CompressionMethod = {
  UNKNOWN: -1,
  DEFLATE: 0
};
var FilterMethod = {
  UNKNOWN: -1,
  ADAPTIVE: 0
};
var InterlaceMethod = {
  UNKNOWN: -1,
  NO_INTERLACE: 0,
  ADAM7: 1
};
var DisposeOpType = {
  NONE: 0,
  BACKGROUND: 1,
  PREVIOUS: 2
};
var BlendOpType = {
  SOURCE: 0,
  OVER: 1
};

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/png_decoder.js
var PngDecoder = class extends IOBuffer {
  _checkCrc;
  _inflator;
  _png;
  _apng;
  _end;
  _hasPalette;
  _palette;
  _hasTransparency;
  _transparency;
  _compressionMethod;
  _filterMethod;
  _interlaceMethod;
  _colorType;
  _isAnimated;
  _numberOfFrames;
  _numberOfPlays;
  _frames;
  _writingDataChunks;
  _chunks;
  _inflatorResult;
  constructor(data, options = {}) {
    super(data);
    const { checkCrc: checkCrc2 = false } = options;
    this._checkCrc = checkCrc2;
    this._inflator = new Unzlib((chunk, final) => {
      this._chunks.push(chunk);
      if (final) {
        const totalLength = this._chunks.reduce((sum, c) => sum + c.length, 0);
        this._inflatorResult = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk2 of this._chunks) {
          this._inflatorResult.set(chunk2, offset);
          offset += chunk2.length;
        }
        this._chunks = [];
      }
    });
    this._chunks = [];
    this._png = {
      width: -1,
      height: -1,
      channels: -1,
      data: new Uint8Array(0),
      depth: 1,
      text: {}
    };
    this._apng = {
      width: -1,
      height: -1,
      channels: -1,
      depth: 1,
      numberOfFrames: 1,
      numberOfPlays: 0,
      text: {},
      frames: []
    };
    this._end = false;
    this._hasPalette = false;
    this._palette = [];
    this._hasTransparency = false;
    this._transparency = new Uint16Array(0);
    this._compressionMethod = CompressionMethod.UNKNOWN;
    this._filterMethod = FilterMethod.UNKNOWN;
    this._interlaceMethod = InterlaceMethod.UNKNOWN;
    this._colorType = ColorType.UNKNOWN;
    this._isAnimated = false;
    this._numberOfFrames = 1;
    this._numberOfPlays = 0;
    this._frames = [];
    this._writingDataChunks = false;
    this._inflatorResult = new Uint8Array(0);
    this.setBigEndian();
  }
  decode() {
    checkSignature(this);
    while (!this._end) {
      const length = this.readUint32();
      const type = this.readChars(4);
      this.decodeChunk(length, type);
    }
    this._inflator.push(new Uint8Array(0), true);
    this.decodeImage();
    return this._png;
  }
  decodeApng() {
    checkSignature(this);
    while (!this._end) {
      const length = this.readUint32();
      const type = this.readChars(4);
      this.decodeApngChunk(length, type);
    }
    this.decodeApngImage();
    return this._apng;
  }
  // https://www.w3.org/TR/PNG/#5Chunk-layout
  decodeChunk(length, type) {
    const offset = this.offset;
    switch (type) {
      // 11.2 Critical chunks
      case "IHDR":
        this.decodeIHDR();
        break;
      case "PLTE":
        this.decodePLTE(length);
        break;
      case "IDAT":
        this.decodeIDAT(length);
        break;
      case "IEND":
        this._end = true;
        break;
      // 11.3 Ancillary chunks
      case "tRNS":
        this.decodetRNS(length);
        break;
      case "iCCP":
        this.decodeiCCP(length);
        break;
      case textChunkName:
        decodetEXt(this._png.text, this, length);
        break;
      case "pHYs":
        this.decodepHYs();
        break;
      default:
        this.skip(length);
        break;
    }
    if (this.offset - offset !== length) {
      throw new Error(`Length mismatch while decoding chunk ${type}`);
    }
    if (this._checkCrc) {
      checkCrc(this, length + 4, type);
    } else {
      this.skip(4);
    }
  }
  decodeApngChunk(length, type) {
    const offset = this.offset;
    if (type !== "fdAT" && type !== "IDAT" && this._writingDataChunks) {
      this.pushDataToFrame();
    }
    switch (type) {
      case "acTL":
        this.decodeACTL();
        break;
      case "fcTL":
        this.decodeFCTL();
        break;
      case "fdAT":
        this.decodeFDAT(length);
        break;
      default:
        this.decodeChunk(length, type);
        this.offset = offset + length;
        break;
    }
    if (this.offset - offset !== length) {
      throw new Error(`Length mismatch while decoding chunk ${type}`);
    }
    if (this._checkCrc) {
      checkCrc(this, length + 4, type);
    } else {
      this.skip(4);
    }
  }
  // https://www.w3.org/TR/PNG/#11IHDR
  decodeIHDR() {
    const image = this._png;
    image.width = this.readUint32();
    image.height = this.readUint32();
    image.depth = checkBitDepth(this.readUint8());
    const colorType = this.readUint8();
    this._colorType = colorType;
    let channels;
    switch (colorType) {
      case ColorType.GREYSCALE:
        channels = 1;
        break;
      case ColorType.TRUECOLOUR:
        channels = 3;
        break;
      case ColorType.INDEXED_COLOUR:
        channels = 1;
        break;
      case ColorType.GREYSCALE_ALPHA:
        channels = 2;
        break;
      case ColorType.TRUECOLOUR_ALPHA:
        channels = 4;
        break;
      // Kept for exhaustiveness.
      // eslint-disable-next-line unicorn/no-useless-switch-case
      case ColorType.UNKNOWN:
      default:
        throw new Error(`Unknown color type: ${colorType}`);
    }
    this._png.channels = channels;
    this._compressionMethod = this.readUint8();
    if (this._compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(`Unsupported compression method: ${this._compressionMethod}`);
    }
    this._filterMethod = this.readUint8();
    this._interlaceMethod = this.readUint8();
  }
  decodeACTL() {
    this._numberOfFrames = this.readUint32();
    this._numberOfPlays = this.readUint32();
    this._isAnimated = true;
  }
  decodeFCTL() {
    const image = {
      sequenceNumber: this.readUint32(),
      width: this.readUint32(),
      height: this.readUint32(),
      xOffset: this.readUint32(),
      yOffset: this.readUint32(),
      delayNumber: this.readUint16(),
      delayDenominator: this.readUint16(),
      disposeOp: this.readUint8(),
      blendOp: this.readUint8(),
      data: new Uint8Array(0)
    };
    this._frames.push(image);
  }
  // https://www.w3.org/TR/PNG/#11PLTE
  decodePLTE(length) {
    if (length % 3 !== 0) {
      throw new RangeError(`PLTE field length must be a multiple of 3. Got ${length}`);
    }
    const l = length / 3;
    this._hasPalette = true;
    const palette = [];
    this._palette = palette;
    for (let i2 = 0; i2 < l; i2++) {
      palette.push([this.readUint8(), this.readUint8(), this.readUint8()]);
    }
  }
  // https://www.w3.org/TR/PNG/#11IDAT
  decodeIDAT(length) {
    this._writingDataChunks = true;
    const dataLength = length;
    const dataOffset = this.offset + this.byteOffset;
    try {
      this._inflator.push(new Uint8Array(this.buffer, dataOffset, dataLength), false);
    } catch (error) {
      throw new Error("Error while decompressing the data:", { cause: error });
    }
    this.skip(length);
  }
  decodeFDAT(length) {
    this._writingDataChunks = true;
    let dataLength = length;
    let dataOffset = this.offset + this.byteOffset;
    dataOffset += 4;
    dataLength -= 4;
    try {
      this._inflator.push(new Uint8Array(this.buffer, dataOffset, dataLength), false);
    } catch (error) {
      throw new Error("Error while decompressing the data:", { cause: error });
    }
    this.skip(length);
  }
  // https://www.w3.org/TR/PNG/#11tRNS
  decodetRNS(length) {
    switch (this._colorType) {
      case ColorType.GREYSCALE:
      case ColorType.TRUECOLOUR: {
        if (length % 2 !== 0) {
          throw new RangeError(`tRNS chunk length must be a multiple of 2. Got ${length}`);
        }
        if (length / 2 > this._png.width * this._png.height) {
          throw new Error(`tRNS chunk contains more alpha values than there are pixels (${length / 2} vs ${this._png.width * this._png.height})`);
        }
        this._hasTransparency = true;
        this._transparency = new Uint16Array(length / 2);
        for (let i2 = 0; i2 < length / 2; i2++) {
          this._transparency[i2] = this.readUint16();
        }
        break;
      }
      case ColorType.INDEXED_COLOUR: {
        if (length > this._palette.length) {
          throw new Error(`tRNS chunk contains more alpha values than there are palette colors (${length} vs ${this._palette.length})`);
        }
        let i2 = 0;
        for (; i2 < length; i2++) {
          const alpha = this.readByte();
          this._palette[i2].push(alpha);
        }
        for (; i2 < this._palette.length; i2++) {
          this._palette[i2].push(255);
        }
        break;
      }
      // Kept for exhaustiveness.
      /* eslint-disable unicorn/no-useless-switch-case */
      case ColorType.UNKNOWN:
      case ColorType.GREYSCALE_ALPHA:
      case ColorType.TRUECOLOUR_ALPHA:
      default: {
        throw new Error(`tRNS chunk is not supported for color type ${this._colorType}`);
      }
    }
  }
  // https://www.w3.org/TR/PNG/#11iCCP
  decodeiCCP(length) {
    const name = readKeyword(this);
    const compressionMethod = this.readUint8();
    if (compressionMethod !== CompressionMethod.DEFLATE) {
      throw new Error(`Unsupported iCCP compression method: ${compressionMethod}`);
    }
    const compressedProfile = this.readBytes(length - name.length - 2);
    this._png.iccEmbeddedProfile = {
      name,
      profile: unzlibSync(compressedProfile)
    };
  }
  // https://www.w3.org/TR/PNG/#11pHYs
  decodepHYs() {
    const ppuX = this.readUint32();
    const ppuY = this.readUint32();
    const unitSpecifier = this.readByte();
    this._png.resolution = {
      x: ppuX,
      y: ppuY,
      unit: unitSpecifier
    };
  }
  decodeApngImage() {
    this._apng.width = this._png.width;
    this._apng.height = this._png.height;
    this._apng.channels = this._png.channels;
    this._apng.depth = this._png.depth;
    this._apng.numberOfFrames = this._numberOfFrames;
    this._apng.numberOfPlays = this._numberOfPlays;
    this._apng.text = this._png.text;
    this._apng.resolution = this._png.resolution;
    for (let i2 = 0; i2 < this._numberOfFrames; i2++) {
      const newFrame = {
        sequenceNumber: this._frames[i2].sequenceNumber,
        delayNumber: this._frames[i2].delayNumber,
        delayDenominator: this._frames[i2].delayDenominator,
        data: this._apng.depth === 8 ? new Uint8Array(this._apng.width * this._apng.height * this._apng.channels) : new Uint16Array(this._apng.width * this._apng.height * this._apng.channels)
      };
      const frame = this._frames.at(i2);
      if (frame) {
        frame.data = decodeInterlaceNull({
          data: frame.data,
          width: frame.width,
          height: frame.height,
          channels: this._apng.channels,
          depth: this._apng.depth
        });
        if (this._hasPalette) {
          this._apng.palette = this._palette;
        }
        if (this._hasTransparency) {
          this._apng.transparency = this._transparency;
        }
        if (i2 === 0 || frame.xOffset === 0 && frame.yOffset === 0 && frame.width === this._png.width && frame.height === this._png.height) {
          newFrame.data = frame.data;
        } else {
          const prevFrame = this._apng.frames.at(i2 - 1);
          this.disposeFrame(frame, prevFrame, newFrame);
          this.addFrameDataToCanvas(newFrame, frame);
        }
        this._apng.frames.push(newFrame);
      }
    }
    return this._apng;
  }
  disposeFrame(frame, prevFrame, imageFrame) {
    switch (frame.disposeOp) {
      case DisposeOpType.NONE:
        break;
      case DisposeOpType.BACKGROUND:
        for (let row = 0; row < this._png.height; row++) {
          for (let col = 0; col < this._png.width; col++) {
            const index = (row * frame.width + col) * this._png.channels;
            for (let channel = 0; channel < this._png.channels; channel++) {
              imageFrame.data[index + channel] = 0;
            }
          }
        }
        break;
      case DisposeOpType.PREVIOUS:
        imageFrame.data.set(prevFrame.data);
        break;
      default:
        throw new Error("Unknown disposeOp");
    }
  }
  addFrameDataToCanvas(imageFrame, frame) {
    const maxValue = 1 << this._png.depth;
    const calculatePixelIndices = (row, col) => {
      const index = ((row + frame.yOffset) * this._png.width + frame.xOffset + col) * this._png.channels;
      const frameIndex = (row * frame.width + col) * this._png.channels;
      return { index, frameIndex };
    };
    switch (frame.blendOp) {
      case BlendOpType.SOURCE:
        for (let row = 0; row < frame.height; row++) {
          for (let col = 0; col < frame.width; col++) {
            const { index, frameIndex } = calculatePixelIndices(row, col);
            for (let channel = 0; channel < this._png.channels; channel++) {
              imageFrame.data[index + channel] = frame.data[frameIndex + channel];
            }
          }
        }
        break;
      // https://www.w3.org/TR/png-3/#13Alpha-channel-processing
      case BlendOpType.OVER:
        for (let row = 0; row < frame.height; row++) {
          for (let col = 0; col < frame.width; col++) {
            const { index, frameIndex } = calculatePixelIndices(row, col);
            for (let channel = 0; channel < this._png.channels; channel++) {
              const sourceAlpha = frame.data[frameIndex + this._png.channels - 1] / maxValue;
              const foregroundValue = channel % (this._png.channels - 1) === 0 ? 1 : frame.data[frameIndex + channel];
              const value = Math.floor(sourceAlpha * foregroundValue + (1 - sourceAlpha) * imageFrame.data[index + channel]);
              imageFrame.data[index + channel] += value;
            }
          }
        }
        break;
      default:
        throw new Error("Unknown blendOp");
    }
  }
  decodeImage() {
    const data = this._inflatorResult;
    if (this._filterMethod !== FilterMethod.ADAPTIVE) {
      throw new Error(`Filter method ${this._filterMethod} not supported`);
    }
    if (this._interlaceMethod === InterlaceMethod.NO_INTERLACE) {
      this._png.data = decodeInterlaceNull({
        data,
        width: this._png.width,
        height: this._png.height,
        channels: this._png.channels,
        depth: this._png.depth
      });
    } else if (this._interlaceMethod === InterlaceMethod.ADAM7) {
      this._png.data = decodeInterlaceAdam7({
        data,
        width: this._png.width,
        height: this._png.height,
        channels: this._png.channels,
        depth: this._png.depth
      });
    } else {
      throw new Error(`Interlace method ${this._interlaceMethod} not supported`);
    }
    if (this._hasPalette) {
      this._png.palette = this._palette;
    }
    if (this._hasTransparency) {
      this._png.transparency = this._transparency;
    }
  }
  pushDataToFrame() {
    this._inflator.push(new Uint8Array(0), true);
    const result = this._inflatorResult;
    const lastFrame = this._frames.at(-1);
    if (lastFrame) {
      lastFrame.data = result;
    } else {
      this._frames.push({
        sequenceNumber: 0,
        width: this._png.width,
        height: this._png.height,
        xOffset: 0,
        yOffset: 0,
        delayNumber: 0,
        delayDenominator: 0,
        disposeOp: DisposeOpType.NONE,
        blendOp: BlendOpType.SOURCE,
        data: result
      });
    }
    this._inflator = new Unzlib((chunk, final) => {
      this._chunks.push(chunk);
      if (final) {
        const totalLength = this._chunks.reduce((sum, c) => sum + c.length, 0);
        this._inflatorResult = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk2 of this._chunks) {
          this._inflatorResult.set(chunk2, offset);
          offset += chunk2.length;
        }
        this._chunks = [];
      }
    });
    this._chunks = [];
    this._writingDataChunks = false;
  }
};
function checkBitDepth(value) {
  if (value !== 1 && value !== 2 && value !== 4 && value !== 8 && value !== 16) {
    throw new Error(`invalid bit depth: ${value}`);
  }
  return value;
}

// artifacts/bina04-quantization-20261026/sequence-16769/browser/node_modules/fast-png/lib/index.js
function decodePng(data, options) {
  const decoder = new PngDecoder(data, options);
  return decoder.decode();
}

// artifacts/bina04-koochik-18404-release-20261027/browser/preprocess.js
var f = Math.fround;
var clip = (x2) => Math.max(0, Math.min(255, x2));
function roundEven(x2) {
  const a = Math.floor(x2), r = x2 - a;
  return r === 0.5 ? a + a % 2 : Math.round(x2);
}
function coefficients(input, output, cubic = false, integer = false) {
  const scale = input / output, filterScale = Math.max(1, scale), support = filterScale * (cubic ? 2 : 1), result = [];
  for (let i2 = 0; i2 < output; i2++) {
    const center = (i2 + 0.5) * scale, start = Math.max(0, Math.trunc(center - support + 0.5)), end = Math.min(input, Math.trunc(center + support + 0.5));
    let weights = [], sum = 0;
    for (let j = start; j < end; j++) {
      const x2 = Math.abs((j - center + 0.5) / filterScale);
      const w = cubic ? x2 < 1 ? (1.5 * x2 - 2.5) * x2 * x2 + 1 : x2 < 2 ? ((-0.5 * x2 + 2.5) * x2 - 4) * x2 + 2 : 0 : Math.max(0, 1 - x2);
      weights.push(w);
      sum += w;
    }
    weights = weights.map((w) => integer ? Math.trunc(w / sum * 4194304 + (w < 0 ? -0.5 : 0.5)) : f(w / sum));
    result.push({ start, weights });
  }
  return result;
}
function resizeRGB(image, width, height, cubic = false) {
  if (width === image.width && height === image.height) return image;
  const xc = coefficients(image.width, width, cubic, true), yc = coefficients(image.height, height, cubic, true);
  let horizontal;
  if (width === image.width) horizontal = image.data;
  else {
    horizontal = new Uint8Array(width * image.height * 3);
    for (let y = 0; y < image.height; y++) for (let x2 = 0; x2 < width; x2++) for (let c = 0; c < 3; c++) {
      let sum = 2097152;
      const { start, weights } = xc[x2];
      for (let j = 0; j < weights.length; j++) sum += image.data[(y * image.width + start + j) * 3 + c] * weights[j];
      horizontal[(y * width + x2) * 3 + c] = clip(Math.floor(sum / 4194304));
    }
  }
  if (height === image.height) return { data: horizontal, width, height };
  const data = new Uint8Array(width * height * 3);
  for (let y = 0; y < height; y++) for (let x2 = 0; x2 < width; x2++) for (let c = 0; c < 3; c++) {
    let sum = 2097152;
    const { start, weights } = yc[y];
    for (let j = 0; j < weights.length; j++) sum += horizontal[((start + j) * width + x2) * 3 + c] * weights[j];
    data[(y * width + x2) * 3 + c] = clip(Math.floor(sum / 4194304));
  }
  return { data, width, height };
}
function primaryImage(image) {
  if (image.height >= 64) return image;
  const scale = Math.min(4, Math.max(2, 64 / image.height), 1664 / image.width);
  return scale > 1 ? resizeRGB(image, roundEven(image.width * scale), roundEven(image.height * scale), true) : image;
}
function processPixels(image, config2) {
  let width = image.width, height = image.height;
  const ratio = width / height;
  if (height > 2048) {
    height = 2048;
    width = Math.trunc(height * ratio);
  }
  if (width > 1664) {
    width = 1664;
    height = Math.trunc(width / ratio);
  }
  image = resizeRGB(image, width, height, false);
  const paddedHeight = Math.ceil(height / 16) * 16, paddedWidth = Math.ceil(width / 64) * 64, rows = paddedHeight / 16, cols = paddedWidth / 16, patches = new Float32Array(rows * cols * 768);
  const mean = config2.image_mean.map(f), std = config2.image_std.map(f);
  const lookup = Array.from({ length: 3 }, (_, c) => Float32Array.from({ length: 256 }, (_2, v) => config2.do_normalize ? f(f(f(v / 255) - mean[c]) / std[c]) : f(v / 255)));
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) for (let c = 0; c < 3; c++) for (let y = 0; y < 16; y++) for (let x2 = 0; x2 < 16; x2++) {
    const py = row * 16 + y, px = col * 16 + x2, value = py < height && px < width ? image.data[(py * width + px) * 3 + c] : 255;
    patches[((row * cols + col) * 3 + c) * 256 + y * 16 + x2] = lookup[c][value];
  }
  return { patches, imageSize: [paddedHeight, paddedWidth], contentSize: [height, width], rows, cols };
}
function interpolatedField(field2, rows, cols) {
  const channels = 1152, source = 128, out = new Float32Array(rows * cols * channels);
  if (Math.min(rows, cols) === 1) {
    for (let y = 0; y < rows; y++) for (let x2 = 0; x2 < cols; x2++) {
      const y0 = Math.floor(y * source / rows), y1 = Math.ceil((y + 1) * source / rows), x0 = Math.floor(x2 * source / cols), x1 = Math.ceil((x2 + 1) * source / cols), area = (y1 - y0) * (x1 - x0), offset = (y * cols + x2) * channels;
      for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) for (let c = 0; c < channels; c++) out[offset + c] = f(out[offset + c] + field2[(yy * source + xx) * channels + c]);
      for (let c = 0; c < channels; c++) out[offset + c] = f(out[offset + c] / area);
    }
    return out;
  }
  const xc = coefficients(source, cols), yc = coefficients(source, rows), horizontal = new Float32Array(source * cols * channels);
  for (let y = 0; y < source; y++) for (let x2 = 0; x2 < cols; x2++) {
    const { start, weights } = xc[x2], offset = (y * cols + x2) * channels;
    for (let j = 0; j < weights.length; j++) for (let c = 0; c < channels; c++) horizontal[offset + c] = f(horizontal[offset + c] + f(field2[(y * source + start + j) * channels + c] * weights[j]));
  }
  for (let y = 0; y < rows; y++) for (let x2 = 0; x2 < cols; x2++) {
    const { start, weights } = yc[y], offset = (y * cols + x2) * channels;
    for (let j = 0; j < weights.length; j++) for (let c = 0; c < channels; c++) out[offset + c] = f(out[offset + c] + f(horizontal[((start + j) * cols + x2) * channels + c] * weights[j]));
  }
  return out;
}
function positions(field2, contentSize, imageSize) {
  const [height, width] = contentSize, rows = imageSize[0] / 16, cols = imageSize[1] / 16, cr2 = Math.ceil(height / 16), cc = Math.ceil(width / 16), intermediate = interpolatedField(field2, cr2, cc), channels = 1152, out = new Float32Array(rows * cols * channels), bits2 = new Uint32Array(out.buffer);
  const axis = (i2, content, size) => {
    const start = i2 * 16, extent = Math.max(0, Math.min(16, content - start)), norm = f(Math.min(f(start + f(0.5 * extent)), content) / content), grid = f(f(2 * norm) - 1);
    return Math.max(0, Math.min(size - 1, f(f(f(grid + 1) * size) - 1) * 0.5));
  };
  for (let y = 0; y < rows; y++) for (let x2 = 0; x2 < cols; x2++) {
    const yy = axis(y, height, cr2), xx = axis(x2, width, cc), y0 = Math.floor(yy), x0 = Math.floor(xx), y1 = Math.min(cr2 - 1, y0 + 1), x1 = Math.min(cc - 1, x0 + 1), dy = f(yy - y0), dx = f(xx - x0), weights = [f(f(1 - dy) * f(1 - dx)), f(f(1 - dy) * dx), f(dy * f(1 - dx)), f(dy * dx)], indices = [y0 * cc + x0, y0 * cc + x1, y1 * cc + x0, y1 * cc + x1];
    const offset = (y * cols + x2) * channels;
    for (let c = 0; c < channels; c++) {
      let value = 0;
      for (let j = 0; j < 4; j++) value = f(value + f(intermediate[indices[j] * channels + c] * weights[j]));
      out[offset + c] = value;
      const raw = bits2[offset + c];
      bits2[offset + c] = raw + 32767 + (raw >>> 16 & 1) & 4294901760;
    }
  }
  return out;
}
function npyFloat32(buffer) {
  const data = new Uint8Array(buffer), view = new DataView(buffer), major = data[6], size = major === 1 ? view.getUint16(8, true) : view.getUint32(8, true), offset = (major === 1 ? 10 : 12) + size;
  return new Float32Array(buffer, offset);
}

// artifacts/bina04-koochik-18404-release-20261027/browser/resident/inference-worker-src.js
var ort = ort_webgpu_bundle_min_exports;
ort.env.wasm.wasmPaths = "/ort/";
ort.env.wasm.numThreads = crossOriginIsolated ? 2 : 1;
var base = "";
var guardEnabled = true;
var diagnostic = null;
var resource = (path) => base + path;
var send = (value) => postMessage({ ...value, requestId: activeRequestId });
var getJSON = async (path) => await (await fetch(resource(path))).json();
var tokenizer;
var config;
var field;
var prompts;
var generation;
var manifest;
var decoderBytes;
var device;
var gpuDispatches = 0;
var timing = { modelLoadMilliseconds: 0 };
async function setup(provider) {
  const began = performance.now();
  [config, prompts, generation, manifest] = await Promise.all(["/assets/preprocessor_config.json", "/assets/prompts.json", "/assets/generation_config.json", "/shared-models/manifest.json"].map(getJSON));
  tokenizer = new Tokenizer_default(await getJSON("/assets/tokenizer.json"), await getJSON("/assets/tokenizer_config.json"));
  field = npyFloat32(await (await fetch(resource("/assets/position-field.npy"))).arrayBuffer());
  if (provider === "webgpu" && !device) {
    const adapter = await navigator.gpu?.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) throw Error("No WebGPU adapter");
    const limits = { maxBufferSize: adapter.limits.maxBufferSize, maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize };
    device = await adapter.requestDevice({ requiredLimits: limits, requiredFeatures: adapter.features.has("shader-f16") ? ["shader-f16"] : [] });
    const create = device.createCommandEncoder.bind(device);
    device.createCommandEncoder = (...args) => {
      const encoder2 = create(...args), begin = encoder2.beginComputePass.bind(encoder2);
      encoder2.beginComputePass = (...options) => {
        const pass = begin(...options), dispatch = pass.dispatchWorkgroups.bind(pass);
        pass.dispatchWorkgroups = (...groups) => {
          gpuDispatches++;
          return dispatch(...groups);
        };
        return pass;
      };
      return encoder2;
    };
    ort.env.webgpu.device = device;
    device.addEventListener("uncapturederror", (event) => send({ kind: "gpu-error", message: String(event.error) }));
  }
  timing.assetLoadMilliseconds = performance.now() - began;
}
async function session(component, provider) {
  if (sessions.has(component)) {
    timing.sessionReuses++;
    return sessions.get(component);
  }
  const tick = performance.now(), model = manifest.models[component];
  let data;
  if (model.external.startsWith("decoder.")) {
    if (!decoderBytes) decoderBytes = new Uint8Array(await (await fetch(resource("/shared-models/" + model.external))).arrayBuffer());
    data = decoderBytes;
  } else data = resource("/shared-models/" + model.external);
  const options = { executionProviders: [provider], graphOptimizationLevel: "all", externalData: [{ path: model.external, data }] };
  if (provider === "webgpu" && ["prefill", "decode"].includes(component)) options.preferredOutputLocation = { logits: "cpu", keys: "gpu-buffer", values: "gpu-buffer" };
  const value = await ort.InferenceSession.create(resource("/shared-models/" + model.model), options);
  timing.modelLoadMilliseconds += performance.now() - tick;
  timing.sessionCreations++;
  totalSessionCreations++;
  const run = value.run.bind(value);
  value.run = async (...args) => {
    const outputs = await run(...args);
    for (const output of Object.values(outputs)) liveTensors.add(output);
    return outputs;
  };
  sessions.set(component, value);
  return value;
}
function imageRGB(buffer) {
  const decoded = decodePng(new Uint8Array(buffer));
  if (decoded.depth !== 8) throw Error("This browser prototype currently requires an eight-bit PNG");
  const { width, height, channels, data, palette } = decoded, rgb = new Uint8Array(width * height * 3);
  for (let i2 = 0; i2 < width * height; i2++) {
    if (palette) {
      const entry = palette[data[i2]];
      rgb.set(entry.slice(0, 3), i2 * 3);
    } else if (channels >= 3) {
      rgb[i2 * 3] = data[i2 * channels];
      rgb[i2 * 3 + 1] = data[i2 * channels + 1];
      rgb[i2 * 3 + 2] = data[i2 * channels + 2];
    } else rgb.fill(data[i2 * channels], i2 * 3, i2 * 3 + 3);
  }
  return { width, height, data: rgb };
}
function repetition(ids, text, eos) {
  ids = ids.filter((x2) => x2 !== eos);
  const counts = /* @__PURE__ */ new Map();
  let dominant = 0;
  for (let i2 = 0; i2 + 3 < ids.length; i2++) {
    const key = ids.slice(i2, i2 + 4).join(","), n = (counts.get(key) || 0) + 1;
    counts.set(key, n);
    dominant = Math.max(dominant, n);
  }
  let last = null, run = 0, longest = 0;
  for (const c of text) {
    run = c === last ? run + 1 : 1;
    last = c;
    if (!/\s/u.test(c)) longest = Math.max(longest, run);
  }
  return { flagged: ids.length >= 64 && dominant >= 12 && 4 * dominant / ids.length >= 0.35 || longest >= 32, dominant_token4gram_count: dominant, dominant_token4gram_fraction: Math.min(1, 4 * dominant / Math.max(1, ids.length)), longest_nonwhite_character_run: longest };
}
async function bridgePrefillCache(output) {
  for (const name of ["keys", "values"]) {
    const old = output[name], data = (await old.getData()).slice(), dims = old.dims;
    disposeTensor(old);
    output[name] = makeTensor("float32", data, dims);
  }
  return output;
}
async function cacheControl(provider) {
  if (provider !== "webgpu") return;
  const started = performance.now(), fixture = (await getJSON("/fixtures/manifest.json")).prefill, inputs = {};
  for (const [name, meta] of Object.entries(fixture.inputs)) {
    const bytes = await (await fetch(resource("/fixtures/" + meta.path))).arrayBuffer();
    inputs[name] = makeTensor(meta.dtype, meta.dtype === "int64" ? new BigInt64Array(bytes) : new Float32Array(bytes), meta.shape);
  }
  const prefill = await session("prefill", provider);
  let out = await bridgePrefillCache(await prefill.run(inputs));
  const decode2 = await session("decode", provider);
  for (let i2 = 0; i2 < 2; i2++) {
    disposeTensor(out.logits);
    const old = out;
    out = await decode2.run({ token_ids: makeTensor("int64", BigInt64Array.of(2n), [1, 1]), past_keys: old.keys, past_values: old.values });
    disposeTensor(old.keys);
    disposeTensor(old.values);
    const logits = await out.logits.getData();
    if (!logits.every(Number.isFinite)) throw Error("Non-finite cached-decode control");
  }
  for (const value of Object.values(out)) disposeTensor(value);
  for (const value of Object.values(inputs)) disposeTensor(value);
  timing.cacheControlMilliseconds = performance.now() - started;
  send({ kind: "progress", stage: "decoder cache control passed" });
}
async function attempt(image, prompt, provider, reason) {
  const began = performance.now(), pre = processPixels(image, config), pos = positions(field, pre.contentSize, pre.imageSize), count = pre.rows * pre.cols;
  send({ kind: "progress", stage: "vision", patches: count, renderedPixels: [image.width, image.height] });
  const vt2 = performance.now(), visionSession = await session("vision", provider), visionOut = await visionSession.run({ patches: makeTensor("float32", pre.patches, [count, 768]), positions: makeTensor("float32", pos, [1, count, 1152]) });
  const features = await visionOut.features.getData(), summary = (await visionOut.summary.getData()).slice(), grid = new Float32Array(features.length);
  for (let i2 = 0; i2 < count; i2++) for (let c = 0; c < 1152; c++) grid[c * count + i2] = features[i2 * 1152 + c];
  for (const value of Object.values(visionOut)) disposeTensor(value);
  const visionMilliseconds = performance.now() - vt2;
  send({ kind: "progress", stage: "neck", visionMilliseconds });
  const neck = await session("neck", provider), neckOut = await neck.run({ features: makeTensor("float32", grid, [1, 1152, pre.rows, pre.cols]), summary: makeTensor("float32", summary, [1, 2304]) });
  const contextData = (await neckOut.vision.getData()).slice(), context = makeTensor("float32", contextData, neckOut.vision.dims);
  disposeTensor(neckOut.vision);
  if (diagnostic?.contextOverride) {
    const raw = await (await fetch(diagnostic.contextOverride)).arrayBuffer(), override = npyFloat32(raw);
    if (override.length !== contextData.length) throw Error("Diagnostic context shape mismatch");
    contextData.set(override);
    send({ kind: "progress", stage: "using matched CUDA context (diagnostic)" });
  }
  send({ kind: "progress", stage: "prefill" });
  const prefix = prompts[prompt];
  if (!prefix) throw Error("Unknown source task prompt");
  const prefill = await session("prefill", provider);
  let output = await bridgePrefillCache(await prefill.run({ token_ids: makeTensor("int64", BigInt64Array.from(prefix, BigInt), [1, prefix.length]), vision: context }));
  disposeTensor(context);
  const decode2 = await session("decode", provider), ids = [], seen = new Set(prefix), eos = generation.eos_token_id, cap = 2048, checkPassage = repeatedPassageGuard();
  let stoppedByGuard = null;
  const traces = [];
  const decodeStarted = performance.now();
  send({ kind: "progress", stage: "decode", tokens: 0 });
  for (let i2 = 0; i2 < cap; i2++) {
    checkCancelled();
    const scores = await output.logits.getData();
    if (!scores.every(Number.isFinite)) throw Error("Non-finite decode logits");
    for (const id of seen) scores[id] = scores[id] < 0 ? scores[id] * 1.1 : scores[id] / 1.1;
    let token = 0;
    for (let j = 1; j < scores.length; j++) if (scores[j] > scores[token]) token = j;
    if (diagnostic && [0, 715, 716, 717, 779, 1030, 1411, 1541].includes(i2)) {
      const top = Array.from(scores, (score, id) => ({ id, score })).sort((a, b) => b.score - a.score).slice(0, 10);
      traces.push({ index: i2, token, top_ids: top.map((x2) => x2.id), top_scores: top.map((x2) => x2.score), eos_score: scores[eos], cache_shape: output.keys.dims });
      send({ kind: "progress", stage: "trace token " + i2 + " top " + token, tokens: i2 });
    }
    if (i2 === cap - 1) token = generation.forced_eos_token_id;
    ids.push(token);
    seen.add(token);
    disposeTensor(output.logits);
    if (token === eos) {
      disposeTensor(output.keys);
      disposeTensor(output.values);
      break;
    }
    if (guardEnabled && (stoppedByGuard = checkPassage(ids))) {
      disposeTensor(output.keys);
      disposeTensor(output.values);
      send({ kind: "progress", stage: "stopped: repeated passage", tokens: ids.length });
      break;
    }
    const previous = output;
    output = await decode2.run({ token_ids: makeTensor("int64", BigInt64Array.of(BigInt(token)), [1, 1]), past_keys: previous.keys, past_values: previous.values });
    disposeTensor(previous.keys);
    disposeTensor(previous.values);
    if ((i2 + 1) % 32 === 0) send({ kind: "progress", stage: "decode", tokens: i2 + 1, seconds: (performance.now() - decodeStarted) / 1e3, text: tokenizer.decode(ids, { skip_special_tokens: true }).trim() });
  }
  const plain = tokenizer.decode(ids, { skip_special_tokens: true }).trim();
  let body = tokenizer.decode(ids, { skip_special_tokens: false });
  if (body.endsWith("</s>")) body = body.slice(0, -4);
  const signal = repetition(ids, plain, eos);
  if (stoppedByGuard) signal.flagged = true;
  return { reason, rendered_pixels: [image.width, image.height], generated_token_ids: ids, generated_content: body, ocr_prediction: plain, tokens: ids.length, capped: ids.length >= cap, ended_with_eos: ids.at(-1) === eos, stopped_by_guard: stoppedByGuard, signal, diagnostic_traces: traces, timing: { visionMilliseconds, decodeMilliseconds: performance.now() - decodeStarted, totalMilliseconds: performance.now() - began } };
}
var sessions = /* @__PURE__ */ new Map();
var liveTensors = /* @__PURE__ */ new Set();
var activeRequestId = null;
var residentKey = null;
var totalSessionCreations = 0;
var requestCount = 0;
var cancelled = false;
var invalidDevice = null;
var queue = Promise.resolve();
function makeTensor(...args) {
  const value = new ort.Tensor(...args);
  liveTensors.add(value);
  return value;
}
function disposeTensor(value) {
  if (!value) return;
  liveTensors.delete(value);
  value.dispose();
}
function clearRequestTensors() {
  for (const value of Array.from(liveTensors)) {
    try {
      disposeTensor(value);
    } catch {
      liveTensors.delete(value);
    }
  }
}
function checkCancelled() {
  if (cancelled) throw new DOMException("Inference cancelled", "AbortError");
  if (invalidDevice) throw Error(invalidDevice);
}
async function disposeSessions() {
  clearRequestTensors();
  for (const value of sessions.values()) await value.release();
  sessions.clear();
  decoderBytes = null;
  residentKey = null;
}
async function initialize(provider) {
  const key = JSON.stringify([base, provider, "jsep-bf16weights"]);
  if (residentKey === key) {
    timing.residentReady = true;
    return;
  }
  if (residentKey !== null) throw Error("Use a new worker to change the model or provider");
  if (provider !== "webgpu") throw Error("This resident prototype requires WebGPU");
  ort = await import("/custom-runtime/ort.jsep-bina.mjs");
  ort.env.wasm.wasmPaths = "/ort/";
  ort.env.wasm.numThreads = 2;
  await setup(provider);
  device.lost.then((info) => {
    invalidDevice = "WebGPU device lost: " + info.message;
  });
  for (const component of ["vision", "neck", "prefill", "decode"]) {
    send({ kind: "progress", stage: "loading " + component });
    await session(component, provider);
  }
  await cacheControl(provider);
  clearRequestTensors();
  residentKey = key;
  timing.residentReady = true;
}
async function handle(message) {
  const started = performance.now();
  activeRequestId = message.requestId ?? null;
  cancelled = false;
  timing = { modelLoadMilliseconds: 0, assetLoadMilliseconds: 0, cacheControlMilliseconds: 0, sessionCreations: 0, sessionReuses: 0, residentReady: false };
  gpuDispatches = 0;
  if (message.type === "unload") {
    await disposeSessions();
    device?.destroy();
    send({ kind: "unloaded", liveSessions: sessions.size, liveTensors: liveTensors.size });
    self.close();
    return;
  }
  base = message.base || "/model";
  guardEnabled = message.repetitionGuard === true;
  diagnostic = message.diagnostic || null;
  try {
    const { image: buffer, provider = "webgpu", prompt = "</s><s><predict_text_in_pic>" } = message;
    await initialize(provider);
    checkCancelled();
    if (message.type === "initialize") {
      send({ kind: "ready", source_step: manifest.source_step, candidate_sha256: manifest.candidate_sha256, timing: { ...timing, totalMilliseconds: performance.now() - started }, resident: { sessions: sessions.size, totalSessionCreations, requestCount, liveTensors: liveTensors.size } });
      return;
    }
    const original = imageRGB(buffer), primary = primaryImage(original);
    const attempts = [await attempt(primary, prompt, provider, "primary")];
    let selected = 0;
    checkCancelled();
    if (!attempts[0].stopped_by_guard && (attempts[0].capped || attempts[0].signal.flagged)) {
      const scale = Math.min(4, 2048 / original.height, 1664 / original.width), width = roundEven(original.width * scale), height = roundEven(original.height * scale);
      if (scale > 1 && width * height > primary.width * primary.height) {
        attempts.push(await attempt(resizeRGB(original, width, height, true), prompt, provider, attempts[0].signal.flagged ? "output_only_repetition_resolution_retry" : "output_only_cap_resolution_retry"));
        const retry = attempts[1];
        if (retry.ocr_prediction && !retry.signal.flagged && retry.ended_with_eos && !retry.capped) selected = 1;
      }
    }
    clearRequestTensors();
    requestCount++;
    send({ kind: "result", result: { source_step: manifest.source_step, candidate_sha256: manifest.candidate_sha256, providerRequested: provider, actualBrowser: true, diagnostic, compute_precision: manifest.compute_precision || "FP32 with INT4 Linear weights", repetition_guard_enabled: guardEnabled, generation_policy: guardEnabled ? "diagnostic repeated-passage stop; stopped outputs incomplete and no upscale retry" : "canonical source V3 policy", imageSize: [original.width, original.height], prompt, selected: attempts[selected], selected_attempt: selected, attempts, unresolved_repetition: attempts[selected].signal.flagged, total_generated_tokens: attempts.reduce((n, x2) => n + x2.tokens, 0), gpuComputeDispatchesObserved: gpuDispatches, timing: { ...timing, totalMilliseconds: performance.now() - started }, resident: { sessions: sessions.size, totalSessionCreations, requestCount, liveTensors: liveTensors.size }, mainTrainingChanges: false, usedForTrainingOrCalibration: false } });
  } catch (error) {
    clearRequestTensors();
    send({ kind: error.name === "AbortError" ? "cancelled" : "error", error: String(error), stack: error.stack?.slice(0, 4e3), resident: { sessions: sessions.size, totalSessionCreations, liveTensors: liveTensors.size } });
  } finally {
    activeRequestId = null;
  }
}
onmessage = (event) => {
  const message = event.data;
  if (message.type === "cancel") {
    cancelled = true;
    return;
  }
  queue = queue.then(() => handle(message)).catch((error) => postMessage({ kind: "error", requestId: message.requestId, error: String(error) }));
};
/*! Bundled license information:

onnxruntime-web/dist/ort.webgpu.bundle.min.mjs:
  (*!
   * ONNX Runtime Web v1.31.1
   * Copyright (c) Microsoft Corporation. All rights reserved.
   * Licensed under the MIT License.
   *)
*/
