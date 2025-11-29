
// Authentication state management
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUser();
        this.setupEventListeners();
    }

    loadUser() {
        const userData = localStorage.getItem('zenHostingUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }

    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem('zenHostingUser', JSON.stringify(user));
        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('zenHostingUser');
        this.updateUI();
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateUI() {
        const userInfoElements = document.querySelectorAll('.user-info');
        const loginButtons = document.querySelectorAll('.login-btn');
        const logoutButtons = document.querySelectorAll('.logout-btn');
        const dashboardButtons = document.querySelectorAll('.dashboard-btn');

        if (this.isLoggedIn()) {
            userInfoElements.forEach(element => {
                element.style.display = 'block';
                element.querySelector('.username').textContent = this.currentUser.username;
                element.querySelector('.discord-id').textContent = `Discord ID: ${this.currentUser.discordId}`;
            });

            loginButtons.forEach(btn => btn.style.display = 'none');
            logoutButtons.forEach(btn => btn.style.display = 'inline-block');
            dashboardButtons.forEach(btn => btn.textContent = 'Go to Dashboard');
        } else {
            userInfoElements.forEach(element => {
                element.style.display = 'none';
            });

            loginButtons.forEach(btn => btn.style.display = 'inline-block');
            logoutButtons.forEach(btn => btn.style.display = 'none');
            dashboardButtons.forEach(btn => btn.textContent = 'Go to Dashboard');
        }
    }

    setupEventListeners() {
        // Dashboard button handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dashboard-btn')) {
                if (this.isLoggedIn()) {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'register.html';
                }
            }

            if (e.target.classList.contains('logout-btn')) {
                this.logout();
            }
        });
    }
}

// Initialize auth manager
const authManager = new AuthManager();
