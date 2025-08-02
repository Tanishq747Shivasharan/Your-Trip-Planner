// Appwrite Configuration
const Appwrite = window.Appwrite // Declare Appwrite variable
const { Client, Account, Databases, Storage, ID, Query } = Appwrite

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("6881d7ac0019d890bd10") // Replace with your project ID

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Database and Collection IDs (replace with your actual IDs)
const DATABASE_ID = "6888e894001072f582d1"
const USERS_COLLECTION_ID = "6888e92f000ffb893261"
const TRIPS_COLLECTION_ID = "6888e93700269068a76f"
const PHOTOS_COLLECTION_ID = "6888e95e0001d2a7d135"
const REVIEWS_COLLECTION_ID = "688b34cd00286314fe70" // New: Reviews Collection ID

// Global variables
let currentUser = null
let currentDestination = null
let currentMap = null
let budgetToolMap = null
let currentTripType = "solo"
let isLoginMode = true

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  try {
    // Initialize particles background
    initializeParticles()

    // Initialize animations
    initializeAnimations()

    // Initialize event listeners
    initializeEventListeners()

    // Set current year in footer
    document.getElementById("currentYear").textContent = new Date().getFullYear()

    // Check if user is logged in
    await checkAuthStatus()

    // Initialize UI based on auth status
    initializeUserInterface()

    // Load user data if logged in
    if (currentUser) {
      await loadUserData()
    }

    // Handle hash navigation (for direct links to sections)
    handleHashNavigation()

    console.log("App initialized successfully")
  } catch (error) {
    console.error("Error initializing app:", error)
    showNotification("Error initializing app. Please refresh the page.", "error")
  }
}

// Particles.js initialization
function initializeParticles() {
  const particlesJS = window.particlesJS // Declare particlesJS variable
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: { value: 50 },
        color: { value: "#C3F3EE" },
        shape: { type: "circle" },
        opacity: { value: 0.3 },
        size: { value: 3, random: true },
        move: {
          enable: true,
          speed: 1,
          direction: "none",
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
        },
      },
    })
  }
}

// GSAP Animations
function initializeAnimations() {
  const gsap = window.gsap // Declare gsap variable
  if (typeof gsap !== "undefined") {
    // Animate elements on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          })
        }
      })
    }, observerOptions)

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el)
    })
  }
}

// Event Listeners
function initializeEventListeners() {
  // Navigation
  setupNavigation()

  // Account circle (mobile)
  setupAccountCircle()

  // Destination cards
  setupDestinationCards()

  // Budget tool
  setupBudgetTool()

  // Authentication
  setupAuthentication()

  // Gallery
  setupGallery()

  // Trip planner
  setupTripPlanner()

  // Modals
  setupModals()

  // Reviews
  setupReviews() // New: Setup review form listener
}

// Navigation setup
function setupNavigation() {
  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (window.scrollY > 50) {
      navbar.classList.add("navbar-sticky")
    } else {
      navbar.classList.remove("navbar-sticky")
    }
  })

  // Navigation links - handle both internal and external links
  document.querySelectorAll(".nav-link, .mobile-nav-link, .footer-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href")
      
      // If it's an external link (starts with http) or a different HTML file, let it navigate normally
      if (href.startsWith("http") || href.includes(".html")) {
        // Allow normal navigation for external links and HTML files
        return
      }
      
      // For internal links (hash links), prevent default and scroll smoothly
      if (href.startsWith("#")) {
        e.preventDefault()
        const targetSection = document.querySelector(href)
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" })
        }
      }
    })
  })

  // Explore button functionality - check if we're on index.html
  const exploreBtn = document.getElementById("exploreBtn")
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      // If we're on index.html, scroll to explore section
      if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
        const exploreSection = document.getElementById("explore")
        if (exploreSection) {
          exploreSection.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // If we're on another page, navigate to index.html#explore
        window.location.href = "index.html#explore"
      }
    })
  }
}

// Mobile menu setup
function setupAccountCircle() {
  const accountCircleBtn = document.getElementById("accountCircleBtn")
  const accountDropdown = document.getElementById("accountDropdown")
  const userInitial = document.getElementById("userInitial")
  const userName = document.getElementById("userName")

  if (accountCircleBtn && accountDropdown) {
    // Update user initial and name
    function updateAccountDisplay() {
      if (currentUser) {
        const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 
                       currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'G'
        const displayName = currentUser.name || currentUser.email.split('@')[0] || 'Guest'
        
        userInitial.textContent = initial
        userName.textContent = displayName
      } else {
        userInitial.textContent = 'G'
        userName.textContent = 'Guest'
      }
    }

    // Account circle button is now just for display on mobile
    // The dropdown is always visible on mobile screens
    accountCircleBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      // No toggle behavior needed - dropdown is always visible on mobile
      console.log("Account circle clicked - dropdown is always visible on mobile")
    })

    // Handle navigation when clicking on links
    accountDropdown.querySelectorAll(".account-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        
        // Navigate immediately since dropdown is always visible
        const href = link.getAttribute("href")
        if (href && href.includes(".html")) {
          window.location.href = href
        }
      })
    })
    
    // Initial update of account display
    updateAccountDisplay()
    
    // Make updateAccountDisplay available globally
    window.updateAccountDisplay = updateAccountDisplay
    
    console.log("Account circle setup completed")
  } else {
    console.warn("Account circle elements not found:", { accountCircleBtn, accountDropdown })
  }
}

// Destination cards setup
function setupDestinationCards() {
  document.querySelectorAll(".view-more-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      const destination = e.target.closest(".destination-card").dataset.destination
      showDestinationModal(destination)
    })
  })
}

