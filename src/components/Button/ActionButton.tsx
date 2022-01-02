import { Box, BoxProps } from '@material-ui/core';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';

interface ActionButtonProps extends BoxProps {
  className?: string;
  pendingTransactions: IPendingTxn[];
  type: string;
  start: string;
  progress: string;
  processTx: any;
}

function ActionButton(props: ActionButtonProps) {
  const { pendingTransactions, type, start, progress, processTx, className = '', ...boxProps } = props;

  return (
    <Box
      className={
        'wrap-tab-panel-btn stake-tab-panel-btn transaction-button app-otter-button nft-card__button ' + className
      }
      bgcolor="otter.otterBlue"
      onClick={() => {
        if (isPendingTxn(pendingTransactions, progress)) return;
        processTx();
      }}
      {...boxProps}
    >
      <p>{txnButtonText(pendingTransactions, type, progress, start)}</p>
    </Box>
  );
}
export default ActionButton;
