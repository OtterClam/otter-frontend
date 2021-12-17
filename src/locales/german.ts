const German = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Sprache',
      bond: 'Bond',
      stake: 'Stake',
      unstake: 'Unstake',
      migrate: 'Migration',
      roi: 'ROI', //Return on Investment
      max: 'Max',
      apy: 'APY', //Annualised Percentage Yield
      tvl: 'TVL', //Total Value Locked
      amount: 'Menge',
      approve: 'Akzeptieren',
      claim: 'Beanspruchen',
      clamPrice: 'CLAM Preis',
      connectWallet: 'Wallet Verbinden',
      price: 'Preis',
      buy: 'Kaufen',
      buyThing: 'Kaufe ', //e.g. "Buy CLAM", "Buy sCLAM"
      addLiquidity: 'Liquidität hinzufügen',
      redeem: 'Einlösen',
      treasuryBalance: 'Treasury Bestand',
      currentIndex: 'Jetziger Index',
      yourBalance: 'Ihr Bestand',
      currentApy: 'Momentane APY',
      dashboard: 'Dashboard',
      calculator: 'Taschenrechner',
      helpTranslate: 'Hilf uns beim Übersetzen',
    },
    time: {
      days: 'Tage',
      day: 'Tag',
      hours: 'Stunden',
      hour: 'Stunde',
      minutes: 'Minuten',
      minute: 'Minute',
      seconds: 'Sekunden',
      second: 'Sekunde',
      today: 'Heute',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'Marktkapitalisierung',
      stakingRatio: 'Staking Verhältnis',
      circulatingSupply: 'Umlaufversorgung',
      backingPerClam: 'Unterstützung pro CLAM',
      otterKingdom: 'Willkommen im Otter Königreich',
      decentralized: 'Der dezentrale Reserve-Memecoin',
      clamStaked: 'CLAM Staked',
      apyOverTime: 'APY im Laufe der Zeit',
      runway: 'Runway Verfügbar',
      totalValueDeposited: 'Hinterlegte Gesamtbetrag',
      marketValue: 'Marktwert von Treasury Assets',
      riskFree: 'Risikofreier Wert von Treasury-Assets',
      pol: 'Protokolleigene Liquidität',
      tooltipItems: {
        tvl: 'Gesamtbetrag hinterlegt',
        current: 'Aktuell',
        lpTreasury: 'LP Treasury',
        marketLP: 'Markt LP',
      },
      tooltipInfoMessages: {
        tvl: 'Der hinterlegte Gesamtwert ist der Dollarbetrag aller CLAM, die im Protokoll verwendet werden. Diese Kennzahl wird häufig als Wachstums- oder Gesundheitsindikator in DeFi-Projekten verwendet.',
        mvt: 'Marktwert der Vermögenswerte des Treasury, ist die Summe des Wertes (in Dollar) aller Vermögenswerte, die vom Treasury gehalten werden.',
        rfv: 'Risikofreier Betrag, ist der Betrag der Mittel, die das Treasury garantiert, um CLAM abzudecken.',
        pol: 'Protokolleigene Liquidität, ist die Menge an LP, die das Treasury besitzt und kontrolliert. Je mehr POL, desto besser für das Protokoll und seine Nutzer.',
        holder: 'Halter, steht für die Gesamtzahl der Otter (sCLAM-Inhaber)',
        staked: 'CLAM Staked, ist das Verhältnis von sCLAM zu CLAM (Staked vs. Unstaked)',
        apy: 'Die jährliche prozentuale Rendite ist die normalisierte Darstellung eines Zinssatzes basierend auf einer Zinsperiode über ein Jahr. Beachten Sie, dass die bereitgestellten APYs eher Standardindikatoren als sehr genaue zukünftige Ergebnisse sind.',
        runway:
          'Runway, ist die Anzahl der Tage, an denen sCLAM-Emissionen mit einer bestimmten Rate aufrechterhalten werden können. Niedrigerer APY = längere Runway',
        currentIndex:
          'Der aktuelle Index spiegelt die Menge an sCLAM wider, die seit Beginn des Staking angesammelt wurde. Im Wesentlichen wie viel sCLAM Sie hätten, wenn Sie ab Tag 1 eine einzelne CLAM staken und halten würden.',
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migration',
      oldClamSupply: 'Altes CLAM Supply',
      oldTreasuryReserve: 'Alte Treasury Reserve',
      migrationProgress: 'Migrationsfortschritt',
      connectWalletDescription: 'Verbinden Sie Ihre Wallet, um Ihre CLAM-Token zu migrieren!',
      steps: 'Schritte',
      yourAmount: 'Ihre Menge',
      claimWarmup: 'Warmup beanspruchen',
      done: 'FERTIG',
      unstakeClam: 'CLAM unstaken',
      migrateTo: 'Migriere von CLAM zu CLAM',
      estimatedClamTwo: 'Erwartete CLAM ',
      yourClamTwoBalance: 'Ihr CLAM Bestand',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Schuldenquote',
      vestingTerm: 'Ausübungsfrist',
      recipient: 'Empfänger',
      purchased: 'Gekauft',
      bondPrice: 'Bond Preis',
      deprecated: 'Veraltet',
      bondDiscount: 'Rabatt!',
      myBond: 'Meine Bond(s)',
      fullyVested: 'Vollständig gebunden',
      fullyVestedAt: 'Vollständig gebunden für',
      advancedSettings: {
        txrevert:
          'Die Transaktion kann rückgängig gemacht werden, wenn sich der Preis um mehr als die Slippage % ändert',
        recipientAddress: 'Wählen Sie die Empfängeradresse. Standardmäßig ist dies Ihre aktuell verbundene Adresse',
      },
      purchase: {
        noValue: 'Bitte einen Wert eingeben!',
        invalidValue: 'Bitte geben Sie einen gültigen Wert ein!',
        resetVestingAutostake:
          'Sie haben eine bestehende Bond. Der Bond setzt Ihre Sperrfrist zurück. Möchten Sie dennoch fortführen?',
        resetVesting:
          'Sie haben einen bestehenden Bond. Die Anleihe setzt Ihre Ausübungsfrist zurück und die Prämien verfallen. Wir empfehlen, zuerst Belohnungen einzufordern oder eine neue Wallet zu verwenden. Möchten Sie trotzdem weitermachen?',

        fourFourInfo:
          'Hinweis: Die (4, 4)-Bonds setzen zu Beginn alle CLAMs ein, sodass Sie während der Laufzeit alle Rebase-Belohnungen verdienen. Sobald es vollständig übertragen wurde, können Sie nun sClam beanspruchen.',
        approvalInfo:
          'Hinweis: Die Transaktion "Genehmigen" wird nur beim erstmaligen Bonden benötigt; für die anschließende Verklebung müssen Sie lediglich die Transaktion „Beanspruchen“ durchführen.',
        roiFourFourInfo: '* Der ROI von (4,4) Bonds beinhaltet eine 5-tägige Staking-Belohnung',

        youWillGet: 'Sie werden bekommen',
        maxBuy: 'Maximaler Betrag, den Sie kaufen können',
      },
      purchaseDialog: {
        bondSuccessful: 'Dein Bond war erfolgreich!',
      },
      redeem: {
        fullyVestedPopup:
          'Sie können eine (4,4)-Bond erst beanspruchen, nachdem diese vervollständigt wurde (5 Tage Wartezeit).',
        claimAndAutostake: 'Beanspruchen und Autostake',
        pendingRewards: 'Ausstehende Belohnungen',
        claimableRewards: 'Einlösbare Belohnungen',
        timeUntilFullyVested: 'Zeit bis zur vollständigen Übernahme',
      },
    },
    // src\views\Landing
    landing: {
      description: {
        part1: 'Die dezentrale',
        part2: 'Memecoin Reserve',
        tagline: 'Das erste Wertaufbewahrungsmeme',
      },
      appButton: 'Zur APP',
      footer: {
        joinOurCommunity: 'tritt unserer Gemeinschaft bei',
        letsMakeIt: "Let's make it",
        contactUs: 'Kontaktiere uns',
      },
      splashPage: {
        howOtterClamWorks: 'So funktioniert OtterClam',
        treasuryRevenue: 'Einnahmen vom Treasury',
        bondsLPFees: 'Bonds & LP Gebühren',
        bondSales:
          'Bondverkäufe und LP-Gebühren erhöhen den Treasury-Ertrag von Otter, binden Liquidität und helfen, das CLAM-Angebot zu kontrollieren',
        treasuryGrowth: 'Treasury Wachstum',
        otterTreasury: 'Tresor der Otter',
        treasuryInflow:
          'Der Zufluss von Treasury wird verwendet, um das Treasury von Otter zu erhöhen und ausstehende CLAM-Token zu decken und das Staking von APY zu regulieren',
        stakingRewards: 'Staking Prämien',
        clamToken: 'CLAM Token',
        compounds: 'Compounds Renditen automatisch durch einen Treasury-Backed Memecoin mit intrinsischem Wert',
        treasuryBalance: 'Treasury',
        totalStaked: 'Gesamt gestaket',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'CLAM Staking',
      connectWalletDescription: 'Verbinden Sie Ihre Wallet mit CLAM-Tokens!',
      approvalInfo:
        'Hinweis: Die Transaktion "Genehmigen" wird nur beim erstmaligen Staken/Unstaken benötigt; nachfolgendes Staking/Unstaking erfordert lediglich, dass Sie die Transaktion „Stake“ oder „Unstake“ durchführen.',
      balanceInWarmup: 'Dein eingesetztes Guthaben im Warmup',
      stakedBalance: 'Ihr eingesetztes Guthaben',
      nextRewardAmount: 'Nächster Prämienbetrag',
      nextRewardYield: 'Nächste Belohnungsausbeute',
      roiFiveDay: 'ROI (5-Tage-Rate)', //Return on Investment
      stakeSuccessful: 'Dein Stake war erfolgreich!',
      unstakeSuccessful: 'Dein Unstake war erfolgreich!',
      youReceived: 'Du hast gerade erhalten ',
    },
    // src\views\Calculator
    calculator: {
      current: 'Jetzt',
      estimateReturns: 'Schätzen Sie Ihre Renditen',
      yoursClamBalance: 'Ihr sCLAM Guthaben',
      sClamAmount: 'sCLAM Betrag',
      purchasePrice: 'CLAM Preis beim Kauf ($)',
      futurePrice: 'Zukünftiger CLAM-Marktpreis ($)',
      results: 'Ergebnisse',
      initialInvestment: 'Ihre Anfangsinvestition',
      currentWealth: 'Aktueller Reichtum',
      rewardEstimation: 'CLAM Belohnungsschätzung',
      potentialReturn: 'Potenzielle Rendite',
      potentialPercentageGain: 'Potenzieller prozentualer Gewinn',
    },
    // src\components
    components: {
      staked: 'Staked',
      notStaked: 'Nicht staked',
      disconnect: 'Verbindung trennen',
      buy: 'KAUFEN',
      buyOnQuickswap: 'Erwirbbar auf Quickswap',
      addTokenToWallet: 'TOKEN ZUM WALLET HINZUFÜGEN',
      toNextHarvest: 'zur nächsten Ernte',
      harvesting: 'Ernten',
      name: 'Name',
    },
    // src\components\NFT
    nft: {
      which: 'Welches ',
      willYouGet: ' wirst du bekommen?',
      safehandDescription:
        'Wird jedem Otter verliehen, der mindestens 2 Wochen mit mehr als 4 sCLAM am Drop-Datum gestaked hat.',
      furryhandDescription:
        'Verliehen an jeden Otter, der mindestens 2 Wochen mit mehr als 40 sCLAM am Drop-Datum gestaked hat',
      stonehandDescription: 'Verliehen an Wallets mit über 56 sCLAM, die vom 09.11. bis zum Drop-Datum gestaked haben.',
      diamondhandDescription:
        'Verliehen für das Staken der vollen CLAM-Menge vom IDO oder dem Startdatum (11.03., mit einem Minimum von 20 sCLAM) bis zum Drop-Datum',
      giveawayParty: 'Geschenkeparty',
      giveawayPartyHeld: 'Geschenkeparty ist am',
    },
  },
};
export default German;
