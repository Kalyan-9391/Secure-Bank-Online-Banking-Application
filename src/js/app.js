// ==========================================================================
// BANKSFERE CLIENT-SIDE APPLICATION LOGIC & STATE MANAGEMENT
// ==========================================================================

// Global Application State
const state = {
  currentUser: null,
  role: null, // "CUSTOMER" or "ADMIN"
  balanceHidden: false,
  accounts: [
    { accountId: "ACC4521", name: "Savings Account", number: "100045218901", balance: 120450.00 },
    { accountId: "ACC7890", name: "Current Account", number: "200078904321", balance: 40000.00 }
  ],
  beneficiaries: [
    { id: "BEN101", name: "Rahul Sharma", number: "100012345678", bank: "DemoBank", ifsc: "DEMO0001234", status: "Active" },
    { id: "BEN102", name: "Priya Patel", number: "100098765432", bank: "HDFC Bank", ifsc: "HDFC0009876", status: "Active" }
  ],
  transactions: [
    { id: "TXN9801", ref: "REF892019201", date: "2026-09-10 06:30", acc: "ACC4521", type: "Debit", cat: "Shopping", desc: "Amazon India Shopping", amount: 1200.00, status: "Success" },
    { id: "TXN9802", ref: "REF892019202", date: "2026-09-09 09:00", acc: "ACC4521", type: "Credit", cat: "Salary", desc: "Tech Corp Salary Credit", amount: 35000.00, status: "Success" },
    { id: "TXN9803", ref: "REF892019203", date: "2026-09-08 14:15", acc: "ACC4521", type: "Debit", cat: "Bills", desc: "State Electricity Board", amount: 2300.00, status: "Success" },
    { id: "TXN9804", ref: "REF892019204", date: "2026-09-07 18:45", acc: "ACC7890", type: "Credit", cat: "Transfer", desc: "Internal Deposit", amount: 5000.00, status: "Success" }
  ],
  customersAdmin: [
    { id: "CUST1001", name: "Kalyan Vance", email: "kalyan@banksphere.com", phone: "+91 9876543210", status: "Active" },
    { id: "CUST1002", name: "Rahul Sharma", email: "rahul@demobank.com", phone: "+91 9123456789", status: "Active" },
    { id: "CUST1003", name: "Priya Patel", email: "priya@demobank.com", phone: "+91 9988776655", status: "Active" }
  ],
  pendingTransfer: null,
  chartInstance: null
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  setupEventListeners();
  renderBeneficiaries();
});

// GLOBAL NAVIGATION & TAB SWITCHER
window.switchTab = function(tabId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));

  const targetSec = document.getElementById(tabId);
  if (targetSec) targetSec.classList.add('active');

  const activeBtn = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'dashboard-tab') {
    renderDashboard();
  } else if (tabId === 'statements-tab') {
    renderFullStatementTable();
  } else if (tabId === 'admin-tab') {
    renderAdminTable();
  }
};

