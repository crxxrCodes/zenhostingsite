// Loading screen transition
setTimeout(() => {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadDashboardData();
}, 3000);

// API endpoint - replace with your actual API URL
const API_BASE_URL = 'https://your-api.vercel.app/api';

// Load dashboard data
async function loadDashboardData() {
    try {
        // In a real implementation, you would fetch from your API
        // const response = await fetch(`${API_BASE_URL}/bots`);
        // const bots = await response.json();
        
        // For demo purposes, using mock data
        const bots = await getMockBotData();
        
        updateStats(bots);
        renderBots(bots);
        
        // Auto-refresh every 10 seconds
        setInterval(async () => {
            // const newResponse = await fetch(`${API_BASE_URL}/bots`);
            // const newBots = await newResponse.json();
            const newBots = await getMockBotData();
            updateStats(newBots);
            renderBots(newBots);
        }, 10000);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Mock data for demonstration
async function getMockBotData() {
    return [
        {
            id: '123456789',
            owner_id: '1435310225010987088',
            username: 'TestBot#1234',
            token: 'MTQ0NDIxMzEwNDU1NTcyMDcwNg.GVVyEu.test_token_here',
            language: 'python',
            running: true,
            created_at: new Date().toISOString(),
            packages: ['discord.py', 'python-dotenv'],
            ip: '127.0.0.1'
        },
        {
            id: '987654321',
            owner_id: '1435310225010987088',
            username: 'JSBot#5678',
            token: 'MTQ0NDIxMzEwNDU1NTcyMDcwNg.GVVyEu.another_token',
            language: 'javascript',
            running: false,
            created_at: new Date().toISOString(),
            packages: ['discord.js'],
            ip: '127.0.0.1'
        }
    ];
}

function updateStats(bots) {
    const totalBots = bots.length;
    const onlineBots = bots.filter(bot => bot.running).length;
    const offlineBots = totalBots - onlineBots;
    const uniqueUsers = new Set(bots.map(bot => bot.owner_id)).size;
    
    document.getElementById('totalBots').textContent = totalBots;
    document.getElementById('onlineBots').textContent = onlineBots;
    document.getElementById('offlineBots').textContent = offlineBots;
    document.getElementById('totalUsers').textContent = uniqueUsers;
}

function renderBots(bots) {
    const botsGrid = document.getElementById('botsGrid');
    botsGrid.innerHTML = '';

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
        showError('Failed to copy token');
    });
}

async function sendMessage(botId) {
    const messageInput = document.getElementById(`message-${botId}`);
    const message = messageInput.value.trim();
    
    if (!message) {
        showError('Please enter a message');
        return;
    }

    try {
        // In real implementation, call your API
        // const response = await fetch(`${API_BASE_URL}/control/message/${botId}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ message: message })
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showSuccess('Message sent successfully!');
        messageInput.value = '';
    } catch (error) {
        console.error('Error sending message:', error);
        showError('Error sending message');
    }
}

async function unhostBot(botId) {
    if (!confirm('Are you sure you want to unhost this bot? This action cannot be undone.')) {
        return;
    }

    try {
        // In real implementation, call your API
        // const response = await fetch(`${API_BASE_URL}/control/unhost/${botId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showSuccess('Bot unhosting initiated!');
        // Refresh data after a short delay
        setTimeout(() => loadDashboardData(), 2000);
    } catch (error) {
        console.error('Error unhosting bot:', error);
        showError('Error unhosting bot');
    }
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}

function showError(message) {
    alert(`❌ ${message}`);
}
