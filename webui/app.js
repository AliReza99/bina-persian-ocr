import {estimateRegionProgress,inferencePercent} from './inference-progress.js';
import {ResidentBinaClient} from './progress-client.js';
const $=id=>document.getElementById(id);
const MODEL_SHA='8b702a444a2ff70d478f4bd06875f19ec7fed2b6084d16013f1cf41c4ac7e469';
const formatter=new Intl.NumberFormat('fa-IR',{maximumFractionDigits:1});
const fa=value=>formatter.format(value);
let client=null,modelReady=false,busy=false,cancelled=false,gpuAvailable=false;
let imageFile=null,previewURL=null,resultURL=null,lastReport=null,phase='idle',layoutWorker=null;
let downloadInfo=null,currentInferencePercent=0;
const stages={vision:'خواندن تصویر',neck:'آماده‌سازی تصویر',prefill:'آغاز خواندن متن',decode:'خواندن متن', 'loading vision':'دریافت بخش بینایی', 'loading neck':'دریافت بخش پردازش تصویر','loading prefill':'دریافت بخش آغاز متن','loading decode':'دریافت بخش تولید متن','decoder cache control passed':'مدل آماده است'};
function setStatus(title,detail=''){$('status').textContent=title;$('status-detail').textContent=detail;}
function downloadProgress(info){
  downloadInfo=info;$('download-row').hidden=false;
  $('download-progress').value=info.percent;
  $('download-progress').setAttribute('aria-valuetext',fa(info.percent)+'٪');
  $('download-percent').textContent=fa(info.percent)+'٪';
  $('download-bytes').textContent=info.totalBytes?`${fa(info.receivedBytes/1e6)} از ${fa(info.totalBytes/1e6)} مگابایت دریافت شد`:'در حال اتصال برای دریافت فایل‌های مدل…';
}
function inferenceProgress(value,caption){
  currentInferencePercent=Math.max(currentInferencePercent,value);
  $('inference-row').hidden=false;$('inference-progress').value=currentInferencePercent;
  $('inference-progress').setAttribute('aria-valuetext',fa(currentInferencePercent)+'٪، تخمینی');
  $('inference-percent').textContent=fa(currentInferencePercent)+'٪';
  $('inference-caption').textContent=caption;
}
function showError(message){$('error').textContent=message;$('error').hidden=false;}
function sync(){
  $('run').disabled=busy||!gpuAvailable;
  for(const id of ['file','demo'])$(id).disabled=busy;
  $('unload').disabled=busy||!modelReady;
  $('stop').hidden=!busy;$('stop').disabled=cancelled;
  for(const id of ['copy','save-text'])$(id).disabled=busy||!$('output').value.trim();
  $('output').readOnly=busy;
  $('dropzone').setAttribute('aria-disabled',String(busy));
}
function clearOutput(){
  currentInferencePercent=0;$('inference-row').hidden=true;
  $('output').value='';$('output').hidden=true;$('empty').hidden=false;
  $('result-meta').textContent='';$('quality-warning').hidden=true;
  $('download').hidden=true;lastReport=null;
  if(resultURL){URL.revokeObjectURL(resultURL);resultURL=null;}
}
function displayText(value){$('empty').hidden=true;$('output').hidden=false;$('output').value=value;}
function checkCancel(){if(cancelled)throw new DOMException('Stopped','AbortError');}
function closeModel(){client?.close();client=null;modelReady=false;}
async function operation(fn){
  if(busy)return;
  busy=true;cancelled=false;$('error').hidden=true;sync();
  try{await fn();}
  catch(error){
    if(cancelled||error.name==='AbortError'){
      setStatus('پردازش متوقف شد',modelReady?'مدل در حافظه آماده است؛ دوباره خواندن متن را بزنید.':'برای شروع دوباره خواندن متن را بزنید.');
      if(phase==='reading')$('result-meta').textContent='خروجی ناتمام؛ پردازش به درخواست شما متوقف شد.';
    }else{
      showError(error.userMessage||'اجرا کامل نشد. اتصال اینترنت، پشتیبانی WebGPU و حافظهٔ دستگاه را بررسی کنید؛ سپس دوباره تلاش کنید.');
      $('metrics').textContent=JSON.stringify({complete:false,source_step:18404,error:String(error),model_resident:modelReady},null,2);
      setStatus('اجرا کامل نشد',modelReady?'مدل هنوز در حافظه است.':'مدل آماده نیست؛ می‌توانید دوباره تلاش کنید.');
    }
  }finally{busy=false;phase='idle';sync();}
}
function userError(message){const e=Error(message);e.userMessage=message;return e;}
async function imageBytes(file){
  if(!file)return(await(await fetch('/examples/demo.png')).arrayBuffer());
  if(file.size>25*1024*1024)throw userError('حجم تصویر باید کمتر از ۲۵ مگابایت باشد.');
  if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw userError('لطفاً تصویر PNG، JPG یا WebP انتخاب کنید. PDF در این نسخه پشتیبانی نمی‌شود.');
  const bytes=await file.arrayBuffer();checkCancel();
  const view=new DataView(bytes);
  if(bytes.byteLength>=26&&view.getUint32(0)===0x89504e47&&view.getUint32(4)===0x0d0a1a0a){
    if(view.getUint32(16)*view.getUint32(20)>20000000)throw userError('تصویر باید حداکثر ۲۰ میلیون پیکسل داشته باشد.');
    if(view.getUint8(24)===8)return bytes;
  }
  let bitmap;
  try{bitmap=await createImageBitmap(file);}
  catch{throw userError('این تصویر خوانده نمی‌شود؛ یک فایل تصویری سالم انتخاب کنید.');}
  try{
    if(bitmap.width*bitmap.height>20000000)throw userError('تصویر باید حداکثر ۲۰ میلیون پیکسل داشته باشد.');
    const canvas=new OffscreenCanvas(bitmap.width,bitmap.height),ctx=canvas.getContext('2d',{alpha:false});
    ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0);
    return await(await canvas.convertToBlob({type:'image/png'})).arrayBuffer();
  }finally{bitmap.close();}
}
async function selectImage(file){
  await operation(async()=>{
    phase='preparing';await imageBytes(file);checkCancel();
    imageFile=file;if(previewURL)URL.revokeObjectURL(previewURL);
    previewURL=file?URL.createObjectURL(file):null;
    $('preview').src=previewURL||'/examples/demo.png';
    $('preview').alt=file?'پیش‌نمایش تصویر انتخاب‌شده':'پیش‌نمایش تصویر نمونه با متن فارسی و یک جمع ساده';
    $('chosen').textContent=file?file.name+' / '+fa(file.size/1024)+' کیلوبایت':'تصویر نمونه برای آزمایش آماده است.';
    clearOutput();setStatus(modelReady?'مدل آمادهٔ خواندن است':'تصویر آمادهٔ خواندن است',modelReady?'خواندن متن را بزنید؛ مدل دوباره بارگیری نمی‌شود.':'در نخستین اجرا مدل روی دستگاه شما بارگیری می‌شود.');
  });
}
async function ensureModel(){
  if(modelReady)return;
  downloadProgress({percent:0,receivedBytes:0,totalBytes:0});
  phase='loading';setStatus('در حال بارگیری مدل روی دستگاه شما…','دریافت حدود ۷۷۰ مگابایت؛ زمان بارگیری به اینترنت و دستگاه شما بستگی دارد.');
  client=new ResidentBinaClient(m=>{
    if(m.download){downloadProgress(m.download);return;}
    setStatus(stages[m.stage]||'آماده‌سازی مدل…',downloadInfo?.percent===100?'فایل‌ها دریافت شدند؛ در حال آماده‌سازی مدل برای اجرا…':'مدل فقط یک بار بارگیری می‌شود؛ این صفحه را باز نگه دارید.');
  });
  try{
    const ready=await client.initialize();checkCancel();
    if(ready.source_step!==18404||ready.candidate_sha256!==MODEL_SHA||ready.resident.sessions!==4||ready.resident.totalSessionCreations!==4)throw Error('Unexpected checkpoint or runtime lifecycle');
    if(ready.download)downloadProgress(ready.download);
    modelReady=true;$('metrics').textContent=JSON.stringify(ready,null,2);
  }catch(error){closeModel();throw error;}
}
async function planImage(bytes){
  return new Promise((resolve,reject)=>{
    layoutWorker=new Worker('/layout-worker.js',{type:'module'});
    layoutWorker.onmessage=({data})=>{layoutWorker.terminate();layoutWorker=null;data.ok?resolve(data.plan):reject(Error(data.error));};
    layoutWorker.onerror=e=>{layoutWorker.terminate();layoutWorker=null;reject(Error(e.message));};
    layoutWorker.postMessage(bytes,[bytes]);
  });
}
function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('file').onchange=()=>{const file=$('file').files[0];if(file)void selectImage(file);};
$('demo').onclick=()=>{if(!busy){$('file').value='';void selectImage(null);}};
for(const type of ['dragenter','dragover'])$('dropzone').addEventListener(type,event=>{event.preventDefault();if(!busy)$('dropzone').classList.add('is-dragging');});
for(const type of ['dragleave','drop'])$('dropzone').addEventListener(type,event=>{event.preventDefault();$('dropzone').classList.remove('is-dragging');if(type==='drop'&&!busy&&event.dataTransfer.files[0])void selectImage(event.dataTransfer.files[0]);});
$('stop').onclick=()=>{
  cancelled=true;
  if(phase==='loading'){closeModel();}else client?.cancel();
  setStatus('در حال توقف…',modelReady?'مدل بارگیری‌شده در حافظه می‌ماند.':'بارگیری متوقف می‌شود.');sync();
};
$('unload').onclick=()=>operation(async()=>{
  const old=client;client=null;modelReady=false;
  try{$('metrics').textContent=JSON.stringify(await old.unload(),null,2);}finally{old.close();}
  downloadInfo=null;$('download-row').hidden=true;$('inference-row').hidden=true;
  setStatus('حافظهٔ مدل آزاد شد','برای تصویر بعدی مدل دوباره بارگیری می‌شود.');
});
$('run').onclick=()=>operation(async()=>{
  clearOutput();phase='preparing';setStatus('آماده‌سازی تصویر…','تصویر از دستگاه شما بیرون نمی‌رود.');
  const bytes=await imageBytes(imageFile);checkCancel();
  await ensureModel();checkCancel();phase='reading';
  inferenceProgress(0,'آماده‌سازی ناحیه‌های تصویر…');
  const plan=await planImage(bytes);checkCancel();const records=[],started=performance.now();
  const totalPixels=plan.regions.reduce((n,r)=>n+r.pixels,0);let completedPixels=0;
  for(const region of plan.regions){
    checkCancel();
    let withinRegion=0;
    client.onProgress=m=>{
      if(m.download){downloadProgress(m.download);return;}
      withinRegion=estimateRegionProgress(m.stage,m.tokens??0,region.pixels,withinRegion);
      inferenceProgress(inferencePercent(completedPixels,region.pixels,withinRegion,totalPixels),`ناحیهٔ ${fa(region.index+1)} از ${fa(plan.regions.length)}؛ درصد پردازش تخمینی است.`);
      setStatus(`ناحیهٔ ${fa(region.index+1)} از ${fa(plan.regions.length)}: ${stages[m.stage]||'خواندن متن'}`,m.tokens!==undefined?`${fa(m.tokens)} توکن خوانده شد؛ پردازش روی دستگاه شما انجام می‌شود.`:'مدل آماده است و دوباره بارگیری نمی‌شود.');
      if(m.text!==undefined)displayText([...records.map(r=>r.result.selected.ocr_prediction),m.text].filter(Boolean).join('\n'));
    };
    const input=region.png.buffer.slice(region.png.byteOffset,region.png.byteOffset+region.png.byteLength);
    let result;
    try{result=await client.transcribe(input,'</s><s><predict_text_in_pic>');}
    catch(error){if(error.name!=='AbortError')closeModel();throw error;}
    checkCancel();
    if(result.source_step!==18404||result.candidate_sha256!==MODEL_SHA||result.resident.sessions!==4||result.resident.totalSessionCreations!==4||result.resident.liveTensors!==0||result.timing.sessionCreations!==0){closeModel();throw Error('Checkpoint or resident-session lifecycle invariant failed');}
    records.push({region:{index:region.index,bbox:region.bbox,pixels:region.pixels},result});
    completedPixels+=region.pixels;
    inferenceProgress(inferencePercent(completedPixels,0,0,totalPixels),`${fa(records.length)} از ${fa(plan.regions.length)} ناحیه پایان یافت.`);
    displayText(records.map(r=>r.result.selected.ocr_prediction).filter(Boolean).join('\n'));
  }
  inferenceProgress(inferencePercent(completedPixels,0,0,totalPixels,{complete:true}),'پردازش همهٔ ناحیه‌ها پایان یافت.');
  const seconds=(performance.now()-started)/1000;
  lastReport={source_step:18404,candidate_sha256:MODEL_SHA,complete:true,provider:'webgpu',layout_plan:{...plan,regions:records.map(r=>r.region)},ocr_prediction:$('output').value,records,seconds,input_parity_measured:false,repetition_guard_enabled:false,main_training_changes:false,images_uploaded:false,download_progress:downloadInfo,inference_progress:{percent:100,estimated_during_generation:true,reached_100_only_after_all_regions_completed:true},GPU_dispatch_observer:{reliable_for_this_run:false,note:'Legacy per-device dispatch counter may report zero because the runtime uses its own GPU device; it is not a completion or parity gate. The unchanged WebGPU engine has separate component GPU qualification.'}};
  $('metrics').textContent=JSON.stringify(lastReport,null,2);
  if(resultURL)URL.revokeObjectURL(resultURL);
  resultURL=URL.createObjectURL(new Blob([JSON.stringify(lastReport,null,2)],{type:'application/json'}));
  $('download').href=resultURL;$('download').download='bina18404-result.json';$('download').hidden=false;
  const caps=records.filter(r=>r.result.selected.capped).length,repeats=records.filter(r=>r.result.selected.signal.flagged).length;
  $('quality-warning').hidden=!(caps||repeats);
  const tokens=records.reduce((n,r)=>n+r.result.selected.tokens,0);
  $('result-meta').textContent=`${fa(plan.regions.length)} ناحیه / ${fa(tokens)} توکن / ${fa(seconds)} ثانیه پردازش`;
  setStatus(caps||repeats?'خواندن پایان یافت؛ خروجی نیاز به بررسی دارد':'خواندن متن پایان یافت','مدل در حافظه آماده است؛ تصویر بعدی را انتخاب کنید.');
});
$('output').oninput=()=>{if(lastReport)$('result-meta').textContent='متن ویرایش شده است؛ گزارش کامل، خروجی اصلی مدل را نگه می‌دارد.';sync();};
$('copy').onclick=async()=>{
  try{await navigator.clipboard.writeText($('output').value);$('copy').textContent='کپی شد';setTimeout(()=>$('copy').textContent='کپی متن',1800);}
  catch{showError('کپی خودکار در این مرورگر مجاز نیست؛ متن را انتخاب و کپی کنید.');}
};
$('save-text').onclick=()=>saveBlob(new Blob(['\ufeff'+$('output').value],{type:'text/plain;charset=utf-8'}),'bina-transcription.txt');
async function checkSupport(){
  const standalone=location.origin+'/';$('standalone-link').href=standalone;
  if(window.top!==window.self&&!crossOriginIsolated)$('standalone').hidden=false;
  try{
    if(!window.isSecureContext||!navigator.gpu)throw Error('WebGPU not available');
    const adapter=await navigator.gpu.requestAdapter({powerPreference:'high-performance'});
    if(!adapter)throw Error('No WebGPU adapter');
    gpuAvailable=true;$('gpu-state').textContent='WebGPU '+(crossOriginIsolated?'/ isolated':'');
    setStatus('مرورگر آمادهٔ اجرای مدل است','خواندن متن را بزنید؛ مدل در نخستین اجرا بارگیری می‌شود.');
  }catch{
    $('gpu-state').textContent='WebGPU unavailable';setStatus('این مرورگر WebGPU در دسترس ندارد','Chrome یا Edge به‌روز را روی رایانه امتحان کنید.');
    showError('اجرای محلی به WebGPU نیاز دارد. مرورگر را به‌روز کنید یا نسخهٔ مستقل را باز کنید.');$('standalone').hidden=false;
  }
  sync();
}
window.addEventListener('pagehide',()=>{layoutWorker?.terminate();closeModel();});
void checkSupport();sync();
