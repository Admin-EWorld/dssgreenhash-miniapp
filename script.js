let miningRate = 0;
let totalMined = 0;
let energyUsed = 0;
let rewards = 0;

const rateDisplay = document.getElementById("rate");
const totalDisplay = document.getElementById("total");
const energyDisplay = document.getElementById("energy");
const rewardsDisplay = document.getElementById("rewards");
const startBtn = document.getElementById("startBtn");
const paymentCurrency = document.getElementById("paymentCurrency");
const upgradeBtn = document.getElementById("upgradeBtn");
const rewardCurrency = document.getElementById("rewardCurrency");
const claimBtn = document.getElementById("claimBtn");

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

// Start mining
startBtn.addEventListener("click", () => {
    if (miningRate === 0) {
        miningRate = 0.0001;
        startBtn.textContent = "Mining...";
        startBtn.disabled = true;
        setInterval(() => {
            totalMined += miningRate;
            energyUsed += 0.1;
            rewards += 0.00001; // Fake rewards accumulation
            rateDisplay.textContent = miningRate.toFixed(4);
            totalDisplay.textContent = totalMined.toFixed(4);
            energyDisplay.textContent = energyUsed.toFixed(1);
            rewardsDisplay.textContent = rewards.toFixed(4);
        }, 3600000); // Update every hour
    }
});

// Upgrade miner with Wallet Pay
upgradeBtn.addEventListener("click", () => {
    const selectedCurrency = paymentCurrency.value;
    const amount = 0.0001; // Fixed amount for simplicity (equivalent in BTC, USDT, or TON)

    // Simulate Wallet Pay API call (replace with actual API integration)
    const paymentData = {
        amount: amount,
        currency: selectedCurrency,
        description: "Upgrade Miner in DSS Green Hash",
        storeId: "your_wallet_pay_store_id", // Replace with your Wallet Pay Store ID
        externalId: "upgrade_" + Date.now(), // Unique transaction ID
    };

    // In a real setup, you'd make an API call to Wallet Pay to create a payment request
    // Example: POST https://pay.wallet.tg/wpay/store-api/v1/order
    // Headers: Authorization: Bearer your_wallet_pay_api_key
    // Body: paymentData
    window.Telegram.WebApp.showAlert(`Initiating payment of ${amount} ${selectedCurrency} via Wallet Pay...`);

    // Simulate payment success (replace with actual API response handling)
    setTimeout(() => {
        miningRate += 0.00005;
        rateDisplay.textContent = miningRate.toFixed(4);
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

    // In a real setup, you'd use the Wallet bot API to send the reward to the user's Telegram Wallet
    // Example: Send a transfer request to @Wallet with the amount and currency
    window.Telegram.WebApp.showAlert(`Sending ${rewards.toFixed(4)} ${selectedCurrency} to your Telegram Wallet...`);

    // Simulate reward distribution
    setTimeout(() => {
        window.Telegram.WebApp.showAlert(`Successfully sent ${rewards.toFixed(4)} ${selectedCurrency} to your Wallet!`);
        rewards = 0;
        rewardsDisplay.textContent = rewards.toFixed(4);
    }, 2000);
});
