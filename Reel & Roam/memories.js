// Memory Gallery JavaScript

let memories = [];
let currentFilter = 'all';

// Initialize memories gallery
function initializeMemories() {
    loadMemories();
    setupMemoryEventListeners();
    renderMemories();
}

// Setup event listeners
function setupMemoryEventListeners() {
    const photoUpload = document.getElementById('photoUpload');
    if (photoUpload) {
        photoUpload.addEventListener('change', handlePhotoUpload);
    }
    
    // Drag and drop functionality
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleDrop);
        uploadArea.addEventListener('dragleave', handleDragLeave);
    }
}

// Load memories from localStorage
function loadMemories() {
    const savedMemories = localStorage.getItem('tripMemories');
    if (savedMemories) {
        memories = JSON.parse(savedMemories);
    } else {
        // Add some sample memories
        memories = [
            {
                id: 1,
                title: 'Sunset in Bali',
                description: 'Beautiful sunset at Tanah Lot temple',
                image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
                location: 'Bali, Indonesia',
                date: '2024-07-15',
                category: 'landscape',
                isFavorite: true,
                tags: ['sunset', 'temple', 'bali']
            },
            {
                id: 2,
                title: 'Tokyo Street Food',
                description: 'Delicious ramen in Shibuya',
                image: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400',
                location: 'Tokyo, Japan',
                date: '2024-05-10',
                category: 'food',
                isFavorite: false,
                tags: ['food', 'ramen', 'tokyo']
            },
            {
                id: 3,
                title: 'Eiffel Tower',
                description: 'Classic view from Trocadéro',
                image: 'https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=400',
                location: 'Paris, France',
                date: '2024-09-20',
                category: 'landmarks',
                isFavorite: true,
                tags: ['eiffel', 'paris', 'landmark']
            },
            {
                id: 4,
                title: 'Group Photo',
                description: 'Amazing trip with friends',
                image: 'https://images.pexels.com/photos/1157557/pexels-photo-1157557.jpeg?auto=compress&cs=tinysrgb&w=400',
                location: 'Santorini, Greece',
                date: '2024-06-05',
                category: 'people',
                isFavorite: false,
                tags: ['friends', 'group', 'santorini']
            }
        ];
        saveMemories();
    }
}

// Handle photo upload
function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        }
    });
}

// Process image file
function processImageFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Create memory object
        const memory = {
            id: Date.now() + Math.random(),
            title: file.name.split('.')[0],
            description: 'New memory',
            image: imageData,
            location: 'Unknown',
            date: new Date().toISOString(),
            category: 'uploaded',
            isFavorite: false,
            tags: []
        };
        
        memories.unshift(memory); // Add to beginning
        saveMemories();
        renderMemories();
        
        showNotification('Photo uploaded successfully!', 'success');
        
        // Show edit modal for the new photo
        setTimeout(() => openEditModal(memory.id), 500);
    };
    
    reader.readAsDataURL(file);
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

// Handle drag leave
function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        }
    });
}

// Filter memories
function filterMemories(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderMemories();
}

