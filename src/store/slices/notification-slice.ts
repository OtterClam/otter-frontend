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

export const enqueueSnackbar = createAsyncThunk(
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

export const closeSnackbar = createAsyncThunk('notifications/closeSnackbar', async (key: number, { dispatch }) => {
  return {
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
  };
});

export const removeSnackbar = createAsyncThunk('notifications/removeSnackbar', async (key: number, { dispatch }) => {
  return {
    type: REMOVE_SNACKBAR,
    key,
  };
});

const initialState: Array<Notification> = [];

export default (state = defaultState, action) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          action.dismissAll || notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification },
        ),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.key !== action.key),
      };

    default:
      return state;
  }
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    selectTerm(state, action) {
      state.selectedTerm = action.payload;
    },
    updateAllowance(state, action) {
      state.allowance = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadTermsDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadTermsDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadTermsDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(updateAllowance, (state, action) => {
        state.allowance = action.payload;
      })
      .addCase(loadLockedNotes.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(loadLockedNotes.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

const baseInfo = (state: { app: IOtterLakeSliceState }) => state.app;

export default otterLakeSlice.reducer;

export const { selectTerm } = otterLakeSlice.actions;

export const getOtterLakeState = createSelector(baseInfo, otterLake => otterLake);
