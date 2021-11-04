export const trim = (number: number | string = 0, precision?: number) => {
  if (typeof number === 'string') {
    const [dec, frac] = number.split('.');
    return `${dec}.${frac.substr(0, 2)}`;
  }
  return number.toFixed(precision).toString();
};
