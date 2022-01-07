import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../store/hook';
import { useWeb3Context } from '../../../hooks';

import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link } from '@material-ui/core';
import { ReactComponent as ArrowUpIcon } from '../../../assets/icons/arrow-up.svg';

const PRIMARY_COLOR = '#49A1F2';

type Props = Omit<ComponentProps<typeof Popper>, 'children'>;

const PendingPopper = (props: Props) => {
  const { t } = useTranslation();
  const { disconnect, chainID } = useWeb3Context();
  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });
  const getEtherscanUrl = (txnHash: string) => {
    return chainID === 4 ? `https://rinkeby.etherscan.io/tx/${txnHash}` : `https://polygonscan.com/tx/${txnHash}`;
  };
  return (
    <Popper id="ohm-popper-pending" {...props}>
      <Paper className="ohm-menu" elevation={1}>
        {pendingTransactions.map(transaction => (
          <Link
            key={transaction.txnHash}
            href={getEtherscanUrl(transaction.txnHash)}
            color="primary"
            target="_blank"
            rel="noreferrer"
          >
            <div className="pending-txn-container">
              <Typography style={{ color: PRIMARY_COLOR }}>{transaction.text}</Typography>
              <SvgIcon component={ArrowUpIcon} htmlColor={PRIMARY_COLOR} />
            </div>
          </Link>
        ))}
        <Box className="add-tokens">
          <Divider color="secondary" />
          <Button variant="text" color="secondary" onClick={disconnect} style={{ marginBottom: '0px' }}>
            <Typography>{t('components.disconnect')}</Typography>
          </Button>
        </Box>
      </Paper>
    </Popper>
  );
};
export default PendingPopper;
