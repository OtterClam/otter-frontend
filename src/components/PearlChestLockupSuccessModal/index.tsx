import { Paper, Typography } from '@material-ui/core';
import receiveImage from './receipt.png';
import Modal from '../Modal';
import './styles.scss';
import { BigNumber } from 'ethers';
import { useSelector } from 'src/store/hook';
import formateDate from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { formatEther } from '@ethersproject/units';

export interface PearlChestLockupSuccessModalProps {
  open: boolean;
  actionResult?: {
    user: string;
    note: string;
    tokenId: BigNumber;
    amount: BigNumber;
  };
  onClose: () => void;
}

export default function PearlChestLockupSuccessModal({
  open,
  actionResult,
  onClose,
}: PearlChestLockupSuccessModalProps) {
  const terms = useSelector(state => state.pearlVault.terms);
  const term = terms.find(term => term.noteAddress === actionResult?.note);
  const multiplier = term ? Number((term.multiplier / 100).toFixed(1)) : 1;

  return (
    <Modal title="Otter’standing!" open={open} onClose={onClose} contentClassName="lockup-success-modal__content">
      <>
        <Typography variant="h1" component="span" className="lockup-success-modal__message">
          Your Chest lock-up was successful.
        </Typography>
        <img className="lockup-success-modal__receipt" src={receiveImage} />
        <Typography className="lockup-success-modal__message2">You got a {term?.note.name} Note!</Typography>
        <Paper className="lockup-success-modal__details">
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Locked-up Amount</Typography>
            <Typography className="lockup-success-modal__value">
              {actionResult && formatEther(actionResult.amount)} PEARL
            </Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Lock-up Period</Typography>
            <Typography className="lockup-success-modal__value">{Number(term?.lockPeriod) / 3} Days</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Due Date</Typography>
            <Typography className="lockup-success-modal__value">
              {formateDate(addDays(new Date(), (term?.lockPeriod || 0) / 3), 'MMM dd, yyyy HH:mm a (O)')}
            </Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Next Reward (x{multiplier})</Typography>
            <Typography className="lockup-success-modal__value">20 PEARL</Typography>
          </div>
        </Paper>
      </>
    </Modal>
  );
}
