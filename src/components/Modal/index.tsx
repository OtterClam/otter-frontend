import {
  Modal as MuiModal,
  ModalProps as MuiModalProps,
  Typography,
  Backdrop,
  Fade,
  Paper,
  useTheme,
  SvgIcon,
} from '@material-ui/core';
import { ReactComponent as CloseIcon } from '../../assets/icons/x.svg';
import './styles.scss';

export interface ModalProps extends Omit<MuiModalProps, 'onClose'> {
  title: string;
  onClose: () => void;
  contentClassName?: string;
}

export default function Modal({ title, children, contentClassName = '', ...restProps }: ModalProps) {
  const theme = useTheme();
  const contentStyle = {
    background: theme.palette.mode.lightGray100,
  };

  return (
    <MuiModal {...restProps} BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}>
      <Fade in={restProps.open}>
        <Paper style={contentStyle} className={'otter-modal__content ' + contentClassName}>
          <Typography component="button" className="otter-modal__close-btn" onClick={restProps.onClose}>
            <SvgIcon component={CloseIcon} color="primary" />
          </Typography>
          <Typography className="otter-modal__title" variant="h2" component="h2">
            {title}
          </Typography>
          <div className="otter-modal__body">{children}</div>
        </Paper>
      </Fade>
    </MuiModal>
  );
}
