// Authentication JavaScript

// Mock user database
const mockUsers = [
    {
        id: '1',
        email: 'admin@tripplanner.com',
        password: 'password',
        name: 'Admin User',
        isAdmin: true
    },
    {
        id: '2',
        email: 'user@tripplanner.com',
        password: 'password',
        name: 'Demo User',
        isAdmin: false
    }
];

// Form event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check credentials
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store user session
            const userSession = {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('tripPlannerUser', JSON.stringify(userSession));
            
            showNotification('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } else {
            showNotification('Invalid email or password', 'error');
        }
        
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
        console.error('Login error:', error);
    } finally {
        hideLoading();
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
            showNotification('User with this email already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            password,
            name,
            isAdmin: false
        };
        
        mockUsers.push(newUser);
        
        // Store user session
        const userSession = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('tripPlannerUser', JSON.stringify(userSession));
        
        showNotification('Registration successful!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
        console.error('Registration error:', error);
    } finally {
        hideLoading();
    }
}

// Check authentication status
function isAuthenticated() {
    const user = localStorage.getItem('tripPlannerUser');
    return user !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('tripPlannerUser');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    localStorage.removeItem('tripPlannerUser');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Protect routes (redirect to login if not authenticated)
function requireAuth() {
    if (!isAuthenticated()) {
        showNotification('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
        return false;
    }
    return true;
}

// Initialize auth check for dashboard pages
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        if (requireAuth()) {
            const user = getCurrentUser();
            if (user) {
                // Update user info in dashboard
                const userName = document.getElementById('userName');
                if (userName) {
                    userName.textContent = `Welcome back, ${user.name}!`;
                }
                
                // Show/hide admin menu
                if (user.isAdmin) {
                    const adminMenu = document.querySelector('.admin-only');
                    if (adminMenu) {
                        adminMenu.style.display = 'block';
                    }
                }
            }
        }
    });
}

// Export functions
window.Auth = {
    isAuthenticated,
    getCurrentUser,
    logout,
    requireAuth
};