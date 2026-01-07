# XamSaDine AI v2

**XamSaDine AI** is a distributed multi-agent system designed to provide rigorous, scholar-grade Islamic guidance. It combines a sophisticated "LLM Council" architecture with practical lifestyle modules (Commerce, Education) into a unified service-oriented platform.

![Maintained](https://img.shields.io/badge/Maintained-yes-green.svg?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

### Tech Stack
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-7F52FF?style=for-the-badge)

---

## 🏗 System Architecture

The platform utilizes a **Service-Oriented Architecture (SOA)** where the frontend communicates with a central API Gateway that routes requests to specialized microservices.

```mermaid
graph TD
    User[Frontend (Vite/React)] --> Gateway[API Gateway (Node/Express)]
    
    subgraph "Core Microservices"
        Gateway --> Council[LLM Council Service]
        Gateway --> Shop[Commerce Service]
        Gateway --> Tarteel[Tarteel AI Service]
        Gateway --> Media[Media & Events Service]
    end
    
    subgraph "Integrations"
        Council --> OpenRouter[LLM APIs (Claude, GPT-4)]
        Council --> RAG[Vector Store (Supabase pgvector)]
        Shop --> Naboo[NabooPay Gateway]
        Shop --> DB[(Supabase Database)]
    end
```

### 1. The LLM Council
A unique epistemic architecture that prevents hallucination through distributed consensus.
*   **Fiqh Agent**: Specialized in jurisprudence. It references the four Sunni Madhhabs (Hanafi, Maliki, Shafi, Hanbali) to provide legal rulings.
*   **Aqeedah Agent**: Ensures theological correctness based on Ashari/Maturidi/Athari frameworks.
*   **Context Agent**: Analyzes modern implications (e.g., "Is crypto halal?") using contemporary financial data.
*   **Humility Agent**: The final gatekeeper. It evaluates the confidence of the other agents and forces an "Abstain" response if consensus is weak or the topic requires a human scholar.
*   **RAG (Retrieval Augmented Generation)**: Uploaded texts (PDF/TXT) are chunked and embedded, allowing agents to "read" specific books before answering.

### 2. Islamic Shop (Beta)
A full-stack e-commerce module.
*   **Flow**: Users select limited-drop items -> Checkout -> Redirect to **NabooPay**.
*   **Payment**: Supports local African payment methods (Wave, Orange Money) via secure API hooks.
*   **Order Management**: Webhooks update order status in real-time upon payment confirmation.

### 3. Tarteel AI
Real-time Quranic recitation feedback.
*   **Technology**: Uses the **Web Speech API** for high-performance, client-side Arabic speech recognition.
*   **Analysis**: Compares user speech against the digital Quran text (Uthmani script) to detect pronunciation errors or missing words.

### 4. Digital Library
*   **Content**: A CMS-backed repository of videos, books, and articles.
*   **Localization**: Content can be tagged and filtered by language (English, French, Wolof).

---

## 🛠 Setup & Deployment

### Prerequisites
*   Node.js 18+ (LTS recommended)
*   Docker & Docker Compose (optional)
*   Supabase Project (for Auth & Database)
*   OpenRouter API Key (for LLMs)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/UtachiCodes/xamsadine-ai-website-v2.git
    cd xamsadine-ai-website-v2
    npm install
    ```

2.  **Environment Configuration**
    Create `.env` files for root and backend services (`backend/services/api-gateway/.env`).
    Required keys: `OPENROUTER_API_KEY`, `NABOOPAY_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

3.  **Run Locally**
    *   **Frontend**: `npm run dev` (Runs Vite on port 8080)
    *   **Backend**: `npm run dev:api` (Runs Express Gateway on port 4000)

### Production Deployment

The project includes a multi-stage `Dockerfile`.
*   **Build**: `docker-compose up --build`
*   **Deploy**: Push to **Render.com** (Web Service) or **Railway** and set the environment variables. The Dockerfile automatically builds the React frontend and serves it via the backend, creating a single deployable unit.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for a step-by-step guide.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

**Contact**: [abdoullahaljersi@gmail.com](mailto:abdoullahaljersi@gmail.com)
