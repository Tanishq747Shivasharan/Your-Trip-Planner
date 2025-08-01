// Admin Panel JavaScript

let adminData = {
    users: [],
    trips: [],
    analytics: {},
    reports: []
};

// Initialize admin panel
function initializeAdmin() {
    const user = Auth.getCurrentUser();
    if (!user || !user.isAdmin) {
        showNotification('Access denied. Admin privileges required.', 'error');
        showSection('dashboard');
        return;
    }
    
    loadAdminData();
    renderAdminDashboard();
    setupAdminEventListeners();
}

// Load admin data
function loadAdminData() {
    // In a real app, this would fetch from an API
    // For demo purposes, we'll use mock data
    
    adminData = {
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15', tripsCount: 5 },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-02-20', tripsCount: 3 },
            { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'inactive', joinDate: '2024-03-10', tripsCount: 1 },
            { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'active', joinDate: '2024-01-08', tripsCount: 8 }
        ],
        trips: [
            { id: 1, title: 'Summer in Bali', user: 'John Doe', status: 'completed', budget: 1200, startDate: '2024-07-15' },
            { id: 2, title: 'European Tour', user: 'Jane Smith', status: 'active', budget: 2500, startDate: '2024-10-01' },
            { id: 3, title: 'Tokyo Adventure', user: 'Mike Johnson', status: 'planning', budget: 1800, startDate: '2024-12-15' },
            { id: 4, title: 'NYC Weekend', user: 'Sarah Wilson', status: 'completed', budget: 800, startDate: '2024-09-05' }
        ],
        analytics: {
            totalUsers: 1234,
            activeUsers: 856,
            newUsersThisMonth: 127,
            totalTrips: 2567,
            completedTrips: 2234,
            upcomingTrips: 333,
            totalRevenue: 125000,
            avgTripBudget: 1450
        },
        reports: [
            { id: 1, type: 'user', title: 'Inappropriate content', reporter: 'user123', target: 'user456', status: 'pending' },
            { id: 2, type: 'trip', title: 'Spam trip posting', reporter: 'user789', target: 'trip123', status: 'resolved' }
        ]
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('adminData', JSON.stringify(adminData));
}

// Setup admin event listeners
function setupAdminEventListeners() {
    // Add event listeners for admin actions
    document.addEventListener('click', handleAdminActions);
}

// Handle admin actions
function handleAdminActions(e) {
    const action = e.target.dataset.action;
    const id = e.target.dataset.id;
    
    switch (action) {
        case 'view-user':
            viewUserDetails(id);
            break;
        case 'suspend-user':
            suspendUser(id);
            break;
        case 'delete-user':
            deleteUser(id);
            break;
        case 'view-trip':
            viewTripDetails(id);
            break;
        case 'moderate-trip':
            moderateTrip(id);
            break;
        case 'resolve-report':
            resolveReport(id);
            break;
        case 'export-data':
            exportData(e.target.dataset.type);
            break;
    }
}

// Render admin dashboard
function renderAdminDashboard() {
    updateAnalyticsCards();
    renderUserManagement();
    renderTripManagement();
    renderReportsManagement();
    renderSystemLogs();
}

// Update analytics cards
function updateAnalyticsCards() {
    const analytics = adminData.analytics;
    
    // Update existing stats or create new admin-specific stats
    const adminStats = document.querySelector('.admin-stats');
    if (adminStats) {
        adminStats.innerHTML = `
            <div class="admin-card">
                <h3>User Analytics</h3>
                <div class="metric">
                    <span>Total Users:</span>
                    <span>${analytics.totalUsers.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Active Users:</span>
                    <span>${analytics.activeUsers.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>New This Month:</span>
                    <span>${analytics.newUsersThisMonth.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>User Growth:</span>
                    <span class="positive">+${(analytics.newUsersThisMonth / analytics.totalUsers * 100).toFixed(1)}%</span>
                </div>
            </div>
            
            <div class="admin-card">
                <h3>Trip Statistics</h3>
                <div class="metric">
                    <span>Total Trips:</span>
                    <span>${analytics.totalTrips.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Completed:</span>
                    <span>${analytics.completedTrips.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Upcoming:</span>
                    <span>${analytics.upcomingTrips.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Avg Budget:</span>
                    <span>$${analytics.avgTripBudget.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="admin-card">
                <h3>Revenue Metrics</h3>
                <div class="metric">
                    <span>Total Revenue:</span>
                    <span class="revenue">$${analytics.totalRevenue.toLocaleString()}</span>
                </div>
                <div class="metric">
                    <span>Monthly Revenue:</span>
                    <span>$${(analytics.totalRevenue / 12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                </div>
                <div class="metric">
                    <span>Revenue Growth:</span>
                    <span class="positive">+15.3%</span>
                </div>
                <div class="metric">
                    <span>Avg per User:</span>
                    <span>$${(analytics.totalRevenue / analytics.totalUsers).toFixed(0)}</span>
                </div>
            </div>
        `;
    }
}

