import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

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

const defaultState = {
  notifications: [],
};

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
