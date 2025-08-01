// Enhanced Dashboard JavaScript with Appwrite Integration, Theme Toggle, and Smart Budget Splitter

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

// Smart Budget Splitter Data
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

const tripAdviceData = {
    'paris': [
        '🥐 Book accommodations in advance, especially during summer',
        '🚇 Get a weekly metro pass for easy transportation',
        '🍷 Try local bistros instead of tourist restaurants',
        '🎨 Many museums are free on first Sunday mornings'
    ],
    'tokyo': [
        '🏨 Consider capsule hotels for budget accommodation',
        '🍜 Eat at convenience stores and local ramen shops',
        '🚄 Get a JR Pass if traveling between cities',
        '🌸 Visit during cherry blossom season for best experience'
    ],
    'bali': [
        '🏖 Stay in Ubud for culture, Canggu for beaches',
        '🛵 Rent a scooter for easy island exploration',
        '🍽 Local warungs offer authentic and cheap meals',
        '💆‍♀ Budget extra for spa treatments and activities'
    ],
    'london': [
        '🏰 Many museums and galleries offer free admission',
        '🚇 Get an Oyster card for public transport savings',
        '🍺 Try traditional pubs for authentic British experience',
        '☂️ Always carry an umbrella for unpredictable weather'
    ],
    'new york': [
        '🗽 Buy MetroCard for subway and bus transportation',
        '🍕 Try authentic NY pizza and deli sandwiches',
        '🎭 Book Broadway shows in advance for better prices',
        '🌳 Central Park and many attractions are free'
    ],
    'thailand': [
        '🏛 Dress modestly when visiting temples',
        '🛶 Try floating markets for authentic experience',
        '🌶 Start with mild spice levels in local food',
        '💆‍♀ Thai massages are affordable and authentic'
    ],
    'india': [
        '🕌 Remove shoes and dress modestly at religious sites',
        '🍛 Try a local thali — a complete regional meal on one plate',
        '💧 Stick to bottled or filtered water to avoid stomach issues',
        '🛕 Some temples have separate queues for locals and foreigners — follow signs',
        '🚗 Prefer prepaid taxis or trusted apps like Ola or Uber for safer rides',
        '💱 Always carry some cash — small vendors may not accept UPI/cards',
        '🎭 Every 100km brings a new language, food, and culture — embrace it!',
        '🧣 Cover your head in Sikh gurudwaras (e.g., Golden Temple in Amritsar)',
        '🪔 Visit during festivals like Diwali or Holi for unforgettable experiences',
        '📵 In remote or mountain areas, mobile signals drop — download offline maps ahead'
    ],
    'default': [
        '💡 Research local transportation options',
        '🏨 Book accommodations with good reviews',
        '🍽 Try local cuisine for authentic experiences',
        '📱 Download offline maps and translation apps'
    ]
};

