import { ethers } from 'ethers';
import { getAddresses } from '../../constants';
import { ClamTokenContract, ClamTokenMigrator, StakedClamContract, StakingContract } from '../../abi';
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from './pending-txns-slice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAccountSuccess, getBalances, loadAccountDetails } from './account-slice';
import { JsonRpcProvider } from '@ethersproject/providers';
import { loadAppDetails } from './app-slice';

interface IChangeApproval {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const approveUnstaking = createAsyncThunk(
  'migration/approve-unstaking',
  async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const sCLAMContract = new ethers.Contract(addresses.OLD_SCLAM_ADDRESS, StakedClamContract, signer);

    let approveTx;
    try {
      approveTx = await sCLAMContract.approve(addresses.OLD_STAKING_ADDRESS, ethers.constants.MaxUint256);

      const text = 'Approve Unstaking';
      const pendingTxnType = 'approve_unstaking';

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (error: any) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const sCLAMAllowance = await sCLAMContract.allowance(address, addresses.OLD_STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        migration: {
          sCLAMAllowance: +sCLAMAllowance,
        },
      }),
    );
  },
);

export const approveMigration = createAsyncThunk(
  'migration/approve-migration',
  async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const clamContract = new ethers.Contract(addresses.OLD_CLAM_ADDRESS, ClamTokenContract, signer);

    let approveTx;
    try {
      approveTx = await clamContract.approve(addresses.MIGRATOR, ethers.constants.MaxUint256);

      const text = 'Approve Migration';
      const pendingTxnType = 'approve_migration';

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (error: any) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const clamAllowance = await clamContract.allowance(address, addresses.MIGRATOR);

    return dispatch(
      fetchAccountSuccess({
        migration: {
          clamAllowance: +clamAllowance,
        },
      }),
    );
  },
);

export interface MigrateAction {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const migrate = createAsyncThunk(
  'migration/migrate',
  async ({ provider, address, networkID }: MigrateAction, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const migrator = new ethers.Contract(addresses.MIGRATOR, ClamTokenMigrator, signer);

    let tx;
    try {
      tx = await migrator.migrate();
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: 'Migrating', type: 'migrating' }));
      await tx.wait();
    } catch (error: any) {
      alert(error.message);
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(loadAccountDetails({ address, networkID, provider }));
    dispatch(loadAppDetails({ networkID, provider }));
  },
);

interface UnstakeAction {
  value: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const unstake = createAsyncThunk(
  'migration/unstake',
  async ({ value, provider, address, networkID }: UnstakeAction, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.OLD_STAKING_ADDRESS, StakingContract, signer);

    let tx;

    try {
      tx = await staking.unstake(ethers.utils.parseUnits(value, 'gwei'), false);
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: getStakingTypeText('unstake'), type: 'unstaking' }));
      await tx.wait();
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(loadAccountDetails({ address, networkID, provider }));
  },
);

interface ClaimWarmupPayload {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const claimWarmup = createAsyncThunk(
  'migration/claimWarmup',
  async ({ provider, address, networkID }: ClaimWarmupPayload, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.OLD_STAKING_ADDRESS, StakingContract, signer);

    let tx;
    try {
      tx = await staking.claim(address);
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: 'CLAIMING', type: 'claimWarmup' }));
      await tx.wait();
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(loadAccountDetails({ address, networkID, provider }));
  },
);

export const clearWarmup = createAsyncThunk(
  'migration/clear-warmup',
  async ({ provider, address, networkID }: ClaimWarmupPayload, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.OLD_STAKING_ADDRESS, StakingContract, signer);

    let tx;
    try {
      tx = await staking.claim(address);
      dispatch(fetchPendingTxns({ txnHash: tx.hash, text: 'CLAIMING', type: 'claimWarmup' }));
      await tx.wait();
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (tx) {
        dispatch(clearPendingTxn(tx.hash));
      }
    }
    dispatch(loadAccountDetails({ address, networkID, provider }));
  },
);
