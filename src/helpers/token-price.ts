import axios from 'axios';

let cache: number;

export const getTokenPrice = async (symbol: string): Promise<number> => {
  // FIXME: fetch from api
  return 1;

  const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`;

  if (cache) return cache;

  cache = await axios
    .get(url)
    .then(({ data }) => data.USD)
    .catch(error => {
      console.error(error);
      return 0;
    });

  return cache;
};
