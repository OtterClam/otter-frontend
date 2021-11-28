import { Box, Link, Paper, Slide, TableCell, TableRow, Tooltip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { LabelChip, Status, StatusChip } from 'src/components/Chip';
import { BondKey, getBond } from 'src/constants';
import BondLogo from '../../components/BondLogo';
import { priceUnits, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { IReduxState } from '../../store/slices/state.interface';
import './choose-bond.scss';

interface IBondProps {
  bondKey: BondKey;
}

export function BondDataCard({ bondKey }: IBondProps) {
  const { chainID } = useWeb3Context();
  const bond = getBond(bondKey, chainID);

  const isBondLoading = useSelector<IReduxState, boolean>(state => !state.bonding[bondKey]?.bondPrice ?? true);
  const bondPrice = useSelector<IReduxState, number | undefined>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondPrice;
  });
  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondDiscount;
  });
  const bondPurchased = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].purchased;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => state.app.fiveDayRate);

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
        <div className="bond-pair">
          <BondLogo bond={bond} />
          <div className="bond-name">
            <p className="bond-name-title">{bond.name}</p>
            {!bond.deprecated && (
              <div>
                <Link href={bond.dexUrl} target="_blank">
                  <Box component="p" color="otter.otterBlue" className="bond-lp-add-liquidity">
                    {bond.type === 'lp' ? 'Add Liquidity' : `Buy ${bond.reserveUnit}`}
                  </Box>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Price</p>
          <p className="bond-price bond-name-title">
            <>
              {priceUnits(bondKey)}{' '}
              {isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : trim(bondPrice, 2)}
            </>
          </p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">ROI</p>
          <p className="bond-name-title">
            {isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : `${trim(bondDiscount * 100, 2)}%`}
            {!bond.deprecated && bond.autostake && (
              <Tooltip title="* The ROI of (4,4) bond includes 5-days staking reward ">
                <span>{` + ${trim(fiveDayRate * 100, 2)}%*`}</span>
              </Tooltip>
            )}
          </p>
        </div>

        <div className="data-row">
          <p className="bond-name-title">Purchased</p>
          <p className="bond-name-title">
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : bond.deprecated ? (
              '-'
            ) : (
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bondPurchased)
            )}
          </p>
        </div>
        <Link component={NavLink} to={`/bonds/${bondKey}`}>
          <Box
            bgcolor="otter.otterBlue"
            color="otter.white"
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="44px"
            className="bond-table-btn"
          >
            <p>
              {bond.deprecated ? 'Redeem' : 'Bond'} {bond.name}
            </p>
          </Box>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableRow({ bondKey }: IBondProps) {
  const { chainID } = useWeb3Context();
  // Use BondPrice as indicator of loading.
  const isBondLoading = useSelector<IReduxState, boolean>(state => !state.bonding[bondKey]?.bondPrice ?? true);
  const bond = getBond(bondKey, chainID);

  const bondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondPrice;
  });
  const bondDiscount = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondDiscount;
  });
  const bondPurchased = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].purchased;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => state.app.fiveDayRate);
  const marketPrice = useSelector<IReduxState, number | undefined>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].marketPrice;
  });
  const myBalance = useSelector<IReduxState, number>(state => {
    //@ts-ignore
    return state.account[bondKey] && state.account[bondKey].interestDue;
  });
  const priceDiff = (marketPrice ?? 0) - (bondPrice ?? 0);

  return (
    <TableRow id={`${bondKey}--bond`}>
      <TableCell align="left">
        <div className="bond-name-cell">
          <BondLogo bond={bond} />
          <div className="bond-name">
            {bond.deprecated && <LabelChip label="Deprecated" className="bond-name-label" />}
            <p className="bond-name-title">{bond.name}</p>
            {!bond.deprecated && (
              <Link color="primary" href={bond.dexUrl} target="_blank">
                <Box component="p" color="otter.otterBlue" className="bond-lp-add-liquidity">
                  {bond.type === 'lp' ? 'Add Liquidity' : `Buy ${bond.reserveUnit}`}
                </Box>
              </Link>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <div className="bond-name-container">
          <p className="bond-name-title">
            <span className="currency-icon">{priceUnits(bondKey)}</span>
            <span>{isBondLoading ? <Skeleton width="50px" /> : bond.deprecated ? '-' : trim(bondPrice, 2)}</span>
          </p>
          {priceDiff > 0 && <StatusChip status={Status.Success} label={`$${trim(priceDiff, 2)} discount!`} />}
        </div>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">
          {isBondLoading ? <Skeleton /> : bond.deprecated ? '-' : `${trim(bondDiscount * 100, 2)}%`}
          {!bond.deprecated && bond.autostake && (
            <Tooltip title="* The ROI of (4,4) bond includes 5-days staking reward ">
              <span>{` + ${trim(fiveDayRate * 100, 2)}%*`}</span>
            </Tooltip>
          )}
        </p>
      </TableCell>
      <TableCell align="right">
        <p className="bond-name-title">
          {isBondLoading ? (
            <Skeleton />
          ) : bond.deprecated ? (
            '-'
          ) : (
            new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(bondPurchased)
          )}
        </p>
      </TableCell>
      <TableCell>
        <p className="bond-name-title">
          {myBalance ? `${trim(myBalance, 2)} ${bond.autostake ? 'sCLAM' : 'CLAM'}` : '-'}
        </p>
      </TableCell>
      <TableCell>
        <div className="bond-table-actions">
          {!bond.deprecated && (
            <Link className="bond-table-action-button" component={NavLink} to={`/bonds/${bondKey}?action=bond`}>
              <Box
                bgcolor="otter.otterBlue"
                color="otter.white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="44px"
                className="bond-table-btn"
              >
                <p>Bond</p>
              </Box>
            </Link>
          )}
          <Link className="bond-table-action-button" component={NavLink} to={`/bonds/${bondKey}?action=redeem`}>
            <Box
              color="otter.otterBlue"
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="44px"
              className="bond-table-btn bond-table-btn__redeem"
            >
              <p>Redeem</p>
            </Box>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
