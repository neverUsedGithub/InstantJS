
export default function isEqual(x: any, y: any) {
  if (Array.isArray(x) && !Array.isArray(y) ||
      Array.isArray(y) && !Array.isArray(x))
    return false;
  
  if (Array.isArray(x)) {
    if (x.length !== y.length) return false;

    for (let i = 0; i < x.length; i++)
      if (!isEqual(x[i], y[i])) return false;
    
    return true;
  }

  if (typeof x === "function")
    return Object.is(x, y);

  return x === y;
}