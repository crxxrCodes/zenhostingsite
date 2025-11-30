// Authentication state management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.subscription = null;
        this.userBots = [];
        this.init();
    }

    init() {
        this.loadUser();
        this.setupEventListeners();
    }

    loadUser() {
        const userData = localStorage.getItem('zenHostingUser');
        const subData = localStorage.getItem('zenHostingSubscription');
        const botsData = localStorage.getItem('zenHostingBots');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        if (subData) {
            this.subscription = JSON.parse(subData);
        }
        if (botsData) {
            this.userBots = JSON.parse(botsData);
        }
        
        this.updateUI();
    }

    saveUser(user, subscription = null, bots = null) {
        this.currentUser = user;
        if (subscription) {
            this.subscription = subscription;
            localStorage.setItem('zenHostingSubscription', JSON.stringify(subscription));
        }
        if (bots) {
            this.userBots = bots;
            localStorage.setItem('zenHostingBots', JSON.stringify(bots));
        }
        
        localStorage.setItem('zenHostingUser', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        this.subscription = null;
        this.userBots = [];
        localStorage.removeItem('zenHostingUser');
        localStorage.removeItem('zenHostingToken');
        localStorage.removeItem('zenHostingSubscription');
        localStorage.removeItem('zenHostingBots');
        this.updateUI();
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    canHostMoreBots() {
        if (!this.subscription) return false;
        
        if (this.subscription.plan === 'Premium') {
            return true; // Unlimited for premium
        }
        
        return this.userBots.length < this.subscription.bots_limit;
    }

    getRemainingSlots() {
        if (!this.subscription) return 0;
        
        if (this.subscription.plan === 'Premium') {
            return 999; // Effectively unlimited
        }
        
        return Math.max(0, this.subscription.bots_limit - this.userBots.length);
    }

    updateUI() {
        const userInfoElements = document.querySelectorAll('.user-info');
        const loginButtons = document.querySelectorAll('.login-btn');
        const logoutButtons = document.querySelectorAll('.logout-btn');
        const dashboardButtons = document.querySelectorAll('.dashboard-btn');
        const subscriptionIndicators = document.querySelectorAll('.subscription-tier');

        if (this.isLoggedIn()) {
            // Update user info
            userInfoElements.forEach(element => {
                element.style.display = 'block';
                const usernameEl = element.querySelector('.username');
                const subscriptionEl = element.querySelector('.subscription-tier');
                
                if (usernameEl) {
                    usernameEl.textContent = this.currentUser.username;
                }
                if (subscriptionEl) {
                    subscriptionEl.textContent = this.subscription?.plan || 'Starter';
                    subscriptionEl.className = `subscription-tier ${this.subscription?.plan?.toLowerCase() || 'starter'}`;
                }
            });

            // Update buttons
            loginButtons.forEach(btn => btn.style.display = 'none');
            logoutButtons.forEach(btn => btn.style.display = 'inline-block');
            dashboardButtons.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Go to Dashboard';
                btn.onclick = () => window.location.href = 'dashboard.html';
            });

            // Update subscription indicators
            subscriptionIndicators.forEach(indicator => {
                indicator.textContent = this.subscription?.plan || 'Starter';
                indicator.className = `subscription-tier ${this.subscription?.plan?.toLowerCase() || 'starter'}`;
            });
        } else {
            // Hide user info, show login buttons
            userInfoElements.forEach(element => {
                element.style.display = 'none';
            });

            loginButtons.forEach(btn => btn.style.display = 'inline-block');
            logoutButtons.forEach(btn => btn.style.display = 'none');
            dashboardButtons.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Go to Dashboard';
                btn.onclick = () => window.location.href = 'index.html';
            });

            subscriptionIndicators.forEach(indicator => {
                indicator.textContent = 'Starter';
                indicator.className = 'subscription-tier starter';
            });
        }
    }

    setupEventListeners() {
        // Dashboard button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dashboard-btn')) {
                if (this.isLoggedIn()) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            }

            if (e.target.classList.contains('logout-btn')) {
                this.logout();
            }
        });
    }

    // Demo function to simulate bot operations
    simulateBotOperation(operation, botId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: `${operation} completed successfully` });
            }, 2000);
        });
    }
}

// Initialize auth manager
const authManager = new AuthManager();
