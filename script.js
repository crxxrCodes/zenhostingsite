// script.js - Fixed Version
// Loading screen transition
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        const dashboard = document.getElementById('dashboard');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        if (dashboard) {
            dashboard.style.display = 'block';
        }
        
        loadDashboardData();
    }, 3000);
});

// API endpoint - replace with your actual API URL
const API_BASE_URL = 'https://your-api.vercel.app/api';

// Load dashboard data
async function loadDashboardData() {
    try {
        showLoadingState();
        
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, using mock data since we don't have a real API
        const bots = await getMockBotData();
        
        updateStats(bots);
        renderBots(bots);
        
        hideLoadingState();
        
        // Auto-refresh every 30 seconds
        setInterval(async () => {
            const newBots = await getMockBotData();
            updateStats(newBots);
            renderBots(newBots);
        }, 30000);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Using demo mode.');
        // Load demo data even if there's an error
        const bots = await getMockBotData();
        updateStats(bots);
        renderBots(bots);
        hideLoadingState();
    }
}

// Mock data for demonstration
async function getMockBotData() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
        {
            id: '123456789012345678',
            owner_id: '1435310225010987088',
            username: 'TestBot#1234',
            token: 'MTQ0NDIxMzEwNDU1NTcyMDcwNg.GVVyEu.test_token_here',
            language: 'python',
            running: true,
            created_at: new Date().toISOString(),
            packages: ['discord.py', 'python-dotenv'],
            ip: '192.168.1.100'
        },
        {
            id: '987654321098765432',
            owner_id: '1435310225010987088',
            username: 'JSBot#5678',
            token: 'MTQ0NDIxMzEwNDU1NTcyMDcwNg.GVVyEu.another_token_here',
            language: 'javascript',
            running: false,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            packages: ['discord.js', 'dotenv'],
            ip: '192.168.1.101'
        },
        {
            id: '555555555555555555',
            owner_id: '1435310225010987088',
            username: 'JavaBot#9999',
            token: 'MTQ0NDIxMzEwNDU1NTcyMDcwNg.GVVyEu.java_token_here',
            language: 'java',
            running: true,
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            packages: ['JDA', 'dotenv'],
            ip: '192.168.1.102'
        }
    ];
}

function updateStats(bots) {
    const totalBots = bots.length;
    const onlineBots = bots.filter(bot => bot.running).length;
    const offlineBots = totalBots - onlineBots;
    const uniqueUsers = new Set(bots.map(bot => bot.owner_id)).size;
    
    const totalBotsEl = document.getElementById('totalBots');
    const onlineBotsEl = document.getElementById('onlineBots');
    const offlineBotsEl = document.getElementById('offlineBots');
    const totalUsersEl = document.getElementById('totalUsers');
    
    if (totalBotsEl) totalBotsEl.textContent = totalBots;
    if (onlineBotsEl) onlineBotsEl.textContent = onlineBots;
    if (offlineBotsEl) offlineBotsEl.textContent = offlineBots;
    if (totalUsersEl) totalUsersEl.textContent = uniqueUsers;
}

function renderBots(bots) {
    const botsGrid = document.getElementById('botsGrid');
    if (!botsGrid) return;
    
    botsGrid.innerHTML = '';

    if (bots.length === 0) {
        botsGrid.innerHTML = `
            <div class="no-bots-message">
                <h3>No Bots Found</h3>
                <p>No bots are currently hosted on Zen Hosting.</p>
            </div>
        `;
        return;
    }

    bots.forEach(bot => {
        const botCard = document.createElement('div');
        botCard.className = 'bot-card';
        botCard.innerHTML = `
            <div class="bot-header">
                <div class="bot-id">BOT ${bot.id}</div>
                <div class="bot-status ${bot.running ? 'status-online' : 'status-offline'}">
                    ${bot.running ? 'ONLINE' : 'OFFLINE'}
                </div>
            </div>
            <div class="bot-info">
                <div class="info-row">
                    <span class="info-label">Owner ID:</span>
                    <span class="info-value">${bot.owner_id}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Username:</span>
                    <span class="info-value">${bot.username}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Language:</span>
                    <span class="info-value">${bot.language.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">IP Address:</span>
                    <span class="info-value">${bot.ip}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Created:</span>
                    <span class="info-value">${new Date(bot.created_at).toLocaleDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Packages:</span>
                    <span class="info-value">${bot.packages.join(', ') || 'None'}</span>
                </div>
            </div>
            <div class="token-display" title="Click to copy" onclick="copyToken('${bot.token}')">
                ${bot.token}
            </div>
            <input type="text" class="message-input" placeholder="Type message to send through bot..." id="message-${bot.id}">
            <div class="bot-actions">
                <button class="btn btn-primary" onclick="sendMessage('${bot.id}')">
                    Send Message
                </button>
                <button class="btn btn-danger" onclick="unhostBot('${bot.id}')">
                    Unhost Bot
                </button>
            </div>
        `;
        botsGrid.appendChild(botCard);
    });
}

function copyToken(token) {
    navigator.clipboard.writeText(token).then(() => {
        showSuccess('Token copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = token;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess('Token copied to clipboard!');
    });
}

async function sendMessage(botId) {
    const messageInput = document.getElementById(`message-${botId}`);
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    
    if (!message) {
        showError('Please enter a message');
        return;
    }

    try {
        showLoadingState();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showSuccess('Message sent successfully!');
        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        showError('Error sending message');
    } finally {
        hideLoadingState();
    }
}

async function unhostBot(botId) {
    if (!confirm('Are you sure you want to unhost this bot? This action cannot be undone.')) {
        return;
    }

    try {
        showLoadingState();
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccess('Bot unhosting initiated!');
        // Refresh data after a short delay
        setTimeout(() => loadDashboardData(), 2000);
    } catch (error) {
        console.error('Error unhosting bot:', error);
        showError('Error unhosting bot');
    } finally {
        hideLoadingState();
    }
}

function showLoadingState() {
    // You can add a loading spinner here if needed
    console.log('Loading...');
}

function hideLoadingState() {
    // Hide loading spinner if added
    console.log('Loading complete');
}

function showSuccess(message) {
    // Create a nice toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00ff00;
        color: #000;
        padding: 12px 20px;
        border-radius: 4px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 0 10px #00ff00;
    `;
    toast.textContent = `✅ ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

function showError(message) {
    // Create a nice error toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff0000;
        color: #fff;
        padding: 12px 20px;
        border-radius: 4px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 0 10px #ff0000;
    `;
    toast.textContent = `❌ ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Add some CSS for the no-bots message
const style = document.createElement('style');
style.textContent = `
    .no-bots-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        background: #001a1a;
        border: 1px solid #00ffff;
        border-radius: 8px;
    }
    
    .no-bots-message h3 {
        font-family: 'Orbitron', monospace;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #00ffff;
    }
    
    .no-bots-message p {
        color: #00ffff;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
