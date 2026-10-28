"""Pixel-only, non-overlapping page partition. No text, model output or IDs used."""
import numpy as np

def runs(mask):
 a=np.flatnonzero(np.diff(np.r_[False,mask,False]));return list(zip(a[::2].tolist(),a[1::2].tolist()))
def regions(image):
 rgb=np.asarray(image.convert('RGB'));height,width=rgb.shape[:2];cuts={0,width};margin=max(1,height//50);med=np.median(rgb[margin:height-margin],axis=0);lum=med@np.array([.299,.587,.114])
 for start,end in runs(lum<240):
  if end-start<width*.08:continue
  if end>width*.98 and start>width*.45:cuts.add(start)
  elif start<width*.02 and end<width*.55:cuts.add(end)
 columns=list(zip(sorted(cuts)[:-1],sorted(cuts)[1:]));largest=max(b-a for a,b in columns);columns.sort(key=lambda ab:(-(ab[1]-ab[0]),-ab[0]) if largest>=width*.65 else (-ab[0],0));result=[]
 for x0,x1 in columns:
  ys=[0,height]
  if height>=512:
   inset=max(2,(x1-x0)//50);part=rgb[:,x0+inset:x1-inset];ink=(part@np.array([.299,.587,.114]))<110;occupied=ink.sum(1)>max(2,int((x1-x0)*.002));active=runs(occupied);sizes=[b-a for a,b in active if b-a>=3];threshold=max(48,2.0*(np.median(sizes) if sizes else 12),height*.025)
   ys=[0]+[(a[1]+b[0])//2 for a,b in zip(active,active[1:]) if b[0]-a[1]>=threshold]+[height]
   changed=True
   while changed and len(ys)>2:
    changed=False
    for i,(a,b) in enumerate(zip(ys,ys[1:])):
     if b-a<128 or int(occupied[a:b].sum())<8:
      ys.pop(i if i else 1);changed=True;break
  for y0,y1 in zip(ys,ys[1:]):result.append({'bbox':[x0,y0,x1,y1],'pixels':(x1-x0)*(y1-y0)})
 assert sum(r['pixels'] for r in result)==height*width
 for i,r in enumerate(result):r['index']=i
 return {'original_size':[width,height],'regions':result,'all_pixels_covered_exactly_once':True,'resized_or_discarded_pixels':False,'selection_uses_text_or_model_outputs':False,'reading_order':'dominant column top-to-bottom, then auxiliary sidebar; otherwise right-to-left columns'}
