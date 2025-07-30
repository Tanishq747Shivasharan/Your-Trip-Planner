// Enhanced Dashboard JavaScript with Appwrite Integration and Theme Toggle

// Global variables
let currentSection = 'dashboard';
let selectedTripType = 'solo';
let currentSmartTripType = 'solo';
let smartBudgetMap = null;
let plannerMapInstance = null;
let appwriteClient = null;
let appwriteStorage = null;
let appwriteDatabase = null;
let memories = [];
let currentFilter = 'all';
let currentShareMemory = null;

// Theme management
let isDarkTheme = localStorage.getItem('darkTheme') === 'true';

// Initialize Appwrite
function initializeAppwrite() {
    try {
        appwriteClient = new Appwrite.Client();
        appwriteClient
            .setEndpoint('https://fra.cloud.appwrite.io/v1')
            .setProject('688a35010027e33b0bf5');

        appwriteStorage = new Appwrite.Storage(appwriteClient);
        appwriteDatabase = new Appwrite.Databases(appwriteClient);
        
        console.log('Appwrite initialized successfully');
    } catch (error) {
        console.error('Error initializing Appwrite:', error);
    }
}

// Theme functions
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.checked = true;
    }
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    localStorage.setItem('darkTheme', isDarkTheme.toString());
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.checked = isDarkTheme;
    
    // Animate theme transition
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Navigation functions
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    document.getElementById(section + '-section').classList.add('active');

    // Add active class to clicked nav item
    document.querySelector(`[onclick="showSection('${section}')"]`).classList.add('active');

    currentSection = section;

    // Initialize section-specific functionality
    if (section === 'budget' && !smartBudgetMap) {
        setTimeout(initSmartBudgetMap, 100);
    }
    if (section === 'plan-trip' && !plannerMapInstance) {
        setTimeout(initPlannerMap, 100);
    }
    if (section === 'memories') {
        initializeMemories();
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Memory Management Functions
async function uploadToAppwrite(file) {
    try {
        showLoadingOverlay(true);
        
        const fileId = generateUniqueId();
        const response = await appwriteStorage.createFile(
            '688a353c0006584acfd1', // bucket ID
            fileId,
            file
        );

        // Get file URL
        const fileUrl = appwriteStorage.getFileView('688a353c0006584acfd1', fileId);
        
        const memory = {
            id: fileId,
            title: file.name.split('.')[0],
            description: '',
            imageUrl: fileUrl,
            uploadDate: new Date().toISOString(),
            isLiked: false,
            tags: []
        };

        // Save memory metadata to database
        await saveMemoryToDatabase(memory);
        
        memories.unshift(memory);
        updateMemoryCount();
        renderMemories();
        
        showNotification('Photo uploaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error uploading to Appwrite:', error);
        showNotification('Failed to upload photo. Please try again.', 'error');
    } finally {
        showLoadingOverlay(false);
        hideUploadProgress();
    }
}

async function saveMemoryToDatabase(memory) {
    try {
        await appwriteDatabase.createDocument(
            '688a35bd003c96333426', // database ID
            '688a35e90034ccc039b0', // collection ID
            memory.id,
            {
                title: memory.title,
                description: memory.description,
                imageUrl: memory.imageUrl,
                uploadDate: memory.uploadDate,
                isLiked: memory.isLiked,
                tags: memory.tags
            }
        );
    } catch (error) {
        console.error('Error saving memory to database:', error);
    }
}

async function loadMemoriesFromAppwrite() {
    try {
        showLoadingOverlay(true);
        
        const response = await appwriteDatabase.listDocuments(
            '688a35bd003c96333426', // project ID as database ID
            '688a35e90034ccc039b0' // collection ID (bucket ID)
        );

        memories = response.documents.map(doc => ({
            id: doc.$id,
            title: doc.title,
            description: doc.description,
            imageUrl: doc.imageUrl,
            uploadDate: doc.uploadDate,
            isLiked: doc.isLiked,
            tags: doc.tags || []
        }));

        // Sort by upload date (newest first)
        memories.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        
        updateMemoryCount();
        renderMemories();
        
    } catch (error) {
        console.error('Error loading memories from Appwrite:', error);
        // No fallback to mock data
        memories = [];
        updateMemoryCount();
        renderMemories();
    } finally {
        showLoadingOverlay(false);
    }
}

function loadMockMemories() {
    // Removed mock data, now loads memories from Appwrite backend
    if (appwriteStorage && appwriteDatabase) {
        loadMemoriesFromAppwrite();
    } else {
        memories = [];
        updateMemoryCount();
        renderMemories();
    }
}

function initializeMemories() {
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', handleFileUpload);
    }

    // Setup drag and drop
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
    }

    // Load memories from Appwrite backend only
    if (appwriteStorage && appwriteDatabase) {
        loadMemoriesFromAppwrite();
    } else {
        memories = [];
        updateMemoryCount();
        renderMemories();
    }
}

