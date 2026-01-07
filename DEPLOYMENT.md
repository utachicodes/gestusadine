# Deployment Guide

You can deploy the XamSaDine AI platform to any provider that supports Docker (Render, Railway, Fly.io, DigitalOcean).

## Option 1: Render (Recommended for Ease)

1.  **Push your code** to GitHub.
2.  Create a new **Web Service** on [Render.com](https://render.com).
3.  Connect your GitHub repository.
4.  Render will automatically detect the `Dockerfile`.
5.  **Configure Environment Variables**:
    Add the following in the Render Dashboard:
    *   `OPENROUTER_API_KEY`: Your key starting with `sk-or-...`
    *   `NABOOPAY_API_KEY`: Your payment gateway key
    *   `SUPABASE_URL`: Your Supabase URL
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Key
    *   `PORT`: `4000` (Important: Render needs to know which port to listen on)
6.  Click **Deploy**.

## Option 2: VPS (DigitalOcean, Hetzner)

If you have a Linux server with Docker installed:

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/your-username/xamsadine-ai-website-v2.git
    cd xamsadine-ai-website-v2
    ```
2.  **Create .env file**:
    ```bash
    nano .env
    # Paste your environment variables here
    ```
3.  **Run with Docker Compose**:
    ```bash
    docker-compose up -d --build
    ```
    The app will be available at `http://YOUR_SERVER_IP:4000`.

## Option 3: Railway

1.  Install Railway CLI or use the Dashboard.
2.  `railway up` in the project directory.
3.  Railway will detect the `Dockerfile`.
4.  Set variables in the Railway variable dashboard.

---

**Note**: The Docker image builds the Frontend (`dist`) and serves it via the Backend API Gateway. You do not need separate deployments for frontend and backend.
