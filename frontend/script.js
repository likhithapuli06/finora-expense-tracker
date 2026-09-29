/**
 * Finora - Modern Personal Finance Application
 * Frontend Controller (Vanilla JavaScript)
 * 
 * Supports Spring Boot REST API:
 * - GET    /api/expenses
 * - POST   /api/expenses
 * - PUT    /api/expenses/{id}
 * - DELETE /api/expenses/{id}
 * - GET    /api/budget
 * - POST   /api/budget
 */

const API_BASE_URL = 'http://localhost:8080/api/expenses';
const API_BUDGET_URL = 'http://localhost:8080/api/budget';

// Category color mappings & modern line icons
const CATEGORIES = {
  Food: {
    color: '#F59E0B', // Amber
    bg: 'rgba(245, 158, 11, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v20M14 2v5a3 3 0 0 0 6 0V2M6 2v7a3 3 0 0 0 2 2.82V22M4 2v6a2 2 0 0 0 2 2"/></svg>`
  },
  Bills: {
    color: '#3B82F6', // Blue
    bg: 'rgba(59, 130, 246, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`
  },
  Travel: {
    color: '#14B8A6', // Teal
    bg: 'rgba(20, 184, 166, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`
  },
  Shopping: {
    color: '#A855F7', // Purple
    bg: 'rgba(168, 85, 247, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
  },
  Education: {
    color: '#EC4899', // Pink
    bg: 'rgba(236, 72, 153, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
  },
  Entertainment: {
    color: '#06B6D4', // Cyan
    bg: 'rgba(6, 182, 212, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/></svg>`
  },
  Other: {
    color: '#94A8B8', // Slate
    bg: 'rgba(148, 168, 184, 0.14)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  }
};

// Application State
let expenses = [];
let monthlyBudget = 10000;
let activeTab = 'dashboard';
let editingExpenseId = null;
let expenseIdToDelete = null;
let isConnectedToBackend = false;
let currentCurrency = 'INR';
let currentCurrencySymbol = '₹';

// Seed expenses accurately matching the reference image statistics:
// Total Spent: ₹8,859.00 | This Month: ₹5,439.00 | Transactions: 9 | Highest: ₹1,850.00
const fallbackExpenses = [
  {
    id: 1,
    description: "Grocery & Vegetables",
    amount: 1450.00,
    category: "Food",
    date: "2026-09-18",
    paymentMethod: "UPI"
  },
  {
    id: 2,
    description: "Electricity Bill",
    amount: 1850.00,
    category: "Bills",
    date: "2026-09-16",
    paymentMethod: "Cash"
  },
  {
    id: 3,
    description: "Train Ticket",
    amount: 800.00,
    category: "Travel",
    date: "2026-09-15",
    paymentMethod: "Debit Card"
  },
  {
    id: 4,
    description: "Cafe & Dining Out",
    amount: 440.00,
    category: "Food",
    date: "2026-09-12",
    paymentMethod: "UPI"
  },
  {
    id: 5,
    description: "Algorithms Masterclass",
    amount: 499.00,
    category: "Education",
    date: "2026-09-05",
    paymentMethod: "Debit Card"
  },
  {
    id: 6,
    description: "Weekend Movie & Arcade",
    amount: 400.00,
    category: "Entertainment",
    date: "2026-09-03",
    paymentMethod: "UPI"
  },
  {
    id: 7,
    description: "Workstation Accessories",
    amount: 699.00,
    category: "Shopping",
    date: "2026-08-28",
    paymentMethod: "Credit Card"
  },
  {
    id: 8,
    description: "High-speed Fiber Broadband",
    amount: 999.00,
    category: "Bills",
    date: "2026-08-14",
    paymentMethod: "UPI"
  },
  {
    id: 9,
    description: "Gourmet Pantry & Coffee Restock",
    amount: 1722.00,
    category: "Food",
    date: "2026-07-22",
    paymentMethod: "UPI"
  }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initDateAndGreeting();
  setupEventListeners();
  loadBudget();
  loadAllExpenses();
});

/**
 * Dynamic Greeting & Date Header Setup
 */
function initDateAndGreeting() {
  const greetingEl = document.getElementById('greetingText');
  const dateEl = document.getElementById('formattedCurrentDate');
  
  const now = new Date();
  const hours = now.getHours();

  const profile = getUserProfile();
  currentCurrency = profile.currency || 'INR';
  currentCurrencySymbol = profile.currencySymbol || '₹';
  updateCurrencyDisplays();

  if (greetingEl) {
    let timeGreeting = 'Good afternoon';
    if (hours < 12) {
      timeGreeting = 'Good morning';
    } else if (hours >= 17) {
      timeGreeting = 'Good evening';
    }
    const firstName = profile.name ? profile.name.trim().split(' ')[0] : 'there';
    greetingEl.textContent = `${timeGreeting}, ${firstName}`;
  }

  if (dateEl) {
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  // Pre-fill modal date with today
  const modalDate = document.getElementById('modalDate');
  if (modalDate) {
    modalDate.value = now.toISOString().split('T')[0];
  }
}

/**
 * Event Listeners for Filters and Modal Actions
 */
function setupEventListeners() {
  const txSearch = document.getElementById('txSearchInput');
  const txCategory = document.getElementById('txCategoryFilter');
  const txPayment = document.getElementById('txPaymentFilter');
  const txDate = document.getElementById('txDateFilter');

  if (txSearch) txSearch.addEventListener('input', applyTxFilters);
  if (txCategory) txCategory.addEventListener('change', applyTxFilters);
  if (txPayment) txPayment.addEventListener('change', applyTxFilters);
  if (txDate) txDate.addEventListener('change', applyTxFilters);

  // Keyboard navigation: Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeExpenseModal();
      closeBudgetModal();
      closeDeleteDialog();
      closeProfileModal();
    }
  });

  // Close modals when clicking outside card (on background overlay)
  ['profileModalOverlay', 'expenseModalOverlay', 'budgetModalOverlay', 'deleteModalOverlay'].forEach(id => {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          if (id === 'profileModalOverlay') closeProfileModal();
          else if (id === 'expenseModalOverlay') closeExpenseModal();
          else if (id === 'budgetModalOverlay') closeBudgetModal();
          else if (id === 'deleteModalOverlay') closeDeleteDialog();
        }
      });
    }
  });
}

