import { Paper, Typography } from '@material-ui/core';
import receiveImage from './receipt.png';
import Modal from '../Modal';
import './styles.scss';

export interface PearlChestLockupSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PearlChestLockupSuccessModal({ open, onClose }: PearlChestLockupSuccessModalProps) {
  return (
    <Modal title="Otter’standing!" open={open} onClose={onClose} contentClassName="lockup-success-modal__content">
      <>
        <Typography variant="h1" component="span" className="lockup-success-modal__message">
          Your Chest lock-up was successful.
        </Typography>
        <img className="lockup-success-modal__receipt" src={receiveImage} />
        <Typography className="lockup-success-modal__message2">You got a Stone-Hand PEARL Note!</Typography>
        <Paper className="lockup-success-modal__details">
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Locked-up Amount</Typography>
            <Typography className="lockup-success-modal__value">50 PEARL</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Lock-up Period</Typography>
            <Typography className="lockup-success-modal__value">90 PEARL</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Due Date</Typography>
            <Typography className="lockup-success-modal__value">March 30, 2022 09:00 PM (UTC+8)</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Next Reward (x2)</Typography>
            <Typography className="lockup-success-modal__value">20 PEARL</Typography>
          </div>
        </Paper>
      </>
    </Modal>
  );
}
