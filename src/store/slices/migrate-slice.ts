import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import _ from 'lodash';
import { contractForReserve } from 'src/helpers';
import { ClamTokenContract, ClamTokenMigrator, StakedClamContract, StakingContract } from '../../abi';
import { getAddresses } from '../../constants';
import { fetchAccountSuccess } from './account-slice';
import { loadAppDetails } from './app-slice';
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from './pending-txns-slice';
import SnackbarUtils from '../../store/snackbarUtils';

interface IChangeApproval {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

interface IState {
  [key: string]: any;
}

const initialState: IState = {
  loading: true,
};

export interface MigrationState extends IState {
  oldClam: string;
  oldSClam: string;
  oldWarmup: string;
  canClaimWarmup: boolean;
  clamAllowance: number;
  sCLAMAllowance: number;
  oldClamTotalSupply: number;
  oldTreasuryBalance: number;
  migrateProgress: number;
}

export interface LoadMigrationActionPayload {
  address: string;
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadMigrationDetails = createAsyncThunk(
  'migration/loadMigrationDetails',
  async ({ networkID, provider, address }: LoadMigrationActionPayload): Promise<MigrationState> => {
    const addresses = getAddresses(networkID);
    const oldClamContract = new ethers.Contract(addresses.OLD_CLAM_ADDRESS, ClamTokenContract, provider);
    const oldSClamContract = new ethers.Contract(addresses.OLD_SCLAM_ADDRESS, StakedClamContract, provider);
    const oldStakingContract = new ethers.Contract(addresses.OLD_STAKING_ADDRESS, StakingContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const migrator = new ethers.Contract(addresses.MIGRATOR, ClamTokenMigrator, provider);
    const mai = contractForReserve('mai44', networkID, provider);

    const [oldClamBalance, oldSClamBalance, oldWarmup, oldSClamAllowance, clamMigratorAllowance, epoch] =
      await Promise.all([
        oldClamContract.balanceOf(address),
        oldSClamContract.balanceOf(address),
        oldStakingContract.warmupInfo(address),
        oldSClamContract.allowance(address, addresses.OLD_STAKING_ADDRESS),
        oldClamContract.allowance(address, addresses.MIGRATOR),
        stakingContract.epoch(),
      ]);
    const oldClamTotalSupply = (await oldClamContract.totalSupply()) / 1e9;
    const oldTreasuryBalance = (await mai.balanceOf(addresses.OLD_TREASURY)) / 1e18;
    const oldTotalSupply = (await migrator.oldSupply()) / 1e9;
    const migrateProgress = 1 - oldClamTotalSupply / oldTotalSupply;

    const oldGons = oldWarmup[1];
    const oldWarmupBalance = await oldSClamContract.balanceForGons(oldGons);

    return {
      oldClam: ethers.utils.formatUnits(oldClamBalance, 9),
      oldSClam: ethers.utils.formatUnits(oldSClamBalance, 9),
      oldWarmup: ethers.utils.formatUnits(oldWarmupBalance, 9),
      canClaimWarmup: oldWarmup[0].gt(0) && epoch[1].gte(oldWarmup[2]),
      sCLAMAllowance: +oldSClamAllowance,
      clamAllowance: +clamMigratorAllowance,
      oldClamTotalSupply,
      oldTreasuryBalance,
      migrateProgress,
    };
  },
);

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
    dispatch(loadMigrationDetails({ address, networkID, provider }));
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
    dispatch(loadMigrationDetails({ address, networkID, provider }));
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
    dispatch(loadMigrationDetails({ address, networkID, provider }));
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
    dispatch(loadMigrationDetails({ address, networkID, provider }));
  },
);

const migrateSlice = createSlice({
  name: 'migrate',
  initialState,
  reducers: {
    fetchMigrationSuccess(state, action) {
      _.merge(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMigrationDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadMigrationDetails.fulfilled, (state, action) => {
        _.merge(state, action.payload);
        state.loading = false;
      })
      .addCase(loadMigrationDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default migrateSlice.reducer;

export const { fetchMigrationSuccess } = migrateSlice.actions;

const baseInfo = (state: { migrate: MigrationState }) => state.migrate;

export const getMigrationState = createSelector(baseInfo, migrate => migrate);