function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--accent)';
    e.currentTarget.style.background = 'var(--primary-light-1)';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--primary-light-3)';
    e.currentTarget.style.background = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.borderColor = 'var(--primary-light-3)';
    e.currentTarget.style.background = '';
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function processFiles(files) {
    const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`${file.name} is not an image file`, 'error');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification(`${file.name} is too large (max 10MB)`, 'error');
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // Process files one by one
    processFileSequentially(validFiles, 0);
}

async function processFileSequentially(files, index) {
    if (index >= files.length) return;

    const file = files[index];
    showUploadProgress(index + 1, files.length);
    
    if (appwriteStorage) {
        await uploadToAppwrite(file);
    } else {
        // Fallback for demo
        await uploadMockFile(file);
    }
    
    // Process next file
    setTimeout(() => {
        processFileSequentially(files, index + 1);
    }, 500);
}

async function uploadMockFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const memory = {
                id: generateUniqueId(),
                title: file.name.split('.')[0],
                description: '',
                imageUrl: e.target.result,
                uploadDate: new Date().toISOString(),
                isLiked: false,
                tags: []
            };

            memories.unshift(memory);
            updateMemoryCount();
            renderMemories();
            showNotification('Photo uploaded successfully!', 'success');
            resolve();
        };
        reader.readAsDataURL(file);
    });
}

