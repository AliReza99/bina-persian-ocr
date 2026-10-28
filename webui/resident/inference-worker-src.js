import * as nativeOrt from 'onnxruntime-web/webgpu';
let ort=nativeOrt;
import {repeatedPassageGuard} from '../repetition-guard.js';
import {Tokenizer} from '@huggingface/tokenizers';
import {decode as decodePNG} from 'fast-png';
import {npyFloat32,primaryImage,processPixels,positions,resizeRGB,roundEven} from '../preprocess.js';

ort.env.wasm.wasmPaths='/ort/';ort.env.wasm.numThreads=crossOriginIsolated?2:1;
let base='',guardEnabled=true,diagnostic=null;const resource=path=>base+path;
const send=value=>postMessage({...value,requestId:activeRequestId}),getJSON=async path=>await(await fetch(resource(path))).json();
let tokenizer,config,field,prompts,generation,manifest,decoderBytes,device,gpuDispatches=0;
let timing={modelLoadMilliseconds:0};
async function setup(provider){
 const began=performance.now();
 [config,prompts,generation,manifest]=await Promise.all(['/assets/preprocessor_config.json','/assets/prompts.json','/assets/generation_config.json','/shared-models/manifest.json'].map(getJSON));
 tokenizer=new Tokenizer(await getJSON('/assets/tokenizer.json'),await getJSON('/assets/tokenizer_config.json'));field=npyFloat32(await(await fetch(resource('/assets/position-field.npy'))).arrayBuffer());
 if(provider==='webgpu'&&!device){
  const adapter=await navigator.gpu?.requestAdapter({powerPreference:'high-performance'});if(!adapter)throw Error('No WebGPU adapter');
  const limits={maxBufferSize:adapter.limits.maxBufferSize,maxStorageBufferBindingSize:adapter.limits.maxStorageBufferBindingSize};device=await adapter.requestDevice({requiredLimits:limits,requiredFeatures:adapter.features.has('shader-f16')?['shader-f16']:[]});
  const create=device.createCommandEncoder.bind(device);device.createCommandEncoder=(...args)=>{const encoder=create(...args),begin=encoder.beginComputePass.bind(encoder);encoder.beginComputePass=(...options)=>{const pass=begin(...options),dispatch=pass.dispatchWorkgroups.bind(pass);pass.dispatchWorkgroups=(...groups)=>{gpuDispatches++;return dispatch(...groups);};return pass;};return encoder;};ort.env.webgpu.device=device;
  device.addEventListener('uncapturederror',event=>send({kind:'gpu-error',message:String(event.error)}));
 }
 timing.assetLoadMilliseconds=performance.now()-began;
}
async function session(component,provider){
 if(sessions.has(component)){timing.sessionReuses++;return sessions.get(component);}
 const tick=performance.now(),model=manifest.models[component];let data;
 if(model.external.startsWith('decoder.')){if(!decoderBytes)decoderBytes=new Uint8Array(await(await fetch(resource('/shared-models/'+model.external))).arrayBuffer());data=decoderBytes;}else data=resource('/shared-models/'+model.external);
 const options={executionProviders:[provider],graphOptimizationLevel:'all',externalData:[{path:model.external,data}]};
 if(provider==='webgpu'&&['prefill','decode'].includes(component))options.preferredOutputLocation={logits:'cpu',keys:'gpu-buffer',values:'gpu-buffer'};
 const value=await ort.InferenceSession.create(resource('/shared-models/'+model.model),options);timing.modelLoadMilliseconds+=performance.now()-tick;timing.sessionCreations++;totalSessionCreations++;
 const run=value.run.bind(value);value.run=async(...args)=>{const outputs=await run(...args);for(const output of Object.values(outputs))liveTensors.add(output);return outputs;};sessions.set(component,value);return value;
}
function imageRGB(buffer){
 const decoded=decodePNG(new Uint8Array(buffer));if(decoded.depth!==8)throw Error('This browser prototype currently requires an eight-bit PNG');
 const {width,height,channels,data,palette}=decoded,rgb=new Uint8Array(width*height*3);
 for(let i=0;i<width*height;i++){
  if(palette){const entry=palette[data[i]];rgb.set(entry.slice(0,3),i*3);}
  else if(channels>=3){rgb[i*3]=data[i*channels];rgb[i*3+1]=data[i*channels+1];rgb[i*3+2]=data[i*channels+2];}
  else rgb.fill(data[i*channels],i*3,i*3+3);
 }
 return {width,height,data:rgb};
}
function repetition(ids,text,eos){
 ids=ids.filter(x=>x!==eos);const counts=new Map();let dominant=0;
 for(let i=0;i+3<ids.length;i++){const key=ids.slice(i,i+4).join(','),n=(counts.get(key)||0)+1;counts.set(key,n);dominant=Math.max(dominant,n);}
 let last=null,run=0,longest=0;for(const c of text){run=c===last?run+1:1;last=c;if(!/\s/u.test(c))longest=Math.max(longest,run);}
 return {flagged:(ids.length>=64&&dominant>=12&&4*dominant/ids.length>=.35)||longest>=32,dominant_token4gram_count:dominant,dominant_token4gram_fraction:Math.min(1,4*dominant/Math.max(1,ids.length)),longest_nonwhite_character_run:longest};
}
async function bridgePrefillCache(output){
 for(const name of ['keys','values']){const old=output[name],data=(await old.getData()).slice(),dims=old.dims;disposeTensor(old);output[name]=makeTensor('float32',data,dims);}
 return output;
}
async function cacheControl(provider){
 if(provider!=='webgpu')return;
 const started=performance.now(),fixture=(await getJSON('/fixtures/manifest.json')).prefill,inputs={};
 for(const [name,meta] of Object.entries(fixture.inputs)){const bytes=await(await fetch(resource('/fixtures/'+meta.path))).arrayBuffer();inputs[name]=makeTensor(meta.dtype,meta.dtype==='int64'?new BigInt64Array(bytes):new Float32Array(bytes),meta.shape);}
 const prefill=await session('prefill',provider);let out=await bridgePrefillCache(await prefill.run(inputs));const decode=await session('decode',provider);
 for(let i=0;i<2;i++){disposeTensor(out.logits);const old=out;out=await decode.run({token_ids:makeTensor('int64',BigInt64Array.of(2n),[1,1]),past_keys:old.keys,past_values:old.values});disposeTensor(old.keys);disposeTensor(old.values);const logits=await out.logits.getData();if(!logits.every(Number.isFinite))throw Error('Non-finite cached-decode control');}
 for(const value of Object.values(out))disposeTensor(value);for(const value of Object.values(inputs))disposeTensor(value);timing.cacheControlMilliseconds=performance.now()-started;send({kind:'progress',stage:'decoder cache control passed'});
}
async function attempt(image,prompt,provider,reason){
 const began=performance.now(),pre=processPixels(image,config),pos=positions(field,pre.contentSize,pre.imageSize),count=pre.rows*pre.cols;
 send({kind:'progress',stage:'vision',patches:count,renderedPixels:[image.width,image.height]});
 const vt=performance.now(),visionSession=await session('vision',provider),visionOut=await visionSession.run({patches:makeTensor('float32',pre.patches,[count,768]),positions:makeTensor('float32',pos,[1,count,1152])});
 const features=await visionOut.features.getData(),summary=(await visionOut.summary.getData()).slice(),grid=new Float32Array(features.length);
 for(let i=0;i<count;i++)for(let c=0;c<1152;c++)grid[c*count+i]=features[i*1152+c];for(const value of Object.values(visionOut))disposeTensor(value);
 const visionMilliseconds=performance.now()-vt;send({kind:'progress',stage:'neck',visionMilliseconds});
 const neck=await session('neck',provider),neckOut=await neck.run({features:makeTensor('float32',grid,[1,1152,pre.rows,pre.cols]),summary:makeTensor('float32',summary,[1,2304])});const contextData=(await neckOut.vision.getData()).slice(),context=makeTensor('float32',contextData,neckOut.vision.dims);disposeTensor(neckOut.vision);
 if(diagnostic?.contextOverride){const raw=await(await fetch(diagnostic.contextOverride)).arrayBuffer(),override=npyFloat32(raw);if(override.length!==contextData.length)throw Error('Diagnostic context shape mismatch');contextData.set(override);send({kind:'progress',stage:'using matched CUDA context (diagnostic)'});}
 send({kind:'progress',stage:'prefill'});const prefix=prompts[prompt];if(!prefix)throw Error('Unknown source task prompt');const prefill=await session('prefill',provider);let output=await bridgePrefillCache(await prefill.run({token_ids:makeTensor('int64',BigInt64Array.from(prefix,BigInt),[1,prefix.length]),vision:context}));disposeTensor(context);
 const decode=await session('decode',provider),ids=[],seen=new Set(prefix),eos=generation.eos_token_id,cap=2048,checkPassage=repeatedPassageGuard();let stoppedByGuard=null;const traces=[];const decodeStarted=performance.now();send({kind:'progress',stage:'decode',tokens:0});
 for(let i=0;i<cap;i++){
  checkCancelled();
  const scores=await output.logits.getData();if(!scores.every(Number.isFinite))throw Error('Non-finite decode logits');for(const id of seen)scores[id]=scores[id]<0?scores[id]*1.1:scores[id]/1.1;let token=0;for(let j=1;j<scores.length;j++)if(scores[j]>scores[token])token=j;
  if(diagnostic&&[0,715,716,717,779,1030,1411,1541].includes(i)){const top=Array.from(scores,(score,id)=>({id,score})).sort((a,b)=>b.score-a.score).slice(0,10);traces.push({index:i,token,top_ids:top.map(x=>x.id),top_scores:top.map(x=>x.score),eos_score:scores[eos],cache_shape:output.keys.dims});send({kind:'progress',stage:'trace token '+i+' top '+token,tokens:i});}
  if(i===cap-1)token=generation.forced_eos_token_id;ids.push(token);seen.add(token);disposeTensor(output.logits);
  if(token===eos){disposeTensor(output.keys);disposeTensor(output.values);break;}
  if(guardEnabled&&(stoppedByGuard=checkPassage(ids))){disposeTensor(output.keys);disposeTensor(output.values);send({kind:'progress',stage:'stopped: repeated passage',tokens:ids.length});break;}
  const previous=output;output=await decode.run({token_ids:makeTensor('int64',BigInt64Array.of(BigInt(token)),[1,1]),past_keys:previous.keys,past_values:previous.values});disposeTensor(previous.keys);disposeTensor(previous.values);
  if((i+1)%32===0)send({kind:'progress',stage:'decode',tokens:i+1,seconds:(performance.now()-decodeStarted)/1000,text:tokenizer.decode(ids,{skip_special_tokens:true}).trim()});
 }
 const plain=tokenizer.decode(ids,{skip_special_tokens:true}).trim();let body=tokenizer.decode(ids,{skip_special_tokens:false});if(body.endsWith('</s>'))body=body.slice(0,-4);
 const signal=repetition(ids,plain,eos);if(stoppedByGuard)signal.flagged=true;
 return {reason,rendered_pixels:[image.width,image.height],generated_token_ids:ids,generated_content:body,ocr_prediction:plain,tokens:ids.length,capped:ids.length>=cap,ended_with_eos:ids.at(-1)===eos,stopped_by_guard:stoppedByGuard,signal,diagnostic_traces:traces,timing:{visionMilliseconds,decodeMilliseconds:performance.now()-decodeStarted,totalMilliseconds:performance.now()-began}};
}

