export function isEmptyObject(obj: any) {
  if (obj === undefined) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function removeDuplicates(arr: any[]) {
  return Array.from(new Set(arr));
}
