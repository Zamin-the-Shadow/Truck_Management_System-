<<<<<<< HEAD
# Zamin Logistics - Truck Dispatching Management System

A COMPLETE production-ready Truck Dispatching Management System built with **Next.js (App Router)**, **Vanilla CSS**, and **MongoDB**.

## Features
- **High-Performance UI**: Custom vanilla CSS modules, high-fi dark theme (`globals.css`), fully responsive. No Tailwind or heavy UI libs.
- **Role-Based Access Control**: Secure routes for `Admin`, `Company/Shipper`, and `Driver/Carrier` using Next.js Middleware and HTTP-only cookies.
- **Load Management**: End-to-end load request, dispatching, and tracking.
- **Quote System**: Admins submit quotes to companies for pending loads.
- **Real-Time Polling**: Dashboards refresh automatically every 30 seconds to fetch latest updates without needing rigorous WebSockets.

## Tech Stack
- Frontend: Next.js (App Router), Vanilla CSS, React
- Backend: Next.js API Routes (Node.js/Edge)
- Database: MongoDB (Mongoose)
- Security: bcryptjs (Password hashing), jose (JWT signing/verifying for Edge compatibility)

## Setup Instructions

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file at the root. Use `.env.example` as a template:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_string
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Application Flow & Testing
1. **Register as Admin** -> Login to Admin Console.
2. **Register as Company** -> Request a New Load.
3. **Admin** -> Sees pending load request, assigns a driver and sends a quote.
4. **Company** -> Accepts/Rejects quote.
5. **Driver** -> Logs in, sees assigned load, updates status (Picked Up -> In Transit -> Delivered).

## API Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate & set cookie
- `GET /api/auth/me` - Get current session user
- `POST /api/auth/logout` - Clear session cookie
- `GET/POST /api/loads` - Get loads list or Request a new load
- `PATCH/DELETE /api/loads/[id]` - Update load status / assign driver / delete
- `GET /api/drivers` - Fetch list of active drivers (Admin only)
- `GET/POST /api/quotes` - Fetch quotes or Submit quote
- `PATCH/DELETE /api/quotes/[id]` - Accept/Reject quote
=======
# Truck_Management_System-
Zamin Logistics - Truck Dispatch System A full-stack web application for managing freight and dispatching. Built with Next.js App Router and MongoDB, it features secure role-based portals for Admins, Shippers, and Carriers, real-time load management, and an integrated quoting system.
>>>>>>> 5cb8700511165aaee8861d9b60c2ebc657a1b945