const sessions=new Map(),liveTensors=new Set();let activeRequestId=null,residentKey=null,totalSessionCreations=0,requestCount=0,cancelled=false,invalidDevice=null,queue=Promise.resolve();
function makeTensor(...args){const value=new ort.Tensor(...args);liveTensors.add(value);return value;}
function disposeTensor(value){if(!value)return;liveTensors.delete(value);value.dispose();}
function clearRequestTensors(){for(const value of Array.from(liveTensors)){try{disposeTensor(value);}catch{liveTensors.delete(value);}}}
function checkCancelled(){if(cancelled)throw new DOMException('Inference cancelled','AbortError');if(invalidDevice)throw Error(invalidDevice);}
async function disposeSessions(){clearRequestTensors();for(const value of sessions.values())await value.release();sessions.clear();decoderBytes=null;residentKey=null;}
async function initialize(provider){
 const key=JSON.stringify([base,provider,'jsep-bf16weights']);
 if(residentKey===key){timing.residentReady=true;return;}
 if(residentKey!==null)throw Error('Use a new worker to change the model or provider');
 if(provider!=='webgpu')throw Error('This resident prototype requires WebGPU');
 ort=await import('/custom-runtime/ort.jsep-bina.mjs');ort.env.wasm.wasmPaths='/ort/';ort.env.wasm.numThreads=2;
 await setup(provider);device.lost.then(info=>{invalidDevice='WebGPU device lost: '+info.message;});
 for(const component of ['vision','neck','prefill','decode']){send({kind:'progress',stage:'loading '+component});await session(component,provider);}
 await cacheControl(provider);clearRequestTensors();residentKey=key;timing.residentReady=true;
}

