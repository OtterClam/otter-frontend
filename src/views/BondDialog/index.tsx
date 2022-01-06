import { useEffect, useState, useRef, SetStateAction, Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';

import { parse } from 'query-string';

import { Backdrop, Box, Divider, Fade, Grid, Paper, Tab, Tabs, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Status, StatusChip } from 'src/components/Chip';
import TabPanel from '../../components/TabPanel';
import BondHeader from './BondHeader';
import BondPurchase from './BondPurchase';
import BondRedeem from './BondRedeem';
import './bond.scss';

import { Bond as BondType, BondAction } from 'src/constants';
import { OtterNft } from './BondNFTDiscountDialog/type';
import { formatCurrency, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { checkBondAction } from '../ChooseBond/utils';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyle = makeStyles(theme => {
  return {
    modal: {
      backgroundColor: theme.palette.mode.lightGray100,
    },
  };
});

interface IBondProps {
  bond: BondType;
  canSelect: boolean;
  selection?: OtterNft;
  setBond: Dispatch<SetStateAction<BondType | undefined>>;
  setSelection: Dispatch<SetStateAction<OtterNft | undefined>>;
  setNftDialogOpen: Dispatch<SetStateAction<boolean>>;
}

function BondDialog({ bond, canSelect, selection, setBond, setSelection, setNftDialogOpen }: IBondProps) {
  const { t } = useTranslation();
  const style = useStyle();
  const { provider, address } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading);
  const marketPrice = useSelector(state => state.bonding[bond.key])?.marketPrice;
  const bondPrice = useSelector(state => state.bonding[bond.key])?.bondPrice;
  const priceDiff = (Number(marketPrice) ?? 0) - (bondPrice ?? 0);

  const [recipientAddress, setRecipientAddress] = useState(address);
  const onRecipientAddressChange = (e: any) => {
    return setRecipientAddress(e.target.value);
  };

  const [slippage, setSlippage] = useState(0.5);
  const onSlippageChange = (e: any) => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, address]);

  const history = useHistory();
  const { location } = history;
  const search = location.search;
  const query = parse(search).action as string;
  const defaultTab: BondAction = checkBondAction(query) ? query : BondAction.Bond;
  const currentTab = useRef<BondAction | undefined>(defaultTab);

  const changeView = (_e: any, newView: BondAction) => {
    currentTab.current = newView;
    history.push(`/bonds/${bond.key}?action=${newView}`);
  };

  useEffect(() => {
    if (bond.deprecated) {
      history.push({ pathname: `${history.location.pathname}?action=${BondAction.Redeem}` });
    }
  }, []);

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Backdrop id="bond-view" open={!!bond}>
        <Fade in={true}>
          <Paper className={`${style.modal} ohm-card ohm-modal bond-modal`}>
            <BondHeader
              bond={bond}
              setBond={setBond}
              slippage={slippage}
              recipientAddress={recipientAddress}
              onSlippageChange={onSlippageChange}
              onRecipientAddressChange={onRecipientAddressChange}
            />
            {!bond.deprecated && (
              <Grid container justifyContent="space-evenly" className="bond-price-data-row">
                <Grid item xs={5} className="bond-price-data">
                  <Box className="bond-price-data-title" component="p" color="text.disabled">
                    {t('bonds.bondPrice')}
                  </Box>
                  <Box className="bond-price-data-value market-price" component="span" color="secondary.light">
                    {formatCurrency(+marketPrice, 2)}
                  </Box>
                  <Box className="bond-price-data-value" component="span" color="text.secondary">
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
                    <Box component="div">
                      <StatusChip status={Status.Success} label={`$${trim(priceDiff, 2)} ${t('bonds.bondDiscount')}`} />
                    </Box>
                  )}
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={5} className="bond-price-data">
                  <Box className="bond-price-data-title" component="p" color="text.disabled">
                    {t('common.clamPrice')}
                  </Box>
                  <Box component="p" color="text.secondary" className="bond-price-data-value">
                    {isBondLoading ? <Skeleton /> : `$${trim(marketPrice, 2)}`}
                  </Box>
                </Grid>
              </Grid>
            )}

            {bond.key === 'mai_clam44' ? null : (
              <Tabs
                centered
                value={currentTab.current}
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="bond-tabs"
              >
                {!bond.deprecated && <Tab value={BondAction.Bond} label="Bond" {...a11yProps(0)} />}
                <Tab value={bond.deprecated ? BondAction.Bond : BondAction.Redeem} label="Redeem" {...a11yProps(1)} />
              </Tabs>
            )}

            {!bond.deprecated && (
              <TabPanel className="purchase-box" value={currentTab.current} index={BondAction.Bond}>
                <BondPurchase
                  bondKey={bond.key}
                  canSelect={canSelect}
                  slippage={slippage}
                  selection={selection}
                  setSelection={setSelection}
                  setNftDialogOpen={setNftDialogOpen}
                />
              </TabPanel>
            )}

            <TabPanel value={currentTab.current} index={bond.deprecated ? BondAction.Bond : BondAction.Redeem}>
              <BondRedeem bondKey={bond.key} />
            </TabPanel>
          </Paper>
        </Fade>
      </Backdrop>
    </Fade>
  );
}

export default BondDialog;
