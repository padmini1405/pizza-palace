## Pizza Palace

A full-stack MERN pizza ordering application that allows customers to browse pizzas, add items to cart, place orders, and manage their profiles. The platform also provides an admin dashboard for managing pizzas and monitoring customer orders.

## Features

### Customer Features

* User Registration & Login (JWT Authentication)
* Browse Pizza Menu
* Search Pizzas
* Filter Pizzas by Category
* View Pizza Details
* Add to Cart
* Update Cart Quantity
* Checkout Process
* Order History
* Profile Management
* Responsive Design (Mobile, Tablet & Desktop)

### Admin Features

* Secure Admin Login
* Dashboard Overview
* Add New Pizza
* Edit Existing Pizza
* Delete Pizza
* Toggle Pizza Availability
* View Customer Orders
* Inventory Management


## Tech Stack

### Frontend

* React.js
* React Router DOM
* Context API
* CSS3
* React Icons
* React Hot Toast
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT (JSON Web Token)
* bcryptjs

### Image Storage

* Cloudinary

---

## Project Structure

pizza-palace/

├── frontend/

│ ├── src/

│ │ ├── Components/

│ │ ├── Pages/

│ │ ├── Context/

│ │ ├── Styles/

│ │ └── assets/

│

├── backend/

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/

│ ├── utils/

│ └── config/

│

└── README.md

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/your-username/pizza-palace.git
```

```bash
cd pizza-palace
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## Run Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/update-profile
```

### Pizza

```http
GET    /api/pizzas
POST   /api/pizzas
PUT    /api/pizzas/:id
DELETE /api/pizzas/:id
```

### Orders

```http
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders
```

## Testing

Frontend testing is implemented using:

* Vitest
* React Testing Library

Run tests:

```bash
npm test
```

## Future Enhancements

* Online Payment Integration
* Coupon System
* Real-time Order Tracking
* Email Notifications
* Sales Analytics Dashboard
* Customer Reviews & Ratings

## How to view
You can access my website by visiting this [Link] .Feel free to explore the content and get in touch.

## Author

Padmini K

Full Stack MERN Developer

## 📄 License

This project is developed for educational and portfolio purposes.