/**
 * Tab Navigation Controller
 */
window.switchTab = function(tabName) {
  activeTab = tabName;

  // Navigation tab buttons
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tabBtn${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (activeBtn) activeBtn.classList.add('active');

  // App views
  document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
  const activeView = document.getElementById(`view${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
  if (activeView) activeView.classList.add('active');

  // Dynamic heading & subtitle
  const pageHeading = document.getElementById('pageHeading');
  const pageSubheading = document.getElementById('pageSubheading');

  if (tabName === 'dashboard') {
    initDateAndGreeting();
    if (pageSubheading) pageSubheading.textContent = "Here's your spending overview.";
    refreshDashboard();
  } else if (tabName === 'transactions') {
    if (pageHeading) pageHeading.innerHTML = "Transactions";
    if (pageSubheading) pageSubheading.textContent = "Track, filter, and manage your spending.";
    applyTxFilters();
  } else if (tabName === 'analytics') {
    if (pageHeading) pageHeading.innerHTML = "Analytics";
    if (pageSubheading) pageSubheading.textContent = "Detailed insights, category splits, and monthly trends.";
    renderAnalyticsPage();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Currency Formatter
 */
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const locale = currentCurrency === 'INR' ? 'en-IN' : 'en-US';
  return currentCurrencySymbol + num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Date Formatter (e.g., Sep 18, 2026)
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Load Budget from REST API or Storage
 */
async function loadBudget() {
  try {
    const res = await fetch(API_BUDGET_URL, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.amount) {
        monthlyBudget = Number(data.amount);
      }
    } else {
      const stored = localStorage.getItem('finora_monthly_budget');
      if (stored) monthlyBudget = Number(stored);
    }
  } catch {
    const stored = localStorage.getItem('finora_monthly_budget');
    if (stored) monthlyBudget = Number(stored);
  }
  updateBudgetCard();
}

/**
 * Save Budget
 */
window.handleBudgetSubmit = async function(event) {
  event.preventDefault();
  const input = document.getElementById('budgetInput');
  const errorMsg = document.getElementById('budgetInputError');
  const newBudget = Number(input.value);

  if (!newBudget || newBudget < 100) {
    if (errorMsg) errorMsg.style.display = 'block';
    return;
  }
  if (errorMsg) errorMsg.style.display = 'none';

  monthlyBudget = newBudget;
  localStorage.setItem('finora_monthly_budget', newBudget.toString());

  // Attempt backend persistence
  try {
    await fetch(API_BUDGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: newBudget }),
      signal: AbortSignal.timeout(1500)
    });
  } catch {
    // Graceful offline fallback
  }

  updateBudgetCard();
  closeBudgetModal();
  showToast('Monthly budget updated successfully.');
};

/**
 * Load All Expenses (REST API with Fallback)
 */
async function loadAllExpenses() {
  try {
    const res = await fetch(API_BASE_URL, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        expenses = data;
        isConnectedToBackend = true;
      } else {
        expenses = [...fallbackExpenses];
      }
    } else {
      expenses = [...fallbackExpenses];
    }
  } catch {
    // Offline mode: use fallback data
    expenses = [...fallbackExpenses];
  }

  // Sort newest first
  expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  refreshDashboard();
  if (activeTab === 'transactions') applyTxFilters();
  if (activeTab === 'analytics') renderAnalyticsPage();
}

/**
 * Master Dashboard Refresh
 */
function refreshDashboard() {
  updateSummaryStats();
  updateBudgetCard();
  updateQuickInsight();
  renderTopCategories();
  renderMonthlyChart();
  renderRecentTransactions();
}

/**
 * 1. Update Top Statistics Cards
 */
function updateSummaryStats() {
  const totalSpentEl = document.getElementById('statTotalSpent');
  const thisMonthEl = document.getElementById('statThisMonth');
  const txCountEl = document.getElementById('statTxCount');
  const highestSpendEl = document.getElementById('statHighestSpend');
  const highestDescEl = document.getElementById('statHighestDesc');

  // Total All-Time Spend
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  if (totalSpentEl) totalSpentEl.textContent = formatCurrency(total);

  // This Month Spend
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  const thisMonthExpenses = expenses.filter(item => {
    if (!item.date) return false;
    const [y, m] = item.date.split('-').map(Number);
    return y === currentYear && m === (currentMonth + 1);
  });

  const thisMonthTotal = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  if (thisMonthEl) thisMonthEl.textContent = formatCurrency(thisMonthTotal);

  // Transaction Count
  if (txCountEl) txCountEl.textContent = expenses.length.toString();

  // Highest Expense
  if (expenses.length > 0) {
    const highest = expenses.reduce((prev, curr) => Number(curr.amount) > Number(prev.amount) ? curr : prev, expenses[0]);
    if (highestSpendEl) highestSpendEl.textContent = formatCurrency(highest.amount);
    if (highestDescEl) highestDescEl.textContent = highest.description || 'Single largest purchase';
  } else {
    if (highestSpendEl) highestSpendEl.textContent = formatCurrency(0);
    if (highestDescEl) highestDescEl.textContent = 'No recorded expenses';
  }
}

/**
 * 2. Update Monthly Budget Card with Circular SVG Progress Ring
 */
function updateBudgetCard() {
  const progressCircle = document.getElementById('budgetCircleProgress');
  const percentText = document.getElementById('budgetCirclePercentText');
  const spentEl = document.getElementById('budgetSpentDisplay');
  const remainingEl = document.getElementById('budgetRemainingDisplay');
  const limitEl = document.getElementById('budgetLimitDisplay');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const thisMonthExpenses = expenses.filter(item => {
    if (!item.date) return false;
    const [y, m] = item.date.split('-').map(Number);
    return y === currentYear && m === (currentMonth + 1);
  });

  const spent = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = monthlyBudget - spent;
  const rawPct = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0;
  const pctRounded = Math.round(rawPct);

  if (spentEl) spentEl.textContent = formatCurrency(spent);
  if (limitEl) limitEl.textContent = formatCurrency(monthlyBudget);

  if (remainingEl) {
    if (remaining < 0) {
      remainingEl.textContent = '-' + formatCurrency(Math.abs(remaining));
      remainingEl.classList.add('negative');
    } else {
      remainingEl.textContent = formatCurrency(remaining);
      remainingEl.classList.remove('negative');
    }
  }

  // Circular progress ring: stroke-dasharray="100, 100", stroke-dashoffset = 100 - clamp(0, 100)
  const clamped = Math.min(Math.max(rawPct, 0), 100);
  const offset = 100 - clamped;

  if (progressCircle) {
    progressCircle.setAttribute('stroke-dashoffset', offset.toString());
    progressCircle.setAttribute('stroke', rawPct > 100 ? '#F87171' : '#19D3AE');
  }

  if (percentText) {
    percentText.textContent = `${pctRounded}%`;
    percentText.style.color = rawPct > 100 ? '#F87171' : '#F5F7FA';
  }
}

/**
 * 3. Update Quick Insight Card (Data-Driven, No AI)
 */
function updateQuickInsight() {
  const textEl = document.getElementById('quickInsightText');
  if (!textEl) return;

  if (expenses.length === 0) {
    textEl.textContent = "Start tracking your spending to uncover your primary financial habits.";
    return;
  }

  // Aggregate current month expenses or fallback to all
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  let targetExpenses = expenses.filter(item => {
    if (!item.date) return false;
    const [y, m] = item.date.split('-').map(Number);
    return y === currentYear && m === (currentMonth + 1);
  });

  let periodLabel = "this month";
  if (targetExpenses.length === 0) {
    targetExpenses = expenses;
    periodLabel = "overall";
  }

  const categoryTotals = {};
  let totalPeriodSpent = 0;

  targetExpenses.forEach(item => {
    const cat = item.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(item.amount);
    totalPeriodSpent += Number(item.amount);
  });

  let topCat = null;
  let topAmount = 0;

  for (const [cat, amt] of Object.entries(categoryTotals)) {
    if (amt > topAmount) {
      topAmount = amt;
      topCat = cat;
    }
  }

  if (topCat && totalPeriodSpent > 0) {
    const pct = ((topAmount / totalPeriodSpent) * 100).toFixed(1);
    textEl.textContent = `${topCat} is your highest spending category ${periodLabel} (${pct}%).`;
  } else {
    textEl.textContent = "Your spending is balanced across your tracked categories.";
  }
}

/**
 * 4. Render Top Categories List
 */
function renderTopCategories() {
  const container = document.getElementById('dashboardCategoriesList');
  const countPill = document.getElementById('categoriesCountPill');
  if (!container) return;

  container.innerHTML = '';

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  
  // Aggregate by category
  const categoryMap = {};
  // Pre-seed known categories
  const defaultCats = ['Food', 'Bills', 'Travel', 'Shopping', 'Education', 'Entertainment'];
  defaultCats.forEach(c => { categoryMap[c] = { amount: 0, count: 0 }; });

  expenses.forEach(item => {
    const cat = item.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { amount: 0, count: 0 };
    }
    categoryMap[cat].amount += Number(item.amount);
    categoryMap[cat].count += 1;
  });

  const categoryEntries = Object.entries(categoryMap).filter(([_, data]) => data.amount > 0 || defaultCats.includes(_));
  if (countPill) countPill.textContent = `${categoryEntries.length} categories`;

  // Sort by highest amount
  categoryEntries.sort((a, b) => b[1].amount - a[1].amount);

  categoryEntries.forEach(([categoryName, data]) => {
    const config = CATEGORIES[categoryName] || CATEGORIES.Other;
    const percentage = totalSpent > 0 ? ((data.amount / totalSpent) * 100).toFixed(1) : '0.0';

    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML = `
      <div class="category-row-top">
        <div class="category-row-left">
          <div class="category-icon-bubble" style="background-color: ${config.bg}; color: ${config.color};">
            ${config.iconSvg}
          </div>
          <span class="category-name">${escapeHtml(categoryName)}</span>
        </div>
        <div class="category-row-right">
          <span class="category-amount">${formatCurrency(data.amount)}</span>
          <span class="category-pct">${percentage}%</span>
        </div>
      </div>
      <div class="category-progress-track">
        <div class="category-progress-fill" style="width: ${percentage}%; background-color: ${config.color};"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * 5. Render Spending Overview Monthly Bar Chart (SVG)
 * Shows Apr, May, Jun, Jul, Aug, Sep with values above bars and teal gradient fill
 */
function renderMonthlyChart() {
  const svg = document.getElementById('monthlySpendChart');
  if (!svg) return;

  svg.innerHTML = '';

  // 6 months list: Apr, May, Jun, Jul, Aug, Sep
  const months = [
    { key: '2026-04', label: 'Apr', defaultSpend: 4200 },
    { key: '2026-05', label: 'May', defaultSpend: 6800 },
    { key: '2026-06', label: 'Jun', defaultSpend: 5400 },
    { key: '2026-07', label: 'Jul', defaultSpend: 7200 },
    { key: '2026-08', label: 'Aug', defaultSpend: 6100 },
    { key: '2026-09', label: 'Sep', defaultSpend: 5439 }
  ];

  // Calculate actual spend per month from expenses
  const actualSpend = {};
  months.forEach(m => { actualSpend[m.key] = 0; });

  let hasCustomData = false;
  expenses.forEach(item => {
    if (item.date && item.date.length >= 7) {
      const ym = item.date.slice(0, 7);
      if (actualSpend[ym] !== undefined) {
        actualSpend[ym] += Number(item.amount);
        hasCustomData = true;
      }
    }
  });

  // Assign values (use actual spend if recorded, otherwise default realistic sample from reference)
  const barData = months.map(m => {
    const val = actualSpend[m.key] > 0 ? actualSpend[m.key] : m.defaultSpend;
    return { ...m, value: val };
  });

  const maxVal = 12000;

  // SVG Chart Geometry
  const width = 600;
  const height = 220;
  const padLeft = 65;
  const padRight = 20;
  const padBottom = 34;
  const padTop = 26;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padBottom - padTop;
  const barWidth = 46;
  const gap = (chartWidth - (months.length * barWidth)) / (months.length - 1);

  // Define SVG Linear Gradients
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="tealBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#19D3AE" />
      <stop offset="100%" stop-color="#0E7490" />
    </linearGradient>
  `;
  svg.appendChild(defs);

  // Draw Horizontal Grid lines & Y-Axis Labels
  const gridSteps = [
    { label: '₹12,000', val: 12000 },
    { label: '₹9,000', val: 9000 },
    { label: '₹6,000', val: 6000 },
    { label: '₹3,000', val: 3000 },
    { label: '₹0', val: 0 }
  ];

  gridSteps.forEach(step => {
    const y = padTop + chartHeight - (step.val / maxVal) * chartHeight;

    // Grid Line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${padLeft}`);
    line.setAttribute('x2', `${width - padRight}`);
    line.setAttribute('y1', `${y}`);
    line.setAttribute('y2', `${y}`);
    line.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', `${padLeft - 10}`);
    text.setAttribute('y', `${y + 4}`);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#5A6878');
    text.setAttribute('font-size', '10.5');
    text.setAttribute('font-weight', '500');
    text.textContent = step.label;
    svg.appendChild(text);
  });

  // Draw Bars, Top Values & Month Labels
  barData.forEach((item, idx) => {
    const barH = Math.max((item.value / maxVal) * chartHeight, 6);
    const x = padLeft + idx * (barWidth + gap);
    const y = height - padBottom - barH;

    // Bar Rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${x}`);
    rect.setAttribute('y', `${y}`);
    rect.setAttribute('width', `${barWidth}`);
    rect.setAttribute('height', `${barH}`);
    rect.setAttribute('rx', '6');
    rect.setAttribute('fill', 'url(#tealBarGrad)');
    rect.style.transition = 'all 0.3s ease';

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${item.label}: ${formatCurrency(item.value)}`;
    rect.appendChild(title);
    svg.appendChild(rect);

    // Value on top of bar (e.g., ₹5,439)
    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', `${x + barWidth / 2}`);
    valText.setAttribute('y', `${Math.max(y - 7, 14)}`);
    valText.setAttribute('text-anchor', 'middle');
    valText.setAttribute('fill', '#F5F7FA');
    valText.setAttribute('font-size', '10.5');
    valText.setAttribute('font-weight', '700');
    valText.textContent = `₹${Math.round(item.value).toLocaleString('en-IN')}`;
    svg.appendChild(valText);

    // Month Label (e.g., Apr)
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', `${x + barWidth / 2}`);
    labelText.setAttribute('y', `${height - 12}`);
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('fill', '#8A98A8');
    labelText.setAttribute('font-size', '11.5');
    labelText.setAttribute('font-weight', '500');
    labelText.textContent = item.label;
    svg.appendChild(labelText);
  });
}

/**
 * 6. Render Recent Transactions (Top 3-5 Rows)
 */
function renderRecentTransactions() {
  const tbody = document.getElementById('recentTransactionsList');
  const emptyState = document.getElementById('dashboardEmptyState');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (expenses.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Show 3 latest transactions
  const recent = expenses.slice(0, 3);

  recent.forEach(tx => {
    const config = CATEGORIES[tx.category] || CATEGORIES.Other;
    const catBadgeClass = 'badge-' + (tx.category ? tx.category.toLowerCase() : 'other');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="tx-desc-cell">
          <div class="category-icon-bubble" style="background-color: ${config.bg}; color: ${config.color}; width: 26px; height: 26px;">
            ${config.iconSvg}
          </div>
          <span>${escapeHtml(tx.description)}</span>
        </div>
      </td>
      <td>
        <span class="category-badge ${catBadgeClass}">${escapeHtml(tx.category)}</span>
      </td>
      <td class="tx-date-text">${formatDate(tx.date)}</td>
      <td>
        <span class="payment-method-pill">${escapeHtml(tx.paymentMethod)}</span>
      </td>
      <td style="text-align: right;" class="tx-amount-text">${formatCurrency(tx.amount)}</td>
      <td style="text-align: right;">
        <div class="tx-action-group">
          <button class="action-icon-btn edit-btn" onclick="openExpenseModal(${tx.id})" title="Edit Expense">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button class="action-icon-btn del-btn" onclick="promptDeleteDialog(${tx.id})" title="Delete Expense">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * 7. Full Transactions Table with Search & Filters
 */
function applyTxFilters() {
  const search = (document.getElementById('txSearchInput')?.value || '').trim().toLowerCase();
  const category = document.getElementById('txCategoryFilter')?.value || '';
  const payment = document.getElementById('txPaymentFilter')?.value || '';
  const date = document.getElementById('txDateFilter')?.value || '';

  const tableBody = document.getElementById('fullTransactionsTableBody');
  const countEl = document.getElementById('txFilteredCount');
  const totalEl = document.getElementById('txFilteredTotal');
  const emptyState = document.getElementById('txEmptyState');

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const filtered = expenses.filter(item => {
    const matchSearch = !search || (item.description && item.description.toLowerCase().includes(search));
    const matchCategory = !category || item.category === category;
    const matchPayment = !payment || item.paymentMethod === payment;
    const matchDate = !date || item.date === date;
    return matchSearch && matchCategory && matchPayment && matchDate;
  });

  const filteredSum = filtered.reduce((sum, item) => sum + Number(item.amount), 0);

  if (countEl) countEl.textContent = `${filtered.length} expense${filtered.length === 1 ? '' : 's'}`;
  if (totalEl) totalEl.textContent = formatCurrency(filteredSum);

  if (filtered.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  filtered.forEach(tx => {
    const config = CATEGORIES[tx.category] || CATEGORIES.Other;
    const catBadgeClass = 'badge-' + (tx.category ? tx.category.toLowerCase() : 'other');

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Description">
        <div class="tx-desc-cell">
          <div class="category-icon-bubble" style="background-color: ${config.bg}; color: ${config.color}; width: 28px; height: 28px;">
            ${config.iconSvg}
          </div>
          <span style="font-weight: 600; color: var(--text-primary);">${escapeHtml(tx.description)}</span>
        </div>
      </td>
      <td data-label="Category">
        <span class="category-badge ${catBadgeClass}">
          ${escapeHtml(tx.category)}
        </span>
      </td>
      <td data-label="Date" class="tx-date-text">
        ${formatDate(tx.date)}
      </td>
      <td data-label="Payment">
        <span class="payment-method-pill">${escapeHtml(tx.paymentMethod)}</span>
      </td>
      <td data-label="Amount" style="text-align: right;" class="tx-amount-text">
        ${formatCurrency(tx.amount)}
      </td>
      <td data-label="Actions" style="text-align: right;">
        <div class="tx-action-group">
          <button class="action-icon-btn edit-btn" onclick="openExpenseModal(${tx.id})" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button class="action-icon-btn del-btn" onclick="promptDeleteDialog(${tx.id})" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

window.resetTxFilters = function() {
  const s = document.getElementById('txSearchInput');
  const c = document.getElementById('txCategoryFilter');
  const p = document.getElementById('txPaymentFilter');
  const d = document.getElementById('txDateFilter');
  if (s) s.value = '';
  if (c) c.value = '';
  if (p) p.value = '';
  if (d) d.value = '';
  applyTxFilters();
};

/**
 * 8. Analytics Page Controller
 */
function renderAnalyticsPage() {
  const anTotal = document.getElementById('anTotalSpend');
  const anAvg = document.getElementById('anAvgTransaction');
  const anHigh = document.getElementById('anHighestExpense');
  const anTop = document.getElementById('anTopCategory');
  const anTopSub = document.getElementById('anTopCategorySub');

  const total = expenses.reduce((sum, i) => sum + Number(i.amount), 0);
  const count = expenses.length;
  const avg = count > 0 ? total / count : 0;

  if (anTotal) anTotal.textContent = formatCurrency(total);
  if (anAvg) anAvg.textContent = formatCurrency(avg);

  if (count > 0) {
    const highest = expenses.reduce((p, c) => Number(c.amount) > Number(p.amount) ? c : p, expenses[0]);
    if (anHigh) anHigh.textContent = formatCurrency(highest.amount);
  } else {
    if (anHigh) anHigh.textContent = formatCurrency(0);
  }

  // Calculate top category
  const catTotals = {};
  expenses.forEach(i => {
    const c = i.category || 'Other';
    catTotals[c] = (catTotals[c] || 0) + Number(i.amount);
  });

  let topCatName = '—';
  let topCatVal = 0;
  for (const [c, val] of Object.entries(catTotals)) {
    if (val > topCatVal) {
      topCatVal = val;
      topCatName = c;
    }
  }

  if (anTop) anTop.textContent = topCatName;
  if (anTopSub) {
    anTopSub.textContent = topCatVal > 0 ? `${formatCurrency(topCatVal)} total` : 'No category data';
  }

  renderAnalyticsMonthlyChart();
  renderCategoryDonutChart(catTotals, total);
  renderPaymentMethodsBreakdown(total);
}

function renderAnalyticsMonthlyChart() {
  const svg = document.getElementById('anMonthlyChart');
  if (!svg) return;
  svg.innerHTML = '';

  const months = [
    { key: '2026-04', label: 'Apr', val: 4200 },
    { key: '2026-05', label: 'May', val: 6800 },
    { key: '2026-06', label: 'Jun', val: 5400 },
    { key: '2026-07', label: 'Jul', val: 7200 },
    { key: '2026-08', label: 'Aug', val: 6100 },
    { key: '2026-09', label: 'Sep', val: 5439 }
  ];

  const actualSpend = {};
  months.forEach(m => { actualSpend[m.key] = 0; });
  expenses.forEach(item => {
    if (item.date && item.date.length >= 7) {
      const ym = item.date.slice(0, 7);
      if (actualSpend[ym] !== undefined) actualSpend[ym] += Number(item.amount);
    }
  });

  const barData = months.map(m => ({
    ...m,
    value: actualSpend[m.key] > 0 ? actualSpend[m.key] : m.val
  }));

  const maxVal = 12000;
  const width = 600;
  const height = 220;
  const padLeft = 65;
  const padRight = 20;
  const padBottom = 34;
  const padTop = 26;
  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padBottom - padTop;
  const barWidth = 46;
  const gap = (chartWidth - (months.length * barWidth)) / (months.length - 1);

  // SVG Linear Gradient
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="anTealBarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#19D3AE" />
      <stop offset="100%" stop-color="#0E7490" />
    </linearGradient>
  `;
  svg.appendChild(defs);

  // Grid Lines
  for (let grid = 0; grid <= 4; grid++) {
    const y = padTop + (chartHeight / 4) * grid;
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', `${padLeft}`);
    gridLine.setAttribute('x2', `${width - padRight}`);
    gridLine.setAttribute('y1', `${y}`);
    gridLine.setAttribute('y2', `${y}`);
    gridLine.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
    gridLine.setAttribute('stroke-width', '1');
    svg.appendChild(gridLine);
  }

  barData.forEach((item, idx) => {
    const barH = Math.max((item.value / maxVal) * chartHeight, 6);
    const x = padLeft + idx * (barWidth + gap);
    const y = height - padBottom - barH;

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', `${x}`);
    rect.setAttribute('y', `${y}`);
    rect.setAttribute('width', `${barWidth}`);
    rect.setAttribute('height', `${barH}`);
    rect.setAttribute('rx', '6');
    rect.setAttribute('fill', 'url(#anTealBarGrad)');
    svg.appendChild(rect);

    const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valText.setAttribute('x', `${x + barWidth / 2}`);
    valText.setAttribute('y', `${Math.max(y - 7, 14)}`);
    valText.setAttribute('text-anchor', 'middle');
    valText.setAttribute('fill', '#F5F7FA');
    valText.setAttribute('font-size', '10.5');
    valText.setAttribute('font-weight', '700');
    valText.textContent = `₹${Math.round(item.value).toLocaleString('en-IN')}`;
    svg.appendChild(valText);

    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    labelText.setAttribute('x', `${x + barWidth / 2}`);
    labelText.setAttribute('y', `${height - 12}`);
    labelText.setAttribute('text-anchor', 'middle');
    labelText.setAttribute('fill', '#8A98A8');
    labelText.setAttribute('font-size', '11.5');
    labelText.setAttribute('font-weight', '500');
    labelText.textContent = item.label;
    svg.appendChild(labelText);
  });
}

function renderCategoryDonutChart(catTotals, total) {
  const svg = document.getElementById('anCategoryDonutSvg');
  const legend = document.getElementById('anCategoryDonutLegend');
  if (!svg || !legend) return;

  svg.innerHTML = '';
  legend.innerHTML = '';

  const entries = Object.entries(catTotals).filter(([_, val]) => val > 0);
  entries.sort((a, b) => b[1] - a[1]);

  if (entries.length === 0 || total === 0) {
    svg.innerHTML = `<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="14"/>`;
    legend.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem;">No transaction data available.</p>`;
    return;
  }

  let cumulativePct = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  entries.forEach(([cat, amount]) => {
    const config = CATEGORIES[cat] || CATEGORIES.Other;
    const pct = amount / total;
    const strokeDash = pct * circumference;
    const strokeOffset = circumference - (cumulativePct * circumference);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', config.color);
    circle.setAttribute('stroke-width', '14');
    circle.setAttribute('stroke-dasharray', `${strokeDash} ${circumference}`);
    circle.setAttribute('stroke-dashoffset', `${strokeOffset}`);
    circle.setAttribute('transform', 'rotate(-90 50 50)');
    svg.appendChild(circle);

    cumulativePct += pct;

    // Legend item
    const legendItem = document.createElement('div');
    legendItem.className = 'donut-legend-item';
    legendItem.innerHTML = `
      <div class="donut-legend-left">
        <span class="donut-legend-color" style="background-color: ${config.color};"></span>
        <span style="font-weight:600; color:var(--text-primary);">${escapeHtml(cat)}</span>
      </div>
      <div>
        <span style="font-weight:700; margin-right:8px;">${formatCurrency(amount)}</span>
        <span style="color:var(--text-muted); font-size:0.775rem;">(${(pct * 100).toFixed(1)}%)</span>
      </div>
    `;
    legend.appendChild(legendItem);
  });
}

function renderPaymentMethodsBreakdown(total) {
  const container = document.getElementById('anPaymentMethodsList');
  if (!container) return;
  container.innerHTML = '';

  const paymentMap = {};
  expenses.forEach(tx => {
    const p = tx.paymentMethod || 'Other';
    paymentMap[p] = (paymentMap[p] || 0) + Number(tx.amount);
  });

  const entries = Object.entries(paymentMap);
  entries.sort((a, b) => b[1] - a[1]);

  if (entries.length === 0 || total === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">No payment methods recorded yet.</p>`;
    return;
  }

  entries.forEach(([method, amt]) => {
    const pct = total > 0 ? ((amt / total) * 100).toFixed(1) : 0;
    const row = document.createElement('div');
    row.className = 'category-row';
    row.innerHTML = `
      <div class="category-row-top">
        <span class="category-name">${escapeHtml(method)}</span>
        <div class="category-row-right">
          <span class="category-amount">${formatCurrency(amt)}</span>
          <span class="category-pct">${pct}%</span>
        </div>
      </div>
      <div class="category-progress-track">
        <div class="category-progress-fill" style="width: ${pct}%; background-color: var(--primary);"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * 9. Add / Edit Expense Modal Controller
 */
window.openExpenseModal = function(id = null) {
  const modal = document.getElementById('expenseModalOverlay');
  const title = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('modalSubmitBtn');
  const form = document.getElementById('expenseModalForm');
  
  if (!modal || !form) return;

  editingExpenseId = id;
  clearModalValidation();

  if (id) {
    const tx = expenses.find(e => e.id === id);
    if (tx) {
      if (title) title.textContent = "Edit Expense";
      if (submitBtn) submitBtn.textContent = "Save Changes";
      document.getElementById('modalDesc').value = tx.description || '';
      document.getElementById('modalAmount').value = tx.amount || '';
      document.getElementById('modalCategory').value = tx.category || '';
      document.getElementById('modalPayment').value = tx.paymentMethod || '';
      document.getElementById('modalDate').value = tx.date || '';
    }
  } else {
    if (title) title.textContent = "Add Expense";
    if (submitBtn) submitBtn.textContent = "Add Expense";
    form.reset();
    document.getElementById('modalDate').value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('active');
  setTimeout(() => document.getElementById('modalDesc')?.focus(), 50);
};

window.closeExpenseModal = function() {
  const modal = document.getElementById('expenseModalOverlay');
  if (modal) modal.classList.remove('active');
  editingExpenseId = null;
  clearModalValidation();
};

function clearModalValidation() {
  document.querySelectorAll('.field-error-msg').forEach(el => el.style.display = 'none');
}

window.handleModalSubmit = async function(event) {
  event.preventDefault();
  clearModalValidation();

  const desc = document.getElementById('modalDesc').value.trim();
  const amount = parseFloat(document.getElementById('modalAmount').value);
  const category = document.getElementById('modalCategory').value;
  const paymentMethod = document.getElementById('modalPayment').value;
  const date = document.getElementById('modalDate').value;

  let isValid = true;
  if (!desc) {
    document.getElementById('modalDescError').style.display = 'block';
    isValid = false;
  }
  if (!amount || amount <= 0) {
    document.getElementById('modalAmountError').style.display = 'block';
    isValid = false;
  }
  if (!category) {
    document.getElementById('modalCategoryError').style.display = 'block';
    isValid = false;
  }
  if (!paymentMethod) {
    document.getElementById('modalPaymentError').style.display = 'block';
    isValid = false;
  }
  if (!date) {
    document.getElementById('modalDateError').style.display = 'block';
    isValid = false;
  }

  if (!isValid) return;

  const payload = { description: desc, amount, category, paymentMethod, date };

  if (editingExpenseId) {
    // UPDATE
    try {
      const res = await fetch(`${API_BASE_URL}/${editingExpenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        const updated = await res.json();
        const idx = expenses.findIndex(e => e.id === editingExpenseId);
        if (idx !== -1) expenses[idx] = updated;
      } else {
        const idx = expenses.findIndex(e => e.id === editingExpenseId);
        if (idx !== -1) expenses[idx] = { ...expenses[idx], ...payload };
      }
    } catch {
      const idx = expenses.findIndex(e => e.id === editingExpenseId);
      if (idx !== -1) expenses[idx] = { ...expenses[idx], ...payload };
    }
    showToast('Expense updated successfully.');
  } else {
    // CREATE
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(1500)
      });
      if (res.ok) {
        const created = await res.json();
        expenses.unshift(created);
      } else {
        const newId = Date.now();
        expenses.unshift({ id: newId, ...payload });
      }
    } catch {
      const newId = Date.now();
      expenses.unshift({ id: newId, ...payload });
    }
    showToast('Expense added successfully.');
  }

  // Sort again
  expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  closeExpenseModal();
  refreshDashboard();
  if (activeTab === 'transactions') applyTxFilters();
  if (activeTab === 'analytics') renderAnalyticsPage();
};

