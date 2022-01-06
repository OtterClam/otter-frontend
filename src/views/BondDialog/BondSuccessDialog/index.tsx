import { useMemo } from 'react';
import { useSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';

import './successDialog.scss';
import { Box, Typography, Divider } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import Dialog from 'src/components/Dialog/Dialog';
import CustomButton from '../../../components/Button/CustomButton';

import BondLogo from '../../../components/BondLogo';
import NFTDisplayRow from './NFTDisplayRow';

import { Bond } from 'src/constants';
import { OtterNft } from '../BondNFTDiscountDialog/type';
import { trim, prettifySeconds } from '../../../helpers';

const DialogTitle = () => {
  return (
    <Box>
      <Typography className="success-subtitle" variant="h6" align="center">
        Otter'standing!
      </Typography>
      <Typography className="success-title" variant="h3" align="center">
        Your bond Was Successful
      </Typography>
    </Box>
  );
};

interface Props {
  bond: Bond;
  open: boolean;
  setOpen: (value: boolean) => void;
}
const BondSuccessDialog = ({ bond, open, setOpen }: Props) => {
  const { t } = useTranslation();

  const fiveDayRate = useSelector(state => state.app.fiveDayRate);
  const { loading: isBondLoading, bondDiscount, balance, vestingTerm } = useSelector(state => state.bonding[bond.key]);
  const vestingPeriod = useMemo(() => {
    return prettifySeconds(t, vestingTerm, 'day');
  }, [t, vestingTerm]);

  return (
    <Dialog className="success-dialog" title={() => <DialogTitle />} open={open} onClose={() => setOpen(false)}>
      <Box className="bond-logo">
        <BondLogo bond={bond} size={96} />
      </Box>
      <Box className="success-subtitle">
        You will get <span className="highlight-text">123</span> CLAM!
      </Box>
      <NFTDisplayRow selection={OtterNft.DiamondHandOtter} />
      <Typography variant="caption" color="secondary" className="helper-text">
        This NFT will be locked into this bond until you redeem.
      </Typography>
      <Divider className="divider" />
      <Box className="bond-detail" bgcolor="otter.white">
        <div className="detail-row">
          <p className="bond-balance-title">{t('common.yourBalance')}</p>
          <p className="bond-balance-value">
            {isBondLoading ? <Skeleton width="100px" /> : <>{`${trim(balance, 4)} ${bond.reserveUnit}`}</>}
          </p>
        </div>

        <div className="detail-row">
          <p className="bond-balance-title">{t('common.roi')}</p>
          <p className="bond-balance-value">
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              <>
                {trim(bondDiscount * 100, 2)}%{bond.autostake && `+ staking ${trim(fiveDayRate * 100, 2)}%`}
              </>
            )}
          </p>
        </div>

        <div className="detail-row">
          <p className="bond-balance-title">{t('bonds.vestingTerm')}</p>
          <p className="bond-balance-value">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod}</p>
        </div>
      </Box>
      <CustomButton
        text="Otterstood"
        color="otter.white"
        bgcolor="otter.otterBlue"
        style={{ maxWidth: '314px', margin: 'auto' }}
        onClick={() => setOpen(false)}
      />
    </Dialog>
  );
};
export default BondSuccessDialog;
