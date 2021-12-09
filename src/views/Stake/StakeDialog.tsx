import { Modal, Paper, SvgIcon, IconButton, makeStyles, Grid } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { getTokenImage } from '../../helpers';
import StakeGif from './stake.gif';

import './stakeDialog.scss';

const useStyles = makeStyles(theme => ({
  modalContent: {
    backgroundColor: theme.palette.mode.lightGray100,
  },
  detailContent: {
    backgroundColor: theme.palette.mode.white,
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
      <Paper className={`${styles.modalContent} clam-popover`}>
        <div className="dialog-wrap">
          <div className="header">
            <div className="close-wrapper">
              <IconButton onClick={handleClose}>
                <SvgIcon color="primary" component={XIcon} />
              </IconButton>
            </div>
            <div className="title">
              <p>Otter'standing!</p>
            </div>
          </div>

          <div className="body">
            <div className="confirm">
              <span>Your {action === `stake` ? 'stake' : 'unstake'} was successful.</span>
            </div>
            <div className="logo-wrapper">
              {action === `stake` ? <img src={StakeGif} style={{ width: 200, height: 200 }} /> : getTokenImage('clam')}
            </div>
            <div className="amt-msg">
              {action === `stake` ? (
                <div className="rcv">
                  You will get <span className="quantity">{quantity}</span> sCLAM2!
                </div>
              ) : (
                <div className="rcv">
                  You just received <span className="quantity">{quantity}</span> CLAM2!
                </div>
              )}
            </div>
            <div className="dtl-container">
              <div className={`${styles.detailContent} dtl-wrap`}>
                <Grid container className="dtl">
                  <Grid item xs={6} md={6}>
                    <div>Your Balance</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{balance} CLAM2</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>Your Staked Balance</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{stakeBalance} sCLAM2</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>Next Reward Amount</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{nextRewardValue} sCLAM2</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>Next Reward Yield</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{stakingRebasePercentage}%</div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </Modal>
  );
}

export default StakeDialog;