// Budget tool setup
function setupBudgetTool() {
  // Initialize budget system from budget.js
  if (typeof window.Budget !== 'undefined' && window.Budget.initializeBudget) {
    window.Budget.initializeBudget()
  }

  // Trip type buttons
  const tripTypeButtons = document.querySelectorAll(".trip-type-btn")
  tripTypeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tripTypeButtons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      currentTripType = btn.dataset.type

      // Update group size based on trip type
      const groupSizeInput = document.getElementById("groupSize")
      if (groupSizeInput) {
        switch (currentTripType) {
          case "solo":
            groupSizeInput.value = 1
            break
          case "couple":
            groupSizeInput.value = 2
            break
          case "friends":
            groupSizeInput.value = 4
            break
        }
      }
    })
  })

  // Calculate button
  const calculateBtn = document.getElementById("calculateBtn")
  if (calculateBtn) {
    calculateBtn.addEventListener("click", calculateSmartBudget)
  }

  // PDF download
  const downloadPDFBtn = document.getElementById("downloadPDF")
  if (downloadPDFBtn) {
    downloadPDFBtn.addEventListener("click", downloadBudgetPDF)
  }

  // Save trip
  const saveTripBtn = document.getElementById("saveTrip")
  if (saveTripBtn) {
    saveTripBtn.addEventListener("click", saveTripPlan)
  }

  // Share trip
  const shareTripBtn = document.getElementById("shareTrip")
  if (shareTripBtn) {
    shareTripBtn.addEventListener("click", shareTrip)
  }
}

// Authentication setup
function setupAuthentication() {
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const authForm = document.getElementById("authForm")
  const authToggle = document.getElementById("authToggle")
  const closeAuthModal = document.getElementById("closeAuthModal")

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (currentUser) {
        showUserMenu()
      } else {
        showAuthModal(true)
      }
    })
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      if (currentUser) {
        logoutUser()
      } else {
        showAuthModal(false)
      }
    })
  }

  if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit)
  }

  if (authToggle) {
    authToggle.addEventListener("click", () => {
      showAuthModal(!isLoginMode)
    })
  }

  if (closeAuthModal) {
    closeAuthModal.addEventListener("click", () => {
      document.getElementById("authModal").classList.add("hidden")
    })
  }
}

// Gallery setup
function setupGallery() {
  const uploadBtn = document.getElementById("uploadBtn")
  const photoUpload = document.getElementById("photoUpload")

  if (uploadBtn && photoUpload) {
    uploadBtn.addEventListener("click", () => {
      photoUpload.click()
    })

    photoUpload.addEventListener("change", handlePhotoUpload)
  }

  // Gallery item clicks
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      showImageModal(item)
    })
  })
}

// Trip planner setup
function setupTripPlanner() {
  const addToPlannerBtn = document.getElementById("addToPlannerBtn")
  const bookTripBtn = document.getElementById("bookTripBtn")
  const plannerInputs = ["plannerDays", "plannerGroupSize", "plannerBudgetLevel"]

  if (addToPlannerBtn) {
    addToPlannerBtn.addEventListener("click", toggleTripPlanner)
  }

  if (bookTripBtn) {
    bookTripBtn.addEventListener("click", bookTrip)
  }

  // Add event listeners for planner inputs
  plannerInputs.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.addEventListener("change", calculateEstimatedCost)
    }
  })
}

// Modals setup
function setupModals() {
  // Destination modal
  const closeModal = document.getElementById("closeModal")
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      document.getElementById("destinationModal").classList.add("hidden")
      if (currentMap) {
        currentMap.remove()
        currentMap = null
      }
    })
  }

  // Image modal
  const closeImageModal = document.getElementById("closeImageModal")
  if (closeImageModal) {
    closeImageModal.addEventListener("click", () => {
      document.getElementById("imageModal").classList.add("hidden")
    })
  }

  // View all photos
  const viewAllPhotos = document.getElementById("viewAllPhotos")
  if (viewAllPhotos) {
    viewAllPhotos.addEventListener("click", () => {
      if (currentDestination && destinations[currentDestination]) {
        showImageModal(destinations[currentDestination].images, 0)
      }
    })
  }
}

// New: Reviews setup
function setupReviews() {
  const reviewForm = document.getElementById("reviewForm")
  if (reviewForm) {
    reviewForm.addEventListener("submit", handleReviewSubmit)
  }
}

// Authentication functions
async function checkAuthStatus() {
  try {
    const user = await account.get()
    currentUser = user
    
    // Save user data to localStorage for cross-page authentication
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({
        $id: user.$id,
        email: user.email,
        name: user.name
      }))
    }
    
    return user
  } catch (error) {
    currentUser = null
    return null
  }
}

function initializeUserInterface() {
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")

  if (currentUser) {
    if (loginBtn) {
      loginBtn.textContent = `Hello,  ${currentUser.name || currentUser.email.split("@")[0]}`
      loginBtn.onclick = showUserMenu(true)
    }
    if (registerBtn) {
      registerBtn.textContent = "Logout"
      registerBtn.onclick = logoutUser
      registerBtn.className = "btn btn-secondary"
    }
  } else {
    if (loginBtn) {
      loginBtn.textContent = "Login"
      loginBtn.onclick = () => showAuthModal(true)
    }
    if (registerBtn) {
      registerBtn.textContent = "Sign Up"
      registerBtn.onclick = () => showAuthModal(false)
      registerBtn.className = "btn btn-primary"
    }
  }

  // Update account circle display
  if (typeof window.updateAccountDisplay === 'function') {
    window.updateAccountDisplay()
  }
}

