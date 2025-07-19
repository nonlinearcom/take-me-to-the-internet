export function arrayUnion(...arrays: any[]) {
  return [...new Set(arrays.flat())]
}
