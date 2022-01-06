import { Divider, Paper, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { formatCurrency } from 'src/helpers';
import { useWeb3Context } from 'src/hooks';
import { IPendingTxn } from 'src/store/slices/pending-txns-slice';
import { IPearlVaultSliceState, ITerm } from 'src/store/slices/pearl-vault-slice';
import { IReduxState } from 'src/store/slices/state.interface';
import ActionButton from '../Button/ActionButton';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import PearlChestLockupModal from '../PearlChestLockupModal';
import PearlChestLockupSuccessModal from '../PearlChestLockupSuccessModal';
import receiptImage from './receipt.png';
import './styles.scss';

const extraBonus: { [k: number]: number } = {
  28: 5,
  90: 10,
  180: 20,
};

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
  const pearlVault = useSelector<IReduxState, IPearlVaultSliceState>(state => state.pearlVault);
  const [selectedTerm, selectTerm] = useState<ITerm | undefined>(undefined);

  return (
    <div className="lockup">
      <Typography color="textPrimary" variant="h2" component="h2" className="lockup__title">
        {t('pearlChests.lockUp.title')}
      </Typography>
      <div className="lockup__options">
        {pearlVault.terms.map((term, i) => (
          <LockupOption key={i} term={term} onSelet={selectTerm} />
        ))}
      </div>
      <PearlChestLockupModal open={Boolean(selectedTerm)} onClose={() => selectTerm(undefined)} option={selectedTerm} />
      <PearlChestLockupSuccessModal open={false} onClose={console.log} />
    </div>
  );
}

function LockupOption({ term, onSelet }: { term: ITerm; onSelet: (settings: ITerm | undefined) => void }) {
  const { t } = useTranslation();
  const showBadge = term.lockPeriod.toNumber() >= 90;
  const multiplier = Number((term.multiplier / 100).toFixed(1));
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });
  const { address, connect } = useWeb3Context();
  const apy = 24538;

  return (
    <Paper className="lockup-option">
      {showBadge && (
        <div className="lockup-option__badge">
          <Typography className="lockup-option__badge-label" variant="caption">
            {t('pearlChests.lockUp.boost')}
          </Typography>
          <Typography className="lockup-option__badge-value" component="span">
            X{multiplier}
          </Typography>
          <Paper className="lockup-option__badge-after" />
          <Paper className="lockup-option__badge-before" />
        </div>
      )}

      <div className="lockup-option__content">
        <div>
          <Typography className="lockup-option__days" component="span">
            {term.lockPeriod.toNumber()}
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
            x{multiplier}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.expectedAPY')} <InfoTooltip message="test" />
          </Typography>
          <Typography className="lockup-option__value" component="span">
            {formatCurrency(apy * multiplier, 0)}%
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.youWillGet')}
          </Typography>
          <img className="lockup-option__receipt" src={receiptImage} />
          <Typography className="lockup-option__nft-name" component="span">
            {t(term.note.name)}
          </Typography>
        </div>

        <div>
          {extraBonus[term.lockPeriod.toNumber()] && (
            <>
              <Typography className="lockup-option__bonus-title" component="span">
                {t('pearlChests.lockUp.bonusTitle', { percentage: extraBonus[term.lockPeriod.toNumber()] })}
              </Typography>
              <Typography className="lockup-option__bonus-desc" variant="caption" component="span">
                {t('pearlChests.lockUp.bonusDescription')}
              </Typography>
              <Typography className="lockup-option__requirement" variant="caption" component="span">
                {t('pearlChests.lockUp.nftRequirement', { amount: term.minLockAmount.toNumber() })}
              </Typography>
            </>
          )}
          {!extraBonus[term.lockPeriod.toNumber()] && (
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
        processTx={() => (address ? onSelet(term) : connect())}
      />
    </Paper>
  );
}
