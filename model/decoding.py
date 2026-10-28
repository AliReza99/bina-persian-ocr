"""Declared zero-weight-change OCR runtime repair. No gold-dependent routing.

Keep native prompts, decoding and per-attempt cap. Preserve all attempts; never
trim an output to conceal looping. A remaining loop is an explicit failure.
"""
import collections, copy, hashlib, json
from PIL import Image
import torch

POLICY={
 'version':2,'primary':'if original height <32: bicubic scale min(4,64/h,1664/w), otherwise native pixels',
 'retry_trigger':'generated token count reaches max_new_tokens (including EOS at cap); or original repetition trigger: at least64 generated tokens; any token4gram count>=12 and 4*count/token_count>=0.35; or any nonwhite character run>=32',
 'retry_geometry':'one bicubic resize of ORIGINAL image by min(4,2048/h,1664/w), only if larger than current input',
 'selection':'take nonempty higher-resolution retry only when it has no detected repetition and ended with EOS before its cap; otherwise retain primary and flag unresolved',
 'gold_references_used':False,'benchmark_ids_used':False,'text_trimming':False,
 'prompts_and_decode_unchanged':True,'per_attempt_budget_unchanged':True,'maximum_attempts':2,
 'precision':'all parameters BF16, native inference without autocast'}

def resize_primary(image):
 if image.height<64:
  factor=min(4.,max(2.,64/image.height),1664/image.width)
  if factor>1:return image.resize((round(image.width*factor),round(image.height*factor)),Image.Resampling.BICUBIC)
 return image

def repetition_signal(token_ids,plain,eos_id):
 ids=[x for x in token_ids if x!=eos_id]
 counts=collections.Counter(tuple(ids[i:i+4]) for i in range(len(ids)-3))
 dominant=max(counts.values(),default=0)
 token_loop=len(ids)>=64 and dominant>=12 and 4*dominant/max(1,len(ids))>=.35
 longest=0;last=None;run=0
 for c in plain:
  run=run+1 if c==last else 1;last=c
  if not c.isspace():longest=max(longest,run)
 return {'flagged':token_loop or longest>=32,'dominant_token4gram_count':dominant,
  'dominant_token4gram_fraction':min(1.,4*dominant/max(1,len(ids))),
  'longest_nonwhite_character_run':longest}

def generate_repaired(model,proc,original,prompt,generation_config):
 """Return selected attempt and raw evidence. Caller applies native scoring."""
 assert not model.training
 assert model.device.type in ('cpu','cuda')
 image=resize_primary(original);attempts=[]
 def attempt(image,reason):
  inp=proc(images=[image],text=prompt,return_tensors='pt',add_special_tokens=False).to(model.device)
  with torch.inference_mode():out=model.generate(**inp,generation_config=copy.deepcopy(generation_config))
  ids=out[0,inp['input_ids'].shape[1]:].tolist()
  plain=proc.tokenizer.decode(ids,skip_special_tokens=True).strip()
  body=proc.tokenizer.decode(ids,skip_special_tokens=False)
  if body.endswith('</s>'):body=body[:-4]
  result={'reason':reason,'rendered_pixels':list(image.size),'generated_token_ids':ids,'generated_content':body,
   'ocr_prediction':plain,'tokens':len(ids),'capped':len(ids)>=generation_config.max_new_tokens,
   'ended_with_eos':bool(ids and ids[-1]==proc.tokenizer.eos_token_id),
   'signal':repetition_signal(ids,plain,proc.tokenizer.eos_token_id)}
  attempts.append(result);return result
 primary=attempt(image,'primary');selected=0
 if primary['signal']['flagged'] or primary['capped']:
  factor=min(4.,2048/original.height,1664/original.width)
  alternate=(round(original.width*factor),round(original.height*factor))
  if factor>1 and alternate[0]*alternate[1]>image.width*image.height:
   retry=attempt(original.resize(alternate,Image.Resampling.BICUBIC),'output_only_repetition_resolution_retry' if primary['signal']['flagged'] else 'output_only_cap_resolution_retry')
   if retry['ocr_prediction'].strip() and not retry['signal']['flagged'] and retry['ended_with_eos'] and not retry['capped']:selected=1
 return {'selected':attempts[selected],'selected_attempt':selected,'attempts':attempts,
  'unresolved_repetition':attempts[selected]['signal']['flagged'],
  'total_generated_tokens':sum(x['tokens'] for x in attempts),'optimizer_updates':0}
