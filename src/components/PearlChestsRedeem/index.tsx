import { Divider, Paper, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { LabelChip } from '../Chip';
import { getTokenImage, formatCurrency, trim, formatApy } from 'src/helpers';
import formatDate from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';
import './styles.scss';
import CustomButton from '../Button/CustomButton';
import { useSelector } from 'src/store/hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector as useReduxSelector } from 'react-redux';
import {
  redeem as redeemAction,
  claimReward as claimRewardAction,
  extendLock as extendLockAction,
  claimAndLock as claimAndLockAction,
  ITerm,
  ILockNote,
  selectTerm as selectTermAction,
  loadLockedNotes,
} from 'src/store/slices/otter-lake-slice';
import { useWeb3Context } from 'src/hooks';
import ActionButton from '../Button/ActionButton';
import { IPendingTxn } from 'src/store/slices/pending-txns-slice';
import { IReduxState } from 'src/store/slices/state.interface';
import PearlChestLockupModal from '../PearlChestLockupModal';
import PearlChestLockupSuccessModal from '../PearlChestLockupSuccessModal';
import { addDays } from 'date-fns';
import getNoteImage from 'src/helpers/get-note-image';
import AddPearlToNoteModal from '../AddPearlToNodeModal';

const numberFormatter = Intl.NumberFormat('en', { maximumFractionDigits: 4 });
const percentageFormatter = Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });

const extraBonus: { [k: number]: number } = {
  28: 5,
  90: 10,
  180: 20,
};

export interface Note {
  id: string;
  lockedValue: number;
  marketValue: number;
  lockupPeriod: number;
  dueDate: Date;
  apy: number;
  locked: boolean;
}

export default function PearlChestsRedeem() {
  const [relockResult, setRelockResult] = useState<any>();
  const [selectedTerm, setSelectedTerm] = useState<ITerm | null>(null);
  const [selectedLockNote, setSelectedLock] = useState<ILockNote | null>(null);
  const dispatch = useDispatch();
  const { chainID, connected, address, provider } = useWeb3Context();
  const currentEpoch = useSelector(state => state.app.currentEpoch);
  const lockNotes = useSelector(state => state.lake.lockNotes);
  const terms = useSelector(state => state.lake.terms);
  const pearlPrice = useSelector(state => state.app.pearlPrice);
  const termsMap = useMemo(() => {
    return new Map(
      terms
        .flatMap(term => [term, term.fallbackTerm])
        .filter(Boolean)
        .map(term => [term?.noteAddress, term]),
    );
  }, [terms]);

  const clearSelectedTerm = useCallback(() => {
    setSelectedTerm(null);
  }, []);

  const addPearlToNote = useCallback((term, lockNote) => {
    setSelectedTerm(term);
    setSelectedLock(lockNote);
  }, []);

  const handleRelockSuccessEvent = useCallback(
    (result: any) => {
      clearSelectedTerm();
      setRelockResult(result);
    },
    [relockResult],
  );

  useEffect(() => {
    if (connected && terms.length > 0) {
      dispatch(loadLockedNotes({ address, chainID, provider }));
    }
  }, [connected, address, terms]);

  return (
    <Paper className="ohm-card">
      {lockNotes.map((lockNote, i) => {
        const term = termsMap.get(lockNote.noteAddress)!;
        return (
          <NoteCard
            key={i}
            term={term}
            lockNote={lockNote}
            addPearlToNote={addPearlToNote}
            note={{
              id: lockNote.tokenId,
              lockedValue: -1,
              marketValue: (Number(lockNote.amount) + lockNote.nextReward) * pearlPrice,
              lockupPeriod: term.lockPeriod,
              dueDate: addDays(Date.UTC(2021, 10, 3, 0, 0, 0), lockNote.endEpoch / 3),
              apy: 492391,
              locked: currentEpoch < lockNote.endEpoch,
            }}
          />
        );
      })}
      <AddPearlToNoteModal
        discount={extraBonus[Number(selectedTerm?.lockPeriod) ?? 0] ?? 0}
        open={Boolean(selectedTerm)}
        term={selectedTerm}
        lockNote={selectedLockNote}
        onClose={clearSelectedTerm}
        onSuccess={handleRelockSuccessEvent}
      />
      <PearlChestLockupSuccessModal
        open={Boolean(relockResult)}
        actionResult={relockResult}
        onClose={() => setRelockResult(undefined)}
      />
    </Paper>
  );
}

