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

export function throttle<F extends (...args: any[]) => any>(func: F, delay: number) {
  let lastCall = 0;
  
  return function(...args: Parameters<F>) {
    const now = new Date().getTime();
    
    if (now - lastCall < delay) {
      return;
    }
    
    lastCall = now;
    func(...args);
  };
}

export function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
  let timeoutId: number | NodeJS.Timeout;

  return function(...args: Parameters<F>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
