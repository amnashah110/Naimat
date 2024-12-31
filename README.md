# Naimat

Naimat is a food donation platform designed to connect donors, recipients, and volunteers in real-time. It ensures efficient food redistribution and tracks the impact of donations.

---

## Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native (with Expo or React Native CLI)
- **State Management**: Redux Toolkit or Context API
- **UI Library**: NativeBase or React Native Paper
- **API Communication**: Axios
- **Real-Time Updates**: Socket.IO or WebSockets

### Backend
- **Framework**: Go (with Gin or Fiber)
- **Database**: MongoDB (or any NoSQL database)
- **Authentication**: JSON Web Tokens (JWT)
- **Real-Time Updates**: WebSockets or SSE (Server-Sent Events)

---

## Features

### User Registration/Login
- **Frontend**:
  - **Register Screen**: Form to register as a donor, recipient, or volunteer.
  - **Login Screen**: Authenticate users with email and password.
- **API**:
  - `POST /register`
  - `POST /login`

---

### Donation Dashboard (For Donors)
- **Frontend**:
  - **My Donations Screen**: View and manage donations.
  - **Create Donation Screen**: Form to add new food donations.
- **API**:
  - `POST /donations`
  - `GET /donations?filter=donor`

---

### Browse Donations (For Recipients)
- **Frontend**:
  - **Available Donations Screen**: List food items based on proximity and demand.
- **API**:
  - `GET /donations?filter=recipient`

---

### Volunteer Dashboard
- **Frontend**:
  - **Assignments Screen**: List assigned pickups and deliveries.
- **API**:
  - `GET /volunteers/assign`

---

### Real-Time Status Updates
- **Backend**:
  - Use WebSockets or SSE for push notifications (e.g., "New donation available" or "Pickup scheduled").
  - Subscribe to `donation_updates` channel.

---

### Impact Analytics
- **Frontend**:
  - **Analytics Screen**: Show total donations, food redistributed, and beneficiaries served.
- **API**:
  - `GET /analytics`

---

## Backend Setup (Go)

### Folder Structure
```plaintext
backend/
├── cmd/             (Entry point of the application)
├── controllers/     (Handles API requests and responses)
├── models/          (Database models)
├── routes/          (API routing)
├── services/        (Business logic and helper functions)
└── main.go          (Main application file)
```

### Getting Started
1. **Install Dependencies**:
   - Go modules:
     ```bash
     go mod init naimat
     go get github.com/gin-gonic/gin
     go get github.com/dgrijalva/jwt-go
     go get go.mongodb.org/mongo-driver/mongo
     ```

2. **Run the Application**:
   ```bash
   go run main.go
   ```

3. **APIs**:
   - `POST /register` (Register new user)
   - `POST /login` (Authenticate user)
   - `POST /donations` (Create a donation)
   - `GET /donations` (Get donations by role or filters)
   - `GET /analytics` (Fetch analytics data)

---

## Frontend Setup (React Native)

### Folder Structure
```plaintext
mobile/
├── src/
│   ├── components/  (Reusable UI Components)
│   ├── screens/      (Screens for each feature)
│   ├── services/     (API calls)
│   ├── state/        (Redux or Context Logic)
│   └── styles/       (Stylesheets for React Native components)
```
