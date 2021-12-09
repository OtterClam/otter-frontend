import { Backdrop, Box, Fade, Grid, Paper, Tab, Tabs } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Status, StatusChip } from 'src/components/Chip';
import { Bond as BondType, BondAction, BondKey, getBond } from 'src/constants';
import TabPanel from '../../components/TabPanel';
import { trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { IReduxState } from '../../store/slices/state.interface';
import './bond.scss';
import BondHeader from './BondHeader';
import BondPurchase from './BondPurchase';
import BondRedeem from './BondRedeem';
import { useTranslation } from 'react-i18next';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface IBondProps {
  bondKey: BondKey;
}

function Bond({ bondKey }: IBondProps) {
  const { provider, address, chainID } = useWeb3Context();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [quantity, setQuantity] = useState();

  const bond = useMemo(() => getBond(bondKey, chainID), [bondKey, chainID]);
  const [view, setView] = useState(0);
  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const marketPrice = useSelector<IReduxState, string>(state => state.bonding[bondKey]?.marketPrice);
  const bondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondPrice;
  });
  const priceDiff = (Number(marketPrice) ?? 0) - (bondPrice ?? 0);
  const onRecipientAddressChange = (e: any) => {
    return setRecipientAddress(e.target.value);
  };
  const onSlippageChange = (e: any) => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  useActionEffect(bond, action => {
    setView(bond.deprecated || action === BondAction.Bond ? 0 : 1);
  });

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };
  const { t } = useTranslation();

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid container id="bond-view">
        <Backdrop open={true}>
          <Fade in={true}>
            <Paper className="ohm-card ohm-modal bond-modal">
              <BondHeader
                bond={bond}
                slippage={slippage}
                recipientAddress={recipientAddress}
                onSlippageChange={onSlippageChange}
                onRecipientAddressChange={onRecipientAddressChange}
              />
              {!bond.deprecated && (
                <Box className="bond-price-data-row">
                  <div className="bond-price-data">
                    <p className="bond-price-data-title">{t('bonds.bondPrice')}</p>
                    <Box component="p" color="text.secondary" className="bond-price-data-value">
                      {isBondLoading ? (
                        <Skeleton />
                      ) : bond.deprecated ? (
                        '-'
                      ) : bond.type === 'lp' ? (
                        `$${trim(bondPrice, 2)}`
                      ) : (
                        `${trim(bondPrice, 2)} ${bond.reserveUnit}`
                      )}
                    </Box>
                    {priceDiff > 0 && (
                      <StatusChip status={Status.Success} label={`$${trim(priceDiff, 2)} ${t('bonds.bondDiscount')}`} />
                    )}
                  </div>
                  <div className="bond-price-data">
                    <p className="bond-price-data-title">{t('common.clamPrice')}</p>
                    <Box component="p" color="text.secondary" className="bond-price-data-value">
                      {isBondLoading ? <Skeleton /> : `$${trim(marketPrice, 2)}`}
                    </Box>
                  </div>
                </Box>
              )}

              <Tabs
                centered
                value={view}
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="bond-one-table"
              >
                {!bond.deprecated && <Tab value={0} label="Bond" {...a11yProps(0)} />}
                <Tab value={bond.deprecated ? 0 : 1} label="Redeem" {...a11yProps(1)} />
              </Tabs>

              {!bond.deprecated && (
                <TabPanel value={view} index={0}>
                  <BondPurchase bondKey={bondKey} slippage={slippage} />
                </TabPanel>
              )}

              <TabPanel value={view} index={bond.deprecated ? 0 : 1}>
                <BondRedeem bondKey={bondKey} />
              </TabPanel>
            </Paper>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

function useActionEffect(bond: BondType, cb: (action: BondAction) => void) {
  const location = useLocation();
  const query = new URLSearchParams(location.search.substr(1));
  let action = query.get('action');

  if (action !== BondAction.Bond && action !== BondAction.Redeem) {
    action = bond.deprecated ? BondAction.Redeem : BondAction.Bond;
  }

  useEffect(() => {
    cb(action as BondAction);
  }, [action]);
}

export default Bond;
