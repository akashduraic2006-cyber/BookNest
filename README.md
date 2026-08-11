# BookNest – Digital Library

A simple full-stack digital library system built for a hackathon/college project using the **MERN stack** (MongoDB, Express, React, Node.js).

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, React Context API (for auth state — no Redux, kept simple)

## Folder Structure

```
BookNest/
├── backend/
│   ├── config/db.js          -> connects to MongoDB
│   ├── models/                -> Mongoose schemas (User, Book, Category, Transaction, Reservation)
│   ├── controllers/           -> the actual logic for each route
│   ├── routes/                -> maps URLs (e.g. /api/books) to controllers
│   ├── middleware/auth.js     -> protect (JWT check) + authorize (role check)
│   ├── seed.js                -> fills the database with demo data
│   └── server.js              -> app entry point
└── frontend/
    └── src/
        ├── api/axios.js       -> axios instance that auto-attaches the JWT token
        ├── context/AuthContext.jsx -> shares logged-in user across the app
        ├── components/        -> Navbar, ProtectedRoute, BookCard, dashboard widgets
        └── pages/              -> Catalog, BookDetails, Login, Register, MyBooks, LibrarianDashboard
```

## How the core features work

- **Auth:** Register/login hashes passwords with bcrypt and issues a JWT. The token is stored in
  `localStorage` and sent as `Authorization: Bearer <token>` on every API call (see `api/axios.js`).
- **Roles:** Every user has a role — `member`, `librarian`, or `admin`. The `authorize()` middleware
  on the backend blocks certain routes (like adding books) to non-staff.
- **Catalog / Search / Pagination:** `GET /api/books?search=...&category=...&page=...` builds a
  MongoDB query dynamically and returns paged results.
- **Borrowing:** Any logged-in user can "Borrow" an available book (`POST /api/transactions/issue`),
  which decreases `availableCopies` and sets a due date 14 days later. Returning
  (`PUT /api/transactions/:id/return`) increases it back.
- **Overdue:** No background job needed — a transaction is "overdue" simply if
  `dueDate < now` and it hasn't been returned yet.
- **Reservations:** If a book has 0 copies available, users can reserve it instead of borrowing.
- **Dashboard:** Librarians/admins see stats, manage books/categories, and view overdue &
  reservation lists at `/dashboard`.

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run seed   # inserts demo categories, books and users
npm run dev    # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # starts React on http://localhost:5173
```

### 3. Demo Logins (password for all: `password123`)

| Role      | Email                    |
|-----------|---------------------------|
| Admin     | admin@booknest.com        |
| Librarian | librarian@booknest.com    |
| Member    | member@booknest.com       |

You can also register your own account (defaults to `member` role).

## Environment Variables (`backend/.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/booknest
JWT_SECRET=booknest_super_secret_key_change_this
JWT_EXPIRES_IN=7d
```

Make sure MongoDB is running locally (or replace `MONGO_URI` with your MongoDB Atlas connection
string) before starting the backend.