async function handle(message){
 const started=performance.now();activeRequestId=message.requestId??null;cancelled=false;
 timing={modelLoadMilliseconds:0,assetLoadMilliseconds:0,cacheControlMilliseconds:0,sessionCreations:0,sessionReuses:0,residentReady:false};gpuDispatches=0;
 if(message.type==='unload'){
  await disposeSessions();device?.destroy();send({kind:'unloaded',liveSessions:sessions.size,liveTensors:liveTensors.size});self.close();return;
 }
 base=message.base||'/model';guardEnabled=message.repetitionGuard===true;diagnostic=message.diagnostic||null;
 try{
  const {image:buffer,provider='webgpu',prompt='</s><s><predict_text_in_pic>'}=message;
  await initialize(provider);checkCancelled();
  if(message.type==='initialize'){send({kind:'ready',source_step:manifest.source_step,candidate_sha256:manifest.candidate_sha256,timing:{...timing,totalMilliseconds:performance.now()-started},resident:{sessions:sessions.size,totalSessionCreations,requestCount,liveTensors:liveTensors.size}});return;}
  const original=imageRGB(buffer),primary=primaryImage(original);const attempts=[await attempt(primary,prompt,provider,'primary')];let selected=0;
  checkCancelled();
  if(!attempts[0].stopped_by_guard&&(attempts[0].capped||attempts[0].signal.flagged)){
   const scale=Math.min(4,2048/original.height,1664/original.width),width=roundEven(original.width*scale),height=roundEven(original.height*scale);
   if(scale>1&&width*height>primary.width*primary.height){attempts.push(await attempt(resizeRGB(original,width,height,true),prompt,provider,attempts[0].signal.flagged?'output_only_repetition_resolution_retry':'output_only_cap_resolution_retry'));const retry=attempts[1];if(retry.ocr_prediction&&!retry.signal.flagged&&retry.ended_with_eos&&!retry.capped)selected=1;}
  }
  clearRequestTensors();requestCount++;
  send({kind:'result',result:{source_step:manifest.source_step,candidate_sha256:manifest.candidate_sha256,providerRequested:provider,actualBrowser:true,diagnostic,compute_precision:manifest.compute_precision||'FP32 with INT4 Linear weights',repetition_guard_enabled:guardEnabled,generation_policy:guardEnabled?'diagnostic repeated-passage stop; stopped outputs incomplete and no upscale retry':'canonical source V3 policy',imageSize:[original.width,original.height],prompt,selected:attempts[selected],selected_attempt:selected,attempts,unresolved_repetition:attempts[selected].signal.flagged,total_generated_tokens:attempts.reduce((n,x)=>n+x.tokens,0),gpuComputeDispatchesObserved:gpuDispatches,timing:{...timing,totalMilliseconds:performance.now()-started},resident:{sessions:sessions.size,totalSessionCreations,requestCount,liveTensors:liveTensors.size},mainTrainingChanges:false,usedForTrainingOrCalibration:false}});
 }catch(error){clearRequestTensors();send({kind:error.name==='AbortError'?'cancelled':'error',error:String(error),stack:error.stack?.slice(0,4000),resident:{sessions:sessions.size,totalSessionCreations,liveTensors:liveTensors.size}});}
 finally{activeRequestId=null;}
}
onmessage=event=>{
 const message=event.data;
 if(message.type==='cancel'){cancelled=true;return;}
 queue=queue.then(()=>handle(message)).catch(error=>postMessage({kind:'error',requestId:message.requestId,error:String(error)}));
};