function showUserMenu() {
  const menu = document.createElement("div")
  menu.className = "user-menu"
 
  

  // Remove existing menu
  const existingMenu = document.querySelector(".user-menu")
  if (existingMenu) existingMenu.remove()

  document.body.appendChild(menu)

  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener("click", function closeMenu(e) {
      if (!menu.contains(e.target)) {
        menu.remove()
        document.removeEventListener("click", closeMenu)
      }
    })
  }, 100)
}

function showAuthModal(loginMode) {
  isLoginMode = loginMode
  const modal = document.getElementById("authModal")
  const title = document.getElementById("authTitle")
  const submit = document.getElementById("authSubmit")
  const toggle = document.getElementById("authToggle")

  if (loginMode) {
    title.textContent = "Welcome Back"
    submit.textContent = "Sign In"
    toggle.textContent = "Don't have an account? Sign up"
  } else {
    title.textContent = "Create Account"
    submit.textContent = "Sign Up"
    toggle.textContent = "Already have an account? Sign in"
  }

  modal.classList.remove("hidden")
}

async function handleAuthSubmit(e) {
  e.preventDefault()
  const email = document.getElementById("authEmail").value
  const password = document.getElementById("authPassword").value

  try {
    if (isLoginMode) {
      // Login
      await account.createEmailSession(email, password)
      currentUser = await account.get()
      showNotification(`Welcome back, ${currentUser.name || email.split("@")[0]}! 🎉`, "success")
    } else {
      // Register
      const name = email.split("@")[0]
      await account.create(ID.unique(), email, password, name)
      await account.createEmailSession(email, password)
      currentUser = await account.get()

      // Create user document in database
      await createUserDocument(currentUser)
      showNotification(`Welcome to SmartSplit, ${name}! 🌟`, "success")
    }

    // Save user data to localStorage for cross-page authentication
    localStorage.setItem('currentUser', JSON.stringify({
      $id: currentUser.$id,
      email: currentUser.email,
      name: currentUser.name
    }))

    document.getElementById("authModal").classList.add("hidden")
    document.getElementById("authForm").reset()
    initializeUserInterface()
    
    // Update account circle display
    if (typeof window.updateAccountDisplay === 'function') {
      window.updateAccountDisplay()
    }
    
    await loadUserData()
  } catch (error) {
    console.error("Auth error:", error)
    showNotification(error.message || "Authentication failed", "error")
  }
}

async function createUserDocument(user) {
  try {
    await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
      email: user.email,
      name: user.name,
      joinDate: new Date().toISOString(),
      totalSpent: 0,
      daysTraveled: 0,
    })
  } catch (error) {
    console.error("Error creating user document:", error)
  }
}

async function logoutUser() {
  try {
    await account.deleteSession("current")
    currentUser = null
    
    // Clear user data from localStorage for cross-page authentication
    localStorage.removeItem('currentUser')
    localStorage.removeItem('travelBookings')
    
    initializeUserInterface()
    showNotification("You have been logged out. See you next time! 👋", "success")

    // Clear user-specific data from display
    updateVisitedPlacesDisplay()
    updateMyTripsSection()

    // Remove user menu if open
    const userMenu = document.querySelector(".user-menu")
    if (userMenu) userMenu.remove()
    
    // Update account circle display
    if (typeof window.updateAccountDisplay === 'function') {
      window.updateAccountDisplay()
    }
  } catch (error) {
    console.error("Logout error:", error)
    showNotification("Error logging out", "error")
  }
}

// Data loading functions
async function loadUserData() {
  if (!currentUser) return

  try {
    // Load user trips
    const trips = await databases.listDocuments(DATABASE_ID, TRIPS_COLLECTION_ID, [
      Query.equal("userId", currentUser.$id),
    ])

    currentUser.trips = trips.documents
    updateMyTripsSection()
    updateVisitedPlacesDisplay()
  } catch (error) {
    console.error("Error loading user data:", error)
  }
}

