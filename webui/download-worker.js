// This adapter observes transfers; the qualified inference engine is unmodified.
import {createDownloadMonitor} from './download-progress.js';
const originalFetch=self.fetch.bind(self),originalPost=self.postMessage.bind(self);
let downloadRequestId=null;
const earlyMessages=[];
self.onmessage=event=>earlyMessages.push(event);
self.addEventListener('message',event=>{
  if(event.data.type==='initialize')downloadRequestId=event.data.requestId;
});
const response=await originalFetch('/download-manifest.json');
if(!response.ok)throw Error('Cannot load model download manifest: '+response.status);
const manifest=await response.json();
const monitor=createDownloadMonitor(originalFetch,manifest,download=>{
  if(downloadRequestId!==null)originalPost({kind:'progress',stage:'download',requestId:downloadRequestId,download});
});
self.fetch=monitor.fetch;
self.postMessage=(message,transfer)=>{
  if(message.kind==='ready'){
    void monitor.waitForIdle().then(()=>originalPost({...message,download:monitor.snapshot()}));return;
  }
  return transfer===undefined?originalPost(message):originalPost(message,transfer);
};
await import('./resident/inference-worker.js');
const handle=self.onmessage;
for(const event of earlyMessages)handle(event);
