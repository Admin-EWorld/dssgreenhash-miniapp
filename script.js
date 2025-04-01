// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing script...");

    // State variables
    let miningRate = 0;
    let hashPower = 0;
    let balance = 0;
    let earnings = 0;
    let rewards = 0;
    let selectedCoin = "TON";
    let selectedLanguage = "en"; // Default language is English
    let miningInterval;
    let coinPrices = {
        TON: 4.12,  // Default price, will be updated by fetch
        BTC: 60000,  // Approximate price in USD
        USDT: 1      // Stablecoin, pegged to USD
    };

    // Translations for different languages
    const translations = {
        en: {
            welcome: "Welcome to DSS GreenHash",
            selectCoin: "Select a coin to start mining:",
            selectLanguage: "Select your language:",
            proceed: "Proceed",
            homeTab: "Home",
            boostTab: "Boost",
            friendsTab: "Friends",
            earnTab: "Earn",
            moreTab: "More",
            dssGreenHash: "DSS GreenHash",
            miningRate: "Mining Rate:",
            perHour: "/hr",
            priceLabel: "Price: $",
            balance: "Balance:",
            rewards: "Rewards:",
            estMonthlyEarnings: "Est. Monthly Earnings:",
            startMining: "Start Mining",
            mining: "Mining...",
            stopMining: "Stop Mining",
            claimRewards: "Claim Rewards",
            withdraw: "Withdraw",
            swapCoin: "Swap Coin",
            boostYourMining: "Boost Your Mining",
            currentHashPower: "Current Hash Power:",
            ths: "TH/s",
            buyMinerPrompt: "Buy a new miner to increase your hash power:",
            cost: "Cost:",
            buyMiner: "Buy Miner",
            inviteFriends: "Invite Friends",
            referralBalance: "Referral Balance:",
            inviteLink: "Invite Link:",
            copyLink: "Copy Link",
            referralWithdraw: "Withdraw",
            earnMore: "Earn More",
            completeTasks: "Complete tasks to earn more rewards.",
            task1: "Task 1: Invite 5 friends - 0.5 TON",
            task2: "Task 2: Mine for 24 hours - 0.1 TON",
            more: "More",
            changeCoin: "Change Coin",
            change: "Change",
            contactSupport: "Contact Support",
            email: "Email: support@dssgreenhash.com",
            legalInfo: "Legal Information",
            terms: "Terms of Service and Privacy Policy",
            faqs: "FAQs",
            faqsText: "Frequently Asked Questions",
            noRewards: "No rewards to claim!",
            coinChanged: "Coin changed to",
            paymentSuccess: "Payment successful! Miner upgraded! New hashrate:",
            alreadyMining: "You are already mining",
            walletPrompt: "Please set up your Telegram Wallet to proceed. Start @Wallet to begin.",
            userDataCleared: "User data cleared! Refresh the app.",
            failedClearData: "Failed to clear user data. Please try again.",
            rewardsSent: "Successfully sent",
            toWallet: "to your Wallet!",
            withdrawInitiated: "Withdraw initiated! (Simulated)",
            swapInitiated: "Swap coin initiated! (Simulated)",
            paymentInitiated: "Initiating payment of",
            viaWalletPay: "via Wallet Pay...",
            linkCopied: "Referral link copied!",
            errorDropdown: "Error: Coin selection dropdown not found.",
            errorMoreTab: "Error: More tab not found.",
            errorChangeCoinBtn: "Error: Change coin button not found."
        },
        es: {
            welcome: "Bienvenido a DSS GreenHash",
            selectCoin: "Selecciona una moneda para empezar a minar:",
            selectLanguage: "Selecciona tu idioma:",
            proceed: "Continuar",
            homeTab: "Inicio",
            boostTab: "Impulso",
            friendsTab: "Amigos",
            earnTab: "Ganar",
            moreTab: "Más",
            dssGreenHash: "DSS GreenHash",
            miningRate: "Tasa de minería:",
            perHour: "/hora",
            priceLabel: "Precio: $",
            balance: "Saldo:",
            rewards: "Recompensas:",
            estMonthlyEarnings: "Ganancias mensuales estimadas:",
            startMining: "Iniciar minería",
            mining: "Minando...",
            stopMining: "Detener minería",
            claimRewards: "Reclamar recompensas",
            withdraw: "Retirar",
            swapCoin: "Cambiar moneda",
            boostYourMining: "Impulsa tu minería",
            currentHashPower: "Poder de hash actual:",
            ths: "TH/s",
            buyMinerPrompt: "Compra un nuevo minero para aumentar tu poder de hash:",
            cost: "Costo:",
            buyMiner: "Comprar minero",
            inviteFriends: "Invita amigos",
            referralBalance: "Saldo de referencia:",
            inviteLink: "Enlace de invitación:",
            copyLink: "Copiar enlace",
            referralWithdraw: "Retirar",
            earnMore: "Gana más",
            completeTasks: "Completa tareas para ganar más recompensas.",
            task1: "Tarea 1: Invita a 5 amigos - 0.5 TON",
            task2: "Tarea 2: Mina durante 24 horas - 0.1 TON",
            more: "Más",
            changeCoin: "Cambiar moneda",
            change: "Cambiar",
            contactSupport: "Soporte de contacto",
            email: "Correo: support@dssgreenhash.com",
            legalInfo: "Información legal",
            terms: "Términos de servicio y política de privacidad",
            faqs: "Preguntas frecuentes",
            faqsText: "Preguntas frecuentes",
            noRewards: "¡No hay recompensas para reclamar!",
            coinChanged: "Moneda cambiada a",
            paymentSuccess: "¡Pago exitoso! ¡Minero actualizado! Nuevo hashrate:",
            alreadyMining: "Ya estás minando",
            walletPrompt: "Por favor, configura tu billetera de Telegram para continuar. Inicia @Wallet para comenzar.",
            userDataCleared: "¡Datos de usuario borrados! Refresca la app.",
            failedClearData: "Error al borrar datos de usuario. Por favor, intenta de nuevo.",
            rewardsSent: "Enviado exitosamente",
            toWallet: "a tu billetera!",
            withdrawInitiated: "¡Retiro iniciado! (Simulado)",
            swapInitiated: "¡Cambio de moneda iniciado! (Simulado)",
            paymentInitiated: "Iniciando pago de",
            viaWalletPay: "vía Wallet Pay...",
            linkCopied: "¡Enlace de referencia copiado!",
            errorDropdown: "Error: No se encontró el desplegable de selección de moneda.",
            errorMoreTab: "Error: No se encontró la pestaña Más.",
            errorChangeCoinBtn: "Error: No se encontró el botón de cambio de moneda."
        },
        fr: {
            welcome: "Bienvenue sur DSS GreenHash",
            selectCoin: "Sélectionnez une monnaie pour commencer à miner :",
            selectLanguage: "Sélectionnez votre langue :",
            proceed: "Continuer",
            homeTab: "Accueil",
            boostTab: "Boost",
            friendsTab: "Amis",
            earnTab: "Gagner",
            moreTab: "Plus",
            dssGreenHash: "DSS GreenHash",
            miningRate: "Taux de minage :",
            perHour: "/heure",
            priceLabel: "Prix : $",
            balance: "Solde :",
            rewards: "Récompenses :",
            estMonthlyEarnings: "Gains mensuels estimés :",
            startMining: "Démarrer le minage",
            mining: "Minage en cours...",
            stopMining: "Arrêter le minage",
            claimRewards: "Réclamer les récompenses",
            withdraw: "Retirer",
            swapCoin: "Changer de monnaie",
            boostYourMining: "Boostez votre minage",
            currentHashPower: "Puissance de hachage actuelle :",
            ths: "TH/s",
            buyMinerPrompt: "Achetez un nouveau mineur pour augmenter votre puissance de hachage :",
            cost: "Coût :",
            buyMiner: "Acheter un mineur",
            inviteFriends: "Inviter des amis",
            referralBalance: "Solde de parrainage :",
            inviteLink: "Lien d'invitation :",
            copyLink: "Copier le lien",
            referralWithdraw: "Retirer",
            earnMore: "Gagnez plus",
            completeTasks: "Complétez des tâches pour gagner plus de récompenses.",
            task1: "Tâche 1 : Invitez 5 amis - 0.5 TON",
            task2: "Tâche 2 : Minez pendant 24 heures - 0.1 TON",
            more: "Plus",
            changeCoin: "Changer de monnaie",
            change: "Changer",
            contactSupport: "Support de contact",
            email: "Email : support@dssgreenhash.com",
            legalInfo: "Informations légales",
            terms: "Conditions de service et politique de confidentialité",
            faqs: "FAQ",
            faqsText: "Questions fréquemment posées",
            noRewards: "Aucune récompense à réclamer !",
            coinChanged: "Monnaie changée en",
            paymentSuccess: "Paiement réussi ! Mineur mis à jour ! Nouveau hashrate :",
            alreadyMining: "Vous minez déjà",
            walletPrompt: "Veuillez configurer votre portefeuille Telegram pour continuer. Démarrez @Wallet pour commencer.",
            userDataCleared: "Données utilisateur supprimées ! Rafraîchissez l'application.",
            failedClearData: "Échec de la suppression des données utilisateur. Veuillez réessayer.",
            rewardsSent: "Envoyé avec succès",
            toWallet: "à votre portefeuille !",
            withdrawInitiated: "Retrait initié ! (Simulé)",
            swapInitiated: "Changement de monnaie initié ! (Simulé)",
            paymentInitiated: "Initiation du paiement de",
            viaWalletPay: "via Wallet Pay...",
            linkCopied: "Lien de parrainage copié !",
            errorDropdown: "Erreur : Menu déroulant de sélection de monnaie introuvable.",
            errorMoreTab: "Erreur : Onglet Plus introuvable.",
            errorChangeCoinBtn: "Erreur : Bouton de changement de monnaie introuvable."
        }
    };

    // Function to update the app's text based on the selected language
    const updateLanguage = () => {
        const t = translations[selectedLanguage];
        // Landing Page
        document.querySelector("#landingPage h1").textContent = t.welcome;
        document.querySelector("#landingPage p:nth-of-type(1)").textContent = t.selectCoin;
        document.querySelector("#landingPage p:nth-of-type(2)").textContent = t.selectLanguage;
        document.querySelector("#proceedBtn").textContent = t.proceed;

        // Navigation Bar
        document.querySelector(".nav-item[data-tab='homeTab'] span").textContent = t.homeTab;
        document.querySelector(".nav-item[data-tab='boostTab'] span").textContent = t.boostTab;
        document.querySelector(".nav-item[data-tab='friendsTab'] span").textContent = t.friendsTab;
        document.querySelector(".nav-item[data-tab='earnTab'] span").textContent = t.earnTab;
        document.querySelector(".nav-item[data-tab='moreTab'] span").textContent = t.moreTab;

        // Home Tab
        document.querySelector("#homeTab h1").textContent = t.dssGreenHash;
        document.querySelector("#homeTab p:nth-of-type(1)").innerHTML = `${t.miningRate} <span id="miningRate">+0.0000 TON</span>${t.perHour}`;
        document.querySelector("#homeTab p:nth-of-type(2)").innerHTML = `<span id="coinPriceLabel">TON</span> ${t.priceLabel}<span id="coinPrice">4.12</span>`;
        document.querySelector("#homeTab .balance p:nth-of-type(1)").innerHTML = `${t.balance} <span id="balance">0.0000</span> <span id="coinType">TON</span>`;
        document.querySelector("#homeTab .balance p:nth-of-type(2)").innerHTML = `${t.rewards} <span id="rewards">0.0000</span> <span id="coinTypeRewards">TON</span>`;
        document.querySelector("#homeTab .earnings p").innerHTML = `${t.estMonthlyEarnings} <span id="earnings">0.00</span> <span id="coinTypeEarnings">TON</span>`;
        document.querySelector("#startBtn").textContent = t.startMining;
        document.querySelector("#stopBtn").textContent = t.stopMining;
        document.querySelector("#claimBtn").textContent = t.claimRewards;
        document.querySelector("#withdrawBtn").textContent = t.withdraw;
        document.querySelector("#swapBtn").textContent = t.swapCoin;

        // Boost Tab
        document.querySelector("#boostTab h2").textContent = t.boostYourMining;
        document.querySelector("#boostTab p:nth-of-type(1)").innerHTML = `${t.currentHashPower} <span id="boostHashPower">0</span> ${t.ths}`;
        document.querySelector("#boostTab p:nth-of-type(2)").textContent = t.buyMinerPrompt;
        document.querySelector("#boostTab p:nth-of-type(3)").innerHTML = `${t.cost} 3 <span id="coinTypeCost">TON</span>`;
        document.querySelector("#buyMinerBtn").textContent = t.buyMiner;

        // Friends Tab
        document.querySelector("#friendsTab h2").textContent = t.inviteFriends;
        document.querySelector("#friendsTab p:nth-of-type(1)").innerHTML = `${t.referralBalance} <span id="referralBalance">0.0000</span> TON`;
        document.querySelector("#friendsTab p:nth-of-type(2)").innerHTML = `${t.inviteLink} <span id="referralLink">t.me/dssgreenhash_bot</span>`;
        document.querySelector("#copyLinkBtn").textContent = t.copyLink;
        document.querySelector("#referralWithdrawBtn").textContent = t.referralWithdraw;

        // Earn Tab
        document.querySelector("#earnTab h2").textContent = t.earnMore;
        document.querySelector("#earnTab p").textContent = t.completeTasks;
        document.querySelector("#earnTab ul li:nth-of-type(1)").textContent = t.task1;
        document.querySelector("#earnTab ul li:nth-of-type(2)").textContent = t.task2;

        // More Tab
        document.querySelector("#moreTab h2").textContent = t.more;
        document.querySelector("#moreTab .change-coin-section h3").textContent = t.changeCoin;
        document.querySelector("#changeCoinBtn").textContent = t.change;
        document.querySelector("#moreTab .more-section:nth-of-type(1) h3").textContent = t.contactSupport;
        document.querySelector("#moreTab .more-section:nth-of-type(1) p").textContent = t.email;
        document.querySelector("#moreTab .more-section:nth-of-type(2) h3").textContent = t.legalInfo;
        document.querySelector("#moreTab .more-section:nth-of-type(2) p").textContent = t.terms;
        document.querySelector("#moreTab .more-section:nth-of-type(3) h3").textContent = t.faqs;
        document.querySelector("#moreTab .more-section:nth-of-type(3) p").textContent = t.faqsText;
    };

    // DOM Elements
    const hashPowerDisplay = document.getElementById("hashPower");
    const balanceDisplay = document.getElementById("balance");
    const rewardsDisplay = document.getElementById("rewards");
    const miningRateDisplay = document.getElementById("miningRate");
    const miningCircle = document.getElementById("miningCircle");
    const earningsDisplay = document.getElementById("earnings");
    const coinPriceLabel = document.getElementById("coinPriceLabel");
    const coinPriceDisplay = document.getElementById("coinPrice");
    const boostHashPowerDisplay = document.getElementById("boostHashPower");
    const referralBalanceDisplay = document.getElementById("referralBalance");
    const referralLinkDisplay = document.getElementById("referralLink");
    const coinTypeDisplay = document.getElementById("coinType");
    const coinTypeRewardsDisplay = document.getElementById("coinTypeRewards");
    const coinTypeEarningsDisplay = document.getElementById("coinTypeEarnings");
    const coinTypeCostDisplay = document.getElementById("coinTypeCost");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const claimBtn = document.getElementById("claimBtn");
    const withdrawBtn = document.getElementById("withdrawBtn");
    const swapBtn = document.getElementById("swapBtn");
    const paymentCurrency = document.getElementById("paymentCurrency");
    const buyMinerBtn = document.getElementById("buyMinerBtn");
    const referralWithdrawBtn = document.getElementById("referralWithdrawBtn");
    const copyLinkBtn = document.getElementById("copyLinkBtn");
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const landingPage = document.getElementById("landingPage");
    const coinSelection = document.getElementById("coinSelection");
    const languageSelection = document.getElementById("languageSelection");
    const proceedBtn = document.getElementById("proceedBtn");
    const navBar = document.querySelector(".nav-bar");
    const changeCoinSelection = document.getElementById("changeCoinSelection");
    const changeCoinBtn = document.getElementById("changeCoinBtn");
    const moreTab = document.getElementById("moreTab");

    // Debug: Check if critical elements are found
    console.log("startBtn:", startBtn);
    console.log("claimBtn:", claimBtn);
    console.log("navItems:", navItems);
    console.log("changeCoinBtn:", changeCoinBtn);
    console.log("changeCoinSelection:", changeCoinSelection);
    console.log("moreTab:", moreTab);
    console.log("proceedBtn:", proceedBtn);
    console.log("coinPriceLabel:", coinPriceLabel);
    console.log("coinPriceDisplay:", coinPriceDisplay);
    console.log("languageSelection:", languageSelection);

    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        console.log("Telegram Web App initialized");
    } else {
        console.error("Telegram Web App not available");
    }

    // Prompt user to set up Wallet if not already done
    if (!window.Telegram.WebApp.initDataUnsafe.user) {
        window.Telegram.WebApp.showAlert(translations[selectedLanguage].walletPrompt);
        window.Telegram.WebApp.openTelegramLink("https://t.me/Wallet");
    }

    // Load user data from Telegram storage
    const loadUserData = () => {
        console.log("Loading user data...");
        window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
            if (err) {
                console.error("Error loading user data:", err);
                return;
            }
            if (savedData) {
                console.log("User data loaded:", savedData);
                const data = JSON.parse(savedData);
                hashPower = data.hashPower || 0;
                balance = data.balance || 0;
                earnings = data.earnings || 0;
                rewards = data.rewards || 0;
                selectedCoin = data.selectedCoin || "TON";
                selectedLanguage = data.selectedLanguage || "en";
                hashPowerDisplay.textContent = hashPower.toFixed(2);
                balanceDisplay.textContent = balance.toFixed(4);
                rewardsDisplay.textContent = rewards.toFixed(4);
                earningsDisplay.textContent = earnings.toFixed(2);
                boostHashPowerDisplay.textContent = hashPower.toFixed(2);
                coinTypeDisplay.textContent = selectedCoin;
                coinTypeRewardsDisplay.textContent = selectedCoin;
                coinTypeEarningsDisplay.textContent = selectedCoin;
                coinTypeCostDisplay.textContent = selectedCoin;
                miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`;
                coinPriceLabel.textContent = selectedCoin;
                coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
                updateLanguage(); // Update text based on loaded language
            } else {
                console.log("No user data found");
            }
        });
    };

    // Save user data to Telegram storage
    const saveUserData = () => {
        const data = {
            hashPower: hashPower,
            balance: balance,
            earnings: earnings,
            rewards: rewards,
            selectedCoin: selectedCoin,
            selectedLanguage: selectedLanguage
        };
        console.log("Saving user data:", data);
        window.Telegram.WebApp.CloudStorage.setItem("userData", JSON.stringify(data), (err) => {
            if (err) {
                console.error("Error saving user data:", err);
            } else {
                console.log("User data saved successfully");
            }
        });
    };

    // Fetch coin prices from CoinGecko and update display
    const fetchCoinPrices = async () => {
        try {
            console.log("Fetching coin prices...");
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,bitcoin,usdt&vs_currencies=usd");
            const data = await response.json();
            coinPrices.TON = data["the-open-network"].usd;
            coinPrices.BTC = data["bitcoin"].usd;
            coinPrices.USDT = data["usdt"].usd;
            coinPriceLabel.textContent = selectedCoin;
            coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            console.log("Coin prices fetched:", coinPrices);
        } catch (error) {
            console.error("Error fetching coin prices:", error);
            coinPriceLabel.textContent = selectedCoin;
            coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
        }
    };
    fetchCoinPrices();

    // Calculate mining rate based on coin price
    const calculateMiningRate = () => {
        const baseRateUsd = 0.0001; // Base mining rate in USD per hour
        const rateInCoin = baseRateUsd / coinPrices[selectedCoin];
        console.log("Calculated mining rate for", selectedCoin, ":", rateInCoin);
        return rateInCoin;
    };

    // Show the initial tab
    const showInitialTab = () => {
        console.log("Checking user data to determine initial tab...");
        window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
            if (err) {
                console.error("Error checking user data:", err);
                landingPage.classList.add("active");
                console.log("Showing landing page due to error");
                return;
            }
            if (savedData) {
                console.log("User has data, showing home tab");
                landingPage.style.display = "none";
                navBar.style.display = "flex";
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                const homeTab = document.getElementById("homeTab");
                homeTab.style.display = "block";
                homeTab.classList.add("active");
                navItems.forEach(item => item.classList.remove("active"));
                navItems[0].classList.add("active");
                loadUserData();
                console.log("Home tab should now be visible");
            } else {
                console.log("No user data, showing landing page");
                landingPage.classList.add("active");
                updateLanguage(); // Update landing page text
            }
        });
    };

    // Clear user data (for testing)
    const clearUserData = () => {
        console.log("Attempting to clear user data...");
        window.Telegram.WebApp.CloudStorage.removeItem("userData", (err) => {
            if (err) {
                console.error("Error clearing user data:", err);
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].failedClearData);
            } else {
                console.log("User data cleared successfully");
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].userDataCleared);
                // Reset local variables
                miningRate = 0;
                hashPower = 0;
                balance = 0;
                earnings = 0;
                rewards = 0;
                selectedCoin = "TON";
                selectedLanguage = "en";
                // Reset displays
                hashPowerDisplay.textContent = "0";
                balanceDisplay.textContent = "0.0000";
                rewardsDisplay.textContent = "0.0000";
                earningsDisplay.textContent = "0.00";
                boostHashPowerDisplay.textContent = "0";
                coinTypeDisplay.textContent = "TON";
                coinTypeRewardsDisplay.textContent = "TON";
                coinTypeEarningsDisplay.textContent = "TON";
                coinTypeCostDisplay.textContent = "TON";
                miningRateDisplay.textContent = "+0.0000 TON";
                coinPriceLabel.textContent = "TON";
                coinPriceDisplay.textContent = coinPrices.TON.toFixed(2);
                // Show landing page
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                landingPage.style.display = "block";
                landingPage.classList.add("active");
                navBar.style.display = "none";
                updateLanguage(); // Update text after clearing data
            }
        });
    };
    clearUserData();

    // Call the function to show the initial tab
    showInitialTab();

    // Proceed after coin and language selection
    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
            console.log("Proceed button clicked");
            selectedCoin = coinSelection.value;
            selectedLanguage = languageSelection.value;
            console.log("Selected coin:", selectedCoin);
            console.log("Selected language:", selectedLanguage);
            coinTypeDisplay.textContent = selectedCoin;
            coinTypeRewardsDisplay.textContent = selectedCoin;
            coinTypeEarningsDisplay.textContent = selectedCoin;
            coinTypeCostDisplay.textContent = selectedCoin;
            miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
            coinPriceLabel.textContent = selectedCoin;
            coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            landingPage.style.display = "none";
            console.log("Landing page hidden");
            navBar.style.display = "flex";
            console.log("Navigation bar displayed");
            tabContents.forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
                console.log("Hiding tab:", content.id);
            });
            const homeTab = document.getElementById("homeTab");
            homeTab.style.display = "block";
            homeTab.classList.add("active");
            console.log("Home tab set to active, display:", homeTab.style.display);
            navItems.forEach(item => item.classList.remove("active"));
            navItems[0].classList.add("active");
            console.log("Home nav item set to active");
            updateLanguage(); // Update text based on selected language
            saveUserData();
            console.log("User data saved after coin and language selection");
        });
    } else {
        console.error("proceedBtn not found in DOM");
    }

    // Change coin in More tab
    const handleChangeCoin = () => {
        console.log("Change coin function triggered");
        if (!changeCoinSelection) {
            console.error("changeCoinSelection element not found");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].errorDropdown);
            return;
        }
        const newCoin = changeCoinSelection.value;
        console.log("New coin selected:", newCoin);
        if (newCoin === selectedCoin) {
            console.log("Same coin selected, showing alert");
            window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].alreadyMining} ${newCoin}!`);
            return;
        }
        console.log("Updating selectedCoin from", selectedCoin, "to", newCoin);
        selectedCoin = newCoin;
        console.log("Updating coin displays...");
        coinTypeDisplay.textContent = selectedCoin;
        coinTypeRewardsDisplay.textContent = selectedCoin;
        coinTypeEarningsDisplay.textContent = selectedCoin;
        coinTypeCostDisplay.textContent = selectedCoin;
        miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
        coinPriceLabel.textContent = selectedCoin;
        coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
        if (miningRate > 0) {
            console.log("Mining is active, recalculating mining rate...");
            miningRate = calculateMiningRate();
            miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`;
        }
        console.log("Saving user data after coin change...");
        saveUserData();
        console.log("Showing confirmation alert...");
        window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].coinChanged} ${selectedCoin}!`);
        console.log("Coin changed successfully to:", selectedCoin);
        // Force UI refresh
        const homeTab = document.getElementById("homeTab");
        if (homeTab.classList.contains("active")) {
            homeTab.style.display = "none";
            setTimeout(() => {
                homeTab.style.display = "block";
            }, 10);
        }
    };

    // Use event delegation to handle the click on changeCoinBtn
    if (moreTab) {
        moreTab.addEventListener("click", (e) => {
            const target = e.target;
            console.log("Click event in moreTab, target:", target);
            if (target.id === "changeCoinBtn") {
                console.log("Change coin button clicked via event delegation");
                handleChangeCoin();
            }
        });
        moreTab.addEventListener("touchstart", (e) => {
            const target = e.target;
            console.log("Touchstart event in moreTab, target:", target);
            if (target.id === "changeCoinBtn") {
                e.preventDefault(); // Prevent default touch behavior
                console.log("Change coin button touched via event delegation");
                handleChangeCoin();
            }
        });
    } else {
        console.error("moreTab not found in DOM");
        window.Telegram.WebApp.showAlert(translations[selectedLanguage].errorMoreTab);
    }

    // Fallback: Direct event listeners on changeCoinBtn
    if (changeCoinBtn) {
        console.log("Attaching direct event listeners to changeCoinBtn");
        changeCoinBtn.addEventListener("click", (e) => {
            console.log("Direct click event on changeCoinBtn");
            handleChangeCoin();
        });
        changeCoinBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            console.log("Direct touchstart event on changeCoinBtn");
            handleChangeCoin();
        });
        changeCoinBtn.addEventListener("mousedown", (e) => {
            console.log("Direct mousedown event on changeCoinBtn");
            handleChangeCoin();
        });
        changeCoinBtn.onclick = () => {
            console.log("Direct onclick attribute triggered on changeCoinBtn");
            handleChangeCoin();
        };
    } else {
        console.error("changeCoinBtn not found in DOM");
        window.Telegram.WebApp.showAlert(translations[selectedLanguage].errorChangeCoinBtn);
    }

    // Set initial referral link
    const userId = window.Telegram.WebApp.initDataUnsafe.user?.id || "123";
    referralLinkDisplay.textContent = `t.me/dssgreenhash_bot/start?startapp=${userId}`;
    console.log("Referral link set:", referralLinkDisplay.textContent);

    // Navigation
    if (navItems.length > 0) {
        navItems.forEach(item => {
            console.log("Attaching event listener to nav item:", item.dataset.tab);
            item.addEventListener("click", () => {
                console.log("Nav item clicked:", item.dataset.tab);
                navItems.forEach(i => i.classList.remove("active"));
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                item.classList.add("active");
                const targetTab = document.getElementById(item.dataset.tab);
                if (targetTab) {
                    targetTab.style.display = "block";
                    targetTab.classList.add("active");
                    console.log("Navigated to tab:", item.dataset.tab);
                } else {
                    console.error("Target tab not found for:", item.dataset.tab);
                }
            });
        });
    } else {
        console.error("No nav items found in DOM");
    }

    // Start mining
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            console.log("Start mining button clicked");
            if (miningRate === 0) {
                miningRate = calculateMiningRate();
                hashPower = hashPower || 1;
                startBtn.textContent = translations[selectedLanguage].mining;
                startBtn.style.display = "none";
                stopBtn.style.display = "block";
                miningCircle.classList.add("active");
                miningInterval = setInterval(() => {
                    balance += miningRate;
                    rewards += miningRate;
                    earnings += miningRate * 720; // Approximate monthly earnings (30 days * 24 hours)
                    hashPower += 0.5;
                    hashPowerDisplay.textContent = hashPower.toFixed(2);
                    balanceDisplay.textContent = balance.toFixed(4);
                    rewardsDisplay.textContent = rewards.toFixed(4);
                    miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`;
                    earningsDisplay.textContent = earnings.toFixed(2);
                    boostHashPowerDisplay.textContent = hashPower.toFixed(2);
                    saveUserData();
                }, 3600000); // Update every hour
                console.log("Mining started, rate:", miningRate);
            }
        });
    } else {
        console.error("startBtn not found in DOM");
    }

    // Stop mining
    if (stopBtn) {
        stopBtn.addEventListener("click", () => {
            console.log("Stop mining button clicked");
            clearInterval(miningInterval);
            miningRate = 0;
            miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
            miningCircle.classList.remove("active");
            stopBtn.style.display = "none";
            startBtn.style.display = "block";
            startBtn.textContent = translations[selectedLanguage].startMining;
            startBtn.disabled = false;
            saveUserData();
            console.log("Mining stopped");
        });
    } else {
        console.error("stopBtn not found in DOM");
    }

    // Claim rewards
    if (claimBtn) {
        claimBtn.addEventListener("click", () => {
            console.log("Claim rewards button clicked");
            if (rewards <= 0) {
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].noRewards);
                return;
            }
            window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].rewardsSent} ${rewards.toFixed(4)} ${selectedCoin} ${translations[selectedLanguage].toWallet}`);
            setTimeout(() => {
                balance += rewards;
                rewards = 0;
                balanceDisplay.textContent = balance.toFixed(4);
                rewardsDisplay.textContent = rewards.toFixed(4);
                window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].rewardsSent} ${rewards.toFixed(4)} ${selectedCoin} ${translations[selectedLanguage].toWallet}`);
                saveUserData();
            }, 2000);
        });
    } else {
        console.error("claimBtn not found in DOM");
    }

    // Withdraw (simulated)
    if (withdrawBtn) {
        withdrawBtn.addEventListener("click", () => {
            console.log("Withdraw button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].withdrawInitiated);
        });
    } else {
        console.error("withdrawBtn not found in DOM");
    }

    // Swap coin (simulated)
    if (swapBtn) {
        swapBtn.addEventListener("click", () => {
            console.log("Swap coin button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].swapInitiated);
        });
    } else {
        console.error("swapBtn not found in DOM");
    }

    // Buy miner (simulated payment)
    if (buyMinerBtn) {
        buyMinerBtn.addEventListener("click", () => {
            console.log("Buy miner button clicked");
            const selectedCurrency = paymentCurrency.value;
            const amount = 3; // Cost in selected coin
            window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].paymentInitiated} ${amount} ${selectedCurrency} ${translations[selectedLanguage].viaWalletPay}`);
            setTimeout(() => {
                hashPower += 10;
                hashPowerDisplay.textContent = hashPower.toFixed(2);
                boostHashPowerDisplay.textContent = hashPower.toFixed(2);
                window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].paymentSuccess} ${hashPower.toFixed(2)} ${translations[selectedLanguage].ths}`);
                saveUserData();
            }, 2000);
        });
    } else {
        console.error("buyMinerBtn not found in DOM");
    }

    // Referral withdraw (simulated)
    if (referralWithdrawBtn) {
        referralWithdrawBtn.addEventListener("click", () => {
            console.log("Referral withdraw button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].withdrawInitiated);
        });
    } else {
        console.error("referralWithdrawBtn not found in DOM");
    }

    // Copy referral link
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener("click", () => {
            console.log("Copy link button clicked");
            const link = referralLinkDisplay.textContent;
            navigator.clipboard.writeText(link).then(() => {
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].linkCopied);
            });
        });
    } else {
        console.error("copyLinkBtn not found in DOM");
    }
});
