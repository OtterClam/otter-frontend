import { Box, Modal, Paper, SvgIcon, IconButton, makeStyles } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import BondLogo from '../../components/BondLogo';
import { Bond } from 'src/constants';

import { prettifySeconds } from '../../helpers';

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
  bond: Bond;
  balance: number;
  reserveUnit: string;
  bondQuote: string;
  bondDiscount: string;
  autoStake: string;
  vestingTerm: number;
}

function BondPurchaseDialog({
  open,
  handleClose,
  bond,
  balance,
  reserveUnit,
  bondQuote,
  bondDiscount,
  autoStake,
  vestingTerm,
}: BondDialogProps) {
  const styles = useStyles();
  return (
    <Modal id="bdialog" open={open} onClose={handleClose} hideBackdrop>
      <Paper className={`${styles.modalContent} ohm-card ohm-popover`}>
        <div className="close-wrapper">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
        </div>

        <p className="title">Otter'standing!</p>
        <div className="msg">
          <h2>Your bond was successful.</h2>
        </div>
        <div className="icon-wrapper">
          <BondLogo bond={bond} />
        </div>
        <Box className={`${styles.inputGroup} card-content`}>
          <div className="rcv">
            You will get <span className="quantity">{bondQuote}</span> sCLAM
          </div>
          <div className="details">
            <div className="data-row">
              <p className="data-row-name">Your Balance</p>
              <p className="data-row-value">
                {balance} {reserveUnit}
              </p>
            </div>
            <div className="data-row">
              <p className="data-row-name">ROI</p>
              <p className="data-row-value">
                {bondDiscount}% + staking {autoStake}%
              </p>
            </div>
            <div className="data-row">
              <p className="data-row-name">Vesting Term</p>
              <p className="data-row-value">{prettifySeconds(vestingTerm, 'day')}</p>
            </div>
          </div>
        </Box>
      </Paper>
    </Modal>
  );
}

export default BondPurchaseDialog;
