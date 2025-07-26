// Trip Alerts JavaScript

let alerts = [];
let alertSettings = {
    weatherAlerts: true,
    flightAlerts: true,
    budgetAlerts: false,
    reminderAlerts: true
};

// Initialize alerts system
function initializeAlerts() {
    loadAlertSettings();
    loadAlerts();
    setupAlertEventListeners();
    renderAlerts();
    
    // Simulate real-time alerts
    simulateAlerts();
}

// Setup event listeners
function setupAlertEventListeners() {
    // Settings checkboxes
    document.getElementById('weatherAlerts')?.addEventListener('change', updateAlertSettings);
    document.getElementById('flightAlerts')?.addEventListener('change', updateAlertSettings);
    document.getElementById('budgetAlerts')?.addEventListener('change', updateAlertSettings);
    
    // Check for notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        requestNotificationPermission();
    }
}

// Load alert settings
function loadAlertSettings() {
    const saved = localStorage.getItem('alertSettings');
    if (saved) {
        alertSettings = { ...alertSettings, ...JSON.parse(saved) };
    }
    
    // Update UI
    Object.keys(alertSettings).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
            checkbox.checked = alertSettings[key];
        }
    });
}

// Update alert settings
function updateAlertSettings() {
    const settings = {
        weatherAlerts: document.getElementById('weatherAlerts')?.checked || false,
        flightAlerts: document.getElementById('flightAlerts')?.checked || false,
        budgetAlerts: document.getElementById('budgetAlerts')?.checked || false
    };
    
    alertSettings = { ...alertSettings, ...settings };
    localStorage.setItem('alertSettings', JSON.stringify(alertSettings));
    
    showNotification('Alert settings updated', 'success');
}

// Load alerts
function loadAlerts() {
    const saved = localStorage.getItem('tripAlerts');
    if (saved) {
        alerts = JSON.parse(saved);
    } else {
        // Initialize with sample alerts
        alerts = [
            {
                id: 1,
                type: 'weather',
                title: 'Weather Update',
                message: 'Rain expected in Paris tomorrow. Pack an umbrella!',
                timestamp: new Date().toISOString(),
                isRead: false,
                priority: 'medium',
                icon: 'fas fa-cloud-rain'
            },
            {
                id: 2,
                type: 'budget',
                title: 'Budget Alert',
                message: 'You\'ve spent 75% of your trip budget',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                isRead: true,
                priority: 'high',
                icon: 'fas fa-exclamation-triangle'
            },
            {
                id: 3,
                type: 'reminder',
                title: 'Trip Reminder',
                message: 'Don\'t forget to check-in for your flight to Tokyo',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                isRead: false,
                priority: 'high',
                icon: 'fas fa-plane'
            }
        ];
        saveAlerts();
    }
}

// Add new alert
function addAlert(alertData) {
    const alert = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        isRead: false,
        ...alertData
    };
    
    alerts.unshift(alert);
    saveAlerts();
    renderAlerts();
    
    // Show browser notification if enabled
    if (alertSettings[alert.type + 'Alerts']) {
        showBrowserNotification(alert);
    }
    
    // Show in-app notification
    showNotification(alert.message, getPriorityType(alert.priority));
}

// Show browser notification
function showBrowserNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(alert.title, {
            body: alert.message,
            icon: '/favicon.ico',
            badge: '/favicon.ico'
        });
        
        notification.onclick = function() {
            window.focus();
            markAlertAsRead(alert.id);
            notification.close();
        };
        
        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Notifications enabled!', 'success');
            }
        });
    }
}

