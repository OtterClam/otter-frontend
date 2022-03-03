import { Modal, Paper, SvgIcon, IconButton, makeStyles, Grid } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { getTokenImage, trim } from '../../helpers';
import { useTranslation } from 'react-i18next';
import WrapGif from './sClam_to_Pearl.gif';
import UnwrapGif from './Pearl_to_sClam.gif';

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
  index: number;
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
  index,
  handleClose,
  quantity,
  stakingRebasePercentage,
  balance,
  stakeBalance,
  nextRewardValue,
  action,
}: StakeDialogProps) {
  const { t } = useTranslation();
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
              <span>{action === `stake` ? t('stake.stakeSuccessful') : t('stake.unstakeSuccessful')} </span>
            </div>
            <div className="logo-wrapper">
              {action === `stake` ? <img src={WrapGif} style={{ width: 200, height: 200 }} /> : getTokenImage('clam')}
            </div>
            <div className="amt-msg">
              {action === `stake` ? (
                <div className="rcv">
                  {t('bonds.purchase.youWillGet')}
                  <span className="quantity">{trim(Number(quantity) / index, 4)}</span> PEARL!
                </div>
              ) : (
                <div className="rcv">
                  {t('stake.youReceived')} <span className="quantity">{quantity}</span> CLAM!
                </div>
              )}
            </div>
            <div className="dtl-container">
              <div className={`${styles.detailContent} dtl-wrap`}>
                <Grid container className="dtl">
                  <Grid item xs={6} md={6}>
                    <div>{t('common.yourBalance')}</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{balance} CLAM</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>{t('stake.stakedBalance')}</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{trim(Number(stakeBalance) / index, 4)} PEARL</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>{t('stake.nextRewardAmount')}</div>
                  </Grid>
                  <Grid item xs={6} md={6} className="dtl-value">
                    <div>{nextRewardValue} CLAM</div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <div>{t('stake.nextRewardYield')}</div>
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
