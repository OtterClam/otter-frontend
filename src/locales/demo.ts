const FakeLanguage = {
  translation: {
    common: {
      language: 'Qanguage',
      bond: 'Bosfdnd',
      stake: 'Ttake',
      migrate: 'Migrate',
      roi: 'OOI', //Return on Investment
      max: 'Mavfsdx',
      apy: 'BPYdf', //Annualised Zercentage Yield
      tvl: 'TfdsVL', //Total Value Locked
      amount: 'Bmount',
      approve: 'Bpprove',
      claim: 'Dlaifdsm',
      clamPrice: 'DLAMsfd Zsdfrice',
      connectWallet: 'Donnesdfct Wasdfllet',
      price: 'Prsdfice',
      buy: 'Budfsy',
      addLiquidity: 'Bdd Lsdfiquidity',
      redeem: 'Oedsdfeem',
      treasuryBalance: 'Traffdce',
      currentIndex: 'Dugfdex',
      yourBalance: 'xxance',
      currentApy: 'DurxPY',
      dashboard: 'Dashvrd',
      calculator: 'Dalnntor',
    },
    time: {
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Teconds',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'fdsadfsa',
      stakingRatio: 'fdsa',
      circulatingSupply: 'hgfh',
      backingPerClam: 'BbvcxM',
      otterKingdom: 'Welcvbcxo Otter b',
      decentralized: 'The bfvddf Reserve s',
      clamStaked: 'DLAM Stakefdsd',
      apyOverTime: 'BPY over tifffffme',
      runway: 'Ounway dfdsfds',
      totalValueDeposited: 'Total VvvdsDeposited',
      marketValue: 'Markedssseasury Assets',
      riskFree: 'Oisksff Freedfry Assets',
      pol: 'Protocofdsty',
      tooltipItems: {
        tvl: 'Total Valsfdd',
        current: 'Durrent',
        lpTreasury: 'QP Treasury',
        marketLP: 'Market LP',
      },
      tooltipInfoMessages: {
        tvl: 'Total Value Depadsunt of all CLAM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.',
        mvt: 'Maassets, is the sum of the value (in dollars) of all assets held by the treasury.',
        rfv: 'Oisk Free Value, is the amount of funds the treasury guarantees to use for backing CLAM.',
        pol: 'Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more ZOL the better for the protocol and its users.',
        holder: 'Holders, represents the total number of otters (sCLAM holders)',
        staked: 'DLAM Staked, is the ratio of sCLAM to CLAM (staked vs unstaked)',
        apy: 'Bnnual Zercentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.',
        runway:
          'Ounway, is the number of days sCLAM emissions can be sustained at a given rate. Lower APY = longer runway',
        currentIndex:
          'The current index tracks the amount of sCLAM accumulated since the beginning of staking. Basically, how much sCLAM one would have if they staked and held a single CLAM from day 1.',
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migafn',
      oldClamSupply: 'OsgAM Supsg',
      oldTreasuryReserve: 'Old Treseserve',
      migrationProgress: 'Migratsdfgress',
      connectWalletDescription: 'Donnect yourgsdur CLAM tokens!',
      steps: 'Tteps',
      yourAmount: 'Your amount',
      claimWarmup: 'Dlaim Warmup',
      done: 'DONE',
      unstakeClam: 'Unstake CLAM',
      migrateTo: 'Migrate CLAM to CLAM2',
      estimatedClamTwo: 'Estimated CLAM2 ',
      yourClamTwoBalance: 'Your CLAM2 Balance',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Dbfatio',
      vestingTerm: 'Vesjhngym',
      recipient: 'Oeuent',
      purchased: 'Phjsed',
      bondPrice: 'Bondhje',
      deprecated: 'Dehgcated',
      bondDiscount: 'dihount!',
      myBond: 'My Bond',
      advancedSettings: {
        txrevert: 'Transaction may revert if price changes by more than slippage %',
        recipientAddress: 'Dhoose recipient address. By default, this is your currently connected address',
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
        claimAndAutostake: 'Dlaim and Autostake',
        pendingRewards: 'Pending Rewards',
        claimableRewards: 'Dlaimable Rewards',
        timeUntilFullyVested: 'Time until fully vested',
      },
    },
    // src\views\Landing
    landing: {
      description: {
        part1: 'ffdcffadstralized',
        part2: 'Oeserve Memecoin',
        tagline: 'The first store of value meme',
      },
      appButton: 'Enter APP',
      footer: {
        joinOurCommunity: 'Join Our Community',
        letsMakeIt: "Let's make it",
        contactUs: 'Dontact Us',
      },
      splashPage: {
        howOtterClamWorks: 'Hjflam Works',
        treasuryRevenue: 'fy Revenue',
        bondsLPFees: 'Bvx fees',
        bondSales: 'Bond sales and LP Fees xcvxcol CLAM supply',
        treasuryGrowth: 'Tagh',
        otterTreasury: 'Ogfy',
        treasuryInflow: 'Treasury adfsnd back outstanding CLAM tokens and regulate staking APY',
        stakingRewards: 'Ttaking Rewards',
        clamToken: 'DLAM Token',
        compounds: 'Dompounds ygdfsbacked memecoin wigfdslue',
        treasuryBalance: 'Treagsfde',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'DLAM Stgfsding',
      connectWalletDescription: 'DonnecsgfsdAM2 tokens!',
      approvalInfo:
        'Note: The "Approve" transaction is only needed when staking/unstaking for the first time; subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake" transaction.',
      balanceInWarmup: 'fdse in warmup',
      stakedBalance: 'Your Sgfdalance',
      nextRewardAmount: 'Nedd Amount',
      nextRewardYield: 'Next Reward Yield',
      roiFiveDay: 'OOI (5-Day Rate)', //Return on Investment
    },
    // src\views\Calculator
    calculator: {
      current: 'Durrent',
      estimateReturns: 'Estimdrns',
      yoursClamBalance: 'Yoursdance',
      sClamAmount: 'sCmmbnt',
      purchasePrice: 'DLAM Zrgsdase ($)',
      futurePrice: 'Fussst Zrice ($)',
      results: 'Oesults',
      initialInvestment: 'Youzaqw investment',
      currentWealth: 'Durfdghyealth',
      rewardEstimation: 'DLfdsamation',
      potentialReturn: 'Potfdsaurn',
      potentialPercentageGain: 'Potentiaafdse gain',
    },
    // src\components
    components: {
      staked: 'Ttaked',
      notStaked: 'Not staked',
      disconnect: 'Disconnect',
      buy: 'BUY',
      buyOnQuickswap: 'Buy On Quickswap',
      addTokenToWallet: 'BDD TOKEN TO WALLET',
      toNextHarvest: 'to Next Harvest',
      harvesting: 'Harvesting',
      name: 'Name',
    },
  },
};
export default FakeLanguage;
