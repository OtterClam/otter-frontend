import {
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  SvgIcon,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import { ReactComponent as NoteIcon } from '../../assets/icons/note.svg';
import { ReactComponent as RocketIcon } from '../../assets/icons/rocket.svg';
import Modal from 'src/components/Modal';
import receiptImage from './receipt.png';
import { useTranslation } from 'react-i18next';
import './styles.scss';
import ActionButton from '../Button/ActionButton';
import { ILock, ITerm, lock as lockAction, extendLock as extendLockAction } from 'src/store/slices/pearl-vault-slice';
import formatDate from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'src/store/hook';
import { trim } from 'src/helpers';
import { useDispatch } from 'react-redux';
import { useWeb3Context } from '../../hooks';
import { ethers } from 'ethers';
import { formatEther, parseEther } from '@ethersproject/units';

const useStyles = makeStyles(theme => ({
  input: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'transparent',
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.mode.lightGray300,
    },
  },
}));

export interface PearlChestLockupModalProps {
  lock?: ILock;
  open?: boolean;
  term?: ITerm;
  discount: number;
  onClose: () => void;
  onSuccess: (event: any) => void;
}

export default function PearlChestLockupModal({
  open = false,
  lock,
  term,
  discount,
  onClose,
  onSuccess,
}: PearlChestLockupModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('0');
  const multiplier = term ? Number((term.multiplier / 100).toFixed(1)) : 1;
  const useFallback = parseEther(amount || '0').lt(parseEther(term?.minLockAmount ?? '0'));
  const account = useSelector(state => state.account);
  const app = useSelector(state => state.app);
  const stakingRebasePercentage = trim(app.stakingRebase ?? 0 * 100 * multiplier, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(amount), 4);
  const pendingTransactions = useSelector(state => state.pendingTransactions);
  const { provider, address, chainID } = useWeb3Context();
  const noteAddress = useFallback ? term?.fallbackTerm!.noteAddress : term?.noteAddress;

  const lockup = useCallback(async () => {
    let result: any;
    if (lock) {
      result = await dispatch(
        extendLockAction({
          networkID: chainID,
          provider,
          noteAddress: noteAddress!,
          amount,
          address,
          tokenId: lock.tokenId,
        }),
      );
    } else {
      result = await dispatch(lockAction({ networkID: chainID, provider, address, noteAddress: noteAddress!, amount }));
    }
    if (result.payload) {
      onSuccess(result.payload);
    }
  }, [lock, amount, onSuccess]);

  useEffect(() => {
    if (lock) {
      setAmount(formatEther(lock.amount));
    }
  }, [lock]);

  return (
    <Modal title={t('pearlChests.lockUpModal.title')} open={open} onClose={onClose}>
      <>
        <Paper className="lockup-modal__summary">
          <Typography style={{ color: theme.palette.mode.darkGray200 }} className="lockup-modal__summary-label">
            Order Summary
          </Typography>
          <Typography className="lockup-modal__summary-title">{term?.note.name}</Typography>
          <div className="lockup-modal__summary-period-wrapper">
            <Typography className="lockup-modal__summary-period">{term?.lockPeriod} Days Locked-up Period</Typography>
            <Typography variant="caption">
              Due date: {formatDate(addDays(new Date(), Number(term?.lockPeriod ?? 1)), 'MMM, dd, yyyy')}
            </Typography>
          </div>
          <Divider className="lockup-modal__summary-div" />
          <Typography variant="caption" className="lockup-modal__reward-label">
            You will get:
          </Typography>
          <Typography className="lockup-modal__reward">
            <SvgIcon component={RocketIcon} className="lockup-modal__reward-icon" />x{multiplier} Reward Boost
          </Typography>
          <Typography className="lockup-modal__reward">
            <SvgIcon component={NoteIcon} className="lockup-modal__reward-icon" />
            1x {useFallback ? term?.fallbackTerm?.note.name : term?.note.name}, immediately
          </Typography>
          {useFallback && term?.fallbackTerm && <NoteCard qualified discount={0} term={term.fallbackTerm} />}
          {term && <NoteCard qualified={!useFallback} discount={discount} term={term} />}
        </Paper>

        <Paper className="lockup-modal__form">
          <Typography variant="h4" component="h4" className="lockup-modal__form-title">
            Enter locked-up PEARL amount
          </Typography>

          <div className={styles.input + ' input-container'}>
            <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
              <OutlinedInput
                disabled={Boolean(lock)}
                placeholder="0"
                id="outlined-adornment-amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                labelWidth={0}
                className="lockup-modal__form-input"
                endAdornment={
                  <InputAdornment position="end">
                    <div
                      className="stake-input-btn"
                      onClick={e => {
                        e.preventDefault();
                        if (!lock) {
                          setAmount(account?.balances?.pearl ?? 0);
                        }
                      }}
                    >
                      <p>{t('common.max')}</p>
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>
            <ActionButton
              className="lockup-modal__action-btn"
              pendingTransactions={pendingTransactions}
              type={'lock_' + noteAddress}
              start="Lock Up"
              progress="Processing..."
              processTx={lockup}
            />
          </div>

          <Typography variant="caption" className="lockup-modal__approve-caption">
            Note: The "Approve" transaction is only needed when bonding for the first time; subsequent minting only
            requires you to perform the "Bond" transaction.
          </Typography>

          <div className="lockup-modal__account-details">
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Your Balance</Typography>
              <Typography className="lockup-modal__account-detail-value">
                {trim(account?.balances?.pearl ?? 0, 4)} PEARL
              </Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Next Reward</Typography>
              <Typography className="lockup-modal__account-detail-value">{nextRewardValue} PEARL</Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Next Reward Bonus</Typography>
              <Typography className="lockup-modal__account-detail-value">10 PEARL</Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Total Next Reward</Typography>
              <Typography className="lockup-modal__account-detail-value">20 PEARL</Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Next Reward Yield</Typography>
              <Typography className="lockup-modal__account-detail-value">0.8 %</Typography>
            </div>
          </div>
        </Paper>
      </>
    </Modal>
  );
}

function NoteCard({ term, discount, qualified }: { term: ITerm; discount: number; qualified: boolean }) {
  return (
    <div className="lockup-modal__card">
      <div className="lockup-modal__card-receipt">
        <img className="lockup-modal__card-receipt-img" src={receiptImage} />
        {!qualified && <Typography className="lockup-modal__not-qualified">Not qualified</Typography>}
      </div>
      <div className="lockup-modal__card-body">
        <Typography variant="h4" className="lockup-modal__card-title">
          {term.note.name}
        </Typography>
        {discount !== 0 && (
          <>
            <Typography className="lockup-modal__card-discount">
              You can enjoy {discount}% OFF discount on a (4,4) bond by using this note
            </Typography>
            <Typography className="lockup-modal__card-requirement">
              In order to get this note and the extra bonus, you need to at least lock up
              {term.minLockAmount} PEARL at once in the beginning.
            </Typography>
          </>
        )}
        {discount === 0 && <Typography className="lockup-modal__no-discount">No extra note bonus</Typography>}
      </div>
    </div>
  );
}
