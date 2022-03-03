import { BigNumber, ethers } from 'ethers';
import { getAddresses } from '../../constants';
import {
  StakingHelperContract,
  OtterStakingPearlHelper,
  ClamTokenContract,
  StakedClamContract,
  StakingContract,
} from '../../abi';
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from './pending-txns-slice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccountSuccess, getBalances } from './account-slice';
import { JsonRpcProvider } from '@ethersproject/providers';
import SnackbarUtils from '../../store/snackbarUtils';
interface IChangeApproval {
  token: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeApproval = createAsyncThunk(
  'stake/changeApproval',
  async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, signer);
    const sCLAMContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, signer);

    let approveTx;
    let approvedPromise: Promise<BigNumber> = Promise.resolve(BigNumber.from(0));
    let allowance: number;

    try {
      if (token === 'CLAM') {
        approvedPromise = new Promise(resolve => {
          const event = clamContract.filters.Approval(address, addresses.STAKING_HELPER_ADDRESS);
          const action = (owner: string, allowance: BigNumber) => {
            clamContract.off(event, action);
            resolve(allowance);
          };
          clamContract.on(event, action);
        });
        approveTx = await clamContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256);
      } else if (token === 'sCLAM') {
        approveTx = await sCLAMContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256);

        approvedPromise = new Promise(resolve => {
          const event = sCLAMContract.filters.Approval(address, addresses.STAKING_ADDRESS);
          const action = (owner: string, spender: string, allowance: BigNumber) => {
            sCLAMContract.off(event, action);
            resolve(allowance);
          };
          sCLAMContract.on(event, action);
        });
      }

      const text = 'Approve ' + (token === 'CLAM' ? 'Staking' : 'Unstaking');
      const pendingTxnType = token === 'CLAM' ? 'approve_staking' : 'approve_unstaking';

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      allowance = +(await approvedPromise);
    } catch (error: any) {
      SnackbarUtils.error(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    if (token === 'CLAM') {
      return dispatch(
        fetchAccountSuccess({
          staking: {
            clamStake: allowance,
          },
        }),
      );
    } else {
      return dispatch(
        fetchAccountSuccess({
          staking: {
            sClamUnstake: allowance,
          },
        }),
      );
    }
  },
);

interface IApproveStakePayload {
  provider: JsonRpcProvider;
  address: string;
  chainID: number;
}

export const approveStake = createAsyncThunk(
  'stake/approveStake',
  async ({ provider, address, chainID }: IApproveStakePayload, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(chainID);
    const signer = provider.getSigner();
    const clamContract = new ethers.Contract(addresses.CLAM_ADDRESS, ClamTokenContract, signer);

    let approveTx;
    let allowance: number;

    try {
      const approvedPromise: Promise<BigNumber> = new Promise(resolve => {
        const event = clamContract.filters.Approval(address, addresses.STAKING_HELPER_ADDRESS);
        clamContract.once(event, (owner: string, allowance: BigNumber) => {
          resolve(allowance);
        });
      });
      approveTx = await clamContract.approve(addresses.STAKING_PEARL_HELPER_ADDRESS, ethers.constants.MaxUint256);

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text: 'Approve Staking', type: 'approve_staking' }));
      allowance = +(await approvedPromise);
    } catch (error: any) {
      SnackbarUtils.error(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
    return dispatch(
      fetchAccountSuccess({
        staking: {
          clamStake: allowance,
        },
      }),
    );
  },
);

interface IChangeStake {
  action: string;
  value: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeStake = createAsyncThunk(
  'stake/changeStake',
  async ({ action, value, provider, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;

    try {
      if (action === 'stake') {
        const number = ethers.utils.parseUnits(value, 'gwei');
        stakeTx = await stakingHelper.stake(number, address);
      } else {
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, 'gwei'), true);
      }
      const pendingTxnType = action === 'stake' ? 'staking' : 'unstaking';
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (error: any) {
      if (error.code === -32603) {
        //&& error.message.indexOf('ds-math-sub-underflow') >= 0
        SnackbarUtils.warning('errors.stakeBalance', true);
      } else if (error.code === 'INVALID_ARGUMENT') {
        SnackbarUtils.warning('bonds.purchase.invalidValue', true);
      } else {
        SnackbarUtils.error(error.message);
      }
      return;
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    if (stakeTx) {
      return true;
    }
  },
);

interface ClaimWarmupPayload {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const claimWarmup = createAsyncThunk(
  'stake/claimWarmup',
  async ({ provider, address, networkID }: ClaimWarmupPayload, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);

    let tx;
    try {
      tx = await staking.claim(address);
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: 'CLAIMING', type: 'claimWarmup' }));
      await tx.wait();
    } catch (error: any) {
      if (error.code === -32603) {
        alert('You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else {
        SnackbarUtils.error(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    return;
  },
);

export interface IStakeToPearlPayload {
  value: string;
  provider: JsonRpcProvider;
  address: string;
  chainID: number;
}

export const stakeToPearl = createAsyncThunk(
  'stake/stakeToPearl',
  async ({ value, provider, address, chainID }: IStakeToPearlPayload, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(chainID);
    const signer = provider.getSigner();
    const stakingHelper = new ethers.Contract(addresses.STAKING_PEARL_HELPER_ADDRESS, OtterStakingPearlHelper, signer);
    let tx;
    try {
      const number = ethers.utils.parseUnits(value, 9);
      tx = await stakingHelper.stake(number);
      const pendingTxnType = 'staking';
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: 'Staking', type: pendingTxnType }));
      await tx.wait();
    } catch (error: any) {
      if (error.code === -32603) {
        //&& error.message.indexOf('ds-math-sub-underflow') >= 0
        SnackbarUtils.warning('errors.stakeBalance', true);
      } else if (error.code === 'INVALID_ARGUMENT') {
        SnackbarUtils.warning('bonds.purchase.invalidValue', true);
      } else {
        SnackbarUtils.error(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(getBalances({ address, networkID: chainID, provider }));
    if (tx) {
      return true;
    }
  },
);

export const unstakeFromPearl = createAsyncThunk(
  'stake/unstakeFromPearl',
  async ({ value, provider, address, chainID }: IStakeToPearlPayload, { dispatch }) => {
    if (!provider) {
      SnackbarUtils.warning('errors.connectWallet', true);
      return;
    }
    const addresses = getAddresses(chainID);
    const signer = provider.getSigner();
    const stakingHelper = new ethers.Contract(addresses.STAKING_PEARL_HELPER_ADDRESS, OtterStakingPearlHelper, signer);

    let stakeTx;
    try {
      stakeTx = await stakingHelper.unstake(ethers.utils.parseUnits(value, 'gwei'));
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: 'Unstaking', type: 'unstaking' }));
      await stakeTx.wait();
    } catch (error: any) {
      if (error.code === -32603) {
        //&& error.message.indexOf('ds-math-sub-underflow') >= 0
        SnackbarUtils.warning('errors.stakeBalance', true);
      } else if (error.code === 'INVALID_ARGUMENT') {
        SnackbarUtils.warning('bonds.purchase.invalidValue', true);
      } else {
        SnackbarUtils.error(error.message);
      }
      return;
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID: chainID, provider }));
    if (stakeTx) {
      return true;
    }
  },
);
