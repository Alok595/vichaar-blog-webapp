# 🚀 Vichaar Blog WebApp - Full Stack Deployment Guide

This guide covers deploying the full-stack **Vichaar Blog WebApp** across:
1. **Cloud Database (MySQL)**: Free cloud instance on **Aiven** / **TiDB Cloud** / **Railway**
2. **Backend API (Node.js/Express + Prisma)**: Hosted on **Render** (or Railway)
3. **Frontend Application (Next.js 15)**: Hosted on **Vercel**

---

## 🗄️ Step 1: Set Up Cloud MySQL Database

The backend uses **Prisma** with **MySQL**. You need a remote MySQL connection string (`DATABASE_URL`).

### Option A: TiDB Cloud (Recommended - Free Serverless MySQL)
1. Go to [tidbcloud.com](https://tidbcloud.com) and create a free account.
2. Click **Create Cluster** → Choose **Serverless (Free)**.
3. Once created, click **Connect** → Choose **Prisma** or **General Connection**.
4. Copy your MySQL connection string. It will look like:
   ```env
   DATABASE_URL="mysql://<USERNAME>.<USER_ID>:<PASSWORD>@<HOST>:4000/<DB_NAME>?sslaccept=strict"
   ```

### Option B: Aiven for MySQL (Free Tier)
1. Sign up at [aiven.io](https://aiven.io).
2. Create a **MySQL** service on the free trial/tier.
3. Copy the **Service URI**:
   ```env
   DATABASE_URL="mysql://avnadmin:<PASSWORD>@<HOST>:<PORT>/defaultdb?ssl-mode=REQUIRED"
   ```

### Option C: Railway MySQL
1. Go to [railway.app](https://railway.app).
2. Create a new project → Click **+ New** → **Database** → **Add MySQL**.
3. Under the database **Variables** tab, copy `DATABASE_URL`.

---

## ⚙️ Step 2: Deploy Backend to Render (or Railway)

### Using Render (Free Web Service):
1. Log in to [render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/Alok595/vichaar-blog-webapp`.
3. Configure the service settings:
   - **Name**: `vichaar-backend` (or your choice)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. In the **Environment Variables** section, add:
   | Key | Value | Note |
   |---|---|---|
   | `NODE_ENV` | `production` | Production environment |
   | `PORT` | `5000` | Port for Express (Render routes automatically) |
   | `DATABASE_URL` | `<Your Remote MySQL URL from Step 1>` | e.g. `mysql://user:pass@host:port/db?ssl-mode=...` |
   | `JWT_SECRET` | `generate_a_long_random_secure_string_here` | Secret for signing tokens |
   | `CLIENT_URL` | `http://localhost:3000,https://your-app.vercel.app` | *Update with your actual Vercel URL once deployed* |

5. Click **Create Web Service**.
6. Once deployed, note down your live backend URL (e.g., `https://vichaar-backend.onrender.com`).

### Optional: Seed Initial Data
To populate sample articles & default author accounts in your remote database, run:
```bash
# In your local terminal:
cd backend
# Temporarily set your remote DATABASE_URL in backend/.env, then run:
npm run seed
```
**Default Seed Credentials:**
- **Author Email**: `ananya.sharma@vichaar.org`
- **Password**: `author-pass-2026`

---

## 🌐 Step 3: Deploy Frontend to Vercel

1. Log in to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your GitHub repository: `Alok595/vichaar-blog-webapp`.
3. In the project setup screen:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click `Edit` and select **`frontend`**
4. Expand **Environment Variables** and add:
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://vichaar-backend.onrender.com/api` *(replace with your actual backend URL + `/api`)* |
5. Click **Deploy**.

---

## 🔄 Step 4: Final CORS Sync

Once your Vercel deployment finishes and you have your live domain (e.g., `https://vichaar-blog.vercel.app`):

1. Go back to your backend hosting dashboard (**Render** / **Railway**).
2. Update the `CLIENT_URL` environment variable to include your live Vercel domain:
   ```env
   CLIENT_URL="http://localhost:3000,https://vichaar-blog.vercel.app"
   ```
3. Trigger a redeploy / restart of your backend so the CORS policy recognizes your live frontend.

---

## 🔍 Verification Checklist

- [ ] Remote MySQL database is reachable via `DATABASE_URL`.
- [ ] Backend tables created automatically via `npx prisma db push`.
- [ ] Backend responds with `{ status: "ok" }` on `https://<your-backend-url>/api/posts`.
- [ ] Next.js frontend is live and fetches posts from the backend without CORS errors.
- [ ] Admin / Author authentication works via `/admin`.
