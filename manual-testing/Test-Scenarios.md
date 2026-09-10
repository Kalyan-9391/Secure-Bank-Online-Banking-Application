# BankSphere - Test Scenarios Document

| Module ID | Module Name | Total Scenarios |
| :--- | :--- | :--- |
| **TS_AUTH** | Authentication & Security | 12 |
| **TS_DASH** | Customer Dashboard | 8 |
| **TS_XFER** | Fund Transfers & Rules | 15 |
| **TS_BEN** | Beneficiary Management | 6 |
| **TS_BILL** | Utility Bill Payments | 5 |
| **TS_STMT** | Statements & Reports | 4 |
| **TS_ADM** | Admin Control Portal | 6 |

---

## Module 1: Authentication & Security (TS_AUTH)
- `TS_AUTH_001`: Verify customer login with valid username and valid password.
- `TS_AUTH_002`: Verify customer login failure with invalid password.
- `TS_AUTH_003`: Verify customer login failure with unregistered email/ID.
- `TS_AUTH_004`: Verify validation error message when username or password fields are left blank.
- `TS_AUTH_005`: Verify account lockout mechanism after 3 consecutive failed login attempts.
- `TS_AUTH_006`: Verify password mask toggle (eye icon) hides and reveals password characters.
- `TS_AUTH_007`: Verify Admin login with admin credentials (`admin` / `Admin@123`).
- `TS_AUTH_008`: Verify customer registration onboarding flow with valid user details.
- `TS_AUTH_009`: Verify duplicate registration prevention for already registered email.
- `TS_AUTH_010`: Verify logout functionality terminates session and redirects to Auth screen.
- `TS_AUTH_011`: Verify notification drawer toggle displays unread alerts.
- `TS_AUTH_012`: Verify session state persistence upon page reload when "Remember Me" is checked.

---

## Module 2: Dashboard & Accounts (TS_DASH)
- `TS_DASH_001`: Verify Total Balance matches sum of individual active accounts (Savings + Current).
- `TS_DASH_002`: Verify balance privacy toggle hides numerical values with `••••••••`.
- `TS_DASH_003`: Verify display of linked account cards (Savings XXXX4521 & Current XXXX7890).
- `TS_DASH_004`: Verify Quick Action shortcuts navigate to correct functional tabs.
- `TS_DASH_005`: Verify recent transactions table displays latest 5 entries accurately.
- `TS_DASH_006`: Verify transaction search filter by keyword in description or category.
- `TS_DASH_007`: Verify transaction filtering by Credit vs Debit types.
- `TS_DASH_008`: Verify Chart.js monthly cashflow graph renders income vs expense bars correctly.

---

## Module 3: Fund Transfers & Business Rules (TS_XFER)
- `TS_XFER_001`: Verify successful fund transfer between source account and active beneficiary.
- `TS_XFER_002`: Verify transfer rejection when amount entered is `0` or negative.
- `TS_XFER_003`: Verify transfer rejection when amount exceeds available balance (Negative Test).
- `TS_XFER_004`: Verify transfer rejection when single transfer exceeds daily limit of `₹50,000`.
- `TS_XFER_005`: Verify transfer rejection when source account and destination account are identical.
- `TS_XFER_006`: Verify OTP modal triggers upon submitting valid transfer request.
- `TS_XFER_007`: Verify successful transfer completion upon entering valid 6-digit OTP `123456`.
- `TS_XFER_008`: Verify transfer failure and error alert when invalid OTP code is entered.
- `TS_XFER_009`: Verify source account balance is deducted immediately upon successful transfer.
- `TS_XFER_10`: Verify destination account balance is credited immediately upon internal transfer.
- `TS_XFER_011`: Verify debit transaction entry is prepended to recent transactions and ledger.
- `TS_XFER_012`: Verify reference number (e.g. `REF...`) generation for completed transfers.

---

## Module 4: Beneficiary Management (TS_BEN)
- `TS_BEN_001`: Verify adding a new beneficiary with valid Name, Account #, Bank, and IFSC code.
- `TS_BEN_002`: Verify validation errors when required fields are missing during beneficiary addition.
- `TS_BEN_003`: Verify deleting an existing beneficiary removes it from transfer destination dropdown.
- `TS_BEN_004`: Verify active beneficiary status allows money transfers.
- `TS_BEN_005`: Verify beneficiary list displays initials avatar and account details correctly.

---

## Module 5: Utility Bill Payments (TS_BILL)
- `TS_BILL_001`: Verify bill payment for Electricity category with valid Consumer ID and amount.
- `TS_BILL_002`: Verify bill payment for Mobile/Water/Internet categories.
- `TS_BILL_003`: Verify account balance deduction following successful bill payment.
- `TS_BILL_004`: Verify rejection of bill payment if bill amount exceeds account balance.
- `TS_BILL_005`: Verify debit transaction entry logged with biller description.

---

## Module 6: Statements & Admin Portal (TS_STMT & TS_ADM)
- `TS_STMT_001`: Verify full statement table displays complete history.
- `TS_STMT_002`: Verify CSV statement download generates formatted file.
- `TS_ADM_001`: Verify Admin customer directory lists all registered users.
- `TS_ADM_002`: Verify Admin can suspend/activate customer accounts dynamically.
