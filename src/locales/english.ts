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
      balance: 'Balance',
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
      infoTooltips: {
        sClamBalance: 'The amount of sCLAM in your wallet, currently available for wrapping or unstaking.',
        sClamBonded:
          'The total amount of sCLAM currently vested in bonds. Will be available for wrapping or unstaking once the vesting period is finished.',
        pearl:
          'The amount of PEARL in your wallet. This value is multiplied by the Current Index to find the equivalent sCLAM balance, which is included in the total above. Pearls locked in Chests are currently not included.',
        stakedBalance:
          'The sum total of sCLAM in your wallet, vested in bonds, and the equivalent sCLAM value of your held PEARL.',
        nextReward:
          'Total sCLAM rewards which will be earned from your sCLAM balance, bonded sCLAM, and PEARL balance upon the next rebase.',
      },
    },
    // src\views\Wrap
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
        lockedPearl: 'PEARL in chest',
      },
      redeem: {
        tabLabel: 'Redeem',
        connect: 'Connect your wallet to view your PEARL Chests!',
        viewOnOpenSea: 'View on OpenSea',
      },
    },
    otto: {
      header: {
        bank: 'Bank',
        otto: 'Otto',
        airdrop: 'Airdrop',
      },
      banner: {
        meet: 'Meet',
        otto: 'Otto',
        slogan: "The Otter Kingdom's newest NFT innovation",
        description:
          'Ottos are unique and randomly generated 2D NFT Social Avatars created to enhance your online experience. Some appear normal. Some look crazy. Some are just damn cool!',
      },
      whitelist: {
        amount: 'Genesis Otto Amount',
        whitelist: 'Only for Whitelist',
        joinDescription1: 'Join Discord to get',
        joinDescription2: 'latest updated of whitelist',
        joinButton: 'Join Discord',
      },
      get: {
        discord1: 'Make sure you’ve been added to ',
        discordHighlight: 'whitelist',
        discord2: "Check if you're on the whitelist on Discord",
        discordButton: 'Open Discord',
        buyClam1: 'Purchase ',
        buyClamHighlight: 'CLAM',
        buyClam2: 'Ottos can ONLY be minted by CLAM.',
        buyClamButton: 'Buy CLAM',
        calendar1: 'Mint Ottos with CLAM starting. \n',
        calendarHighlight: 'Jan 29',
        calendar2: 'Only 5000 available, act fast!',
        calendarButton: 'Add to Calendar',
      },
      type: {
        title: 'Types of Otto',
        ottoName: 'Otto',
        ottoDescription:
          "There are only 2,950 of these otterly handsome fellows. They don't just jazz up your online profiles, they are part of the genesis release, capable of breeding otter pups to increase the kingdom's otter population.",
        lottieName: 'Lottie',
        lottieDescription:
          '1,950 female Ottos make these NFTs a bit more enticing than the males, but no less adorable. Also part of the genesis collection, these fashionable Lotties will melt your heart with one lovable look. They also aspire to be fertile mothers of many pups. You can breed them with male Ottos or non-gender ones as well!',
        cleoName: 'Cleo',
        cleoDescription:
          "The rarest otters in the kingdom, you won't see these laying around any old pond or stream. Non-gender Ottos can be used to breed with either male or female Ottos in the genesis collection. Consider yourself lucky if you've acquired one of these extraordinary creatures!",
        pupName: 'Otto Pup',
        pupDescription:
          'These cutie pies have the most pinchable cheeks in the kingdom! The kingdom only gets pups from owners who breed, so expect to see these soon once the genesis Ottos get to know each other a little bit better.',
        vxName: 'Otto VX',
        vxDescription:
          'Not content with taking over the 2d NFT space, relentless innovation leads the Otter Kingdom into the metaverse. These voxel-based avatars are built for the metaverse  experience (SandBox anyone?). Stay tuned for more details.',
        population: 'Population',
        comingSoon: 'Coming Soon',
      },
      component: {
        title: 'Components of Otto',
        slogan: 'Every feature and accessory of your Otto has value',
        subtitle: 'The tech behind the Otto appeal',
        content:
          'ERC-721 tokens are non-fungible, meaning that each part of your Otto has unique features and will be valued accordingly. This feature of ERC-721 tokens is what differentiates them from ERC-20 tokens, which are equal in terms of value, and therefore identical and interchangeable.',
      },
      factory: {
        title: 'Otto Factory',
        slogan: 'Incubate and create a unique look for your Ottos',
        subtitle: 'Incubate your own Ottos and customize their features!',
        content:
          'Mix and match from our selection of accessories to customize your Otto and flaunt your impeccable style. Incubate and orchestrate to show the world your flair. We have the friendliest fashionistas in the NFT space!',
      },
      river: {
        title: 'Otto River',
        slogan: 'Pass down your Ottos’ good genes to strengthen the Otter Kingdom',
        subtitle1: 'Breed Your Ottos',
        subtitle2: 'to Get',
        subtitleHighlight: 'SSR',
        subtitle3: 'Otto Pups!',
        content:
          'The rarer your male and female Ottos’ components, the higher the likelihood they’ll breed a super rare otter pup!',
      },
      usage: {
        title: 'What can you do with Ottos?',
        playableTitle: 'Playable avatars in The Sandbox',
        playableContent: 'Get an Otto VX and explore the Sandbox metaverse.',
        commercialTitle: 'Full Commercial Rights on all OtterClam assets',
        commercialContent:
          'You own all commercial rights to the images of all your Ottos as well as the 3D model of your Otter VX.',
        beneficialTitle: 'Kingdom-wide Benefits',
        beneficialContent: 'Owners can use Ottos anywhere in the kingdom to reap benefits.',
      },
      countdown: {
        mintTitle: 'Mint your Ottos!',
        mintSubtitle: 'Mint Countdown',
        hintDescription:
          'Ottos can only be minted using CLAM, so make sure you have the required amount prior to minting.',
        buyNow: 'BUY NOW',
      },
    },
  },
};
export default English;
