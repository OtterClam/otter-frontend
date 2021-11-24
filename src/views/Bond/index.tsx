import { Backdrop, Box, Fade, Grid, Paper, Tab, Tabs } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { BondKey, getBond } from 'src/constants';
import TabPanel from '../../components/TabPanel';
import { trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { IReduxState } from '../../store/slices/state.interface';
import './bond.scss';
import BondHeader from './BondHeader';
import BondPurchase from './BondPurchase';
import BondRedeem from './BondRedeem';

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

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const bond = useMemo(() => getBond(bondKey, chainID), [bondKey, chainID]);
  const isBondLoading = useSelector<IReduxState, boolean>(state => state.bonding.loading ?? true);
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].marketPrice;
  });
  const bondPrice = useSelector<IReduxState, number>(state => {
    return state.bonding[bondKey] && state.bonding[bondKey].bondPrice;
  });
  const onRecipientAddressChange = (e: any) => {
    return setRecipientAddress(e.target.value);
  };
  const onSlippageChange = (e: any) => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const changeView = (event: any, newView: number) => {
    setView(newView);
  };

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
              {/* @ts-ignore */}
              <Box direction="row" className="bond-price-data-row">
                <div className="bond-price-data">
                  <p className="bond-price-data-title">Bond Price</p>
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
                </div>
                <div className="bond-price-data">
                  <p className="bond-price-data-title">CLAM Price</p>
                  <Box component="p" color="text.secondary" className="bond-price-data-value">
                    {isBondLoading ? <Skeleton /> : `$${trim(marketPrice, 2)}`}
                  </Box>
                </div>
              </Box>

              <Tabs
                centered
                value={view}
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="bond-one-table"
              >
                {!bond.deprecated && <Tab label="Bond" {...a11yProps(0)} />}
                <Tab label="Redeem" {...a11yProps(1)} />
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

export default Bond;
