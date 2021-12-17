const Norwegian = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Språk',
      bond: 'Kjøp',
      stake: 'Stake',
      migrate: 'Migrering',
      roi: 'ROI', //Avkastning på Investering
      max: 'Maks',
      apy: 'APY', //Årlig prosentvis avkastning
      tvl: 'TVL', //Totalverdi staket
      amount: 'Beløp',
      approve: 'Godkjenn',
      claim: 'Krev inn',
      clamPrice: 'Pris per CLAM',
      connectWallet: 'Koble til Wallet',
      price: 'Pris',
      buy: 'Kjøp',
      buyThing: 'Kjøp ', //e.g. "Buy CLAM", "Buy sCLAM"
      addLiquidity: 'Legg til likviditet',
      redeem: 'Løse inn',
      treasuryBalance: 'Saldo på verdireservene',
      currentIndex: 'Nåværende Index',
      yourBalance: 'Din Saldo',
      currentApy: 'Nåværende APY',
      dashboard: 'Dashboard',
      calculator: 'Kalkulator',
    },
    time: {
      days: 'Dager',
      hours: 'Timer',
      minutes: 'Minutter',
      seconds: 'Sekunder',
      today: 'I dag',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'Markedsverdi',
      stakingRatio: 'Prosent staket',
      circulatingSupply: 'Antall tokens i omløp',
      backingPerClam: 'Dollarverdi som støtter hver CLAM',
      otterKingdom: 'Velkommen til Oter-riket',
      decentralized: 'Den desentraliserte cryptovalutastandarden',
      clamStaked: 'CLAM Staket',
      apyOverTime: 'APY over tid',
      runway: 'Runway tilgjengelig',
      totalValueDeposited: 'Totalverdi staket',
      marketValue: 'Markedsverdi på verdireservene',
      riskFree: 'Risikofri verdi på verdireservene',
      pol: 'Protokolleid likviditet',
      tooltipItems: {
        tvl: 'Totalverdi deponert',
        current: 'Nåværende',
        lpTreasury: 'LP Verdireserver',
        marketLP: 'Markeds LP',
      },
      tooltipInfoMessages: {
        tvl: 'Total Value Locked (TVL), er dollarverdien av alle CLAM  som er staket i protokollen. Denne beregningen er ofte brukt som en vekst- eller helse-indikator i DeFi prosjekter.',
        mvt: 'Markedsverdi på verdireservene er formueverdien i dollar på alle aktiva i verdireservene.',
        rfv: 'Risikofri verdi på verdireservene er formueverdien i dollar på alle aktiva i verdireservene som man kan garantere støtter opp CLAM.',
        pol: 'Protokolleid likviditet er mengden LP (Liquidity pools) som eies og kontrolleres av protokollen. The more POL the better for the protocol and its users.',
        holder: 'Holdere, er det totale antalle Oters (sCLAM holdere)',
        staked: 'Prosent staket, er forholdet mellom sCLAM og CLAM (Mengde staket per ustakede tokens)',
        apy: 'Annual Percentage Yield (APY), er den årlige prosentvise avkastningen, med andre ord så er det rentesrente over et helt år. Merk deg at det er med antagelsene om at mengden du får vet hver rebase ikke forandrer seg.',
        runway: 'Runway er antall dager nåværende justeringsutslipp på sCLAM kan vedvare. Lavere APY = lenger runway',
        currentIndex:
          'Nåværende index sporer mengden sCLAM som er akumulert siden stakingen begynte. Altså hvor mange sCLAM man ville hatt hvis man staket en stk CLAM fra første stund.',
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migrering',
      oldClamSupply: 'Gammel CLAM i omløp',
      oldTreasuryReserve: 'Gamle Verdireserver',
      migrationProgress: 'Migrasjonsfremgang',
      connectWalletDescription: 'Koble din crypto-wallet for å migrere dine gamle CLAM token!',
      steps: 'Steg',
      yourAmount: 'Din Saldo',
      claimWarmup: 'Krev inn warmup-tokens',
      done: 'FERDIG',
      unstakeClam: 'Avstak dine CLAM',
      migrateTo: 'Migrere CLAM til CLAM',
      estimatedClamTwo: 'Estimerte CLAM ',
      yourClamTwoBalance: 'Din CLAM Saldo',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Gjeldsforhold',
      vestingTerm: 'Forfallstid',
      recipient: 'Mottaker',
      purchased: 'Kjøpt',
      bondPrice: 'Obligasjonspris',
      deprecated: 'Avviklet',
      bondDiscount: 'rabatt!',
      myBond: 'Mine Obligasjoner',
      advancedSettings: {
        txrevert: 'Transaksjonen kan bli avbrutt hvis prisen forandrer seg mer enn prosent slippage som er valgt',
        recipientAddress: 'Velg Mottakeraddresse. Som standard er dette samme addresse som du er koblet til nå.',
      },
      purchase: {
        noValue: 'Tast inn et beløp!',
        invalidValue: 'Tast inn et gyldig beløp!',
        resetVestingAutostake:
          'Du har en aktiv obligasjon. En ny obligasjon vil tilbakestille forfallstiden din. Vil du fortsette?',
        resetVesting:
          'Du har en aktiv obligasjon. En ny obligasjon vil tilbakestille forfallstiden din og gå glipp av belønningne. Vi anbefaler at du først krever inn belønningene eller bruke en annen crypto-wallet. Vil du fortsette?',

        fourFourInfo:
          'NB: Den såkalte (4, 4) obligasjonen vil stake alle CLAM fra begynnelsen av, så du vil tjene på alle rebase under forfallstiden. Når obligasjonen er forfalt så kan du kreve inn sClam belønningene som da har vokst.',
        approvalInfo:
          'NB: Du behøver kun å trykke "Godkjenn" når du kjøper en obligasjon den første gangen. Neste gangene så krever det kun at du trykker "kjøp".',
        roiFourFourInfo: '* avkastningen (ROI) av (4,4) obligasjoner inkluderer 5-dagers stakinggevinst',

        youWillGet: 'Du vil få',
        maxBuy: 'Maksimum du kan kjøpe',
      },
      redeem: {
        fullyVestedPopup: 'Du kan bare kreve inn gevinsten fra (4,4) obligasjoner etter forfallstiden.',
        claimAndAutostake: 'Krev inn og auto-stake',
        pendingRewards: 'Avventende gevinst',
        claimableRewards: 'Innkrevbar gevinst',
        timeUntilFullyVested: 'Tid til forfall',
      },
    },
    // src\views\Landing
    landing: {
      description: {
        part1: 'Den desentraliserte',
        part2: 'cryptovalutastandarden',
        tagline: 'Den første meme-kjøpekraftreserven',
      },
      appButton: 'Gå til appen',
      footer: {
        joinOurCommunity: 'Bli med i fellesskapet vårt!',
        letsMakeIt: "Let's make it",
        contactUs: 'Kontakt oss',
      },
      splashPage: {
        howOtterClamWorks: 'Hvordan OtterClam fungerer',
        treasuryRevenue: 'Verdireserve inntekter',
        bondsLPFees: 'Obligasjoner & LP gebyrer',
        bondSales:
          'Salg av obligasjoner og LP (Liquidity pool) gebyrer øker OtterClams verdireserver og låser inn likviditet og hjelper til med å kontrollere omløpsmengden',
        treasuryGrowth: 'Verdireserve vekst',
        otterTreasury: 'OtterClams verdireserver',
        treasuryInflow:
          'Verdireserve innflyt blir brukt til å øke OtterClams verdireservesaldo og øke støtten av nåværende CLAM token samt regulere gevinsten fra staking',
        stakingRewards: 'Staking gevinst',
        clamToken: 'CLAM Token',
        compounds: 'Automatisert rentesrente gjennom en memecrypto med grunnleggende egenverdi',
        treasuryBalance: 'Verdireserve saldo',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'CLAM Staking',
      connectWalletDescription: 'Koble til din crypto-wallet for å stake CLAM!',
      approvalInfo:
        'NB: Du behøver kun å trykke "Godkjenn" når du staker eller avstaker for første gang. Alle andre ganger du gjør det så behøver du kun å "Stake" eller "Avstake".',
      balanceInWarmup: 'Din stakede saldo i warmup modus',
      stakedBalance: 'Din stakede saldo',
      nextRewardAmount: 'Neste rebase gevinst',
      nextRewardYield: 'Neste rebase prosentvis gevinst',
      roiFiveDay: 'ROI (5-Dagers rate)', ////Avkastning på Investering
    },
    // src\views\Calculator
    calculator: {
      current: 'Nåværende',
      estimateReturns: 'Estimat av avkastning',
      yoursClamBalance: 'Din sCLAM saldo',
      sClamAmount: 'sCLAM Beløp',
      purchasePrice: 'CLAM Pris ved kjøp ($)',
      futurePrice: 'CLAMs fremtidige pris ($)',
      results: 'Resultater',
      initialInvestment: 'Din opprinnelige investering',
      currentWealth: 'Nåværende formue',
      rewardEstimation: 'CLAM gevinst estimat',
      potentialReturn: 'Potensiell avkastning',
      potentialPercentageGain: 'Potensiell prosentvis avkastning',
    },
    // src\components
    components: {
      staked: 'Staket',
      notStaked: 'Ikke staket',
      disconnect: 'Koble av',
      buy: 'KJØP',
      buyOnQuickswap: 'Kjøp på Quickswap',
      addTokenToWallet: 'LEGG TIL TOKEN I DIN WALLET',
      toNextHarvest: 'til neste justering',
      harvesting: 'Justering',
      name: 'Navn',
    },
    // src\components\NFT
    nft: {
      which: 'Hvilken ',
      willYouGet: ' kommer du til å få?',
      safehandDescription: 'Gis til alle Otere som har staket over 4 sCLAM i minst to uker på airdrop datoen.',
      furryhandDescription: 'Gis til alle Otere som har staket over 40 sCLAM i minst to uker på airdrop datoen',
      stonehandDescription: 'Gis til alle Otere som har staket over 56 sCLAM fra 11/9 frem til airdrop datoen.',
      diamondhandDescription:
        'Gis til alle Otere som har staket CLAM fra IDO eller startdatoen, 11/3, med minimum 20 sCLAM frem til airdrop datoen.',
    },
  },
};
export default Norwegian;
