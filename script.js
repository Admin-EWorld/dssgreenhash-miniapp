let miningRate = 0;
let totalMined = 0;
let energyUsed = 0;
let miningInterval;

const rateDisplay = document.getElementById("rate");
const totalDisplay = document.getElementById("total");
const energyDisplay = document.getElementById("energy");
const startBtn = document.getElementById("startBtn");
const upgradeBtn = document.getElementById("upgradeBtn");

// Create Stop button
const stopBtn = document.createElement("button");
stopBtn.textContent = "Stop Mining";
stopBtn.style.display = "none";
stopBtn.style.background = "#f44336";
stopBtn.style.color = "white";
stopBtn.style.border = "none";
stopBtn.style.padding = "10px 20px";
stopBtn.style.margin = "10px";
stopBtn.style.borderRadius = "5px";
stopBtn.style.cursor = "pointer";
document.querySelector(".container").appendChild(stopBtn);

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

// Start mining
startBtn.addEventListener("click", () => {
    if (miningRate === 0) {
        miningRate = 0.0001;
        startBtn.textContent = "Mining...";
        startBtn.style.display = "none";
        stopBtn.style.display = "block";
        miningInterval = setInterval(() => {
            totalMined += miningRate;
            energyUsed += 0.1;
            rateDisplay.textContent = miningRate.toFixed(4);
            totalDisplay.textContent = totalMined.toFixed(4);
            energyDisplay.textContent = energyUsed.toFixed(1);
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

// Upgrade miner (fake)
upgradeBtn.addEventListener("click", () => {
    miningRate += 0.00005;
    rateDisplay.textContent = miningRate.toFixed(4);
    window.Telegram.WebApp.showAlert("Miner upgraded! New rate: " + miningRate.toFixed(4) + " BTC/hour");
});
upgradeBtn.addEventListener("click", () => {
    window.Telegram.WebApp.openInvoice("200_stars_upgrade", (status) => {
        if (status === "paid") {
            miningRate += 0.00005;
            rateDisplay.textContent = miningRate.toFixed(4);
            window.Telegram.WebApp.showAlert("Miner upgraded! New rate: " + miningRate.toFixed(4) + " BTC/hour");
        }
    });
});
const hashPowerDisplay = document.getElementById("hashPower");
let hashPower = 0;
// In the mining interval:
hashPower += 0.5;
hashPowerDisplay.textContent = hashPower.toFixed(1);
