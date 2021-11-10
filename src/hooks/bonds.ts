import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import orderBy from 'lodash/orderBy';
import { IReduxState } from '../store/slices/state.interface';
import { BONDS } from 'src/constants';

export const makeBondsArray = (
  maiBondDiscount?: string | number,
  maiClamBondDiscount?: string | number,
  maiClamBondV2Discount?: string | number,
) => {
  return [
    {
      name: 'MAI',
      value: BONDS.mai,
      discount: Number(maiBondDiscount),
    },
    {
      name: 'CLAM-MAI LP(Legacy)',
      value: BONDS.mai_clam,
      discount: 0,
    },
    {
      name: 'CLAM-MAI LP',
      value: BONDS.mai_clam_v2,
      discount: Number(maiClamBondV2Discount),
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

  const maiClamV2Discount = useSelector<IReduxState, number>(state => {
    return state.bonding[BONDS.mai_clam_v2] && state.bonding[BONDS.mai_clam_v2].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(maiBondDiscount, maiClamDiscount, maiClamV2Discount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [maiBondDiscount, maiClamDiscount, maiClamV2Discount]);

  return bonds;
};
