// Diagnostic stop: keep every token and mark the output incomplete.
export function repeatedPassageGuard(windowSize=64) {
 const seen=new Map();
 return ids=>{
  if(ids.length<windowSize)return null;
  const start=ids.length-windowSize,key=ids.slice(start).join(','),first=seen.get(key);
  if(first!==undefined&&start-first>=windowSize)return {reason:'repeated_exact_token_passage',window_tokens:windowSize,first_start:first,repeat_start:start,stopped_after_tokens:ids.length};
  if(first===undefined)seen.set(key,start);
  return null;
 };
}