// Destination data
const destinations = {
  kashmir: {
    title: "Kashmir, India",
    coordinates: [34.1492, 74.889],
    budget: {
      accommodation: 6000,
      food: 2500,
      transport: 2000,
      activities: 3000,
    },
    highlights: [
      "🏔️ Snow-capped mountains and scenic views",
      "🛶 Shikara rides on Dal Lake",
      "🌲 Lush green valleys and gardens",
      "🕌 Mughal architecture and culture",
      "🧣 Local handicrafts and warm hospitality",
    ],
    images: [
      {
        name: "Dal Lake",
        svg: "https://images.unsplash.com/photo-1564329494258-3f72215ba175?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Gulmarg",
        svg: "https://images.unsplash.com/photo-1748589131271-5c9f0cbc94f5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  paris: {
    title: "Paris, France",
    coordinates: [48.8566, 2.3522],
    budget: {
      accommodation: 100000, // Adjusted for INR
      food: 50000, // Adjusted for INR
      transport: 17000, // Adjusted for INR
      activities: 33000, // Adjusted for INR
    },
    highlights: [
      "🗼 Iconic Eiffel Tower",
      "🎨 Louvre Museum",
      "🥐 Amazing cafes and bakeries",
      "🛍️ Fashion and shopping",
      "🌉 Romantic Seine river cruises",
    ],
    images: [
      {
        name: "French Riviera",
        svg: "https://images.unsplash.com/photo-1632675853448-05c409279b8c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Louvre Museum",
        svg: "https://images.unsplash.com/photo-1587422023429-24edff4116a5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  rajasthan: {
    title: "Rajasthan, India",
    coordinates: [27.0238, 74.2179],
    budget: {
      accommodation: 5000,
      food: 2000,
      transport: 2500,
      activities: 3500,
    },
    highlights: [
      "🏰 Majestic forts and palaces",
      "🕌 Rich cultural heritage and architecture",
      "🐫 Desert safaris and sand dunes",
      "🎨 Colorful festivals and markets",
      "🍛 Traditional Rajasthani cuisine",
    ],
    images: [
      {
        name: "Hawa Mahal",
        svg: "https://images.unsplash.com/photo-1602643163983-ed0babc39797?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Thar Desert",
        svg: "https://plus.unsplash.com/premium_photo-1661963573455-ba0446e2cab9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },

  london: {
    title: "London, United Kingdom",
    coordinates: [51.5072, -0.1276],
    budget: {
      accommodation: 1250000, // Adjusted for INR
      food: 660000, // Adjusted for INR
      transport: 415000, // Adjusted for INR
      activities: 580000, // Adjusted for INR
    },
    highlights: [
      "🎡 London Eye and Thames River",
      "🏰 Historic sites like Tower of London",
      "🛍️ World-class shopping and nightlife",
      "🎭 Theatres, museums, and art galleries",
      "🌍 Cultural diversity and iconic landmarks",
    ],
    images: [
      {
        name: "Buckingham Palace",
        svg: "https://i.pinimg.com/1200x/d9/62/a7/d962a79b06e165532b73314207416233.jpg",
      },
      {
        name: "London Eye",
        svg: "https://i.pinimg.com/736x/fd/93/e6/fd93e6e3f42e71f1c13debba1e9f8911.jpg",
      },
    ],
  },
  varanasi: {
    title: "Varanasi, India",
    coordinates: [25.3176, 82.9739],
    budget: {
      accommodation: 3000,
      food: 1200,
      transport: 1000,
      activities: 1800,
    },
    highlights: [
      "🔥 Ganga Aarti and spiritual vibes",
      "🛶 Boat rides on the Ganges",
      "🛕 Ancient temples and rituals",
      "📿 Rich history and cultural legacy",
      "🥣 Street food and local delicacies",
    ],
    images: [
      {
        name: "Ganga Aarti",
        svg: "https://i.pinimg.com/1200x/17/ec/eb/17eceb5185148d599a95ba375565968c.jpg",
      },
      {
        name: "Ghats of Varanasi",
        svg: "https://i.pinimg.com/736x/fd/aa/75/fdaa75f0854b00753f0bd8a722676836.jpg",
      },
    ],
  },
  italy: {
    title: "Italy, Europe",
    coordinates: [41.8719, 12.5674],
    budget: {
      accommodation: 1800000, // Adjusted for INR
      food: 700000, // Adjusted for INR
      transport: 500000, // Adjusted for INR
      activities: 800000, // Adjusted for INR
    },
    highlights: [
      "🏛️ Ancient Rome & Colosseum",
      "🍕 Authentic Italian cuisine & wine",
      "🎨 Renaissance art & Vatican City",
      "🚣 Venice canals & gondola rides",
      "🍝 Tuscany countryside & Florence",
    ],
    images: [
      {
        name: "Colosseum",
        svg: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Venice",
        svg: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&crop=center",
      },
    ],
  },
  kedarnath: {
    title: "Kedarnath, India",
    coordinates: [30.7346, 79.0669],
    budget: {
      accommodation: 4000,
      food: 1500,
      transport: 2000,
      activities: 2500,
    },
    highlights: [
      "🏔️ Sacred Kedarnath Temple",
      "⛰️ Himalayan mountain views",
      "🚶‍♂️ Spiritual trekking experience",
      "🕉️ Religious significance & rituals",
      "🌲 Scenic beauty & tranquility",
    ],
    images: [
      {
        name: "Kedarnath Temple",
        svg: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&h=600&fit=crop&crop=center",
      },
      {
        name: "Himalayan Views",
        svg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
      },
    ],
  },
}

// Destination modal functionality
function showDestinationModal(destinationKey) {
  const destination = destinations[destinationKey]
  currentDestination = destinationKey
  const modal = document.getElementById("destinationModal")

  document.getElementById("modalTitle").textContent = destination.title

  // Update image gallery
  const galleryContainer = document.getElementById("destinationGallery")
  galleryContainer.innerHTML = ""
  destination.images.slice(0, 6).forEach((image, index) => {
    const imageDiv = document.createElement("div")
    imageDiv.className = "gallery-item"
    imageDiv.style.backgroundImage = `url("${image.svg}")`
    imageDiv.title = image.name
    imageDiv.addEventListener("click", () => showImageModal(destination.images, index))
    galleryContainer.appendChild(imageDiv)
  })

  // Update budget breakdown
  const budgetContainer = document.getElementById("budgetBreakdown")
  budgetContainer.innerHTML = ""

  let total = 0
  Object.entries(destination.budget).forEach(([category, amount]) => {
    total += amount
    const item = document.createElement("div")
    item.className = "budget-item"
    item.innerHTML = `
          <span class="budget-label">${category}:</span>
          <span class="budget-amount">₹${amount.toLocaleString()}</span>
      `
    budgetContainer.appendChild(item)
  })

  document.getElementById("totalPerPerson").textContent = `₹${total.toLocaleString()}`

  // Update highlights
  const highlightsContainer = document.getElementById("tripHighlights")
  highlightsContainer.innerHTML = ""
  destination.highlights.forEach((highlight) => {
    const item = document.createElement("div")
    item.textContent = highlight
    highlightsContainer.appendChild(item)
  })

  // Reset planner section
  document.getElementById("tripPlannerSection").classList.add("hidden")
  document.getElementById("addToPlannerBtn").textContent = "Add to My Planner"

  // Show modal
  modal.classList.remove("hidden")

  // Initialize map
  setTimeout(() => {
    if (currentMap) {
      currentMap.remove()
    }
    const L = window.L // Declare L variable
    if (typeof L !== "undefined") {
      currentMap = L.map("destinationMap").setView(destination.coordinates, 10)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(currentMap)
      L.marker(destination.coordinates).addTo(currentMap).bindPopup(destination.title).openPopup()
    }
  }, 100)

  // New: Load reviews for the current destination
  loadReviewsForDestination(destinationKey)
}

// Trip planner functions
function toggleTripPlanner() {
  const plannerSection = document.getElementById("tripPlannerSection")
  const button = document.getElementById("addToPlannerBtn")

  if (plannerSection.classList.contains("hidden")) {
    plannerSection.classList.remove("hidden")
    button.textContent = "Hide Planner"
    button.classList.remove("btn-primary")
    button.classList.add("btn-secondary")

    // Pre-fill with smart defaults based on destination
    if (currentDestination && destinations[currentDestination]) {
      document.getElementById("plannerDays").value = "7"
      document.getElementById("plannerGroupSize").value = "2"
      document.getElementById("plannerBudgetLevel").value = "mid"
    }

    // Calculate initial cost
    calculateEstimatedCost()

    // Smooth scroll to planner section
    setTimeout(() => {
      plannerSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 100)

    showNotification(" Trip planner opened! Customize your preferences", "success")
  } else {
    plannerSection.classList.add("hidden")
    button.textContent = "Add to My Planner"
    button.classList.remove("btn-secondary")
    button.classList.add("btn-primary")
    showNotification("Planner closed - click anytime to reopen! ", "info")
  }
}

function calculateEstimatedCost() {
  const days = Number.parseInt(document.getElementById("plannerDays").value)
  const groupSize = Number.parseInt(document.getElementById("plannerGroupSize").value)
  const budgetLevel = document.getElementById("plannerBudgetLevel").value

  // Smart pricing based on budget level
  let dailyRate = 1500 // Default mid-range in INR
  let budgetDescription = ""

  switch (budgetLevel) {
    case "budget":
      dailyRate = 750
      budgetDescription = "Budget-friendly hostels, street food, public transport"
      break
    case "mid":
      dailyRate = 1500
      budgetDescription = "Mid-range hotels, local restaurants, mixed transport"
      break
    case "luxury":
      dailyRate = 3000
      budgetDescription = "Luxury hotels, fine dining, private transport"
      break
  }

  const totalCost = days * groupSize * dailyRate
  const perPerson = totalCost / groupSize

  // Update main cost display
  document.getElementById("estimatedCost").textContent = `₹${totalCost.toLocaleString()}`

  // Enhanced breakdown with more details
  const breakdownText = `
      <div class="cost-details">
          <div class="cost-row">
              <span>Per Person Total:</span>
              <span class="cost-value">₹${perPerson.toLocaleString()}</span>
          </div>
          <div class="cost-row">
              <span>Per Person/Day:</span>
              <span class="cost-value">₹${dailyRate}</span>
          </div>
          <div class="cost-description">
              ${budgetDescription}
          </div>
          <div class="cost-tip">
               ${getBudgetTip(budgetLevel, days, groupSize)}
          </div>
      </div>
  `

  document.getElementById("costBreakdown").innerHTML = breakdownText

  // Add visual feedback for cost changes
  const costElement = document.getElementById("estimatedCost")
  costElement.style.transform = "scale(1.05)"
  costElement.style.color = "var(--accent)"
  setTimeout(() => {
    costElement.style.transform = "scale(1)"
    costElement.style.color = ""
  }, 200)
}

function getBudgetTip(budgetLevel, days, groupSize) {
  if (budgetLevel === "budget" && days > 7) {
    return "Long budget trip - consider cooking some meals to save more!"
  } else if (budgetLevel === "luxury" && groupSize > 4) {
    return "Large luxury group - book early for better rates!"
  } else if (budgetLevel === "mid" && days <= 3) {
    return "Short mid-range trip - perfect for a weekend getaway!"
  } else if (groupSize === 1) {
    return "Solo travel - consider hostels for meeting other travelers!"
  } else if (groupSize >= 4) {
    return "Group travel - look for group discounts on activities!"
  } else {
    return "Great choice! This budget level offers good value for your trip."
  }
}

async function bookTrip() {
  if (!currentDestination) return

  if (!currentUser) {
    showNotification("Please login or sign up to book trips!", "error")
    showAuthModal(true)
    return
  }

  const destination = destinations[currentDestination]
  const days = Number.parseInt(document.getElementById("plannerDays").value)
  const groupSize = Number.parseInt(document.getElementById("plannerGroupSize").value)
  const budgetLevel = document.getElementById("plannerBudgetLevel").value
  const estimatedCost = Number.parseInt(document.getElementById("estimatedCost").textContent.replace(/[₹,]/g, ""))

  try {
    const tripData = {
      userId: currentUser.$id,
      destination: destination.title,
      destinationKey: currentDestination,
      days: days,
      groupSize: groupSize,
      budgetLevel: budgetLevel,
      estimatedCost: estimatedCost,
      status: "Booked",
      bookingDate: new Date().toISOString(),
      startDate: getNextWeekDate(),
    }

    // Save trip to database
    await databases.createDocument(DATABASE_ID, TRIPS_COLLECTION_ID, ID.unique(), tripData)

    // Update user stats
    await updateUserStats(estimatedCost, days)

    // Reload user data
    await loadUserData()

  } catch (error) {
    console.error("Error booking trip:", error)
    showNotification("Error booking trip. Please try again.", "error")
  }
}

async function addTripToBudget(destinationTitle, estimatedCost, days, groupSize, budgetLevel) {
  try {
    if (!currentUser || !currentDestination) {
      throw new Error("Missing user or destination info");
    }

    const tripData = {
      userId: currentUser.$id,
      destination: destinationTitle,
      destinationKey: currentDestination,
      budgetLevel,
      status: "Booked",
      days: parseInt(days),
      groupSize: parseInt(groupSize),
      estimatedCost: parseInt(estimatedCost),
      bookingDate: new Date().toISOString(),
      startDate: getNextWeekDate(),
    };

    await databases.createDocument(DATABASE_ID, TRIPS_COLLECTION_ID, ID.unique(), tripData);
    console.log("✅ Trip added to Appwrite:", tripData);
  } catch (error) {
    console.error("❌ Error in addTripToBudget:", error);
    showNotification("Error saving trip to database.", "error");
  }
}


async function updateUserStats(cost, days) {
  try {
    const userDoc = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, currentUser.$id)

    await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, currentUser.$id, {
      totalSpent: (userDoc.totalSpent || 0) + cost,
      daysTraveled: (userDoc.daysTraveled || 0) + days,
    })
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

function getNextWeekDate() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  return date.toISOString()
}


// Image modal functions
let currentImageSet = []
let currentImageIndex = 0

function showImageModal(images, startIndex = 0) {
  currentImageSet = images
  currentImageIndex = startIndex
  const modal = document.getElementById("imageModal")

  updateImageModal()
  modal.classList.remove("hidden")
}

function updateImageModal() {
  const image = currentImageSet[currentImageIndex]
  document.getElementById("imageModalTitle").textContent = image.name
  document.getElementById("imageModalContent").style.backgroundImage = `url("${image.svg}")`

  // Update navigation dots
  const navigation = document.getElementById("imageNavigation")
  navigation.innerHTML = ""
  currentImageSet.forEach((_, index) => {
    const dot = document.createElement("button")
    dot.className = `image-nav-dot ${index === currentImageIndex ? "active" : ""}`
    dot.addEventListener("click", () => {
      currentImageIndex = index
      updateImageModal()
    })
    navigation.appendChild(dot)
  })
}

// My Trips functions
function updateMyTripsSection() {
  const myTripsGrid = document.getElementById("myTripsGrid")
  
  // Load budget data from localStorage
  const budgetData = JSON.parse(localStorage.getItem('tripBudgetData') || '[]')
  
  if (budgetData.length === 0) {
    myTripsGrid.innerHTML = `
      <div class="no-trips-message">
        <h3>No trips planned yet</h3>
        <p>Start exploring destinations and book your first trip!</p>
        <a href="explore.html" class="btn btn-primary">Explore Destinations</a>
      </div>
    `
    return
  }

  // Show budget trips
  const tripsHTML = budgetData
    .map((trip) => `
      <div class="trip-card fade-in" data-trip-id="${trip.id}">
        <div class="trip-header">
          <div class="trip-destination">
            <span class="trip-flag">${trip.flag}</span>
            <h3>${trip.destination}</h3>
          </div>
          <div class="trip-status ${trip.status}">${trip.status}</div>
        </div>
        <div class="trip-details">
          <div class="trip-info">
            <p><i class="fas fa-calendar"></i> ${new Date(trip.departureDate).toLocaleDateString()}</p>
            <p><i class="fas fa-users"></i> ${trip.travelers} travelers</p>
            <p><i class="fas fa-clock"></i> ${trip.duration} days</p>
          </div>
          <div class="trip-budget">
            <h4>Total Budget: ₹${trip.totalBudget.toLocaleString()}</h4>
            <div class="budget-breakdown">
              <span>🏨 ₹${trip.budgetBreakdown.accommodation.toLocaleString()}</span>
              <span>🍽️ ₹${trip.budgetBreakdown.food.toLocaleString()}</span>
              <span>🚗 ₹${trip.budgetBreakdown.transport.toLocaleString()}</span>
              <span>🎯 ₹${trip.budgetBreakdown.activities.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="trip-actions">
          <button class="btn btn-secondary" onclick="editTrip('${trip.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteTrip('${trip.id}')">Delete</button>
        </div>
      </div>
    `)
    .join("")

  myTripsGrid.innerHTML = tripsHTML
}

// Edit trip function
function editTrip(tripId) {
  const budgetData = JSON.parse(localStorage.getItem('tripBudgetData') || '[]')
  const trip = budgetData.find(t => t.id === tripId)
  
  if (trip) {
    // Redirect to explore page with trip data
    localStorage.setItem('editTripData', JSON.stringify(trip))
    window.location.href = 'explore.html'
  }
}

// Delete trip function
function deleteTrip(tripId) {
  if (confirm('Are you sure you want to delete this trip?')) {
    const budgetData = JSON.parse(localStorage.getItem('tripBudgetData') || '[]')
    const updatedData = budgetData.filter(t => t.id !== tripId)
    localStorage.setItem('tripBudgetData', JSON.stringify(updatedData))
    
    // Refresh the display
    updateMyTripsSection()
    updateVisitedPlacesDisplay()
    
    showNotification('Trip deleted successfully', 'success')
  }
}

function updateVisitedPlacesDisplay() {
  const visitedContainer = document.getElementById("visitedPlaces")
  const visitedCount = document.getElementById("visitedCount")
  const countriesCount = document.getElementById("countriesCount")
  const totalSpent = document.getElementById("totalSpent")
  const daysTraveled = document.getElementById("daysTraveled")

  // Load budget data from localStorage
  const budgetData = JSON.parse(localStorage.getItem('tripBudgetData') || '[]')
  
  visitedCount.textContent = budgetData.length
  countriesCount.textContent = new Set(budgetData.map((t) => t.destination)).size

  // Calculate totals from budget data
  const totalSpentAmount = budgetData.reduce((sum, trip) => sum + (trip.totalBudget || 0), 0)
  const totalDays = budgetData.reduce((sum, trip) => sum + (parseInt(trip.duration) || 0), 0)

  totalSpent.textContent = `₹${totalSpentAmount.toLocaleString()}`
  daysTraveled.textContent = totalDays

  if (budgetData.length === 0) {
    if (visitedContainer) {
      visitedContainer.innerHTML =
        '<div class="no-data-message">No trips planned yet. Start planning your first adventure! ✈️</div>'
    }
    return
  }

  if (visitedContainer) {
    visitedContainer.innerHTML = budgetData
      .map(
        (trip) => `
        <div class="visited-place-item">
            <div class="visited-place-info">
                <div class="visited-place-name">${trip.destination}</div>
                <div class="visited-place-details">${trip.duration} days • ${trip.status} • ${new Date(trip.departureDate).toLocaleDateString()}</div>
                <div class="visited-place-group">${trip.travelers} people</div>
            </div>
            <div class="visited-place-cost">₹${trip.totalBudget.toLocaleString()}</div>
        </div>
    `,
      )
      .join("")
  }
}


// New: Review functions
async function loadReviewsForDestination(destinationKey) {
  const reviewsContainer = document.getElementById("destinationReviews")
  reviewsContainer.innerHTML = '<div class="loading-reviews">Loading reviews...</div>'

  try {
    const response = await databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
      Query.equal("destinationKey", destinationKey),
      Query.orderDesc("createdAt"),
    ])

    const reviews = response.documents

    if (reviews.length === 0) {
      reviewsContainer.innerHTML =
        '<div class="no-reviews-message">No reviews yet. Be the first to share your experience!</div>'
      return
    }

    reviewsContainer.innerHTML = reviews
      .map(
        (review) => `
    <div class="review-item">
        <div class="review-header">
            <span class="review-author">${review.userName || "Anonymous"}</span>
            <span class="review-rating">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span>
        </div>
        <p class="review-comment">${review.comment}</p>
        <span class="review-date">${new Date(review.createdAt).toLocaleDateString()}</span>
    </div>
  `,
      )
      .join("")
  } catch (error) {
    console.error("Error loading reviews:", error)
    reviewsContainer.innerHTML = '<div class="error-reviews-message">Failed to load reviews.</div>'
    showNotification("Error loading reviews.", "error")
  }
}

async function handleReviewSubmit(e) {
  e.preventDefault()

  if (!currentUser) {
    showNotification("Please login to leave a review!", "error")
    showAuthModal(true)
    return
  }

  const comment = document.getElementById("reviewComment").value
  const rating = document.querySelector('input[name="rating"]:checked')?.value

  if (!comment || !rating) {
    showNotification("Please provide both a comment and a rating.", "warning")
    return
  }

  try {
   await databases.createDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, ID.unique(), {
  userId: currentUser.$id,
  userName: currentUser.name || currentUser.email.split("@")[0],
  destinationKey: currentDestination,
  rating: Number.parseInt(rating),
  comment: comment,
  createdAt: new Date().toISOString(),
});

  alert("Review Uploaded sucessfully")
    showNotification("Review submitted successfully! Thank you! 🎉", "success")
    document.getElementById("reviewComment").value = ""
    document.querySelectorAll('input[name="rating"]').forEach((radio) => (radio.checked = false)) // Clear rating selection
    loadReviewsForDestination(currentDestination) // Reload reviews to show the new one
  } catch (error) {
    console.error("Error submitting review:", error)
    showNotification("Error submitting review. Please try again.", "error")
  }
}

// Hash navigation function
function handleHashNavigation() {
  // Check if there's a hash in the URL
  if (window.location.hash) {
    const hash = window.location.hash
    const targetSection = document.querySelector(hash)
    
    if (targetSection) {
      // Wait a bit for the page to load, then scroll to the section
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: "smooth" })
      }, 500)
    }
  }
}

