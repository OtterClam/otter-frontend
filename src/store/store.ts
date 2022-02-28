import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './slices/account-slice';
import bondingReducer from './slices/bond-slice';
import appReducer from './slices/app-slice';
import otterLakeReducer from './slices/otter-lake-slice';
import pendingTransactionsReducer from './slices/pending-txns-slice';
import whitelistReducer from './slices/whitelist-slice';
import migrate from './slices/migrate-slice';
import nftGiveaway from './slices/nft-giveaway-slice';
import nftReducer from './slices/nft-slice';

const store = configureStore({
  reducer: {
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    whitelist: whitelistReducer,
    lake: otterLakeReducer,
    migrate,
    nftGiveaway,
    nft: nftReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
