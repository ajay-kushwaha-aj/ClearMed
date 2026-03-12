# ClearMed Deployment Guide

ClearMed is divided into distinct systems capable of running in scalable environments.

## 1. Frontend (Next.js)

**Platform:** Vercel (Recommended)  
**Steps:**
1. Push your `clearmed` folder to GitHub.
2. Link your repository inside your Vercel Dashboard.
3. Configure the **Build Command** to `npm run build` and **Output Directory** to Next.js default (`.next`).
4. Ensure you set the environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-domain.com`.

## 2. Backend (Node.js API)

**Platform:** AWS ECS, Railway, or Render  
**Steps:**
1. Create a PostgreSQL Database using AWS RDS or equivalent.
2. Update the `.env` inside `/prisma` to reflect the new `DATABASE_URL`.
3. Use the included `Dockerfile` inside `/backend` to containerize the Express backend.
4. Deploy the Docker image ensuring it's exposed on port `5000` (or `80` if load balanced).

## 3. Python AI Engine (FastAPI)

**Platform:** Separate AWS ECS task / Railway Microservice  
**Steps:**
1. Push the `/ai` code to its own repository or micro-repo.
2. Dockerize using `python:3.10-slim`.
3. Command: `uvicorn main:app --host 0.0.0.0 --port 8000`.
4. Ensure the backend Express App is fed the correct `AI_SERVICE_URL`.
