import { Typography } from '@material-ui/core';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Bond } from 'src/constants';
import { getTokenImage } from 'src/helpers';
import { useAppSelector } from 'src/store/hook';
import { NFTDiscountOption } from '../types';
import BaseDialog from './BaseDialog';

interface BondDialogProps {
  bond: Bond;
  open: boolean;
  amount: number;
  onClose(): void;
  selections?: NFTDiscountOption[];
}

function RedeemSuccessDialog({ bond, open, onClose, selections, amount }: BondDialogProps) {
  const { t } = useTranslation();
  const balance = useAppSelector(state => state.account.balances.sClam);

  return (
    <BaseDialog
      bond={bond}
      logoEl={getTokenImage('sclam', 96)}
      action="bond"
      subtitle={
        <>
          {t('stake.youReceived')} <span className="highlight-text">{amount}</span> sCLAM!
        </>
      }
      renderRowDescription={(selection: NFTDiscountOption) => (
        <Typography variant="caption">
          The discount NFT is available until {format(new Date(selection.endDate), 'MMM do')}!
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
