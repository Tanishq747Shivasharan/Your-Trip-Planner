// Dashboard JavaScript

let currentSection = 'dashboard';
let map = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Auth.requireAuth()) return;
    
    // Initialize dashboard
    initializeDashboard();
    
    // Load user data
    loadUserData();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Load initial data
    loadDashboardData();
});

// Initialize dashboard
function initializeDashboard() {
    const user = Auth.getCurrentUser();
    if (user) {
        // Update user name
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = `Welcome back, ${user.name}!`;
        }
        
        // Show admin menu if user is admin
        if (user.isAdmin) {
            const adminMenu = document.querySelector('.admin-only');
            if (adminMenu) {
                adminMenu.style.display = 'block';
            }
        }
    }
}

// Load user data
function loadUserData() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    // Load user stats (mock data)
    const stats = {
        totalTrips: 5,
        countriesVisited: 8,
        totalSpent: 2450,
        totalPhotos: 124
    };
    
    // Update stats in UI
    updateElement('totalTrips', stats.totalTrips);
    updateElement('countriesVisited', stats.countriesVisited);
    updateElement('totalSpent', `$${stats.totalSpent.toLocaleString()}`);
    updateElement('totalPhotos', stats.totalPhotos);
    
    // Animate counters
    if (window.Animations) {
        setTimeout(() => {
            const elements = ['totalTrips', 'countriesVisited', 'totalPhotos'];
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element && window.Animations.animateCounter) {
                    const value = parseInt(element.textContent);
                    element.textContent = '0';
                    window.Animations.animateCounter(element, value);
                }
            });
        }, 500);
    }
}

// Initialize sidebar
function initializeSidebar() {
    // Add click handlers to navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
}

// Show specific section
function showSection(sectionName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
    
    // Initialize section-specific functionality
    switch(sectionName) {
        case 'plan-trip':
            initializeTripPlanner();
            break;
        case 'budget':
            initializeBudget();
            break;
        case 'memories':
            initializeMemories();
            break;
        case 'alerts':
            initializeAlerts();
            break;
        case 'admin':
            initializeAdmin();
            break;
    }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Load dashboard data
function loadDashboardData() {
    loadRecentTrips();
}

// Load recent trips
function loadRecentTrips() {
    const recentTripsContainer = document.getElementById('recentTrips');
    if (!recentTripsContainer) return;
    
    // Mock recent trips data
    const trips = [
        {
            id: 1,
            title: 'Summer in Bali',
            destination: 'Bali, Indonesia',
            date: '2024-07-15',
            status: 'completed',
            budget: 1200,
            image: 'fas fa-umbrella-beach'
        },
        {
            id: 2,
            title: 'European Adventure',
            destination: 'Paris, France',
            date: '2024-09-20',
            status: 'upcoming',
            budget: 2000,
            image: 'fas fa-monument'
        },
        {
            id: 3,
            title: 'Tokyo Explorer',
            destination: 'Tokyo, Japan',
            date: '2024-05-10',
            status: 'completed',
            budget: 1800,
            image: 'fas fa-torii-gate'
        }
    ];
    
    // Render trips
    recentTripsContainer.innerHTML = trips.map(trip => `
        <div class="trip-item" onclick="viewTrip(${trip.id})">
            <div class="trip-icon">
                <i class="${trip.image}"></i>
            </div>
            <div class="trip-info">
                <h4>${trip.title}</h4>
                <p>${trip.destination}</p>
                <span class="trip-date">${formatDate(trip.date)}</span>
            </div>
            <div class="trip-status">
                <span class="status-badge ${trip.status}">${trip.status}</span>
                <span class="trip-budget">$${trip.budget}</span>
            </div>
        </div>
    `).join('');
    
    // Add trip item styles
    addTripItemStyles();
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

// Add trip item styles
function addTripItemStyles() {
    const styles = `
        .trip-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.75rem;
            margin-bottom: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .trip-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(5px);
        }
        
        .trip-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #64b5f6 0%, #bb86fc 100%);
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 1.2rem;
        }
        
        .trip-info {
            flex: 1;
        }
        
        .trip-info h4 {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .trip-info p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        
        .trip-date {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.8rem;
        }
        
        .trip-status {
            text-align: right;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            font-weight: 500;
            text-transform: capitalize;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .status-badge.completed {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .status-badge.upcoming {
            background: rgba(255, 152, 0, 0.2);
            color: #ff9800;
        }
        
        .trip-budget {
            color: #64b5f6;
            font-weight: 600;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.getElementById('trip-item-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'trip-item-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// View trip details
function viewTrip(tripId) {
    showNotification(`Viewing trip ${tripId}`, 'info');
    // In a real app, this would navigate to trip details page
}

// Update element helper
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Export dashboard functions
window.Dashboard = {
    showSection,
    toggleSidebar,
    loadDashboardData,
    viewTrip
};