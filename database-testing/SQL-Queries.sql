-- ==========================================================================
-- BANKSFERE DATABASE QA TESTING & DATA INTEGRITY VERIFICATION QUERIES
-- ==========================================================================

-- 1. VERIFY CUSTOMER BALANCE ACCURACY (UI vs DB Reconciliation)
SELECT 
    c.customer_id,
    c.name,
    c.email,
    a.account_number,
    a.account_type,
    a.balance AS db_balance
FROM customers c
JOIN accounts a ON c.customer_id = a.customer_id
WHERE c.customer_id = 'CUST1001';

-- 2. VERIFY TRANSACTION AUDIT TRAIL FOR SPECIFIC ACCOUNT
SELECT 
    t.transaction_id,
    t.reference_number,
    t.transaction_type,
    t.category,
    t.amount,
    t.status,
    t.transaction_date
FROM transactions t
WHERE t.account_id = 'ACC4521'
ORDER BY t.transaction_date DESC;

-- 3. RECONCILE TOTAL DEBITS AND CREDITS FOR ACCOUNT
SELECT 
    account_id,
    SUM(CASE WHEN transaction_type = 'Credit' THEN amount ELSE 0 END) AS total_credits,
    SUM(CASE WHEN transaction_type = 'Debit' THEN amount ELSE 0 END) AS total_debits,
    (SUM(CASE WHEN transaction_type = 'Credit' THEN amount ELSE 0 END) - 
     SUM(CASE WHEN transaction_type = 'Debit' THEN amount ELSE 0 END)) AS net_calculated_balance
FROM transactions
WHERE account_id = 'ACC4521'
GROUP BY account_id;

-- 4. IDENTIFY LOCKED CUSTOMER ACCOUNTS (SECURITY CHECK)
SELECT 
    customer_id,
    name,
    email,
    status,
    failed_logins
FROM customers
WHERE status = 'Locked' OR failed_logins >= 3;

-- 5. VERIFY BENEFICIARY LINKAGE FOR CUSTOMER
SELECT 
    b.beneficiary_id,
    b.name AS payee_name,
    b.account_number,
    b.bank_name,
    b.ifsc_code
FROM beneficiaries b
WHERE b.customer_id = 'CUST1001' AND b.status = 'Active';
