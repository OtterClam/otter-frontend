import { Box, BoxProps } from '@material-ui/core';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';

import './button.scss';
interface ActionButtonProps extends BoxProps {
  className?: string;
  pendingTransactions: IPendingTxn[];
  type: string;
  start: string;
  progress: string;
  processTx: any;
  wrapper?: (props: { onClick: () => void; text: string }) => JSX.Element;
}

function ActionButton(props: ActionButtonProps) {
  const { pendingTransactions, type, start, progress, processTx, wrapper, className = '', ...boxProps } = props;

  const text = txnButtonText(pendingTransactions, type, progress, start);

  const handleClick = () => {
    if (isPendingTxn(pendingTransactions, progress)) return;
    processTx();
  };

  if (wrapper) {
    return wrapper({
      onClick: handleClick,
      text,
    });
  }

  return (
    <Box
      className="action-button wrap-tab-panel-btn stake-tab-panel-btn"
      bgcolor="otter.otterBlue"
      onClick={handleClick}
      {...boxProps}
    >
      <p>{text}</p>
    </Box>
  );
}
export default ActionButton;