// Render user management section
function renderUserManagement() {
    const adminActions = document.querySelector('.admin-actions');
    if (adminActions) {
        adminActions.innerHTML = `
            <div class="admin-card">
                <div class="card-header">
                    <h3>User Management</h3>
                    <div class="header-actions">
                        <button class="admin-btn" data-action="export-data" data-type="users">
                            <i class="fas fa-download"></i> Export Users
                        </button>
                    </div>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Trips</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${adminData.users.map(user => `
                                <tr>
                                    <td>
                                        <div class="user-cell">
                                            <div class="user-avatar">
                                                ${user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span>${user.name}</span>
                                        </div>
                                    </td>
                                    <td>${user.email}</td>
                                    <td>
                                        <span class="status-badge ${user.status}">
                                            ${user.status}
                                        </span>
                                    </td>
                                    <td>${formatDate(user.joinDate)}</td>
                                    <td>${user.tripsCount}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" data-action="view-user" data-id="${user.id}">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn suspend" data-action="suspend-user" data-id="${user.id}">
                                                <i class="fas fa-ban"></i>
                                            </button>
                                            <button class="action-btn delete" data-action="delete-user" data-id="${user.id}">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="admin-card">
                <div class="card-header">
                    <h3>Trip Management</h3>
                    <div class="header-actions">
                        <button class="admin-btn" data-action="export-data" data-type="trips">
                            <i class="fas fa-download"></i> Export Trips
                        </button>
                    </div>
                </div>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Trip</th>
                                <th>User</th>
                                <th>Status</th>
                                <th>Budget</th>
                                <th>Start Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${adminData.trips.map(trip => `
                                <tr>
                                    <td>
                                        <div class="trip-cell">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>${trip.title}</span>
                                        </div>
                                    </td>
                                    <td>${trip.user}</td>
                                    <td>
                                        <span class="status-badge ${trip.status}">
                                            ${trip.status}
                                        </span>
                                    </td>
                                    <td>$${trip.budget.toLocaleString()}</td>
                                    <td>${formatDate(trip.startDate)}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn view" data-action="view-trip" data-id="${trip.id}">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="action-btn moderate" data-action="moderate-trip" data-id="${trip.id}">
                                                <i class="fas fa-flag"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="admin-card">
                <div class="card-header">
                    <h3>Reports & Moderation</h3>
                </div>
                <div class="reports-list">
                    ${adminData.reports.map(report => `
                        <div class="report-item">
                            <div class="report-info">
                                <h5>${report.title}</h5>
                                <p>Type: ${report.type} | Reporter: ${report.reporter} | Target: ${report.target}</p>
                            </div>
                            <div class="report-actions">
                                <span class="status-badge ${report.status}">${report.status}</span>
                                ${report.status === 'pending' ? `
                                    <button class="action-btn resolve" data-action="resolve-report" data-id="${report.id}">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    addAdminStyles();
}

// Render trip management (already included in renderUserManagement)
function renderTripManagement() {
    // Implementation included in renderUserManagement function
}

// Render reports management (already included in renderUserManagement)
function renderReportsManagement() {
    // Implementation included in renderUserManagement function
}

// Render system logs
function renderSystemLogs() {
    // Add system logs section if needed
    const logsContainer = document.createElement('div');
    logsContainer.className = 'admin-card';
    logsContainer.innerHTML = `
        <h3>Recent Activity Logs</h3>
        <div class="logs-list">
            <div class="log-item">
                <i class="fas fa-user-plus"></i>
                <span>New user registered: jane@example.com</span>
                <small>2 hours ago</small>
            </div>
            <div class="log-item">
                <i class="fas fa-plane"></i>
                <span>Trip created: Tokyo Adventure by Mike Johnson</span>
                <small>4 hours ago</small>
            </div>
            <div class="log-item">
                <i class="fas fa-flag"></i>
                <span>Content reported by user123</span>
                <small>6 hours ago</small>
            </div>
        </div>
    `;
    
    const adminContainer = document.querySelector('.admin-container');
    if (adminContainer) {
        adminContainer.appendChild(logsContainer);
    }
}

// View user details
function viewUserDetails(userId) {
    const user = adminData.users.find(u => u.id == userId);
    if (user) {
        showNotification(`Viewing details for ${user.name}`, 'info');
        // In a real app, this would open a detailed user modal
    }
}

// Suspend user
function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        const user = adminData.users.find(u => u.id == userId);
        if (user) {
            user.status = user.status === 'active' ? 'suspended' : 'active';
            localStorage.setItem('adminData', JSON.stringify(adminData));
            renderUserManagement();
            showNotification(`User ${user.status}`, 'success');
        }
    }
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        adminData.users = adminData.users.filter(u => u.id != userId);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        renderUserManagement();
        showNotification('User deleted', 'success');
    }
}

// View trip details
function viewTripDetails(tripId) {
    const trip = adminData.trips.find(t => t.id == tripId);
    if (trip) {
        showNotification(`Viewing trip: ${trip.title}`, 'info');
    }
}

// Moderate trip
function moderateTrip(tripId) {
    const trip = adminData.trips.find(t => t.id == tripId);
    if (trip) {
        const action = confirm('Approve this trip? Click Cancel to reject.');
        showNotification(`Trip ${action ? 'approved' : 'rejected'}`, 'success');
    }
}

// Resolve report
function resolveReport(reportId) {
    const report = adminData.reports.find(r => r.id == reportId);
    if (report) {
        report.status = 'resolved';
        localStorage.setItem('adminData', JSON.stringify(adminData));
        renderReportsManagement();
        showNotification('Report resolved', 'success');
    }
}

// Export data
function exportData(type) {
    let data, filename;
    
    switch (type) {
        case 'users':
            data = adminData.users;
            filename = 'users_export.json';
            break;
        case 'trips':
            data = adminData.trips;
            filename = 'trips_export.json';
            break;
        default:
            data = adminData;
            filename = 'admin_data_export.json';
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification(`${type} data exported successfully`, 'success');
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Add admin styles
function addAdminStyles() {
    const styles = `
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .header-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .admin-table-container {
            overflow-x: auto;
        }
        
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            color: #ffffff;
        }
        
        .admin-table th {
            text-align: left;
            padding: 1rem 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .admin-table td {
            padding: 1rem 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .user-cell, .trip-cell {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: linear-gradient(135deg, #64b5f6 0%, #bb86fc 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: capitalize;
        }
        
        .status-badge.active {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .status-badge.inactive, .status-badge.suspended {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .status-badge.completed {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .status-badge.planning {
            background: rgba(255, 152, 0, 0.2);
            color: #ff9800;
        }
        
        .status-badge.pending {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
        }
        
        .status-badge.resolved {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .action-buttons {
            display: flex;
            gap: 0.5rem;
        }
        
        .action-btn {
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
        }
        
        .action-btn.view {
            background: rgba(100, 181, 246, 0.2);
            color: #64b5f6;
        }
        
        .action-btn.suspend {
            background: rgba(255, 152, 0, 0.2);
            color: #ff9800;
        }
        
        .action-btn.delete {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .action-btn.moderate {
            background: rgba(156, 39, 176, 0.2);
            color: #9c27b0;
        }
        
        .action-btn.resolve {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .action-btn:hover {
            opacity: 0.8;
            transform: scale(1.05);
        }
        
        .reports-list {
            display: grid;
            gap: 1rem;
        }
        
        .report-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
        }
        
        .report-info h5 {
            color: #ffffff;
            margin-bottom: 0.25rem;
        }
        
        .report-info p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }
        
        .report-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .logs-list {
            display: grid;
            gap: 0.75rem;
        }
        
        .log-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 0.5rem;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .log-item i {
            color: #64b5f6;
            width: 16px;
        }
        
        .log-item small {
            margin-left: auto;
            color: rgba(255, 255, 255, 0.5);
        }
        
        .metric .positive {
            color: #4caf50;
        }
        
        .metric .revenue {
            color: #64b5f6;
            font-weight: 700;
        }
        
        @media (max-width: 768px) {
            .admin-table-container {
                font-size: 0.9rem;
            }
            
            .admin-table th,
            .admin-table td {
                padding: 0.75rem 0.25rem;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    `;
    
    if (!document.getElementById('admin-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'admin-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Export admin functions
window.Admin = {
    initializeAdmin,
    viewUserDetails,
    suspendUser,
    deleteUser,
    viewTripDetails,
    moderateTrip,
    resolveReport,
    exportData
};