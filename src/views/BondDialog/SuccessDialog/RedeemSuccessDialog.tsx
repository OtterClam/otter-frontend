import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import BaseDialog from './BaseDialog';
import { getTokenImage } from 'src/helpers';

import { Bond } from 'src/constants';
import { NFTDiscountOption } from '../types';

interface AccountRedeem {
  balance: string;
  pendingPayout: string;
}

interface BondDialogProps extends AccountRedeem {
  bond: Bond;
  open: boolean;
  onClose(): void;
  selections: NFTDiscountOption[];
}

function RedeemSuccessDialog({ bond, selections, open, onClose, balance, pendingPayout }: BondDialogProps) {
  const { t } = useTranslation();
  return (
    <BaseDialog
      bond={bond}
      logoEl={getTokenImage('sclam', 96)}
      action="bond"
      subtitle={
        <>
          {t('stake.youReceived')} <span className="highlight-text">{pendingPayout}</span> sCLAM!
        </>
      }
      renderRowDescription={(selection: NFTDiscountOption) => (
        <Typography variant="caption">
          The discount NFT is available until {format(selection.endDate, 'MMM do')}!
        </Typography>
      )}
      open={open}
      selections={selections}
      onClose={onClose}
    >
      <BaseDialog.DetailRow title={t('calculator.yoursClamBalance')}>{balance} sCLAM</BaseDialog.DetailRow>
    </BaseDialog>
  );
}

export default RedeemSuccessDialog;
