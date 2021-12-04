import { Box } from '@material-ui/core';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';

interface ActionButton {
  pendingTransactions: IPendingTxn[];
  type: string;
  start: string;
  progress: string;
  processTx: any;
}

function ActionButton(props: ActionButton) {
  const { pendingTransactions, type, start, progress, processTx } = props;

  return (
    <Box
      className="stake-tab-panel-btn transaction-button app-otter-button"
      bgcolor="otter.otterBlue"
      onClick={() => {
        if (isPendingTxn(pendingTransactions, progress)) return;
        processTx();
      }}
    >
      <p>{txnButtonText(pendingTransactions, type, progress, start)}</p>
    </Box>
  );
}
export default ActionButton;
