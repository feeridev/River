# River — Helpdesk Ticket Management System

<p align="center">
  <img width="180" alt="River logo" src="https://github.com/user-attachments/assets/9d714cce-a464-4c71-b6a9-51b7ffaa9911" />
</p>

<p align="center">
  <strong>A self-hosted helpdesk application for managing support tickets, tracking progress, and communicating with users.</strong>
</p>

<p align="center">
  <a href="https://github.com/feeridev/River/actions/workflows/windows-installer.yml">
    <img src="https://img.shields.io/badge/Download-Windows%20Installer-2ea44f?style=for-the-badge&logo=windows&logoColor=white" alt="Download River for Windows" />
  </a>
  <a href="https://github.com/feeridev/River">
    <img src="https://img.shields.io/badge/Source-GitHub-181717?style=for-the-badge&logo=github" alt="River source code on GitHub" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge" alt="Active development" />
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React and TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## Download River

**Want to try River on Windows?**

### [Download the latest Windows installer](https://github.com/feeridev/River/actions/workflows/windows-installer.yml)

1. Open the Windows Installer workflow.
2. Select the latest successful workflow run.
3. Find the **Artifacts** section and download the installer ZIP.
4. Extract the ZIP and run the setup executable as administrator.
5. Once installation finishes, open [http://127.0.0.1:5000](http://127.0.0.1:5000).

The installer configures River and its MongoDB Windows service for local use.



## About River

River is a self-hosted helpdesk ticket management system designed to organize technical support requests in one place.

Instead of relying on a hosted helpdesk service, River is designed to run on a local Windows machine or server. Users can create tickets, track their status, view ticket details, and communicate through ticket replies.

The project combines a React frontend, a Node.js and Express API, and MongoDB persistence, with a Windows installer for easier deployment.

River is actively developed, with additional administrative and support-agent capabilities planned.

## Features

- **Authentication** — account registration and login with JWT-based authentication.
- **Ticket creation** — submit technical support requests with validated information.
- **Ticket dashboard** — review tickets, view ticket details, and filter ticket lists.
- **Status management** — track tickets through Open, In Progress, Resolved, and Closed.
- **Ticket conversations** — add replies to ticket discussions.
- **Priorities** — categorize urgency as Low, Medium, High, or Critical.
- **Categories** — organize tickets by Hardware, Software, Network, Account, Access, or Other.
- **Persistent storage** — retain application data in MongoDB.
- **Input validation** — validate request data using Zod.
- **Password security** — hash passwords with bcrypt.
- **Windows deployment** — install and run River as a Windows service with its MongoDB service.

Role definitions include Employee, Agent, and Admin. Full administrative tools and agent workflows remain under development.

## Architecture

<p align="center">
  <img src="https://github.com/user-attachments/assets/3d187a76-8535-4075-9deb-65f2d35448a0" alt="River backend architecture and ticket workflow" width="700" />
</p>

At a high level, a ticket request follows this process:

1. The client sends a request to the API.
2. Authentication middleware verifies the user's identity.
3. The server validates the submitted data.
4. Application logic applies the appropriate rules.
5. MongoDB stores the ticket or related information.
6. The API returns a response to the client.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Typed application development |
| Vite | Frontend development tooling |
| Node.js | Backend runtime |
| Express 5 | REST API and routing |
| MongoDB | Persistent data storage |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Inno Setup | Windows installer |
| WinSW | Windows service management |

## Running River on Windows

The recommended way to try River is to use the Windows installer linked above.

After installation, access the application locally:

**Application:** [http://127.0.0.1:5000](http://127.0.0.1:5000)

The installer configures the application and database services. River's database and configuration are stored separately from the application files so that they can be retained during application maintenance and upgrades.

Always back up application data and configuration before performing maintenance or uninstalling software.

## Development Setup

If you want to explore the source code or contribute to development, you can run River from the repository.

### Prerequisites

- Git
- Node.js and npm
- MongoDB

### 1. Clone the repository

```bash
git clone https://github.com/feeridev/River.git
cd River
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create a `.env` file from the provided example:

```bash
cp .env.example .env
```

Configure the required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/river
JWT_SECRET=replace_with_a_long_random_secret
```

Generate a strong JWT secret locally:

```bash
openssl rand -hex 32
```

Put the generated value in `JWT_SECRET`. Never commit your actual `.env` file or production secrets.

### 3. Start MongoDB

Make sure MongoDB is installed and running, and that `MONGODB_URI` points to the correct database.

On Linux systems using systemd, the service may be started with:

```bash
sudo systemctl start mongod
```

The service name and startup procedure can vary by operating system and installation method.

### 4. Start the backend

From the `server` directory:

```bash
npm run dev
```

The API should be available at:

`http://127.0.0.1:5000`

You can check its health endpoint at:

`http://127.0.0.1:5000/api/health`

### 5. Start the frontend

Open a second terminal from the repository root:

```bash
cd client
npm install
npm run dev
```

Vite normally serves the development frontend at:

`http://localhost:5173`

### 6. Build the backend

From the `server` directory:

```bash
npm run build
npm start
```

Check the `package.json` files in `server` and `client` for the available scripts and their exact behavior.

## API Overview

The local API base URL is:

`http://127.0.0.1:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API health |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/auth/me` | Retrieve the authenticated user's identity |
| `POST` | `/api/tickets` | Create a ticket |

Additional API routes support ticket retrieval, ticket updates, status management, and conversations.

Protected endpoints use bearer-token authentication:

```http
Authorization: Bearer <your-token>
```

## Ticket Categories, Priorities, and Statuses

**Categories**

- Hardware
- Software
- Network
- Account
- Access
- Other

**Priorities**

- Low
- Medium
- High
- Critical

**Statuses**

- Open
- In Progress
- Resolved
- Closed

## Project Structure

```text
River/
├── client/                  # React frontend
├── server/                  # Express backend
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
├── installer/               # Windows installer configuration
├── .gitignore
└── README.md
```

## Roadmap

- [x] User registration and authentication
- [x] Password hashing and JWT authentication
- [x] Ticket creation and retrieval
- [x] Ticket details and conversations
- [x] Ticket status management
- [x] Dashboard and ticket filtering
- [x] MongoDB persistence
- [x] Windows installer and service configuration
- [ ] Complete administrative tools
- [ ] Complete agent workflows and ticket assignment
- [ ] Expand automated test coverage
- [ ] Improve deployment and upgrade documentation
- [ ] Publish versioned releases with stable downloads

## Development Philosophy

River is built incrementally, with an emphasis on practical functionality, secure authentication, maintainable architecture, and reliable local deployment.

The goal is to create a useful helpdesk application that can run on a customer's own machine or server without requiring a hosted SaaS platform.

## Author

**Farshad Safarkhanloo**

- GitHub: [@feeridev](https://github.com/feeridev)
- Repository: [github.com/feeridev/River](https://github.com/feeridev/River)

---

<p align="center">
  <sub>River — a self-hosted helpdesk application under active development.</sub>
</p>
