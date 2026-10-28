import {decode,encode} from 'fast-png';
const median=a=>{if(!a.length)return NaN;a.sort((x,y)=>x-y);const m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2;};
const runs=mask=>{const out=[];let start=null;for(let i=0;i<=mask.length;i++){if(mask[i]&&start===null)start=i;else if(!mask[i]&&start!==null){out.push([start,i]);start=null;}}return out;};
export function partitionPNG(buffer){
 const png=decode(new Uint8Array(buffer));if(png.depth!==8)throw Error('Use an 8-bit PNG image');const {width:w,height:h,channels,data,palette}=png,rgb=new Uint8Array(w*h*3);
 for(let i=0;i<w*h;i++){if(palette)rgb.set(palette[data[i]].slice(0,3),i*3);else if(channels>=3)rgb.set(data.subarray(i*channels,i*channels+3),i*3);else rgb.fill(data[i*channels],i*3,i*3+3);}
 const margin=Math.max(1,Math.floor(h/50)),dark=[];
 for(let x=0;x<w;x++){const values=[[],[],[]];for(let y=margin;y<h-margin;y++)for(let c=0;c<3;c++)values[c].push(rgb[(y*w+x)*3+c]);dark.push(.299*median(values[0])+.587*median(values[1])+.114*median(values[2])<240);}
 const cuts=new Set([0,w]);for(const [a,b] of runs(dark)){if(b-a<w*.08)continue;if(b>w*.98&&a>w*.45)cuts.add(a);else if(a<w*.02&&b<w*.55)cuts.add(b);}
 const xs=Array.from(cuts).sort((a,b)=>a-b),columns=xs.slice(0,-1).map((a,i)=>[a,xs[i+1]]),largest=Math.max(...columns.map(([a,b])=>b-a));columns.sort((a,b)=>largest>=w*.65?(b[1]-b[0])-(a[1]-a[0])||b[0]-a[0]:b[0]-a[0]);const output=[];
 for(const [x0,x1] of columns){let ys=[0,h];if(h>=512){const inset=Math.max(2,Math.floor((x1-x0)/50)),occupied=[];for(let y=0;y<h;y++){let n=0;for(let x=x0+inset;x<x1-inset;x++){const k=(y*w+x)*3;if(.299*rgb[k]+.587*rgb[k+1]+.114*rgb[k+2]<110)n++;}occupied.push(n>Math.max(2,Math.trunc((x1-x0)*.002)));}const active=runs(occupied),sizes=active.filter(([a,b])=>b-a>=3).map(([a,b])=>b-a),threshold=Math.max(48,2*(sizes.length?median(sizes):12),h*.025);ys=[0,...active.slice(0,-1).flatMap((a,i)=>active[i+1][0]-a[1]>=threshold?[Math.floor((a[1]+active[i+1][0])/2)]:[]),h];let changed=true;while(changed&&ys.length>2){changed=false;for(let i=0;i<ys.length-1;i++){let occupiedCount=0;for(let j=ys[i];j<ys[i+1];j++)occupiedCount+=Number(occupied[j]);if(ys[i+1]-ys[i]<128||occupiedCount<8){ys.splice(i||1,1);changed=true;break;}}}}
  for(let i=0;i<ys.length-1;i++){const y0=ys[i],y1=ys[i+1],rw=x1-x0,rh=y1-y0,pixels=new Uint8Array(rw*rh*3);for(let y=0;y<rh;y++)pixels.set(rgb.subarray(((y0+y)*w+x0)*3,((y0+y)*w+x1)*3),y*rw*3);output.push({index:output.length,bbox:[x0,y0,x1,y1],pixels:rw*rh,png:encode({width:rw,height:rh,data:pixels,channels:3,depth:8}),rgb:pixels});}
 }
 if(output.reduce((n,r)=>n+r.pixels,0)!==w*h)throw Error('Invalid pixel coverage');return {original_size:[w,h],regions:output,all_pixels_covered_exactly_once:true,resized_or_discarded_pixels:false,selection_uses_text_or_model_outputs:false};
}
