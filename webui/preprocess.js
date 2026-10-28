// Positional geometry mirrors hf_prefix_geometry.py (NVIDIA, OpenMDW-1.1).
// RGB resize follows Pillow's public separable bilinear/bicubic filter contract.
const f=Math.fround,clip=x=>Math.max(0,Math.min(255,x));
export function roundEven(x){const a=Math.floor(x),r=x-a;return r===.5?a+(a%2):Math.round(x);}
function coefficients(input,output,cubic=false,integer=false){
 const scale=input/output,filterScale=Math.max(1,scale),support=filterScale*(cubic?2:1),result=[];
 for(let i=0;i<output;i++){
  const center=(i+.5)*scale,start=Math.max(0,Math.trunc(center-support+.5)),end=Math.min(input,Math.trunc(center+support+.5));let weights=[],sum=0;
  for(let j=start;j<end;j++){const x=Math.abs((j-center+.5)/filterScale);const w=cubic?(x<1?(1.5*x-2.5)*x*x+1:x<2?(((-.5*x+2.5)*x-4)*x+2):0):Math.max(0,1-x);weights.push(w);sum+=w;}
  weights=weights.map(w=>integer?Math.trunc(w/sum*4194304+(w<0?-.5:.5)):f(w/sum));result.push({start,weights});
 }
 return result;
}
export function resizeRGB(image,width,height,cubic=false){
 if(width===image.width&&height===image.height)return image;
 const xc=coefficients(image.width,width,cubic,true),yc=coefficients(image.height,height,cubic,true);let horizontal;
 if(width===image.width)horizontal=image.data;
 else{
  horizontal=new Uint8Array(width*image.height*3);
  for(let y=0;y<image.height;y++)for(let x=0;x<width;x++)for(let c=0;c<3;c++){
   let sum=2097152;const {start,weights}=xc[x];for(let j=0;j<weights.length;j++)sum+=image.data[(y*image.width+start+j)*3+c]*weights[j];horizontal[(y*width+x)*3+c]=clip(Math.floor(sum/4194304));
  }
 }
 if(height===image.height)return {data:horizontal,width,height};
 const data=new Uint8Array(width*height*3);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let c=0;c<3;c++){
  let sum=2097152;const {start,weights}=yc[y];for(let j=0;j<weights.length;j++)sum+=horizontal[((start+j)*width+x)*3+c]*weights[j];data[(y*width+x)*3+c]=clip(Math.floor(sum/4194304));
 }
 return {data,width,height};
}
export function primaryImage(image){
 if(image.height>=64)return image;
 const scale=Math.min(4,Math.max(2,64/image.height),1664/image.width);
 return scale>1?resizeRGB(image,roundEven(image.width*scale),roundEven(image.height*scale),true):image;
}
export function processPixels(image,config){
 let width=image.width,height=image.height;const ratio=width/height;
 if(height>2048){height=2048;width=Math.trunc(height*ratio);}if(width>1664){width=1664;height=Math.trunc(width/ratio);}
 image=resizeRGB(image,width,height,false);const paddedHeight=Math.ceil(height/16)*16,paddedWidth=Math.ceil(width/64)*64,rows=paddedHeight/16,cols=paddedWidth/16,patches=new Float32Array(rows*cols*768);
 const mean=config.image_mean.map(f),std=config.image_std.map(f);const lookup=Array.from({length:3},(_,c)=>Float32Array.from({length:256},(_,v)=>config.do_normalize?f(f(f(v/255)-mean[c])/std[c]):f(v/255)));
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)for(let c=0;c<3;c++)for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  const py=row*16+y,px=col*16+x,value=py<height&&px<width?image.data[(py*width+px)*3+c]:255;patches[((row*cols+col)*3+c)*256+y*16+x]=lookup[c][value];
 }
 return {patches,imageSize:[paddedHeight,paddedWidth],contentSize:[height,width],rows,cols};
}
function interpolatedField(field,rows,cols){
 const channels=1152,source=128,out=new Float32Array(rows*cols*channels);
 if(Math.min(rows,cols)===1){
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const y0=Math.floor(y*source/rows),y1=Math.ceil((y+1)*source/rows),x0=Math.floor(x*source/cols),x1=Math.ceil((x+1)*source/cols),area=(y1-y0)*(x1-x0),offset=(y*cols+x)*channels;
   for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++)for(let c=0;c<channels;c++)out[offset+c]=f(out[offset+c]+field[(yy*source+xx)*channels+c]);
   for(let c=0;c<channels;c++)out[offset+c]=f(out[offset+c]/area);
  }
  return out;
 }
 const xc=coefficients(source,cols),yc=coefficients(source,rows),horizontal=new Float32Array(source*cols*channels);
 for(let y=0;y<source;y++)for(let x=0;x<cols;x++){
  const {start,weights}=xc[x],offset=(y*cols+x)*channels;
  for(let j=0;j<weights.length;j++)for(let c=0;c<channels;c++)horizontal[offset+c]=f(horizontal[offset+c]+f(field[(y*source+start+j)*channels+c]*weights[j]));
 }
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const {start,weights}=yc[y],offset=(y*cols+x)*channels;
  for(let j=0;j<weights.length;j++)for(let c=0;c<channels;c++)out[offset+c]=f(out[offset+c]+f(horizontal[((start+j)*cols+x)*channels+c]*weights[j]));
 }
 return out;
}
export function positions(field,contentSize,imageSize){
 const [height,width]=contentSize,rows=imageSize[0]/16,cols=imageSize[1]/16,cr=Math.ceil(height/16),cc=Math.ceil(width/16),intermediate=interpolatedField(field,cr,cc),channels=1152,out=new Float32Array(rows*cols*channels),bits=new Uint32Array(out.buffer);
 const axis=(i,content,size)=>{const start=i*16,extent=Math.max(0,Math.min(16,content-start)),norm=f(Math.min(f(start+f(.5*extent)),content)/content),grid=f(f(2*norm)-1);return Math.max(0,Math.min(size-1,f(f(f(grid+1)*size)-1)*.5));};
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const yy=axis(y,height,cr),xx=axis(x,width,cc),y0=Math.floor(yy),x0=Math.floor(xx),y1=Math.min(cr-1,y0+1),x1=Math.min(cc-1,x0+1),dy=f(yy-y0),dx=f(xx-x0),weights=[f(f(1-dy)*f(1-dx)),f(f(1-dy)*dx),f(dy*f(1-dx)),f(dy*dx)],indices=[y0*cc+x0,y0*cc+x1,y1*cc+x0,y1*cc+x1];
  const offset=(y*cols+x)*channels;
  for(let c=0;c<channels;c++){
   let value=0;for(let j=0;j<4;j++)value=f(value+f(intermediate[indices[j]*channels+c]*weights[j]));out[offset+c]=value;const raw=bits[offset+c];bits[offset+c]=(raw+32767+((raw>>>16)&1))&0xffff0000;
  }
 }
 return out;
}
export function npyFloat32(buffer){const data=new Uint8Array(buffer),view=new DataView(buffer),major=data[6],size=major===1?view.getUint16(8,true):view.getUint32(8,true),offset=(major===1?10:12)+size;return new Float32Array(buffer,offset);}