/**
 * 10. Delete Dialog Controller
 */
window.promptDeleteDialog = function(id) {
  expenseIdToDelete = id;
  const modal = document.getElementById('deleteModalOverlay');
  if (modal) modal.classList.add('active');
};

window.closeDeleteDialog = function() {
  const modal = document.getElementById('deleteModalOverlay');
  if (modal) modal.classList.remove('active');
  expenseIdToDelete = null;
};

window.confirmDeleteExpense = async function() {
  if (!expenseIdToDelete) return;

  const id = expenseIdToDelete;
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) {
      expenses = expenses.filter(e => e.id !== id);
    } else {
      expenses = expenses.filter(e => e.id !== id);
    }
  } catch {
    expenses = expenses.filter(e => e.id !== id);
  }

  closeDeleteDialog();
  refreshDashboard();
  if (activeTab === 'transactions') applyTxFilters();
  if (activeTab === 'analytics') renderAnalyticsPage();
  showToast('Expense deleted successfully.');
};

/**
 * 11. Budget Modal Controller
 */
window.openBudgetModal = function() {
  const modal = document.getElementById('budgetModalOverlay');
  const input = document.getElementById('budgetInput');
  if (modal && input) {
    input.value = monthlyBudget;
    modal.classList.add('active');
    setTimeout(() => input.focus(), 50);
  }
};

