import { Divider, Paper, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { formatCurrency } from 'src/helpers';
import { useWeb3Context } from 'src/hooks';
import { IPendingTxn } from 'src/store/slices/pending-txns-slice';
import { IReduxState } from 'src/store/slices/state.interface';
import ActionButton from '../Button/ActionButton';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import PearlChestLockupModal from '../PearlChestLockupModal';
import PearlChestLockupSuccessModal from '../PearlChestLockupSuccessModal';
import receiptImage from './receipt.png';
import './styles.scss';

interface Option {
  days: number;
  boost: number;
  name: string;
  extraBonus: number;
  requiredAmount: number;
  badge?: boolean;
}

const options: Option[] = [
  {
    days: 14,
    boost: 1,
    name: 'pearlChests.lockUp.safeHandNft',
    extraBonus: 0,
    requiredAmount: 0,
  },
  {
    days: 30,
    boost: 1.2,
    name: 'pearlChests.lockUp.furryHandNft',
    extraBonus: 5,
    requiredAmount: 10,
  },
  {
    days: 90,
    boost: 1.5,
    name: 'pearlChests.lockUp.stoneHandNft',
    extraBonus: 10,
    requiredAmount: 50,
    badge: true,
  },
  {
    days: 180,
    boost: 2,
    name: 'pearlChests.lockUp.diamondHandNft',
    extraBonus: 15,
    requiredAmount: 100,
    badge: true,
  },
];

export default function PearlChestsLockup() {
  const { t } = useTranslation();
  const [selectedOption, selectOption] = useState<Option | undefined>(undefined);

  return (
    <div className="lockup">
      <Typography color="textPrimary" variant="h2" component="h2" className="lockup__title">
        {t('pearlChests.lockUp.title')}
      </Typography>
      <div className="lockup__options">
        {options.map((option, i) => (
          <LockupOption key={i} option={option} onSelet={selectOption} />
        ))}
      </div>
      <PearlChestLockupModal
        open={Boolean(selectedOption)}
        onClose={() => selectOption(undefined)}
        option={selectedOption}
      />
      <PearlChestLockupSuccessModal open={false} onClose={console.log} />
    </div>
  );
}

function LockupOption({ option, onSelet }: { option: Option; onSelet: (settings: Option | undefined) => void }) {
  const { t } = useTranslation();
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });
  const { address, connect } = useWeb3Context();
  const apy = 24538;

  return (
    <Paper className="lockup-option">
      {option.badge && (
        <div className="lockup-option__badge">
          <Typography className="lockup-option__badge-label" variant="caption">
            {t('pearlChests.lockUp.boost')}
          </Typography>
          <Typography className="lockup-option__badge-value" component="span">
            X{option.boost}
          </Typography>
          <Paper className="lockup-option__badge-after" />
          <Paper className="lockup-option__badge-before" />
        </div>
      )}

      <div className="lockup-option__content">
        <div>
          <Typography className="lockup-option__days" component="span">
            {option.days}
          </Typography>
          <Typography className="lockup-option__days-label" component="span">
            {t('pearlChests.lockUp.days')}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.rewardBoost')} <InfoTooltip message="test" />
          </Typography>
          <Typography className="lockup-option__value" component="span">
            x{option.boost}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.expectedAPY')} <InfoTooltip message="test" />
          </Typography>
          <Typography className="lockup-option__value" component="span">
            {formatCurrency(apy * option.boost, 0)}%
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.youWillGet')}
          </Typography>
          <img className="lockup-option__receipt" src={receiptImage} />
          <Typography className="lockup-option__nft-name" component="span">
            {t(option.name)}
          </Typography>
        </div>

        <div>
          {option.extraBonus !== 0 && (
            <>
              <Typography className="lockup-option__bonus-title" component="span">
                {t('pearlChests.lockUp.bonusTitle', { percentage: option.extraBonus })}
              </Typography>
              <Typography className="lockup-option__bonus-desc" variant="caption" component="span">
                {t('pearlChests.lockUp.bonusDescription')}
              </Typography>
              <Typography className="lockup-option__requirement" variant="caption" component="span">
                {t('pearlChests.lockUp.nftRequirement', { amount: option.requiredAmount })}
              </Typography>
            </>
          )}
          {!option.extraBonus && (
            <Typography component="span" variant="caption">
              {t('pearlChests.lockUp.noExtraBonus')}
            </Typography>
          )}
        </div>
      </div>

      <ActionButton
        className="lockup-option__select-btn"
        pendingTransactions={pendingTransactions}
        type="select_lockup_option"
        start={t(address ? 'pearlChests.lockUp.select' : 'common.connectWallet')}
        progress="Processing..."
        processTx={() => (address ? onSelet(option) : connect())}
      />
    </Paper>
  );
}
