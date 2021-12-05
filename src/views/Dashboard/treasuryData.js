import apollo from '../../lib/apolloClient';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
// TODO: add paramaterization
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
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedClam
    treasuryMaiRiskFreeValue
    treasuryMaiMarketValue
    treasuryFraxMarketValue
    treasuryFraxRiskFreeValue
    currentAPY
    runway10k
    runway20k
    runway50k
    runway7dot5k
    runway5k
    runway2dot5k
    runwayCurrent
    treasuryClamMaiPOL
  }
}
`;

export const rebasesDataQuery = `
query {
  rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

export const treasuryData = () => apollo(treasuryDataQuery).then(r => r.data.protocolMetrics);

// export default treasuryData;
export const bulletpoints = {
  tvl: [
    {
      right: 20,
      top: -12,
      background: 'linear-gradient(180deg, #FFACA1 -10%, #FFACA1 100%)',
    },
  ],
  coin: [
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
      background: 'linear-gradient(180deg, #DC30EB -10%, #EA98F1 100%)',
    },
    {
      right: 29,
      top: -12,
      background: 'linear-gradient(180deg, #4C8C2A -10%, #8BFF4D 100%)',
    },
    {
      right: 29,
      top: -12,
      background: 'linear-gradient(180deg, #c9184a -10%, #ff758f 100%)',
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

export const tooltipItems = {
  tvl: [t('dashboard.tooltipItems.tvl')],
  coin: ['MAI', 'FRAX'],
  rfv: ['MAI', 'FRAX'],
  holder: ['CLAMies'],
  apy: [t('common.apy')],
  runway: [
    t('dashboard.tooltipItems.current'),
    `7.5K ${t('dashboard.tooltipItems.apy')}`,
    `5K ${t('dashboard.tooltipItems.apy')}`,
    `2.5K ${t('dashboard.tooltipItems.apy')}`,
  ],
  pol: [t('dashboard.tooltipItems.lpTreasury'), t('dashboard.tooltipItems.marketLP')],
};

export const tooltipInfoMessages = {
  tvl: t('dashboard.tooltipInfoMessages.tvl'),
  mvt: t('dashboard.tooltipInfoMessages.mtv'),
  rfv: t('dashboard.tooltipInfoMessages.rfv'),
  pol: t('dashboard.tooltipInfoMessages.pol'),
  holder: t('dashboard.tooltipInfoMessages.holder'),
  staked: t('dashboard.tooltipInfoMessages.staked'),
  apy: t('dashboard.tooltipInfoMessages.apy'),
  runway: t('dashboard.tooltipInfoMessages.runway'),
  currentIndex: t('dashboard.tooltipInfoMessages.currentIndex'),
};

export const itemType = {
  dollar: '$',
  percentage: '%',
};
