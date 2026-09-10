# BankSphere - REST API Specification & Test Documentation

This document outlines the API endpoints, payload formats, authentication headers, and positive/negative test verification cases for **BankSphere REST Services**.

---

## Base URL
```text
http://localhost:3000
```

---

## 1. Authentication Services

### `POST /api/auth/login`
Authenticates customers and administrators.

#### Request Body
```json
{
  "username": "kalyan@banksphere.com",
  "password": "Password123!"
}
```

#### Success Response (`200 OK`)
```json
{
  "status": "Success",
  "role": "CUSTOMER",
  "token": "jwt_customer_secret_token_123456",
  "user": {
    "id": "CUST1001",
    "name": "Kalyan Vance",
    "email": "kalyan@banksphere.com",
    "phone": "+91 9876543210",
    "status": "Active"
  }
}
```

#### Error Response - Invalid Password (`401 Unauthorized`)
```json
{
  "status": "Error",
  "message": "Invalid password. 2 attempts remaining"
}
```

#### Error Response - Account Lockout (`403 Forbidden`)
```json
{
  "status": "Error",
  "message": "Account temporarily locked after 3 failed login attempts"
}
```

---

## 2. Fund Transfers API

### `POST /api/transfers`
Processes money transfers and validates business rules.

#### Request Body
```json
{
  "fromAccount": "ACC4521",
  "toAccount": "100012345678",
  "amount": 5000,
  "description": "Monthly House Rent",
  "otp": "123456"
}
```

#### Success Response (`200 OK`)
```json
{
  "status": "Success",
  "message": "Money transfer completed successfully",
  "referenceNumber": "REF1725948301920",
  "newBalance": 115450.00
}
```

#### Error Matrix
| Test Case | Payload Condition | HTTP Code | Error Message |
| :--- | :--- | :--- | :--- |
| Insufficient Balance | `amount: 999999` | `400 Bad Request` | `Insufficient balance. Available balance: ₹120,450` |
| Exceeds Limit | `amount: 60000` | `400 Bad Request` | `Transfer exceeds maximum daily limit of ₹50,000` |
| Same Account | `fromAccount == toAccount` | `400 Bad Request` | `Source account and beneficiary account cannot be the same` |
| Invalid OTP | `otp: "999999"` | `401 Unauthorized` | `Invalid OTP security verification code` |
