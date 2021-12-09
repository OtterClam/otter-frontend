const English = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Language',
      bond: 'Bond',
      stake: 'Stake',
      migrate: 'Migrate',
      roi: 'ROI', //Return on Investment
      max: 'Max',
      apy: 'APY', //Annualised Percentage Yield
      tvl: 'TVL', //Total Value Locked
      amount: 'Amount',
      approve: 'Approve',
      claim: 'Claim',
      clamPrice: 'CLAM Price',
      connectWallet: 'Connect Wallet',
      price: 'Price',
      buy: 'Buy',
      buyThing: 'Buy ', //e.g. "Buy CLAM", "Buy sCLAM"
      addLiquidity: 'Add Liquidity',
      redeem: 'Redeem',
      treasuryBalance: 'Treasury Balance',
      currentIndex: 'Current Index',
      yourBalance: 'Your Balance',
      currentApy: 'Current APY',
      dashboard: 'Dashboard',
      calculator: 'Calculator',
    },
    time: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      today: 'Today',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'Market Cap',
      stakingRatio: 'Staking Ratio',
      circulatingSupply: 'Circulating Supply',
      backingPerClam: 'Backing per CLAM',
      otterKingdom: 'Welcome to Otter Kingdom',
      decentralized: 'The Decentralized Reserve Memecoin',
      clamStaked: 'CLAM Staked',
      apyOverTime: 'APY over time',
      runway: 'Runway available',
      totalValueDeposited: 'Total Value Deposited',
      marketValue: 'Market Value of Treasury Assets',
      riskFree: 'Risk Free Value of Treasury Assets',
      pol: 'Protocol Owned Liquidity',
      tooltipItems: {
        tvl: 'Total Value Deposited',
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
      oldClamSupply: 'Old CLAM Supply',
      oldTreasuryReserve: 'Old Treasury Reserve',
      migrationProgress: 'Migration Progress',
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
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'CLAM Staking',
      connectWalletDescription: 'Connect your wallet to stake CLAM2 tokens!',
      approvalInfo:
        'Note: The "Approve" transaction is only needed when staking/unstaking for the first time; subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.',
      balanceInWarmup: 'Your Staked Balance in warmup',
      stakedBalance: 'Your Staked Balance',
      nextRewardAmount: 'Next Reward Amount',
      nextRewardYield: 'Next Reward Yield',
      roiFiveDay: 'ROI (5-Day Rate)', //Return on Investment
    },
    // src\views\Calculator
    calculator: {
      current: 'Current',
      estimateReturns: 'Estimate your returns',
      yoursClamBalance: 'Your sCLAM Balance',
      sClamAmount: 'sCLAM Amount',
      purchasePrice: 'CLAM Price at Purchase ($)',
      futurePrice: 'Future CLAM Market Price ($)',
      results: 'Results',
      initialInvestment: 'Your initial investment',
      currentWealth: 'Current wealth',
      rewardEstimation: 'CLAM rewards estimation',
      potentialReturn: 'Potential return',
      potentialPercentageGain: 'Potential percentage gain',
    },
    // src\components
    components: {
      staked: 'Staked',
      notStaked: 'Not staked',
      disconnect: 'Disconnect',
      buy: 'BUY',
      buyOnQuickswap: 'Buy On Quickswap',
      addTokenToWallet: 'ADD TOKEN TO WALLET',
      toNextHarvest: 'to Next Harvest',
      harvesting: 'Harvesting',
      name: 'Name',
    },
    // src\components\NFT
    nft: {
      which: 'Which ',
      willYouGet: ' will you get?',
      safehandDescription:
        'Awarded to every Otter who has staked for a minimum of 2 weeks with greater than 4 sCLAM on the drop date.',
      furryhandDescription:
        'Awarded to every Otter who has staked for a minimum of 2 weeks with more than 40 sCLAM on the drop date',
      stonehandDescription: 'Awarded to wallets with over 56 sCLAM that have staked from 11/9 to drop date.',
      diamondhandDescription:
        'Awarded for staking the full amount of CLAM from IDO or launch date (11/3, with a minimum of 20 sCLAM) to drop date',
    },
  },
};
export default English;
