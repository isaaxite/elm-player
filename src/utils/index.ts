export function range(start: number, end: number) {
  
  const isInside = (target: number) => {
    return target >= start && target <= end;
  };

  const isOutside = (target: number) => !isInside(target);
  return {
    isInside,
    isOutside,
    getPrevIdxBy(currentIdx: number) {
      return currentIdx <= start ? start : currentIdx - 1; 
    },
    getNextIdxBy(currentIdx: number) {
      return currentIdx >= end ? end : currentIdx + 1; 
    },
  };
}