// Render alerts list
function renderAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    if (alerts.length === 0) {
        alertsList.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-bell-slash"></i>
                <p>No alerts yet</p>
                <small>You'll see trip notifications here</small>
            </div>
        `;
        return;
    }
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.isRead ? 'read' : 'unread'} priority-${alert.priority}" onclick="markAlertAsRead(${alert.id})">
            <div class="alert-icon">
                <i class="${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <h5>${alert.title}</h5>
                <p>${alert.message}</p>
                <div class="alert-meta">
                    <span class="alert-time">${formatRelativeTime(alert.timestamp)}</span>
                    <span class="alert-type">${alert.type}</span>
                </div>
            </div>
            <div class="alert-actions">
                ${!alert.isRead ? '<div class="unread-indicator"></div>' : ''}
                <button onclick="event.stopPropagation(); removeAlert(${alert.id})" class="remove-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    addAlertStyles();
}

// Mark alert as read
function markAlertAsRead(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.isRead) {
        alert.isRead = true;
        saveAlerts();
        renderAlerts();
    }
}

// Remove alert
function removeAlert(alertId) {
    alerts = alerts.filter(a => a.id !== alertId);
    saveAlerts();
    renderAlerts();
    showNotification('Alert removed', 'info');
}

// Mark all alerts as read
function markAllAsRead() {
    alerts.forEach(alert => alert.isRead = true);
    saveAlerts();
    renderAlerts();
    showNotification('All alerts marked as read', 'success');
}

// Clear all alerts
function clearAllAlerts() {
    if (confirm('Are you sure you want to clear all alerts?')) {
        alerts = [];
        saveAlerts();
        renderAlerts();
        showNotification('All alerts cleared', 'info');
    }
}

// Simulate incoming alerts
function simulateAlerts() {
    const alertTypes = [
        {
            type: 'weather',
            titles: ['Weather Update', 'Weather Alert', 'Climate Advisory'],
            messages: [
                'Sunny skies expected for your trip!',
                'Temperature dropping to 15°C tomorrow',
                'Perfect weather for sightseeing',
                'Light rain expected in the evening'
            ],
            icon: 'fas fa-sun'
        },
        {
            type: 'flight',
            titles: ['Flight Update', 'Travel Alert', 'Flight Notification'],
            messages: [
                'Your flight is on time',
                'Gate change: Now boarding at Gate B12',
                'Check-in is now available',
                'Flight delayed by 30 minutes'
            ],
            icon: 'fas fa-plane'
        },
        {
            type: 'reminder',
            titles: ['Trip Reminder', 'Don\'t Forget', 'Reminder'],
            messages: [
                'Pack your passport!',
                'Currency exchange recommended',
                'Book restaurant reservations',
                'Download offline maps'
            ],
            icon: 'fas fa-bell'
        }
    ];
    
    // Simulate random alerts every 30-60 seconds (for demo purposes)
    const simulateRandomAlert = () => {
        if (Math.random() < 0.3) { // 30% chance
            const typeData = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            const title = typeData.titles[Math.floor(Math.random() * typeData.titles.length)];
            const message = typeData.messages[Math.floor(Math.random() * typeData.messages.length)];
            
            addAlert({
                type: typeData.type,
                title,
                message,
                priority: Math.random() < 0.3 ? 'high' : 'medium',
                icon: typeData.icon
            });
        }
    };
    
    // Start simulation
    setTimeout(() => {
        simulateRandomAlert();
        setInterval(simulateRandomAlert, 45000); // Every 45 seconds
    }, 10000); // Start after 10 seconds
}

// Save alerts to localStorage
function saveAlerts() {
    localStorage.setItem('tripAlerts', JSON.stringify(alerts));
}

// Format relative time
function formatRelativeTime(timestamp) {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return alertTime.toLocaleDateString();
}

// Get priority type for notifications
function getPriorityType(priority) {
    switch (priority) {
        case 'high': return 'error';
        case 'medium': return 'warning';
        case 'low': return 'info';
        default: return 'info';
    }
}

// Add alert styles
function addAlertStyles() {
    const styles = `
        .no-alerts {
            text-align: center;
            padding: 3rem 2rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .no-alerts i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.3);
        }
        
        .alert-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .alert-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .alert-item.unread {
            border-left: 3px solid #64b5f6;
            background: rgba(100, 181, 246, 0.1);
        }
        
        .alert-item.priority-high {
            border-left-color: #f44336;
        }
        
        .alert-item.priority-medium {
            border-left-color: #ff9800;
        }
        
        .alert-item.priority-low {
            border-left-color: #4caf50;
        }
        
        .alert-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            flex-shrink: 0;
        }
        
        .alert-item[class*="priority-high"] .alert-icon {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .alert-item[class*="priority-medium"] .alert-icon {
            background: rgba(255, 152, 0, 0.2);
            color: #ff9800;
        }
        
        .alert-item[class*="priority-low"] .alert-icon {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .alert-content {
            flex: 1;
            min-width: 0;
        }
        
        .alert-content h5 {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .alert-content p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            line-height: 1.4;
        }
        
        .alert-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .alert-type {
            text-transform: capitalize;
        }
        
        .alert-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .unread-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #64b5f6;
        }
        
        .remove-btn {
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        }
        
        .remove-btn:hover {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .alert-actions-header {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .alert-action-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        
        .alert-action-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    
    if (!document.getElementById('alert-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'alert-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Add action buttons to alerts list
        const alertsList = document.getElementById('alertsList');
        if (alertsList && !document.querySelector('.alert-actions-header')) {
            const actionsHeader = document.createElement('div');
            actionsHeader.className = 'alert-actions-header';
            actionsHeader.innerHTML = `
                <button onclick="markAllAsRead()" class="alert-action-btn">
                    <i class="fas fa-check"></i> Mark All Read
                </button>
                <button onclick="clearAllAlerts()" class="alert-action-btn">
                    <i class="fas fa-trash"></i> Clear All
                </button>
            `;
            alertsList.parentNode.insertBefore(actionsHeader, alertsList);
        }
    }
}

// Export alerts functions
window.Alerts = {
    initializeAlerts,
    addAlert,
    markAlertAsRead,
    removeAlert,
    markAllAsRead,
    clearAllAlerts
};