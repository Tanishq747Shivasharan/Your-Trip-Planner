// Appwrite Configuration
const client = new Appwrite.Client();
client.setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("68860401002a4d8a099f");

const account = new Appwrite.Account(client);

// ------------------ Theme Toggle ------------------
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('change', function () {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });

    if (localStorage.getItem('darkMode') === 'true') {
        themeToggle.checked = true;
        document.body.classList.add('dark-theme');
    }
}

// ------------------ Login Handler ------------------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) return alert("Fill all fields.");
    if (password.length < 8) return alert("Password must be 8+ characters.");

    try {
        console.log("Logging in...");

        // ✅ Fix: clear existing session first
        await account.deleteSessions();

        await account.createEmailSession(email, password);
        const user = await account.get();
        console.log("Login successful:", user);
        alert("login successful");

        if (rememberMe) {
            localStorage.setItem("currentUser", JSON.stringify(user));
        } else {
            sessionStorage.setItem("currentUser", JSON.stringify(user));
        }

        window.location.href = "dashboard.html";
    } catch (err) {
        console.error("Login error:", err);
        alert("Login failed. Please check your credentials.");
    }
});

// ------------------ Register Handler ------------------
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const newsletter = document.getElementById('newsletter').checked;

    if (!name || !email || !password) return alert("Fill all fields.");
    if (!agreeTerms) return alert("You must agree to terms & conditions.");
    if (password.length < 8) return alert("Password must be 8+ characters.");

    try {
        console.log("Registering user...");

        await account.create('unique()', email, password, name);

        const user = await account.get();
        console.log("Registration & login successful:", user);
        alert("login successful");

        localStorage.setItem("newsletter", newsletter);
        localStorage.setItem("currentUser", JSON.stringify(user));

        window.location.href = "dashboard.html";
    } catch (err) {
        if (err.code === 409) {
            alert("Email already exists. Try logging in.");
        } else {
            console.error("Registration error:", err);
            alert("Registration failed. Try again.");
        }
    }
});

// ------------------ Feature Toggles ------------------
const featureToggles = {
    smartRecommendations: document.getElementById('smartRecommendations'),
    budgetTracking: document.getElementById('budgetTracking'),
    smartAlerts: document.getElementById('smartAlerts'),
    memoryGallery: document.getElementById('memoryGallery'),
};

Object.keys(featureToggles).forEach((feature) => {
    const toggle = featureToggles[feature];
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        localStorage.setItem(feature, toggle.checked);
    });

    const saved = localStorage.getItem(feature);
    if (saved !== null) toggle.checked = saved === 'true';
});

// ------------------ Tab Switching Logic ------------------
function switchTab(tab) {
    document.querySelectorAll(".auth-tab").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".auth-form").forEach(form => form.classList.remove("active"));

    document.querySelector(`.auth-tab[onclick*="${tab}"]`).classList.add("active");
    document.getElementById(`${tab}Form`).classList.add("active");
}
