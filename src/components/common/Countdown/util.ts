export const getNumber = (num: number, pos: number) => {
  if (pos === 0) {
    return Math.floor(num / 10);
  }
  return num % 10;
};
