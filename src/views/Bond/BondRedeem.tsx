import { Box, Slide } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { prettifySeconds, prettyVestingPeriod, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { redeemBond } from '../../store/slices/bond-slice';
import { IPendingTxn, isPendingTxn, txnButtonText } from '../../store/slices/pending-txns-slice';
import { IReduxState } from '../../store/slices/state.interface';

interface IBondRedeem {
  bond: string;
}

function BondRedeem({ bond }: IBondRedeem) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const currentBlockTime = useSelector<IReduxState, number>(state => {
    return state.app.currentBlockTime;
  });

  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const bondMaturationTime = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].bondMaturationTime;
  });

  const vestingTerm = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].vestingTerm;
  });

  const interestDue = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].interestDue;
  });

  const pendingPayout = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bond] && state.account[bond].pendingPayout;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  async function onRedeem(autostake: boolean) {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlockTime, bondMaturationTime);
  };

  const vestingPeriod = () => {
    return prettifySeconds(vestingTerm, 'day');
  };

  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });

  const debtRatio = useSelector<IReduxState, number>(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <Box
          className="transaction-button app-otter-button"
          bgcolor="otter.otterBlue"
          color="otter.white"
          onClick={() => {
            if (isPendingTxn(pendingTransactions, 'redeem_bond_' + bond)) return;
            onRedeem(false);
          }}
        >
          <p>{txnButtonText(pendingTransactions, 'redeem_bond_' + bond, 'Claim')}</p>
        </Box>
        <Box
          className="transaction-button app-otter-button"
          bgcolor="otter.otterBlue"
          color="otter.white"
          onClick={() => {
            if (isPendingTxn(pendingTransactions, 'redeem_bond_' + bond + '_autostake')) return;
            onRedeem(true);
          }}
        >
          <p>{txnButtonText(pendingTransactions, 'redeem_bond_' + bond + '_autostake', 'Claim and Autostake')}</p>
        </Box>
      </Box>

      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <p className="bond-balance-title">Pending Rewards</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(interestDue, 4)} CLAM`}
            </p>
          </div>
          <div className="data-row">
            <p className="bond-balance-title">Claimable Rewards</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(pendingPayout, 4)} CLAM`}
            </p>
          </div>
          <div className="data-row">
            <p className="bond-balance-title">Time until fully vested</p>
            <p className="price-data bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : vestingTime()}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">ROI</p>
            <p className="bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Debt Ratio</p>
            <p className="bond-balance-value">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}
            </p>
          </div>

          <div className="data-row">
            <p className="bond-balance-title">Vesting Term</p>
            <p className="bond-balance-value">{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</p>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