window.closeBudgetModal = function() {
  const modal = document.getElementById('budgetModalOverlay');
  if (modal) modal.classList.remove('active');
};

/**
 * 12. Toast Notifications
 */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-teal';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/**
 * Utility: HTML Escape
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 13. Profile & Account Settings Controller
 */
const DEFAULT_PROFILE = {
  name: "Likhitha Puli",
  email: "likhithapuli2006@gmail.com",
  currency: "INR",
  currencySymbol: "₹",
  defaultPayment: "UPI",
  memberSince: "Sep 2026",
  plan: "Pro Plan"
};

function getUserProfile() {
  try {
    const stored = localStorage.getItem('finora_user_profile');
    if (stored) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
    }
  } catch (e) {}
  return { ...DEFAULT_PROFILE };
}

function saveUserProfile(profile) {
  try {
    localStorage.setItem('finora_user_profile', JSON.stringify(profile));
  } catch (e) {}
}

function getInitials(name) {
  if (!name) return 'LP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function updateCurrencyDisplays() {
  document.querySelectorAll('.input-prefix').forEach(el => {
    el.textContent = currentCurrencySymbol;
  });
  const budgetError = document.getElementById('budgetInputError');
  if (budgetError) {
    budgetError.textContent = `Please enter a budget amount of at least ${currentCurrencySymbol}100.`;
  }
}

