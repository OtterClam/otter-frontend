import orderBy from 'lodash/orderBy';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BondKey, getBond } from 'src/constants';
import { IBond } from 'src/store/slices/bond-slice';
import { useWeb3Context } from '.';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (bondings: IBond, chainId: number) => {
  return Object.keys(bondings)
    .filter(k => k !== 'loading')
    .map(key => {
      const bond = getBond(key as BondKey, chainId);
      return {
        name: bond.name,
        value: key as BondKey,
        discount: Number(bondings[key as BondKey].bondDiscount),
        deprecated: bond.deprecated,
      };
    });
};

export const useBonds = () => {
  const { chainID } = useWeb3Context();
  const bondings = useSelector<IReduxState, IBond>(state => state.bonding);
  const [bonds, setBonds] = useState(makeBondsArray(bondings, chainID));

  useEffect(() => {
    const bondValues = makeBondsArray(bondings, chainID);
    const mostProfitableBonds = orderBy(bondValues, ['deprecated', 'name'], ['asc', 'desc']);
    setBonds(mostProfitableBonds);
  }, [bondings]);

  return bonds;
};
