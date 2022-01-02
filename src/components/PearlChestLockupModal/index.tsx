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
  option?: {};
  fallbackOption?: {};
  onClose: () => void;
}

export default function PearlChestLockupModal({ open = false, onClose }: PearlChestLockupModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  return (
    <Modal title={t('pearlChests.lockUpModal.title')} open={open} onClose={onClose}>
      <>
        <Paper className="lockup-modal__summary">
          <Typography style={{ color: theme.palette.mode.darkGray200 }} className="lockup-modal__summary-label">
            Order Summary
          </Typography>
          <Typography className="lockup-modal__summary-title">Stone-Hand PEARL Chest</Typography>
          <div className="lockup-modal__summary-period-wrapper">
            <Typography className="lockup-modal__summary-period">90 Days Locked-up Period</Typography>
            <Typography variant="caption">Due date: March, 30, 2022</Typography>
          </div>
          <Divider className="lockup-modal__summary-div" />
          <Typography variant="caption" className="lockup-modal__reward-label">
            You will get:
          </Typography>
          <Typography className="lockup-modal__reward">
            <SvgIcon component={RocketIcon} className="lockup-modal__reward-icon" />
            2x Reward Boost
          </Typography>
          <Typography className="lockup-modal__reward">
            <SvgIcon component={NoteIcon} className="lockup-modal__reward-icon" />
            1x Stone-Hand PEARL Note, immediately
          </Typography>
          <NoteCard option={{}} />
          <NoteCard option={{}} />
        </Paper>

        <Paper className="lockup-modal__form">
          <Typography variant="h4" component="h4" className="lockup-modal__form-title">
            Enter locked-up PEARL amount
          </Typography>

          <div className={styles.input + ' input-container'}>
            <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
              <OutlinedInput
                placeholder="0"
                id="outlined-adornment-amount"
                type="number"
                value={undefined}
                onChange={e => console.log(e.target.value)}
                labelWidth={0}
                className="lockup-modal__form-input"
                endAdornment={
                  <InputAdornment position="end">
                    <div className="stake-input-btn" onClick={console.log}>
                      <p>{t('common.max')}</p>
                    </div>
                  </InputAdornment>
                }
              />
            </FormControl>
            <ActionButton
              className="lockup-modal__action-btn"
              pendingTransactions={[]}
              type="lockup"
              start="Lock Up"
              progress="Processing..."
              processTx={console.log}
            />
          </div>

          <Typography variant="caption" className="lockup-modal__approve-caption">
            Note: The "Approve" transaction is only needed when bonding for the first time; subsequent minting only
            requires you to perform the "Bond" transaction.
          </Typography>

          <div className="lockup-modal__account-details">
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Your Balance</Typography>
              <Typography className="lockup-modal__account-detail-value">400 PEARL</Typography>
            </div>
            <div className="lockup-modal__account-detail">
              <Typography className="lockup-modal__account-detail-label">Next Reward</Typography>
              <Typography className="lockup-modal__account-detail-value">10 PEARL</Typography>
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

function NoteCard({ option }: { option: {} }) {
  return (
    <div className="lockup-modal__card">
      <div className="lockup-modal__card-receipt">
        <img className="lockup-modal__card-receipt-img" src={receiptImage} />
        {/* <Typography className="lockup-modal__card-receipt-">Not qualified</Typography> */}
      </div>
      <div className="lockup-modal__card-body">
        <Typography variant="h4" className="lockup-modal__card-title">
          Safe-Hand PEARL Note
        </Typography>
        <Typography className="lockup-modal__card-discount">
          You can enjoy 5% OFF discount on a (4,4) bond by using this note
        </Typography>
        <Typography className="lockup-modal__card-requirement">
          In order to get this note and the extra bonus, you need to at least lock up 50 PEARL at once in the beginning.
        </Typography>
      </div>
    </div>
  );
}
