# XamSaDine AI v2 - Deployment Guide

This guide ensures a "perfect" deployment on **Render**, **Railway**, or any Docker-compatible host.

---

## 1. Database Setup (Supabase)

Before deploying the code, you must initialize your Supabase database. Copy and run the following SQL scripts in the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql):

1.  `database/ecosystem_schema.sql` (Core Tables)
2.  `database/profiles-table.sql` (User Records)
3.  `database/rag-setup.sql` (AI Circle Knowledge Base)
4.  `database/library-schema.sql` (Digital Library)

---

## 2. Option 1: Render (Recommended)

Render is the easiest way to host the monorepo as a single unit.

1.  **Push your code** to GitHub.
2.  Create a new **Web Service** on [Render.com](https://render.com).
3.  Connect your repository.
4.  Render will detect the `Dockerfile`.
5.  **Environment Variables**: In the Render dashboard, add:
    *   `SUPABASE_URL`: Your project URL
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your service\_role key (needed for RAG/Admin tasks)
    *   `OPENROUTER_API_KEY`: Your API key for LLMs
    *   `NABOOPAY_API_KEY`: Your payment gateway key
    *   `PORT`: `4000`
    *   `NODE_ENV`: `production`

---

## 3. Option 2: Docker Compose (VPS)

Use this for DigitalOcean, Hetzner, or AWS.

1.  **Clone the Repository**
2.  **Setup environment**:
    ```bash
    cp .env.example .env
    nano .env # Fill in your keys
    ```
3.  **Run Build**:
    ```bash
    docker-compose up -d --build
    ```
    The platform will be live at `http://your-server-ip:4000`.

---

## 4. Required Environment Variables Checklist

| Variable | Description | Source |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret Service Role Key | Supabase Dashboard |
| `OPENROUTER_API_KEY` | Key for AI Council | OpenRouter.ai |
| `NABOOPAY_API_KEY` | Key for Shop Payments | NabooPay |
| `PORT` | 4000 (Internal default) | Render/Railway |

---

## 5. Technical Notes
*   **Single Container**: The `Dockerfile` builds the Vite frontend and copies the assets to the API Gateway. There is no need for a separate frontend host.
*   **Static Serving**: `server.ts` automatically serves `index.html` for any non-API route.
*   **Memory**: AI features (Transformers.js) may require at least 1GB of RAM for the initial model download.

---

**Everything is verified and ready for deployment.**
