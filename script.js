document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // Initialize variables
        let miningRate = 0, hashPower = 0, balance = 0, income = 0, referralRewards = 0, shares = 0, selectedCoin = "TON", selectedLanguage = "en";
        let miningInterval, progressInterval;
        let coinPrices = { TON: 4.12, BTC: 60000, USDT: 1 };
        let totalDeposited = 0, totalMiningEarned = 0, totalReferralEarned = 0, totalWithdrawals = 0, referrals = 0;
        let isMining = false, lastUpdateTime = Date.now(), updateIntervalSeconds = 3600; // 60 minutes

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
                sharesCost: "1 Share = $60 (0.1 TH/s, 10% monthly return)",
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
                sharesCost: "1 سهم = $60 (0.1 TH/s، عائد شهري 10%)",
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
                🙂: "Баланс: $", 
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
                sharesCost: "1 акция = $60 (0.1 TH/s, 10% месячной прибыли)",
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
            document.querySelector("#homeTab #nextUpdateText").innerHTML = `${t.nextUpdate} <span id="nextUpdate">60:00</span>`;
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
            document.querySelector("#boostTab #sharesCost").textContent = t.sharesCost;
            document.querySelector("#boostTab #buySharesBtn").textContent = t.buyShares;
            document.querySelector("#referTab #referralLinkText").textContent = t.referralLink;
            document.querySelector("#referTab #copyLinkBtn").textContent = t.copyLink;
            document.querySelector("#referTab #referralsText").innerHTML = `${t.referrals} <span id="referralsCount">${referrals}</span>`;
            document.querySelector("#referTab #referralRewardText").textContent = t.referralReward;
            document.body.style.direction = selectedLanguage === "ar" ? "rtl" : "ltr";
        };

        // DOM elements
        const miningSharesDisplay = document.getElementById("miningShares");
        const hashPowerDisplay = document.getElementById("hashPower");
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
        if (window.Telegram && window.Telegram.WebApp) {
            console.log("Telegram WebApp version:", window.Telegram.WebApp.version);
            window.Telegram.WebApp.ready();
        }
        if (!window.Telegram.WebApp.initDataUnsafe.user) {
            showAlert(translations[selectedLanguage].walletPrompt, () => {
                window.Telegram.WebApp.openTelegramLink("https://t.me/Wallet");
            });
        }

        // Load user data from Telegram CloudStorage
        const loadUserData = () => {
            console.log("loadUserData called");
            window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
                if (err) {
                    console.error("Error loading user data:", err);
                    return;
                }
                if (savedData) {
                    const data = JSON.parse(savedData);
                    shares = data.shares || 0;
                    hashPower = shares * 0.1;
                    balance = data.balance || 0;
                    income = data.income || 0;
                    referralRewards = data.referralRewards || 0;
                    selectedCoin = data.selectedCoin || "TON";
                    selectedLanguage = data.selectedLanguage || "en";
                    totalDeposited = data.totalDeposited || 0;
                    totalMiningEarned = data.totalMiningEarned || 0;
                    totalReferralEarned = data.totalReferralEarned || 0;
                    totalWithdrawals = data.totalWithdrawals || 0;
                    referrals = data.referrals || 0;
                    isMining = data.isMining || false;
                    lastUpdateTime = data.lastUpdateTime || Date.now();
                    console.log("loadUserData: isMining =", isMining, "shares =", shares);
                    if (miningSharesDisplay) miningSharesDisplay.textContent = shares;
                    if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(2);
                    if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
                    if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
                    if (incomeDisplay) incomeDisplay.textContent = income.toFixed(2);
                    if (referralDisplay) referralDisplay.textContent = referralRewards.toFixed(2);
                    if (sharesValueDisplay) sharesValueDisplay.textContent = (shares * 60).toFixed(2);
                    if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
                    if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
                    if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
                    if (totalDepositedDisplay) totalDepositedDisplay.textContent = totalDeposited.toFixed(2);
                    if (totalMiningEarnedDisplay) totalMiningEarnedDisplay.textContent = totalMiningEarned.toFixed(2);
                    if (totalReferralEarnedDisplay) totalReferralEarnedDisplay.textContent = totalReferralEarned.toFixed(2);
                    if (totalWithdrawalsDisplay) totalWithdrawalsDisplay.textContent = totalWithdrawals.toFixed(2);
                    if (referralsCount) referralsCount.textContent = referrals;
                    if (startStopBtn) startStopBtn.textContent = isMining ? translations[selectedLanguage].stopMining : translations[selectedLanguage].startMining;
                    if (miningCircle) {
                        if (isMining) miningCircle.classList.add("mining");
                        else miningCircle.classList.remove("mining");
                    }
                    updateEstimatedIncome();
                    updateLanguage();
                    generateReferralLink();
                    if (miningInterval) clearInterval(miningInterval);
                    miningInterval = setInterval(updateMining, 1000);
                }
            });
        };

        // Save user data to Telegram CloudStorage
        const saveUserData = () => {
            console.log("saveUserData called");
            const data = { shares, balance, income, referralRewards, selectedCoin, selectedLanguage, totalDeposited, totalMiningEarned, totalReferralEarned, totalWithdrawals, referrals, isMining, lastUpdateTime };
            window.Telegram.WebApp.CloudStorage.setItem("userData", JSON.stringify(data));
        };

        // Fetch coin prices from CoinGecko API
        const fetchCoinPrices = async () => {
            console.log("fetchCoinPrices called");
            try {
                const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,bitcoin,usdt&vs_currencies=usd");
                const data = await response.json();
                coinPrices.TON = data["the-open-network"].usd;
                coinPrices.BTC = data["bitcoin"].usd;
                coinPrices.USDT = data["usdt"].usd;
                if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
                if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
                updateEstimatedIncome();
            } catch (error) {
                console.error("Error fetching coin prices:", error);
                if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
                if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
            }
        };
        fetchCoinPrices();

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
            estimatedIncomeDisplay.textContent = `${coinIncome.toFixed(8)} ${selectedCoin} (~$${usdIncome.toFixed(2)})`;
        };

        // Update mining progress, timer, and stats
        const updateMining = () => {
            console.log("updateMining called, isMining:", isMining);
            const now = Date.now();
            const elapsed = (now - lastUpdateTime) / 1000; // Elapsed time in seconds
            const remaining = Math.max(0, updateIntervalSeconds - elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = Math.floor(remaining % 60);
            if (nextUpdate) nextUpdate.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            const progress = (elapsed / updateIntervalSeconds) * 100;
            if (progressPercent) progressPercent.textContent = `${Math.min(100, Math.round(progress))}%`;
            const radius = 75, circumference = 2 * Math.PI * radius;
            const progressRing = document.querySelector(".progress-ring-circle");
            if (progressRing) {
                progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
                progressRing.style.strokeDashoffset = circumference - (progress / 100) * circumference;
            }
            if (remaining <= 0) {
                lastUpdateTime = Date.now();
                if (isMining) {
                    const hourlyUsd = (shares * 6) / (30 * 24); // Hourly income in USD
                    balance += hourlyUsd;
                    income += hourlyUsd;
                    totalMiningEarned += hourlyUsd;
                    if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
                    if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
                    if (incomeDisplay) incomeDisplay.textContent = income.toFixed(2);
                    if (totalMiningEarnedDisplay) totalMiningEarnedDisplay.textContent = totalMiningEarned.toFixed(2);
                    saveUserData();
                }
            }
        };

        // Show the initial tab (Home or Landing Page)
        const showInitialTab = () => {
            console.log("showInitialTab called");
            window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
                if (err) {
                    console.error("Error in showInitialTab:", err);
                    if (landingPage) landingPage.classList.add("active");
                    return;
                }
                if (savedData) {
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
                    if (progressInterval) clearInterval(progressInterval);
                    progressInterval = setInterval(updateMining, 1000);
                } else {
                    if (landingPage) {
                        landingPage.classList.add("active");
                        updateLanguage();
                    }
                }
            });
        };

        // Clear user data and reset the app
        const clearUserData = () => {
            console.log("clearUserData called");
            window.Telegram.WebApp.CloudStorage.removeItem("userData", (err) => {
                if (err) {
                    console.error("Error clearing user data:", err);
                    showAlert(translations[selectedLanguage].failedClearData);
                    return;
                }
                showAlert(translations[selectedLanguage].userDataCleared);
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
            });
        };
        clearUserData();

        // Initialize the app by showing the initial tab
        showInitialTab();

        // Event listener for the Proceed button on the landing page
        if (proceedBtn) {
            proceedBtn.addEventListener("click", () => {
                console.log("proceedBtn clicked");
                selectedCoin = coinSelection ? coinSelection.value : "TON";
                selectedLanguage = languageSelection ? languageSelection.value : "en";
                if (coinTypeDisplay) coinTypeDisplay.textContent = selectedCoin;
                if (coinPriceLabel) coinPriceLabel.textContent = selectedCoin;
                if (coinPriceDisplay) coinPriceDisplay.textContent = coinPrices[selectedCoin].toFixed(2);
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
                updateLanguage();
                saveUserData();
                if (progressInterval) clearInterval(progressInterval);
                progressInterval = setInterval(updateMining, 1000);
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
                setTimeout(() => { homeTab.style.display = "block"; }, 10);
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
                console.log("startStopBtn clicked, isMining:", isMining);
                const t = translations[selectedLanguage];
                if (isMining) {
                    clearInterval(miningInterval);
                    miningInterval = null;
                    isMining = false;
                    startStopBtn.textContent = t.startMining;
                    startStopBtn.classList.remove("mining");
                    if (miningCircle) miningCircle.classList.remove("mining");
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
                if (hashPowerDisplay) hashPowerDisplay.textContent = hashPower.toFixed(2);
                if (balanceUsdDisplay) balanceUsdDisplay.textContent = balance.toFixed(2);
                if (balanceDisplay) balanceDisplay.textContent = (balance / coinPrices[selectedCoin]).toFixed(4);
                if (sharesValueDisplay) sharesValueDisplay.textContent = (shares * 60).toFixed(2);
                if (totalDepositedDisplay) totalDepositedDisplay.textContent = totalDeposited.toFixed(2);
                updateEstimatedIncome();
                saveUserData();
                showAlert(t.purchaseSuccessful);
                sharesInput.value = "";
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
                navigator.clipboard.writeText(link).then(() => {
                    showAlert(t.linkCopied);
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
