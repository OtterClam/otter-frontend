export const EPOCH_INTERVAL = 2200;
export const TOKEN_DECIMALS = 9;
export const BLOCK_RATE_SECONDS = 2;

export enum Networks {
  UNKNOW = 0,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
}

export const RPCURL = {
  POLYGON_MAINNET: 'https://polygon-rpc.com',
  POLYGON_MUMBAI: 'https://polygon-mumbai.infura.io/v3/d7dae60b5e1d40b9b31767b0086aa75d',
};

export const DEFAULT_NETWORK = Networks.POLYGON_MAINNET;
// export const DEFAULT_NETWORK = Networks.POLYGON_MUMBAI;
