# River — Helpdesk Ticket Management System

<p align="center">
  <img width="180" alt="river-logo-ticket-400" src="https://github.com/user-attachments/assets/9d714cce-a464-4c71-b6a9-51b7ffaa9911" />
</p>

<p align="center">
  <strong>A helpdesk backend for organizing technical support requests and managing ticket workflows.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" alt="In Development" />
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/TypeScript-Backend-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square" alt="Zod" />
  <img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-5C6BC0?style=flat-square" alt="bcrypt" />
  <img src="https://img.shields.io/badge/REST%20API-Backend-6C757D?style=flat-square" alt="REST API" />
</p>

---

## About

River is a helpdesk ticket management system designed to organize technical support requests, track ticket progress, and provide a foundation for role-based support workflows.

The project is being developed incrementally, starting with a secure REST API and expanding toward a complete helpdesk application.

## Architecture & Workflow

<p align="center">
  <img src="https://github.com/user-attachments/assets/3d187a76-8535-4075-9deb-65f2d35448a0" alt="River backend architecture and ticket workflow" width="700" />
</p>

<p align="center">
  <sub>Ticket creation workflow — from request validation to database storage.</sub>
</p>

### Current ticket creation flow

1. Receive a ticket creation request.
2. Authenticate the user using a JWT.
3. Verify that the account is active.
4. Validate the submitted ticket data.
5. Apply default values and associate the creator.
6. Save the ticket to MongoDB.
7. Return a `201 Created` response.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | REST API and routing |
| TypeScript | Type-safe backend development |
| MongoDB | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |

## Implemented Features

- [x] User registration and login
- [x] Password hashing with bcrypt
- [x] JWT-based authentication
- [x] Active-account verification
- [x] Role definitions for employees, agents, and administrators
- [x] Ticket creation with validated input
- [x] Ticket categories and priorities
- [x] Default ticket status and priority
- [x] MongoDB indexes for user lookup and ticket queries

> **Development note:** River is a work in progress. Ticket assignment, status management, and the frontend are planned but are not yet implemented.

## API Overview

Base URL for local development:

`http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/me` | Get the authenticated identity |
| `POST` | `/api/tickets` | Create a ticket |

Protected endpoints require a valid bearer token:

```http
Authorization: Bearer <your-token>
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/feeridev/River.git
cd River/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Configure the values in `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/river
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong secret locally:

```bash
openssl rand -hex 32
```

Use the generated value for `JWT_SECRET`. Never commit your real `.env` file.

### 4. Start MongoDB

Ensure your MongoDB service is running before starting the API.

On systems using systemd:

```bash
sudo systemctl start mongod
```

### 5. Start the development server

```bash
npm run dev
```

The API will run at:

`http://localhost:5000`

### 6. Build for production

```bash
npm run build
npm start
```

## Project Structure

```text
River/
├── .gitignore
└── server/
    ├── scripts/
    ├── src/
    │   ├── config/
    │   ├── middleware/
    │   ├── models/
    │   ├── repositories/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   ├── validation/
    │   ├── app.ts
    │   └── server.ts
    ├── .env.example
    ├── package.json
    └── tsconfig.json
```

## Roadmap

- [ ] Ticket listing and filtering
- [ ] Ticket assignment to support agents
- [ ] Ticket status updates and resolution
- [ ] Role-based authorization for helpdesk operations
- [ ] Ticket history and comments
- [ ] Automated tests
- [ ] React and TypeScript frontend
- [ ] Deployment and installation documentation

## Development Philosophy

River is built step by step, with an emphasis on understanding the implementation, validating inputs, protecting user accounts, and keeping the codebase maintainable.

The goal is to build a practical helpdesk system while documenting the engineering decisions and development process along the way.

## Author

**Farshad Safarkhanloo**

- GitHub: [@feeridev](https://github.com/feeridev)

---

<p align="center">
  <sub>River is an independent portfolio project and is actively being developed.</sub>
</p>
