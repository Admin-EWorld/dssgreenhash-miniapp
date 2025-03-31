let miningRate = 0;
let hashPower = 0;
let totalMined = 0;
let energyUsed = 0;
let rewards = 0;
let miningInterval;

const rateDisplay = document.getElementById("rate");
const hashPowerDisplay = document.getElementById("hashPower");
const totalDisplay = document.getElementById("total");
const energyDisplay = document.getElementById("energy");
const rewardsDisplay = document.getElementById("rewards");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const paymentCurrency = document.getElementById("paymentCurrency");
const upgradeBtn = document.getElementById("upgradeBtn");
const rewardCurrency = document.getElementById("rewardCurrency");
const claimBtn = document.getElementById("claimBtn");

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

// Prompt user to set up Wallet if not already done
if (!window.Telegram.WebApp.initDataUnsafe.user) {
    window.Telegram.WebApp.showAlert("Please set up your Telegram Wallet to proceed. Start @Wallet to begin.");
    window.Telegram.WebApp.openTelegramLink("https://t.me/Wallet");
}

// Start mining
startBtn.addEventListener("click", () => {
    if (miningRate === 0) {
        miningRate = 0.0001;
        hashPower = 1; // Starting hash power
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        miningInterval = setInterval(() => {
            totalMined += miningRate;
            energyUsed += 0.1;
            rewards += 0.00001; // Fake rewards accumulation
            hashPower += 0.5; // Increment hash power
            rateDisplay.textContent = miningRate.toFixed(4);
            hashPowerDisplay.textContent = hashPower.toFixed(1);
            totalDisplay.textContent = totalMined.toFixed(4);
            energyDisplay.textContent = energyUsed.toFixed(1);
            rewardsDisplay.textContent = rewards.toFixed(4);
        }, 3600000); // Update every hour
    }
});

// Stop mining
stopBtn.addEventListener("click", () => {
    clearInterval(miningInterval);
    miningRate = 0;
    rateDisplay.textContent = "0.0000";
    stopBtn.style.display = "none";
    startBtn.style.display = "block";
    startBtn.textContent = "Start Mining";
    startBtn.disabled = false;
});

// Upgrade miner (simulated payment)
upgradeBtn.addEventListener("click", () => {
    const selectedCurrency = paymentCurrency.value;
    const amount = 0.0001; // Fixed amount for simplicity

    window.Telegram.WebApp.showAlert(`Initiating payment of ${amount} ${selectedCurrency} via Wallet Pay...`);

    // Simulate payment success
    setTimeout(() => {
        miningRate += 0.00005;
        hashPower += 1; // Increase hash power with upgrade
        rateDisplay.textContent = miningRate.toFixed(4);
        hashPowerDisplay.textContent = hashPower.toFixed(1);
        window.Telegram.WebApp.showAlert("Payment successful! Miner upgraded! New rate: " + miningRate.toFixed(4) + " BTC/hour");
    }, 2000);
});

// Claim rewards in chosen currency
claimBtn.addEventListener("click", () => {
    const selectedCurrency = rewardCurrency.value;
    if (rewards <= 0) {
        window.Telegram.WebApp.showAlert("No rewards to claim!");
        return;
    }

    window.Telegram.WebApp.showAlert(`Sending ${rewards.toFixed(4)} ${selectedCurrency} to your Telegram Wallet...`);

    // Simulate reward distribution
    setTimeout(() => {
        window.Telegram.WebApp.showAlert(`Successfully sent ${rewards.toFixed(4)} ${selectedCurrency} to your Wallet!`);
        rewards = 0;
        rewardsDisplay.textContent = rewards.toFixed(4);
    }, 2000);
});
