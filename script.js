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
    let miningInterval;
    let coinPrices = {
        TON: 4.12,  // Default price, will be updated by fetch
        BTC: 60000,  // Approximate price in USD
        USDT: 1      // Stablecoin, pegged to USD
    };

    // DOM Elements
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
    const changeCoinSelection = document.getElementById("changeCoinSelection");
    const changeCoinBtn = document.getElementById("changeCoinBtn");

    // Debug: Check if critical elements are found
    console.log("startBtn:", startBtn);
    console.log("navItems:", navItems);
    console.log("changeCoinBtn:", changeCoinBtn);
    console.log("changeCoinSelection:", changeCoinSelection);
    console.log("proceedBtn:", proceedBtn);

    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        console.log("Telegram Web App initialized");
    } else {
        console.error("Telegram Web App not available");
    }

    // Prompt user to set up Wallet if not already done
    if (!window.Telegram.WebApp.initDataUnsafe.user) {
        window.Telegram.WebApp.showAlert("Please set up your Telegram Wallet to proceed. Start @Wallet to begin.");
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

    // Fetch coin prices from CoinGecko
    const fetchCoinPrices = async () => {
        try {
            console.log("Fetching coin prices...");
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=the-open-network,bitcoin,usdt&vs_currencies=usd");
            const data = await response.json();
            coinPrices.TON = data["the-open-network"].usd;
            coinPrices.BTC = data["bitcoin"].usd;
            coinPrices.USDT = data["usdt"].usd;
            tonPriceDisplay.textContent = coinPrices.TON.toFixed(2);
            console.log("Coin prices fetched:", coinPrices);
        } catch (error) {
            console.error("Error fetching coin prices:", error);
            tonPriceDisplay.textContent = coinPrices.TON.toFixed(2);
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
            }
        });
    };

    // Clear user data (for testing)
    const clearUserData = () => {
        console.log("Attempting to clear user data...");
        window.Telegram.WebApp.CloudStorage.removeItem("userData", (err) => {
            if (err) {
                console.error("Error clearing user data:", err);
                window.Telegram.WebApp.showAlert("Failed to clear user data. Please try again.");
            } else {
                console.log("User data cleared successfully");
                window.Telegram.WebApp.showAlert("User data cleared! Refresh the app.");
                // Reset local variables
                miningRate = 0;
                hashPower = 0;
                balance = 0;
                earnings = 0;
                rewards = 0;
                selectedCoin = "TON";
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
                // Show landing page
                tabContents.forEach(content => {
                    content.classList.remove("active");
                    content.style.display = "none";
                });
                landingPage.style.display = "block";
                landingPage.classList.add("active");
                navBar.style.display = "none";
            }
        });
    };
    clearUserData();

    // Call the function to show the initial tab
    showInitialTab();

    // Proceed after coin selection
    if (proceedBtn) {
        proceedBtn.addEventListener("click", () => {
            console.log("Proceed button clicked");
            selectedCoin = coinSelection.value;
            console.log("Selected coin:", selectedCoin);
            coinTypeDisplay.textContent = selectedCoin;
            coinTypeRewardsDisplay.textContent = selectedCoin;
            coinTypeEarningsDisplay.textContent = selectedCoin;
            coinTypeCostDisplay.textContent = selectedCoin;
            miningRateDisplay.textContent = `+0.0000 ${selectedCoin}`;
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
            saveUserData();
            console.log("User data saved after coin selection");
        });
    } else {
        console.error("proceedBtn not found in DOM");
    }

    // Change coin in More tab
    const handleChangeCoin = () => {
        console.log("Change coin function triggered");
        if (!changeCoinSelection) {
            console.error("changeCoinSelection element not found");
            return;
        }
        const newCoin = changeCoinSelection.value;
        console.log("New coin selected:", newCoin);
        if (newCoin === selectedCoin) {
            console.log("Same coin selected, showing alert");
            window.Telegram.WebApp.showAlert("You are already mining " + newCoin + "!");
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
        if (miningRate > 0) {
            console.log("Mining is active, recalculating mining rate...");
            miningRate = calculateMiningRate();
            miningRateDisplay.textContent = `+${(miningRate).toFixed(8)} ${selectedCoin}`;
        }
        console.log("Saving user data after coin change...");
        saveUserData();
        console.log("Showing confirmation alert...");
        window.Telegram.WebApp.showAlert("Coin changed to " + selectedCoin + "!");
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

    if (changeCoinBtn) {
        console.log("Attaching event listeners to changeCoinBtn");
        changeCoinBtn.addEventListener("click", handleChangeCoin);
        changeCoinBtn.addEventListener("touchstart", (e) => {
            e.preventDefault(); // Prevent default touch behavior
            console.log("Touchstart event on changeCoinBtn");
            handleChangeCoin();
        });
    } else {
        console.error("changeCoinBtn not found in DOM");
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
                startBtn.textContent = "Mining...";
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
            startBtn.textContent = "Start Mining";
            startBtn.disabled = false;
            saveUserData();
            console.log("Mining stopped");
        });
    } else {
        console.error("stopBtn not found in DOM");
    }

    // Claim rewards
    if (claimBtn) {
        startBtn.addEventListener("click", () => {
            console.log("Claim rewards button clicked");
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
    } else {
        console.error("claimBtn not found in DOM");
    }

    // Withdraw (simulated)
    if (withdrawBtn) {
        withdrawBtn.addEventListener("click", () => {
            console.log("Withdraw button clicked");
            window.Telegram.WebApp.showAlert("Withdraw initiated! (Simulated)");
        });
    } else {
        console.error("withdrawBtn not found in DOM");
    }

    // Swap coin (simulated)
    if (swapBtn) {
        swapBtn.addEventListener("click", () => {
            console.log("Swap coin button clicked");
            window.Telegram.WebApp.showAlert("Swap coin initiated! (Simulated)");
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
            window.Telegram.WebApp.showAlert(`Initiating payment of ${amount} ${selectedCurrency} via Wallet Pay...`);
            setTimeout(() => {
                hashPower += 10;
                hashPowerDisplay.textContent = hashPower.toFixed(2);
                boostHashPowerDisplay.textContent = hashPower.toFixed(2);
                window.Telegram.WebApp.showAlert("Payment successful! Miner upgraded! New hashrate: " + hashPower.toFixed(2) + " TH/s");
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
            window.Telegram.WebApp.showAlert("Withdraw initiated! (Simulated)");
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
                window.Telegram.WebApp.showAlert("Referral link copied!");
            });
        });
    } else {
        console.error("copyLinkBtn not found in DOM");
    }
});