// Render memories gallery
function renderMemories() {
    const gallery = document.getElementById('memoriesGallery');
    if (!gallery) return;
    
    let filteredMemories = memories;
    
    // Apply filters
    switch (currentFilter) {
        case 'recent':
            filteredMemories = memories.filter(memory => {
                const memoryDate = new Date(memory.date);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return memoryDate > thirtyDaysAgo;
            });
            break;
        case 'favorites':
            filteredMemories = memories.filter(memory => memory.isFavorite);
            break;
    }
    
    if (filteredMemories.length === 0) {
        gallery.innerHTML = `
            <div class="no-memories">
                <i class="fas fa-camera"></i>
                <p>No memories found</p>
                <small>Upload some photos to get started</small>
            </div>
        `;
        return;
    }
    
    gallery.innerHTML = filteredMemories.map(memory => `
        <div class="memory-card" onclick="openMemoryModal(${memory.id})">
            <div class="memory-image">
                <img src="${memory.image}" alt="${memory.title}" loading="lazy">
                <div class="memory-overlay">
                    <div class="memory-actions">
                        <button onclick="event.stopPropagation(); toggleFavorite(${memory.id})" class="favorite-btn ${memory.isFavorite ? 'active' : ''}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button onclick="event.stopPropagation(); openEditModal(${memory.id})" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="event.stopPropagation(); deleteMemory(${memory.id})" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="memory-info">
                <h4>${memory.title}</h4>
                <p>${memory.description}</p>
                <div class="memory-meta">
                    <span class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${memory.location}
                    </span>
                    <span class="date">${formatDate(memory.date)}</span>
                </div>
                <div class="memory-tags">
                    ${memory.tags?.map(tag => `<span class="tag">#${tag}</span>`).join('') || ''}
                </div>
            </div>
        </div>
    `).join('');
    
    addMemoryStyles();
    
    // Animate memory cards
    if (window.Animations && window.Animations.animateList) {
        window.Animations.animateList('.memory-card', 50);
    }
}

// Toggle favorite
function toggleFavorite(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (memory) {
        memory.isFavorite = !memory.isFavorite;
        saveMemories();
        renderMemories();
        
        const status = memory.isFavorite ? 'added to' : 'removed from';
        showNotification(`Memory ${status} favorites`, 'info');
    }
}

// Delete memory
function deleteMemory(memoryId) {
    if (confirm('Are you sure you want to delete this memory?')) {
        memories = memories.filter(m => m.id !== memoryId);
        saveMemories();
        renderMemories();
        showNotification('Memory deleted', 'info');
    }
}

// Open memory modal (fullscreen view)
function openMemoryModal(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    const modal = createMemoryModal(memory);
    document.body.appendChild(modal);
    
    // Animate modal open
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Create memory modal
function createMemoryModal(memory) {
    const modal = document.createElement('div');
    modal.className = 'memory-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeMemoryModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeMemoryModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image">
                <img src="${memory.image}" alt="${memory.title}">
            </div>
            <div class="modal-info">
                <h2>${memory.title}</h2>
                <p>${memory.description}</p>
                <div class="modal-meta">
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${memory.location}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(memory.date)}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${memory.tags?.join(', ') || 'No tags'}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button onclick="toggleFavorite(${memory.id}); updateModalFavorite(${memory.id})" class="modal-btn favorite ${memory.isFavorite ? 'active' : ''}">
                        <i class="fas fa-heart"></i>
                        ${memory.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    <button onclick="openEditModal(${memory.id}); closeMemoryModal()" class="modal-btn edit">
                        <i class="fas fa-edit"></i>
                        Edit Memory
                    </button>
                    <button onclick="shareMemory(${memory.id})" class="modal-btn share">
                        <i class="fas fa-share"></i>
                        Share
                    </button>
                </div>
            </div>
        </div>
    `;
    
    addModalStyles();
    return modal;
}

// Close memory modal
function closeMemoryModal() {
    const modal = document.querySelector('.memory-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Open edit modal
function openEditModal(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    const modal = createEditModal(memory);
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// Create edit modal
function createEditModal(memory) {
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeEditModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Memory</h3>
                <button class="modal-close" onclick="closeEditModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="editMemoryForm" onsubmit="saveMemoryEdit(event, ${memory.id})">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="editTitle" value="${memory.title}" required>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="editDescription" rows="3">${memory.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" id="editLocation" value="${memory.location}">
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="editDate" value="${memory.date.split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text" id="editTags" value="${memory.tags?.join(', ') || ''}" placeholder="beach, sunset, vacation">
                </div>
                <div class="form-actions">
                    <button type="button" onclick="closeEditModal()" class="btn-secondary">Cancel</button>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </div>
    `;
    
    return modal;
}

// Save memory edit
function saveMemoryEdit(e, memoryId) {
    e.preventDefault();
    
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    // Update memory with form data
    memory.title = document.getElementById('editTitle').value;
    memory.description = document.getElementById('editDescription').value;
    memory.location = document.getElementById('editLocation').value;
    memory.date = document.getElementById('editDate').value;
    memory.tags = document.getElementById('editTags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    
    saveMemories();
    renderMemories();
    closeEditModal();
    
    showNotification('Memory updated successfully!', 'success');
}

// Close edit modal
function closeEditModal() {
    const modal = document.querySelector('.edit-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Share memory
function shareMemory(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    if (navigator.share) {
        navigator.share({
            title: memory.title,
            text: memory.description,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = `${memory.title} - ${memory.description}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Memory details copied to clipboard!', 'success');
        });
    }
}

// Save memories to localStorage
function saveMemories() {
    localStorage.setItem('tripMemories', JSON.stringify(memories));
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

// Add memory styles
function addMemoryStyles() {
    const styles = `
        .no-memories {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem 2rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .no-memories i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.3);
        }
        
        .memory-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .memory-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.15);
        }
        
        .memory-image {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
        }
        
        .memory-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .memory-card:hover .memory-image img {
            transform: scale(1.05);
        }
        
        .memory-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .memory-card:hover .memory-overlay {
            opacity: 1;
        }
        
        .memory-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .memory-actions button {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .favorite-btn {
            background: rgba(255, 255, 255, 0.2);
            color: #ffffff;
        }
        
        .favorite-btn.active {
            background: #f44336;
            color: #ffffff;
        }
        
        .edit-btn {
            background: rgba(100, 181, 246, 0.8);
            color: #ffffff;
        }
        
        .delete-btn {
            background: rgba(244, 67, 54, 0.8);
            color: #ffffff;
        }
        
        .memory-info {
            padding: 1rem;
        }
        
        .memory-info h4 {
            color: #ffffff;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .memory-info p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
        }
        
        .memory-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .location i {
            margin-right: 0.25rem;
        }
        
        .memory-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }
        
        .tag {
            background: rgba(100, 181, 246, 0.2);
            color: #64b5f6;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
            font-size: 0.7rem;
        }
        
        .upload-area.drag-over {
            border-color: #64b5f6;
            background: rgba(100, 181, 246, 0.1);
        }
    `;
    
    if (!document.getElementById('memory-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'memory-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Add modal styles
function addModalStyles() {
    const styles = `
        .memory-modal, .edit-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .memory-modal.active, .edit-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 1rem;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .memory-modal .modal-content {
            display: flex;
            min-width: 800px;
            min-height: 500px;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            color: #ffffff;
            cursor: pointer;
            z-index: 10;
        }
        
        .modal-image {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
        }
        
        .modal-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .modal-info {
            flex: 0 0 300px;
            padding: 2rem;
            color: #ffffff;
        }
        
        .modal-info h2 {
            margin-bottom: 1rem;
        }
        
        .modal-info p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 1.5rem;
        }
        
        .modal-meta {
            margin-bottom: 2rem;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .meta-item i {
            width: 16px;
            color: #64b5f6;
        }
        
        .modal-actions {
            display: grid;
            gap: 0.75rem;
        }
        
        .modal-btn {
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
        }
        
        .modal-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .modal-btn.favorite.active {
            background: #f44336;
        }
        
        .edit-modal .modal-content {
            width: 500px;
            padding: 2rem;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .modal-header h3 {
            color: #ffffff;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            color: #ffffff;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            font-size: 1rem;
        }
        
        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .btn-secondary {
            padding: 0.75rem 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 0.5rem;
            background: transparent;
            color: #ffffff;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .memory-modal .modal-content {
                flex-direction: column;
                min-width: auto;
                width: 95vw;
                min-height: auto;
            }
            
            .modal-info {
                flex: none;
            }
        }
    `;
    
    if (!document.getElementById('modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Export memories functions
window.Memories = {
    initializeMemories,
    filterMemories,
    toggleFavorite,
    deleteMemory,
    openMemoryModal,
    openEditModal,
    shareMemory
};