# GadgetHub — Premium E-Commerce Web Application

Live Link : https://e-commerce-web-application-ofp0su4mc.vercel.app/
**GadgetHub** is a production-ready, full-stack e-commerce web application specializing in premium mobiles, laptops, and consumer electronics. Built using the **MERN (MongoDB, Express, React, Node.js)** stack, it delivers a secure, highly interactive user experience alongside a robust admin management dashboard.

---

##  Key Features

###  Customer Experience
*   **Dynamic Catalog**: Browse and filter premium smartphones, high-performance laptops, and accessories.
*   **Intuitive Shopping Cart**: Real-time cart calculations, responsive updates, and persistent user sessions.
*   **Secure Authentication**: JWT-based user registration and login with local token management.
*   **Order Tracking**: Simple and seamless checkout with complete order history and real-time statuses.
*   **Polished UX**: Modern layouts, responsive styling, active state highlights, and premium interactive elements.

### Admin Control Panel
*   **Dashboard Analytics**: Visual counters for total products, orders, pending items, and delivered sales.
*   **Product Management**: Full CRUD interface for adding, editing, and deleting inventory items.
*   **Order Fulfillment**: Live system to monitor incoming orders and update delivery states.

---

## Technology Stack

| Layer | Technology | Key Capabilities |
| :--- | :--- | :--- |
| **Frontend** | **React (Vite)** | Reactive single-page UI, client-side routing, hooks-driven state |
| **Styling** | **Tailwind CSS** | Premium modern layouts, dark/glassmorphic effects, responsive grid |
| **Backend** | **Node.js + Express** | RESTful routing, MVC controller layers, custom auth middleware |
| **Database** | **MongoDB (Mongoose)**| Document schemas, dynamic queries, relational lookups |
| **Security** | **JWT & Bcrypt** | Automatic password hashing, verified bearer-token access control |

---

## Project Structure

```text
e-com-app/
├── backend/                  # Node.js + Express backend service
│   ├── config/               # DB connection configuration
│   ├── controllers/          # Business logic controllers (auth, products, orders)
│   ├── middleware/           # Route guards (auth protect, admin verification)
│   ├── models/               # Mongoose DB schemas (User, Product, Order)
│   ├── routes/               # API endpoints declarations
│   ├── seed/                 # Database seed scripts
│   └── server.js             # Main server entrypoint
│
└── frontend/                 # React + Vite frontend application
    ├── public/               # Static icons and assets
    ├── src/                  # React source files
    │   ├── components/       # Reusable layout and ui components
    │   ├── context/          # React Auth and Cart contexts
    │   ├── pages/            # Page components (Home, Mobiles, Cart, Admin panels)
    │   └── services/         # Axios central API clients
    ├── vercel.json           # Vercel SPA route rewrite rules
    └── vite.config.js        # Vite bundler configurations
```

---

## ⚙️ Local Development Guide

To run this application locally, you will need **Node.js** and a **MongoDB** connection string.

### 1. Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce-db
   JWT_SECRET=your_jwt_secret_here
   ```
4. Seed the database with catalog items:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Setup the Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React client:
   ```bash
   npm run dev
   ```

Open your browser and visit **`http://localhost:5173`** to access the application!

---
