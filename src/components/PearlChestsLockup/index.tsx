import { Box, Divider, Paper, Typography } from '@material-ui/core';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { formatApy, formatCurrency } from 'src/helpers';
import getNoteImage from 'src/helpers/get-note-image';
import { useWeb3Context } from 'src/hooks';
import { IOtterLakeSliceState, ITerm, selectTerm as selectTermAction } from 'src/store/slices/otter-lake-slice';
import { IPendingTxn } from 'src/store/slices/pending-txns-slice';
import { IReduxState } from 'src/store/slices/state.interface';
import ActionButton from '../Button/ActionButton';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import PearlChestLockupModal from '../PearlChestLockupModal';
import PearlChestLockupSuccessModal from '../PearlChestLockupSuccessModal';
import './styles.scss';
import PearlChest1 from './pearl-chest1.png';
import PearlChest2 from './pearl-chest2.png';
import PearlChest3 from './pearl-chest3.png';
import PearlChest4 from './pearl-chest4.png';
import { CheckNetworkStatus } from 'src/hooks/web3/web3-context';

const extraBonus: { [k: number]: number } = {
  28: 0.5,
  90: 1,
  180: 2,
};

const PearlChestImages = [PearlChest1, PearlChest2, PearlChest3, PearlChest4];

export default function PearlChestsLockup() {
  const { t } = useTranslation();
  const [lockupResult, setLockupResult] = useState<any>();
  const otterLake = useSelector<IReduxState, IOtterLakeSliceState>(state => state.lake);
  const dispatch = useDispatch();
  const selectTerm = useCallback((term?: ITerm) => dispatch(selectTermAction(term)), []);

  return (
    <div className="lockup">
      <Typography color="textPrimary" variant="h2" component="h2" className="lockup__title">
        {t('pearlChests.lockUp.title')}
      </Typography>
      <div className="lockup__options">
        {otterLake.terms.map((term, i) => (
          <LockupOption key={i} term={term} index={i} onSelect={selectTerm} />
        ))}
      </div>
      <PearlChestLockupModal
        open={Boolean(otterLake.selectedTerm)}
        onClose={() => selectTerm(undefined)}
        onSuccess={result => {
          selectTerm(undefined);
          setLockupResult(result);
        }}
        discount={extraBonus[otterLake.selectedTerm?.lockPeriod ?? 0] ?? 0}
        term={otterLake.selectedTerm}
      />
      <PearlChestLockupSuccessModal
        open={Boolean(lockupResult)}
        onClose={() => setLockupResult(undefined)}
        actionResult={lockupResult}
      />
    </div>
  );
}

function LockupOption({
  term,
  index,
  onSelect,
}: {
  term: ITerm;
  index: number;
  onSelect: (settings: ITerm | undefined) => void;
}) {
  const { t } = useTranslation();
  const pearlPrice = useSelector<IReduxState, number>(state => state.app.pearlPrice);
  const showBadge = term.lockPeriod >= 90;
  const multiplier = String(term.multiplier / 100);
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });
  const { address, connect, checkNetworkStatus, switchToPolygonMainnet } = useWeb3Context();

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
            {term.lockPeriod}
          </Typography>
          <Typography className="lockup-option__days-label" component="span">
            {t('pearlChests.lockUp.days')}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.rewardBoost')}
            <InfoTooltip message="Amount of locked PEARL x static multiplier gives us boost points." />
          </Typography>
          <Typography className="lockup-option__value" component="span">
            x{multiplier}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.expectedAPY')}
            <InfoTooltip message="The APY is including staking reward." />
          </Typography>
          <Typography className="lockup-option__value" component="span">
            {formatApy(term.apy)}
          </Typography>
        </div>

        <Divider className="lockup-option__div" />

        <div>
          <Typography className="lockup-option__label" variant="caption" component="span">
            {t('pearlChests.lockUp.youWillGet')}
          </Typography>
          <img className="lockup-option__receipt" src={getNoteImage(term.note.name)} />
          <Typography className="lockup-option__nft-name" component="span">
            {t(term.note.name)}
          </Typography>
        </div>

        <div>
          {extraBonus[term.lockPeriod] ? (
            <>
              <Typography className="lockup-option__bonus-title" component="span">
                {t('pearlChests.lockUp.bonusTitle', { percentage: extraBonus[term.lockPeriod] })}
              </Typography>
              <Typography className="lockup-option__bonus-desc" variant="caption" component="span">
                {t('pearlChests.lockUp.bonusDescription')}
              </Typography>
            </>
          ) : (
            <Typography component="span" variant="caption">
              {t('pearlChests.lockUp.noExtraBonus')}
            </Typography>
          )}
        </div>
      </div>
      <Box bgcolor="mode.lightGray100" className="lockup-option__tvl">
        <img src={PearlChestImages[index]} />
        <div>
          <p className="lockup-option__tvl__title">{t('pearlChests.lockUp.lockedPearl')}</p>
          <p className="lockup-option__tvl__value">
            <Typography component={'span'} color="textSecondary">
              {formatCurrency(term.pearlBalance * pearlPrice)}
            </Typography>
          </p>
        </div>
      </Box>

      <ActionButton
        className="lockup-option__select-btn"
        height={68}
        pendingTransactions={pendingTransactions}
        type="select_lockup_option"
        start={t(
          checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN
            ? 'common.switchChain'
            : address
            ? 'pearlChests.lockUp.select'
            : 'common.connectWallet',
        )}
        progress="Processing..."
        processTx={() => {
          checkNetworkStatus === CheckNetworkStatus.WRONG_CHAIN
            ? switchToPolygonMainnet()
            : address
            ? onSelect(term)
            : connect();
        }}
      />
    </Paper>
  );
}
