import { useMemo } from 'react';
import { useAppSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';

import { Skeleton } from '@material-ui/lab';
import BondLogo from '../../../components/BondLogo';

import { Bond, Bonding, AccountBond } from 'src/constants';
import { NFTDiscountOption } from '../types';
import { trim, prettifySeconds } from '../../../helpers';

import BaseDialog from './BaseDialog';

interface Props {
  bond: Bond;
  selection: NFTDiscountOption;
  open: boolean;
  selectedBonding: Bonding;
  selectedAccountBond: AccountBond;
  onClose(): void;
}
const BondSuccessDialog = ({ bond, selection, selectedBonding, selectedAccountBond, open, onClose }: Props) => {
  const { t } = useTranslation();
  const { loading: isBondLoading, bondQuote, bondDiscount, vestingTerm } = selectedBonding;
  const { balance } = selectedAccountBond;

  return (
    <BaseDialog
      bond={bond}
      logoEl={<BondLogo bond={bond} size={96} />}
      action="bond"
      subtitle={
        <>
          {t('bonds.purchase.youWillGet')} <span className="highlight-text">{bondQuote}</span> sCLAM!
        </>
      }
      // TODO: to be translated: components.bondWithNftHint
      helperText={selection && 'This NFT will be locked into this bond until you redeem.'}
      renderRowDescription={
        selection &&
        ((selection: NFTDiscountOption) => <p className="selection-discount">{selection?.discount}% off</p>)
      }
      open={open}
      selections={selection && [selection]}
      onClose={onClose}
    >
      <BaseDialog.DetailRow title={t('common.yourBalance')}>
        {isBondLoading ? <Skeleton width="100px" /> : <>{`${trim(balance, 4)} ${bond.reserveUnit}`}</>}
      </BaseDialog.DetailRow>
      <BaseDialog.DetailRow title={t('common.roi')}>
        {isBondLoading ? (
          <Skeleton width="100px" />
        ) : (
          <>
            {trim(bondDiscount * 100, 2)}%{bond.autostake && `+ ${t('common.staking')}`}
          </>
        )}
      </BaseDialog.DetailRow>
      <BaseDialog.DetailRow title={t('bonds.vestingTerm')}>
        {prettifySeconds(t, vestingTerm, 'day')}
      </BaseDialog.DetailRow>
    </BaseDialog>
  );
};
export default BondSuccessDialog;
