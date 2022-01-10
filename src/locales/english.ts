const English = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Language',
      bond: 'Bond',
      wrap: 'Wrap',
      stake: 'Stake',
      unstake: 'Unstake',
      staking: 'staking',
      migrate: 'Migrate',
      pearlChests: 'Pearl Chests',
      roi: 'ROI', //Return on Investment
      max: 'Max',
      apy: 'APY', //Annualised Percentage Yield
      tvl: 'TVL', //Total Value Locked
      amount: 'Amount',
      approve: 'Approve',
      claimed: 'Claimed',
      claim: 'Claim',
      pending: 'Pending',
      notEligible: 'Not Eligible',
      clamPrice: 'CLAM Price',
      pearlPrice: 'PEARL Price',
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
      helpTranslate: 'Help us Translate',
    },
    time: {
      days: 'Days',
      day: 'Day',
      hours: 'Hours',
      hour: 'Hour',
      minutes: 'Minutes',
      minute: 'Minute',
      seconds: 'Seconds',
      second: 'Second',
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
      fullyVested: 'Fully Vested',
      fullyVestedAt: 'Fully Vested At',
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

        youWillGet: 'You Will Get ',
        maxBuy: 'Max You Can Buy',
      },
      purchaseDialog: {
        bondSuccessful: 'Your bond was successful.',
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
        totalStaked: 'Total Staked',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'CLAM Staking',
      connectWalletDescription: 'Connect your wallet to stake CLAM tokens!',
      approvalInfo:
        'Note: The "Approve" transaction is only needed when staking/unstaking for the first time; subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.',
      balanceInWarmup: 'Your Staked Balance in warmup',
      stakedBalance: 'Your Staked Balance',
      nextRewardAmount: 'Next Reward Amount',
      nextRewardYield: 'Next Reward Yield',
      roiFiveDay: 'ROI (5-Day Rate)', //Return on Investment
      stakeSuccessful: 'Your stake was successful',
      unstakeSuccessful: 'Your unstake was successful',
      youReceived: 'You just received ',
    },
    // src\views\Stake
    wrap: {
      wrapsClam: 'Wrap sCLAM',
      connectWalletDescription: 'Connect your wallet to wrap your sCLAM!',
      approvalInfo:
        'Note: The "Approve" transaction is only needed when wrapping for the first time; subsequent minting only requires you to perform the "Wrap" transaction.',
      description:
        'PEARL is an index-adjusted wrapper for sCLAM. Some people may find this useful for cross-blockchain purposes. Unlike your sCLAM balance, your PEARL balance will not increase over time. When PEARL is unwrapped, you receive sCLAM based on the latest (ever-increasing) index, so the total yield is the same.',
      stakedBalance: 'Your Balance (Staked)',
      wrappedBalance: 'Your Balance (Wrapped)',
      currentIndex: 'Current Index',
      indexAdjustedBalance: 'Index-adjusted Balance',
      youWillGet: 'You Will Get',
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
      wrapped: 'Wrapped',
      staked: 'Staked',
      notStaked: 'Not staked',
      disconnect: 'Disconnect',
      buy: 'BUY',
      buyOnQuickswap: 'Buy On Quickswap',
      buyPearl: 'Buy PEARL',
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
      giveawayParty: 'Giveaway Party',
      giveawayPartyHeld: 'giveaway party will be held on',
      airdropCountdown: 'Airdrop Countdown',
      connectWallet: 'Please connect your wallet to claim the NFT',
      claimYourNFT: 'Claim your NFT',
    },
    pearlChests: {
      title: 'PEARL Chests',
      description:
        'PEARL Chests are like personal vaults where you can lock your PEARLs. Once your PEARLs are put into a Chest, they will be locked for a certain period of time, but will also yield a lot more CLAMs.',
      readMore: 'Read More',
      locked: 'Locked',
      unlocked: 'Unlocked',
      lockupAmount: 'Lock-up Amount',
      currentReward: 'Current Reward',
      nextReward: 'Next Reward (x{{boost}})',
      rewardRate: 'Reward Rate',
      lockedValue: 'Locked Value',
      marketValue: 'Market Value',
      lockupPeriod: 'Lock-up Period',
      dueDate: 'Due Date',
      apy: 'APY',
      addPearl: 'Add PEARL',
      claimRewardAndRelock: 'Claim & Relock ({{amount}} PEARL)',
      claimReward: 'Claim Reward',
      redeemAll: 'Redeem All',
      claimAllAndRelock: 'Claim all & Relock',
      lockUpModal: {
        title: 'PEARL Chest Lock-up',
      },
      lockUp: {
        tabLabel: 'Lock up',
        title: 'Compare All PEARL Chests',
        days: 'days',
        boost: 'Boost',
        rewardBoost: 'Reward Boost',
        expectedAPY: 'Expected APY',
        youWillGet: 'You Will Get:',
        noExtraBonus: 'No extra note bonus',
        bonusTitle: '+{{percentage}}% Off',
        bonusDescription: 'any (4,4) bond',
        nftRequirement: 'Minimum amount required: \n{{amount}} PEARL',
        select: 'Select',
      },
      redeem: {
        tabLabel: 'Redeem',
        connect: 'Connect your wallet to view your PEARL Chests!',
      },
    },
  },
};
export default English;
