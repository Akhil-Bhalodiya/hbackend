# Hibiscus Backend API (Node.js + Express + MongoDB)

This is the dedicated backend REST API project for the Hibiscus website, providing Admin Authentication (JWT + bcrypt) and Job Openings Management.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Token (JWT) & bcryptjs password hashing
- **Middleware**: CORS, Morgan (logger), Error Handler

---

## 📁 Directory Structure

```
backend/
├── config/
│   └── db.js            # Mongoose MongoDB connection setup
├── controllers/
│   ├── authController.js# Admin Login & Profile controllers
│   └── jobController.js # Job Openings CRUD controllers
├── middleware/
│   ├── authMiddleware.js# JWT Authentication protection middleware
│   └── errorHandler.js  # Global Express error handler
├── models/
│   ├── Admin.js         # Admin user model (password hashing)
│   └── Job.js           # Job opening model (matching frontend schema)
├── routes/
│   ├── authRoutes.js    # Routes for /api/auth
│   └── jobRoutes.js     # Routes for /api/jobs
├── scripts/
│   └── seedAdmin.js     # Seed script for default admin & initial job postings
├── .env.example         # Environment template
├── .env                 # Environment variables file
├── package.json         # Dependencies and scripts
└── server.js            # Express server entry point
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v16+)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### 2. Install Dependencies
Navigate to the `backend` folder and run:
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (already populated with defaults):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/hibiscus_db
JWT_SECRET=hibiscus_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_ORIGIN=http://localhost:5173
```

### 4. Seed Default Admin & Sample Job Openings
Run the seed script to create the initial admin user and job listings in MongoDB:
```bash
npm run seed
```

**Default Admin Credentials:**
- **Email**: `admin@hibiscus.com`
- **Password**: `admin123`

### 5. Start the Server
- **Development Mode** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

---

## 🔗 API Endpoint Reference

### 🔐 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates admin using email & password, returns JWT token |
| `GET` | `/api/auth/me` | Protected (Admin) | Returns current authenticated admin user profile |

**Sample Login Request Body:**
```json
{
  "email": "admin@hibiscus.com",
  "password": "admin123"
}
```

---

### 💼 Job Openings Endpoints (`/api/jobs`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | Public | Get all active job openings |
| `GET` | `/api/jobs/:id` | Public | Get single job opening details by ID |
| `POST` | `/api/jobs` | Protected (Admin) | Create a new job opening |
| `PUT` | `/api/jobs/:id` | Protected (Admin) | Update an existing job opening |
| `DELETE` | `/api/jobs/:id` | Protected (Admin) | Delete a job opening |

**Sample Job Creation Request Body:**
```json
{
  "title": "Senior Regulatory Affairs Consultant",
  "department": "Quality & Compliance",
  "location": "Ahmedabad (Hybrid)",
  "type": "Full-Time",
  "experience": "5 - 8 Years",
  "desc": "Lead USFDA audit readiness and dossier submissions for formulation plants.",
  "requirements": [
    "M.Pharm in Regulatory Affairs",
    "5+ years in USFDA/MHRA audit compliance"
  ],
  "status": "Active"
}
```

---

## ⚡ Connecting Frontend with Backend (When Ready)

To connect the React frontend (`hibiscus`) to this backend in the future:

1. **Set API Base URL in React**:
   ```javascript
   const API_URL = 'http://localhost:5000/api';
   ```

2. **Login Admin in `AdminDashboard.jsx`**:
   ```javascript
   const response = await fetch('http://localhost:5000/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email: adminEmail, password: passcode }),
   });
   const data = await response.json();
   if (data.success) {
     localStorage.setItem('admin_token', data.token);
   }
   ```

3. **Fetch Jobs in `Careers.jsx`**:
   ```javascript
   useEffect(() => {
     fetch('http://localhost:5000/api/jobs')
       .then((res) => res.json())
       .then((data) => setOpenings(data.data));
   }, []);
   ```

4. **Post Job with Authorization Header**:
   ```javascript
   await fetch('http://localhost:5000/api/jobs', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
     },
     body: JSON.stringify(newJob)
   });
   ```
