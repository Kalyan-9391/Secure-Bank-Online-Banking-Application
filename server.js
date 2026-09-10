import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// In-Memory Database for Demo & Testing
let db = {
  customers: [
    {
      id: "CUST1001",
      name: "Kalyan Vance",
      email: "kalyan@banksphere.com",
      phone: "+91 9876543210",
      status: "Active",
      password: "Password123!",
      failedLogins: 0,
      locked: false
    },
    {
      id: "CUST1002",
      name: "Rahul Sharma",
      email: "rahul@demobank.com",
      phone: "+91 9123456789",
      status: "Active",
      password: "Password123!",
      failedLogins: 0,
      locked: false
    },
    {
      id: "CUST1003",
      name: "Priya Patel",
      email: "priya@demobank.com",
      phone: "+91 9988776655",
      status: "Active",
      password: "Password123!",
      failedLogins: 0,
      locked: false
    }
  ],
  accounts: [
    {
      accountId: "ACC4521",
      customerId: "CUST1001",
      accountNumber: "100045218901",
      accountType: "Savings Account",
      balance: 120450.00,
      currency: "INR",
      status: "Active"
    },
    {
      accountId: "ACC7890",
      customerId: "CUST1001",
      accountNumber: "200078904321",
      accountType: "Current Account",
      balance: 40000.00,
      currency: "INR",
      status: "Active"
    },
    {
      accountId: "ACC1234",
      customerId: "CUST1002",
      accountNumber: "100012345678",
      accountType: "Savings Account",
      balance: 85000.00,
      currency: "INR",
      status: "Active"
    }
  ],
  beneficiaries: [
    {
      id: "BEN101",
      customerId: "CUST1001",
      name: "Rahul Sharma",
      accountNumber: "100012345678",
      bankName: "DemoBank",
      ifscCode: "DEMO0001234",
      status: "Active"
    },
    {
      id: "BEN102",
      customerId: "CUST1001",
      name: "Priya Patel",
      accountNumber: "100098765432",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0009876",
      status: "Active"
    }
  ],
  transactions: [
    {
      id: "TXN9801",
      accountId: "ACC4521",
      type: "Debit",
      category: "Shopping",
      description: "Amazon India Shopping",
      amount: 1200.00,
      date: "2026-09-10T06:30:00Z",
      status: "Success",
      referenceNumber: "REF892019201"
    },
    {
      id: "TXN9802",
      accountId: "ACC4521",
      type: "Credit",
      category: "Salary",
      description: "Tech Corp Salary Credit",
      amount: 35000.00,
      date: "2026-09-09T09:00:00Z",
      status: "Success",
      referenceNumber: "REF892019202"
    },
    {
      id: "TXN9803",
      accountId: "ACC4521",
      type: "Debit",
      category: "Bills",
      description: "State Electricity Board",
      amount: 2300.00,
      date: "2026-09-08T14:15:00Z",
      status: "Success",
      referenceNumber: "REF892019203"
    }
  ],
  auditLogs: []
};

