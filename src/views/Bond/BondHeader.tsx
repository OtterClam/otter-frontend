import { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import BondLogo from '../../components/BondLogo';
import AdvancedSettings from './AdvancedSettings';
import { bondName } from '../../helpers';
import { IconButton, SvgIcon, Link } from '@material-ui/core';
import SettingsIcon from './SettingsIcon';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { useEscape } from '../../hooks';

interface IBondHeaderProps {
  bond: string;
  slippage: number;
  recipientAddress: string;
  onRecipientAddressChange: (e: any) => void;
  onSlippageChange: (e: any) => void;
}

function BondHeader({
  bond,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}: IBondHeaderProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  useEscape(() => {
    if (open) handleClose;
    else history.push('/bonds');
  });

  return (
    <div className="bond-header">
      <Link component={NavLink} to="/bonds" className="cancel-bond">
        <SvgIcon color="primary" component={XIcon} />
      </Link>

      <div className="bond-header-logo">
        <BondLogo bond={bond} />
        <div className="bond-header-name">
          <p>{bondName(bond)}</p>
        </div>
      </div>

      <div className="bond-settings">
        <IconButton onClick={handleOpen}>
          <SettingsIcon />
        </IconButton>
        <AdvancedSettings
          open={open}
          handleClose={handleClose}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        />
      </div>
    </div>
  );
}

export default BondHeader;
