# XamSaDine AI v2

A comprehensive Islamic lifestyle platform blending tradition with advanced technology. XamSaDine integrates e-commerce, education, and AI-driven guidance into a unified digital ecosystem.

![Maintained](https://img.shields.io/badge/Maintained-yes-green.svg?style=for-the-badge)
![License](https://img.shields.io/github/license/UtachiCodes/xamsadine-ai-website-v2?style=for-the-badge)

### Tech Stack
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-API-7F52FF?style=for-the-badge)

---

## Platform Overview

XamSaDine gives users a single destination for their spiritual and daily needs, powered by a microservices backend. 

### Core Modules

*   **Islamic Shop**: curated marketplace for exclusive merchandise. Features a fully integrated checkout system powered by **NabooPay** (Wave, Orange Money) for secure local transactions.
*   **Tarteel AI**: Advanced Quranic tool offering real-time recitation analysis and speech-to-text feedback to improve Tajweed.
*   **Circle of Knowledge**: A multi-agent AI council (Fiqh, Aqeedah, Context) that provides rigorous, well-sourced answers to complex questions, enforcing epistemic integrity.
*   **Digital Library**: Extensive collection of Islamic texts and multimedia resources managed via a custom CMS.
*   **AI Chat**: A conversational assistant available 24/7 for general guidance and support.

---

## Architecture

The platform runs on a Service-Oriented Architecture (SOA), allowing each module to scale independently.

```mermaid
graph TD
    User[Frontend App] --> Gateway[API Gateway]
    
    subgraph Services
    Gateway --> Commerce[Commerce Service]
    Gateway --> Tarteel[Tarteel Service]
    Gateway --> Council[LLM Council Service]
    Gateway --> Media[Media Service]
    end
    
    Commerce --> Naboo[NabooPay API]
    Council --> OpenRouter[LLM APIs]
    Tarteel --> Speech[Speech Engine]
```

---

## Setup & Deployment

### Prerequisites
- Node.js 18+
- Docker (optional, recommended for deployment)
- Supabase project

### Running Locally

1.  **Clone & Install**
    ```bash
    git clone https://github.com/UtachiCodes/xamsadine-ai-website-v2.git
    cd xamsadine-ai-website-v2
    npm install
    ```

2.  **Start Backend**
    ```bash
    npm run dev:api
    ```

3.  **Start Frontend**
    ```bash
    npm run dev
    ```

### Deployment

The platform is containerized for easy deployment. See [DEPLOYMENT.md](./DEPLOYMENT.md) for instructions on deploying to **Render**, **Railway**, or **VPS**.

---

## License

MIT License.

**Contact**: [abdoullahaljersi@gmail.com](mailto:abdoullahaljersi@gmail.com)
