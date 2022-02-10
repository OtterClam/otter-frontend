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
// export default (state = defaultState, action) => {
//   switch (action.type) {
//     case ENQUEUE_SNACKBAR:
//       return {
//         ...state,
//         notifications: [
//           ...state.notifications,
//           {
//             key: action.key,
//             ...action.notification,
//           },
//         ],
//       };

// case CLOSE_SNACKBAR:
//   return {
//     ...state,
//     notifications: state.notifications.map(notification =>
//       action.dismissAll || notification.key === action.key
//         ? { ...notification, dismissed: true }
//         : { ...notification },
//     ),
//   };

//     case REMOVE_SNACKBAR:
//       return {
//         ...state,
//         notifications: state.notifications.filter(notification => notification.key !== action.key),
//       };

//     default:
//       return state;
//   }
// };

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
  // extraReducers: builder => {
  //   builder
  //     .addCase(loadTermsDetails.pending, (state, action) => {
  //       state.loading = true;
  //     })
  //     .addCase(loadTermsDetails.fulfilled, (state, action) => {
  //       setAll(state, action.payload);
  //       state.loading = false;
  //     })
  //     .addCase(loadTermsDetails.rejected, (state, { error }) => {
  //       state.loading = false;
  //       console.log(error);
  //     })
  //     .addCase(updateAllowance, (state, action) => {
  //       state.allowance = action.payload;
  //     })
  //     .addCase(loadLockedNotes.fulfilled, (state, action) => {
  //       setAll(state, action.payload);
  //     })
  //     .addCase(loadLockedNotes.rejected, (state, { error }) => {
  //       console.log(error);
  //     });
  // },
});

const baseInfo = (state: { app: NotificationsSliceState }) => state.app;

export default notificationsSlice.reducer;

export const { enqueueSnackbar, closeSnackbar, removeSnackbar } = notificationsSlice.actions;

export const getOtterLakeState = createSelector(baseInfo, otterLake => otterLake);
