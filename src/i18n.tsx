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
            treasury: 'Treasury Balance',
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
          },
        },
      },
    },
  });

export default i18n;
