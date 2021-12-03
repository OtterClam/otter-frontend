import { Box, Modal, Paper, SvgIcon, IconButton, makeStyles } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { getTokenImage } from '../../helpers';

import './stakeDialog.scss';

const useStyles = makeStyles(theme => ({
  modalContent: {
    backgroundColor: theme.palette.mode.lightGray100,
  },
  inputGroup: {
    '& .MuiOutlinedInput-root': {
      borderColor: theme.palette.mode.lightGray300,
      backgroundColor: theme.palette.background.default,
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

interface StakeDialogProps {
  open: boolean;
  handleClose: () => void;
  quantity: string;
  stakingRebasePercentage: any;
  balance: string;
  stakeBalance: string;
  nextRewardValue: string;
  action: string;
}

function StakeDialog({
  open,
  handleClose,
  quantity,
  stakingRebasePercentage,
  balance,
  stakeBalance,
  nextRewardValue,
  action,
}: StakeDialogProps) {
  const styles = useStyles();
  return (
    <Modal id="sdialog" open={open} onClose={handleClose} hideBackdrop>
      <Paper className={`${styles.modalContent} ohm-card ohm-popover`}>
        <div className="close-wrapper">
          <IconButton className="btn-close" onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
        </div>
        <div className="title">Otter'standing!</div>
        <div className="msg">
          <h2>Your {action === `stake` ? 'stake' : 'unstake'} was successful.</h2>
        </div>
        <div className="icon-wrapper">{action === `stake` ? getTokenImage('sclam') : getTokenImage('clam')}</div>
        <Box className={`${styles.inputGroup} card-content`}>
          {action === `stake` ? (
            <div className="rcv">
              You will get <span className="quantity">{quantity}</span> sClam!
            </div>
          ) : (
            <div className="rcv">
              You just received <span className="quantity">{quantity}</span> CLAM!
            </div>
          )}
          <div className="details">
            <div className="data-row">
              <p className="data-row-name">Your Balance</p>
              <p className="data-row-value">{balance} CLAM</p>
            </div>
            <div className="data-row">
              <p className="data-row-name">Your Staked Balance</p>
              <p className="data-row-value">{stakeBalance} sCLAM2</p>
            </div>
            {action === `stake` ? (
              <div>
                <div className="data-row">
                  <p className="data-row-name">Next Reward Amount</p>
                  <p className="data-row-value">{nextRewardValue} sCLAM2</p>
                </div>
                <div className="data-row">
                  <p className="data-row-name">Next Reward Yield</p>
                  <p className="data-row-value">{stakingRebasePercentage}%</p>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Box>
      </Paper>
    </Modal>
  );
}

export default StakeDialog;
