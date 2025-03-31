let miningRate = 0;
let hashPower = 0;
let balance = 0;
let earnings = 0;
let rewards = 0;
let selectedCoin = "TON";
let miningInterval;

const hashPowerDisplay = document.getElementById("hashPower");
const balanceDisplay = document.getElementById("balance");
const rewardsDisplay = document.getElementById("rewards");
const miningRateDisplay = document.getElementById("miningRate");
const miningCircle = document.getElementById("miningCircle");
const earningsDisplay = document.getElementById("earnings");
const tonPriceDisplay = document.getElementById("tonPrice");
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
const proceedBtn = document.getElementById("proceedBtn");
const navBar = document.querySelector(".nav-bar");

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

// Prompt user to set up Wallet if not already done
if (!window.Telegram.WebApp.initDataUnsafe.user) {
    window.Telegram.WebApp.showAlert("Please set up your Telegram Wallet to proceed. Start @Wallet to begin.");
    window.Telegram.WebApp.openTelegramLink("https://t.me/Wallet");
}

// Load user data from Telegram storage
const loadUserData = () => {
    window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
        if (savedData) {
            const data = JSON.parse(savedData);
            hashPower = data.hashPower || 0;
            balance = data.balance || 0;
            earnings = data.earnings || 0;
            rewards = data.rewards || 0;
            selectedCoin = data.selectedCoin || "TON";
            hashPowerDisplay.textContent = hashPower.toFixed(2);
            balanceDisplay.textContent = balance.toFixed(4);
            rewardsDisplay.textContent = rewards.toFixed(4);
            earningsDisplay.textContent = earnings.toFixed(2);
            boostHashPowerDisplay.textContent = hashPower.toFixed(2);
            coinTypeDisplay.textContent = selectedCoin;
            coinTypeRewardsDisplay.textContent = selectedCoin;
            coinTypeEarningsDisplay.textContent = selectedCoin;
            coinTypeCostDisplay.textContent = selectedCoin;
            miningRateDisplay.textContent = `+${(miningRate / 1000).toFixed(8)} ${selectedCoin}`;
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
    };
    window.Telegram.WebApp.CloudStorage.setItem("userData", JSON.stringify(data));
};

// Check if user has already selected a coin
window.Telegram.WebApp.CloudStorage.getItem("userData", (err, savedData) => {
    if (savedData) {
        landingPage.style.display = "none";
        navBar.style.display = "flex";
        document.getElementById("homeTab").classList.add("active");
        loadUserData();
    } else {
        landingPage.classList.add("active");
    }
});

// Proceed after coin selection
proceedBtn.addEventListener("click", () => {
    selectedCoin = coinSelection.value;
    coinTypeDisplay.textContent = selectedCoin;
    coinTypeRewardsDisplay.textContent = selectedCoin;
    coinTypeEarningsDisplay.textContent = selectedCoin;
    coinTypeCostDisplay.textContent = selectedCoin;
    landingPage.style.display = "none";
    navBar.style.display = "flex";
    document.getElementById("homeTab").classList.add("active");
    saveUserData();
});

// Fetch TON price from CoinGecko
const fetchTonPrice = async () => {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd");
        const data = await response.json();
        const tonPrice = data["the-open-network"].usd;
        tonPriceDisplay.textContent = tonPrice.toFixed(2);
    } catch (error) {
        console.error("Error fetching TON price:", error);
    }
};
fetchTonPrice();

// Set initial referral link
const userId = window.Telegram.WebApp.initDataUnsafe.user?.id || "123";
referralLinkDisplay.textContent = `t.me/dssgreenhash_bot/start?startapp=${userId}`;

// Navigation
navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        tabContents.forEach(content => content.classList.remove("active"));
        document.getElementById(item.dataset.tab).classList.add("active");
    });
});
navItems[0].classList.add("active");

// Start mining
startBtn.addEventListener("click", () => {
    if (miningRate === 0) {
        miningRate = 0.0001;
        hashPower = hashPower || 1;
        startBtn.textContent = "Mining...";
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        miningCircle.classList.add("active");
        miningInterval = setInterval(() => {
            balance += 0.00001;
            rewards += 0.00001;
            earnings += 0.01;
            hashPower += 0.5;
            hashPowerDisplay.textContent = hashPower.toFixed(2);
            balanceDisplay.textContent = balance.toFixed(4);
            rewardsDisplay.textContent = rewards.toFixed(4);
            miningRateDisplay.textContent = `+${(miningRate / 1000).toFixed(8)} ${selectedCoin}`;
            earningsDisplay.textContent = earnings.toFixed(2);
            boostHashPowerDisplay.textContent = hashPower.toFixed(2);
            saveUserData();
        }, 3600000); // Update every hour
    }
});

// Stop mining
stopBtn.addEventListener("click", () => {
    clearInterval(miningInterval);
    miningRate = 0;
    miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
    miningCircle.classList.remove("active");
    stopBtn.style.display = "none";
    startBtn.style.display = "block";
    startBtn.textContent = "Start Mining";
    startBtn.disabled = false;
    saveUserData();
});

// Claim rewards
claimBtn.addEventListener("click", () => {
    if (rewards <= 0) {
        window.Telegram.WebApp.showAlert("No rewards to claim!");
        return;
    }
    window.Telegram.WebApp.showAlert(`Sending ${rewards.toFixed(4)} ${selectedCoin} to your Telegram Wallet...`);
    setTimeout(() => {
        balance += rewards;
        rewards = 0;
        balanceDisplay.textContent = balance.toFixed(4);
        rewardsDisplay.textContent = rewards.toFixed(4);
        window.Telegram.WebApp.showAlert(`Successfully sent ${rewards.toFixed(4)} ${selectedCoin} to your Wallet!`);
        saveUserData();
    }, 2000);
});

// Withdraw (simulated)
withdrawBtn.addEventListener("click", () => {
    window.Telegram.WebApp.showAlert("Withdraw initiated! (Simulated)");
});

// Swap coin (simulated)
swapBtn.addEventListener("click", () => {
    window.Telegram.WebApp.showAlert("Swap coin initiated! (Simulated)");
});

// Buy miner (simulated payment)
buyMinerBtn.addEventListener("click", () => {
    const selectedCurrency = paymentCurrency.value;
    const amount = 3; // Cost in selected coin

    window.Telegram.WebApp.showAlert(`Initiating payment of ${amount} ${selectedCurrency} via Wallet Pay...`);

    setTimeout(() => {
        hashPower += 10;
        hashPowerDisplay.textContent = hashPower.toFixed(2);
        boostHashPowerDisplay.textContent = hashPower.toFixed(2);
        window.Telegram.WebApp.showAlert("Payment successful! Miner upgraded! New hashrate: " + hashPower.toFixed(2) + " TH/s");
        saveUserData();
    }, 2000);
});

// Referral withdraw (simulated)
referralWithdrawBtn.addEventListener("click", () => {
    window.Telegram.WebApp.showAlert("Withdraw initiated! (Simulated)");
});

// Copy referral link
copyLinkBtn.addEventListener("click", () => {
    const link = referralLinkDisplay.textContent;
    navigator.clipboard.writeText(link).then(() => {
        window.Telegram.WebApp.showAlert("Referral link copied!");
    });
});
