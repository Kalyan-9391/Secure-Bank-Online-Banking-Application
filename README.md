# 🏦 BankSphere - Next-Gen Secure Banking Application & QA Portfolio

[![Node.js & Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js)](http://localhost:3000)
[![Selenium](https://img.shields.io/badge/Automation-Selenium%20WebDriver-43B02A?style=for-the-badge&logo=selenium)](file:///automation)
[![TestNG](https://img.shields.io/badge/Testing-TestNG%20Framework-FF6F00?style=for-the-badge)](file:///automation/testng.xml)
[![Postman](https://img.shields.io/badge/API-Postman%20Collection-FF6C37?style=for-the-badge&logo=postman)](file:///api-testing)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions)](file:///.github/workflows/regression-tests.yml)

A state-of-the-art, feature-rich online banking web application and complete **End-to-End QA Automation Portfolio** designed for software testing engineers. Includes customer & admin web portals, business rule validations (OTP, balance capping, negative scenarios), REST APIs, SQL database schemas, manual testing artifacts, Postman collections, and a Java Selenium TestNG Page Object Model (POM) automation suite.

---

## 🚀 Key Features

### 👤 Customer Portal
* **Secure Authentication**: Customer login (`kalyan@banksphere.com` / `Password123!`), registration, password masking toggle, and auto-account lockout after 3 failed password attempts.
* **Interactive Dashboard**: Total balance sum, privacy eye toggle (`••••••••`), multi-account cards (Savings `XXXX4521` & Current `XXXX7890`), Chart.js monthly cashflow graph, and search/filter transaction ledger.
* **Fund Transfer Wizard**: Intra-bank and Inter-bank transfers with mandatory 6-digit OTP verification code (`123456`).
* **Utility Bill Payments**: Instant bill settlement for Electricity, Water, Mobile, and Broadband.
* **Beneficiaries Directory**: Add, search, and delete payees with instant account validation.
* **Statements & Export**: Account filters and 1-click CSV statement download.

### 🛡️ Admin Portal
* **Admin Login**: Dedicated administrator access (`admin` / `Admin@123`).
* **Customer Account Management**: Directory of registered customers with status badges (Active/Suspended/Locked) and 1-click status toggle.
* **System Operations Monitor**: System health status and global account metrics.

---

## 📁 Portfolio Directory Structure

```text
c:\Users\HP\OneDrive\Dokument\ONLINE BANK\
│
├── index.html                   # Primary Single-Page Application (SPA) layout
├── server.js                    # Express REST API backend server & in-memory database
├── package.json                 # Node dependencies and scripts
│
├── src/
│   ├── styles/main.css          # Glassmorphism dark theme CSS design system
│   └── js/app.js                # Dynamic client logic, state manager & API handlers
│
├── manual-testing/              # Comprehensive Manual QA Documentation
│   ├── Test-Plan.md             # Master Test Plan
│   ├── Test-Scenarios.md        # Feature Test Scenarios (TS_AUTH, TS_XFER, etc.)
│   ├── Test-Cases.md            # Detailed Test Cases with positive/negative steps
│   ├── Test-Cases.csv           # Exportable CSV Test Case Repository
│   ├── RTM.md                   # Requirements Traceability Matrix
│   ├── Defect-Reports.md        # Jira-style defect logs (BUG-001 to BUG-004)
│   └── Test-Summary-Report.md   # Final QA Execution Sign-Off Report
│
├── api-testing/                 # Postman & REST API Artifacts
│   ├── BankSphere_Postman_Collection.json # Postman Collection with assertions
│   └── API-Test-Documentation.md          # REST Endpoint documentation
│
├── database-testing/            # Relational DB Verification Artifacts
│   ├── schema.sql               # MySQL / MariaDB Relational DDL & Seed scripts
│   └── SQL-Queries.sql          # QA reconciliation and data integrity queries
│
├── automation/                  # Java Selenium TestNG Automation Framework
│   ├── pom.xml                  # Maven configuration (Selenium, TestNG, ExtentReports)
│   ├── testng.xml               # TestNG Regression Suite configuration
│   └── src/
│       ├── main/java/com/banksphere/pages/ (Page Object Model classes)
│       └── test/java/com/banksphere/tests/ (Automated test scripts)
│
└── .github/workflows/
    └── regression-tests.yml     # Automated GitHub Actions CI Regression Pipeline
```

---

## ⚡ Quick Start - Running the Application Locally

### Prerequisites
- Node.js (v16+)
- Java JDK 11+ & Maven (for running automation scripts)

### 1. Install Dependencies & Start Server
```bash
# Clone the repository
git clone https://github.com/Kalyan-9391/Secure-Bank-Online-Banking-Application.git
cd ONLINE\ BANK

# Install dependencies
npm install

# Start the application server
npm start
```

### 2. Access the Application
Open your browser and navigate to:
```text
http://localhost:3000
```

### 3. Quick Demo Credentials
- **Customer Login**: `kalyan@banksphere.com` / `Password123!`
- **Admin Portal**: `admin` / `Admin@123`
- **Simulated OTP Code**: `123456`

---

## 🧪 QA Business Rules & Negative Test Matrix

| Module | Business Rule / Constraint | Expected Behavior / QA Trigger |
| :--- | :--- | :--- |
| **Authentication** | 3 Failed Password Limit | Account locked with alert: `"Account temporarily locked after 3 failed login attempts"`. |
| **Transfer** | Amount > 0 | Transfer blocked if amount is `0` or negative. |
| **Transfer** | Amount <= Available Balance | Rejects transfer with alert: `"Insufficient balance. Available balance: ₹1,20,450"`. |
| **Transfer** | Daily Limit = ₹50,000 | Rejects transfer exceeding limit with alert: `"Transfer exceeds maximum daily limit of ₹50,000"`. |
| **Transfer** | Source Account != Beneficiary | Rejects transfer with alert: `"Source account and beneficiary account cannot be the same"`. |
| **Security** | 6-Digit OTP Validation | Transfer proceeds only when OTP `123456` is entered correctly. |

---

## 🤖 Running Automated Selenium Tests

To execute the Selenium TestNG automation suite headless locally:

```bash
cd automation
mvn clean test -DsuiteXmlFile=testng.xml
```

---

## 📬 Contact & Author
Developed & Tested by **Kalyan** (QA & Automation Software Engineer).
- **GitHub**: [Kalyan-9391](https://github.com/Kalyan-9391)
