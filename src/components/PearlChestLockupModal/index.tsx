import { parseEther } from '@ethersproject/units';
import {
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Paper,
  SvgIcon,
  Typography,
  useTheme,
} from '@material-ui/core';
import addDays from 'date-fns/addDays';
import formatDate from 'date-fns/format';
import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/Modal';
import { trim } from 'src/helpers';
import getNoteImage from 'src/helpers/get-note-image';
import { useAppSelector } from 'src/store/hook';
import { approveSpending, ITerm, lock as lockAction } from 'src/store/slices/otter-lake-slice';
import { ReactComponent as NoteIcon } from '../../assets/icons/note.svg';
import { ReactComponent as RocketIcon } from '../../assets/icons/rocket.svg';
import { useWeb3Context } from '../../hooks';
import ActionButton from '../Button/ActionButton';
import './styles.scss';

const percentageFormatter = Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });
const pearlFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 4 });

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
  open?: boolean;
  term?: ITerm;
  discount: number;
  onClose: () => void;
  onSuccess: (result: any) => void;
}

export default function PearlChestLockupModal({
  open = false,
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
  const account = useAppSelector(state => state.account);
  const allowance = useAppSelector(state => state.lake.allowance);
  const stakingRebase = useAppSelector(state => state.app.stakingRebase);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);
  const { provider, address, chainID } = useWeb3Context();
  const noteAddress = useFallback ? term?.fallbackTerm!.noteAddress : term?.noteAddress;
  const nextRewardValue = pearlFormatter.format(Number(amount) * (term?.rewardRate ?? 0));

  const lockup = useCallback(async () => {
    const result: any = await dispatch(lockAction({ chainID, provider, address, noteAddress: noteAddress!, amount }));
    if (result.payload) {
      onSuccess(result.payload);
    }
  }, [noteAddress, amount, onSuccess]);

  const approve = async () => await dispatch(approveSpending({ chainID, provider }));

  return (
    <Modal title={t('pearlChests.lockUpModal.title')} open={open} onClose={onClose}>
      <>
        <Paper className="lockup-modal__summary">
          <Typography style={{ color: theme.palette.mode.darkGray200 }} className="lockup-modal__summary-label">
            Order Summary
          </Typography>
          <Typography className="lockup-modal__summary-title">{term?.note.name}</Typography>
          <div className="lockup-modal__summary-period-wrapper">
            <Typography className="lockup-modal__summary-period">{term?.lockPeriod}-Day Lock-up Period</Typography>
            <Typography variant="caption">
              Due date: {formatDate(addDays(new Date(), Number(term?.lockPeriod ?? 1)), 'MMM dd, yyyy')}
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
            Enter PEARL amount
          </Typography>

          <div className={styles.input + ' input-container'}>
            <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
              <OutlinedInput
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
                        setAmount(account?.balances?.pearl ?? 0);
                      }}
                    >
                      <p>{t('common.max')}</p>
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>
            {BigNumber.from(allowance).gt(parseEther(amount || '0')) ? (
              <ActionButton
                className="lockup-modal__action-btn"
                pendingTransactions={pendingTransactions}
                type={'lock_' + noteAddress}
                start="Lock Up"
                progress="Processing..."
                processTx={lockup}
              />
            ) : (
              <ActionButton
                className="lockup-modal__action-btn"
                pendingTransactions={pendingTransactions}
                type="lake-approve_pearl"
                start="Approve"
                progress="Processing..."
                processTx={approve}
              />
            )}
          </div>

          <Typography variant="caption" className="lockup-modal__approve-caption">
            Note: Your first interaction with Pearl Chests includes an “Approve” transaction followed by a “Lock up”
            transaction. Subsequent lockups will only require the “Lock Up” transaction.
          </Typography>

          <div className="lockup-modal__account-details">
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Your Balance</Typography>
              <Typography className="lockup-modal__account-detail-value">
                {trim(account?.balances?.pearl ?? 0, 4)} PEARL
              </Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Expected Next Reward</Typography>
              <Typography className="lockup-modal__account-detail-value">{nextRewardValue} PEARL</Typography>
            </div>
            {/*
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Next Reward Bonus</Typography>
              <Typography className="lockup-modal__account-detail-value">10 PEARL</Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Total Next Reward</Typography>
              <Typography className="lockup-modal__account-detail-value">20 PEARL</Typography>
            </div> */}
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Expected Next Reward Yield</Typography>
              <Typography className="lockup-modal__account-detail-value">
                {percentageFormatter.format(term?.rewardRate ?? 0)} + Staking{' '}
                {percentageFormatter.format(stakingRebase)}
              </Typography>
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
        <img className="lockup-modal__card-receipt-img" src={getNoteImage(term.note.name)} />
        {!qualified && <Typography className="lockup-modal__not-qualified">Not qualified</Typography>}
      </div>
      <div className="lockup-modal__card-body">
        <Typography variant="h4" className="lockup-modal__card-title">
          {term.note.name}
        </Typography>
        {discount !== 0 && (
          <>
            <Typography className="lockup-modal__card-discount">
              Use this note to receive a {discount}% discount on any (4,4) bond.
            </Typography>
            <Typography className="lockup-modal__card-requirement">
              (Minimum {term.minLockAmount} PEARL lockup required to get this note)
            </Typography>
          </>
        )}
        {discount === 0 && <Typography className="lockup-modal__no-discount">No extra note bonus</Typography>}
      </div>
    </div>
  );
}