window.openProfileModal = function() {
  const modal = document.getElementById('profileModalOverlay');
  if (!modal) return;

  const profile = getUserProfile();
  
  // Populate form inputs
  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  const currencySelect = document.getElementById('profileCurrencySelect');
  const paymentSelect = document.getElementById('profilePaymentSelect');

  if (nameInput) nameInput.value = profile.name;
  if (emailInput) emailInput.value = profile.email;
  if (currencySelect) {
    currencySelect.value = `${profile.currency}|${profile.currencySymbol}`;
  }
  if (paymentSelect) paymentSelect.value = profile.defaultPayment || 'UPI';

  // Populate visual badges & stats in modal
  const avatar = document.getElementById('modalProfileAvatar');
  const nameDisplay = document.getElementById('modalProfileDisplayName');
  const emailDisplay = document.getElementById('modalProfileDisplayEmail');
  const expensesCount = document.getElementById('modalProfileExpensesCount');
  const budgetValue = document.getElementById('modalProfileBudgetValue');
  const memberSince = document.getElementById('modalProfileMemberSince');

  if (avatar) avatar.textContent = getInitials(profile.name);
  if (nameDisplay) nameDisplay.textContent = profile.name;
  if (emailDisplay) emailDisplay.textContent = profile.email;
  if (expensesCount) expensesCount.textContent = expenses.length;
  if (budgetValue) budgetValue.textContent = formatCurrency(monthlyBudget);
  if (memberSince) memberSince.textContent = profile.memberSince || 'Sep 2026';

  modal.classList.add('active');
  if (nameInput) setTimeout(() => nameInput.focus(), 60);
};

