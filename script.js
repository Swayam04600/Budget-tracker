// DOM elements
const totalIncomeElement = document.getElementById('totalIncome');
const totalExpensesElement = document.getElementById('totalExpenses');
const remainingBudgetElement = document.getElementById('remainingBudget');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const addButton = document.getElementById('addButton');
const filterIncomeButton = document.getElementById('filterIncome');
const filterExpenseButton = document.getElementById('filterExpense');
const filterAllButton = document.getElementById('filterAll');
const transactionList = document.getElementById('transactions');

// Data storage and tracking variables
let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;

// Load transactions from local storage
loadTransactionsFromStorage();

// Event listeners
addButton.addEventListener('click', addTransaction);
filterIncomeButton.addEventListener('click', () => renderTransactions('income'));
filterExpenseButton.addEventListener('click', () => renderTransactions('expense'));
filterAllButton.addEventListener('click', () => renderTransactions('all'));

// Initialize the application
window.addEventListener('DOMContentLoaded', loadTransactionsFromStorage);

// Function to add a transaction
function addTransaction() {
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (description && !isNaN(amount) && amount > 0) {
        const transaction = {
            id: Date.now(),
            description,
            amount,
            type
        };

        transactions.push(transaction);

        updateTotals(transaction);
        saveTransactionsToStorage();

        // Reset input fields and focus on description
        descriptionInput.value = '';
        amountInput.value = '';
        descriptionInput.focus();

        renderTransactions();

        // Provide visual feedback to the user
        showNotification('Transaction added successfully', 'success');
    } else {
        showNotification('Please provide a valid description and amount greater than 0.', 'error');
    }
}

// Function to update total income and expenses
function updateTotals(transaction) {
    if (transaction.type === 'income') {
        totalIncome += transaction.amount;
    } else {
        totalExpenses += transaction.amount;
    }

    const remainingBudget = totalIncome - totalExpenses;

    totalIncomeElement.textContent = totalIncome.toFixed(2);
    totalExpensesElement.textContent = totalExpenses.toFixed(2);
    remainingBudgetElement.textContent = remainingBudget.toFixed(2);
}

// Function to render the transactions list
function renderTransactions(filter = 'all') {
    // Clear the transaction list
    transactionList.innerHTML = '';

    // Filter the transactions based on the selected filter
    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.type === filter;
    });

    // Render each transaction
    filteredTransactions.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.description}: ${transaction.amount.toFixed(2)}`;
        listItem.classList.add(transaction.type);

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));

        listItem.appendChild(deleteButton);
        transactionList.appendChild(listItem);

        // Add animation for adding list items
        listItem.classList.add('fade-in');
    });
}

// Function to delete a transaction
function deleteTransaction(transactionId) {
    const index = transactions.findIndex(transaction => transaction.id === transactionId);
    if (index !== -1) {
        const transaction = transactions[index];
        if (transaction.type === 'income') {
            totalIncome -= transaction.amount;
        } else {
            totalExpenses -= transaction.amount;
        }

        transactions.splice(index, 1);

        saveTransactionsToStorage();
        renderTransactions();
        updateTotals({ type: 'all', amount: 0 });

        // Provide visual feedback to the user
        showNotification('Transaction deleted successfully', 'success');
    }
}

// Function to save transactions to local storage
function saveTransactionsToStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('totalIncome', totalIncome.toFixed(2));
    localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));
}

// Function to load transactions from local storage
function loadTransactionsFromStorage() {
    const savedTransactions = localStorage.getItem('transactions');
    const savedTotalIncome = localStorage.getItem('totalIncome');
    const savedTotalExpenses = localStorage.getItem('totalExpenses');
    
    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        totalIncome = parseFloat(savedTotalIncome);
        totalExpenses = parseFloat(savedTotalExpenses);

        updateTotals({ type: 'all', amount: 0 });
        renderTransactions();
    }
}

// Function to show notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate the notification
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
