let miningRate = 0;
let totalMined = 0;
let energyUsed = 0;

const rateDisplay = document.getElementById("rate");
const totalDisplay = document.getElementById("total");
const energyDisplay = document.getElementById("energy");
const startBtn = document.getElementById("startBtn");
const upgradeBtn = document.getElementById("upgradeBtn");

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
            rateDisplay.textContent = miningRate.toFixed(4);
            totalDisplay.textContent = totalMined.toFixed(4);
            energyDisplay.textContent = energyUsed.toFixed(1);
        }, 3600000); // Update every hour
    }
});

// Upgrade miner (fake)
upgradeBtn.addEventListener("click", () => {
    miningRate += 0.00005;
    rateDisplay.textContent = miningRate.toFixed(4);
    window.Telegram.WebApp.showAlert("Miner upgraded! New rate: " + miningRate.toFixed(4) + " BTC/hour");
});