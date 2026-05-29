# TaskFlow

> A full-stack task management system built with the MERN stack. Features a Kanban board UI, drag-and-drop task management, JWT authentication, real-time notifications, and a clean dark design system.

---

## 📸 Overview

TaskFlow gives every user a personal workspace of boards. Each board contains three Kanban columns — **To Do**, **In Progress**, and **Done** — where tasks can be dragged between columns. An in-app notification system tracks every action (task created, moved, edited, deleted, overdue) and surfaces them in a live bell-icon dropdown.

---

## 🗂 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Local Setup](#-local-setup)
  - [1. MongoDB Atlas](#step-1--mongodb-atlas)
  - [2. Backend](#step-2--backend)
  - [3. Frontend](#step-3--frontend)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Notification System](#-notification-system)
- [Deployment](#-deployment)
  - [Backend → Render](#backend--render)
  - [Frontend → Vercel](#frontend--vercel)
- [Scripts](#-scripts)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend framework** | React | 18.2 |
| **Build tool** | Vite | 5.0 |
| **Styling** | Tailwind CSS | 3.4 |
| **Routing** | React Router DOM | 6.21 |
| **State management** | Redux Toolkit + React-Redux | 2.1 / 9.1 |
| **Drag & drop** | react-dnd + HTML5 backend | 16.0 |
| **HTTP client** | Axios | 1.6 |
| **Toast notifications** | react-hot-toast | 2.4 |
| **Backend runtime** | Node.js | 18+ |
| **Backend framework** | Express.js | 4.18 |
| **Database** | MongoDB Atlas (Mongoose) | 8.0 |
| **Authentication** | JWT + bcryptjs | 9.0 / 2.4 |
| **Dev server** | nodemon | 3.0 |

---

## ✨ Features

### Authentication
- User registration and login with email + password
- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens stored in `localStorage`, attached to every API request via Axios interceptor
- Automatic redirect to `/login` on 401 responses
- Protected routes — unauthenticated users cannot access any board or dashboard page

### Dashboard
- Personal workspace showing all user boards
- Board cards display title, color accent, task count, and creation date
- One-click board creation with a modal form
- Board deletion with cascade — removes all associated tasks
- Empty state with CTA when no boards exist

### Kanban Board
- Three columns: **To Do** · **In Progress** · **Done**
- Task cards show title, description preview, priority badge, and due date
- Overdue tasks highlighted with a red left-border accent and warning icon
- Add tasks from column header button or bottom "+ Add a task" footer
- Click any task card to open the edit modal

### Drag & Drop
- Powered by `react-dnd` with HTML5 backend
- Drag a task card to any column to change its status
- Optimistic UI update — card moves instantly before the API call resolves
- On API failure, card snaps back to original column
- Drop zones show a visual highlight when a dragged card hovers over them

### Task Management
- Fields: title (required), description, status, priority (Low / Medium / High), due date
- Create and edit in a single unified modal
- Delete with a hover-reveal × button on each card
- Inline priority color-coding: green (low), amber (medium), red (high)
- Due date input formats correctly for display and for the date picker

### Notification System
- Bell icon in navbar with animated unread count badge
- 7 notification types with distinct icons and colours
- Dropdown panel: mark one read, mark all read, dismiss one, clear all
- Click any notification to navigate directly to the relevant board
- Overdue checker runs on page load and polls every 60 seconds
- Each overdue task triggers at most one notification per calendar day
- Notifications auto-expire after 30 days via MongoDB TTL index

### UI / UX
- Dark design system with indigo/violet accent palette
- Custom scrollbar styling
- Smooth transitions and micro-animations on cards, modals, and dropdowns
- Responsive layout — works on mobile, tablet, and desktop
- Google Fonts: Syne (headings) · DM Sans (body) · JetBrains Mono (code/dates)

---

## 📁 Project Structure

```
taskflow/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js         # register, login, getMe
│   │   ├── boardController.js        # CRUD boards + notifications
│   │   ├── taskController.js         # CRUD tasks + notifications
│   │   └── notificationController.js # fetch, read, delete, overdue check
│   │
│   ├── middleware/
│   │   └── auth.js                   # JWT verification middleware
│   │
│   ├── models/
│   │   ├── User.js                   # name, email, hashed password
│   │   ├── Board.js                  # title, userId, color
│   │   ├── Task.js                   # title, description, status, dueDate, priority, boardId
│   │   └── Notification.js           # type, title, message, read, meta, TTL index
│   │
│   ├── routes/
│   │   ├── auth.js                   # POST /register  POST /login  GET /me
│   │   ├── boards.js                 # GET POST DELETE /boards
│   │   ├── tasks.js                  # GET POST PUT DELETE /tasks
│   │   └── notifications.js          # GET PATCH DELETE /notifications
│   │
│   ├── services/
│   │   └── notificationService.js    # createNotification() helper
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                     # Express app, MongoDB connect, route registration
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js              # Axios instance with JWT interceptor + 401 handler
    │   │
    │   ├── components/
    │   │   ├── AddTaskModal.jsx       # Create + Edit task (unified modal)
    │   │   ├── BoardCard.jsx          # Dashboard board card with delete
    │   │   ├── Column.jsx             # Drop target column with task list
    │   │   ├── Navbar.jsx             # Top nav with logo, bell, user, logout
    │   │   ├── NotificationPanel.jsx  # Bell dropdown with full notification UI
    │   │   ├── ProtectedRoute.jsx     # Redirects unauthenticated users
    │   │   ├── Spinner.jsx            # Inline + full-page loading spinners
    │   │   └── TaskCard.jsx           # Draggable task card with priority/overdue
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx              # Sign-in form
    │   │   ├── Register.jsx           # Sign-up form
    │   │   ├── Dashboard.jsx          # Board grid + create board modal
    │   │   └── BoardPage.jsx          # Kanban view with DnD provider
    │   │
    │   ├── store/
    │   │   ├── index.js               # configureStore — all reducers
    │   │   └── slices/
    │   │       ├── authSlice.js        # login/register thunks, token persistence
    │   │       ├── boardsSlice.js      # boards CRUD thunks
    │   │       ├── tasksSlice.js       # tasks CRUD + optimistic DnD update
    │   │       └── notificationsSlice.js # fetch, read, delete, overdue thunks
    │   │
    │   ├── utils/
    │   │   └── helpers.js             # formatDate, isOverdue, getPriorityConfig, etc.
    │   │
    │   ├── App.jsx                    # Router + Provider + Toaster
    │   ├── index.css                  # Tailwind directives + global design tokens
    │   └── main.jsx                   # ReactDOM.createRoot entry point
    │
    ├── .env                           # VITE_API_URL
    ├── .gitignore
    ├── index.html                     # Font imports, root div
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js                 # Dev proxy → backend :5000
```

---

## 🔧 Prerequisites

Before you begin, make sure you have:

- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **npm** v9+ (comes with Node) or **yarn**
- A free **MongoDB Atlas** account → [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- A modern browser (Chrome, Firefox, Edge, Safari)

---

## 🚀 Local Setup

### Step 1 — MongoDB Atlas

1. Sign up or log in at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Click **Create** → choose the **M0 Free** cluster → pick any region → click **Create**.
3. Under **Database Access** → **Add New Database User**:
   - Authentication: Password
   - Username: e.g. `taskflow-user`
   - Password: generate a secure password — **save it**
   - Role: `Read and write to any database`
4. Under **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
5. Back on **Database** → click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your credentials. Append your DB name before the `?`:
   ```
   mongodb+srv://taskflow-user:yourpass@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
   ```

---

### Step 2 — Backend

```bash
# Navigate into the backend folder
cd taskflow/backend

# Copy environment template
cp .env.example .env
```

Open `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://taskflow-user:yourpass@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_string_at_least_32_chars
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> **Tip:** generate a strong JWT secret with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
> ```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Expected output:
```
Connected to MongoDB
Server running on port 5000
```

Verify by visiting: [http://localhost:5000/api/health](http://localhost:5000/api/health)
Expected response: `{ "status": "ok", "message": "TaskFlow API running" }`

---

### Step 3 — Frontend

Open a **new terminal tab**:

```bash
cd taskflow/frontend
```

The `.env` file is already configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

No changes needed. Install and start:

```bash
npm install
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌍 Environment Variables

### Backend — `/backend/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens — keep private, min 32 chars |
| `PORT` | ❌ | Port to run the server on (default: `5000`) |
| `FRONTEND_URL` | ❌ | Allowed CORS origin (default: `*`) — set to your Vercel URL in production |

### Frontend — `/frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Base URL for all API calls (e.g. `http://localhost:5000/api`) |

---

## 📡 API Reference

All protected routes require the header:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `POST` | `/register` | ❌ | `{ name, email, password }` | Create account, returns JWT |
| `POST` | `/login` | ❌ | `{ email, password }` | Sign in, returns JWT |
| `GET` | `/me` | ✅ | — | Get current authenticated user |

**Register / Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Jane", "email": "jane@example.com" }
}
```

---

### Boards — `/api/boards`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/` | ✅ | — | List all boards for the current user |
| `POST` | `/` | ✅ | `{ title, color? }` | Create a new board |
| `DELETE` | `/:id` | ✅ | — | Delete board and all its tasks |

**Board object:**
```json
{
  "_id": "...",
  "title": "My Project",
  "userId": "...",
  "color": "#6366f1",
  "taskCount": 5,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| `GET` | `/:boardId` | ✅ | — | Get all tasks for a board |
| `POST` | `/` | ✅ | `{ title, boardId, description?, status?, dueDate?, priority? }` | Create a task |
| `PUT` | `/:id` | ✅ | Any task fields | Update a task (used for edits and drag & drop) |
| `DELETE` | `/:id` | ✅ | — | Delete a task |

**Task object:**
```json
{
  "_id": "...",
  "title": "Design login screen",
  "description": "Use Figma, dark mode first",
  "status": "doing",
  "priority": "high",
  "dueDate": "2024-02-01T00:00:00.000Z",
  "boardId": "...",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

**Status values:** `todo` · `doing` · `done`
**Priority values:** `low` · `medium` · `high`

---

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/` | ✅ | Fetch up to 30 latest notifications + unread count |
| `PATCH` | `/:id/read` | ✅ | Mark a single notification as read |
| `PATCH` | `/read-all` | ✅ | Mark all notifications as read |
| `DELETE` | `/:id` | ✅ | Delete a single notification |
| `DELETE` | `/` | ✅ | Clear all notifications |
| `POST` | `/check-overdue` | ✅ | Scan tasks for overdue items and create notifications |

**Notification object:**
```json
{
  "_id": "...",
  "userId": "...",
  "type": "task_moved",
  "title": "Task Moved",
  "message": "\"Design login screen\" moved from To Do to In Progress.",
  "read": false,
  "meta": {
    "boardId": "...",
    "boardTitle": "My Project",
    "taskId": "...",
    "taskTitle": "Design login screen"
  },
  "createdAt": "2024-01-15T11:30:00.000Z"
}
```

---

## 🔔 Notification System

### Notification Types

| Type | Icon | Triggered by |
|---|---|---|
| `board_created` | 📋 | Creating a new board |
| `board_deleted` | 🗑️ | Deleting a board (includes task count) |
| `task_created` | ✅ | Adding a task to any board |
| `task_updated` | ✏️ | Editing a task's title, description, priority, or due date |
| `task_moved` | 🔀 | Dragging a task between columns |
| `task_deleted` | 🗑️ | Deleting a task |
| `task_overdue` | ⚠️ | Any non-done task past its due date (max once per day per task) |

### How the Overdue Checker Works

1. On every board page load, the frontend dispatches `checkOverdue`.
2. The backend scans all tasks owned by the user where `dueDate < now` and `status !== "done"`.
3. For each overdue task, it checks whether a `task_overdue` notification was already created **today**.
4. If not, it creates one.
5. The frontend then re-fetches the notification list.
6. This cycle also repeats automatically every **60 seconds** while the user is active.

### Auto-Expiry

Notifications are stored with a **MongoDB TTL index** on `createdAt` set to 30 days (2,592,000 seconds). MongoDB's background thread automatically deletes expired documents — no cron job or manual cleanup required.

---

## 🌐 Deployment

### Backend → Render

1. Push the `/backend` folder to a GitHub repository.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo.
4. Configure the service:

| Setting | Value |
|---|---|
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

5. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `FRONTEND_URL` | Your Vercel frontend URL (set after deploying frontend) |

6. Click **Create Web Service**. Render will deploy and give you a URL like:
   `https://taskflow-api.onrender.com`

---

### Frontend → Vercel

1. Push the `/frontend` folder to a GitHub repository (can be the same mono-repo).
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo.
3. Configure the project:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://taskflow-api.onrender.com/api` |

5. Click **Deploy**. Vercel gives you a URL like:
   `https://taskflow.vercel.app`

6. Go back to your Render service → **Environment** → update `FRONTEND_URL` to your Vercel URL → **Save** (triggers a redeploy).

---

## 📜 Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on file changes) |
| `npm start` | Start in production mode |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `localhost:5173` |
| `npm run build` | Build for production into `/dist` |
| `npm run preview` | Preview the production build locally |

---

## 🧪 Quick Test Walkthrough

After both servers are running:

1. Open [http://localhost:5173](http://localhost:5173)
2. Click **Create one** → fill in name, email, password → **Create Account**
3. You land on the Dashboard — click **New Board** → name it → **Create**
4. Click the board card → you're in the Kanban view
5. Click **Add Task** → fill title, set priority to **High**, pick a past date → **Create Task**
   - Bell badge should show **1** (task created notification)
   - The task card will have a red overdue highlight
6. Drag the task from **To Do** to **In Progress**
   - Bell badge increments (task moved notification)
7. Click the task card to open edit modal → change the title → **Update Task**
8. Hover the card → click **×** to delete
9. Click the bell icon → review all notifications
10. Click **Mark all read** → badge disappears
11. Click a notification → navigates to the board

---

## 🐛 Troubleshooting

**`MongooseServerSelectionError` / Can't connect to MongoDB**
- Double-check your `MONGO_URI` in `.env` — username and password must be URL-encoded if they contain special characters.
- In Atlas → Network Access → confirm `0.0.0.0/0` is listed.
- Ensure your cluster is not paused (free tier clusters pause after 60 days of inactivity).

**`401 Unauthorized` on all API requests**
- Make sure the frontend `.env` has `VITE_API_URL` pointing to the correct backend URL.
- Check that `JWT_SECRET` in the backend `.env` hasn't changed since tokens were issued.

**Drag & drop not working**
- Ensure `react-dnd` and `react-dnd-html5-backend` versions match (`^16.0.1`).
- The `DndProvider` wraps the column grid in `BoardPage.jsx` — do not nest multiple providers.

**Vite proxy not forwarding requests**
- The `vite.config.js` proxies `/api` → `http://localhost:5000` only in dev mode.
- If you changed the backend port, update both `backend/.env` (`PORT`) and `frontend/vite.config.js`.

**Notifications not appearing**
- Open the browser console — look for failed `POST /api/notifications/check-overdue` requests.
- Confirm the backend is running and the `Notification` model has been registered in `server.js`.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with the MERN stack — MongoDB · Express · React · Node.js*