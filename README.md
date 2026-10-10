# River — Helpdesk Ticket Management System

<p align="center">
  <img width="400" height="400" alt="river-logo-icon-400" src="https://github.com/user-attachments/assets/7e686bf8-ea15-4da7-ae2f-fb09793736e8" />
</p>

<p align="center">
  <img width="2240" height="3660" alt="river-ticket-flow" src="https://github.com/user-attachments/assets/3d187a76-8535-4075-9deb-65f2d35448a0" />

</p>

<p align="center">
  <strong>Status:</strong> In Development
</p>

## About

River is a helpdesk ticket management system designed to organize technical support requests, track ticket progress, and provide a foundation for role-based support workflows.

The project is being developed incrementally, starting with a secure REST API and expanding toward a complete helpdesk application.

## Technology Stack

- **Node.js** — JavaScript runtime
- **Express 5** — REST API
- **TypeScript** — type-safe backend development
- **MongoDB** — database
- **JWT** — authentication
- **bcrypt** — password hashing
- **Zod** — request validation

## Implemented Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Active-account verification
- Role definitions for employees, agents, and administrators
- Ticket creation with validated input
- Ticket categories and priorities
- Default ticket status and priority
- MongoDB indexes for user lookup and ticket queries

> River is a work in progress. Features such as ticket assignment, status management, and the frontend are planned for future development.

## Ticket Creation Workflow

When an authenticated employee submits a ticket, River validates the request, verifies the user's identity, and stores the ticket in MongoDB.

<p align="center">
  <img src="REPLACE_WITH_BACKEND_ALGORITHM_IMAGE_URL" alt="River ticket creation backend workflow" width="800">
</p>

The current ticket creation flow includes:

1. Receive a ticket creation request.
2. Authenticate the user using a JWT.
3. Verify that the account is active.
4. Validate the submitted ticket data.
5. Apply default values and associate the creator.
6. Save the ticket to MongoDB.
7. Return a `201 Created` response.

## API Overview

Base URL for local development: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the authenticated identity |
| POST | `/api/tickets` | Create a ticket |

Protected endpoints require a valid bearer token:

`Authorization: Bearer <your-token>`

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

Edit `.env` and configure the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/river
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong secret locally with:

```bash
openssl rand -hex 32
```

Put the generated value in `JWT_SECRET`. Never commit your real `.env` file.

### 4. Start MongoDB

Make sure your MongoDB service is running before starting the API.

On systems using systemd:

```bash
sudo systemctl start mongod
```

### 5. Run the development server

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

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

## Author

**Farshad Safarkhanloo**

- GitHub: [@feeridev](https://github.com/feeridev)

---

*River is an independent portfolio project and is actively being developed.*
