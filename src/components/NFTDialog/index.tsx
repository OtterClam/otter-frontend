import { IconButton, makeStyles, Modal, SvgIcon } from '@material-ui/core';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import './nftDialog.scss';
import { ReactComponent as Star } from './Star.svg';

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

interface NFTDialogProps {
  open: boolean;
  handleClose: () => void;
  image: any;
  name: string;
}

function NFTDialog({ open, handleClose, name, image }: NFTDialogProps) {
  return (
    <Modal className="nft-dialog" open={open} onClose={handleClose} hideBackdrop>
      <div className="nft-dialog__container">
        <Star className="nft-dialog__bg" />
        <div className="nft-dialog__fg">
          <div className="close-button">
            <IconButton onClick={handleClose}>
              <SvgIcon color="primary" component={XIcon} />
            </IconButton>
          </div>
          <img src={image}></img>
          <p className="nft-dialog__title">Otter’standing!</p>
          <div>
            <span className="nft-dialog__desc">You got the </span>
            <span className="nft-dialog__name">{name}</span>
            <span className="nft-dialog__desc"> NFT</span>
          </div>
          <p className="nft-dialog__note">The NFT will be in your wallet after the transaction is finished.</p>
        </div>
      </div>
    </Modal>
  );
}

export default NFTDialog;
