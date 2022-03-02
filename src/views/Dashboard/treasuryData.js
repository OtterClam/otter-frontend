import apollo from '../../lib/apolloClient';

export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    clamCirculatingSupply
    sClamCirculatingSupply
    totalSupply
    clamPrice
    marketCap
    totalValueLocked
    treasuryMarketValue
    nextEpochRebase
    nextDistributedClam
    treasuryMaiMarketValue
    treasuryFraxMarketValue
    treasuryWmaticMarketValue
    treasuryMaiUsdcRiskFreeValue
    treasuryMaiUsdcQiInvestmentRiskFreeValue
    treasuryQiMarketValue
    treasuryDquickMarketValue
    treasuryQiWmaticMarketValue
    treasuryQiWmaticQiInvestmentMarketValue
    treasuryDaiRiskFreeValue
    treasuryClamMaiPOL
    treasuryOtterClamQiMarketValue
  }
}
`;

export const treasuryData = () => apollo(treasuryDataQuery).then(r => r.data.protocolMetrics);

export const bulletpoints = {
  tvl: [
    {
      right: 20,
      top: -12,
      background: 'linear-gradient(180deg, #FFACA1 -10%, #FFACA1 100%)',
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
      background: 'linear-gradient(180deg, #DB3737 -10%, #EA9276 100%)',
    },
    {
      right: 25,
      top: -12,
      background: 'linear-gradient(180deg, #8f5ae8 -10%, #98B3E9 100%)',
    },
    {
      right: 29,
      top: -12,
      background: 'linear-gradient(180deg, #c9184a -10%, #ff758f 100%)',
    },
    {
      right: 29,
      top: -12,
      background: 'linear-gradient(180deg, #5CBD6B 19.01%, rgba(92, 189, 107, 0.5) 100%)',
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
      background: '#A3A3A3',
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
      background: '#1D2654',
    },
    {
      right: 20,
      top: -12,
      background: '#000000',
    },
    {
      right: 20,
      top: -12,
      background: '#2EC608',
    },
    {
      right: 20,
      top: -12,
      background: '#49A1F2',
    },
    {
      right: 20,
      top: -12,
      background: '#c9184a',
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
      background: '#000000',
    },
    {
      right: 48,
      top: -12,
      background: '#2EC608',
    },
    {
      right: 48,
      top: -12,
      background: '#49A1F2',
    },
    {
      right: 48,
      top: -12,
      background: '#c9184a',
    },
  ],
  runway_darktheme: [
    {
      right: 45,
      top: -12,
      background: '#FFFFFF',
    },
    {
      right: 48,
      top: -12,
      background: '#2EC608',
    },
    {
      right: 48,
      top: -12,
      background: '#49A1F2',
    },
    {
      right: 48,
      top: -12,
      background: '#c9184a',
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
      background: 'linear-gradient(180deg, #ffdc77, #ffdc77 100%)',
    },
    {
      right: 68,
      top: -12,
      background: 'rgba(151, 196, 224, 0.2)',
      border: '1px solid rgba(54, 56, 64, 0.5)',
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
      background: 'linear-gradient(180deg, rgba(56, 223, 63, 1) -10%, rgba(182, 233, 152, 1) 100%)',
    },
    {
      right: 25,
      top: -12,
      background: 'rgba(219, 242, 170, 1)',
      border: '1px solid rgba(118, 130, 153, 1)',
    },
  ],
};

export const itemType = {
  dollar: '$',
  percentage: '%',
};
