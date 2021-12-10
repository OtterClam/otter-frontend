import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, InputLabel, OutlinedInput, InputAdornment, Slide, FormControl, makeStyles } from '@material-ui/core';
import { shorten, trim, prettifySeconds } from '../../helpers';
import { changeApproval, bondAsset, calcBondDetails } from '../../store/slices/bond-slice';
import { useWeb3Context } from '../../hooks';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { Skeleton } from '@material-ui/lab';
import { IReduxState } from '../../store/slices/state.interface';
import { BondKey, getBond } from 'src/constants';
import { ethers } from 'ethers';
import { useTranslation } from 'react-i18next';
import BondPurchaseDialog from './BondPurchaseDialog';
import ActionButton from '../../components/Button/ActionButton';

const useStyles = makeStyles(theme => ({
  input: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'transparent',
      backgroundColor: theme.palette.background.paper,
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

interface IBondPurchaseProps {
  bondKey: BondKey;
  slippage: number;
}

function BondPurchase({ bondKey, slippage }: IBondPurchaseProps) {
  const styles = useStyles();
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const bond = getBond(bondKey, chainID);
  const [recipientAddress, setRecipientAddress] = useState(address);
  const [quantity, setQuantity] = useState('');

  const [open, setOpen] = useState(false);

  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const vestingTerm = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].vestingTerm;
  });

  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondDiscount;
  });
  const maxPayout = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].maxPayout;
  });
  const interestDue = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].interestDue;
  });
  const pendingPayout = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].pendingPayout;
  });
  const debtRatio = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].debtRatio;
  });
  const bondQuote = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondQuote;
  });
  const balance = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey]?.balance;
  });
  const rawBalance = useSelector<IReduxState, string>(state => {
    //@ts-ignore
    return state.account[bondKey]?.rawBalance;
  });
  const allowance = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].allowance;
  });
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });
  const { t } = useTranslation();
  const maxUserCanBuy = useSelector<IReduxState, string>(state => state.bonding[bondKey]?.maxUserCanBuy);
  const vestingPeriod = () => {
    return prettifySeconds(t, vestingTerm, 'day');
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  async function onBond() {
    if (quantity === '') {
      alert(t('bonds.purchase.noValue'));
      //@ts-ignore
    } else if (isNaN(quantity)) {
      alert(t('bonds.purchase.invalidValue'));
    } else if (interestDue > 0 || pendingPayout > 0) {
      const shouldProceed = window.confirm(
        bond.autostake ? t('bonds.purchase.resetVestingAutostake') : t('bonds.purchase.resetVesting'),
      );
      if (shouldProceed) {
        let bondTx: any = await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bondKey,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          }),
        );
        if (bondTx.payload == true) {
          handleOpenDialog();
        }
      }
    } else {
      let bondTx: any = await dispatch(
        //@ts-ignore
        bondAsset({
          value: quantity,
          slippage,
          bondKey,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
        }),
      );
      if (bondTx.payload == true) {
        handleOpenDialog();
      }
    }
  }

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);
  const setMax = () => {
    setQuantity(ethers.utils.formatEther(maxUserCanBuy));
  };
  const fiveDayRate = useSelector<IReduxState, number>(state => state.app.fiveDayRate);

  async function loadBondDetails() {
    if (provider)
      await dispatch(
        calcBondDetails({ bondKey, value: quantity, provider, networkID: chainID, userBalance: rawBalance }),
      );
  }

  useEffect(() => {
    loadBondDetails();
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address, rawBalance]);

  const onSeekApproval = async () => {
    await dispatch(changeApproval({ bondKey, provider, networkID: chainID, address }));
  };

  const bondUnit = bond.autostake ? 'sCLAM' : 'CLAM';

  return (
    <Box display="flex" flexDirection="column">
      <div className={`${styles.input} input-container`}>
        <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount"></InputLabel>
          <OutlinedInput
            placeholder={`${bond.reserveUnit} ${t('common.amount')}`}
            id="outlined-adornment-amount"
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            labelWidth={0}
            className="bond-input"
            endAdornment={
              <InputAdornment position="end">
                <div className="stake-input-btn" onClick={setMax}>
                  <p>{t('common.max')}</p>
                </div>
              </InputAdornment>
            }
          />
        </FormControl>
        {hasAllowance() ? (
          <ActionButton
            pendingTransactions={pendingTransactions}
            type={'bond_' + bond.key}
            start="Bond"
            progress="Bonding..."
            processTx={() => onBond()}
          ></ActionButton>
        ) : (
          <ActionButton
            pendingTransactions={pendingTransactions}
            type={'approve_' + bond.key}
            start="Approve"
            progress="Approving..."
            processTx={() => onSeekApproval()}
          ></ActionButton>
        )}
        <BondPurchaseDialog
          open={open}
          handleClose={handleCloseDialog}
          bond={bond}
          balance={trim(balance, 4)}
          reserveUnit={bond.reserveUnit}
          bondQuote={trim(bondQuote, 4) || '0'}
          bondDiscount={trim(bondDiscount * 100, 2)}
          autoStake={trim(fiveDayRate * 100, 2)}
          vestingTerm={vestingTerm}
        />
      </div>
      {hasAllowance() ? (
        bond.autostake && (
          <div className="help-text">
            <p className="help-text-desc">{t('bonds.purchase.fourFourInfo')}</p>
          </div>
        )
      ) : (
        <div className="help-text">
          <p className="help-text-desc"></p>
        </div>
      )}

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <p className="bond-balance-title">{t('common.yourBalance')}</p>
            <p className="bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : <>{`${trim(balance, 4)} ${bond.reserveUnit}`}</>}
            </p>
          </div>

          <div className={`data-row`}>
            <p className="bond-balance-title">{t('bonds.purchase.youWillGet')}</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondQuote, 4) || '0'} ${bondUnit}`}
            </p>
          </div>

          <div className={`data-row`}>
            <p className="bond-balance-title">{t('bonds.purchase.maxBuy')}</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(maxPayout, 4) || '0'} ${bondUnit}`}
            </p>
          </div>

          <div className="data-row">
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

          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.debtRatio')}</p>
            <p className="bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">{t('bonds.vestingTerm')}</p>
            <p className="bond-balance-value">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
          </div>

          {recipientAddress !== address && (
            <div className="data-row">
              <p className="bond-balance-title">{t('bonds.recipient')}</p>
              <p className="bond-balance-value">
                {isBondLoading ? <Skeleton width="100px" /> : shorten(recipientAddress)}
              </p>
            </div>
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
