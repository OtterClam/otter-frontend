import { CircularProgress, Paper, Typography } from '@material-ui/core';
import addDays from 'date-fns/addDays';
import formateDate from 'date-fns/format';
import { useMemo } from 'react';
import getNoteImage from 'src/helpers/get-note-image';
import { useAppSelector } from 'src/store/hook';
import Modal from '../Modal';
import './styles.scss';

export interface PearlChestLockupSuccessModalProps {
  open: boolean;
  actionResult?: {
    user: string;
    note: string;
    tokenId: string;
    amount: string;
  };
  onClose: () => void;
}

export default function PearlChestLockupSuccessModal({
  open,
  actionResult,
  onClose,
}: PearlChestLockupSuccessModalProps) {
  const terms = useAppSelector(state => state.lake.terms);
  const allTerms = useMemo(() => terms.flatMap(t => [t, t.fallbackTerm || t]), [terms]);
  const note = useAppSelector(state =>
    state.lake.lockNotes.find(p => p.noteAddress === actionResult?.note && p.tokenId === actionResult?.tokenId),
  );
  const term = allTerms.find(term => term.noteAddress === actionResult?.note);

  if (!actionResult || !term) return <></>;

  return (
    <Modal title="Otter’standing!" open={open} onClose={onClose} contentClassName="lockup-success-modal__content">
      <>
        <Typography variant="h1" component="span" className="lockup-success-modal__message">
          Your Chest lock-up was successful.
        </Typography>
        {note ? (
          <img className="lockup-success-modal__receipt" src={note.imageUrl || getNoteImage(term.note.name)} />
        ) : (
          <CircularProgress />
        )}
        <Typography className="lockup-success-modal__message2">You got a {term.note.name}!</Typography>
        <Paper className="lockup-success-modal__details">
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Locked-up Amount</Typography>
            <Typography className="lockup-success-modal__value">{actionResult.amount} PEARL</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Lock-up Period</Typography>
            <Typography className="lockup-success-modal__value">{Number(term.lockPeriod)} Days</Typography>
          </div>
          <div className="lockup-success-modal__details-row">
            <Typography className="lockup-success-modal__label">Due Date</Typography>
            <Typography className="lockup-success-modal__value">
              {formateDate(addDays(new Date(), term.lockPeriod), 'MMM dd, yyyy HH:mm a (O)')}
            </Typography>
          </div>
        </Paper>
      </>
    </Modal>
  );
}
