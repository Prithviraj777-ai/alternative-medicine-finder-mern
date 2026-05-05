# 🌿 Alternative Medicine Finder (MERN Stack)

A full-stack web application that helps users find alternative medicines, compare options, and place orders online. Built using the MERN stack with authentication, admin panel, and payment integration.

---

## 🚀 Features

- 🔐 User Authentication (Login/Register)
- 🛒 Add to Cart & Checkout
- 💳 Razorpay Payment Integration (Test Mode)
- 🔍 Search & Filter Medicines
- 🧑‍💼 Admin Dashboard (Manage products/users)
- 📦 Order Management
- 🔄 Secure API with JWT Authentication

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Other Tools
- Razorpay (Payment Gateway)
- JWT (Authentication)
- Vercel (Frontend Deployment)
- Render (Backend Deployment)

---

## 📁 Project Structure


Alternative_Medicine_Finder/
│
├── frontend/ # React Frontend
├── backend/ # Express Backend
├── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/alternative-medicine-finder-mern.git
cd alternative-medicine-finder-mern
2️⃣ Setup Backend
cd backend
npm install

Create .env file:

PORT=5001
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

Run backend:

npm run dev
3️⃣ Setup Frontend
cd frontend
npm install

Create .env file:

VITE_API_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=your_key

Run frontend:

npm run dev