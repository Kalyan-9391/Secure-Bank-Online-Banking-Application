# BankSphere - Defect Reports & Bug Log

This document records realistic defects identified during QA test execution cycles, formatted in industry-standard Jira defect tracking template.

---

### BUG-001: Transfer allows amount greater than available balance when decimals are formatted
- **Defect ID**: `BUG-001`
- **Summary**: Fund transfer proceeds to OTP modal when amount entered has trailing space or decimal precision formatted unexpectedly.
- **Severity**: **Critical**
- **Priority**: **High**
- **Module**: Fund Transfer
- **Environment**: Chrome 122 / Windows 11 / QA Staging v1.0
- **Steps to Reproduce**:
  1. Login as customer (`kalyan@banksphere.com`).
  2. Navigate to Transfers tab.
  3. Select Savings Account `ACC4521` (Available balance: ₹1,20,450.00).
  4. Enter transfer amount `₹1,20,450.50` with decimal.
  5. Click Review Transfer.
- **Expected Result**: System should display "Insufficient balance" alert and reject the transfer.
- **Actual Result**: System allowed proceeding to OTP modal due to floating point string parsing rounding issue.
- **Status**: **RESOLVED** (Fixed in v1.0.1 via strict `parseFloat()` and exact balance comparison).

---

### BUG-002: Beneficiary list allows duplicate account numbers for same bank
- **Defect ID**: `BUG-002`
- **Summary**: User can add multiple beneficiaries with identical account numbers under different nicknames.
- **Severity**: **Major**
- **Priority**: **Medium**
- **Module**: Beneficiary Management
- **Environment**: Firefox 123 / Windows 11
- **Steps to Reproduce**:
  1. Navigate to Beneficiaries tab.
  2. Add new beneficiary with Account Number `100012345678`.
  3. Submit again with same Account Number `100012345678` and a different name.
- **Expected Result**: System should block duplicate addition with message "Beneficiary with this account number already exists".
- **Actual Result**: Both records added successfully.
- **Status**: **OPEN**

---

### BUG-003: Account Lockout banner remains visible after successful password reset
- **Defect ID**: `BUG-003`
- **Summary**: Error alert for locked account persists on login screen even after Admin unlocks customer status.
- **Severity**: **Medium**
- **Priority**: **Low**
- **Module**: Customer Authentication
- **Environment**: Edge 122 / Windows 11
- **Steps to Reproduce**:
  1. Fail login 3 times to lock customer `CUST1001`.
  2. Admin unlocks customer from Admin Portal.
  3. Customer attempts valid login on login tab.
- **Expected Result**: Customer logs in cleanly without residual error alerts.
- **Actual Result**: Red alert box from previous failed attempt remains rendered above form until manually dismissed.
- **Status**: **RESOLVED** (Form reset handler added on tab switch).

---

### BUG-004: Statement CSV export missing reference numbers for bill payments
- **Defect ID**: `BUG-004`
- **Summary**: Exported CSV file leaves `Reference Number` column empty for Utility Bill Payment transactions.
- **Severity**: **Minor**
- **Priority**: **Low**
- **Module**: Statements & Export
- **Steps to Reproduce**:
  1. Complete an Electricity bill payment.
  2. Go to Statements tab and click "Export CSV Statement".
  3. Open downloaded CSV.
- **Expected Result**: All debit rows should include unique `REF...` string.
- **Actual Result**: Bill payment rows display `undefined` in Reference column.
- **Status**: **RESOLVED** (Assigned `REF` timestamp generator to bill payments object).
