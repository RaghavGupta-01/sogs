# SOGS: Scalable OTP Generation System

SOGS is a learning-focused project aimed at designing and building a secure, scalable, and reliable email OTP (One-Time Password) generation and verification system.

The primary objective is to explore backend engineering, distributed system design, caching with Redis, asynchronous queue processing, concurrency, and security through a hands-on, incremental application.

---

## 🎯 Project Goals

- **Secure OTP Lifecycle**: Implement secure generation, hashing, short-lived TTL expiration, and one-time verification.
- **Temporary Storage & Invalidation**: Leverage Redis for fast temporary data storage and invalidation.
- **Rate Limiting & Abuse Prevention**: Prevent brute-force attacks and email spamming.
- **Asynchronous Processing**: Decouple email dispatch from HTTP request-response cycles using background job queues.
- **Concurrency & Race Conditions**: Handle simultaneous verification attempts safely.
- **Architecture & Scalability**: Explore separation of concerns, containerization, system reliability, and horizontal scaling through incremental architectural improvements..

---

## 🛠️ Tech Stack

### Core Technologies
| Layer | Technology | Status |
|---|---|---|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS | Initialized |
| **Backend API** | Node.js, Express, TypeScript | Initialized |
| **Validation** | Zod |  Planned |
| **Caching & TTL** | Redis (ioredis) | Planned |
| **Job Queue** | BullMQ | Planned |
| **Email Service** | Resend | Planned |
| **Infrastructure** | Docker, Docker Compose | Planned |

---

## 📁 Project Structure

```text
sogs/
├── frontend/          # Next.js web application
│   ├── src/
│   │   └── app/       
│   └── package.json
├── backend/           # Express REST API and background services
│   ├── src/
│   │   └── server.ts 
│   └── package.json
├── docs/              # System design and architecture docs
├── docker/            # Docker Compose & container configs
├── package.json       # Root npm workspace configuration
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) (v10+ recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sogs
   ```

2. **Install dependencies for all workspaces:**
   ```bash
   npm install
   ```

### Running Locally

Run both or individual services using workspace scripts from the root directory:

- **Run Frontend (Next.js):**
  ```bash
  npm run dev:frontend
  ```
  Accessible at `http://localhost:3000`.

- **Run Backend (Express):**
  ```bash
  npm run dev:backend
  ```
  Accessible at `http://localhost:5000`  
  
---

## 📚 Documentation

- **[System Architecture](docs/system-architecture.md)**: System overview, component interactions, and data storage design.
- **[Architectural Decisions (ADRs)](docs/decisions.md)**: Design choices and trade-offs

