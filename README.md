# 🧺 LaundryPro — Mini Laundry Order Management System

A full-stack MERN application for managing laundry/dry-cleaning orders with real-time tracking, billing, and dashboard analytics.

---

## 🚀 Features Implemented

### Core Features
- ✅ **Create Orders** — Customer name, phone, multiple garment types, quantity, price per item, auto-calculated total, unique Order ID
- ✅ **Order Status Management** — RECEIVED → PROCESSING → READY → DELIVERED with dropdown
- ✅ **View All Orders** — Table with search by name/phone, filter by status/garment type, paginated (10/page), sorted latest first
- ✅ **Dashboard** — Total orders, total revenue, today's stats, per-status breakdown, revenue chart (last 7 days)

### Bonus Features
- ✅ **JWT Auth** — Register/Login with bcrypt password hashing
- ✅ **Estimated Delivery Date** — Set per order
- ✅ **Toast Notifications** — react-hot-toast for all actions
- ✅ **Loading States** — Spinners on every async operation
- ✅ **Mobile Responsive** — Sidebar collapses on mobile
- ✅ **Search by Garment Type** — Filter on orders page
- ✅ **Pagination** — 10 orders per page
- ✅ **Persistent MongoDB Storage** — Mongoose with timestamps
- ✅ **Clean Admin UI** — Indigo/white/gray color scheme with Plus Jakarta Sans font

---

### 🧠 Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Auth: JWT
- Tools: Postman, Git, GitHub
---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm install
npm run dev      # development
npm start        # production
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api  (or deployed backend URL)
npm install
npm start        # development
npm run build    # production build
```

---


## 🤖 AI Usage Report

This project was scaffolded with assistance from **Claude (Anthropic)** and **ChatGPT**.

| Task | AI Contribution | Manual Work |
|------|----------------|-------------|
| Backend structure (MVC, routes, controllers) | Claude scaffolded the full structure | Reviewed and adjusted validation logic |
| Mongoose models with proper indexing | Claude generated base models | Added garment enum, custom orderId generator |
| JWT auth flow | Claude provided bcrypt + JWT boilerplate | Tested token expiry and error edge cases |
| React pages (Dashboard, Orders, Create) | Claude generated component structure | Improved UX: expandable rows, auto-price fill |
| Recharts integration | Claude provided chart config | Adjusted gradients, custom tooltip |
| CSS/Tailwind styling | Claude provided utility classes | Refined spacing, mobile breakpoints |
| Error middleware | Claude provided pattern | Extended for Mongoose-specific errors |

**Key manual improvements:**
- Fixed pagination bug when filters change (reset page to 1)
- Added auto-price fill when garment type changes in Create Order form
- Improved mobile sidebar overlay with backdrop
- Added `uuid` fallback to timestamp-based orderId for reliability

---

## ⚖️ Tradeoffs

### Skipped
- **Role-based access** — Only one admin role; multi-user roles (staff/manager) not implemented
- **Order editing** — Can update status but not edit garment details after creation
- **Email/SMS notifications** — No delivery notifications to customers
- **Print invoice** — No PDF invoice generation
- **Image attachments** — Can't attach photos of garments

### Future Improvements
- Add customer-facing order tracking page (public, no login)
- WhatsApp notification via Twilio when status changes
- Print-friendly invoice with QR code linking to order
- Analytics: peak hours, popular garment types, revenue trends
- Multi-branch support with branch-level filtering

---

## 📁 Project Structure

```
laundry/
├── backend/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth + error handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── server.js        # Entry point
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Layout, StatusBadge, Spinner
        ├── context/     # AuthContext (JWT)
        ├── pages/       # Login, Dashboard, Orders, CreateOrder
        ├── utils/       # Axios instance
        └── App.js
```

---

## Video Demo
🎥 Loom / YouTube link: [https://youtu.be/LEa1M_9ORYQ](https://youtu.be/LEa1M_9ORYQ)
