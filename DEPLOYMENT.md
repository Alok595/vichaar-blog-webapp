# 🚀 Vichaar Blog WebApp - Full Stack Deployment Guide

This guide covers deploying the full-stack **Vichaar Blog WebApp** across:
1. **Cloud Database (MySQL)**: Free cloud instance on **TiDB Cloud** (or Aiven / Railway)
2. **Backend API (Node.js/Express + Prisma)**: Hosted on **Render** (or Railway)
3. **Frontend Application (Next.js 15)**: Hosted on **Vercel**

---

## 🗄️ Step 1: TiDB Cloud Database Setup
- Connection String format:
  ```env
  DATABASE_URL="mysql://<user>:<password>@<host>:4000/test?sslaccept=strict"
  ```
- Push schema & seed data:
  ```powershell
  cd backend
  npx prisma db push
  npm run seed
  ```

---

## ⚙️ Step 2: Render Backend Deployment
- **Repo**: `https://github.com/Alok595/vichaar-blog-webapp`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Environment Variables**:
  | Key | Value |
  |---|---|
  | `NODE_ENV` | `production` |
  | `PORT` | `5000` |
  | `DATABASE_URL` | `<Your TiDB URL>?sslaccept=strict` |
  | `JWT_SECRET` | `blog_super_secret_jwt_key_2026` |
  | `CLIENT_URL` | `http://localhost:3000,https://<your-vercel-app>.vercel.app` |

---

## 🌐 Step 3: Vercel Frontend Deployment
- **Repo**: `https://github.com/Alok595/vichaar-blog-webapp`
- **Framework Preset**: `Next.js`
- **Root Directory**: `frontend`
- **Environment Variables**:
  | Key | Value |
  |---|---|
  | `NEXT_PUBLIC_API_URL` | `https://vichaar-blog-webapp.onrender.com/api` |
