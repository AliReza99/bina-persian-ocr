export class ResidentBinaClient{
 constructor(onProgress=()=>{}){this.worker=new Worker('/resident/inference-worker.js',{type:'module'});this.pending=null;this.nextId=0;this.onProgress=onProgress;this.closed=false;this.worker.onmessage=event=>{const m=event.data;if(!this.pending||m.requestId!==this.pending.id)return;if(m.kind==='progress'){this.onProgress(m);return;}if(['ready','result','unloaded'].includes(m.kind)){const p=this.pending;this.pending=null;p.resolve(m);}else if(['error','cancelled'].includes(m.kind)){const p=this.pending;this.pending=null;const e=Error(m.error);e.name=m.kind==='cancelled'?'AbortError':'Error';p.reject(e);}};this.worker.onerror=event=>{this.pending?.reject(Error(event.message));this.pending=null;};}
 request(message,transfer=[]){if(this.closed)throw Error('Model unloaded');if(this.pending)throw Error('Wait for the active request before sending another');return new Promise((resolve,reject)=>{const id=++this.nextId;this.pending={id,resolve,reject};this.worker.postMessage({...message,requestId:id},transfer);});}
 initialize(){return this.request({type:'initialize',provider:'webgpu',base:'/model'});}
 async transcribe(image,prompt,diagnostic=null){return(await this.request({image,provider:'webgpu',prompt,base:'/model',repetitionGuard:false,diagnostic},[image])).result;}
 cancel(){this.worker.postMessage({type:'cancel'});}
 async unload(){if(this.pending)throw Error('Stop the active inference before unloading');try{return await this.request({type:'unload'});}finally{this.closed=true;this.worker.terminate();}}
 close(){this.closed=true;this.pending?.reject(Error('Model worker closed'));this.pending=null;this.worker.terminate();}
}
