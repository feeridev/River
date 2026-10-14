# River — Helpdesk Ticket Management System

<p align="center">
  <img width="180" alt="River logo" src="https://github.com/user-attachments/assets/9d714cce-a464-4c71-b6a9-51b7ffaa9911" />
</p>

<p align="center">
  <strong>A full-stack helpdesk application for managing technical support requests, users, and ticket workflows.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge" alt="In Development" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Zod-Validation-3E67B1?style=flat-square" alt="Zod" />
  <img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-5C6BC0?style=flat-square" alt="bcrypt" />
  <img src="https://img.shields.io/badge/Vite-Frontend%20Tooling-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## About

River is a full-stack helpdesk ticket management system built to organize technical support requests, manage support users, and track tickets throughout their lifecycle.

The project combines a React and TypeScript frontend with a Node.js and Express REST API backed by MongoDB.

River is being developed incrementally, with an emphasis on authentication, access control, input validation, maintainable architecture, and practical support workflows.


 <p align="center">
  <img src="YOUR_CROPPED_SETUP_IMAGE_URL" alt="River initial setup screen" width="600" height="350" />
  <img src="YOUR_CROPPED_DASHBOARD_IMAGE_URL" alt="River helpdesk dashboard" width="600" height="350" />
</p>


## Features

### Authentication and account security

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Active-account verification
- Initial administrator setup
- Role-based authorization
- Server-side request validation with Zod

### Ticket management

- Create, list, and view support tickets
- Update tickets while enforcing ownership rules
- Categorize tickets by type
- Assign ticket priorities
- Manage ticket statuses
- Assign tickets to support agents
- Add replies and retrieve ticket conversations
- Enforce ticket access rules based on user role and ownership

### User management

- Dedicated administrator user-management interface
- View registered users
- Change eligible users' roles
- Activate and deactivate accounts
- Prevent ordinary role changes from promoting users to administrator
- Prevent administrators from deactivating their own accounts
- Protect the last active administrator account

### Frontend

- React and TypeScript application
- Login and initial setup screens
- Ticket dashboard with filtering and statistics
- Ticket details and messaging
- Administrator user-management interface

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe frontend and backend development |
| Vite | Frontend development server and build tooling |
| Node.js | Backend JavaScript runtime |
| Express 5 | REST API and routing |
| MongoDB | Persistent database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Input validation |
| Lucide React | Interface icons |

## Architecture and Workflow

<p align="center">
  <img src="https://github.com/user-attachments/assets/3d187a76-8535-4075-9deb-65f2d35448a0" alt="River backend architecture and ticket workflow" width="700" />
</p>

<p align="center">
  <sub>Ticket creation workflow — from request validation to database storage.</sub>
</p>

### Ticket creation flow

1. The client submits a ticket creation request.
2. The API authenticates the request using a JWT.
3. The server verifies that the account exists and is active.
4. Zod validates the submitted ticket data.
5. The server associates the ticket with the authenticated user and applies defaults.
6. The ticket is stored in MongoDB.
7. The API returns the created ticket.

### Authorization model

River distinguishes between three user roles:

| Role | General permissions |
|---|---|
| `EMPLOYEE` | Create and manage eligible tickets, view accessible tickets, and participate in ticket conversations |
| `AGENT` | Handle accessible support tickets, update ticket statuses, and respond to requests |
| `ADMIN` | Manage users and roles, assign tickets, and access administrative ticket operations |

Authorization is enforced by the backend. Hiding a frontend control does not replace server-side permission checks.

## Ticket Workflow

### Statuses

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

### Priorities

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

### Categories

- `HARDWARE`
- `SOFTWARE`
- `NETWORK`
- `ACCOUNT`
- `ACCESS`
- `OTHER`

Ticket status transitions are validated by the backend rather than being accepted as arbitrary client input.

## API Overview

Base URL for local development:

`http://localhost:5000`