// Utility functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  const colors = {
    success: "notification-success",
    error: "notification-error",
    info: "notification-info",
    warning: "notification-warning",
  }

  notification.className = `notification ${colors[type]}`
  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.add("notification-show")
  }, 100)

  // Animate out and remove
  setTimeout(() => {
    notification.classList.remove("notification-show")
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Function to add trip to budget tool
function addTripToBudget(destination, cost, days, groupSize, budgetLevel) {
  // Check if budget functions are available
  if (typeof window.Budget !== 'undefined' && window.Budget.addExpense) {
    // Create a synthetic event object for the addExpense function
    const syntheticEvent = {
      preventDefault: () => {}
    }
    
    // Temporarily set form values
    const originalDescription = document.getElementById('expenseDescription')?.value || ''
    const originalAmount = document.getElementById('expenseAmount')?.value || ''
    const originalCategory = document.getElementById('expenseCategory')?.value || ''
    const originalPaidBy = document.getElementById('paidBy')?.value || ''
    
    // Set new values for the trip
    if (document.getElementById('expenseDescription')) {
      document.getElementById('expenseDescription').value = `Trip to ${destination}`
    }
    if (document.getElementById('expenseAmount')) {
      document.getElementById('expenseAmount').value = cost
    }
    if (document.getElementById('expenseCategory')) {
      document.getElementById('expenseCategory').value = 'activities'
    }
    if (document.getElementById('paidBy')) {
      document.getElementById('paidBy').value = currentUser?.name || currentUser?.email?.split('@')[0] || 'You'
    }
    
    // Add the expense
    window.Budget.addExpense(syntheticEvent)
    
    // Restore original values
    if (document.getElementById('expenseDescription')) {
      document.getElementById('expenseDescription').value = originalDescription
    }
    if (document.getElementById('expenseAmount')) {
      document.getElementById('expenseAmount').value = originalAmount
    }
    if (document.getElementById('expenseCategory')) {
      document.getElementById('expenseCategory').value = originalCategory
    }
    if (document.getElementById('paidBy')) {
      document.getElementById('paidBy').value = originalPaidBy
    }
    
    // Also add individual expense items for better breakdown
    addTripExpenseBreakdown(destination, cost, days, groupSize, budgetLevel)
  } else {
    // Fallback: save to localStorage directly
    saveTripToBudgetLocalStorage(destination, cost, days, groupSize, budgetLevel)
  }
}

// Function to add detailed trip expense breakdown
function addTripExpenseBreakdown(destination, totalCost, days, groupSize, budgetLevel) {
  if (typeof window.Budget === 'undefined') return
  
  // Calculate breakdown based on budget level
  const breakdown = calculateTripBreakdown(totalCost, days, groupSize, budgetLevel)
  
  // Add each category as a separate expense
  Object.keys(breakdown).forEach(category => {
    if (breakdown[category] > 0) {
      const syntheticEvent = { preventDefault: () => {} }
      
      // Temporarily set form values
      const originalDescription = document.getElementById('expenseDescription')?.value || ''
      const originalAmount = document.getElementById('expenseAmount')?.value || ''
      const originalCategory = document.getElementById('expenseCategory')?.value || ''
      const originalPaidBy = document.getElementById('paidBy')?.value || ''
      
      // Set new values
      if (document.getElementById('expenseDescription')) {
        document.getElementById('expenseDescription').value = `${destination} - ${category}`
      }
      if (document.getElementById('expenseAmount')) {
        document.getElementById('expenseAmount').value = breakdown[category]
      }
      if (document.getElementById('expenseCategory')) {
        document.getElementById('expenseCategory').value = category
      }
      if (document.getElementById('paidBy')) {
        document.getElementById('paidBy').value = currentUser?.name || currentUser?.email?.split('@')[0] || 'You'
      }
      
      // Add the expense
      window.Budget.addExpense(syntheticEvent)
      
      // Restore original values
      if (document.getElementById('expenseDescription')) {
        document.getElementById('expenseDescription').value = originalDescription
      }
      if (document.getElementById('expenseAmount')) {
        document.getElementById('expenseAmount').value = originalAmount
      }
      if (document.getElementById('expenseCategory')) {
        document.getElementById('expenseCategory').value = originalCategory
      }
      if (document.getElementById('paidBy')) {
        document.getElementById('paidBy').value = originalPaidBy
      }
    }
  })
}

// Function to calculate trip expense breakdown
function calculateTripBreakdown(totalCost, days, groupSize, budgetLevel) {
  // Default breakdown percentages based on budget level
  const breakdowns = {
    budget: {
      accommodation: 0.25,
      transport: 0.30,
      food: 0.25,
      activities: 0.15,
      shopping: 0.05
    },
    mid: {
      accommodation: 0.35,
      transport: 0.25,
      food: 0.20,
      activities: 0.15,
      shopping: 0.05
    },
    luxury: {
      accommodation: 0.45,
      transport: 0.20,
      food: 0.15,
      activities: 0.15,
      shopping: 0.05
    }
  }
  
  const breakdown = breakdowns[budgetLevel] || breakdowns.mid
  
  return {
    accommodation: Math.round(totalCost * breakdown.accommodation),
    transport: Math.round(totalCost * breakdown.transport),
    food: Math.round(totalCost * breakdown.food),
    activities: Math.round(totalCost * breakdown.activities),
    shopping: Math.round(totalCost * breakdown.shopping)
  }
}

// Fallback function to save trip to localStorage
function saveTripToBudgetLocalStorage(destination, cost, days, groupSize, budgetLevel) {
  try {
    // Get existing expenses from localStorage
    const existingExpenses = JSON.parse(localStorage.getItem('tripExpenses') || '[]')
    
    // Create trip expense
    const tripExpense = {
      id: Date.now(),
      description: `Trip to ${destination}`,
      amount: cost,
      category: 'activities',
      paidBy: currentUser?.name || currentUser?.email?.split('@')[0] || 'You',
      date: new Date().toISOString(),
      splitAmong: ['You']
    }
    
    // Add to expenses
    existingExpenses.push(tripExpense)
    
    // Save back to localStorage
    localStorage.setItem('tripExpenses', JSON.stringify(existingExpenses))
    
    // Update budget total if needed
    const currentBudget = parseFloat(localStorage.getItem('tripBudget') || '1500')
    localStorage.setItem('tripBudget', (currentBudget + cost).toString())
    
    showNotification(`Trip added to budget tool!`, "success")
  } catch (error) {
    console.error('Error saving trip to budget:', error)
  }
}

// Global functions for user menu
window.viewProfile = () => {
  document.querySelector(".user-menu")?.remove()
  if (!currentUser) return

  showNotification(`Profile: ${currentUser.name || currentUser.email}`, "info")
}

window.viewMyTrips = () => {
  document.querySelector(".user-menu")?.remove()
  document.getElementById("my-trips").scrollIntoView({ behavior: "smooth" })
}

window.openBudgetTool = () => {
  document.getElementById("destinationModal").classList.add("hidden")
  document.getElementById("budget-tool").scrollIntoView({ behavior: "smooth" })
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp)
} else {
  initializeApp()
}
