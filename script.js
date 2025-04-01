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
        ar: {
            welcome: "مرحبًا بك في DSS GreenHash",
            selectCoin: "اختر عملة لبدء التعدين:",
            selectLanguage: "اختر لغتك:",
            proceed: "متابعة",
            homeTab: "الرئيسية",
            boostTab: "تعزيز",
            friendsTab: "الأصدقاء",
            earnTab: "كسب",
            moreTab: "المزيد",
            dssGreenHash: "DSS GreenHash",
            miningRate: "معدل التعدين:",
            perHour: "/ساعة",
            priceLabel: "السعر: $",
            balance: "الرصيد:",
            rewards: "المكافآت:",
            estMonthlyEarnings: "الأرباح الشهرية المقدرة:",
            startMining: "بدء التعدين",
            mining: "جارٍ التعدين...",
            stopMining: "إيقاف التعدين",
            claimRewards: "المطالبة بالمكافآت",
            withdraw: "سحب",
            swapCoin: "تبديل العملة",
            boostYourMining: "عزز تعدينك",
            currentHashPower: "قوة التجزئة الحالية:",
            ths: "تيرا هاش/ث",
            buyMinerPrompt: "اشترِ عامل منجم جديد لزيادة قوة التجزئة الخاصة بك:",
            cost: "التكلفة:",
            buyMiner: "شراء عامل منجم",
            inviteFriends: "دعوة الأصدقاء",
            referralBalance: "رصيد الإحالة:",
            inviteLink: "رابط الدعوة:",
            copyLink: "نسخ الرابط",
            referralWithdraw: "سحب",
            earnMore: "اكسب المزيد",
            completeTasks: "أكمل المهام لكسب المزيد من المكافآت.",
            task1: "المهمة 1: ادعُ 5 أصدقاء - 0.5 TON",
            task2: "المهمة 2: قم بالتعدين لمدة 24 ساعة - 0.1 TON",
            more: "المزيد",
            changeCoin: "تغيير العملة",
            change: "تغيير",
            contactSupport: "اتصل بالدعم",
            email: "البريد الإلكتروني: support@dssgreenhash.com",
            legalInfo: "معلومات قانونية",
            terms: "شروط الخدمة وسياسة الخصوصية",
            faqs: "الأسئلة الشائعة",
            faqsText: "الأسئلة المتداولة",
            noRewards: "لا توجد مكافآت للمطالبة بها!",
            coinChanged: "تم تغيير العملة إلى",
            paymentSuccess: "تم الدفع بنجاح! تم ترقية عامل المنجم! معدل التجزئة الجديد:",
            alreadyMining: "أنت بالفعل تقوم بالتعدين",
            walletPrompt: "يرجى إعداد محفظتك على تيليجرام للمتابعة. ابدأ @Wallet للبدء.",
            userDataCleared: "تم مسح بيانات المستخدم! قم بتحديث التطبيق.",
            failedClearData: "فشل في مسح بيانات المستخدم. يرجى المحاولة مرة أخرى.",
            rewardsSent: "تم الإرسال بنجاح",
            toWallet: "إلى محفظتك!",
            withdrawInitiated: "تم بدء السحب! (محاكاة)",
            swapInitiated: "تم بدء تبديل العملة! (محاكاة)",
            paymentInitiated: "جارٍ بدء الدفع بقيمة",
            viaWalletPay: "عبر Wallet Pay...",
            linkCopied: "تم نسخ رابط الإحالة!",
            errorDropdown: "خطأ: لم يتم العثور على القائمة المنسدلة لاختيار العملة.",
            errorMoreTab: "خطأ: لم يتم العثور على علامة التبويب المزيد.",
            errorChangeCoinBtn: "خطأ: لم يتم العثور على زر تغيير العملة."
        },
        ru: {
            welcome: "Добро пожаловать в DSS GreenHash",
            selectCoin: "Выберите монету для начала майнинга:",
            selectLanguage: "Выберите ваш язык:",
            proceed: "Продолжить",
            homeTab: "Главная",
            boostTab: "Ускорение",
            friendsTab: "Друзья",
            earnTab: "Заработок",
            moreTab: "Ещё",
            dssGreenHash: "DSS GreenHash",
            miningRate: "Скорость майнинга:",
            perHour: "/час",
            priceLabel: "Цена: $",
            balance: "Баланс:",
            rewards: "Награды:",
            estMonthlyEarnings: "Оценочные месячные доходы:",
            startMining: "Начать майнинг",
            mining: "Майнинг...",
            stopMining: "Остановить майнинг",
            claimRewards: "Забрать награды",
            withdraw: "Вывести",
            swapCoin: "Сменить монету",
            boostYourMining: "Ускорьте ваш майнинг",
            currentHashPower: "Текущая мощность хэширования:",
            ths: "TH/s",
            buyMinerPrompt: "Купите новый майнер, чтобы увеличить мощность хэширования:",
            cost: "Стоимость:",
            buyMiner: "Купить майнер",
            inviteFriends: "Пригласить друзей",
            referralBalance: "Реферальный баланс:",
            inviteLink: "Пригласительная ссылка:",
            copyLink: "Скопировать ссылку",
            referralWithdraw: "Вывести",
            earnMore: "Заработайте больше",
            completeTasks: "Выполняйте задания, чтобы заработать больше наград.",
            task1: "Задание 1: Пригласите 5 друзей - 0.5 TON",
            task2: "Задание 2: Майните 24 часа - 0.1 TON",
            more: "Ещё",
            changeCoin: "Сменить монету",
            change: "Сменить",
            contactSupport: "Связаться с поддержкой",
            email: "Электронная почта: support@dssgreenhash.com",
            legalInfo: "Юридическая информация",
            terms: "Условия использования и политика конфиденциальности",
            faqs: "Часто задаваемые вопросы",
            faqsText: "Часто задаваемые вопросы",
            noRewards: "Нет наград для получения!",
            coinChanged: "Монета изменена на",
            paymentSuccess: "Оплата прошла успешно! Майнер обновлён! Новая мощность:",
            alreadyMining: "Вы уже майните",
            walletPrompt: "Пожалуйста, настройте ваш кошелёк Telegram для продолжения. Запустите @Wallet, чтобы начать.",
            userDataCleared: "Данные пользователя очищены! Обновите приложение.",
            failedClearData: "Не удалось очистить данные пользователя. Пожалуйста, попробуйте снова.",
            rewardsSent: "Успешно отправлено",
            toWallet: "в ваш кошелёк!",
            withdrawInitiated: "Вывод начат! (Симуляция)",
            swapInitiated: "Смена монеты начата! (Симуляция)",
            paymentInitiated: "Инициируется платеж на сумму",
            viaWalletPay: "через Wallet Pay...",
            linkCopied: "Реферальная ссылка скопирована!",
            errorDropdown: "Ошибка: Выпадающий список выбора монеты не найден.",
            errorMoreTab: "Ошибка: Вкладка Ещё не найдена.",
            errorChangeCoinBtn: "Ошибка: Кнопка смены монеты не найдена."
        }
    };

    // Function to update the app's text based on the selected language
    const updateLanguage = () => {
        const t = translations[selectedLanguage];
        const isRtl = selectedLanguage === "ar"; // Check if the language is RTL (Arabic)
        document.body.style.direction = isRtl ? "rtl" : "ltr"; // Set text direction
        document.body.style.textAlign = isRtl ? "right" : "center"; // Adjust text alignment

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
            if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(2);
            if (balanceDisplay) balanceDisplay.textContent = balance.toFixed(4);
            if (rewardsDisplay) rewardsDisplay.textContent = rewards.toFixed(4);
            if (earningsDisplay) earningsDisplay.textContent = earnings.toFixed(2);
            if (boostHashPowerDisplay) boostHashPowerDisplay.textContent = hashPower.toFixed(2);
            if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
            if (coinTypeRewardsDisplay) coinTypeRewardsDisplay.textContent = selectedCoin;
            if (coinTypeEarningsDisplay) coinTypeEarningsDisplay.textContent = selectedCoin;
            if (coinTypeCostDisplay) coinTypeCostDisplay.textContent = selectedCoin;
            if (miningRateDisplay) miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`; // Ensure selectedCoin is used
            if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
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
            if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            console.log("Coin prices fetched:", coinPrices);
        } catch (error) {
            console.error("Error fetching coin prices:", error);
            if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
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
                if (landingPage) {
                    landingPage.classList.add("active");
                    console.log("Showing landing page due to error");
                }
                return;
            }
            if (savedData) {
                console.log("User has data, showing home tab");
                if (landingPage) landingPage.style.display = "none";
                if (navBar) navBar.style.display = "flex";
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                const homeTab = document.getElementById("homeTab");
                if (homeTab) {
                    homeTab.style.display = "block";
                    homeTab.classList.add("active");
                }
                navItems.forEach(item => item.classList.remove("active"));
                if (navItems[0]) navItems[0].classList.add("active");
                loadUserData();
                console.log("Home tab should now be visible");
            } else {
                console.log("No user data, showing landing page");
                if (landingPage) {
                    landingPage.classList.add("active");
                    updateLanguage(); // Update landing page text
                }
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
                if (hashPowerDisplay) hashPowerDisplay.textContent = "0";
                if (balanceDisplay) balanceDisplay.textContent = "0.0000";
                if (rewardsDisplay) rewardsDisplay.textContent = "0.0000";
                if (earningsDisplay) earningsDisplay.textContent = "0.00";
                if (boostHashPowerDisplay) boostHashPowerDisplay.textContent = "0";
                if (coinTypeDisplay) coinTypeDisplay.textContent = "TON";
                if (coinTypeRewardsDisplay) coinTypeRewardsDisplay.textContent = "TON";
                if (coinTypeEarningsDisplay) coinTypeEarningsDisplay.textContent = "TON";
                if (coinTypeCostDisplay) coinTypeCostDisplay.textContent = "TON";
                if (miningRateDisplay) miningRateDisplay.textContent = "+0.0000 TON";
                if (coinPriceLabel) coinPriceLabel.textContent = "TON";
                if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices.TON.toFixed(2);
                // Show landing page
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                if (landingPage) {
                    landingPage.style.display = "block";
                    landingPage.classList.add("active");
                }
                if (navBar) navBar.style.display = "none";
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
            selectedCoin = coinSelection ? coinSelection.value : "TON";
            selectedLanguage = languageSelection ? languageSelection.value : "en";
            console.log("Selected coin:", selectedCoin);
            console.log("Selected language:", selectedLanguage);
            if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
            if (coinTypeRewardsDisplay) coinTypeRewardsDisplay.textContent = selectedCoin;
            if (coinTypeEarningsDisplay) coinTypeEarningsDisplay.textContent = selectedCoin;
            if (coinTypeCostDisplay) coinTypeCostDisplay.textContent = selectedCoin;
            if (miningRateDisplay) miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
            if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            if (landingPage) {
                landingPage.style.display = "none";
                console.log("Landing page hidden");
            }
            if (navBar) {
                navBar.style.display = "flex";
                console.log("Navigation bar displayed");
            }
            tabContents.forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
                console.log("Hiding tab:", content.id);
            });
            const homeTab = document.getElementById("homeTab");
            if (homeTab) {
                homeTab.style.display = "block";
                homeTab.classList.add("active");
                console.log("Home tab set to active, display:", homeTab.style.display);
            }
            navItems.forEach(item => item.classList.remove("active"));
            if (navItems[0]) {
                navItems[0].classList.add("active");
                console.log("Home nav item set to active");
            }
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
        if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
        if (coinTypeRewardsDisplay) coinTypeRewardsDisplay.textContent = selectedCoin;
        if (coinTypeEarningsDisplay) coinTypeEarningsDisplay.textContent = selectedCoin;
        if (coinTypeCostDisplay) coinTypeCostDisplay.textContent = selectedCoin;
        if (miningRateDisplay) miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
        if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
        if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
        if (miningRate > 0) {
            console.log("Mining is active, recalculating mining rate...");
            miningRate = calculateMiningRate();
            if (miningRateDisplay) miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`;
        }
        console.log("Saving user data after coin change...");
        saveUserData();
        console.log("Showing confirmation alert...");
        window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].coinChanged} ${selectedCoin}!`);
        console.log("Coin changed successfully to:", selectedCoin);
        // Force UI refresh
        const homeTab = document.getElementById("homeTab");
        if (homeTab && homeTab.classList.contains("active")) {
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
        console.log("Attaching direct event listeners to changeCoinBtn...");
        changeCoinBtn.addEventListener("click", () => {
            console.log("Change coin button clicked directly");
            handleChangeCoin();
        });
        changeCoinBtn.addEventListener("touchstart", (e) => {
            e.preventDefault(); // Prevent default touch behavior
            console.log("Change coin button touched directly");
            handleChangeCoin();
        });
    } else {
        console.error("changeCoinBtn not found in DOM");
        window.Telegram.WebApp.showAlert(translations[selectedLanguage].errorChangeCoinBtn);
    }

    // Navigation between tabs
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            console.log("Nav item clicked:", item.dataset.tab);
            navItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            tabContents.forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
            });
            const tabContent = document.getElementById(item.dataset.tab);
            if (tabContent) {
                tabContent.style.display = "block";
                tabContent.classList.add("active");
                console.log("Tab content set to active:", item.dataset.tab);
            }
        });
    });

    // Start mining
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            console.log("Start button clicked");
            if (miningInterval) {
                console.log("Mining already in progress");
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].alreadyMining);
                return;
            }
            miningRate = calculateMiningRate();
            hashPower += 0.1; // Simulate hash power increase
            if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(2);
            if (boostHashPowerDisplay) boostHashPowerDisplay.textContent = hashPower.toFixed(2);
            if (miningRateDisplay) miningRateDisplay.textContent = `+${miningRate.toFixed(8)} ${selectedCoin}`;
            if (startBtn) startBtn.style.display = "none";
            if (stopBtn) stopBtn.style.display = "inline-block";
            if (startBtn) startBtn.textContent = translations[selectedLanguage].mining;
            if (miningCircle) miningCircle.classList.add("mining");
            miningInterval = setInterval(() => {
                balance += miningRate;
                rewards += miningRate;
                earnings = (miningRate * 24 * 30).toFixed(8); // Estimated monthly earnings
                if (balanceDisplay) balanceDisplay.textContent = balance.toFixed(4);
                if (rewardsDisplay) rewardsDisplay.textContent = rewards.toFixed(4);
                if (earningsDisplay) earningsDisplay.textContent = earnings;
                saveUserData();
            }, 3600000); // Update every hour
            console.log("Mining started, interval set");
        });
    } else {
        console.error("startBtn not found in DOM");
    }

    // Stop mining
    if (stopBtn) {
        stopBtn.addEventListener("click", () => {
            console.log("Stop button clicked");
            clearInterval(miningInterval);
            miningInterval = null;
            if (startBtn) startBtn.style.display = "inline-block";
            if (stopBtn) stopBtn.style.display = "none";
            if (startBtn) startBtn.textContent = translations[selectedLanguage].startMining;
            if (miningCircle) miningCircle.classList.remove("mining");
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
            rewards = 0;
            if (rewardsDisplay) rewardsDisplay.textContent = "0.0000";
            saveUserData();
            console.log("Rewards claimed");
        });
    } else {
        console.error("claimBtn not found in DOM");
    }

    // Withdraw (simulated)
    if (withdrawBtn) {
        withdrawBtn.addEventListener("click", () => {
            console.log("Withdraw button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].withdrawInitiated);
            console.log("Withdraw initiated (simulated)");
        });
    } else {
        console.error("withdrawBtn not found in DOM");
    }

    // Swap coin (simulated)
    if (swapBtn) {
        swapBtn.addEventListener("click", () => {
            console.log("Swap coin button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].swapInitiated);
            console.log("Swap coin initiated (simulated)");
        });
    } else {
        console.error("swapBtn not found in DOM");
    }

    // Buy miner
    if (buyMinerBtn) {
        buyMinerBtn.addEventListener("click", () => {
            console.log("Buy miner button clicked");
            const cost = 3; // Cost in selected coin
            window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].paymentInitiated} ${cost} ${paymentCurrency ? paymentCurrency.value : selectedCoin} ${translations[selectedLanguage].viaWalletPay}`);
            setTimeout(() => {
                hashPower += 1.0; // Increase hash power
                if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(2);
                if (boostHashPowerDisplay) boostHashPowerDisplay.textContent = hashPower.toFixed(2);
                window.Telegram.WebApp.showAlert(`${translations[selectedLanguage].paymentSuccess} ${hashPower.toFixed(2)} TH/s`);
                saveUserData();
                console.log("Miner purchased, hash power updated");
            }, 2000); // Simulate payment delay
        });
    } else {
        console.error("buyMinerBtn not found in DOM");
    }

    // Copy referral link
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener("click", () => {
            console.log("Copy link button clicked");
            if (referralLinkDisplay) {
                navigator.clipboard.writeText(referralLinkDisplay.textContent);
                window.Telegram.WebApp.showAlert(translations[selectedLanguage].linkCopied);
                console.log("Referral link copied");
            }
        });
    } else {
        console.error("copyLinkBtn not found in DOM");
    }

    // Withdraw referral balance (simulated)
    if (referralWithdrawBtn) {
        referralWithdrawBtn.addEventListener("click", () => {
            console.log("Referral withdraw button clicked");
            window.Telegram.WebApp.showAlert(translations[selectedLanguage].withdrawInitiated);
            console.log("Referral withdraw initiated (simulated)");
        });
    } else {
        console.error("referralWithdrawBtn not found in DOM");
    }
});
