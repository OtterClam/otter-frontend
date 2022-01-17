import { useState, SetStateAction, Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import BondLogo from '../../components/BondLogo';
import AdvancedSettings from './AdvancedSettings';
import { IconButton, SvgIcon } from '@material-ui/core';
import SettingsIcon from './SettingsIcon';
import { ReactComponent as XIcon } from '../../assets/icons/icon_close.svg';
import { useEscape } from '../../hooks';
import { Bond } from 'src/constants';

interface IBondHeaderProps {
  bond: Bond;
  slippage: number;
  recipientAddress: string;
  setBond: Dispatch<SetStateAction<Bond | undefined>>;
  onRecipientAddressChange: (e: any) => void;
  onSlippageChange: (e: any) => void;
}

function BondHeader({
  bond,
  slippage,
  recipientAddress,
  setBond,
  onRecipientAddressChange,
  onSlippageChange,
}: IBondHeaderProps) {
  const [open, setOpen] = useState(false);

  const handleSettingOpen = () => {
    setOpen(true);
  };

  const handleSettingClose = () => {
    setOpen(false);
  };

  let history = useHistory();
  const handleClose = () => {
    history.push('/bonds');
    setBond(undefined);
  };

  useEscape(() => {
    if (open) handleSettingClose;
    history.push('/bonds');
  });

  return (
    <div className="bond-header">
      <div className="cancel-bond" onClick={handleClose}>
        <SvgIcon color="primary" component={XIcon} />
      </div>

      <div className="bond-header-logo">
        <BondLogo bond={bond} />
        <div className="bond-header-name">
          <p>{bond.name}</p>
        </div>
      </div>

      <div className="bond-settings">
        <IconButton onClick={handleSettingOpen}>
          <SettingsIcon />
        </IconButton>
        <AdvancedSettings
          open={open}
          handleClose={handleSettingClose}
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