function NoteCard({
  note,
  term,
  lockNote,
  addPearlToNote,
}: {
  note: Note;
  term: ITerm;
  lockNote: ILockNote;
  addPearlToNote: (term: ITerm, lockNote: ILockNote) => void;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const pendingTransactions = useReduxSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });
  const details = [
    {
      label: 'pearlChests.lockupAmount',
      after: <span className="note__pearl-icon">{getTokenImage('pearl', 20)}</span>,
      value: numberFormatter.format(lockNote.amount),
    },
    { label: 'pearlChests.currentReward', value: numberFormatter.format(lockNote.reward) + ' PEARL' },
    {
      label: 'pearlChests.nextReward',
      value: numberFormatter.format(lockNote.nextReward) + ' PEARL',
      params: { boost: (term.multiplier / 100).toFixed(2) },
    },
    {
      label: 'pearlChests.rewardRate',
      value: percentageFormatter.format(lockNote.rewardRate),
    },
    // { label: 'pearlChests.lockedValue', value: numberFormatter.format(note.lockedValue) + ' PEARL' },
    { label: 'pearlChests.marketValue', value: formatCurrency(note.marketValue) },
    {
      label: 'pearlChests.lockupPeriod',
      value: note.lockupPeriod,
      after: <span className="note__countdown">{differenceInDays(note.dueDate, new Date())} days left</span>,
    },
    {
      label: 'pearlChests.dueDate',
      value: formatDate(note.dueDate, 'MMMM d, Y, hh:mm a (O)'),
    },
    // { label: 'pearlChests.apy', value: numberFormatter.format(term.apy) + '%' },
  ];

  const redeem = useCallback(() => {
    dispatch(
      redeemAction({
        address,
        chainID,
        provider,
        noteAddress: lockNote.noteAddress,
        tokenId: lockNote.tokenId,
      }),
    );
  }, [lockNote, address]);

  const claimReward = useCallback(() => {
    dispatch(
      claimRewardAction({
        chainID,
        provider,
        noteAddress: lockNote.noteAddress,
        tokenId: lockNote.tokenId,
        address,
      }),
    );
  }, [lockNote, address]);
  const claimAndLock = useCallback(() => {
    dispatch(
      claimAndLockAction({
        chainID,
        provider,
        noteAddress: lockNote.noteAddress,
        tokenId: lockNote.tokenId,
        address,
      }),
    );
  }, [lockNote, address]);

  return (
    <div className="note">
      <Typography className="note__title" variant="h3" component="h3">
        {term.note.name}
        <LockStatus locked={note.locked} />
        <span className="note__id">{note.id}</span>
      </Typography>

      <div className="note__body">
        <div className="note__receipt-image">
          <img src={lockNote.imageUrl || getNoteImage(term.note.name)} />
        </div>
        <Divider className="note__div" flexItem orientation="vertical" />
        <div className="note__details">
          {details.map(row => (
            <div key={row.label} className="note__details-row">
              <span className="note__details-label">{t(row.label, row.params)}</span>
              <span className="note__details-value">
                {row.value}
                {row.after}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="note__actions">
        {note.locked && (
          <>
            <ActionButton
              pendingTransactions={pendingTransactions}
              type={'extend-lock_' + term.noteAddress + '_' + lockNote.tokenId}
              start={t('pearlChests.addPearl')}
              progress="Processing..."
              processTx={() => addPearlToNote(term, lockNote)}
              wrapper={({ onClick, text }) => <CustomButton className="note__action" text={text} onClick={onClick} />}
            />
            {lockNote.reward > 0 && (
              <ActionButton
                pendingTransactions={pendingTransactions}
                type={'relock_' + term.noteAddress + '_' + lockNote.tokenId}
                start={t('pearlChests.claimRewardAndRelock', { amount: numberFormatter.format(lockNote.reward) })}
                progress="Processing..."
                processTx={claimAndLock}
                wrapper={({ onClick, text }) => <CustomButton className="note__action" text={text} onClick={onClick} />}
              />
            )}
            <ActionButton
              pendingTransactions={pendingTransactions}
              type={'claim-reward_' + term.noteAddress + '_' + lockNote.tokenId}
              start={t('pearlChests.claimReward')}
              progress="Processing..."
              processTx={claimReward}
              wrapper={({ onClick, text }) => (
                <CustomButton className="note__action" type="outline" text={text} onClick={onClick} />
              )}
            />
          </>
        )}
        {!note.locked && (
          <ActionButton
            pendingTransactions={pendingTransactions}
            type={'redeem_' + term.noteAddress + '_' + lockNote.tokenId}
            start={t('pearlChests.redeemAll')}
            progress="Processing..."
            processTx={redeem}
            wrapper={({ onClick, text }) => <CustomButton className="note__action" text={text} onClick={onClick} />}
          />
        )}
      </div>
    </div>
  );
}

function LockStatus({ locked }: { locked?: boolean }) {
  const { t } = useTranslation();
  const label = locked ? t('pearlChests.locked') : t('pearlChests.unlocked');
  const className = locked ? 'note__lock-status' : 'note__lock-status note__lock-status--unlocked';
  return <LabelChip className={className} label={label} />;
}
