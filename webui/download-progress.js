/** Observe response copies; always give the runtime its original native response. */
export function createDownloadMonitor(nativeFetch,manifest,onProgress,{baseURL=globalThis.location?.href||'https://example.test/',clock=()=>performance.now(),interval=100}={}) {
  const origin=new URL(baseURL).origin;
  const files=new Map(manifest.files.map(f=>[f.path,{bytes:f.bytes,received:0,complete:false}]));
  const totalBytes=[...files.values()].reduce((n,f)=>n+f.bytes,0),pending=new Set(),failures=[];
  let receivedBytes=0,lastEmission=-Infinity;
  const snapshot=()=>({receivedBytes,totalBytes,percent:totalBytes?Math.min(100,Math.floor(100*receivedBytes/totalBytes)):0,completedFiles:[...files.values()].filter(f=>f.complete).length,totalFiles:files.size,scope:manifest.scope,...(failures.length?{failures:[...failures]}:{})});
  function emit(force=false){
    const now=clock();if(!force&&now-lastEmission<interval)return;
    lastEmission=now;try{onProgress(snapshot());}catch{}
  }
  async function observe(response,file,path){
    let read=0,reader;
    try{
      reader=response.body.getReader();
      while(true){
        const {done,value}=await reader.read();if(done)break;
        read+=value.byteLength;const unique=Math.min(file.bytes,read);
        if(unique>file.received){receivedBytes+=unique-file.received;file.received=unique;}
        emit();
      }
      file.complete=file.complete||read>=file.bytes;
    }catch(error){failures.push({path,error:String(error)});}
    finally{reader?.releaseLock();emit(true);}
  }
  async function trackedFetch(input,options){
    const url=new URL(input instanceof Request?input.url:input,baseURL);
    const file=url.origin===origin?files.get(url.pathname):undefined;
    const response=await nativeFetch(input,options);
    if(file&&response.ok&&response.body){
      try{
        emit();const task=observe(response.clone(),file,url.pathname);pending.add(task);void task.finally(()=>pending.delete(task));
      }catch(error){failures.push({path:url.pathname,error:String(error)});}
    }
    return response;
  }
  return {fetch:trackedFetch,snapshot,waitForIdle:async()=>{await Promise.all([...pending]);}};
}
