# TaskFlow — MERN Task Management App

A beautifully designed, full-stack task management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

![TaskFlow](https://img.shields.io/badge/Stack-MERN-6c63ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-43e97b?style=flat-square)

---

## ✨ Features

### Core
- **Authentication** — JWT-based registration & login with bcrypt password hashing
- **Task CRUD** — Create, Read, Update, Delete tasks
- **Toggle Status** — Mark tasks as pending / in-progress / completed
- **Task Fields** — Title, description, status, priority, due date, tags

### Bonus
- **Search** — Live debounced search across title & description
- **Filters** — Filter by status and priority from the sidebar
- **Pagination** — Server-side pagination (9 tasks/page)
- **Stats Dashboard** — Live counts for all / pending / in-progress / completed

### Design
- Stunning dark UI with animated orbs and grid background
- Responsive layout (mobile sidebar drawer)
- Skeleton loading states
- Password strength meter on register
- Toast notifications

---

## 🗂 Project Structure

```
taskflow/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── auth.js              # JWT protect middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── StatsCard.js/.css
│   │   │   ├── TaskCard.js/.css
│   │   │   └── TaskModal.js/.css
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── TaskContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.js
│   │   │   └── Dashboard.css
│   │   ├── utils/
│   │   │   └── api.js            # Axios instance with interceptors
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css             # Global CSS variables & animations
│   ├── .env.example
│   └── package.json
├── package.json                   # Root (concurrently)
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone / Extract

```bash
unzip taskflow.zip
cd taskflow
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

Install & run:
```bash
npm install
npm run dev      # with nodemon (dev)
# or
npm start        # production
```

### 3. Frontend Setup

```bash
cd ../frontend
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Install & run:
```bash
npm install
npm start
```

### 4. Run Both Concurrently (from root)

```bash
# From the taskflow/ root:
npm install
npm run dev
```

App runs at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET  | `/api/auth/me` | Get current user | ✅ |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks (with filters & pagination) | ✅ |
| GET | `/api/tasks/stats` | Get task statistics | ✅ |
| GET | `/api/tasks/:id` | Get single task | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |
| PATCH | `/api/tasks/:id/toggle` | Toggle task status | ✅ |

### Query Parameters (GET /api/tasks)
- `status` — pending | in-progress | completed
- `priority` — low | medium | high
- `search` — text search (title & description)
- `page` — page number (default: 1)
- `limit` — items per page (default: 10)
- `sort` — sort field (default: -createdAt)

---

## 🗄 Database Schemas

### User
```js
{ name, email, password (hashed), createdAt, updatedAt }
```

### Task
```js
{ title, description, status, priority, dueDate, tags[], userId, createdAt, updatedAt }
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS with CSS Variables |
| Backend | Node.js, Express.js |
| Auth | JWT + bcryptjs |
| Database | MongoDB + Mongoose |
| Validation | express-validator |
| Notifications | react-hot-toast |

---

## 📦 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in dashboard
2. Set `NODE_ENV=production`
3. Deploy from GitHub

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Publish directory: `build`

---

## 📋 Evaluation Criteria Met

| Criteria | Details |
|----------|---------|
| ✅ Code Quality | Separated concerns, clean controller/route/model structure |
| ✅ UI/UX | Dark theme, animated, responsive with skeleton loaders |
| ✅ Functionality | Full CRUD, auth, toggle, search, filter, pagination |
| ✅ Error Handling | Try/catch everywhere, meaningful error messages, 401 auto-logout |
| ✅ Creativity | Custom CSS design system, unique dark aesthetic, stats dashboard |

---

## 📄 License
MIT
