// Trip Planner JavaScript

let selectedTripType = null;
let selectedDestination = null;
let tripMap = null;

// Mock destinations data
const destinations = [
    {
        id: 1,
        name: 'Bali, Indonesia',
        country: 'Indonesia',
        type: 'beach',
        rating: 4.8,
        price: 800,
        description: 'Tropical paradise with stunning beaches',
        coordinates: [-8.3405, 115.0920],
        icon: 'fas fa-umbrella-beach'
    },
    {
        id: 2,
        name: 'Paris, France',
        country: 'France',
        type: 'city',
        rating: 4.9,
        price: 1200,
        description: 'City of love and art',
        coordinates: [48.8566, 2.3522],
        icon: 'fas fa-monument'
    },
    {
        id: 3,
        name: 'Tokyo, Japan',
        country: 'Japan',
        type: 'city',
        rating: 4.7,
        price: 1500,
        description: 'Modern metropolis with rich culture',
        coordinates: [35.6762, 139.6503],
        icon: 'fas fa-torii-gate'
    },
    {
        id: 4,
        name: 'Santorini, Greece',
        country: 'Greece',
        type: 'island',
        rating: 4.8,
        price: 1000,
        description: 'Beautiful Greek island',
        coordinates: [36.3932, 25.4615],
        icon: 'fas fa-church'
    },
    {
        id: 5,
        name: 'New York, USA',
        country: 'USA',
        type: 'city',
        rating: 4.6,
        price: 1300,
        description: 'The city that never sleeps',
        coordinates: [40.7128, -74.0060],
        icon: 'fas fa-building'
    },
    {
        id: 6,
        name: 'Dubai, UAE',
        country: 'UAE',
        type: 'luxury',
        rating: 4.7,
        price: 1600,
        description: 'Luxury desert oasis',
        coordinates: [25.2048, 55.2708],
        icon: 'fas fa-mosque'
    }
];

// Initialize trip planner
function initializeTripPlanner() {
    loadDestinations();
    initializeMap();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Trip details form
    const tripForm = document.getElementById('tripDetailsForm');
    if (tripForm) {
        tripForm.addEventListener('submit', handleTripCreation);
    }
}

// Select trip type
function selectTripType(type) {
    selectedTripType = type;
    
    // Update UI
    document.querySelectorAll('.trip-type').forEach(el => el.classList.remove('selected'));
    event.target.closest('.trip-type').classList.add('selected');
    
    // Filter destinations based on trip type
    filterDestinationsByType(type);
    
    showNotification(`Selected ${type} trip type`, 'success');
}

// Filter destinations by trip type
function filterDestinationsByType(type) {
    let filteredDestinations = destinations;
    
    switch(type) {
        case 'solo':
            // Show all destinations for solo travelers
            break;
        case 'couple':
            // Prefer romantic destinations
            filteredDestinations = destinations.filter(d => 
                d.type === 'beach' || d.type === 'island' || d.name.includes('Paris')
            );
            break;
        case 'friends':
            // Prefer city and adventure destinations
            filteredDestinations = destinations.filter(d => 
                d.type === 'city' || d.type === 'luxury'
            );
            break;
    }
    
    renderDestinations(filteredDestinations);
}

// Load and render destinations
function loadDestinations() {
    renderDestinations(destinations);
}

// Render destinations grid
function renderDestinations(destinationList) {
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    grid.innerHTML = destinationList.map(dest => `
        <div class="destination-card" onclick="selectDestination(${dest.id})">
            <div class="destination-image">
                <i class="${dest.icon}"></i>
            </div>
            <div class="destination-info">
                <h4>${dest.name}</h4>
                <p>${dest.description}</p>
                <div class="destination-meta">
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${dest.rating}
                    </span>
                    <span class="price">From $${dest.price}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add destination card styles
    addDestinationStyles();
}

// Select destination
function selectDestination(destinationId) {
    selectedDestination = destinations.find(d => d.id === destinationId);
    
    if (selectedDestination) {
        // Update UI
        document.querySelectorAll('.destination-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.destination-card').classList.add('selected');
        
        // Update map
        if (tripMap) {
            updateMapLocation(selectedDestination.coordinates, selectedDestination.name);
        }
        
        // Update form with destination
        const destinationInput = document.getElementById('destinationInput');
        if (destinationInput) {
            destinationInput.value = selectedDestination.name;
        }
        
        showNotification(`Selected ${selectedDestination.name}`, 'success');
    }
}

// Search destinations
function searchDestinations() {
    const query = document.getElementById('destinationInput').value.toLowerCase();
    
    if (!query) {
        loadDestinations();
        return;
    }
    
    const filtered = destinations.filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query)
    );
    
    renderDestinations(filtered);
    
    if (filtered.length === 0) {
        document.getElementById('destinationsGrid').innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No destinations found for "${query}"</p>
            </div>
        `;
    }
}