function showUploadProgress(current, total) {
    const progressElement = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressElement && progressFill && progressText) {
        progressElement.style.display = 'block';
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Uploading... ${current}/${total} (${Math.round(percentage)}%)`;
    }
}

function hideUploadProgress() {
    const progressElement = document.getElementById('uploadProgress');
    if (progressElement) {
        setTimeout(() => {
            progressElement.style.display = 'none';
        }, 1000);
    }
}

function filterMemories(filter) {
    currentFilter = filter;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderMemories();
}

function renderMemories() {
    const gallery = document.getElementById('memoriesGallery');
    const emptyState = document.getElementById('emptyState');
    
    if (!gallery) return;

    let filteredMemories = memories;
    
    // Apply filter
    switch (currentFilter) {
        case 'recent':
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            filteredMemories = memories.filter(memory => 
                new Date(memory.uploadDate) > sevenDaysAgo
            );
            break;
        case 'favorites':
            filteredMemories = memories.filter(memory => memory.isLiked);
            break;
        default: // 'all'
            filteredMemories = memories;
    }

    if (filteredMemories.length === 0) {
        gallery.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Render memory cards
    gallery.innerHTML = filteredMemories.map(memory => `
        <div class="memory-card" data-id="${memory.id}">
            <div class="memory-image">
                <img src="${memory.imageUrl}" alt="${memory.title}" loading="lazy">
                <div class="memory-overlay">
                    <div class="memory-actions">
                        <button class="memory-action ${memory.isLiked ? 'liked' : ''}" 
                                onclick="toggleLike('${memory.id}')" title="Like">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="memory-action" onclick="shareMemory('${memory.id}')" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="memory-action" onclick="downloadImage('${memory.id}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="memory-info">
                <h4 class="memory-title">${memory.title}</h4>
                <div class="memory-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${formatMemoryDate(memory.uploadDate)}
                </div>
                ${memory.description ? `<p class="memory-description">${memory.description}</p>` : ''}
                ${memory.tags && memory.tags.length > 0 ? `
                    <div class="memory-tags">
                        ${memory.tags.map(tag => `<span class="memory-tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function toggleLike(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    memory.isLiked = !memory.isLiked;
    
    // Update in database if available
    if (appwriteDatabase) {
        try {
            await appwriteDatabase.updateDocument(
                '688a35bd003c96333426',
                '688a353c0006584acfd1',
                memoryId,
                { isLiked: memory.isLiked }
            );
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    }
    
    updateMemoryCount();
    renderMemories();
    
    // Show feedback
    const action = memory.isLiked ? 'added to' : 'removed from';
    showNotification(`Memory ${action} favorites!`, 'success');
}

function shareMemory(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    currentShareMemory = memory;
    
    // Update share modal content
    const sharePreview = document.getElementById('sharePreview');
    if (sharePreview) {
        sharePreview.innerHTML = `
            <img src="${memory.imageUrl}" alt="${memory.title}">
            <h4>${memory.title}</h4>
            <p>${memory.description || 'Check out this amazing travel memory!'}</p>
        `;
    }
    
    // Show share modal
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeShareModal() {
    const shareModal = document.getElementById('shareModal');
    if (shareModal) {
        shareModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    currentShareMemory = null;
}

function shareToWhatsApp() {
    if (!currentShareMemory) return;
    
    const text = `Check out this amazing travel memory: ${currentShareMemory.title}\n${currentShareMemory.imageUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function shareToTelegram() {
    if (!currentShareMemory) return;
    
    const text = `Check out this amazing travel memory: ${currentShareMemory.title}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentShareMemory.imageUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function shareToInstagram() {
    showNotification('Instagram sharing requires the mobile app', 'info');
    closeShareModal();
}

function shareToFacebook() {
    if (!currentShareMemory) return;
    
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareMemory.imageUrl)}`;
    window.open(url, '_blank');
    closeShareModal();
}

function shareToTwitter() {
    if (!currentShareMemory) return;
    
    const text = `Check out this amazing travel memory: ${currentShareMemory.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentShareMemory.imageUrl)}`;
    window.open(url, '_blank');
    closeShareModal();
}

async function copyImageLink() {
    if (!currentShareMemory) return;
    
    try {
        await navigator.clipboard.writeText(currentShareMemory.imageUrl);
        showNotification('Image link copied to clipboard!', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Failed to copy link', 'error');
    }
    closeShareModal();
}

function downloadImage(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    const link = document.createElement('a');
    link.href = memory.imageUrl;
    link.download = `${memory.title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Image download started!', 'success');
}

function updateMemoryCount() {
    const allCount = document.getElementById('allCount');
    const recentCount = document.getElementById('recentCount');
    const favoritesCount = document.getElementById('favoritesCount');
    
    if (!allCount || !recentCount || !favoritesCount) return;
    
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = memories.filter(memory => new Date(memory.uploadDate) > sevenDaysAgo);
    const favorites = memories.filter(memory => memory.isLiked);
    
    allCount.textContent = memories.length;
    recentCount.textContent = recent.length;
    favoritesCount.textContent = favorites.length;
    
    // Update total photos stat
    const totalPhotos = document.getElementById('totalPhotos');
    if (totalPhotos) {
        totalPhotos.textContent = memories.length;
    }
}

function formatMemoryDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Utility functions
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid var(--primary-light-3);
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: var(--shadow-medium);
        z-index: 4000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    // Add type-specific styles
    if (type === 'success') {
        notification.style.borderColor = 'var(--success)';
        notification.style.color = 'var(--success)';
    } else if (type === 'error') {
        notification.style.borderColor = 'var(--error)';
        notification.style.color = 'var(--error)';
    } else if (type === 'warning') {
        notification.style.borderColor = 'var(--warning)';
        notification.style.color = 'var(--warning)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Trip planning functions (existing)
function selectTripType(type) {
    selectedTripType = type;
    document.querySelectorAll('.trip-type').forEach(el => {
        el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function selectDestination(destination) {
    document.getElementById('destinationInput').value = destination;
    if (plannerMapInstance) {
        updatePlannerMap(destination);
    }
}

function searchDestinations() {
    const query = document.getElementById('destinationInput').value;
    console.log('Searching for destinations:', query);
}

function createTrip(event) {
    event.preventDefault();
    const formData = {
        title: document.getElementById('tripTitle').value,
        duration: document.getElementById('tripDuration').value,
        startDate: document.getElementById('startDate').value,
        budget: document.getElementById('tripBudget').value,
        type: selectedTripType
    };
    console.log('Creating trip:', formData);
    showNotification('Trip created successfully!', 'success');
}

// Budget functionality (existing data)
const destinationBudgetData = {
    'paris': { accommodation: 40, food: 25, transport: 10, activities: 20, emergency: 5 },
    'tokyo': { accommodation: 35, food: 30, transport: 15, activities: 15, emergency: 5 },
    'bali': { accommodation: 25, food: 20, transport: 15, activities: 30, emergency: 10 },
    'london': { accommodation: 45, food: 30, transport: 12, activities: 10, emergency: 3 },
    'new york': { accommodation: 50, food: 25, transport: 8, activities: 12, emergency: 5 },
    'thailand': { accommodation: 20, food: 15, transport: 20, activities: 35, emergency: 10 },
    'rome': { accommodation: 35, food: 28, transport: 12, activities: 20, emergency: 5 },
    'barcelona': { accommodation: 30, food: 25, transport: 15, activities: 25, emergency: 5 },
    'amsterdam': { accommodation: 40, food: 30, transport: 10, activities: 15, emergency: 5 },
    'dubai': { accommodation: 45, food: 20, transport: 15, activities: 15, emergency: 5 },
    'india': { accommodation: 35, food: 25, transport: 15, activities: 20, emergency: 5 },
    'default': { accommodation: 35, food: 25, transport: 15, activities: 20, emergency: 5 }
};

// Map functions (existing)
function initSmartBudgetMap() {
    if (smartBudgetMap) {
        smartBudgetMap.remove();
    }

    const coords = [48.8566, 2.3522];
    smartBudgetMap = L.map('smartBudgetMap').setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(smartBudgetMap);

    L.marker(coords).addTo(smartBudgetMap)
        .bindPopup('Paris, France')
        .openPopup();
}

function initPlannerMap() {
    if (plannerMapInstance) {
        plannerMapInstance.remove();
    }

    const coords = [48.8566, 2.3522];
    plannerMapInstance = L.map('plannerMap').setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(plannerMapInstance);

    L.marker(coords).addTo(plannerMapInstance)
        .bindPopup('Paris, France')
        .openPopup();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        window.location.href = 'index.html';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize Appwrite
    initializeAppwrite();
    
    // Set default values
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    if (startDateInput) {
        startDateInput.value = today;
    }
    
    // Initialize smart budget functionality
    const smartTripTypeBtns = document.querySelectorAll('.smart-trip-type-btn');
    smartTripTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            smartTripTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSmartTripType = btn.dataset.type;

            const groupSizeInput = document.getElementById('smartGroupSize');
            if (groupSizeInput) {
                switch (currentSmartTripType) {
                    case 'solo':
                        groupSizeInput.value = 1;
                        break;
                    case 'couple':
                        groupSizeInput.value = 2;
                        break;
                    case 'friends':
                        groupSizeInput.value = 4;
                        break;
                }
            }
        });
    });

    const calculateBtn = document.getElementById('calculateSmartBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSmartBudget);
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const shareModal = document.getElementById('shareModal');
        if (shareModal && e.target === shareModal) {
            closeShareModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeShareModal();
        }
    });

    console.log('Enhanced Dashboard initialized');
});

function calculateSmartBudget() {
    const destination = document.getElementById('smartTripDestination').value.toLowerCase().trim();
    const days = parseInt(document.getElementById('smartTripDays').value) || 0;
    const groupSize = parseInt(document.getElementById('smartGroupSize').value) || 1;
    const totalBudget = parseInt(document.getElementById('smartTotalBudget').value) || 0;

    if (!destination || !days || !totalBudget) {
        alert('Please fill in all trip details!');
        return;
    }

    const budgetPercentages = destinationBudgetData[destination] || destinationBudgetData['default'];

    const accommodationAmount = Math.round((totalBudget * budgetPercentages.accommodation) / 100);
    const foodAmount = Math.round((totalBudget * budgetPercentages.food) / 100);
    const transportAmount = Math.round((totalBudget * budgetPercentages.transport) / 100);
    const activitiesAmount = Math.round((totalBudget * budgetPercentages.activities) / 100);
    const emergencyAmount = Math.round((totalBudget * budgetPercentages.emergency) / 100);

    document.getElementById('smartAccommodation').textContent = `$${accommodationAmount}`;
    document.getElementById('smartFood').textContent = `$${foodAmount}`;
    document.getElementById('smartTransport').textContent = `$${transportAmount}`;
    document.getElementById('smartActivities').textContent = `$${activitiesAmount}`;
    document.getElementById('smartEmergency').textContent = `$${emergencyAmount}`;

    const perPerson = Math.round(totalBudget / groupSize);
    const perDay = Math.round(totalBudget / days);

    document.getElementById('smartTotalDisplay').textContent = `$${totalBudget}`;
    document.getElementById('smartPerPerson').textContent = `$${perPerson}`;
    document.getElementById('smartPerDay').textContent = `$${perDay}`;
}

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
});
