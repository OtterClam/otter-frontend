import { format } from 'date-fns';

import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import BaseDialog from './BaseDialog';
import { getTokenImage } from 'src/helpers';

import { Bond, AccountBond } from 'src/constants';
import { NFTDiscountOption } from '../types';

interface BondDialogProps {
  bond: Bond;
  open: boolean;
  onClose(): void;
  selections: NFTDiscountOption[];
  selectedAccountBond: AccountBond;
}

function RedeemSuccessDialog({ bond, selections, selectedAccountBond, open, onClose }: BondDialogProps) {
  const { t } = useTranslation();
  return (
    <BaseDialog
      bond={bond}
      logoEl={getTokenImage('sclam', 96)}
      action="bond"
      subtitle={
        <>
          {t('stake.youReceived')} <span className="highlight-text">{selectedAccountBond.pendingPayout}</span> sCLAM!
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
      <BaseDialog.DetailRow title={t('calculator.yoursClamBalance')}>
        {selectedAccountBond.balance} sCLAM
      </BaseDialog.DetailRow>
    </BaseDialog>
  );
}

export default RedeemSuccessDialog;
