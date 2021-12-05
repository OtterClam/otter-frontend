import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          common: {
            bond: 'Bond',
            roi: 'ROI',
            max: 'Max',
            amount: 'Amount',
            approve: 'Approve',
            claim: 'Claim',
            clamPrice: 'CLAM Price',
            price: 'Price',
            buy: 'Buy',
            addLiquidity: 'Add Liquidity',
            redeem: 'Redeem',
            treasuryBalance: 'Treasury Balance',
          },
          time: {
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds',
          },
          // src\views\Dashboard
          dashboard: {
            marketCap: 'Market Cap',
            stakingRatio: 'Staking Ratio',
            circulatingSupply: 'Circulating Supply',
            backingPerClam: 'Backing per CLAM',
            currentIndex: 'Current Index',
            otterKingdom: 'Welcome to Otter Kingdom',
            decentralized: 'The Decentralized Reserve Memecoin',
            clamStaked: 'CLAM Staked',
            apyOverTime: 'APY over time',
            runway: 'Runway available',
            totalValueDepsotied: 'Total Value Deposited',
            marketValue: 'Market Value of Treasury Assets',
            riskFree: 'Risk Free Value of Treasury Assets',
            pol: 'Protocol Owned Liquidity',
            tooltipItems: {
              tvl: 'Total Value Deposited',
              apy: 'APY',
              current: 'Current',
              lpTreasury: 'LP Treasury',
              marketLP: 'Market LP',
            },
            tooltipInfoMessages: {
              tvl: 'Total Value Deposited, is the dollar amount of all CLAM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.',
              mvt: 'Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury.',
              rfv: 'Risk Free Value, is the amount of funds the treasury guarantees to use for backing CLAM.',
              pol: 'Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.',
              holder: 'Holders, represents the total number of otters (sCLAM holders)',
              staked: 'CLAM Staked, is the ratio of sCLAM to CLAM (staked vs unstaked)',
              apy: 'Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.',
              runway:
                'Runway, is the number of days sCLAM emissions can be sustained at a given rate. Lower APY = longer runway',
              currentIndex:
                'The current index tracks the amount of sCLAM accumulated since the beginning of staking. Basically, how much sCLAM one would have if they staked and held a single CLAM from day 1.',
            },
          },
          // src\views\Migrate
          migrate: {
            migration: 'Migration',
            migrate: 'Migrate',
            oldClamSupply: 'Old CLAM Supply',
            oldTreasuryReserve: 'Old Treasury Reserve',
            migrationProgress: 'Migration Progress',
            connectWallet: 'Connect Wallet',
            connectWalletDescription: 'Connect your wallet to migrate your CLAM tokens!',
            steps: 'Steps',
            yourAmount: 'Your amount',
            claimWarmup: 'Claim Warmup',
            done: 'DONE',
            unstakeClam: 'Unstake CLAM',
            migrateTo: 'Migrate CLAM to CLAM2',
            estimatedClamTwo: 'Estimated CLAM2 ',
            yourClamTwoBalance: 'Your CLAM2 Balance',
          },
          // src\views\Bond
          bonds: {
            debtRatio: 'Debt Ratio',
            vestingTerm: 'Vesting Term',
            recipient: 'Recipient',
            purchased: 'Purchased',
            bondPrice: 'Bond Price',
            deprecated: 'Deprecated',
            bondDiscount: 'discount!',
            myBond: 'My Bond',
            advancedSettings: {
              txrevert: 'Transaction may revert if price changes by more than slippage %',
              recipientAddress: 'Choose recipient address. By default, this is your currently connected address',
            },
            purchase: {
              noValue: 'Please enter a value!',
              invalidValue: 'Please enter a valid value!',
              resetVestingAutostake:
                'You have an existing bond. Bonding will reset your vesting period. Do you still want to process?',
              resetVesting:
                'You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?',

              fourFourInfo:
                'Note: The (4, 4) bond will stake all CLAMs at the start, so you will earn all rebase rewards during the vesting term. Once fully vested, you will only be able to claim sClam.',
              approvalInfo:
                'Note: The "Approve" transaction is only needed when bonding for the first time; subsequent bonding only requires you to perform the "Bond" transaction.',
              roiFourFourInfo: '* The ROI of (4,4) bond includes 5-days staking reward',
              balance: 'Your Balance',
              youWillGet: 'You Will Get',
              maxBuy: 'Max You Can Buy',
            },
            redeem: {
              fullyVestedPopup: 'You can only claim (4,4) bond after it fully vested.',
              claimAndAutostake: 'Claim and Autostake',
              pendingRewards: 'Pending Rewards',
              claimableRewards: 'Claimable Rewards',
              timeUntilFullyVested: 'Time until fully vested',
            },
          },

          // src\views\Landing
          landing: {
            description: {
              part1: 'The Decentralized',
              part2: 'Reserve Memecoin',
              tagline: 'The first store of value meme',
            },
            appButton: 'Enter APP',
            footer: {
              joinOurCommunity: 'Join Our Community',
              letsMakeIt: "Let's make it",
              contactUs: 'Contact Us',
            },
            splashPage: {
              howOtterClamWorks: 'How OtterClam Works',
              treasuryRevenue: 'Treasury Revenue',
              bondsLPFees: 'Bonds & LP fees',
              bondSales:
                "Bond sales and LP Fees increase Otter's Treasury Revenue and lock in liquidity and help control CLAM supply",
              treasuryGrowth: 'Treasury Growth',
              otterTreasury: "Otter's Treasury",
              treasuryInflow:
                "Treasury inflow is used to increase Otter's Treasury Balance and back outstanding CLAM tokens and regulate staking APY",
              stakingRewards: 'Staking Rewards',
              clamToken: 'CLAM Token',
              compounds: 'Compounds yields automatically through a treasury backed memecoin with intrinsic value',
              treasuryBalance: 'Treasury Balance',
              currentApy: 'Current APY',
            },
          },
        },
      },
    },
  });

export default i18n;
