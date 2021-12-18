import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slices/account-slice';
import bondingReducer from './slices/bond-slice';
import appReducer from './slices/app-slice';
import pendingTransactionsReducer from './slices/pending-txns-slice';
import whitelistReducer from './slices/whitelist-slice';
import ido from './slices/ido-slice';
import migrate from './slices/migrate-slice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    whitelist: whitelistReducer,
    ido,
    migrate,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
