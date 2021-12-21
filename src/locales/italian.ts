const Italian = {
  translation: {
    common: {
      //Only change the text on the right in quote marks!
      language: 'Lingua',
      bond: 'Bond', //TODO
      stake: 'Stake', //TODO
      unstake: 'Unstake',
      staking: 'staking',
      migrate: 'Migrazione',
      roi: 'ROI', //Return on Investment
      max: 'Max',
      apy: 'APY', //Annualised Percentage Yield
      tvl: 'TVL', //Total Value Locked
      amount: 'Importo',
      approve: 'Approva',
      claim: 'Richiedi',
      clamPrice: 'Prezzo di CLAM',
      connectWallet: 'Connetti il Wallet',
      price: 'Prezzo',
      buy: 'Compra',
      buyThing: 'Compra ', //e.g. "Buy CLAM", "Buy sCLAM"
      addLiquidity: 'Aggiungi Liquidità',
      redeem: 'Riscatta',
      treasuryBalance: 'Bilancio del Tesoro',
      currentIndex: 'Indice Attuale',
      yourBalance: 'Il tuo Bilancio',
      currentApy: 'APY Attuale',
      dashboard: 'Dashboard',
      calculator: 'Calcolatore',
      helpTranslate: 'Aiutaci a Tradurre',
    },
    time: {
      days: 'Giorni',
      hours: 'Ore',
      hour: 'Ora',
      minutes: 'Minuti',
      minute: 'Minuto',
      seconds: 'Secondi',
      second: 'Secondo',
      today: 'Oggi',
    },
    // src\views\Dashboard
    dashboard: {
      marketCap: 'Cap. di Mercato',
      stakingRatio: 'Tasso di Staking', //TODO
      circulatingSupply: 'Offerta Circolante',
      backingPerClam: 'Supporto per CLAM', //TODO REVIEW
      otterKingdom: 'Benvenuto nel Regno delle Lontre',
      decentralized: 'La Memecoin di Riserva Decentralizzata',
      clamStaked: 'CLAM in Stake',
      apyOverTime: 'APY nel tempo',
      runway: 'Runway disponibile',
      totalValueDeposited: 'Valore Totale Depositato',
      marketValue: 'Valore di Mercato degli Asset del Tesoro',
      riskFree: 'Valore Risk Free degli Assets del Tesoro',
      pol: 'Liquidità di Prorietà del Protocollo',
      tooltipItems: {
        tvl: 'Valore Totale Depositato',
        current: 'Attuale',
        lpTreasury: 'LP del Tesoro',
        marketLP: 'LP di Mercato',
      },
      tooltipInfoMessages: {
        tvl: "Valore Totale Bloccato, è l'importo in dollari di tutti i CLAM in stake nel protocollo. Questa metrica è spesso usata come indicatore di crescita o di salute nei progetti DeFi.",
        mvt: 'Valore di Mercato degli Asset del Treasury, è la somma del valore (in dollari) di tutti gli asset posseduti dal tesoro.',
        rfv: "Valore Risk Free, è l'importo di fondi che il tesoro usa a garanzia di CLAM.",
        pol: 'Lìquidità Posseduta dal Protocollo, è la quantità di LP che il tesoro possiede e controlla. Più elevata è la POL meglio è per il protocollo e i suoi utenti.',
        holder: 'Detentori, rappresenta il numero totale di  lontre (detentori di sCLAM)',
        staked: 'CLAM Staked, è il rapporto di sCLAM con CLAM (staked vs unstaked)',
        apy: 'Annual Percentage Yield, è la rappresentazione normalizzata di un tasso di interesse, bassata su un periodo di composizione in un anno. Nota che le APY fornite sono più che altro indicatori di livello di riferimento e non sono risultati futuri precisi.', // ballpark ?
        runway:
          'Runway, è il numero di giorni per cui le emissioni di  sCLAM sono sostenibili ad un certo tasso di interesse. APY più basso = runway più lungo',
        currentIndex:
          "L'indice attuale traccia la quantità di sCLAM accumulati dall'inizio dello staking. In pratica, quanti sCLAM un holder potrebbe possedere se avesse detenuto e messo in stake un CLAM dal giorno 1.",
      },
    },
    // src\views\Migrate
    migrate: {
      migration: 'Migrazione',
      oldClamSupply: 'Vecchia Fornitura di CLAM ',
      oldTreasuryReserve: 'Vecchia Riserva del Tesoro',
      migrationProgress: 'Avanzamento della Migrazione',
      connectWalletDescription: 'Connetti il tuo wallet per migrare i tuoi token CLAM !',
      steps: 'Passi',
      yourAmount: 'Il tuo importo',
      claimWarmup: 'Claim Warmup',
      done: 'FINITO',
      unstakeClam: 'Unstake CLAM',
      migrateTo: 'Migra da CLAM a CLAM',
      estimatedClamTwo: 'CLAM Stimati ',
      yourClamTwoBalance: 'Il tuo bilancio in CLAM',
    },
    // src\views\Bond
    bonds: {
      debtRatio: 'Tasso di Debito',
      vestingTerm: "Termine dell'acquisizione",
      recipient: 'Destinatario',
      purchased: 'Acquistato',
      bondPrice: 'Prezzo dei Bond',
      deprecated: 'Deprecato',
      bondDiscount: 'di sconto!',
      myBond: 'I miei Bond',
      fullyVested: 'Maturato Completamente',
      fullyVestedAt: 'Maturato Completamente il',
      advancedSettings: {
        txrevert: 'La Transazione potrebbe tornare indietro se il prezzo cambia più dello slippage %', //TODO revert
        recipientAddress:
          "Scegli l'indirizzo di ricevimento. Di default, questo è il tuo indirizzo attualmente connesso",
      },
      purchase: {
        noValue: 'Immetti un valore!',
        invalidValue: 'Immetti un valore valido!',
        resetVestingAutostake:
          'Hai già un bond in corso. Il Bonding azzererà il tuo periodo di acquisizione. Vuoi procedre?',
        resetVesting:
          'Hai già un bond in corso. Il Bonding azzererà il tuo periodo di acquisizione e ti farà perdere le ricompense. Raccomandiamo di effettuare prima il claim delle ricompense o usare un nuovo wallet. Vuoi comunque procedere?',

        fourFourInfo:
          "Nota: Il bond (4, 4) metterà in staking tutti i CLAMs all'inizio, quindi guadagnerai tutte le ricompense di rebase durante il periodo di acquisizione. A acquisizione completata, potrai soltanto fare il claim di sClam.",
        approvalInfo:
          'Nota: La transazione di "Approve" è necessaria solo quando effettui il bonding per la prima volta; i bonding successivi richiederanno soltanto che venga effettuata la transazione di "Bond".',
        roiFourFourInfo: '* La ROI dei bond (4,4) include le ricompense dello staking di 5 giorni',

        youWillGet: 'Otterrai',
        maxBuy: 'Massimo che puoi acquistare',
      },
      purchaseDialog: {
        bondSuccessful: 'Il tuo bond è andato a buon fine.',
      },
      redeem: {
        fullyVestedPopup: 'Puoi fare il claim del bond  (4,4) dopo che è completamente maturato.',
        claimAndAutostake: 'Claim e Autostake',
        pendingRewards: 'Ricompense in attesa',
        claimableRewards: 'Ricompense richiedibili',
        timeUntilFullyVested: 'Tempo rimanente alla fine della maturazione',
      },
    },
    // src\views\Landing
    //decentralized reserve currency protocol protocollo di valuta di riserva decentralizzato
    landing: {
      description: {
        part1: 'La Memecoin ', //REVIEW
        part2: 'di Riserva Decentralizzata', //REVIEW
        tagline: 'Il primo meme riserva di valore', //REVIEW
      },
      appButton: "Accedi all'APP",
      footer: {
        joinOurCommunity: 'Unisciti alla Nostra Community',
        letsMakeIt: 'Facciamolo!',
        contactUs: 'Contatti',
      },
      splashPage: {
        howOtterClamWorks: 'Come funziona OtterClam',
        treasuryRevenue: 'Ricavi del Tesoro',
        bondsLPFees: 'Commissioni di Bonds e LP',
        bondSales:
          'Le commissioni delle vendite di Bond e dei LP aumentano il Ricavo del Tesoro delle Lontre, mantengono la liquidità e aiutano il controllo della fornitura di CLAM',
        treasuryGrowth: 'Crescita del Tesoro',
        otterTreasury: 'Tesoro delle Lontre',
        treasuryInflow:
          "L'afflusso del Tesoro è usato per aumentare il saldo del Tesoro delle Lontre, garantire i token CLAM in sospeso e regolare l'APY di staking",
        stakingRewards: 'Ricompense di Staking',
        clamToken: 'Token CLAM',
        compounds:
          'Compone i rendimenti automaticamente attraverso una memecoin con valore intrinseco garantita dal tesoro',
        treasuryBalance: 'Saldo del Tesoro',
        totalStaked: 'Totale in Staking',
      },
    },
    // src\views\Stake
    stake: {
      clamStaking: 'Staking CLAM',
      connectWalletDescription: 'Connetti il tuo wallet per mettere in stake token CLAM!',
      approvalInfo:
        'Nota: La transazione di "Approve" è necessaria soltanto quando fai staking/unstaking la prima volta; staking/unstaking successivi richiedono soltanto che tu faccia la transazione di "Stake" o "Unstake".',
      balanceInWarmup: 'Il tuo Saldo in Stake in warmup',
      stakedBalance: 'Il tuo Sado in Staking',
      nextRewardAmount: 'Importo della prossima Ricompensa',
      nextRewardYield: 'Prossima Ricompensa Maturata',
      roiFiveDay: 'ROI (Tasso in 5 giorni)', //Return on Investment
      stakeSuccessful: 'Il tuo stake è andato a buon fine',
      unstakeSuccessful: 'Il tuo unstake è andato a buon fine',
      youReceived: 'Hai appena ricevuto ',
    },
    // src\views\Calculator
    calculator: {
      current: 'Corrente',
      estimateReturns: 'Stima i tuoi ricavi',
      yoursClamBalance: 'Il tuo bilancio in sCLAM',
      sClamAmount: 'Quantità di sCLAM',
      purchasePrice: "Prezzo di CLAM all'acquisto ($)",
      futurePrice: 'Prezzo di Mercato futuro di CLAM ($)',
      results: 'Risultati',
      initialInvestment: 'Il tuo investimento iniziale',
      currentWealth: 'Salute corrente',
      rewardEstimation: 'Stima delle ricompense in CLAM',
      potentialReturn: 'Ritorno potenziale',
      potentialPercentageGain: 'Guadagno percentuale potenziale',
    },
    // src\components
    components: {
      staked: 'in Staking',
      notStaked: 'Non in Staking',
      disconnect: 'Disconnetti',
      buy: 'COMPRA',
      buyOnQuickswap: 'Compra su Quickswap',
      addTokenToWallet: 'AGGIUNGI IL TOKEN AL WALLET',
      toNextHarvest: 'al prossimo Harvest', //TODO
      harvesting: 'Harvesting', //TODO
      name: 'Nome',
    },
    // src\components\NFT
    nft: {
      which: 'Che ',
      willYouGet: ' otterrai?',
      safehandDescription:
        'In Premio a ogni Lontra che ha messo in staking per un minimo di due settimane più di 4 sCLAM alla data di rilascio.',
      furryhandDescription:
        'In Premio a ogni Lontra che ha messo in staking per un minimo di due settimane più di 40 sCLAM alla data di rilascio',
      stonehandDescription:
        'In premio ai wallet con più di 56 sCLAM che hanno fatto staking dal 9/11 alla data di rilascio.',
      diamondhandDescription:
        "In premio per chi ha in staking l'intera quantita di CLAM dalla IDO o dalla data di lancio (3/11, con un minimo di 20 sCLAM) fino alla data di rilascio",
      giveawayParty: 'Giveaway Party',
      giveawayPartyHeld: 'giveaway party si terrà il',
      airdropCountdown: "Conto alla Rovescia per l'Airdrop",
    },
  },
};
export default Italian;