const destinationAttractions = {
    'paris': [
        { name: 'Eiffel Tower', icon: '🗼', cost: '$25' },
        { name: 'Louvre Museum', icon: '🎨', cost: '$17' },
        { name: 'Seine River Cruise', icon: '🚢', cost: '$15' },
        { name: 'Arc de Triomphe', icon: '🏛', cost: '$13' },
        { name: 'Notre-Dame Cathedral', icon: '⛪', cost: 'Free' },
        { name: 'Montmartre District', icon: '🎭', cost: 'Free' }
    ],
    'tokyo': [
        { name: 'Tokyo Skytree', icon: '🏗', cost: '$18' },
        { name: 'Senso-ji Temple', icon: '⛩', cost: 'Free' },
        { name: 'Shibuya Crossing', icon: '🚶‍♂️', cost: 'Free' },
        { name: 'Tsukiji Fish Market', icon: '🐟', cost: '$10' },
        { name: 'Imperial Palace', icon: '🏯', cost: 'Free' },
        { name: 'Harajuku District', icon: '🌈', cost: 'Free' }
    ],
    'bali': [
        { name: 'Tanah Lot Temple', icon: '🏛', cost: '$3' },
        { name: 'Rice Terraces', icon: '🌾', cost: '$2' },
        { name: 'Beach Clubs', icon: '🏖', cost: '$20' },
        { name: 'Monkey Forest', icon: '🐵', cost: '$3' },
        { name: 'Volcano Trek', icon: '🌋', cost: '$45' },
        { name: 'Traditional Spa', icon: '💆‍♀️', cost: '$15' }
    ],
    'london': [
        { name: 'Big Ben', icon: '🕰', cost: 'Free' },
        { name: 'British Museum', icon: '🏛', cost: 'Free' },
        { name: 'Thames Cruise', icon: '🚢', cost: '$12' },
        { name: 'Tower of London', icon: '🏰', cost: '$30' },
        { name: 'London Eye', icon: '🎡', cost: '$27' },
        { name: 'Camden Market', icon: '🛍', cost: 'Free' }
    ],
    'new york': [
        { name: 'Statue of Liberty', icon: '🗽', cost: '$23' },
        { name: 'Central Park', icon: '🌳', cost: 'Free' },
        { name: 'Broadway Show', icon: '🎭', cost: '$75' },
        { name: 'Empire State Building', icon: '🏢', cost: '$37' },
        { name: 'Brooklyn Bridge', icon: '🌉', cost: 'Free' },
        { name: 'Times Square', icon: '🌟', cost: 'Free' }
    ],
    'thailand': [
        { name: 'Grand Palace', icon: '🏰', cost: '$15' },
        { name: 'Floating Market', icon: '🛶', cost: '$10' },
        { name: 'Thai Massage', icon: '💆‍♀️', cost: '$8' },
        { name: 'Elephant Sanctuary', icon: '🐘', cost: '$50' },
        { name: 'Temple Tour', icon: '⛩', cost: '$20' },
        { name: 'Night Market', icon: '🌙', cost: '$5' }
    ],
    'india': [
        { name: 'Taj Mahal', icon: '🏰', cost: '₹50 (Indians)' },
        { name: 'Qutub Minar', icon: '🕌', cost: '₹30 (Indians)' },
        { name: 'Red Fort', icon: '🧱', cost: '₹35 (Indians)' },
        { name: 'Gateway of India', icon: '🚪', cost: 'Free' },
        { name: 'Mysore Palace', icon: '🏯', cost: '₹70 (Indians)' },
        { name: 'Amber Fort, Jaipur', icon: '🏜', cost: '₹100 (Indians)' },
        { name: 'Charminar, Hyderabad', icon: '🕋', cost: '₹25 (Indians)' },
        { name: 'Golden Temple, Amritsar', icon: '🌟', cost: 'Free' },
        { name: 'Meenakshi Temple, Madurai', icon: '🌺', cost: 'Free' },
        { name: 'Sundarbans National Park', icon: '🌳', cost: '₹60 (Indians)' },
        { name: 'Kaziranga National Park', icon: '🦏', cost: '₹100 (Indians)' },
        { name: 'Ranthambore National Park', icon: '🐅', cost: '₹150 (Indians)' },
        { name: 'Rann of Kutch', icon: '🌾', cost: '₹100 (Indians)' },
        { name: 'Coorg', icon: '☕', cost: 'Varies' },
        { name: 'Ooty', icon: '🏞️', cost: 'Free' },
        { name: 'Kanyakumari', icon: '🌊', cost: 'Free' },
        { name: 'Munnar', icon: '🌿', cost: 'Free' },
        { name: 'Alleppey', icon: '🚤', cost: '₹400+ (Boating)' },
        { name: 'Leh', icon: '🏔️', cost: 'Free' },
        { name: 'Manali', icon: '❄️', cost: 'Free' },
        { name: 'Varanasi', icon: '🕉️', cost: 'Free' },
        { name: 'Shimla', icon: '🏔️', cost: 'Free' },
        { name: 'Jaipur City', icon: '🏰', cost: 'Varies' },
        { name: 'Agra Fort', icon: '🛡️', cost: '₹40 (Indians)' },
        { name: 'Pondicherry', icon: '🏖️', cost: 'Free' }
    ]
};

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

// Smart Budget Splitter Functions
function calculateSmartBudget() {
    const destination = document.getElementById('smartTripDestination').value.toLowerCase().trim();
    const days = parseInt(document.getElementById('smartTripDays').value) || 0;
    const groupSize = parseInt(document.getElementById('smartGroupSize').value) || 1;
    const totalBudget = parseInt(document.getElementById('smartTotalBudget').value) || 0;

    if (!destination || !days || !totalBudget) {
        alert('Please fill in all trip details!');
        return;
    }

    // Get budget percentages for destination
    const budgetPercentages = destinationBudgetData[destination] || destinationBudgetData['default'];

    // Calculate amounts
    const accommodationAmount = Math.round((totalBudget * budgetPercentages.accommodation) / 100);
    const foodAmount = Math.round((totalBudget * budgetPercentages.food) / 100);
    const transportAmount = Math.round((totalBudget * budgetPercentages.transport) / 100);
    const activitiesAmount = Math.round((totalBudget * budgetPercentages.activities) / 100);
    const emergencyAmount = Math.round((totalBudget * budgetPercentages.emergency) / 100);

    // Update UI
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

    // Update trip advice
    updateSmartTripAdvice(destination, days, groupSize, totalBudget);

    // Update map
    updateSmartBudgetMap(destination);
}

function updateSmartTripAdvice(destination, days, groupSize, budget) {
    const adviceContainer = document.getElementById('smartTripAdvice');
    const advice = tripAdviceData[destination] || tripAdviceData['default'];

    let adviceHTML = '';

    // Budget advice
    const perPersonPerDay = Math.round(budget / (groupSize * days));
    if (perPersonPerDay < 50) {
        adviceHTML += `<div class="advice-item warning">
            <span class="advice-icon">⚠️</span>
            <span>Budget is tight - consider hostels and street food</span>
        </div>`;
    } else if (perPersonPerDay > 200) {
        adviceHTML += `<div class="advice-item success">
            <span class="advice-icon">✨</span>
            <span>Great budget! You can enjoy premium experiences</span>
        </div>`;
    }

    // Duration advice
    if (days < 3) {
        adviceHTML += `<div class="advice-item info">
            <span class="advice-icon">⏰</span>
            <span>Short trip - focus on must-see attractions</span>
        </div>`;
    }

    // Destination-specific advice
    advice.forEach(tip => {
        adviceHTML += `<div class="advice-item">
            <span class="advice-icon">💡</span>
            <span>${tip}</span>
        </div>`;
    });

    adviceContainer.innerHTML = adviceHTML;
}

