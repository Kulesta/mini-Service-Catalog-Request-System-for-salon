
# Mini Service Catalog & Request App 

> **Qelem Meda Technologies – Internship Practical Assessment**

A full-stack MERN web application that enables service providers (salons, clinics, consultants) to manage their service catalogs, publish public service pages, and receive customer requests.  
Built with **React, Node.js, Express, MongoDB, and Tailwind CSS**.

---

## Features Overview

- Secure provider authentication
- Service category and service item management
- Computed pricing with VAT and discounts
- Public service page (no login required)
- Customer request submission
- Responsive UI with Tailwind CSS
- Database seeding for quick setup

---

## Default Login Credentials

A seeded provider account is included for testing and evaluation.

| Role | Email | Password |
|-----|------|----------|
| Provider | `melo@salon.com` | `passwordP#123` |


## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose ORM)

### Authentication
- JWT (JSON Web Tokens)
- Bcrypt

---

## Installation & Setup

###  Clone the Repository

```bash
git clone https://github.com/Kulesta/mini-Service-Catalog-Request-System-for-salon.git

cd mini-Service-Catalog-Request-System-for-salon
````

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:


### Frontend Setup

```bash
cd ../frontend
npm install
```

---

## Database Seeding (Required)

The seeder script creates:

* Provider account
* Service categories
* Sample services


##  Running the Application

Run backend and frontend in **separate terminals**.

### Backend Server

```bash
cd backend
npm run dev
```

### Frontend Client

cd frontend 
npm run dev

## Provider Authentication

* Secure registration and login
* JWT-based session management
* Password hashing with Bcrypt
* Validation for unique emails and licenses

---

## Service Category Management

* Full CRUD operations
* Pagination for large datasets
* Search functionality
* Active / Inactive visual indicators

---

## Service Item Management

* Services grouped by category
* Dynamic pricing logic:

```
Total = BasePrice + (BasePrice × VAT%) − Discount
```

* Filter services by category
* Search services by name

---

## Public Service Page

* Public route: `/services/:slug`
* No authentication required
* Displays provider services dynamically
* Customer request form integrated with backend API


##  Assessment Criteria Checklist

✔ JWT Authentication & Middleware
✔ Category CRUD with Pagination & Search
✔ Service Management with Relationships & Computed Pricing
✔ Public Slug-Based Service Page
✔ Responsive UI with Tailwind CSS
✔ Automated Database Seeding

---

## Author

Developed as part of the
**Qelem Meda Technologies Internship Practical Assessment** by [Solome Andarge]

```

