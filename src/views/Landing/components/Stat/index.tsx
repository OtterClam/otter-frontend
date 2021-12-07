import { Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useEffect, useState } from 'react';
import apollo from 'src/lib/apolloClient';
import './stat.scss';

function Stat() {
  const [stakingAPY, setStakingAPY] = useState<number | null>(null);
  const [treasuryBalance, setTreasuryBalance] = useState<number | null>(null);

  useEffect(() => {
    apollo(`
query {
  protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
    treasuryMarketValue
    currentAPY
  }
}`).then(r => {
      const latestMetrics = (r as any).data.protocolMetrics[0];
      setTreasuryBalance(latestMetrics.treasuryMarketValue);
      setStakingAPY(latestMetrics.currentAPY);
    });
  });

  return (
    <div className="landing-footer">
      <Grid container spacing={1}>
        {/* <Grid item xs={12} sm={4} md={4} lg={4}>
          <div className="landing-footer-item-wrap">
            <p className="landing-footer-item-title">Total Staked</p>
          </div>
        </Grid> */}
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div className="landing-footer-item-wrap">
            <p className="landing-footer-item-title">Treasury Balance</p>
            <p className="landing-footer-item-value">
              {!treasuryBalance ? (
                <Skeleton width="180px" />
              ) : (
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(treasuryBalance)
              )}
            </p>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <div className="landing-footer-item-wrap">
            <p className="landing-footer-item-title">Current APY</p>
            <p className="landing-footer-item-value">
              {stakingAPY ? (
                <>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(stakingAPY))}%</>
              ) : (
                <Skeleton width="150px" />
              )}
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default Stat;
