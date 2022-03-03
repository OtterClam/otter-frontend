export const trim = (number: number | string = 0, precision?: number) => {
  const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: precision });
  return formatter.format(Number(number));
};