// EVENT LISTENERS SETUP
function setupEventListeners() {
  // Navigation Bar Links
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Auth Tabs (Login / Register / Admin)
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const tabAdminBtn = document.getElementById('tab-admin-login-btn');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');

  tabLoginBtn?.addEventListener('click', () => {
    tabLoginBtn.classList.add('active');
    tabRegisterBtn.classList.remove('active');
    tabAdminBtn.classList.remove('active');
    formLogin.style.display = 'flex';
    formRegister.style.display = 'none';
    document.getElementById('login-username').value = 'kalyan@banksphere.com';
    document.getElementById('login-password').value = 'Password123!';
  });

  tabRegisterBtn?.addEventListener('click', () => {
    tabRegisterBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    tabAdminBtn.classList.remove('active');
    formLogin.style.display = 'none';
    formRegister.style.display = 'flex';
  });

  tabAdminBtn?.addEventListener('click', () => {
    tabAdminBtn.classList.add('active');
    tabLoginBtn.classList.remove('active');
    tabRegisterBtn.classList.remove('active');
    formLogin.style.display = 'flex';
    formRegister.style.display = 'none';
    document.getElementById('login-username').value = 'admin';
    document.getElementById('login-password').value = 'Admin@123';
  });

  // Password Visibility Toggle
  document.getElementById('toggle-login-pwd')?.addEventListener('click', () => {
    const pwdInput = document.getElementById('login-password');
    pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
  });

  // Login Form Submission
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorAlert = document.getElementById('login-error-alert');

    try {
      // Direct API Call or In-Memory Handler
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const resData = await response.json();

      if (!response.ok) {
        errorAlert.textContent = resData.message || "Invalid credentials";
        errorAlert.style.display = 'block';
        showToast(resData.message || "Login failed", "error");
        return;
      }

      errorAlert.style.display = 'none';
      state.currentUser = resData.user;
      state.role = resData.role;

      // Update UI for logged-in user
      document.getElementById('nav-menu').style.display = 'flex';
      document.getElementById('nav-user-area').style.display = 'flex';
      document.getElementById('nav-user-name').textContent = resData.user.name;
      document.getElementById('nav-user-role').textContent = resData.role === 'ADMIN' ? 'Administrator' : 'Premier Customer';

      if (resData.role === 'ADMIN') {
        document.getElementById('nav-admin').style.display = 'flex';
        switchTab('admin-tab');
        showToast("Logged in as System Administrator", "success");
      } else {
        document.getElementById('nav-admin').style.display = 'none';
        switchTab('dashboard-tab');
        showToast(`Welcome back, ${resData.user.name}!`, "success");
      }
    } catch (err) {
      // Local Fallback if server is not active
      if (username === 'admin' && password === 'Admin@123') {
        state.currentUser = { id: "ADMIN001", name: "System Administrator" };
        state.role = "ADMIN";
        document.getElementById('nav-menu').style.display = 'flex';
        document.getElementById('nav-user-area').style.display = 'flex';
        switchTab('admin-tab');
      } else {
        state.currentUser = { id: "CUST1001", name: "Kalyan Vance" };
        state.role = "CUSTOMER";
        document.getElementById('nav-menu').style.display = 'flex';
        document.getElementById('nav-user-area').style.display = 'flex';
        switchTab('dashboard-tab');
      }
      showToast("Signed in successfully (Offline Mode)", "success");
    }
  });

  // Logout Button
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    state.currentUser = null;
    state.role = null;
    document.getElementById('nav-menu').style.display = 'none';
    document.getElementById('nav-user-area').style.display = 'none';
    switchTab('auth-view');
    showToast("Logged out successfully", "success");
  });

  // Balance Privacy Toggle
  document.getElementById('toggle-balance-privacy')?.addEventListener('click', () => {
    state.balanceHidden = !state.balanceHidden;
    renderDashboard();
  });

  // Transfer Form & Review Wizard
  const formTransfer = document.getElementById('form-transfer');
  formTransfer?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fromAcc = document.getElementById('transfer-from').value;
    const toAcc = document.getElementById('transfer-to').value;
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    const desc = document.getElementById('transfer-desc').value.trim();
    const errAlert = document.getElementById('transfer-error-alert');

    // Business Rule 1: Amount > 0
    if (isNaN(amount) || amount <= 0) {
      errAlert.textContent = "Error: Transfer amount must be greater than ₹0";
      errAlert.style.display = 'block';
      return;
    }

    // Business Rule 2: Limit <= ₹50,000
    if (amount > 50000) {
      errAlert.textContent = "Error: Single transfer limit of ₹50,000 exceeded. [QA Business Rule]";
      errAlert.style.display = 'block';
      return;
    }

    // Business Rule 3: Source != Destination
    const sourceObj = state.accounts.find(a => a.accountId === fromAcc);
    if (sourceObj && (toAcc === sourceObj.accountId || toAcc === sourceObj.number)) {
      errAlert.textContent = "Error: Source account and destination account cannot be the same. [QA Business Rule]";
      errAlert.style.display = 'block';
      return;
    }

    // Business Rule 4: Balance Check (Negative Test Trigger)
    if (sourceObj && sourceObj.balance < amount) {
      errAlert.textContent = `Error: Insufficient funds. Available balance: ₹${sourceObj.balance.toLocaleString('en-IN')}`;
      errAlert.style.display = 'block';
      return;
    }

    errAlert.style.display = 'none';
    state.pendingTransfer = { fromAcc, toAcc, amount, desc };

    // Open OTP Modal
    document.getElementById('modal-otp').style.display = 'flex';
  });

  // OTP Verification Submission
  document.getElementById('btn-confirm-otp')?.addEventListener('click', async () => {
    const otpVal = document.getElementById('otp-input').value.trim();
    const otpErr = document.getElementById('otp-error-alert');

    if (otpVal !== "123456") {
      otpErr.textContent = "Invalid OTP code. Use demo code 123456";
      otpErr.style.display = 'block';
      return;
    }

    otpErr.style.display = 'none';
    document.getElementById('modal-otp').style.display = 'none';

    if (!state.pendingTransfer) return;

    const { fromAcc, toAcc, amount, desc } = state.pendingTransfer;
    const sourceObj = state.accounts.find(a => a.accountId === fromAcc);

    if (sourceObj) {
      sourceObj.balance -= amount;
    }

    const newTx = {
      id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
      ref: `REF${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      acc: fromAcc,
      type: "Debit",
      cat: "Transfer",
      desc: desc || `Transfer to ${toAcc}`,
      amount: amount,
      status: "Success"
    };

    state.transactions.unshift(newTx);
    state.pendingTransfer = null;

    showToast(`Transfer of ₹${amount.toLocaleString('en-IN')} successful!`, "success");
    switchTab('dashboard-tab');
  });

  document.getElementById('close-modal-otp')?.addEventListener('click', () => {
    document.getElementById('modal-otp').style.display = 'none';
  });
  document.getElementById('btn-cancel-otp')?.addEventListener('click', () => {
    document.getElementById('modal-otp').style.display = 'none';
  });

  // Add Beneficiary Modal & Form
  document.getElementById('btn-open-add-ben-modal')?.addEventListener('click', () => {
    document.getElementById('modal-add-ben').style.display = 'flex';
  });
  document.getElementById('close-modal-add-ben')?.addEventListener('click', () => {
    document.getElementById('modal-add-ben').style.display = 'none';
  });
  document.getElementById('btn-cancel-add-ben')?.addEventListener('click', () => {
    document.getElementById('modal-add-ben').style.display = 'none';
  });

  document.getElementById('form-add-ben')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('ben-name').value;
    const number = document.getElementById('ben-acc').value;
    const bank = document.getElementById('ben-bank').value;
    const ifsc = document.getElementById('ben-ifsc').value;

    state.beneficiaries.push({
      id: `BEN${Date.now()}`,
      name, number, bank, ifsc, status: "Active"
    });

    renderBeneficiaries();
    document.getElementById('modal-add-ben').style.display = 'none';
    showToast(`Beneficiary ${name} added successfully`, "success");
  });

  // Bill Payment Form
  document.getElementById('form-bill-pay')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const biller = document.getElementById('biller-name').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const sourceObj = state.accounts[0];

    if (sourceObj.balance < amount) {
      showToast("Insufficient balance for bill payment", "error");
      return;
    }

    sourceObj.balance -= amount;
    state.transactions.unshift({
      id: `BILL${Math.floor(1000 + Math.random() * 9000)}`,
      ref: `REF${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      acc: sourceObj.accountId,
      type: "Debit",
      cat: "Bills",
      desc: `Bill Payment: ${biller}`,
      amount: amount,
      status: "Success"
    });

    showToast(`Paid ₹${amount} to ${biller} successfully`, "success");
    switchTab('dashboard-tab');
  });

  // Export CSV Statement
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    let csvContent = "data:text/csv;charset=utf-8,Transaction ID,Reference,Date,Account,Type,Category,Description,Amount,Status\n";
    state.transactions.forEach(t => {
      csvContent += `${t.id},${t.ref},${t.date},${t.acc},${t.type},${t.cat},"${t.desc}",${t.amount},${t.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BankSphere_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Notifications Drawer Toggle
  document.getElementById('notif-btn')?.addEventListener('click', () => {
    document.getElementById('notif-drawer').classList.toggle('open');
  });
  document.getElementById('close-notif')?.addEventListener('click', () => {
    document.getElementById('notif-drawer').classList.remove('open');
  });
}

// DASHBOARD RENDERER
function renderDashboard() {
  const savAcc = state.accounts.find(a => a.accountId === "ACC4521");
  const currAcc = state.accounts.find(a => a.accountId === "ACC7890");

  const totalBal = savAcc.balance + currAcc.balance;

  if (state.balanceHidden) {
    document.getElementById('total-balance-display').textContent = '••••••••';
    document.getElementById('acc-4521-balance').textContent = '••••••••';
    document.getElementById('acc-7890-balance').textContent = '••••••••';
  } else {
    document.getElementById('total-balance-display').textContent = `₹${totalBal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('acc-4521-balance').textContent = `₹${savAcc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    document.getElementById('acc-7890-balance').textContent = `₹${currAcc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }

  renderRecentTransactions();
  initCashflowChart();
}

// RECENT TRANSACTIONS RENDERER
function renderRecentTransactions() {
  const tbody = document.getElementById('recent-tx-tbody');
  if (!tbody) return;

  const searchVal = document.getElementById('tx-search-input')?.value.toLowerCase() || '';
  const filterType = document.getElementById('tx-filter-type')?.value || 'ALL';

  const filtered = state.transactions.filter(t => {
    const matchesSearch = t.desc.toLowerCase().includes(searchVal) || t.cat.toLowerCase().includes(searchVal);
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  tbody.innerHTML = filtered.slice(0, 5).map(t => `
    <tr>
      <td>${t.date}</td>
      <td><strong>${t.desc}</strong></td>
      <td><span class="badge-demo">${t.cat}</span></td>
      <td class="tx-amount ${t.type.toLowerCase()}">${t.type === 'Credit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-badge success">${t.status}</span></td>
    </tr>
  `).join('');
}

// FULL STATEMENT TABLE RENDERER
function renderFullStatementTable() {
  const tbody = document.getElementById('full-stmt-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.transactions.map(t => `
    <tr>
      <td><code>${t.ref}</code></td>
      <td>${t.date}</td>
      <td>${t.acc}</td>
      <td><span class="tx-amount ${t.type.toLowerCase()}">${t.type}</span></td>
      <td>${t.cat}</td>
      <td>${t.desc}</td>
      <td>₹${t.amount.toLocaleString('en-IN')}</td>
      <td><span class="status-badge success">${t.status}</span></td>
    </tr>
  `).join('');
}

// BENEFICIARIES RENDERER
function renderBeneficiaries() {
  const container = document.getElementById('beneficiaries-container');
  if (!container) return;

  container.innerHTML = state.beneficiaries.map(b => `
    <div class="ben-card glass-panel">
      <div style="display: flex; gap: 0.8rem; align-items: center;">
        <div class="ben-avatar">${b.name.charAt(0)}</div>
        <div class="ben-info">
          <p class="ben-name">${b.name}</p>
          <p class="ben-acc">${b.number}</p>
          <p class="ben-bank">${b.bank} (${b.ifsc})</p>
        </div>
      </div>
      <button class="btn-logout" title="Delete Beneficiary" onclick="deleteBeneficiary('${b.id}')"><i data-lucide="trash-2"></i></button>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

window.deleteBeneficiary = function(id) {
  state.beneficiaries = state.beneficiaries.filter(b => b.id !== id);
  renderBeneficiaries();
  showToast("Beneficiary deleted", "success");
};

// ADMIN TABLE RENDERER
function renderAdminTable() {
  const tbody = document.getElementById('admin-customer-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.customersAdmin.map(c => `
    <tr>
      <td><code>${c.id}</code></td>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><span class="status-badge ${c.status === 'Active' ? 'success' : 'pending'}">${c.status}</span></td>
      <td>
        <button class="btn-secondary" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;" onclick="toggleCustomerStatus('${c.id}')">
          ${c.status === 'Active' ? 'Suspend' : 'Activate'}
        </button>
      </td>
    </tr>
  `).join('');
}

window.toggleCustomerStatus = function(id) {
  const cust = state.customersAdmin.find(c => c.id === id);
  if (cust) {
    cust.status = cust.status === 'Active' ? 'Suspended' : 'Active';
    renderAdminTable();
    showToast(`Customer ${cust.name} status changed to ${cust.status}`, "success");
  }
};

// CHART.JS CASHFLOW INTEGRATION
function initCashflowChart() {
  const ctx = document.getElementById('cashflowChart')?.getContext('2d');
  if (!ctx) return;

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

  state.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Credits / Income (₹)',
          data: [15000, 35000, 10000, 20000],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderRadius: 6
        },
        {
          label: 'Debits / Expenses (₹)',
          data: [8000, 12000, 4500, 9500],
          backgroundColor: 'rgba(244, 63, 94, 0.7)',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8' } }
      },
      scales: {
        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

// TOAST SYSTEM
function showToast(msg, type = "info") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}
