# Backend (starter)

Instructions:
1. Copy `.env.example` to `.env` and update values.
2. Install: `npm install` inside backend folder.
3. Start: `npm start` (requires MongoDB running).

This is a minimal starter demonstrating routes, models, and a simulated queue manager.


## Authentication

This starter now includes:
- secure password hashing (bcrypt)
- JWT access + refresh token endpoints
- email verification token endpoint (sends email if SMTP configured)
- TOTP 2FA generation and verification (speakeasy)

Configure SMTP vars in `.env` to enable email sending.
