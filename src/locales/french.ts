const French = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Language',
      bond: 'Bond',
      stake: 'Stake',
      migrate: 'Migrer',
      roi: 'ROI', //Return on Investment
      max: 'Max',
      apy: 'APY', //Annualised Percentage Yield
      tvl: 'TVL', //Total Value Locked
      amount: 'Montant',
      approve: 'Approuver',
      claim: 'Réclamer',
      clamPrice: 'Prix du CLAM',
      connectWallet: 'Connecter votre Portefeuille',
      price: 'Prix',
      buy: 'Acheter',
      addLiquidity: 'Ajouter de la liquidité',
      redeem: 'Racheter',
      treasuryBalance: 'Solde de Trésorerie',
      currentIndex: 'Index actuel',
      yourBalance: 'Votre Solde',
      currentApy: 'APY actuel',
      dashboard: 'Tableau de bord',
      calculator: 'Calculatrice',
    },
    time: {
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'Market Cap',
      stakingRatio: 'Pourcentage de Staking',
      circulatingSupply: 'Montant en circulation',
      backingPerClam: 'Support par CLAM',
      otterKingdom: 'Bienvenu dans le royaume des loutres',
      decentralized: 'La Memecoin de réserve décentralisée',
      clamStaked: 'CLAM Staké(s)',
      apyOverTime: 'APY au cours du temps',
      runway: 'Runway disponible',
      totalValueDeposited: 'Valeur Totale Déposée',
      marketValue: 'Valeur Marchande des Actifs de Trésorerie',
      riskFree: 'Valeur Sans Risques des Actifs de Trésorerie',
      pol: 'Liquidité Détenue par le Protocole',
      tooltipItems: {
        tvl: 'Valeur Totale Déposée',
        current: 'Actuel',
        lpTreasury: 'LP dans la Tresorerie',
        marketLP: 'LP sur le Marché',
      },
      tooltipInfoMessages: {
        tvl: 'La Valeur Totale Déposée (TVL), est la valeur en dollars de tous les CLAM stakés dans le protocole. Cette information est très souvent utilisée comme indicateur de progression et de santé pour les protocoles de Finance Décentralisée.',
        mvt: 'La Valeur Marchande des Actifs de Trésorerie est la somme de toutes les valeurs (en dollars) de tous les actifs détenus dans la trésorerie.',
        rfv: 'La Valeur Sans Risques des Actifs de Trésorerie est le montant des fonds de trésorerie que le protocole peut garantir afin de soutenir la valeur du CLAM.',
        pol: 'La Liquidité Détenue par le Protocole est le montant de jetons de liquidité détenu par le protocole dans sa trésorerie. Plus il y a de POL, meilleure est la situation pour le protocole et ses utilisateurs.',
        holder: 'Détenteurs, ce nombre représente le nombre total de loutres (détenteurs de sCLAM)',
        staked: 'CLAM Staked, est le ratio entre un sCLAM et un CLAM (staked VS non staked)',
        apy: "Annual Percentage Yield ou Pourcentage de Rendement Annuel, est la représentation normalisée d'un taux d'intérét, basé sur une période de composition d'un an. Veuillez noter que les APYs affichés sont plutôt des indicateurs approximatifs et non des résultats guarantis.",
        runway:
          "Runway, est le nombre de jours pendant lequel l'émission de sCLAM peut être soutenue à un taux donné. Plus l'APY est petit, plus long sera le Runway",
        currentIndex:
          "L'index courant présente le nombre de sCLAM accumulés depuis le début du staking. De façon simplifiée, c'est le nombre de sCLAM qu'un utilisateur aurait s'il avait staké un CLAM depuis le lancement du protocole.",
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migration',
      oldClamSupply: 'Montant de CLAM obsolètes',
      oldTreasuryReserve: 'Réserve obsolète de la trésorerie',
      migrationProgress: 'Progrès de la Migration',
      connectWalletDescription: 'Connectez votre portefeuille pour migrer vos jetons CLAM!',
      steps: 'Étapes',
      yourAmount: 'Votre montant',
      claimWarmup: 'Réclamez vos CLAMs préparés',
      done: 'TERMINÉ',
      unstakeClam: 'Unstake CLAM',
      migrateTo: 'Migrer vos CLAM en CLAM',
      estimatedClamTwo: 'Estimation de CLAM ',
      yourClamTwoBalance: 'Votre balance de CLAM',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Ratio de Dette',
      vestingTerm: "Durée d'acquisition",
      recipient: 'Destinataire',
      purchased: 'Achetés',
      bondPrice: "Prix de l'bond",
      deprecated: 'Obsolète',
      bondDiscount: 'rabais!',
      myBond: 'Mes Bonds',
      advancedSettings: {
        txrevert: 'La Transaction peut être inversée si le prix change plus que le taux de slippage autorisé',
        recipientAddress:
          "Veuillez sélectionner l'adresse du destinataire. Par défaut, il s'agit de l'adresse connectée actuellement",
      },
      purchase: {
        noValue: 'Veuillez indiquer une valeur!',
        invalidValue: 'Veuillez indiquer une valeur valide!',
        resetVestingAutostake:
          "Vous avez actuellement une bond en cours d'acquisition. Si vous achetez une nouvelle bond, la période d'acquisition sera remise à zéro. Êtes-vous certain(e) de vouloir continuer?",
        resetVesting:
          "Vous avez actuellement une bond en cours d'acquisition. Si vous achetez une nouvelle bond, la période d'acquisition et les potentielles récompenses seront remises à zéro. Nous vous recommandons de commencer par réclamer vos récompenses, ou d'utiliser un autre portefeuille. Êtes-vous certain(e) de vouloir continuer?",
        fourFourInfo:
          "Note: L'bond (4,4) va staker vos CLAMs dès le début, de façon à vous faire gagner les récompenses de staking tout au long de la période d'acquisition. Une vois complètement acquises, vous n'aurez qu'à réclamer vos sClam.",
        approvalInfo:
          'Note: La transaction "Approuver" est seulement nécessaire lors de la première acquisition d\'bonds; l\'achat d\'bonds subséquent ne nécessitera qu\'une unique transaction de "Bond".',
        roiFourFourInfo:
          '* Le Retour sur Investissement des oblications (4,4) inclut les récompenses de staking sur 5 jours',

        youWillGet: 'Vous Obtenez',
        maxBuy: 'Max que vous puissiez acheter',
      },
      redeem: {
        fullyVestedPopup: "Vous ne pouvez réclamer vos bonds (4,4) qu'une fois la période d'acquisition complétée.",
        claimAndAutostake: 'Réclamer et Staker automatiquement',
        pendingRewards: 'Récompenses en Attente',
        claimableRewards: 'Récompenses Réclamables',
        timeUntilFullyVested: "Temps restant pour la période d'acquisition",
      },
    },
    // src\views\Landing
    landing: {
      description: {
        part1: 'La Memecoin',
        part2: 'de Réserve Décentralisée',
        tagline: 'La première réserve de valeur sous forme de meme',
      },
      appButton: "Lancer l'APP",
      footer: {
        joinOurCommunity: 'Rejoignez notre Communauté',
        letsMakeIt: 'Faisons-le',
        contactUs: 'Contactez Nous',
      },
      splashPage: {
        howOtterClamWorks: 'Comment fonctionne OtterClam',
        treasuryRevenue: 'Revenus de la Trésorerie',
        bondsLPFees: "Frais d'bonds et de jetons LP",
        bondSales:
          "La vente d'bonds et les frais liés aux jetons de liquidité permettent d'accroître la trésorerie, et permettent de contrôler la liquidité et l'offre des CLAMs",
        treasuryGrowth: 'Croissance de la trésorerie',
        otterTreasury: 'Trésorerie des Loutres',
        treasuryInflow:
          "Les rentrées de trésorerie sont utilisées pour accroître la balance de trésorerie des Loutres, s'assurer de pouvoir supporter les jetons CLAMs, et réguler l'APY de staking.",
        stakingRewards: 'Récompenses de Staking',
        clamToken: 'jeton CLAM',
        compounds:
          'Compose les gains automatiquement via une memecoin dont la valeur intrinsèque est supportée par la trésorerie',
        treasuryBalance: 'Balance de la Trésorerie',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'CLAM Staking',
      connectWalletDescription: 'Connectez votre portefeuille pour staker vos jetons CLAM!',
      approvalInfo:
        "Note: La transaction \"Approuver\" n'est nécessaire que pour la première transaction de staking/unstaking; les opérations subséquentes de staking/unstaking n'ont pas besoin d'approbation",
      balanceInWarmup: 'Votre balance de staking en préparation',
      stakedBalance: 'Votre balance de staking',
      nextRewardAmount: 'Montant de votre prochaine récompense',
      nextRewardYield: 'Rendement de la prochaine récompense',
      roiFiveDay: 'RSI (ratio sur 5 jours)', //Return on Investment
    },
    // src\views\Calculator
    calculator: {
      current: 'Actuel',
      estimateReturns: 'Estimez vos gains',
      yoursClamBalance: 'Votre balance de sCLAM',
      sClamAmount: 'Montant de sCLAM',
      purchasePrice: "Prix du CLAM au moment de l'achat ($)",
      futurePrice: 'Futur prix du CLAM sur le marché ($)',
      results: 'Resultats',
      initialInvestment: 'Votre investissement initial',
      currentWealth: 'Valeur actuelle',
      rewardEstimation: 'Estimation des récompenses en CLAM',
      potentialReturn: 'Retour potentiel',
      potentialPercentageGain: 'Pourcentage de gains potentiel',
    },
    // src\components
    components: {
      staked: 'Staké',
      notStaked: 'Non staké',
      disconnect: 'Déconnexion',
      buy: 'ACHAT',
      buyOnQuickswap: 'Achetez sur Quickswap',
      addTokenToWallet: 'AJOUTER LE JETON À VOTRE PORTEFEUILLE',
      toNextHarvest: "jusqu'à la prochaine récolte",
      harvesting: 'En cours de récolte',
      name: 'Nom',
    },
  },
};
export default French;
