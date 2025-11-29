
// Dashboard functionality
class DashboardManager {
    constructor() {
        this.userBots = [];
        this.init();
    }

    async init() {
        if (!authManager.isLoggedIn()) {
            window.location.href = 'index.html';
            return;
        }

        this.setupEventListeners();
        await this.loadBots();
        this.renderDashboard();
    }

    async loadBots() {
        popupManager.showLoading('Loading your bots...');
        try {
            this.userBots = await discordAuth.getUserBots();
            this.updateStats();
        } catch (error) {
            popupManager.showError('Failed to load bots', error.message);
        } finally {
            popupManager.hide();
        }
    }

    updateStats() {
        const totalBots = this.userBots.length;
        const onlineBots = this.userBots.filter(bot => bot.status === 'online').length;
        const totalServers = this.userBots.reduce((sum, bot) => sum + bot.servers, 0);

        document.getElementById('total-bots').textContent = totalBots;
        document.getElementById('online-bots').textContent = onlineBots;
        document.getElementById('total-servers').textContent = totalServers;
    }

    renderDashboard() {
        this.renderUserInfo();
        this.renderBotList();
    }

    renderUserInfo() {
        const user = authManager.currentUser;
        document.getElementById('header-username').textContent = user.username;
        document.getElementById('header-discord-id').textContent = `Discord ID: ${user.id}`;
    }

    renderBotList() {
        const botList = document.getElementById('bot-list');
        
        if (this.userBots.length === 0) {
            botList.innerHTML = `
                <div class="no-bots">
                    <i class="fas fa-robot"></i>
                    <h3>No Bots Found</h3>
                    <p>Get started by adding your first Discord bot</p>
                </div>
            `;
            return;
        }

        botList.innerHTML = this.userBots.map(bot => `
            <div class="bot-card">
                <div class="bot-header">
                    <div class="bot-name">${bot.avatar} ${bot.name}</div>
                    <div class="bot-status status-${bot.status}">${bot.status.toUpperCase()}</div>
                </div>
                <div class="bot-details">
                    <div class="bot-detail">
                        <span>Bot ID:</span>
                        <span class="bot-id">${bot.id}</span>
                    </div>
                    <div class="bot-detail">
                        <span>Servers:</span>
                        <span>${bot.servers}</span>
                    </div>
                    <div class="bot-detail">
                        <span>Uptime:</span>
                        <span>${bot.uptime}</span>
                    </div>
                    <div class="bot-detail">
                        <span>Created:</span>
                        <span>${bot.created}</span>
                    </div>
                </div>
                <div class="bot-actions">
                    <button class="btn" onclick="dashboardManager.restartBot('${bot.id}')">Restart</button>
                    <button class="btn btn-outline" onclick="dashboardManager.manageBot('${bot.id}')">Manage</button>
                    <button class="btn btn-outline" onclick="dashboardManager.removeBot('${bot.id}')">Remove</button>
                </div>
            </div>
        `).join('');

        // Add "Add Bot" card
        const addCard = document.createElement('div');
        addCard.className = 'bot-card add-bot-card';
        addCard.innerHTML = `
            <i class="fas fa-plus"></i>
            <div>Add New Bot</div>
        `;
        addCard.addEventListener('click', () => this.showAddBotPopup());
        botList.appendChild(addCard);
    }

    showAddBotPopup() {
        popupManager.show(`
            <h3 class="popup-title">Add New Bot</h3>
            <div class="form-group">
                <label for="bot-name">Bot Name</label>
                <input type="text" id="bot-name" placeholder="Enter bot name" required>
            </div>
            <div class="form-group">
                <label for="bot-token">Discord Bot Token</label>
                <input type="password" id="bot-token" placeholder="Paste your bot token" required>
            </div>
            <div class="popup-buttons">
                <button class="btn btn-outline" onclick="popupManager.hide()">Cancel</button>
                <button class="btn" onclick="dashboardManager.addBot()">Add Bot</button>
            </div>
        `);
    }

    async addBot() {
        const name = document.getElementById('bot-name').value;
        const token = document.getElementById('bot-token').value;

        if (!name || !token) {
            popupManager.showError('Please fill in all fields');
            return;
        }

        popupManager.showLoading('Adding your bot...');
        
        try {
            const newBot = await discordAuth.addBot({ name, token });
            this.userBots.push(newBot);
            this.updateStats();
            this.renderBotList();
            popupManager.showSuccess('Bot added successfully!', `${name} is now being hosted.`);
        } catch (error) {
            popupManager.showError('Failed to add bot', error.message);
        }
    }

    async restartBot(botId) {
        popupManager.showConfirm(
            'Are you sure you want to restart this bot?',
            `dashboardManager.confirmRestart('${botId}')`
        );
    }

    async confirmRestart(botId) {
        popupManager.showLoading('Restarting bot...');
        
        try {
            await discordAuth.restartBot(botId);
            
            // Update bot status in UI
            const bot = this.userBots.find(b => b.id === botId);
            if (bot) {
                bot.status = 'online';
                bot.uptime = '100%';
                this.renderBotList();
            }
            
            popupManager.showSuccess('Bot restarted successfully!');
        } catch (error) {
            popupManager.showError('Failed to restart bot', error.message);
        }
    }

    async removeBot(botId) {
        const bot = this.userBots.find(b => b.id === botId);
        popupManager.showConfirm(
            `Are you sure you want to remove ${bot.name}? This action cannot be undone.`,
            `dashboardManager.confirmRemove('${botId}')`
        );
    }

    async confirmRemove(botId) {
        popupManager.showLoading('Removing bot...');
        
        try {
            await discordAuth.removeBot(botId);
            this.userBots = this.userBots.filter(bot => bot.id !== botId);
            this.updateStats();
            this.renderBotList();
            popupManager.showSuccess('Bot removed successfully!');
        } catch (error) {
            popupManager.showError('Failed to remove bot', error.message);
        }
    }

    manageBot(botId) {
        const bot = this.userBots.find(b => b.id === botId);
        popupManager.show(`
            <h3 class="popup-title">Manage ${bot.name}</h3>
            <div class="bot-management">
                <div class="form-group">
                    <label>Bot Configuration</label>
                    <textarea placeholder="Bot configuration will appear here..." rows="6" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;"></textarea>
                </div>
                <div class="form-group">
                    <label>Server Settings</label>
                    <input type="text" placeholder="Server-specific settings..." style="width: 100%;">
                </div>
            </div>
            <div class="popup-buttons">
                <button class="btn" onclick="popupManager.hide()">Save Changes</button>
                <button class="btn btn-outline" onclick="popupManager.hide()">Close</button>
            </div>
        `);
    }

    setupEventListeners() {
        document.getElementById('add-bot-btn').addEventListener('click', () => {
            this.showAddBotPopup();
        });
    }
}

// Initialize dashboard when page loads
let dashboardManager;
document.addEventListener('DOMContentLoaded', () => {
    dashboardManager = new DashboardManager();
});
