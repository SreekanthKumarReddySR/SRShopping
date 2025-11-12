# 🛍️ SRShopping

> A modern, full-stack e-commerce platform built with the MERN stack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)

SRShopping is a production-ready e-commerce web application featuring secure authentication, role-based access control, product management, and a complete booking system. Designed for scalability and real-world deployment.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** with email verification (OTP/Link)
- **JWT-based Authentication** with secure token management
- **Role-Based Access Control** (Customer, Seller, Admin)
- **Password Encryption** using bcrypt
- **Email Service** powered by Nodemailer

### 🛒 E-Commerce Functionality
- **Product Management** - Create, read, update, and delete products
- **Category Management** - Organize products into categories
- **Booking System** - Purchase products with real-time stock updates
- **Advanced Filtering** - Search by price, title, category, and brand
- **Inventory Tracking** - Automatic stock management

### 💻 Frontend Experience
- **Single Page Application** (SPA) with React Router
- **Global State Management** using Context API and Reducer pattern
- **Protected Routes** with role-based navigation
- **Responsive Design** for all device sizes
- **Real-time Feedback** with loading states, error banners, and toast notifications

### 🚀 DevOps & Performance
- **CI/CD Pipeline** with GitHub Actions
- **Auto-Deployment** to Vercel (Frontend) and Render/Railway (Backend)
- **Environment-based Configuration** for development and production
- **Optional Redis Caching** for improved performance
- **Comprehensive Testing** with Jest and Supertest

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

### Authentication & Security
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge)

### Deployment & DevOps
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

### Testing
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-07C160?style=for-the-badge)

---

## 🏛️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │  Express API    │ ◄─────► │  MongoDB        │
│  (Vercel)       │   JWT   │  (Render)       │  CRUD   │  (Atlas)        │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    ▼
                            ┌─────────────────┐
                            │  Nodemailer     │
                            │  Email Service  │
                            └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local instance or MongoDB Atlas) - [Setup](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SreekanthKumarReddySR/SRShopping.git
cd SRShopping
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/srshopping

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (Gmail/SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# URLs
BASE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000

# Optional: Redis (for caching)
REDIS_URL=redis://localhost:6379
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5001/api

# Optional: Analytics
REACT_APP_GA_ID=your-google-analytics-id
```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start at `http://localhost:5001`

#### Start Frontend Application

```bash
cd frontend
npm start
```

The frontend application will start at `http://localhost:3000`

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Connect your GitHub repository** to Vercel
2. **Configure Build Settings:**
   - Framework Preset: `Create React App`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy:** Push to your main branch for automatic deployment

### Backend Deployment (Render/Railway)

1. **Create a new Web Service** on Render or Railway
2. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:** Add all variables from your backend `.env` file

4. **CORS Configuration:** Ensure your backend allows your Vercel domain:
   ```javascript
   const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://sr-shopping.vercel.app'
     ],
     credentials: true
   };
   ```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Suites Include:
- ✅ User Registration & Email Verification
- ✅ Authentication & JWT Token Generation
- ✅ Category CRUD Operations
- ✅ Product CRUD Operations
- ✅ Booking System & Stock Management
- ✅ Role-Based Access Control

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/verify` | Verify email | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/products` | Get all products | ❌ | - |
| GET | `/api/products/:id` | Get product by ID | ❌ | - |
| POST | `/api/products` | Create product | ✅ | Seller |
| PUT | `/api/products/:id` | Update product | ✅ | Seller |
| DELETE | `/api/products/:id` | Delete product | ✅ | Seller |

### Category Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/categories` | Get all categories | ❌ | - |
| POST | `/api/categories` | Create category | ✅ | Seller |
| PUT | `/api/categories/:id` | Update category | ✅ | Seller |
| DELETE | `/api/categories/:id` | Delete category | ✅ | Seller |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/bookings` | Create booking | ✅ | Customer |
| GET | `/api/bookings/my` | Get user bookings | ✅ | Customer |

---

## 📁 Project Structure

```
SRShopping/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Product.js            # Product model
│   │   ├── Category.js           # Category model
│   │   └── Booking.js            # Booking model
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── products.js           # Product routes
│   │   ├── categories.js         # Category routes
│   │   └── bookings.js           # Booking routes
│   ├── middlewares/
│   │   ├── auth.js               # JWT authentication
│   │   ├── roleCheck.js          # Role-based authorization
│   │   └── errorHandler.js       # Error handling
│   ├── utils/
│   │   ├── sendEmail.js          # Email utility
│   │   └── generateToken.js      # JWT token generator
│   ├── tests/
│   │   └── api.test.js           # API tests
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProductCard.js
│   │   │   ├── CategoryFilter.js
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Products.js
│   │   │   ├── AddProduct.js
│   │   │   └── MyBookings.js
│   │   ├── context/
│   │   │   └── AuthContext.js    # Global auth state
│   │   ├── utils/
│   │   │   ├── api.js            # Axios configuration
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── styles.css
│   ├── .env
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── frontend.yml          # CI/CD workflow
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🗺️ Roadmap

- [ ] Order history and tracking dashboard
- [ ] Redis caching for improved performance
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Admin panel for user management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics for sellers
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Social media authentication

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**S.R. Sreekanth Kumar Reddy**

- 🎓 IIIT Sri City
- 💼 Full Stack Developer | MERN Stack Specialist
- 🔬 Machine Learning Enthusiast
- 📧 Email: [sreekanth29kumar05reddy@gmail.com](mailto:sreekanth29kumar05reddy@gmail.com)
- 🔗 GitHub: [@SreekanthKumarReddySR](https://github.com/SreekanthKumarReddySR)

---

## 🙏 Acknowledgments

- MongoDB for excellent database documentation
- React community for amazing tools and libraries
- Express.js for the robust backend framework
- Vercel and Render for seamless deployment

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/SreekanthKumarReddySR/SRShopping/issues) page
2. Create a new issue with detailed information
3. Contact via email for urgent matters

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Sreekanth Kumar Reddy](https://github.com/SreekanthKumarReddySR)

</div