function getDestinationCoords(destination) {
    const coords = {
        'paris': [48.8566, 2.3522],
        'tokyo': [35.6762, 139.6503],
        'bali': [-8.3405, 115.0920],
        'london': [51.5074, -0.1278],
        'new york': [40.7128, -74.0060],
        'thailand': [13.7563, 100.5018],
        'rome': [41.9028, 12.4964],
        'barcelona': [41.3851, 2.1734],
        'amsterdam': [52.3676, 4.9041],
        'dubai': [25.2048, 55.2708],
        'delhi': [28.6139, 77.2090],
        'mumbai': [19.0760, 72.8777],
        'bangalore': [12.9716, 77.5946],
        'chennai': [13.0827, 80.2707],
        'hyderabad': [17.3850, 78.4867],
        'kolkata': [22.5726, 88.3639],
        'jaipur': [26.9124, 75.7873],
        'goa': [15.2993, 74.1240],
        'leh': [34.1526, 77.5770],
        'manali': [32.2396, 77.1887],
        'shimla': [31.1048, 77.1734],
        'varanasi': [25.3176, 82.9739],
        'agra': [27.1767, 78.0081],
        'ooty': [11.4064, 76.6932],
        'sundarbans national park': [21.9497, 88.8915],
        'kaziranga national park': [26.5775, 93.1711],
        'kanyakumari': [8.0883, 77.5385],
        'coorg': [12.3375, 75.8069],
        'munnar': [10.0889, 77.0595],
        'alleppey': [9.4981, 76.3388]
    };
    return coords[destination] || [48.8566, 2.3522];
}

function initSmartBudgetMap() {
    if (smartBudgetMap) {
        smartBudgetMap.remove();
    }

    const coords = [48.8566, 2.3522]; // Default to Paris
    smartBudgetMap = L.map('smartBudgetMap').setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(smartBudgetMap);

    L.marker(coords).addTo(smartBudgetMap)
        .bindPopup('Paris, France')
        .openPopup();
}

function updateSmartBudgetMap(destination) {
    if (!smartBudgetMap) {
        initSmartBudgetMap();
        return;
    }

    // Get coordinates for destination
    const coords = getDestinationCoords(destination);

    // Clear existing markers
    smartBudgetMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            smartBudgetMap.removeLayer(layer);
        }
    });

    // Update map view and marker
    smartBudgetMap.setView(coords, 10);
    L.marker(coords).addTo(smartBudgetMap)
        .bindPopup(destination.charAt(0).toUpperCase() + destination.slice(1))
        .openPopup();

    // Update attractions
    updateSmartAttractions(destination);
}

function updateSmartAttractions(destination) {
    const attractionsGrid = document.getElementById('smartAttractionsGrid');
    const attractions = destinationAttractions[destination] || [
        { name: 'Local Attractions', icon: '📍', cost: 'Varies' },
        { name: 'Museums', icon: '🏛', cost: '$10-20' },
        { name: 'Local Tours', icon: '🚌', cost: '$30-50' }
    ];

    attractionsGrid.innerHTML = attractions.map(attraction => `
        <div class="attraction-card">
            <div class="attraction-icon">${attraction.icon}</div>
            <div class="attraction-info">
                <h4>${attraction.name}</h4>
                <p class="attraction-cost">${attraction.cost}</p>
            </div>
        </div>
    `).join('');
}

function initPlannerMap() {
    if (plannerMapInstance) {
        plannerMapInstance.remove();
    }

    const coords = [48.8566, 2.3522]; // Default to Paris
    plannerMapInstance = L.map('plannerMap').setView(coords, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(plannerMapInstance);

    L.marker(coords).addTo(plannerMapInstance)
        .bindPopup('Paris, France')
        .openPopup();
}

function updatePlannerMap(destination) {
    if (!plannerMapInstance) {
        initPlannerMap();
        return;
    }

    const coords = getDestinationCoords(destination.toLowerCase());

    // Clear existing markers
    plannerMapInstance.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            plannerMapInstance.removeLayer(layer);
        }
    });

    // Update map view and marker
    plannerMapInstance.setView(coords, 10);
    L.marker(coords).addTo(plannerMapInstance)
        .bindPopup(destination)
        .openPopup();
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

// Trip planning functions
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

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('Logging out...');
        window.location.href = 'main.html';
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

    console.log('Enhanced Dashboard with Smart Budget Splitter initialized');
});

// Responsive handling
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
});