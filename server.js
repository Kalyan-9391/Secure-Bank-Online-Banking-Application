import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// In-Memory Database for Demo & QA Testing
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
    }
  ],
  beneficiaries: [
    { id: "BEN101", customerId: "CUST1001", name: "Rahul Sharma", accountNumber: "100012345678", bankName: "DemoBank", ifscCode: "DEMO0001234", status: "Active" },
    { id: "BEN102", customerId: "CUST1001", name: "Priya Patel", accountNumber: "100098765432", bankName: "HDFC Bank", ifscCode: "HDFC0009876", status: "Active" }
  ],
  transactions: [
    { id: "TXN9801", accountId: "ACC4521", type: "Debit", category: "Shopping", description: "Amazon India Shopping", amount: 1200.00, date: "2026-09-10T06:30:00Z", status: "Success", referenceNumber: "REF892019201" },
    { id: "TXN9802", accountId: "ACC4521", type: "Credit", category: "Salary", description: "Tech Corp Salary Credit", amount: 35000.00, date: "2026-09-09T09:00:00Z", status: "Success", referenceNumber: "REF892019202" },
    { id: "TXN9803", accountId: "ACC4521", type: "Debit", category: "Bills", description: "State Electricity Board", amount: 2300.00, date: "2026-09-08T14:15:00Z", status: "Success", referenceNumber: "REF892019203" }
  ]
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. REST API ENDPOINTS
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let data = {};
      try { if (body) data = JSON.parse(body); } catch (e) {}

      // POST /api/auth/login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { username, password } = data;
        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: "Username and password required" }));
        }

        if (username === "admin" && password === "Admin@123") {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            status: "Success", role: "ADMIN", token: "jwt_admin_secret_token_889900",
            user: { id: "ADMIN001", name: "System Administrator", email: "admin@banksphere.com" }
          }));
        }

        const customer = db.customers.find(c => c.email.toLowerCase() === username.toLowerCase() || c.id === username);
        if (!customer) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: "Invalid customer credentials" }));
        }

        if (customer.password !== password) {
          customer.failedLogins += 1;
          if (customer.failedLogins >= 3) {
            customer.status = "Locked";
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ status: "Error", message: "Account locked after 3 failed login attempts" }));
          }
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: `Invalid password. ${3 - customer.failedLogins} attempts remaining` }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          status: "Success", role: "CUSTOMER", token: "jwt_customer_123456", user: customer
        }));
      }

      // POST /api/transfers
      if (pathname === '/api/transfers' && req.method === 'POST') {
        const { fromAccount, toAccount, amount, description, otp } = data;
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: "Transfer amount must be greater than zero" }));
        }
        if (numAmount > 50000) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: "Transfer exceeds maximum daily limit of ₹50,000" }));
        }
        if (otp !== "123456") {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: "Invalid OTP security verification code. Use demo code 123456." }));
        }

        const sourceAcc = db.accounts.find(a => a.accountId === fromAccount);
        if (sourceAcc && sourceAcc.balance < numAmount) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ status: "Error", message: `Insufficient balance. Available: ₹${sourceAcc.balance}` }));
        }

        if (sourceAcc) sourceAcc.balance -= numAmount;

        const refNo = `REF${Date.now()}`;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: "Success", message: "Transfer completed successfully", referenceNumber: refNo }));
      }

      // Default API response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "Success", data: db }));
    });
    return;
  }

  // 2. STATIC FILE SERVING
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  
  // Normalize and prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`BankSphere Server active at http://localhost:${PORT}`);
});
