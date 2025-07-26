// Budget Splitter JavaScript

let expenses = [];
let groupMembers = ['You'];
let totalBudget = 1500;

// Initialize budget system
function initializeBudget() {
    loadBudgetData();
    setupBudgetEventListeners();
    renderExpenses();
    updateBudgetSummary();
}

// Setup event listeners
function setupBudgetEventListeners() {
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', addExpense);
    }
}

// Load budget data from localStorage
function loadBudgetData() {
    const savedExpenses = localStorage.getItem('tripExpenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    
    const savedBudget = localStorage.getItem('tripBudget');
    if (savedBudget) {
        totalBudget = parseFloat(savedBudget);
    }
    
    const savedMembers = localStorage.getItem('groupMembers');
    if (savedMembers) {
        groupMembers = JSON.parse(savedMembers);
    }
}

// Add new expense
function addExpense(e) {
    e.preventDefault();
    
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const paidBy = document.getElementById('paidBy').value;
    
    if (!description || !amount || !paidBy) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const expense = {
        id: Date.now(),
        description,
        amount,
        category,
        paidBy,
        date: new Date().toISOString(),
        splitAmong: [...groupMembers] // Everyone by default
    };
    
    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    updateBudgetSummary();
    
    // Reset form
    document.getElementById('expenseForm').reset();
    
    showNotification('Expense added successfully!', 'success');
    
    // Animate new expense
    if (window.Animations && window.Animations.animateList) {
        setTimeout(() => {
            window.Animations.animateList('.expense-item:last-child');
        }, 100);
    }
}

// Remove expense
function removeExpense(expenseId) {
    expenses = expenses.filter(expense => expense.id !== expenseId);
    saveExpenses();
    renderExpenses();
    updateBudgetSummary();
    showNotification('Expense removed', 'info');
}

// Edit expense
function editExpense(expenseId) {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;
    
    // Fill form with expense data
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('paidBy').value = expense.paidBy;
    
    // Remove the expense (will be re-added when form is submitted)
    removeExpense(expenseId);
}

// Render expenses list
function renderExpenses() {
    const expensesList = document.getElementById('expensesList');
    if (!expensesList) return;
    
    if (expenses.length === 0) {
        expensesList.innerHTML = `
            <div class="no-expenses">
                <i class="fas fa-wallet"></i>
                <p>No expenses added yet</p>
                <small>Add your first expense to start tracking</small>
            </div>
        `;
        return;
    }
    
    // Group expenses by category
    const groupedExpenses = groupExpensesByCategory();
    
    expensesList.innerHTML = Object.keys(groupedExpenses).map(category => `
        <div class="expense-category">
            <h4 class="category-header">
                <i class="${getCategoryIcon(category)}"></i>
                ${formatCategoryName(category)}
                <span class="category-total">$${groupedExpenses[category].total.toFixed(2)}</span>
            </h4>
            <div class="category-expenses">
                ${groupedExpenses[category].expenses.map(expense => `
                    <div class="expense-item">
                        <div class="expense-info">
                            <h5>${expense.description}</h5>
                            <div class="expense-meta">
                                <span class="expense-date">${formatDate(expense.date)}</span>
                                <span class="expense-paidby">Paid by ${expense.paidBy}</span>
                            </div>
                        </div>
                        <div class="expense-amount">
                            <span class="amount">$${expense.amount.toFixed(2)}</span>
                            <div class="expense-actions">
                                <button onclick="editExpense(${expense.id})" class="edit-btn">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="removeExpense(${expense.id})" class="delete-btn">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    addExpenseStyles();
}

// Group expenses by category
function groupExpensesByCategory() {
    const grouped = {};
    
    expenses.forEach(expense => {
        if (!grouped[expense.category]) {
            grouped[expense.category] = {
                expenses: [],
                total: 0
            };
        }
        grouped[expense.category].expenses.push(expense);
        grouped[expense.category].total += expense.amount;
    });
    
    return grouped;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        accommodation: 'fas fa-bed',
        transport: 'fas fa-plane',
        food: 'fas fa-utensils',
        activities: 'fas fa-ticket-alt',
        shopping: 'fas fa-shopping-bag',
        other: 'fas fa-ellipsis-h'
    };
    return icons[category] || 'fas fa-receipt';
}

// Format category name
function formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Update budget summary
function updateBudgetSummary() {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = totalBudget - totalSpent;
    
    // Update UI
    updateElement('totalBudget', `$${totalBudget.toFixed(2)}`);
    updateElement('totalSpentBudget', `$${totalSpent.toFixed(2)}`);
    updateElement('remainingBudget', `$${remaining.toFixed(2)}`);
    
    // Update split summary
    updateSplitSummary();
    
    // Update progress bar
    const progressPercentage = (totalSpent / totalBudget) * 100;
    updateBudgetProgress(progressPercentage);
}

// Update split summary
function updateSplitSummary() {
    const splitSummary = document.getElementById('splitSummary');
    if (!splitSummary) return;
    
    // Calculate what each person owes
    const memberBalances = calculateMemberBalances();
    
    splitSummary.innerHTML = `
        <div class="split-header">
            <h4>Group Members</h4>
            <button onclick="addGroupMember()" class="add-member-btn">
                <i class="fas fa-user-plus"></i>
                Add Member
            </button>
        </div>
        <div class="member-balances">
            ${Object.keys(memberBalances).map(member => `
                <div class="member-balance">
                    <div class="member-info">
                        <i class="fas fa-user"></i>
                        <span>${member}</span>
                    </div>
                    <div class="balance-info">
                        <span class="paid">Paid: $${memberBalances[member].paid.toFixed(2)}</span>
                        <span class="owes ${memberBalances[member].balance >= 0 ? 'positive' : 'negative'}">
                            ${memberBalances[member].balance >= 0 ? 'Owed' : 'Owes'}: 
                            $${Math.abs(memberBalances[member].balance).toFixed(2)}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    addSplitStyles();
}

// Calculate member balances
function calculateMemberBalances() {
    const balances = {};
    
    // Initialize balances
    groupMembers.forEach(member => {
        balances[member] = {
            paid: 0,
            owes: 0,
            balance: 0
        };
    });
    
    // Calculate what each person paid
    expenses.forEach(expense => {
        if (balances[expense.paidBy]) {
            balances[expense.paidBy].paid += expense.amount;
        }
    });
    
    // Calculate what each person owes (equal split)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const perPersonShare = totalExpenses / groupMembers.length;
    
    groupMembers.forEach(member => {
        balances[member].owes = perPersonShare;
        balances[member].balance = balances[member].paid - balances[member].owes;
    });
    
    return balances;
}

// Add group member
function addGroupMember() {
    const name = prompt('Enter member name:');
    if (name && name.trim() && !groupMembers.includes(name.trim())) {
        groupMembers.push(name.trim());
        localStorage.setItem('groupMembers', JSON.stringify(groupMembers));
        updateSplitSummary();
        showNotification(`${name} added to group`, 'success');
    }
}

// Update budget progress
function updateBudgetProgress(percentage) {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.budget-progress');
    if (!progressBar) {
        const budgetSummary = document.querySelector('.budget-summary');
        if (budgetSummary) {
            progressBar = document.createElement('div');
            progressBar.className = 'budget-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-labels">
                    <span>Budget Used</span>
                    <span>${percentage.toFixed(1)}%</span>
                </div>
            `;
            budgetSummary.appendChild(progressBar);
            addProgressStyles();
        }
    }
    
    // Update progress
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        
        // Change color based on percentage
        if (percentage > 80) {
            progressFill.style.background = '#f44336';
        } else if (percentage > 60) {
            progressFill.style.background = '#ff9800';
        } else {
            progressFill.style.background = '#4caf50';
        }
    }
    
    // Update percentage label
    const percentageLabel = document.querySelector('.progress-labels span:last-child');
    if (percentageLabel) {
        percentageLabel.textContent = `${percentage.toFixed(1)}%`;
    }
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('tripExpenses', JSON.stringify(expenses));
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
}

// Update element helper
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Add expense styles
function addExpenseStyles() {
    const styles = `
        .no-expenses {
            text-align: center;
            padding: 3rem 2rem;
            color: rgba(255, 255, 255, 0.7);
        }
        
        .no-expenses i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.3);
        }
        
        .expense-category {
            margin-bottom: 2rem;
        }
        
        .category-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ffffff;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .category-total {
            margin-left: auto;
            color: #64b5f6;
            font-weight: 600;
        }
        
        .category-expenses {
            display: grid;
            gap: 0.75rem;
        }
        
        .expense-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .expense-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .expense-info h5 {
            color: #ffffff;
            margin-bottom: 0.25rem;
        }
        
        .expense-meta {
            display: flex;
            gap: 1rem;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.6);
        }
        
        .expense-amount {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .amount {
            color: #64b5f6;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .expense-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .edit-btn, .delete-btn {
            padding: 0.5rem;
            border: none;
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }
        
        .edit-btn {
            background: rgba(100, 181, 246, 0.2);
            color: #64b5f6;
        }
        
        .edit-btn:hover {
            background: rgba(100, 181, 246, 0.3);
        }
        
        .delete-btn {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .delete-btn:hover {
            background: rgba(244, 67, 54, 0.3);
        }
    `;
    
    if (!document.getElementById('expense-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'expense-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Add split styles
function addSplitStyles() {
    const styles = `
        .split-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .split-header h4 {
            color: #ffffff;
        }
        
        .add-member-btn {
            padding: 0.5rem 1rem;
            background: rgba(100, 181, 246, 0.2);
            border: 1px solid #64b5f6;
            border-radius: 0.5rem;
            color: #64b5f6;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .add-member-btn:hover {
            background: rgba(100, 181, 246, 0.3);
        }
        
        .member-balances {
            display: grid;
            gap: 1rem;
        }
        
        .member-balance {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 0.5rem;
        }
        
        .member-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: #ffffff;
        }
        
        .member-info i {
            width: 20px;
            text-align: center;
            color: #64b5f6;
        }
        
        .balance-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.25rem;
            font-size: 0.9rem;
        }
        
        .paid {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .owes.positive {
            color: #4caf50;
        }
        
        .owes.negative {
            color: #f44336;
        }
    `;
    
    if (!document.getElementById('split-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'split-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Add progress styles
function addProgressStyles() {
    const styles = `
        .budget-progress {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: #4caf50;
            transition: width 0.8s ease, background 0.3s ease;
        }
        
        .progress-labels {
            display: flex;
            justify-content: space-between;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
        }
    `;
    
    if (!document.getElementById('progress-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'progress-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Export budget functions
window.Budget = {
    initializeBudget,
    addExpense,
    removeExpense,
    editExpense,
    addGroupMember
};