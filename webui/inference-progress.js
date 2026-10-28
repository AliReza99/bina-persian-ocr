/** Estimated within-region work. EOS length is unknown; never claim early 100%. */
export function estimateRegionProgress(stage,tokens=0,pixels=0,previous=0){
  const budget=Math.max(64,Math.min(1024,pixels/1000));
  const values={vision:.02,neck:.45,prefill:.58,decode:.68+.30*Math.max(0,tokens)/(Math.max(0,tokens)+budget)};
  return Math.max(previous,Math.min(.99,values[stage]??previous));
}
export function inferencePercent(completedPixels,currentPixels,withinRegion,totalPixels,{complete=false}={}){
  if(complete)return 100;
  if(!(totalPixels>0))return 0;
  return Math.max(0,Math.min(99,Math.floor(100*(completedPixels+currentPixels*withinRegion)/totalPixels)));
}
