# SOGS Backend API

## Request OTP

POST /api/otp/request

### Request

```
{
  "email": "user@example.com"
}
```
### Responsibilities

- Accept email address.
- Generate OTP.
- Hash OTP.
- Store hash in Redis with TTL.

## Verify OTP

POST /api/otp/verify

### Request

```
{
  "email": "user@example.com",
  "otp": "123456"
}
```