### Authentication and setup

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/auth/setup-status` | Check whether initial administrator setup is required |
| `POST` | `/api/auth/setup` | Create the initial administrator |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Authenticate an account |
| `GET` | `/api/auth/me` | Get the authenticated user's identity |

### Tickets and messages

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tickets` | List accessible tickets |
| `POST` | `/api/tickets` | Create a ticket |
| `GET` | `/api/tickets/:id` | Get ticket details |
| `PATCH` | `/api/tickets/:id` | Update an eligible ticket |
| `PATCH` | `/api/tickets/:id/status` | Change ticket status |
| `PATCH` | `/api/tickets/:id/assignment` | Assign a ticket |
| `GET` | `/api/tickets/:id/messages` | Retrieve ticket messages |
| `POST` | `/api/tickets/:id/messages` | Send a ticket message |

### User management

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | List users |
| `PATCH` | `/api/users/:id/role` | Update an eligible user's role |
| `PATCH` | `/api/users/:id/status` | Activate or deactivate a user |

Protected endpoints require a valid bearer token:

```http
Authorization: Bearer <your-token>
```

Access depends on the authenticated user's role, account status, and applicable resource permissions.

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/feeridev/River.git
cd River
```

### 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and configure the environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/river
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong JWT secret locally:

```bash
openssl rand -hex 32
```

Use the generated value for `JWT_SECRET`.

**Never commit your real `.env` file or expose your JWT secret.**

### 3. Start MongoDB

Ensure MongoDB is installed and running.

On systems that use systemd:

```bash
sudo systemctl start mongod
```

The MongoDB connection string should point to your local or configured MongoDB instance.

### 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

The API runs at:

`http://localhost:5000`

Keep this terminal open.

### 5. Start the frontend

Open another terminal:

```bash
cd ~/Storage/River/client
npm install
npm run dev
```

Vite normally serves the frontend at:

`http://localhost:5173`

Open the local frontend URL shown in the terminal.

### 6. Complete initial administrator setup

On a fresh database, open the application and follow the initial administrator setup screen.

Create the first administrator account. Once setup is complete, sign in and use the administrator interface to manage users and support workflows.

The initial setup endpoint should not be used as a general-purpose registration mechanism; it is intended only for the initial administrator.

### 7. Build for production

Build the backend:

```bash
cd ~/Storage/River/server
npm run build
npm start
```

Build the frontend in a separate terminal:

```bash
cd ~/Storage/River/client
npm run build
```

The frontend build output is generated by Vite. Production deployment requires serving that frontend output and configuring the API URL and cross-origin access appropriately for the deployment environment.

## Project Structure

```text
River/
├── client/
│   └── src/
│       ├── App.tsx
│       ├── Dashboard.tsx
│       ├── Setup.tsx
│       ├── UserManagement.tsx
│       └── ...
├── server/
│   ├── scripts/
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validation/
│       ├── app.ts
│       └── server.ts
├── .gitignore
└── README.md
```

The backend separates HTTP routes, business logic, database operations, validation, and middleware to keep responsibilities organized.

## Roadmap

- [x] Authentication and account registration
- [x] Initial administrator setup
- [x] Role-based access control
- [x] Ticket creation, listing, viewing, and updates
- [x] Ticket status management
- [x] Ticket assignment
- [x] Ticket conversations and replies
- [x] Administrator user management
- [x] React and TypeScript frontend
- [ ] Automated backend and frontend tests
- [ ] Improved deployment and installation documentation
- [ ] Production deployment
- [ ] Further UI and accessibility refinements

## Development Philosophy

River is built step by step, with an emphasis on understanding the implementation, validating inputs, protecting user accounts, and keeping the codebase maintainable.

The goal is to build a practical helpdesk application while documenting engineering decisions and learning through real implementation.

## Author

**Farshad Safarkhanloo**

- GitHub: [@feeridev](https://github.com/feeridev)

---

<p align="center">
  <sub>River is an independent portfolio project and is actively being developed.</sub>
</p>
