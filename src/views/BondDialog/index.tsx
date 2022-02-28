import { useEffect, useState, useRef, SetStateAction, Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from 'src/store/hook';
import { useTranslation } from 'react-i18next';

import { Backdrop, Box, Divider, Fade, Grid, Paper, Tab, Tabs, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Status, StatusChip } from 'src/components/Chip';
import TabPanel from '../../components/TabPanel';
import BondHeader from './BondHeader';
import BondPurchase from './BondPurchase';
import BondRedeem from './BondRedeem';
import './bond.scss';

import { Bonding, Bond as BondType, AccountBond, BondAction } from 'src/constants';
import { NFTDiscountOption } from './types';
import { formatCurrency, trim } from '../../helpers';
import { useWeb3Context } from '../../hooks';
import { checkBondAction } from '../ChooseBond/utils';
import { BondDetails } from 'src/store/slices/bond-slice';

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
  selection: NFTDiscountOption | undefined;
  selectedAccountBond: AccountBond;
  selectedBonding: Bonding;
  setBond: Dispatch<SetStateAction<BondType | undefined>>;
  setSelection: Dispatch<SetStateAction<NFTDiscountOption | undefined>>;
  setNftDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

function BondDialog({
  bond,
  canSelect,
  selection,
  selectedBonding,
  selectedAccountBond,
  setBond,
  setSelection,
  setNftDialogOpen,
  setSuccessDialogOpen,
}: IBondProps) {
  const { t } = useTranslation();
  const style = useStyle();
  const { provider, address } = useWeb3Context();

  const isBondLoading = useAppSelector(state => state.bonding.loading);
  const marketPrice = useAppSelector(state => state.app.marketPrice);
  const { bondPrice, originalBondPrice } = useAppSelector(state => state.bonding[bond.key]) as BondDetails;
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
  const matches = search.match(/(\?action=)([a-z]*)/);
  const actionMatch = matches ? matches[2] : '';

  // NOTE: action query decides which tab view to show
  const defaultTab = checkBondAction(actionMatch) ? actionMatch : undefined;
  const [currentTab, setCurrentTab] = useState<BondAction | undefined>(defaultTab);
  const changeView = (_e: any, newView: BondAction) => {
    history.push({ pathname: `/bonds/${bond.key}`, search: `?action=${newView}` });
  };

  useEffect(() => {
    if (bond.deprecated) {
      return history.push({ pathname: `/bonds/${bond.key}`, search: `?action=${BondAction.Redeem}` });
    }
    if (currentTab === undefined) {
      return history.push({ pathname: `/bonds/${bond.key}`, search: `?action=${BondAction.Bond}` });
    }
  }, [currentTab]);

  // NOTE: update view tab value when action query updates
  useEffect(() => {
    setCurrentTab(defaultTab);
  }, [defaultTab]);

  // NOTE: reset selection value when dialog is re-open
  useEffect(() => {
    setSelection(undefined);
  }, [currentTab]);

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
                  {isBondLoading ? (
                    <Box className="bond-price-data-value" component="span" color="text.secondary">
                      <Skeleton />
                    </Box>
                  ) : bond.deprecated ? (
                    <Box className="bond-price-data-value" component="span" color="text.secondary">
                      -
                    </Box>
                  ) : (
                    <>
                      {bondPrice === originalBondPrice ? (
                        <Box className="bond-price-data-value" component="span" color="text.secondary">
                          {bond.type === 'lp' ? `$${trim(bondPrice, 2)}` : `${trim(bondPrice, 2)} ${bond.reserveUnit}`}
                        </Box>
                      ) : (
                        <>
                          <Box className="bond-price-data-value market-price" component="span" color="secondary.light">
                            {formatCurrency(originalBondPrice, 2)}
                          </Box>
                          <Box className="bond-price-data-value" component="span" color="text.secondary">
                            {bond.type === 'lp'
                              ? `$${trim(bondPrice, 2)}`
                              : `${trim(bondPrice, 2)} ${bond.reserveUnit}`}
                          </Box>
                        </>
                      )}
                    </>
                  )}
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

            {bond.supportNFT ? null : bond.deprecated ? (
              <Tabs
                centered
                value={currentTab}
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="bond-tabs"
              >
                <Tab value={BondAction.Redeem} label="Redeem" {...a11yProps(1)} />
              </Tabs>
            ) : (
              <Tabs
                centered
                value={currentTab}
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="bond-tabs"
              >
                <Tab value={BondAction.Bond} label="Bond" {...a11yProps(0)} />
                <Tab value={BondAction.Redeem} label="Redeem" {...a11yProps(1)} />
              </Tabs>
            )}

            <TabPanel className="purchase-box" value={currentTab} index={BondAction.Bond}>
              <BondPurchase
                bondKey={bond.key}
                canSelect={canSelect}
                slippage={slippage}
                selectedBonding={selectedBonding}
                selectedAccountBond={selectedAccountBond}
                selection={selection}
                setSelection={setSelection}
                setNftDialogOpen={setNftDialogOpen}
                setSuccessDialogOpen={setSuccessDialogOpen}
              />
            </TabPanel>
            <TabPanel value={currentTab} index={BondAction.Redeem}>
              <BondRedeem bondKey={bond.key} />
            </TabPanel>
          </Paper>
        </Fade>
      </Backdrop>
    </Fade>
  );
}

export default BondDialog;
