import './dialog.scss';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { SvgIcon, IconButton } from '@material-ui/core';

interface Props {
  title: string;
  onClose(): void;
}
const DialogHeader = ({ title, onClose }: Props) => {
  return (
    <div className="dialog-header">
      <div>
        <IconButton onClick={onClose}>
          <SvgIcon color="primary" component={XIcon} />
        </IconButton>
      </div>
      <div className="dialog-title">
        <p>{title}</p>
      </div>
      <div className="plain-space" />
    </div>
  );
};
export default DialogHeader;
