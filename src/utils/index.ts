export function range(start: number, end: number) {
  
  const isInside = (target: number) => {
    return target >= start && target <= end;
  };

  const isOutside = (target: number) => !isInside(target);
  return {
    isInside,
    isOutside,
  };
}
