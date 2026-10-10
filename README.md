# NightDrop 🌙 — Midnight Food & Essential Delivery Platform

> **A Smart Midnight Food and Essential Delivery Platform** built for high-reliability nocturnal commerce.
> Capstone Full-Stack Web Application featuring **React 18 + Vite**, **Java 21 / Spring Boot 3.3.4**, **Spring Security (JWT)**, and **MySQL**.

---

## 🚀 Quick Start (Local Run)

### 1. Prerequisites
- **Java**: JDK 21 or higher (`java -version`)
- **Node.js**: Node 18+ and npm (`npm -v`)
- **MySQL Server**: Running on port `3306` with database `nightdrop_db`

---

### 2. Run Backend (Spring Boot 3)
```powershell
cd backend
java -jar target/nightdrop-backend-1.0.0.jar
```
*Tomcat starts on port **8080**. The backend automatically seeds 6 demo users, 5 stores, and 20 midnight essentials on first launch.*

---

### 3. Run Frontend (React + Vite)
```powershell
cd frontend
npm run dev
```
*Frontend starts at **`http://localhost:5173`**. Vite automatically proxies `/api` calls to `http://localhost:8080`.*

---

## 🔑 Demo Test Accounts (1-Click Fill in UI)

| Role | Email | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nightdrop.com` | `Admin@123` | Full KPI Analytics, Chart.js metrics, Store toggles, Global order stream, User management |
| **Store Owner** | `diner@nightdrop.com` | `Owner@123` | Store open/close override, operating hours config, product inventory CRUD, order acceptance & prep transitions |
| **Customer** | `customer@nightdrop.com` | `Customer@123` | Browse catalog, dynamic open/closed filtering, cart, saved addresses, COD checkout, live order tracking |

---

## 🛠️ Architecture & Tech Stack

```
NightDrop/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/nightdrop/
│   │   ├── config/            # SecurityConfig, CorsConfig
│   │   ├── controller/        # Auth, Store, Product, Order, Address, Admin, User
│   │   ├── dto/               # Clean Request/Response records & builders
│   │   ├── entity/            # JPA Entities (Pure Java with Builders, no Lombok)
│   │   ├── exception/         # GlobalExceptionHandler with standard error schemas
│   │   ├── initializer/       # DataInitializer (auto-seeds users, stores, products)
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   ├── security/          # JWT filter, token provider, user details service
│   │   ├── service/           # Business logic & transactional checkout
│   │   └── util/              # TimeUtil (IST Midnight availability engine), OrderIdGenerator
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── schema.sql         # Standard MySQL DDL
│   ├── Dockerfile             # Multi-stage Docker deployment build
│   └── render.yaml            # Render Blueprint deployment config
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProtectedRoute
│   │   ├── context/           # AuthContext (JWT persistence), CartContext (store-scoped)
│   │   ├── pages/             # Home, Products, Stores, StoreDetails, Cart, Checkout,
│   │   │                      # TrackOrder, MyOrders, Profile, Login, Register,
│   │   │                      # StoreOwnerDashboard, DeliveryPartnerDashboard, AdminDashboard
│   │   ├── services/          # Centralized Axios client with Bearer interceptors
│   │   ├── App.jsx            # React Router 6 hierarchy
│   │   ├── main.jsx           # Root DOM mount
│   │   └── index.css          # Midnight Luxury styling (#070a13, glowing violet & cyan)
│   ├── vercel.json            # Client-side SPA routing rewrites
│   └── vite.config.js         # Port 5173 with backend proxy
└── README.md
```

---

## 🌟 Core Innovations

### 1. Dynamic Night Availability Engine
Operating hours often cross midnight (e.g., **19:00 to 05:00** or **20:00 to 04:00**). Standard `<` and `>` checks fail across 00:00.
NightDrop implements an explicit timezone engine configured in `Asia/Kolkata` (`TimeUtil.java`):
- **Cross-Midnight Windows**: If `closingTime.isBefore(openingTime)`, store is open when `now.isAfter(openingTime) || now.isBefore(closingTime)`.
- **Standard Windows**: When `closingTime.isAfter(openingTime)`, store is open when `!now.isBefore(openingTime) && now.isBefore(closingTime)`.
- **24/7 Windows**: `00:00 to 23:59` is continuously open.
- **Manual Overrides**: Store owners and Admins can toggle emergency closures instantly.
- **Validation at Checkout**: The backend re-verifies availability right before debiting inventory, preventing illegal orders from closed hubs.

### 2. Transactional Order Workflow
```
PLACED ➔ ACCEPTED ➔ PREPARING ➔ READY_FOR_PICKUP ➔ OUT_FOR_DELIVERY ➔ DELIVERED
   │          │          │              │                 │
   └── CANCEL ┴── CANCEL ┴── CANCEL ────┴── CANCEL ───────┴── CANCEL
   │
   └── REJECTED (by Store Owner)