// 1. Authentication APIs
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ status: "Error", message: "Username and password are required" });
  }

  // Admin login check
  if (username === "admin" && password === "Admin@123") {
    return res.status(200).json({
      status: "Success",
      role: "ADMIN",
      token: "jwt_admin_secret_token_889900",
      user: { id: "ADMIN001", name: "System Administrator", email: "admin@banksphere.com" }
    });
  }

  const customer = db.customers.find(c => c.email.toLowerCase() === username.toLowerCase() || c.id === username);
  if (!customer) {
    return res.status(401).json({ status: "Error", message: "Invalid customer credentials" });
  }

  if (customer.locked) {
    return res.status(403).json({ status: "Error", message: "Account locked due to multiple failed login attempts. Contact support." });
  }

  if (customer.password !== password) {
    customer.failedLogins += 1;
    if (customer.failedLogins >= 3) {
      customer.locked = true;
      customer.status = "Locked";
      return res.status(403).json({ status: "Error", message: "Account temporarily locked after 3 failed login attempts" });
    }
    return res.status(401).json({ status: "Error", message: `Invalid password. ${3 - customer.failedLogins} attempts remaining` });
  }

  // Reset failed logins on success
  customer.failedLogins = 0;

  return res.status(200).json({
    status: "Success",
    role: "CUSTOMER",
    token: "jwt_customer_secret_token_123456",
    user: {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ status: "Error", message: "Name, email, and password are required" });
  }

  const newId = `CUST${1000 + db.customers.length + 1}`;
  const newAccId = `ACC${4000 + db.accounts.length + 1}`;
  const newAccNo = `1000${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newCustomer = {
    id: newId,
    name,
    email,
    phone: phone || "+91 9000000000",
    status: "Active",
    password,
    failedLogins: 0,
    locked: false
  };

  const newAccount = {
    accountId: newAccId,
    customerId: newId,
    accountNumber: newAccNo,
    accountType: "Savings Account",
    balance: 10000.00,
    currency: "INR",
    status: "Active"
  };

  db.customers.push(newCustomer);
  db.accounts.push(newAccount);

  res.status(201).json({
    status: "Success",
    message: "Registration successful. Welcome to BankSphere!",
    user: newCustomer,
    account: newAccount
  });
});

// 2. Customer & Accounts APIs
app.get('/api/customers', (req, res) => {
  res.json({ status: "Success", data: db.customers });
});

app.patch('/api/customers/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const customer = db.customers.find(c => c.id === id);
  if (!customer) return res.status(404).json({ status: "Error", message: "Customer not found" });

  customer.status = status;
  if (status === "Active") customer.locked = false;
  res.json({ status: "Success", message: `Customer status updated to ${status}`, customer });
});

app.get('/api/accounts/:customerId', (req, res) => {
  const userAccounts = db.accounts.filter(a => a.customerId === req.params.customerId);
  res.json({ status: "Success", data: userAccounts });
});

app.get('/api/accounts/:accountId/balance', (req, res) => {
  const acc = db.accounts.find(a => a.accountId === req.params.accountId || a.accountNumber === req.params.accountId);
  if (!acc) return res.status(404).json({ status: "Error", message: "Account not found" });
  res.json({ status: "Success", accountId: acc.accountId, balance: acc.balance, currency: acc.currency });
});

// 3. Transactions & Transfers APIs
app.get('/api/transactions/:accountId', (req, res) => {
  const txns = db.transactions.filter(t => t.accountId === req.params.accountId);
  res.json({ status: "Success", data: txns });
});

app.post('/api/transfers', (req, res) => {
  const { fromAccount, toAccount, amount, description, otp } = req.body;

  if (!fromAccount || !toAccount || !amount) {
    return res.status(400).json({ status: "Error", message: "Missing required transfer fields" });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ status: "Error", message: "Transfer amount must be greater than zero" });
  }

  if (numAmount > 50000) {
    return res.status(400).json({ status: "Error", message: "Transfer exceeds maximum daily limit of ₹50,000" });
  }

  if (fromAccount === toAccount) {
    return res.status(400).json({ status: "Error", message: "Source account and beneficiary account cannot be the same" });
  }

  if (otp !== "123456") {
    return res.status(401).json({ status: "Error", message: "Invalid OTP security verification code. Use demo code 123456." });
  }

  const sourceAcc = db.accounts.find(a => a.accountId === fromAccount || a.accountNumber === fromAccount);
  if (!sourceAcc) {
    return res.status(404).json({ status: "Error", message: "Source account not found" });
  }

  if (sourceAcc.balance < numAmount) {
    return res.status(400).json({ status: "Error", message: `Insufficient balance. Available balance: ₹${sourceAcc.balance.toLocaleString('en-IN')}` });
  }

  sourceAcc.balance -= numAmount;

  const targetAcc = db.accounts.find(a => a.accountId === toAccount || a.accountNumber === toAccount);
  if (targetAcc) {
    targetAcc.balance += numAmount;
  }

  const txnId = `TXN${Math.floor(1000 + Math.random() * 9000)}`;
  const refNo = `REF${Date.now()}`;

  const newTxn = {
    id: txnId,
    accountId: sourceAcc.accountId,
    type: "Debit",
    category: "Transfer",
    description: description || `Transfer to ${toAccount}`,
    amount: numAmount,
    date: new Date().toISOString(),
    status: "Success",
    referenceNumber: refNo
  };

  db.transactions.unshift(newTxn);

  res.status(200).json({
    status: "Success",
    message: "Money transfer completed successfully",
    referenceNumber: refNo,
    transaction: newTxn,
    newBalance: sourceAcc.balance
  });
});

// 4. Beneficiary APIs
app.get('/api/beneficiaries', (req, res) => {
  res.json({ status: "Success", data: db.beneficiaries });
});

app.post('/api/beneficiaries', (req, res) => {
  const { name, accountNumber, bankName, ifscCode } = req.body;
  if (!name || !accountNumber || !bankName) {
    return res.status(400).json({ status: "Error", message: "Name, Account Number and Bank Name are required" });
  }

  const newBen = {
    id: `BEN${100 + db.beneficiaries.length + 1}`,
    customerId: "CUST1001",
    name,
    accountNumber,
    bankName,
    ifscCode: ifscCode || "DEMO0009999",
    status: "Active"
  };

  db.beneficiaries.push(newBen);
  res.status(201).json({ status: "Success", message: "Beneficiary added successfully", beneficiary: newBen });
});

app.delete('/api/beneficiaries/:id', (req, res) => {
  db.beneficiaries = db.beneficiaries.filter(b => b.id !== req.params.id);
  res.json({ status: "Success", message: "Beneficiary deleted successfully" });
});

// 5. Bill Payments API
app.post('/api/bill-payments', (req, res) => {
  const { category, billerName, consumerId, amount, fromAccount } = req.body;
  if (!category || !billerName || !amount) {
    return res.status(400).json({ status: "Error", message: "Biller details and amount are required" });
  }

  const sourceAcc = db.accounts.find(a => a.accountId === fromAccount) || db.accounts[0];
  const numAmount = parseFloat(amount);

  if (sourceAcc.balance < numAmount) {
    return res.status(400).json({ status: "Error", message: "Insufficient funds for bill payment" });
  }

  sourceAcc.balance -= numAmount;

  const txnId = `BILL${Math.floor(1000 + Math.random() * 9000)}`;
  const refNo = `REF${Date.now()}`;

  const newTxn = {
    id: txnId,
    accountId: sourceAcc.accountId,
    type: "Debit",
    category: "Bill Payment",
    description: `${category}: ${billerName} (${consumerId || 'N/A'})`,
    amount: numAmount,
    date: new Date().toISOString(),
    status: "Success",
    referenceNumber: refNo
  };

  db.transactions.unshift(newTxn);

  res.status(200).json({
    status: "Success",
    message: `Bill payment of ₹${numAmount} to ${billerName} successful`,
    referenceNumber: refNo,
    newBalance: sourceAcc.balance
  });
});

app.listen(PORT, () => {
  console.log(`BankSphere Server running at http://localhost:${PORT}`);
});
