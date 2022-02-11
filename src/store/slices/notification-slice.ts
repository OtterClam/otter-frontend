import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export interface NotificationsSliceState {
  notifications: Array<Notification>;
}

export interface Notification {
  message: string;
  options: {
    key: number;
    variant: string;
    action: (key: any) => JSX.Element;
  };
}

export const enqueueSnackbarThunk = createAsyncThunk(
  'notifications/enqueueSnackbar',
  async (notification: Notification, { dispatch }) => {
    const key = notification.options && notification.options.key;

    return {
      type: ENQUEUE_SNACKBAR,
      notification: {
        ...notification,
        key: key || new Date().getTime() + Math.random(),
      },
    };
  },
);

export const closeSnackbarThunk = createAsyncThunk('notifications/closeSnackbar', async (key: number, { dispatch }) => {
  return {
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  };
});

export const removeSnackbarThunk = createAsyncThunk(
  'notifications/removeSnackbar',
  async (key: number, { dispatch }) => {
    return {
      type: REMOVE_SNACKBAR,
      key,
    };
  },
);

const initialState: NotificationsSliceState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    enqueueSnackbar(state, action) {
      state.notifications = action.payload;
    },
    closeSnackbar(state, action) {
      state.notifications = state.notifications.map(notification =>
        action.payload.dismissAll || notification.options.key === action.payload.key
          ? { ...notification, dismissed: true }
          : { ...notification },
      );
    },
    removeSnackbar(state, action) {
      state.notifications.filter(notification => notification.options.key !== action.payload.key);
    },
  },
});

const baseInfo = (state: { app: NotificationsSliceState }) => state.app;

export default notificationsSlice.reducer;

export const { enqueueSnackbar, closeSnackbar, removeSnackbar } = notificationsSlice.actions;

export const getOtterLakeState = createSelector(baseInfo, otterLake => otterLake);