```
- **Stock Integrity**: Stock decreases on order placement and is automatically restored upon cancellation or rejection.
- **Cash on Delivery (COD)**: Transparent payment state tracking (`PENDING` ➔ `COMPLETED` on delivery).

---

## 📡 REST API Reference

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer or store owner |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve profile of authenticated user |
| `GET` | `/api/stores` | Public | List all stores with live availability |
| `GET` | `/api/stores/open` | Public | Filter stores currently open in IST |
| `GET` | `/api/stores/{id}` | Public | Store details, operating hours, and banner |
| `PATCH` | `/api/stores/{id}/toggle` | Owner / Admin | Toggle store open/closed immediately |
| `GET` | `/api/products` | Public | Browse midnight products (in stock) |
| `GET` | `/api/products/category/{cat}` | Public | Filter products by category |
| `GET` | `/api/products/store/{id}` | Public | Products belonging to a specific store |
| `POST` | `/api/products` | Owner / Admin | Add new product to store catalog |
| `PUT` | `/api/products/{id}` | Owner / Admin | Update product details or stock |
| `DELETE` | `/api/products/{id}` | Owner / Admin | Delete product from store |
| `POST` | `/api/orders` | Customer | Place order with address and items |
| `GET` | `/api/orders/my` | Customer | Order history for logged-in customer |
| `GET` | `/api/orders/{id}` | Authenticated | Order tracking and details |
| `POST` | `/api/orders/{id}/cancel` | Customer / Owner | Cancel order (eligible only when PLACED) |
| `PATCH` | `/api/orders/{id}/status` | Owner / Admin | Transition order status |
| `GET` | `/api/orders/store/{storeId}` | Owner / Admin | Incoming orders for store |
| `GET` | `/api/admin/dashboard` | Admin | Real-time analytics, status counts, revenue |
| `GET` | `/api/admin/users` | Admin | List all registered users |
| `GET` | `/api/admin/stores` | Admin | Manage all partner stores |
| `GET` | `/api/admin/orders` | Admin | Global platform order stream |
| `GET` | `/api/addresses` | Customer | Saved delivery addresses |
| `POST` | `/api/addresses` | Customer | Save new delivery address |

---

## 🌐 Deployment Instructions

### Frontend on Vercel
1. Push repository to GitHub.
2. In Vercel, import the repository and set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Environment Variables:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
5. Deploy. `vercel.json` ensures all SPA routes (`/cart`, `/orders`, `/admin-dashboard`) work flawlessly.

### Backend on Render / Railway
1. In Render, create a new **Web Service** pointing to the repository.
2. Root Directory: `backend`.
3. Environment: **Docker** (using the provided `backend/Dockerfile`).
4. Environment Variables:
   - `SPRING_DATASOURCE_URL` = `jdbc:mysql://<db-host>:3306/<db-name>?useSSL=true`
   - `SPRING_DATASOURCE_USERNAME` = `<db-user>`
   - `SPRING_DATASOURCE_PASSWORD` = `<db-password>`
   - `JWT_SECRET` = `<any-random-64-char-string>`
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`

---

## 🎓 College Viva & Demonstration Tips
1. **Show the Real-Time Night Availability**: Point out how stores dynamically indicate Open or Closed depending on whether the current time falls inside their midnight operating window.
2. **Demonstrate 1-Click Role Logins**: Use the quick demo buttons on `/login` to switch effortlessly between Customer, Store Owner, and Admin.
3. **Show Full Order Cycle**: Place an order as Customer ➔ switch to Store Owner to Accept, Cook, and Pack ➔ switch to Rider Console to Dispatch and Deliver ➔ watch the Customer's Order Tracker update live with step-by-step badges.
4. **Demonstrate Data Integrity**: Cancel an order and verify that product stock counts in the store inventory are restored immediately.
#   n i g h t - d r o p  
 