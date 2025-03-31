let miningRate = 0;
let hashPower = 0;
let balance = 0;
let earnings = 0;
let totalMined = 0;
let energyUsed = 0;
let rewards = 0;
let miningInterval;

const hashPowerDisplay = document.getElementById("hashPower");
const balanceDisplay = document.getElementById("balance");
const miningRateDisplay = document.getElementById("miningRate");
const earningsDisplay = document.getElementById("earnings");
const tonPriceDisplay = document.getElementById("tonPrice");
const boostHashPowerDisplay = document.getElementById("boostHashPower");
const referralBalanceDisplay = document.getElementById("referralBalance");
const referralLinkDisplay = document.getElementById("referralLink");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const swapBtn = document.getElementById("swapBtn");
const paymentCurrency = document.getElementById("paymentCurrency");
const buyMinerBtn = document.getElementById("buyMinerBtn");
const referralWithdrawBtn = document.getElementById("referralWithdrawBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");
const navItems = document.querySelectorAll(".nav-item");
const tabContents = document.querySelectorAll(".tab-content");

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

// Prompt user to set up Wallet if not already done
if (!window.Telegram.WebApp.initDataUnsafe.user) {
    window.Telegram.WebApp.showAlert("Please set up your Telegram Wallet to proceed. Start @Wallet to begin.");
    window.Telegram.WebApp.openTelegramLink("https://t.me/Wallet");
}

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
document.getElementById("homeTab").classList.add("active");

// Start mining
startBtn.addEventListener("click", () => {
    if (miningRate === 0) {
        miningRate = 0.0001;
        hashPower = 1;
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        miningInterval = setInterval(() => {
            totalMined += miningRate;
            balance += 0.00001;
            rewards += 0.00001;
            earnings += 0.01;
            hashPower += 0.5;
            hashPowerDisplay.textContent = hashPower.toFixed(2);
            balanceDisplay.textContent = balance.toFixed(4);
            miningRateDisplay.textContent = `+${(miningRate / 1000).toFixed(8)} TON`;
            earningsDisplay.textContent = earnings.toFixed(2);
            boostHashPowerDisplay.textContent = hashPower.toFixed(2);
        }, 3600000); // Update every hour
    }
});

// Stop mining
stopBtn.addEventListener("click", () => {
    clearInterval(miningInterval);
    miningRate = 0;
    miningRateDisplay.textContent = "+0.0000 TON";
    stopBtn.style.display = "none";
    startBtn.style.display = "block";
    startBtn.disabled = false;
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
    const amount = 3; // Cost in TON

    window.Telegram.WebApp.showAlert(`Initiating payment of ${amount} ${selectedCurrency} via Wallet Pay...`);

    setTimeout(() => {
        hashPower += 10;
        hashPowerDisplay.textContent = hashPower.toFixed(2);
        boostHashPowerDisplay.textContent = hashPower.toFixed(2);
        window.Telegram.WebApp.showAlert("Payment successful! Miner upgraded! New hashrate: " + hashPower.toFixed(2) + " TH/s");
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