// Initialize map
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;
    
    // Initialize Leaflet map
    tripMap = L.map('map').setView([20.0, 0.0], 2);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(tripMap);
    
    // Add markers for all destinations
    destinations.forEach(dest => {
        const marker = L.marker(dest.coordinates).addTo(tripMap);
        marker.bindPopup(`
            <div class="map-popup">
                <h5>${dest.name}</h5>
                <p>${dest.description}</p>
                <button onclick="selectDestination(${dest.id})" class="select-btn">Select</button>
            </div>
        `);
    });
}

// Update map location
function updateMapLocation(coordinates, name) {
    if (!tripMap) return;
    
    tripMap.setView(coordinates, 10);
    
    // Add highlighted marker
    if (window.selectedMarker) {
        tripMap.removeLayer(window.selectedMarker);
    }
    
    window.selectedMarker = L.marker(coordinates)
        .addTo(tripMap)
        .bindPopup(`<strong>${name}</strong>`)
        .openPopup();
}

// Handle trip creation
function handleTripCreation(e) {
    e.preventDefault();
    
    const formData = {
        title: document.getElementById('tripTitle').value,
        duration: document.getElementById('tripDuration').value,
        startDate: document.getElementById('startDate').value,
        budget: document.getElementById('tripBudget').value,
        destination: selectedDestination,
        tripType: selectedTripType
    };
    
    if (!formData.title || !formData.startDate || !formData.budget) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (!selectedDestination) {
        showNotification('Please select a destination', 'error');
        return;
    }
    
    if (!selectedTripType) {
        showNotification('Please select a trip type', 'error');
        return;
    }
    
    // Create trip
    createTrip(formData);
}

// Create trip
function createTrip(tripData) {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Store trip in localStorage (in real app, would save to database)
        const trips = JSON.parse(localStorage.getItem('userTrips') || '[]');
        const newTrip = {
            id: Date.now(),
            ...tripData,
            createdAt: new Date().toISOString(),
            status: 'planning'
        };
        
        trips.push(newTrip);
        localStorage.setItem('userTrips', JSON.stringify(trips));
        
        hideLoading();
        showNotification('Trip created successfully!', 'success');
        
        // Reset form
        document.getElementById('tripDetailsForm').reset();
        selectedDestination = null;
        selectedTripType = null;
        
        // Reset UI
        document.querySelectorAll('.trip-type').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.destination-card').forEach(el => el.classList.remove('selected'));
        
        // Redirect to dashboard
        setTimeout(() => {
            showSection('dashboard');
        }, 1500);
        
    }, 2000);
}

// Add destination card styles
function addDestinationStyles() {
    const styles = `
        .destination-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        
        .rating {
            color: #ffd700;
        }
        
        .rating i {
            margin-right: 0.25rem;
        }
        
        .price {
            color: #64b5f6;
            font-weight: 600;
        }
        
        .destination-card.selected {
            border-color: #64b5f6;
            background: rgba(100, 181, 246, 0.1);
        }
        
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.3);
        }
        
        .map-popup {
            text-align: center;
        }
        
        .map-popup h5 {
            margin-bottom: 0.5rem;
        }
        
        .select-btn {
            padding: 0.5rem 1rem;
            background: #64b5f6;
            color: white;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            margin-top: 0.5rem;
        }
    `;
    
    if (!document.getElementById('destination-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'destination-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Export trip planner functions
window.TripPlanner = {
    initializeTripPlanner,
    selectTripType,
    selectDestination,
    searchDestinations,
    createTrip
};