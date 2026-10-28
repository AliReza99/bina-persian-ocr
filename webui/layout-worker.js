import {partitionPNG} from './layout.mjs';
onmessage=({data})=>{
  try {
    const plan=partitionPNG(data);
    const transfers=[...new Set(plan.regions.map(r=>r.png.buffer))];
    postMessage({ok:true,plan},transfers);
  } catch(error) {postMessage({ok:false,error:String(error)});}
};
