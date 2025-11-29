// Discord OAuth integration
class DiscordAuth {
    constructor() {
        this.clientId = 'YOUR_DISCORD_CLIENT_ID'; // You'll need to register your app
        this.redirectUri = `${window.location.origin}/auth/callback.html`;
        this.scope = 'identify email guilds';
    }

    // Start Discord OAuth flow
    login() {
        popupManager.showLoading('Connecting to Discord...');
        
        // Simulate API call delay
        setTimeout(() => {
            // In a real implementation, this would redirect to Discord OAuth
            // For demo, we'll simulate a successful login
            this.handleAuthSuccess({
                id: '123456789012345678',
                username: 'DemoUser',
                discriminator: '1234',
                avatar: null,
                email: 'demo@user.com'
            });
        }, 1500);
    }

    handleAuthSuccess(userData) {
        const user = {
            id: userData.id,
            username: `${userData.username}#${userData.discriminator}`,
            email: userData.email,
            avatar: userData.avatar,
            isDiscordLogin: true,
            loginTime: new Date().toISOString()
        };

        authManager.saveUser(user);
        popupManager.showSuccess('Successfully logged in with Discord!');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }

    // Get user's Discord bots (simulated)
    async getUserBots() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const bots = [
                    {
                        id: 'bot_1',
                        name: 'Music Maestro',
                        status: 'online',
                        servers: 24,
                        uptime: '99.8%',
                        avatar: '🎵',
                        created: '2024-01-15'
                    },
                    {
                        id: 'bot_2',
                        name: 'Moderation Pro',
                        status: 'online',
                        servers: 42,
                        uptime: '99.9%',
                        avatar: '🛡️',
                        created: '2024-02-20'
                    },
                    {
                        id: 'bot_3',
                        name: 'Game Master',
                        status: 'offline',
                        servers: 15,
                        uptime: '95.2%',
                        avatar: '🎮',
                        created: '2024-03-10'
                    }
                ];
                resolve(bots);
            }, 1000);
        });
    }

    // Add new bot (simulated)
    async addBot(botData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newBot = {
                    id: 'bot_' + Date.now(),
                    name: botData.name,
                    status: 'online',
                    servers: 0,
                    uptime: '100%',
                    avatar: '🤖',
                    created: new Date().toISOString().split('T')[0]
                };
                resolve(newBot);
            }, 1500);
        });
    }

    // Restart bot (simulated)
    async restartBot(botId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Bot restarted successfully' });
            }, 2000);
        });
    }

    // Remove bot (simulated)
    async removeBot(botId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Bot removed successfully' });
            }, 1000);
        });
    }
}

// Initialize Discord auth
const discordAuth = new DiscordAuth();
