const Tagalog = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Lengguwahe',
      bond: 'Bond',
      stake: 'Stake',
      migrate: 'Migrasyon',
      roi: 'ROI', //Pagbabalik ng Puhunan
      max: 'Pinakamataas',
      apy: 'APY', // Porsyento ng Interes kada Taon
      tvl: 'TVL', //Buong Halaga na naka-lock
      amount: 'Halaga',
      approve: 'Aprubahan',
      claim: 'Claim',
      clamPrice: 'Presyo ng CLAM',
      connectWallet: 'ikonekta ang pitaka',
      price: 'Presyo',
      buy: 'Bumili',
      buyThing: 'Bumili ng ', //e.g. "Bumili ng CLAM", "Bumili ng sCLAM"
      addLiquidity: 'Dagdagan ang Liquidity',
      redeem: 'Redeem',
      treasuryBalance: 'Balanse ng Treasury',
      currentIndex: 'Kasalukuyang Index',
      yourBalance: 'Iyong Balanse',
      currentApy: 'Kasalukuyang Porsyento ng Interes kada taon',
      dashboard: 'Dashboard',
      calculator: 'Kalkulador',
    },
    time: {
      days: 'araw',
      hours: 'oras',
      minutes: 'Minuto',
      seconds: 'Segundo',
      today: 'ngayong araw',
    }, // src\views\Dashboard
    dashboard: {
      marketCap: 'Market Cap',
      stakingRatio: 'Staking Ratio',
      circulatingSupply: 'Umiikot na Suplay',
      backingPerClam: 'Backing bawat CLAM',
      otterKingdom: 'Maligayang Pagdating sa Otter Kingdom',
      decentralized: 'Ang Desentralisadong Reserbang Memecoin',
      clamStaked: 'CLAM Staked',
      apyOverTime: 'APY over time',
      runway: 'Magagamit na Runway',
      totalValueDeposited: 'Kabuuan ng Halagang Nakadeposito',
      marketValue: 'Halaga sa Merkado ng Treasury Assets',
      riskFree: 'Risk Free Value ng Treasury Assets',
      pol: 'Pag-aari ng Protocol na Liquidity',
      tooltipItems: {
        tvl: 'Kabuuan ng Halagang Nakadeposito',
        current: 'Kasalukuyan',
        lpTreasury: 'LP Treasury',
        marketLP: 'Merkado LP',
      },
      tooltipInfoMessages: {
        tvl: 'Kabuuang depositong halaga, ay ang halaga ng dolyar ng lahat ng CLAM na naka-stake sa protocol. Ang metrika na ito ay kadalasang ginagamit na sukat ng pag-unlad o kalusugan ng mga proyekto ng DeFi.',
        mvt: 'Halaga ng Merkado ng Treasury Assets, ay ang kabuuan ng halaga (dolyar) ng lahat ng pag-aaring hawak ng treasury.',
        rfv: 'Risk Free Value, ay ang halaga ng pondo na ginagamit sa paggarantiya ng treasury sa pagsuporta ng CLAM.',
        pol: 'Liquidity na Pag-aari ng Protocol, ay ang halaga ng LP na pag-aari at kontrolado ng treasury. Mas maraming POL, mas mabuti para sa protocol at sa mga gumagamit.',
        holder: 'Mga may hawak, kumakatawan sa lahat ng otters (mga may hawak ng sCLAM)',
        staked: 'naka-stake na clam, ay ang ratio ng sCLAM sa CLAM (staked vs unstaked)',
        apy: 'Porsyento ng Interes kada Taon, ay ang normal na representasyon ng antas ng interes, base sa panahon ng compounding sa isang taon. Tandaan na ang nakalagay na APYs tantiyadong pahiwatig lamang at hinding eksaktong resulta sa hinaharap.',
        runway:
          'Runway, bilang ng araw na mapanatili ang paggawa ng sCLAM sa inilaan na antas. mababang APY = mas mahabang runway',
        currentIndex:
          'Sinusubaybayan ng kasalukuyang index ang halaga ng sCLAM na naipon simula ng umpisa ng pag-stake. Sa madaling salita, gaano karaming sCLAM ang mayroon ng isang tao kung nag-stake at hinawakan lamang ang isang CLAM simulang unang araw.',
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migrasyon',
      oldClamSupply: 'Lumang Suplay ng CLAM',
      oldTreasuryReserve: 'Lumang reserba ng Treasury',
      migrationProgress: 'Progreso ng Migrasyon',
      connectWalletDescription: 'Ikonekta ang Iyong Pitaka para Ma-migrate ang Iyong CLAM tokens!',
      steps: 'mga Hakbang',
      yourAmount: 'Iyong Halaga',
      claimWarmup: 'Kunin ang Warmup',
      done: 'Tapos',
      unstakeClam: 'Unstake CLAM',
      migrateTo: 'Migrate CLAM to CLAM',
      estimatedClamTwo: 'Estimated CLAM ',
      yourClamTwoBalance: 'Balanse ng Iyong CLAM',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Debt Ratio',
      vestingTerm: 'Vesting Term',
      recipient: 'Recipient',
      purchased: 'Binili',
      bondPrice: 'Presyo ng Bond',
      deprecated: 'Deprecated',
      bondDiscount: 'diskuwento!',
      myBond: 'Aking Bond',
      advancedSettings: {
        txrevert: 'Maaaring ibalik ang transaksyon kung ang presyo ay magpalit ng higit sa slippage %',
        recipientAddress: 'Piliin ang recipient address. By default, ito ang iyong kasalukuyang konektadong address',
      },
      purchase: {
        noValue: 'Please enter a value!',
        invalidValue: 'Please enter a valid value!',
        resetVestingAutostake:
          'Mayroon ka pang bond. I-rereset ng bonding and iyong vesting period. Gusto mo pa rin ba iproseso?',
        resetVesting:
          'Mayroon ka pang bond. I-rereset ng bonding and iyong vesting period at mawawala ang rewards. Nirerekomenda namin na kunin muna ang rewards o gumamit ng panibagong pitaka. Gusto mo pa rin bang magpatuloy?',

        fourFourInfo:
          'Tandaan: Sa (4, 4) bond, naka-stake na lahat ng CLAMs sa simula, kaya makukuha mo lahat ng rebase rewards habang nasa vesting term. Kapag fully vested na, ma-cclaim mo na ang iyong sClam.',
        approvalInfo:
          'Tandaan: Ang "Aprub" transaksyon ay kailangan lamang sa unang beses na mag-bond; sa mga kasunod na bond, kailangan nalang isagawa ang "Bond" transaksyon.',
        roiFourFourInfo: '* Kasama na sa ROI ng (4,4) bond ang 5-days staking reward',

        youWillGet: 'Makakakuha ka ng',
        maxBuy: 'Pinakamaraming maaaring bilhin',
      },
      redeem: {
        fullyVestedPopup: 'Maaari mo lang i-claim ang (4,4) bond kapag fully vested na.',
        claimAndAutostake: 'Claim and Autostake',
        pendingRewards: 'Pending Rewards',
        claimableRewards: 'Claimable Rewards',
        timeUntilFullyVested: 'Oras hanggang maging fully vested',
      },
    },
    // src\views\Landing
    landing: {
      description: {
        part1: 'Ang Desentralisadong',
        part2: 'Reserbang Memecoin',
        tagline: 'Ang unang tindahan ng value meme',
      },
      appButton: 'Pumasok sa APP',
      footer: {
        joinOurCommunity: 'sumali sa aming komunidad',
        letsMakeIt: 'Magagawa natin',
        contactUs: 'Makipag-ugnayan sa amin',
      },
      splashPage: {
        howOtterClamWorks: 'Paano gumagana ang OtterClam',
        treasuryRevenue: 'Treasury Revenue',
        bondsLPFees: 'Bonds & LP fees',
        bondSales:
          "Ang Bond sales and LP Fees ay nakakapagtaas ng Otter's Treasury Revenue at lock in liquidity at nakakatulong na ikontrol ang suplay ng CLAM",
        treasuryGrowth: 'Paglaki ng Treasury',
        otterTreasury: 'Treasury ng Otter',
        treasuryInflow:
          'Ang pagpasok ng Treasury ay ginagamit para lumaki ang Balanse ng Treasury ng otter at suportahan ang outstanding CLAM tokens at mapanatili ang staking APY',
        stakingRewards: 'Staking Rewards',
        clamToken: 'CLAM Token',
        compounds:
          'awtomatikong nacocompound ang interes sa pamamagitan ng suportadong treasury memecoin na mayroong intrinsic value',
        treasuryBalance: 'Balanse ng Treasury',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'Staking ng Clam',
      connectWalletDescription: 'Ikonekta ang Iyong Pitaka para mag-stake ng CLAM tokens!',
      approvalInfo:
        'Tandaan: Ang "Aprub" transaksyon ay kailangan lamang sa unang beses ng staking/unstaking; sa mga kasunod na staking/unstaking, kailangan nalang isagawa ang "Stake" or "Unstake" transaksyon.',
      balanceInWarmup: 'Iyong balanseng naka-stake sa warmup',
      stakedBalance: 'Iyong balanseng naka-stake',
      nextRewardAmount: 'Halaga ng Susunod na Reward',
      nextRewardYield: 'Interes ng susunod na Reward',
      roiFiveDay: 'ROI (5-Araw na Antas)', //Return on Investment
    },
    // src\views\Calculator
    calculator: {
      current: 'Kasalukuyan',
      estimateReturns: 'Tantiyahin ang Iyong Kita',
      yoursClamBalance: 'Balanse ng Iyong sClam',
      sClamAmount: 'Halaga ng Sclam',
      purchasePrice: 'Presyo ng CLAM nung binili ($)',
      futurePrice: 'Presyo ng CLAM sa susunod ($)',
      results: 'Resulta',
      initialInvestment: 'Iyong Inisyal na Puhunan',
      currentWealth: 'Kasalukuyang Kayamanan',
      rewardEstimation: 'Tantiya ng Clam Rewards',
      potentialReturn: 'Potensyal na kita',
      potentialPercentageGain: 'Potensyal na porsyentong makukuha',
    },
    // src\components
    components: {
      staked: 'Staked',
      notStaked: 'Hindi staked',
      disconnect: 'Idiskonekta',
      buy: 'Bili',
      buyOnQuickswap: 'Bumili sa Quickswap',
      addTokenToWallet: 'Idagdag ang Token sa Pitaka',
      toNextHarvest: 'Sa Susunod na Ani',
      harvesting: 'Inaani',
      name: 'Pangalan',
    },
    // src\components\NFT
    nft: {
      which: 'Aling ',
      willYouGet: ' ang iyong makukuha?',
      safehandDescription:
        'Ipagkakaloob sa bawat Otter na naka-stake ng hindi bababa sa 2 linggo na mayroong higit sa 4 sCLAM sa peta ng drop.',
      furryhandDescription:
        'Ipagkakaloob sa bawat Otter na naka-stake ng hindi bababa sa 2 linggo na mayroong higit sa 40 sCLAM sa peta ng drop.',
      stonehandDescription:
        'Ipagkakaloob sa bawat pitaka na mayroong hihigit sa 56 sCLAM na naka-stake simula 11/9 hanggang sa petsa ng drop.',
      diamondhandDescription:
        'Ipagkakaloob sa pag-stake sa buong halaga ng CLAM simula IDO (11/3, hindi bababa sa 20 sCLAM) hanggang sa petsa ng drop',
    },
  },
};
export default Tagalog;
