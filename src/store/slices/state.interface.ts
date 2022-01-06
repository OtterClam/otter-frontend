import { IPendingTxn } from './pending-txns-slice';
import { IAccount } from './account-slice';
import { IApp } from './app-slice';
import { IBond } from './bond-slice';
import { IWhitelist } from './whitelist-slice';
import { IDOState } from './ido-slice';
import { MigrationState } from './migrate-slice';
import { IPearlVaultSliceState } from './pearl-vault-slice';

export interface IReduxState {
  pendingTransactions: IPendingTxn[];
  account: IAccount;
  app: IApp;
  bonding: IBond;
  whitelist: IWhitelist;
  ido: IDOState;
  migrate: MigrationState;
  pearlVault: IPearlVaultSliceState;
}
