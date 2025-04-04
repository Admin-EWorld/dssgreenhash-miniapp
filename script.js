    document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // Initialize variables
        let miningRate = 0, hashPower = 0, balance = 0, income = 0, referralRewards = 0, shares = 0, selectedCoin = "TON", selectedLanguage = "en";
        let miningInterval, progressInterval;
        let coinPrices = JSON.parse(localStorage.getItem("coinPrices")) || { TON: 0, BTC: 0, USDT: 0 };
        let totalDeposited = 0, totalMiningEarned = 0, totalReferralEarned = 0, totalWithdrawals = 0, referrals = 0;
        let isMining = false, lastUpdateTime = Date.now(), updateIntervalSeconds = 60; // Set to 60 seconds for the desired cycle
        const profitPerSecondPerShare = (6 / (30 * 24 * 60 * 60)); // $6 per share per month, converted to per second

        // Translations for different languages
        const translations = {
            en: { 
                welcome: "Welcome to DSS GreenHash", 
                selectCoin: "Select your coin:", 
                selectLanguage: "Select your language:", 
                proceed: "Proceed", 
                dssGreenHash: "DSS GreenHash", 
                priceLabel: "Price: $", 
                balance: "Balance: $", 
                sharesValue: "Shares", 
                income: "Income", 
                referral: "Referral", 
                nextUpdate: "Next Update:", 
                startMining: "Start Mining", 
                stopMining: "Stop Mining", 
                withdraw: "Withdraw", 
                transactionHistory: "Transaction History", 
                totalDeposited: "Total Deposited: $", 
                totalMiningEarned: "Total Earned by Mining: $", 
                totalReferralEarned: "Total Earned by Referrals: $", 
                totalWithdrawals: "Total Withdrawals: $", 
                estimatedIncome: "Estimated Income:", 
                hourly: "Hourly", 
                daily: "Daily", 
                weekly: "Weekly", 
                monthly: "Monthly", 
                miningProgress: "Mining Progress:", 
                alreadyMining: "Already mining!", 
                withdrawInitiated: "Withdrawal initiated! (Simulated)", 
                walletPrompt: "Please set up your Wallet to proceed.", 
                failedClearData: "Failed to clear user data.", 
                userDataCleared: "User data cleared successfully.", 
                coinChanged: "Coin changed to", 
                alreadyMiningCoin: "Already mining", 
                errorDropdown: "Error: Coin selection dropdown not found.", 
                errorMoreTab: "Error: More tab not found.", 
                errorChangeCoinBtn: "Error: Change coin button not found.", 
                noShares: "Please buy shares in the Boost tab to start mining.", 
                noFunds: "No funds to withdraw.", 
                noIncomeReferral: "No income or referral rewards to withdraw.",
                buyShares: "Buy Shares",
                activeSharesHashPower: "Active Shares / Hash Power",
                shareCost: "1 Mining Share =",
                estimatedReturns: "Estimated Monthly Returns",
                purchaseSuccessful: "Purchase successful!",
                referralLink: "Your Referral Link:",
                copyLink: "Copy Link",
                referrals: "Referrals:",
                referralReward: "Reward per Referral: $5",
                linkCopied: "Referral link copied!"
            },
            ar: { 
                welcome: "مرحبًا بك في DSS GreenHash", 
                selectCoin: "اختر عملتك:", 
                selectLanguage: "اختر لغتك:", 
                proceed: "تابع", 
                dssGreenHash: "DSS GreenHash", 
                priceLabel: "السعر: $", 
                balance: "الرصيد: $", 
                sharesValue: "الأسهم", 
                income: "الدخل", 
                referral: "الإحالة", 
                nextUpdate: "التحديث التالي:", 
                startMining: "بدء التعدين", 
                stopMining: "إيقاف التعدين", 
                withdraw: "سحب", 
                transactionHistory: "سجل المعاملات", 
                totalDeposited: "إجمالي الإيداع: $", 
                totalMiningEarned: "إجمالي الأرباح من التعدين: $", 
                totalReferralEarned: "إجمالي الأرباح من الإحالات: $", 
                totalWithdrawals: "إجمالي السحوبات: $", 
                estimatedIncome: "الدخل المقدر:", 
                hourly: "ساعي", 
                daily: "يومي", 
                weekly: "أسبوعي", 
                monthly: "شهري", 
                miningProgress: "تقدم التعدين:", 
                alreadyMining: "التعدين جارٍ بالفعل!", 
                withdrawInitiated: "تم بدء السحب! (محاكاة)", 
                walletPrompt: "يرجى إعداد محفظتك للمتابعة.", 
                failedClearData: "فشل في مسح بيانات المستخدم.", 
                userDataCleared: "تم مسح بيانات المستخدم بنجاح.", 
                coinChanged: "تم تغيير العملة إلى", 
                alreadyMiningCoin: "التعدين جارٍ بالفعل", 
                errorDropdown: "خطأ: لم يتم العثور على قائمة اختيار العملة.", 
                errorMoreTab: "خطأ: لم يتم العثور على علامة التبويب 'المزيد'.", 
                errorChangeCoinBtn: "خطأ: لم يتم العثور على زر تغيير العملة.", 
                noShares: "يرجى شراء أسهم في علامة التبويب Boost لبدء التعدين.", 
                noFunds: "لا توجد أموال للسحب.", 
                noIncomeReferral: "لا توجد أرباح أو مكافآت إحالة للسحب.",
                buyShares: "شراء أسهم",
                activeSharesHashPower: "الأسهم النشطة / قوة التجزئة",
                shareCost: "1 سهم تعدين =",
                estimatedReturns: "العائد الشهري المقدر",
                purchaseSuccessful: "تم الشراء بنجاح!",
                referralLink: "رابط الإحالة الخاص بك:",
                copyLink: "نسخ الرابط",
                referrals: "الإحالات:",
                referralReward: "مكافأة الإحالة: $5",
                linkCopied: "تم نسخ رابط الإحالة!"
            },
            ru: { 
                welcome: "Добро пожаловать в DSS GreenHash", 
                selectCoin: "Выберите валюту:", 
                selectLanguage: "Выберите язык:", 
                proceed: "Продолжить", 
                dssGreenHash: "DSS GreenHash", 
                priceLabel: "Цена: $", 
                balance: "Баланс: $", 
                sharesValue: "Акции", 
                income: "Доход", 
                referral: "Рефералы", 
                nextUpdate: "Следующее обновление:", 
                startMining: "Начать майнинг", 
                stopMining: "Остановить майнинг", 
                withdraw: "Вывести", 
                transactionHistory: "История транзакций", 
                totalDeposited: "Всего внесено: $", 
                totalMiningEarned: "Всего заработано на майнинге: $", 
                totalReferralEarned: "Всего заработано на рефералах: $", 
                totalWithdrawals: "Всего выведено: $", 
                estimatedIncome: "Ожидаемый доход:", 
                hourly: "Почасовой", 
                daily: "Ежедневный", 
                weekly: "Еженедельный", 
                monthly: "Ежемесячный", 
                miningProgress: "Прогресс майнинга:", 
                alreadyMining: "Майнинг уже идет!", 
                withdrawInitiated: "Вывод инициирован! (Симуляция)", 
                walletPrompt: "Пожалуйста, настройте ваш кошелек для продолжения.", 
                failedClearData: "Не удалось очистить данные пользователя.", 
                userDataCleared: "Данные пользователя успешно очищены.", 
                coinChanged: "Валюта изменена на", 
                alreadyMiningCoin: "Уже майнится", 
                errorDropdown: "Ошибка: Выпадающий список выбора валюты не найден.", 
                errorMoreTab: "Ошибка: Вкладка 'Еще' не найдена.", 
                errorChangeCoinBtn: "Ошибка: Кнопка смены валюты не найдена.", 
                noShares: "Пожалуйста, купите акции во вкладке Boost, чтобы начать майнинг.", 
                noFunds: "Нет средств для вывода.", 
                noIncomeReferral: "Нет дохода или реферальных вознаграждений для вывода.",
                buyShares: "Купить акции",
                activeSharesHashPower: "Активные акции / Хэш-мощность",
                shareCost: "1 акция для майнинга =",
                estimatedReturns: "Ожидаемая месячная доходность",
                purchaseSuccessful: "Покупка успешна!",
                referralLink: "Ваша реферальная ссылка:",
                copyLink: "Скопировать ссылку",
                referrals: "Рефералы:",
                referralReward: "Награда за реферала: $5",
                linkCopied: "Реферальная ссылка скопирована!"
            }
        };

        // Helper function to show alerts (with fallback for older Telegram versions)
        const showAlert = (message, callback) => {
            console.log("showAlert called with message:", message);
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.version >= "6.1") {
                window.Telegram.WebApp.showAlert(message, callback);
            } else {
                alert(message); // Fallback to browser alert
                if (callback) callback();
            }
        };

        // Helper function to show popups (with fallback for older Telegram versions)
        const showPopup = (options, callback) => {
            console.log("showPopup called with options:", options);
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.version >= "6.1") {
                window.Telegram.WebApp.showPopup(options, callback);
            } else {
                // Fallback: Simulate a popup with a simple confirm dialog
                const buttonId = confirm(`${options.title}\n${options.message}`) ? options.buttons[0].id : "cancel";
                if (callback) callback(buttonId);
            }
        };

        // DOM elements
        const miningSharesDisplay = document.getElementById("miningShares");
        const hashPowerDisplay = document.getElementById("hashPower"); // For Home tab
        const activeSharesDisplay = document.getElementById("activeShares"); // For Boost tab
        const hashPowerBoostDisplay = document.getElementById("hashPowerBoost"); // For Boost tab
        const shareCostBtcDisplay = document.getElementById("shareCostBtc"); // For Boost tab
        const shareCostTonDisplay = document.getElementById("shareCostTon"); // For Boost tab
        const balanceDisplay = document.getElementById("balance");
        const balanceUsdDisplay = document.getElementById("balanceUsd");
        const incomeDisplay = document.getElementById("income");
        const referralDisplay = document.getElementById("referral");
        const sharesValueDisplay = document.getElementById("sharesValue");
        const estimatedIncomeDisplay = document.getElementById("estimatedIncome");
        const incomePeriod = document.getElementById("incomePeriod");
        const miningCircle = document.getElementById("miningCircle");
        const coinPriceLabel = document.getElementById("coinPriceLabel");
        const coinPriceDisplay = document.getElementById("coinPrice");
        const coinTypeDisplay = document.getElementById("coinType");
        const startStopBtn = document.getElementById("startStopBtn");
        const withdrawBtn = document.getElementById("withdrawBtn");
        const progressPercent = document.getElementById("progressPercent");
        const nextUpdate = document.getElementById("nextUpdate");
        const totalDepositedDisplay = document.getElementById("totalDeposited");
        const totalMiningEarnedDisplay = document.getElementById("totalMiningEarned");
        const totalReferralEarnedDisplay = document.getElementById("totalReferralEarned");
        const totalWithdrawalsDisplay = document.getElementById("totalWithdrawals");
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
        const buySharesBtn = document.getElementById("buySharesBtn");
        const sharesInput = document.getElementById("sharesInput");
        const referralLinkDisplay = document.getElementById("referralLink");
        const copyLinkBtn = document.getElementById("copyLinkBtn");
        const referralsCount = document.getElementById("referralsCount");

        // Telegram WebApp initialization
        let isTelegramEnvironment = false;
        let isCloudStorageSupported = false;
        if (window.Telegram && window.Telegram.WebApp) {
            console.log("Telegram WebApp version:", window.Telegram.WebApp.version);
            window.Telegram.WebApp.ready();
            isTelegramEnvironment = true;
            // Check if CloudStorage is supported (version 6.1 or higher)
            isCloudStorageSupported = window.Telegram.WebApp.version >= "6.1";
            console.log("CloudStorage supported:", isCloudStorageSupported);
        }

        // Fetch coin prices from CoinGecko API
        const fetchCoinPrices = async (retryCount = 3, delay = 2000) => {
    console.log("fetchCoinPrices called, retryCount:", retryCount);
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,bitcoin,tether&vs_currencies=usd");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("CoinGecko API response:", data);

        // Validate the response data
        if (!data["the-open-network"] || !data["bitcoin"] || !data["tether"]) {
            throw new Error("Invalid CoinGecko API response: Missing expected coin data");
        }

        // Update coin prices
        coinPrices.TON = data["the-open-network"].usd;
        coinPrices.BTC = data["bitcoin"].usd;
        coinPrices.USDT = data["tether"].usd;
        localStorage.setItem("coinPrices", JSON.stringify(coinPrices));

        // Update UI
        updateUI();
    } catch (error) {
        console.error("Error fetching coin prices:", error);
        if (retryCount > 0) {
            console.log(`Retrying fetchCoinPrices, attempts remaining: ${retryCount}`);
            setTimeout(() => fetchCoinPrices(retryCount - 1, delay * 2), delay);
        } else {
            console.error("All retry attempts failed. Using last known prices.");
            showAlert("Failed to fetch coin prices. Using last known prices.");
            updateUI();
        }
    }
};
        // Calculate the hourly mining rate in the selected coin
        const calculateMiningRate = () => {
            console.log("calculateMiningRate called");
            const monthlyUsdPerShare = 6; // 10% monthly return on $60 per share
            const monthlyUsd = shares * monthlyUsdPerShare;
            const hourlyUsd = monthlyUsd / (30 * 24);
            return hourlyUsd / coinPrices[selectedCoin]; // Hourly rate in selected coin
        };

        // Update the estimated income based on the selected period
        const updateEstimatedIncome = () => {
            console.log("updateEstimatedIncome called, shares:", shares);
            if (!incomePeriod || !estimatedIncomeDisplay) {
                console.error("incomePeriod or estimatedIncomeDisplay not found");
                return;
            }
            const period = incomePeriod.value;
            const monthlyUsdPerShare = 6;
            let usdIncome;
            if (period === "hourly") usdIncome = (shares * monthlyUsdPerShare) / (30 * 24);
            else if (period === "daily") usdIncome = (shares * monthlyUsdPerShare) / 30;
            else if (period === "weekly") usdIncome = (shares * monthlyUsdPerShare) / 30 * 7;
            else usdIncome = shares * monthlyUsdPerShare;
            const coinIncome = usdIncome / coinPrices[selectedCoin];
            estimatedIncomeDisplay.textContent = `${coinIncome.toFixed(8) || 0} ${selectedCoin} (~$${usdIncome.toFixed(2) || 0})`;
        };

        // Update mining progress, timer, and stats
        const updateMining = () => {
    console.log("updateMining called, isMining:", isMining, "shares:", shares, "balance:", balance, "income:", income);
    const now = Date.now();
    const elapsed = (now - lastUpdateTime) / 1000; // Elapsed time in seconds since last cycle start
    const remaining = Math.max(0, updateIntervalSeconds - elapsed);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);

    // Dynamically fetch DOM elements
    const nextUpdate = document.getElementById("nextUpdate");
    const progressPercent = document.getElementById("progressPercent");
    const balanceUsdDisplay = document.getElementById("balanceUsd");
    const balanceDisplay = document.getElementById("balance");
    const incomeDisplay = document.getElementById("income");
    const sharesValueDisplay = document.getElementById("sharesValue");
    const totalMiningEarnedDisplay = document.getElementById("totalMiningEarned");
    const referralDisplay = document.getElementById("referral");
    const estimatedIncomeDisplay = document.getElementById("estimatedIncome");

    // Debug logs to check if elements are found
    console.log("DOM elements - nextUpdate:", nextUpdate, "progressPercent:", progressPercent, "balanceUsdDisplay:", balanceUsdDisplay, "balanceDisplay:", balanceDisplay, "incomeDisplay:", incomeDisplay, "sharesValueDisplay:", sharesValueDisplay, "totalMiningEarnedDisplay:", totalMiningEarnedDisplay, "referralDisplay:", referralDisplay, "estimatedIncomeDisplay:", estimatedIncomeDisplay);

    // Update timer and progress
    if (nextUpdate) nextUpdate.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    const progress = (elapsed / updateIntervalSeconds) * 100;
    if (progressPercent) progressPercent.textContent = `${Math.min(100, Math.round(progress))}%`;
    const radius = 75, circumference = 2 * Math.PI * radius;
    const progressRing = document.querySelector(".progress-ring-circle");
    if (progressRing) {
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    }

    // Update mining stats if mining is active
    if (isMining && shares > 0) {
        const profitThisSecond = shares * profitPerSecondPerShare; // Profit for this second
        balance += profitThisSecond;
        income += profitThisSecond;
        totalMiningEarned += profitThisSecond;
    }

    // Update UI elements every second
    if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
    else console.error("balanceUsdDisplay not found");
    if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
    else console.error("balanceDisplay not found");
    if (incomeDisplay) incomeDisplay.textContent = income.toFixed(5);
    else console.error("incomeDisplay not found");
    if (sharesValueDisplay) sharesValueDisplay.textContent = (shares * 60).toFixed(2);
    else console.error("sharesValueDisplay not found");
    if (totalMiningEarnedDisplay) totalMiningEarnedDisplay.textContent = totalMiningEarned.toFixed(5);
    else console.error("totalMiningEarnedDisplay not found");
    if (referralDisplay) referralDisplay.textContent = referralRewards.toFixed(2);
    else console.error("referralDisplay not found");

    // Update Estimated Income in real-time
    if (estimatedIncomeDisplay) {
        const period = incomePeriod.value;
        const monthlyUsdPerShare = 6;
        let usdIncome;
        if (period === "hourly") usdIncome = (shares * monthlyUsdPerShare) / (30 * 24);
        else if (period === "daily") usdIncome = (shares * monthlyUsdPerShare) / 30;
        else if (period === "weekly") usdIncome = (shares * monthlyUsdPerShare) / 30 * 7;
        else usdIncome = shares * monthlyUsdPerShare;
        const coinIncome = usdIncome / coinPrices[selectedCoin];
        estimatedIncomeDisplay.textContent = `${coinIncome.toFixed(8) || 0} ${selectedCoin} (~$${usdIncome.toFixed(2) || 0})`;
    }

    // Reset at the end of the cycle
    if (remaining <= 0) {
        lastUpdateTime = Date.now();
        saveUserData();
    }
};

        // Function to update the UI with the selected language
        const updateLanguage = () => {
            console.log("updateLanguage called");
            const t = translations[selectedLanguage];
            document.getElementById("welcomeText").textContent = t.welcome;
            document.getElementById("selectCoinText").textContent = t.selectCoin;
            document.getElementById("selectLanguageText").textContent = t.selectLanguage;
            document.getElementById("proceedBtn").textContent = t.proceed;
            document.querySelector("#homeTab h1").textContent = t.dssGreenHash;
            document.querySelector("#homeTab #coinPriceText").innerHTML = `<span id="coinPriceLabel">${selectedCoin}</span> ${t.priceLabel}<span id="coinPrice">${coinPrices[selectedCoin].toFixed(2)}</span>`;
            document.querySelector("#homeTab #estimatedIncomeText").innerHTML = `${t.estimatedIncome} <span id="estimatedIncome">${(miningRate).toFixed(8)} ${selectedCoin} (~$${((miningRate) * coinPrices[selectedCoin]).toFixed(2)})</span>`;
            document.querySelector("#homeTab #balanceText").innerHTML = `${t.balance}<span id="balanceUsd">${balance.toFixed(2)}</span> (~<span id="balance">${(balance / coinPrices[selectedCoin]).toFixed(4)}</span> <span id="coinType">${selectedCoin}</span>)`;
            document.querySelector("#homeTab #balanceBreakdownText").innerHTML = `(<span id="sharesValueLabel">${t.sharesValue}</span>: $<span id="sharesValue">${(shares * 60).toFixed(2)}</span> | <span id="incomeLabel">${t.income}</span>: $<span id="income">${income.toFixed(2)}</span> | <span id="referralLabel">${t.referral}</span>: $<span id="referral">${referralRewards.toFixed(2)}</span>)`;
            document.querySelector("#homeTab #nextUpdateText").innerHTML = `${t.nextUpdate} <span id="nextUpdate">00:10</span>`;
            document.querySelector("#homeTab #startStopBtn").textContent = isMining ? t.stopMining : t.startMining;
            document.querySelector("#homeTab #withdrawBtn").textContent = t.withdraw;
            document.querySelector("#homeTab #transactionHistoryText").textContent = t.transactionHistory;
            document.querySelector("#homeTab #totalDepositedText").innerHTML = `${t.totalDeposited}<span id="totalDeposited">${totalDeposited.toFixed(2)}</span>`;
            document.querySelector("#homeTab #totalMiningEarnedText").innerHTML = `${t.totalMiningEarned}<span id="totalMiningEarned">${totalMiningEarned.toFixed(2)}</span>`;
            document.querySelector("#homeTab #totalReferralEarnedText").innerHTML = `${t.totalReferralEarned}<span id="totalReferralEarned">${totalReferralEarned.toFixed(2)}</span>`;
            document.querySelector("#homeTab #totalWithdrawalsText").innerHTML = `${t.totalWithdrawals}<span id="totalWithdrawals">${totalWithdrawals.toFixed(2)}</span>`;
            document.querySelector("#homeTab #progressText").innerHTML = `${t.miningProgress} <span id="progressPercent">0%</span>`;
            document.querySelector("#homeTab #incomePeriod option[value='hourly']").textContent = t.hourly;
            document.querySelector("#homeTab #incomePeriod option[value='daily']").textContent = t.daily;
            document.querySelector("#homeTab #incomePeriod option[value='weekly']").textContent = t.weekly;
            document.querySelector("#homeTab #incomePeriod option[value='monthly']").textContent = t.monthly;
            if (activeSharesDisplay) activeSharesDisplay.textContent = shares;
if (hashPowerBoostDisplay) hashPowerBoostDisplay.textContent = (shares * 0.1).toFixed(1);
document.querySelector("#boostTab #activeSharesHashPower").innerHTML = `${t.activeSharesHashPower}<br><span id="activeShares">${shares}</span>&nbsp;&nbsp;/&nbsp;&nbsp;<span id="hashPowerBoost">${(shares * 0.1).toFixed(1)}</span> TH/s)`;
const shareCostUsd = 60; // Cost of 1 share in USD
const shareCostBtc = (shareCostUsd / coinPrices.BTC).toFixed(8);
const shareCostTon = (shareCostUsd / coinPrices.TON).toFixed(4);
document.querySelector("#boostTab #shareCost").innerHTML = `${t.shareCost}:<br>(0.1 TH/s) (${shareCostUsd} $)<br>(<span id="shareCostBtc">BTC ${shareCostBtc}</span>) (<span id="shareCostTon">TON ${shareCostTon}</span>)`;
document.querySelector("#boostTab #estimatedReturns").innerHTML = `${t.estimatedReturns}:<br>(8~10%) (48 ~ 60 $)`;
document.querySelector("#boostTab #buySharesBtn").textContent = t.buyShares;
            document.querySelector("#referTab #referralLinkText").textContent = t.referralLink;
            document.querySelector("#referTab #copyLinkBtn").textContent = t.copyLink;
            document.querySelector("#referTab #referralsText").innerHTML = `${t.referrals} <span id="referralsCount">${referrals}</span>`;
            document.querySelector("#referTab #referralRewardText").textContent = t.referralReward;
            document.body.style.direction = selectedLanguage === "ar" ? "rtl" : "ltr";
        };

        // Show the initial tab (Home or Landing Page)
        const showInitialTab = () => {
            console.log("showInitialTab called");
            if (!isTelegramEnvironment || !isCloudStorageSupported) {
                console.log("Not in Telegram environment or CloudStorage not supported, showing landing page");
                if (landingPage) {
                    landingPage.classList.add("active");
                    updateLanguage();
                }
                return;
            }
            window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
                if (err) {
                    console.error("Error in showInitialTab:", err);
                    console.log("Proceeding to landing page despite CloudStorage error");
                    if (landingPage) {
                        landingPage.classList.add("active");
                        updateLanguage();
                    }
                    return;
                }
                if (savedData) {
                    console.log("User data found, loading Home tab");
                    if (landingPage) landingPage.style.display = "none";
                    if (navBar) {
                        navBar.style.display = "flex";
                        console.log("Nav bar display set to flex");
                    }
                    tabContents.forEach(content => {
                        content.classList.remove("active");
                        content.style.display = "none";
                    });
                    const homeTab = document.getElementById("homeTab");
                    if (homeTab) {
                        homeTab.style.display = "block";
                        homeTab.classList.add("active");
                        console.log("Home tab display set to block, class 'active' added");
                    } else {
                        console.error("Home tab not found");
                    }
                    navItems.forEach(item => item.classList.remove("active"));
                    if (navItems[0]) navItems[0].classList.add("active");
                    loadUserData();
                    if (progressInterval) clearInterval(progressInterval);
                    progressInterval = setInterval(updateMining, 1000);
                    console.log("progressInterval set:", progressInterval);
                } else {
                    console.log("No user data found, showing landing page");
                    if (landingPage) {
                        landingPage.classList.add("active");
                        updateLanguage();
                    }
                }
            });
        };

        // Load user data from Telegram CloudStorage
        const loadUserData = () => {
    console.log("loadUserData called");
    if (isTelegramEnvironment && isCloudStorageSupported) {
        window.Telegram.WebApp.CloudStorage.getItems([
            "miningRate", "hashPower", "balance", "income", "referralRewards", "shares",
            "selectedCoin", "selectedLanguage", "totalDeposited", "totalMiningEarned",
            "totalReferralEarned", "totalWithdrawals", "referrals", "isMining", "lastUpdateTime"
        ], (error, result) => {
            if (error) {
                console.error("Error loading user data:", error);
                showAlert(t.failedClearData);
                return;
            }
            console.log("Loaded user data:", result);
            const data = result || {};
            miningRate = parseFloat(data.miningRate) || 0;
            hashPower = parseFloat(data.hashPower) || 0;
            balance = parseFloat(data.balance) || 0;
            income = parseFloat(data.income) || 0;
            referralRewards = parseFloat(data.referralRewards) || 0;
            shares = parseInt(data.shares) || 0;
            selectedCoin = data.selectedCoin || "TON";
            selectedLanguage = data.selectedLanguage || "en";
            totalDeposited = parseFloat(data.totalDeposited) || 0;
            totalMiningEarned = parseFloat(data.totalMiningEarned) || 0;
            totalReferralEarned = parseFloat(data.totalReferralEarned) || 0;
            totalWithdrawals = parseFloat(data.totalWithdrawals) || 0;
            referrals = parseInt(data.referrals) || 0;
            isMining = data.isMining || false;
            lastUpdateTime = parseInt(data.lastUpdateTime) || Date.now();
            updateUI();
            updateLanguage();
            updateEstimatedIncome();
            if (isMining) startMining();
        });
    } else {
        console.log("CloudStorage not supported or not in Telegram environment, loading from localStorage");
        const savedData = JSON.parse(localStorage.getItem("userData")) || {};
        miningRate = parseFloat(savedData.miningRate) || 0;
        hashPower = parseFloat(savedData.hashPower) || 0;
        balance = parseFloat(savedData.balance) || 0;
        income = parseFloat(savedData.income) || 0;
        referralRewards = parseFloat(savedData.referralRewards) || 0;
        shares = parseInt(savedData.shares) || 0;
        selectedCoin = savedData.selectedCoin || "TON";
        selectedLanguage = savedData.selectedLanguage || "en";
        totalDeposited = parseFloat(savedData.totalDeposited) || 0;
        totalMiningEarned = parseFloat(savedData.totalMiningEarned) || 0;
        totalReferralEarned = parseFloat(savedData.totalReferralEarned) || 0;
        totalWithdrawals = parseFloat(savedData.totalWithdrawals) || 0;
        referrals = parseInt(savedData.referrals) || 0;
        isMining = savedData.isMining || false;
        lastUpdateTime = parseInt(savedData.lastUpdateTime) || Date.now();
        updateUI();
        updateLanguage();
        updateEstimatedIncome();
    }
};
        // Save user data to Telegram CloudStorage
        const saveUserData = () => {
    console.log("saveUserData called");
    if (isTelegramEnvironment && isCloudStorageSupported) {
        window.Telegram.WebApp.CloudStorage.setItem("miningRate", miningRate.toString());
        window.Telegram.WebApp.CloudStorage.setItem("hashPower", hashPower.toString());
        window.Telegram.WebApp.CloudStorage.setItem("balance", balance.toString());
        window.Telegram.WebApp.CloudStorage.setItem("income", income.toString());
        window.Telegram.WebApp.CloudStorage.setItem("referralRewards", referralRewards.toString());
        window.Telegram.WebApp.CloudStorage.setItem("shares", shares.toString());
        window.Telegram.WebApp.CloudStorage.setItem("selectedCoin", selectedCoin);
        window.Telegram.WebApp.CloudStorage.setItem("selectedLanguage", selectedLanguage);
        window.Telegram.WebApp.CloudStorage.setItem("totalDeposited", totalDeposited.toString());
        window.Telegram.WebApp.CloudStorage.setItem("totalMiningEarned", totalMiningEarned.toString());
        window.Telegram.WebApp.CloudStorage.setItem("totalReferralEarned", totalReferralEarned.toString());
        window.Telegram.WebApp.CloudStorage.setItem("totalWithdrawals", totalWithdrawals.toString());
        window.Telegram.WebApp.CloudStorage.setItem("referrals", referrals.toString());
        window.Telegram.WebApp.CloudStorage.setItem("isMining", isMining.toString());
        window.Telegram.WebApp.CloudStorage.setItem("lastUpdateTime", lastUpdateTime.toString());
    } else {
        console.log("Saving to localStorage as fallback");
        const userData = {
            miningRate, hashPower, balance, income, referralRewards, shares,
            selectedCoin, selectedLanguage, totalDeposited, totalMiningEarned,
            totalReferralEarned, totalWithdrawals, referrals, isMining, lastUpdateTime
        };
        localStorage.setItem("userData", JSON.stringify(userData));
    }
};
const updateUI = () => {
    console.log("updateUI called");
    if (miningSharesDisplay) miningSharesDisplay.textContent = shares;
    if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(1);
    if (activeSharesDisplay) activeSharesDisplay.textContent = shares;
    if (hashPowerBoostDisplay) hashPowerBoostDisplay.textContent = hashPower.toFixed(1);
    if (shareCostBtcDisplay && shareCostTonDisplay) {
        const shareCostUsd = 60;
        shareCostBtcDisplay.textContent = `BTC ${(shareCostUsd / coinPrices.BTC).toFixed(8)}`;
        shareCostTonDisplay.textContent = `TON ${(shareCostUsd / coinPrices.TON).toFixed(4)}`;
    }
    if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
    if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
    if (incomeDisplay) incomeDisplay.textContent = income.toFixed(5);
    if (sharesValueDisplay) sharesValueDisplay.textContent = (shares * 60).toFixed(2);
    if (totalDepositedDisplay) totalDepositedDisplay.textContent = totalDeposited.toFixed(2);
    if (totalMiningEarnedDisplay) totalMiningEarnedDisplay.textContent = totalMiningEarned.toFixed(5);
    if (totalReferralEarnedDisplay) totalReferralEarnedDisplay.textContent = totalReferralEarned.toFixed(2);
    if (totalWithdrawalsDisplay) totalWithdrawalsDisplay.textContent = totalWithdrawals.toFixed(2);
    if (referralsCount) referralsCount.textContent = referrals;
    if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
    if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
    updateEstimatedIncome();
};
        // Function to initialize the app
        function initializeApp() {
            console.log("initializeApp called");
            fetchCoinPrices();
            // Fetch coin prices every 5 minutes
            setInterval(fetchCoinPrices, 30000);
            // Listen for storage events to update UI in real-time across tabs
window.addEventListener("storage", (event) => {
    if (event.key === "userData") {
        console.log("Storage event detected, updating UI with new user data");
        const newData = JSON.parse(event.newValue) || {};
        miningRate = parseFloat(newData.miningRate) || 0;
        hashPower = parseFloat(newData.hashPower) || 0;
        balance = parseFloat(newData.balance) || 0;
        income = parseFloat(newData.income) || 0;
        referralRewards = parseFloat(newData.referralRewards) || 0;
        shares = parseInt(newData.shares) || 0;
        selectedCoin = newData.selectedCoin || selectedCoin;
        totalDeposited = parseFloat(newData.totalDeposited) || 0;
        totalMiningEarned = parseFloat(newData.totalMiningEarned) || 0;
        totalReferralEarned = parseFloat(newData.totalReferralEarned) || 0;
        totalWithdrawals = parseFloat(newData.totalWithdrawals) || 0;
        referrals = parseInt(newData.referrals) || 0;
        isMining = newData.isMining || isMining;
        lastUpdateTime = parseInt(newData.lastUpdateTime) || lastUpdateTime;
        updateUI();
    } else if (event.key === "coinPrices") {
        console.log("Storage event detected, updating UI with new coin prices");
        coinPrices = JSON.parse(event.newValue) || coinPrices;
        updateUI();
    }
});
            showInitialTab();
        }

        // Clear user data and reset the app
        const clearUserData = () => {
            console.log("clearUserData called");
            if (!isTelegramEnvironment || !isCloudStorageSupported) {
                console.log("Not in Telegram environment or CloudStorage not supported, resetting locally");
                resetApp();
                return;
            }
            window.Telegram.WebApp.CloudStorage.removeItem("userData", (err) => {
                if (err) {
                    console.error("Error clearing user data:", err);
                    showAlert(translations[selectedLanguage].failedClearData);
                    resetApp();
                    return;
                }
                showAlert(translations[selectedLanguage].userDataCleared);
                resetApp();
            });
        };

        // Helper function to reset the app
        const resetApp = () => {
            console.log("resetApp called");
            miningRate = 0; hashPower = 0; balance = 0; income = 0; referralRewards = 0; shares = 0;
            selectedCoin = "TON"; selectedLanguage = "en"; totalDeposited = 0; totalMiningEarned = 0;
            totalReferralEarned = 0; totalWithdrawals = 0; referrals = 0; isMining = false;
            lastUpdateTime = Date.now();
            if (miningSharesDisplay) miningSharesDisplay.textContent = "0";
            if (hashPowerDisplay) hashPowerDisplay.textContent = "0";
            if (balanceUsdDisplay) balanceUsdDisplay.textContent = "0.00";
            if (balanceDisplay) balanceDisplay.textContent = "0.0000";
            if (incomeDisplay) incomeDisplay.textContent = "0.00";
            if (referralDisplay) referralDisplay.textContent = "0.00";
            if (sharesValueDisplay) sharesValueDisplay.textContent = "0.00";
            if (coinTypeDisplay) coinTypeDisplay.textContent = "TON";
            if (coinPriceLabel) coinPriceLabel.textContent = "TON";
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices.TON.toFixed(2);
            if (totalDepositedDisplay) totalDepositedDisplay.textContent = "0.00";
            if (totalMiningEarnedDisplay) totalMiningEarnedDisplay.textContent = "0.00";
            if (totalReferralEarnedDisplay) totalReferralEarnedDisplay.textContent = "0.00";
            if (totalWithdrawalsDisplay) totalWithdrawalsDisplay.textContent = "0.00";
            if (referralsCount) referralsCount.textContent = "0";
            if (startStopBtn) startStopBtn.textContent = translations[selectedLanguage].startMining;
            if (miningCircle) miningCircle.classList.remove("mining");
            tabContents.forEach(content => {
                content.classList.remove("active");
                content.style.display = "none";
            });
            if (landingPage) {
                landingPage.style.display = "block";
                landingPage.classList.add("active");
            }
            if (navBar) navBar.style.display = "none";
            updateLanguage();
        };
       //clearUserData();

        // Bypassing the wallet check for now
        console.log("Bypassing wallet check for testing purposes");
        initializeApp();

        // Event listener for the Proceed button on the landing page
        if (proceedBtn) {
            proceedBtn.addEventListener("click", () => {
                try {
                    console.log("proceedBtn clicked");
                    console.log("coinSelection:", coinSelection);
                    console.log("languageSelection:", languageSelection);
                    if (!coinSelection || !languageSelection) {
                        console.error("Coin or language selection dropdown not found");
                        showAlert("Error: Coin or language selection dropdown not found.");
                        return;
                    }
                    selectedCoin = coinSelection.value || "TON";
                    selectedLanguage = languageSelection.value || "en";
                    console.log("Selected coin:", selectedCoin, "Selected language:", selectedLanguage);
                    if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
                    if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
                    if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
                    if (landingPage) {
                        landingPage.style.display = "none";
                        console.log("Landing page hidden, display:", landingPage.style.display);
                    } else {
                        console.error("Landing page element not found");
                    }
                    if (navBar) {
                        navBar.style.display = "flex";
                        console.log("Nav bar display set to flex, display:", navBar.style.display);
                    } else {
                        console.error("Nav bar element not found");
                    }
                    tabContents.forEach(content => {
                        content.classList.remove("active");
                        content.style.display = "none";
                    });
                    const homeTab = document.getElementById("homeTab");
                    if (homeTab) {
                        homeTab.style.display = "block";
                        homeTab.classList.add("active");
                        console.log("Home tab display set to block, class 'active' added, display:", homeTab.style.display);
                        console.log("Home tab computed style display:", window.getComputedStyle(homeTab).display);
                    } else {
                        console.error("Home tab not found");
                    }
                    navItems.forEach(item => item.classList.remove("active"));
                    if (navItems[0]) {
                        navItems[0].classList.add("active");
                        console.log("First nav item set to active");
                    } else {
                        console.error("Nav items not found");
                    }
                    updateLanguage();
                    saveUserData();
                    // Initialize mining updates immediately
                    updateMining();
                    if (progressInterval) clearInterval(progressInterval);
                    progressInterval = setInterval(updateMining, 1000);
                    console.log("progressInterval set after proceed:", progressInterval);
                    console.log("Proceed button logic completed");
                } catch (error) {
                    console.error("Error in proceedBtn event listener:", error);
                    showAlert("An error occurred while proceeding. Please try again.");
                }
            });
        }

        // Handle coin change in the More tab
        const handleChangeCoin = () => {
            console.log("handleChangeCoin called");
            if (!changeCoinSelection) {
                showAlert(translations[selectedLanguage].errorDropdown);
                return;
            }
            const newCoin = changeCoinSelection.value;
            if (newCoin === selectedCoin) {
                showAlert(`${translations[selectedLanguage].alreadyMiningCoin} ${newCoin}!`);
                return;
            }
            selectedCoin = newCoin;
            if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
            if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
            if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
            updateEstimatedIncome();
            saveUserData();
            showAlert(`${translations[selectedLanguage].coinChanged} ${selectedCoin}!`);
            const homeTab = document.getElementById("homeTab");
            if (homeTab && homeTab.classList.contains("active")) {
                homeTab.style.display = "none";
                (() => { homeTab.style.display = "block"; }, 10);
            }
        };

        if (moreTab) {
            moreTab.addEventListener("click", (e) => {
                if (e.target.id === "changeCoinBtn") handleChangeCoin();
            });
            moreTab.addEventListener("touchstart", (e) => {
                if (e.target.id === "changeCoinBtn") {
                    e.preventDefault();
                    handleChangeCoin();
                }
            });
        }

        if (changeCoinBtn) {
            changeCoinBtn.addEventListener("click", handleChangeCoin);
            changeCoinBtn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                handleChangeCoin();
            });
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
                }
            });
        });

        // Start/Stop mining button
        if (startStopBtn) {
            startStopBtn.addEventListener("click", () => {
                console.log("startStopBtn clicked, isMining:", isMining, "shares:", shares);
                const t = translations[selectedLanguage];
                if (isMining) {
                    clearInterval(miningInterval);
                    miningInterval = null;
                    isMining = false;
                    startStopBtn.textContent = t.startMining;
                    startStopBtn.classList.remove("mining");
                    if (miningCircle) miningCircle.classList.remove("mining");
                    console.log("Mining stopped, isMining:", isMining);
                } else {
                    if (shares === 0) {
                        showAlert(t.noShares);
                        return;
                    }
                    if (miningInterval) {
                        showAlert(t.alreadyMining);
                        return;
                    }
                    miningRate = calculateMiningRate();
                    isMining = true;
                    startStopBtn.textContent = t.stopMining;
                    startStopBtn.classList.add("mining");
                    if (miningCircle) miningCircle.classList.add("mining");
                    if (miningInterval) clearInterval(miningInterval);
                    miningInterval = setInterval(updateMining, 1000);
                    console.log("Mining started, isMining:", isMining, "miningInterval set:", miningInterval);
                    updateMining(); // Update immediately to reflect the mining state
                }
                saveUserData();
            });
        }

        // Withdraw button
        if (withdrawBtn) {
            withdrawBtn.addEventListener("click", () => {
                console.log("withdrawBtn clicked");
                const t = translations[selectedLanguage];
                const totalUsdt = balance;
                const incomeReferralUsdt = income + referralRewards;
                const totalCoin = totalUsdt / coinPrices[selectedCoin];
                const incomeReferralCoin = incomeReferralUsdt / coinPrices[selectedCoin];
                showPopup({
                    title: "Withdraw Options",
                    message: `Total Value: ${totalCoin.toFixed(4)} ${selectedCoin} (~$${totalUsdt.toFixed(2)})\nIncome + Referral: ${incomeReferralCoin.toFixed(4)} ${selectedCoin} (~$${incomeReferralUsdt.toFixed(2)})`,
                    buttons: [
                        { id: "total", text: "Withdraw Total Value" },
                        { id: "incomeReferral", text: "Withdraw Income + Referral" },
                        { type: "cancel" }
                    ]
                }, (buttonId) => {
                    if (buttonId === "total") {
                        if (totalUsdt <= 0) {
                            showAlert(t.noFunds);
                            return;
                        }
                        showPopup({
                            title: "Confirm Withdrawal",
                            message: `Withdraw: ${totalUsdt.toFixed(2)} USDT to EQ...abc`,
                            buttons: [
                                { id: "confirm", text: "Confirm" },
                                { type: "cancel" }
                            ]
                        }, (confirmId) => {
                            if (confirmId === "confirm") {
                                totalWithdrawals += totalUsdt;
                                balance = 0;
                                income = 0;
                                referralRewards = 0;
                                shares = 0;
                                hashPower = 0;
                                isMining = false;
                                lastUpdateTime = Date.now();
                                if (miningSharesDisplay) miningSharesDisplay.textContent = "0";
                                if (hashPowerDisplay) hashPowerDisplay.textContent = "0";
                                if (balanceUsdDisplay) balanceUsdDisplay.textContent = "0.00";
                                if (balanceDisplay) balanceDisplay.textContent = "0.0000";
                                if (incomeDisplay) incomeDisplay.textContent = "0.00";
                                if (referralDisplay) referralDisplay.textContent = "0.00";
                                if (sharesValueDisplay) sharesValueDisplay.textContent = "0.00";
                                if (totalWithdrawalsDisplay) totalWithdrawalsDisplay.textContent = totalWithdrawals.toFixed(2);
                                if (startStopBtn) startStopBtn.textContent = t.startMining;
                                if (miningCircle) miningCircle.classList.remove("mining");
                                clearInterval(miningInterval);
                                miningInterval = null;
                                saveUserData();
                                showAlert(t.withdrawInitiated);
                            }
                        });
                    } else if (buttonId === "incomeReferral") {
                        if (incomeReferralUsdt <= 0) {
                            showAlert(t.noIncomeReferral);
                            return;
                        }
                        showPopup({
                            title: "Confirm Withdrawal",
                            message: `Withdraw: ${incomeReferralUsdt.toFixed(2)} USDT to EQ...abc`,
                            buttons: [
                                { id: "confirm", text: "Confirm" },
                                { type: "cancel" }
                            ]
                        }, (confirmId) => {
                            if (confirmId === "confirm") {
                                totalWithdrawals += incomeReferralUsdt;
                                balance -= incomeReferralUsdt;
                                income = 0;
                                referralRewards = 0;
                                if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
                                if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
                                if (incomeDisplay) incomeDisplay.textContent = "0.00";
                                if (referralDisplay) referralDisplay.textContent = "0.00";
                                if (totalWithdrawalsDisplay) totalWithdrawalsDisplay.textContent = totalWithdrawals.toFixed(2);
                                saveUserData();
                                showAlert(t.withdrawInitiated);
                            }
                        });
                    }
                });
            });
        }

        // Update estimated income when the period dropdown changes
        if (incomePeriod) {
            incomePeriod.addEventListener("change", updateEstimatedIncome);
        }

        // Boost Tab: Buy Shares Functionality
        if (buySharesBtn) {
            buySharesBtn.addEventListener("click", () => {
                console.log("buySharesBtn clicked");
                const t = translations[selectedLanguage];
                const numShares = parseInt(sharesInput.value) || 0;
                if (numShares <= 0) {
                    showAlert("Please enter a valid number of shares.");
                    return;
                }
                shares += numShares;
                hashPower = shares * 0.1;
                totalDeposited += numShares * 60;
                balance += numShares * 60; // Add to balance
                if (miningSharesDisplay) miningSharesDisplay.textContent = shares;
                if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(1); // For Home tab
                if (activeSharesDisplay) activeSharesDisplay.textContent = shares; // For Boost tab
                if (hashPowerBoostDisplay) hashPowerBoostDisplay.textContent = hashPower.toFixed(1); // For Boost tab
                if (shareCostBtcDisplay && shareCostTonDisplay) {
     const shareCostUsd = 60;
    shareCostBtcDisplay.textContent = `BTC ${(shareCostUsd / coinPrices.BTC).toFixed(8)}`;
    shareCostTonDisplay.textContent = `TON ${(shareCostUsd / coinPrices.TON).toFixed(4)}`;
}
                if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
                if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
                if (sharesValueDisplay) sharesValueDisplay.textContent = (shares * 60).toFixed(2);
                if (totalDepositedDisplay) totalDepositedDisplay.textContent = totalDeposited.toFixed(2);
                updateEstimatedIncome();
                saveUserData();
                showAlert(t.purchaseSuccessful);
                sharesInput.value = "";
                console.log("Shares updated, shares:", shares, "balance:", balance);
            });
        }

        // Refer & Earn Tab: Generate and Copy Referral Link
        const generateReferralLink = () => {
            console.log("generateReferralLink called");
            if (referralLinkDisplay) {
                referralLinkDisplay.textContent = `https://t.me/DSSGreenHashBot?start=test_user`;
            }
        };

        if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
        console.log("copyLinkBtn clicked");
        const t = translations[selectedLanguage];
        const link = referralLinkDisplay.textContent;

        // Ensure the document is focused
        copyLinkBtn.focus();

        navigator.clipboard.writeText(link).then(() => {
            showAlert(t.linkCopied);
        }).catch(err => {
            console.error("Failed to copy link:", err);
            // Fallback: Prompt the user to copy manually
            showAlert(`Failed to copy link automatically. Please copy this link manually: ${link}`);
        });
    });
}
        // Simulate a referral (for testing purposes)
        const simulateReferral = () => {
            console.log("simulateReferral called");
            referrals += 1;
            referralRewards += 5; // $5 per referral
            totalReferralEarned += 5;
            balance += 5;
            if (referralsCount) referralsCount.textContent = referrals;
            if (referralDisplay) referralDisplay.textContent = referralRewards.toFixed(2);
            if (totalReferralEarnedDisplay) totalReferralEarnedDisplay.textContent = totalReferralEarned.toFixed(2);
            if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
            if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
            saveUserData();
        };

        // For testing: Add a button to simulate a referral (remove this in production)
        const referTab = document.getElementById("referTab");
        if (referTab) {
            const simulateBtn = document.createElement("button");
            simulateBtn.textContent = "Simulate Referral (Test)";
            simulateBtn.addEventListener("click", simulateReferral);
            referTab.appendChild(simulateBtn);
        }
    }, 0);
});
