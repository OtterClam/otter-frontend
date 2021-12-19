import { JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ethers } from 'ethers';
import { PearlTokenContract, StakedClamContract } from 'src/abi';
import { getAddresses } from 'src/constants';
import { fetchAccountSuccess, wrap, unwrap } from './account-slice';
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from './pending-txns-slice';

interface ApproveWrappingProps {
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const approveWrapping = createAsyncThunk(
  'wrap/approve',
  async ({ provider, address, networkID }: ApproveWrappingProps, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const sCLAMContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, signer);

    let approveTx;
    let approvedPromise: Promise<BigNumber> = Promise.resolve(BigNumber.from(0));
    let allowance: number;

    try {
      approvedPromise = new Promise(resolve => {
        const event = sCLAMContract.filters.Approval(address, addresses.PEARL_ADDRESS);
        const action = (owner: string, allowance: BigNumber) => {
          sCLAMContract.off(event, action);
          resolve(allowance);
        };
        sCLAMContract.on(event, action);
      });
      approveTx = await sCLAMContract.approve(addresses.PEARL_ADDRESS, ethers.constants.MaxUint256);

      const text = 'Approve Wrapping';
      const pendingTxnType = 'approve_wrapping';

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      allowance = +(await approvedPromise);
    } catch (error: any) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          sClamWrap: allowance,
        },
      }),
    );
  },
);

interface ChangeWrapProps {
  action: string;
  value: string;
  provider: JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeWrap = createAsyncThunk(
  'wrap/changeWrap',
  async ({ action, value, provider, address, networkID }: ChangeWrapProps, { dispatch }) => {
    if (!provider) {
      alert('Please connect your wallet!');
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const pearlContract = new ethers.Contract(addresses.PEARL_ADDRESS, PearlTokenContract, signer);
    const sClamContract = new ethers.Contract(addresses.sCLAM_ADDRESS, StakedClamContract, signer);

    let wrapTx;
    let transferPromise;
    let resolvedAmount, inputValue;

    try {
      if (action === 'wrap') {
        transferPromise = new Promise(resolve => {
          const event = pearlContract.filters.Transfer(addresses.PEARL_ADDRESS, address);
          const action = (from: string, to: string, amount: BigNumber) => {
            pearlContract.off(event, action);
            resolve(amount);
          };
          pearlContract.on(event, action);
        });
        inputValue = ethers.utils.parseUnits(value, 'gwei');
        wrapTx = await pearlContract.wrap(inputValue);
      } else {
        transferPromise = new Promise(resolve => {
          const event = sClamContract.filters.Transfer(addresses.PEARL_ADDRESS, address);
          const action = (from: string, to: string, amount: BigNumber) => {
            sClamContract.off(event, action);
            resolve(amount);
          };
          sClamContract.on(event, action);
        });
        inputValue = ethers.utils.parseEther(value);
        wrapTx = await pearlContract.unwrap(inputValue);
      }
      const pendingTxnType = action === 'wrap' ? 'wrapping' : 'unwrapping';
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
      await wrapTx.wait();
      resolvedAmount = await transferPromise;
    } catch (error: any) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert('You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow');
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (wrapTx) {
        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
    if (action === 'wrap') {
      dispatch(wrap({ pearl: resolvedAmount, sClam: inputValue }));
    } else {
      dispatch(unwrap({ pearl: inputValue, sClam: resolvedAmount }));
    }
    if (wrapTx) {
      return true;
    }
  },
);
