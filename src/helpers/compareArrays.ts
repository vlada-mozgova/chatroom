export const compareArrays = <Type extends unknown>(
  a: Array<Type>,
  b: Array<Type>
): boolean => {
  if (a.length !== b.length) return false;
  const array1 = a.sort();
  const array2 = b.sort();

  return array1.every((item: any, i: number) => item === array2[i]);
};
