import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';

export const makeBondsArray = (maiBondDiscount?: string | number, maiClamBondDiscount?: string | number) => {
  return [
    {
      name: 'MAI',
      value: 'mai',
      discount: Number(maiBondDiscount),
    },
    {
      name: 'CLAM-MAI LP',
      value: 'mai_clam_lp',
      discount: Number(maiClamBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

export const useBonds = () => {
  const maiBondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['mai'] && state.bonding['mai'].bondDiscount;
  });

  const maiClamDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding['mai_clam_lp'] && state.bonding['mai_clam_lp'].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(maiBondDiscount, maiClamDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [maiBondDiscount, maiClamDiscount]);

  return bonds;
};
