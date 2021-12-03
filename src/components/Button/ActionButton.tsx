import { Box } from '@material-ui/core';
import { isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import Loading from '../Loader';

function ActionButton(props: any) {
  const { pendingTransactions, type, start, progress, processTx, nonRedeem } = props;

  // return <Loading />;
  return (
    <Box
      className="stake-tab-panel-btn transaction-button app-otter-button"
      bgcolor="otter.otterBlue"
      onClick={() => {
        if (nonRedeem) {
          window.alert('You can only claim (4,4) bond after it fully vested.');
          return;
        }
        if (isPendingTxn(pendingTransactions, progress)) return;
        processTx();
      }}
    >
      <p>{txnButtonText(pendingTransactions, type, progress, start)}</p>
    </Box>
  );
}
export default ActionButton;