window.closeProfileModal = function() {
  const modal = document.getElementById('profileModalOverlay');
  if (modal) modal.classList.remove('active');
};

window.handleProfileSubmit = function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('profileNameInput');
  const emailInput = document.getElementById('profileEmailInput');
  const currencySelect = document.getElementById('profileCurrencySelect');
  const paymentSelect = document.getElementById('profilePaymentSelect');

  const name = nameInput ? nameInput.value.trim() : 'Likhitha Puli';
  const email = emailInput ? emailInput.value.trim() : 'likhithapuli2006@gmail.com';
  
  let currency = 'INR';
  let symbol = '₹';
  if (currencySelect && currencySelect.value) {
    const parts = currencySelect.value.split('|');
    currency = parts[0] || 'INR';
    symbol = parts[1] || '₹';
  }

  const defaultPayment = paymentSelect ? paymentSelect.value : 'UPI';

  const profile = {
    ...getUserProfile(),
    name,
    email,
    currency,
    currencySymbol: symbol,
    defaultPayment
  };

  saveUserProfile(profile);

  // Update active runtime variables
  currentCurrency = currency;
  currentCurrencySymbol = symbol;
  updateCurrencyDisplays();

  // If default payment changed, prefill expense modal
  const modalPayment = document.getElementById('modalPayment');
  if (modalPayment) modalPayment.value = defaultPayment;

  // Refresh user greeting and dynamic calculations
  initDateAndGreeting();
  refreshDashboard();
  if (activeTab === 'transactions') applyTxFilters();
  if (activeTab === 'analytics') renderAnalyticsPage();

  closeProfileModal();
  showToast('Profile & preferences updated successfully.');
};

/**
 * Export Expenses as CSV
 */
window.exportExpensesCSV = function() {
  if (!expenses || expenses.length === 0) {
    showToast('No expenses to export.');
    return;
  }

  const headers = ['ID', 'Description', 'Category', 'Amount', 'Payment Method', 'Date'];
  const rows = expenses.map(exp => [
    exp.id,
    `"${(exp.description || '').replace(/"/g, '""')}"`,
    `"${(exp.category || '').replace(/"/g, '""')}"`,
    exp.amount,
    `"${(exp.paymentMethod || '').replace(/"/g, '""')}"`,
    exp.date
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finora_expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Exported ${expenses.length} expenses to CSV.`);
};

/**
 * Reset Demo Data
 */
window.resetSampleData = function() {
  expenses = JSON.parse(JSON.stringify(fallbackExpenses));
  refreshDashboard();
  if (activeTab === 'transactions') applyTxFilters();
  if (activeTab === 'analytics') renderAnalyticsPage();
  
  const countEl = document.getElementById('modalProfileExpensesCount');
  if (countEl) countEl.textContent = expenses.length;
  
  showToast('Sample expenses restored successfully.');
};
