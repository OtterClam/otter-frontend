import {
  Typography,
  Box,
  Modal,
  Paper,
  SvgIcon,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  makeStyles,
} from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import './bondSettings.scss';
import { useTranslation } from 'react-i18next';

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

interface IAdvancedSettingsProps {
  open: boolean;
  handleClose: () => void;
  slippage: number;
  recipientAddress: string;
  onRecipientAddressChange: (e: any) => void;
  onSlippageChange: (e: any) => void;
}

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}: IAdvancedSettingsProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <Modal id="hades" open={open} onClose={handleClose} hideBackdrop>
      <Paper className={`${styles.modalContent} ohm-card ohm-popover`}>
        <div className="cross-wrap">
          <IconButton onClick={handleClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
        </div>

        <p className="hades-title">Settings</p>

        <Box className={`${styles.inputGroup} card-content`}>
          <InputLabel htmlFor="slippage">
            <p className="input-label">Slippage</p>
          </InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              id="slippage"
              value={slippage}
              onChange={onSlippageChange}
              fullWidth
              type="number"
              //@ts-ignore
              max="100"
              min="100"
              className="bond-input"
              endAdornment={
                <InputAdornment position="end">
                  <p className="percent">%</p>
                </InputAdornment>
              }
            />
            <div className="help-text">
              <p className="text-bond-desc">{t('bonds.advancedSettings.txrevert')}</p>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient">
            <p className="input-label">Recipient Address</p>
          </InputLabel>
          <FormControl variant="outlined" color="primary" fullWidth>
            <OutlinedInput
              className="bond-input"
              id="recipient"
              value={recipientAddress}
              onChange={onRecipientAddressChange}
              type="text"
            />
            <div className="help-text">
              <p className="text-bond-desc">{t('bonds.advancedSettings.recipientAddress')}</p>
            </div>
          </FormControl>
        </Box>
      </Paper>
    </Modal>
  );
}

export default AdvancedSettings;
