export * from './address-for-asset';
export * from './is-bond-lp';
export * from './lp-url';
export * from './bond-name';
export * from './contract-for-bond';
export * from './contract-for-reserve';
export * from './get-market-price';
export * from './shorten';
export * from './trim';
export * from './prettify-seconds';
export * from './pretty-vesting-period';
export * from './get-token-image';
export * from './get-pair-image';
export * from './set-all';
export * from './price-units';
export * from './token-price';

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}
