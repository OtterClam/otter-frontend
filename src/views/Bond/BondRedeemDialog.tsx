import { Box, Modal, Paper, SvgIcon, IconButton, makeStyles } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { getTokenImage } from '../../helpers';

import './bondDialog.scss';

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

interface BondDialogProps {
  open: boolean;
  handleClose: () => void;
  balance: number;
  pendingPayout: string;
}

function BondRedeemDialog({ open, handleClose, balance, pendingPayout }: BondDialogProps) {
  const styles = useStyles();
  return (
    <Modal id="bdialog" open={open} onClose={handleClose} hideBackdrop>
      <Paper className={`${styles.modalContent} ohm-card ohm-popover`}>
        <div className="close-wrapper">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
        </div>
        <div className="title">Otter'standing!</div>
        <div className="msg">
          <h2>Your redeem was successful.</h2>
        </div>
        <div className="icon-wrapper">{getTokenImage('clam')}</div>
        <Box className={`${styles.inputGroup} card-content`}>
          <div className="rcv">
            You just received <span className="quantity">{pendingPayout}</span> CLAM!
          </div>
          <div className="details">
            <div className="data-row">
              <p className="data-row-name">Your CLAM Balance</p>
              <p className="data-row-value">{balance} CLAM</p>
            </div>
          </div>
        </Box>
      </Paper>
    </Modal>
  );
}

export default BondRedeemDialog;
