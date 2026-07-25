<div align="center">

```text
 __   __ _   ___ _____ ___    _   __      ____ ___  ___ 
 \ \ / //_\ / __|_   _| _ \  / \  \ \    / /|_ _/ __|| __|
  \ V // _ \\__ \ | | |   / / _ \  \ \/\/ /  | |\__ \| _| 
   \_//_/ \_\___/ |_| |_|_\/_/ \_\  \_/\_/  |___|___/|___|
```

# ✨ VastraWise — Men's Wardrobe & Groom Rental Manager
### *Next-Generation Men's Fashion, Sherwani & Luxury Groom Wear Rental Management Platform*

  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-key-highlights--core-capabilities">Key Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-api-endpoint-reference">API Reference</a> •
    <a href="#-quick-start-guide">Quick Start</a>
  </p>

  <br />

  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![JWT Security](https://img.shields.io/badge/Security-JWT%20%2B%20HTTP--Only%20Cookies-FF4B4B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <br />
  <hr />

</div>

<br />

## 🌟 Overview

**VastraWise** is an enterprise-ready, full-stack rental management system tailored specifically for **Men's Clothing Stores, Royal Groom Wear Boutiques, Traditional Men's Ethnic Outfits (Sherwanis, Indo-Western, Jodhpuri Bandhgalas, Kurta Sets), and Black-Tie Tuxedo Rentals**.

Engineered with a **decoupled MERN architecture** — a high-performance **Next.js frontend** powered by Turbopack paired with an **Express.js & MongoDB Atlas backend** — VastraWise offers automated invoice-to-inventory status syncing, Chest/Waist garment sizing, Trial/Fitting schedule tracking, Refundable Security Deposit management, Included Accessories checklists (Safas, Kalgis, Dupattas, Mojaris), dual-tier Role-Based Access Control (RBAC), and real-time revenue analytics.

<br />

---

## ⚡ Key Highlights & Core Capabilities

### 🛡️ Enterprise Security & Role-Based Access Control (RBAC)
- **Two-Tier Role Hierarchy**:
  - 👑 **Admin (Shop Owner)**: Unrestricted system access — full CRUD over inventory, customer databases, revenue analytics reports, and employee access controls.
  - 👔 **Worker (Store Staff)**: Operational access — create orders, check outfit availability, register customers, and issue invoices while restricted from deleting records or viewing store financial reports.
- **Dual-Token Authentication Architecture**:
  - **Access Token**: Short-lived (15 minutes) JWT kept in volatile memory only — **zero local storage exposure to combat XSS attacks**.
  - **Refresh Token**: Long-lived (7 days) JWT stored inside an **HTTP-only, SameSite cookie** for seamless silent token renewal.
- **Bcrypt Password Security**: Salted 12-round bcrypt password hashing for all staff accounts.

---

### 🤵 Men's Wardrobe & Groom Inventory Engine
- **Live Status Tracking**: Automatic state lifecycle management across `available`, `rented`, and `maintenance`.
- **Men's Category Focus**: Instant filtering across Sherwani, Indo-Western, Jodhpuri, Tuxedo & Suit, Kurta Set, and Accessories.
- **Men's Sizing Specifications**: Granular Chest Size (36" - 48"), Waist Size (28" - 40"), and Fit Type (`Slim Fit`, `Regular Fit`, `Royal Tailored`).
- **Groom Accessory Checklists**: Track included items such as Safa/Turban, Brooch, Dupatta/Stole, Pearl Mala, and Mojaris.
- **Refundable Security Deposit Tracker**: Monitor active deposit liabilities held vs. refunded.

---

### 🧾 Atomic Billing & Automated Lifecycle Sync
- **Smart Invoice Generation**: Creates digital rental invoices with auto-generated tracking numbers.
- **Bi-directional State Sync**:
  - Creating an invoice automatically shifts the outfit status to `rented` and increments customer rental counts & lifetime spend in MongoDB.
  - Completing or cancelling an invoice automatically restores outfit availability to `available`.

---

### 📊 Real-Time Business Analytics & Reporting
- **Revenue Dashboards**: Track daily revenue, total active rentals, and historical customer lifetime value.
- **Customer Lifetime Value (LTV)**: Semi-automated customer analytics profiling top spenders and frequent renters.
- **Inventory Utilization Rates**: Visual breakdown of inventory performance.

---

### 👥 Staff & Employee Management Console
- **Admin Control Center**: Create, edit, and manage worker credentials in real-time.
- **Instant Access Revocation**: Toggle worker account status (`Active` / `Deactivated`) instantly to block access without deleting historical transaction logs.

<br />

---

## 🏗️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │       Client (Web Application)         │
                               │        Next.js 16 + React 19           │
                               └───────────────────┬────────────────────┘
                                                   │
                                    REST API (JSON + Bearer JWT)
                                     & HTTP-Only Refresh Cookies
                                                   │
                               ┌───────────────────▼────────────────────┐
                               │           Express.js Server            │
                               │      (Port 5000 / API Middleware)      │
                               └─────┬──────────────┬──────────────┬────┘
                                     │              │              │
                    ┌────────────────┴──┐   ┌───────┴────────┐   ┌─┴────────────────┐
                    │ Auth & Role Guards│   │  Route Logic   │   │ Pre-Save Hooks   │
                    │ (protect/require) │   │ (O/C/I/U/Auth) │   │ (Bcrypt / AutoID)│
                    └───────────────────┘   └───────┬────────┘   └──────────────────┘
                                                    │
                                         Mongoose ODM Drivers
                                                    │
                               ┌────────────────────▼───────────────────┐
                               │        MongoDB Atlas Database          │
                               │    (Users, Outfits, Customers, Inv)    │
                               └────────────────────────────────────────┘
```

<br />

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16.1](https://nextjs.org/) | App Router, SSR, Turbopack Bundler |
| **UI Library** | [React 19](https://react.dev/) | Client Components, Hooks & Context API |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern, clean vector icon suite |
| **Backend Runtime** | [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) | RESTful API Server |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Cloud NoSQL Document Database |
| **Database Driver** | [Mongoose 8](https://mongoosejs.com/) | Schema Modeling & Pre/Post Hooks |
| **Authentication** | [JSON Web Tokens (JWT)](https://jwt.io/) | Stateless Token Authorization |
| **Password Hashing** | [BcryptJS](https://github.com/dcodeIO/bcrypt.js) | 12-round Salt Hashing |
| **Cookie Parsing** | [cookie-parser](https://www.npmjs.com/package/cookie-parser) | HTTP-Only Refresh Token Cookie Management |

<br />

---

## 📡 API Endpoint Reference

### 🔓 Authentication Endpoints (Public)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/login` | Authenticate user & issue access token + refresh cookie | ❌ |
| `POST` | `/api/auth/refresh` | Renew access token via HTTP-Only refresh cookie | ❌ |
| `POST` | `/api/auth/logout` | Clear refresh token cookie & terminate session | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ |

### 👗 Outfit & Inventory Endpoints
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/outfits` | List all inventory items | Admin / Worker |
| `POST` | `/api/outfits` | Create new outfit | Admin / Worker |
| `PUT` | `/api/outfits/:id` | Update outfit details or status | Admin / Worker |
| `DELETE` | `/api/outfits/:id` | Permanently delete outfit from inventory | 👑 Admin Only |

### 👥 Customer Management Endpoints
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/customers` | List registered store customers | Admin / Worker |
| `POST` | `/api/customers` | Register new customer | Admin / Worker |
| `PUT` | `/api/customers/:id` | Update customer details | Admin / Worker |
| `DELETE` | `/api/customers/:id` | Delete customer account | 👑 Admin Only |

### 🧾 Invoice & Transaction Endpoints
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/invoices` | List store invoices | Admin / Worker |
| `POST` | `/api/invoices` | Create invoice & auto-update outfit/customer state | Admin / Worker |
| `PUT` | `/api/invoices/:id` | Update payment status or rental duration | Admin / Worker |

### 👔 Worker Account Management Endpoints
| Method | Endpoint | Description | Role Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/users` | List all staff & worker accounts | 👑 Admin Only |
| `POST` | `/api/users` | Register new worker or admin account | 👑 Admin Only |
| `PUT` | `/api/users/:id` | Edit worker role, name, or toggle active status | 👑 Admin Only |
| `DELETE` | `/api/users/:id` | Remove staff account | 👑 Admin Only |

<br />

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- A running [MongoDB](https://www.mongodb.com/) database instance (Local or MongoDB Atlas)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/karmaboy1309/VastraWise.git
cd VastraWise
```

---

### 2️⃣ Configure Environment Variables

Create `.env` in the `server` folder:
```bash
cp server/.env.example server/.env
```

Fill in your secrets inside `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vastrawise?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

ADMIN_NAME=Admin Owner
ADMIN_EMAIL=admin@vastrawise.com
ADMIN_PASSWORD=AdminPass@123
```

Create `.env.local` in the `rent-wise` folder:
```bash
cp rent-wise/.env.example rent-wise/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### 3️⃣ Install Dependencies

```bash
# Install Server Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../rent-wise
npm install
```

---

### 4️⃣ Seed Initial Admin Account

Run the secure admin seeder script to create your primary Shop Owner account:
```bash
cd server
node seed-admin.js
```
*Output:*
```text
✅ Connected to MongoDB
🎉 Admin account created successfully!
──────────────────────────────────────
   Name    : Admin Owner
   Email   : admin@vastrawise.com
   Role    : admin
──────────────────────────────────────
```

---

### 5️⃣ Seed Mock Business Data (Optional)

To populate the database with mock Outfits, Customers, and Invoices for demonstration and testing:
```bash
node seed.js
```
*Output:*
```text
✅ Connected to MongoDB for seeding
🗑️  Cleared existing data
📦 Seeded 6 outfits
👥 Seeded 6 customers
🧾 Seeded 5 invoices

✅ Database seeding complete!
```

---

### 6️⃣ Run the Application

Start both the backend API server and Next.js frontend:

```bash
# Start Backend Express Server (Term 1)
cd server
npm run dev

# Start Frontend Next.js Server (Term 2)
cd rent-wise
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to launch VastraWise!

<br />


---

## 🔒 Security Best Practices Implemented

- 🚫 **No Secrets in Repository**: `.env` and `.env.local` files are strict gitignored with safe `.env.example` templates provided.
- 🛡️ **XSS Protection**: Access tokens are stored strictly in-memory (React State/Context) and never stored in `localStorage` or `sessionStorage`.
- 🔐 **CSRF Mitigation**: Refresh tokens use `SameSite: Lax` and `HttpOnly` attributes so scripts cannot read token data.
- 🛡️ **User Enumeration Defense**: Generic login error messages prevent attackers from discovering registered email addresses.

<br />

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">

Crafted with ❤️ for modern rental businesses by **[karmaboy1309](https://github.com/karmaboy1309)**

★ **Star this repo if you find VastraWise helpful!** ★

</div>
