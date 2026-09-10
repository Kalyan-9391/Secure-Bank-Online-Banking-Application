# BankSphere Online Banking Application - Master Test Plan

| Project Name | BankSphere - Secure Online Banking Application |
| :--- | :--- |
| **Document Version** | 1.0.0 |
| **Author** | Kalyan (Lead QA Engineer) |
| **Target Application** | BankSphere Web Application (v1.0) |
| **Testing Scope** | Manual Functional, API, Database, UI Automation, Regression & Security Validation |

---

## 1. Introduction & Objectives
The objective of this Master Test Plan is to define the strategy, scope, environment, resources, and deliverables for end-to-end Quality Assurance testing of **BankSphere**, a modern retail banking web application.

### Key Quality Objectives
- Ensure 100% verification of core business workflows (User Authentication, Fund Transfers, Beneficiary Management, Bill Payments).
- Validate all negative security rules (Insufficient balance rejection, daily transfer limit capping, invalid OTP error handling, account lockout after 3 failed login attempts).
- Verify REST API data contracts, status codes, and database balance reconciliation.
- Maintain an automated regression test suite using Selenium WebDriver + TestNG + Java (POM pattern).

---

## 2. Scope of Testing

### In-Scope
1. **Customer Authentication Module**:
   - Customer Login (valid/invalid credentials).
   - Password masking & show/hide toggle.
   - Account lockout after 3 consecutive failed login attempts.
   - Registration onboarding.
   - Session logout & notifications drawer.
2. **Dashboard & Account Management**:
   - Total Balance & Account balance accuracy.
   - Balance privacy eye toggle (Show/Hide).
   - Account overview cards (Savings XXXX4521, Current XXXX7890).
   - Interactive Cashflow chart rendering.
3. **Fund Transfers Module**:
   - Intra-bank & Inter-bank transfers.
   - Business rule validations (`Amount > 0`, `Amount <= Balance`, `Amount <= ₹50,000`, `Source != Destination`).
   - OTP verification modal (`123456`).
   - Dynamic balance updates & transaction ledger entry generation.
4. **Beneficiaries Management**:
   - Add new beneficiary, Search, Delete beneficiary.
   - Duplicate account validation.
5. **Bill Payments & Statements**:
   - Category payments (Electricity, Water, Mobile, Internet).
   - Filters by date, account type, credit/debit.
   - CSV statement export file generation.
6. **Admin Portal**:
   - Admin Login (`admin` / `Admin@123`).
   - Customer Directory search & status toggle (Active/Suspended).
   - System metrics & operational status checks.

### Out-of-Scope
- Real SMS gateway integration (simulated via 6-digit OTP `123456`).
- Integration with third-party real banking payment gateways (SWIFT/NPCI live nodes).

---

## 3. Testing Strategy & Methodology

```text
[ Requirement Analysis ] -> [ Test Scenario Design ] -> [ Manual Test Execution ]
                                                                 │
[ CI Regression Pipeline ] <- [ Selenium Automation ] <- [ API & DB Verification ]
```

### Manual Testing
- Execution of positive, negative, boundary value, and equivalence partitioning test cases.
- Exploratory testing for UI responsiveness across Desktop (1920x1080), Tablet (768x1024), and Mobile (375x812).

### API Testing (Postman)
- Functional testing of HTTP REST endpoints (`POST /api/auth/login`, `POST /api/transfers`, `GET /api/accounts`, `POST /api/beneficiaries`).
- Validation of HTTP Status Codes (200, 201, 400, 401, 403, 404), response payloads, JSON schemas, and response latency.

### Database Testing (SQL)
- Direct verification against MySQL/SQLite tables (`customers`, `accounts`, `transactions`, `beneficiaries`).
- Verification of ACID properties during transfers and balance updates.

### UI Automation (Selenium + TestNG)
- Data-driven testing framework using Java, Maven, Page Object Model (POM), WebDriverWait, and Extent Reports.

---

## 4. Entry & Exit Criteria

### Entry Criteria
- Application build deployed cleanly without server boot errors.
- Test data seeded (Default accounts: Savings `ACC4521` balance ₹1,20,450.00, Current `ACC7890` balance ₹40,000.00).
- Approved Test Plan and Test Cases available.

### Exit Criteria
- 100% of Critical and High-priority test cases executed.
- Zero open Critical / Blocker defects.
- All automated regression test scripts executing with >= 95% pass rate.
- Test Summary Report generated and signed off.

---

## 5. Defect Management Process
- Defects logged with Severity (Blocker, Critical, Major, Minor) and Priority (High, Medium, Low).
- Steps to reproduce, expected vs actual result, screenshots, and logs documented.
