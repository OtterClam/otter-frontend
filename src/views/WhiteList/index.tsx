import { useEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3Context } from '../../hooks';
import { checkIDOWhiteList } from '../../store/slices/whitelist-slice';
import { IReduxState } from '../../store/slices/state.interface';
import { Button, Link } from '@material-ui/core';
import styles from './whitelist.module.scss';
import OtterReviewing from './images/otter_reviewing_paper.png';
import OtterHappy from './images/otter_happy.png';
import OtterUpset from './images/otter_upset.png';
import { DiscordLink, TwitterLink, MediumLink, GithubLink } from '../../constants';
import DiscordIcon from './images/icon_discord.svg';
import TwitterIcon from './images/icon_twitter.svg';
import MediumIcon from './images/icon_medium.svg';
import GithubIcon from './images/icon_github.svg';
import FooterLogo from 'src/components/FooterLogo';
import OtterModIcon from './images/role_icon_mods.png';

export default function WhiteList() {
  const dispatch = useDispatch();
  const { address, connect, connected, provider, chainID } = useWeb3Context();
  const isLoading = useSelector<IReduxState, boolean>(state => state.whitelist.loading);
  const whitelisted = useSelector<IReduxState, boolean>(state => {
    return state.whitelist.whitelisted;
  });

  const isChecking = useMemo(() => !connected || isLoading, [connected, isLoading]);

  useEffect(() => {
    if (connected) {
      dispatch(checkIDOWhiteList({ walletAddress: address, provider, networkID: chainID }));
    }
  }, [connected, provider]);

  return (
    <div className={styles.body}>
      <div className={styles.cover}>
        {isChecking ? (
          <img src={OtterReviewing} />
        ) : whitelisted ? (
          <img src={OtterHappy} style={{ width: 240, height: 240 }} />
        ) : (
          <img src={OtterUpset} />
        )}
      </div>
      {isChecking ? (
        <h1 className={styles.title}>Check your ticket to enter the kingdom</h1>
      ) : whitelisted ? (
        <>
          <h2>Welcome to the Kingdom</h2>
          <h1 className={styles.title}>
            <img src={OtterModIcon} />
            <span>You are on the whitelist!</span>
            <img src={OtterModIcon} />
          </h1>
        </>
      ) : (
        <h1 className={styles.title}>Sorry, you are not on the whitelist.</h1>
      )}
      {!connected && (
        <div className={styles.button}>
          <Button variant="contained" color="primary" size="large" disableElevation onClick={connect}>
            Connect Your Wallet
          </Button>
        </div>
      )}
      {connected && isLoading && <div>Loading...</div>}
      <div className={styles.desc}>
        {connected &&
          !isLoading &&
          (whitelisted ? (
            <div>Be Prepared (🦦,🦦)</div>
          ) : (
            <div>
              Don't worry! The whitelist offering is still open. Join our <a href={DiscordLink}>Discord</a> for the
              kingdom!
            </div>
          ))}
      </div>

      <div className={styles.desc}>
        IDO will be launched on <span>Nov 1, 2021 0:00 UTC</span>
      </div>
      <div className={styles.communityIcons}>
        <Link href={TwitterLink} className="community-icon-link">
          <img src={TwitterIcon} />
        </Link>
        <Link href={DiscordLink} className="community-icon-link">
          <img src={DiscordIcon} />
        </Link>
        <Link href={GithubLink} className="community-icon-link">
          <img src={GithubIcon} />
        </Link>
        <Link href={MediumLink} className="community-icon-link">
          <img src={MediumIcon} />
        </Link>
      </div>

      <div className={styles.footerLogo}>
        <FooterLogo />
      </div>
    </div>
  );
}
