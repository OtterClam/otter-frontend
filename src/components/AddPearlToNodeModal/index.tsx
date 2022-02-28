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
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/Modal';
import { trim } from 'src/helpers';
import getNoteImage from 'src/helpers/get-note-image';
import { useAppSelector } from 'src/store/hook';
import {
  extendLock as extendLockAction,
  ILockNote,
  ITerm,
  lock as lockAction,
} from 'src/store/slices/otter-lake-slice';
import { ReactComponent as NoteIcon } from '../../assets/icons/note.svg';
import { ReactComponent as RocketIcon } from '../../assets/icons/rocket.svg';
import { useWeb3Context } from '../../hooks';
import ActionButton from '../Button/ActionButton';
import './styles.scss';

const percentageFormatter = Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });

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

export interface AddPearlToNoteModalProps {
  open?: boolean;
  term: ITerm | null;
  lockNote: ILockNote | null;
  discount: number;
  onClose: () => void;
  onSuccess: (result: any) => void;
}

export default function AddPearlToNoteModal({
  open = false,
  lockNote,
  term,
  discount,
  onClose,
  onSuccess,
}: AddPearlToNoteModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('0');
  const multiplier = term ? Number((term.multiplier / 100).toFixed(1)) : 1;
  const account = useAppSelector(state => state.account);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);
  const { provider, address, chainID } = useWeb3Context();

  const lockup = useCallback(async () => {
    const result: any = await dispatch(
      extendLockAction({
        chainID,
        provider,
        noteAddress: lockNote!.noteAddress,
        amount,
        address,
        tokenId: lockNote!.tokenId,
      }),
    );
    if (result?.payload) {
      onSuccess(result.payload);
    }
  }, [lockNote, amount, onSuccess]);

  return (
    <Modal title={t('pearlChests.lockUpModal.title')} open={open} onClose={onClose}>
      <>
        <Paper className="add-pearl-modal__summary">
          <Typography style={{ color: theme.palette.mode.darkGray200 }} className="add-pearl-modal__summary-label">
            Add PEARL
          </Typography>
          <Typography className="add-pearl-modal__summary-title">{term?.note.name}</Typography>
          <div className="add-pearl-modal__summary-period-wrapper">
            <Typography className="add-pearl-modal__summary-period">
              {term?.lockPeriod} Days Locked-up Period
            </Typography>
            <Typography variant="caption">
              Due date: {formatDate(addDays(new Date(), Number(term?.lockPeriod ?? 1)), 'MMM dd, yyyy')}
            </Typography>
          </div>
          <Divider className="add-pearl-modal__summary-div" />
          <Typography variant="caption" className="add-pearl-modal__reward-label">
            You will get:
          </Typography>
          <Typography className="add-pearl-modal__reward">
            <SvgIcon component={RocketIcon} className="add-pearl-modal__reward-icon" />x{multiplier} Reward Boost
          </Typography>
        </Paper>

        <Paper className="add-pearl-modal__form">
          <Typography variant="h4" component="h4" className="add-pearl-modal__form-title">
            Enter locked-up PEARL amount
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
                className="add-pearl-modal__form-input"
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
            <ActionButton
              className="add-pearl-modal__action-btn"
              pendingTransactions={pendingTransactions}
              type={'extend-lock_' + lockNote?.noteAddress + '_' + lockNote?.tokenId}
              start="Lock Up"
              progress="Processing..."
              processTx={lockup}
            />
          </div>

          <Typography variant="caption" className="add-pearl-modal__approve-caption">
            Note: Your first interaction with Pearl Chests includes an “Approve” transaction followed by a lock up
            transaction. Subsequent lockups will only require the “Lock Up” transaction.
          </Typography>

          <div className="add-pearl-modal__account-details">
            <div className="add-pearl-modal__account-detail">
              <Typography className="add-pearl-modal__account-detail-label">Your Balance</Typography>
              <Typography className="add-pearl-modal__account-detail-value">
                {trim(account?.balances?.pearl ?? 0, 4)} PEARL
              </Typography>
            </div>
            {/* <div className="add-pearl-modal__account-detail">
              <Typography className="add-pearl-modal__account-detail-label">Next Reward</Typography>
              <Typography className="add-pearl-modal__account-detail-value">{nextRewardValue} PEARL</Typography>
            </div> */}
            {/*
            <div className="add-pearl-modal__account-detail">
              <Typography className="add-pearl-modal__account-detail-label">Next Reward Bonus</Typography>
              <Typography className="add-pearl-modal__account-detail-value">10 PEARL</Typography>
            </div>
            <div className="add-pearl-modal__account-detail">
              <Typography className="add-pearl-modal__account-detail-label">Total Next Reward</Typography>
              <Typography className="add-pearl-modal__account-detail-value">20 PEARL</Typography>
            </div> */}
            <div className="add-pearl-modal__account-detail">
              <Typography className="add-pearl-modal__account-detail-label">Next Reward Yield</Typography>
              <Typography className="add-pearl-modal__account-detail-value">
                {percentageFormatter.format(term?.rewardRate || 0)}
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
    <div className="add-pearl-modal__card">
      <div className="add-pearl-modal__card-receipt">
        <img className="add-pearl-modal__card-receipt-img" src={getNoteImage(term.note.name)} />
        {!qualified && <Typography className="add-pearl-modal__not-qualified">Not qualified</Typography>}
      </div>
      <div className="add-pearl-modal__card-body">
        <Typography variant="h4" className="add-pearl-modal__card-title">
          {term.note.name}
        </Typography>
        {discount !== 0 && (
          <>
            <Typography className="add-pearl-modal__card-discount">
              Use this note to receive a {discount}% discount on any (4,4) bond.
            </Typography>
            <Typography className="add-pearl-modal__card-requirement">
              (Minimum {term.minLockAmount} PEARL locked-up required to get this note)
            </Typography>
          </>
        )}
        {discount === 0 && <Typography className="add-pearl-modal__no-discount">No extra note bonus</Typography>}
      </div>
    </div>
  );
}
