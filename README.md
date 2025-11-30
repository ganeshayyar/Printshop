# Print Shop — GitHub-ready Starter

This repository is a GitHub-ready starter for the Online Print Shop project.

## What you'll find
- `backend/` - Express + Mongoose + Socket.IO starter (auth, queue manager)
- `frontend/` - tiny static demo
- `docker-compose.yml` - quick local dev using Docker
- `.github/workflows/node-ci.yml` - basic CI skeleton

## Quickstart (local)
1. Copy `.env.example` to `.env` in `backend/` and set required variables.
2. Start with Docker: `docker-compose up --build`
3. Backend: http://localhost:4000
4. Frontend: http://localhost:3000

## How to use this repository on GitHub
1. Create a new repository on GitHub (empty).
2. Locally:
```bash
git init
git add .
git commit -m "Initial commit: Print Shop starter"
git branch -M main
git remote add origin <your-github-remote-url>
git push -u origin main
```

## Next steps
- Implement production-ready printer connectors
- Add payment gateway integrations
- Build full React + Tailwind frontend
