export const trim = (number: number | string = 0, precision?: number) => {
  return Number(number).toFixed(precision).toString();
};
