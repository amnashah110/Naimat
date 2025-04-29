# Naimat: Turning Surplus into Support

Project URL (hosted with EC2): http://13.61.179.126:5173/

Naimat is a food redistribution platform that connects restaurants and stores with surplus food to charities and communities in need. Built with a modern DevOps pipeline, Naimat ensures reliable, scalable, and secure operations to reduce food waste and support food-insecure populations.

## Table of Contents
- [Problem](#problem)
- [Solution](#solution)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Monitoring](#monitoring)
- [Installation](#installation)
- [Usage](#usage)
- [CI/CD Pipeline](#ci-cd-pipeline)
- [Contributing](#contributing)
- [License](#license)

## Problem
- 1.3 billion tons of food are wasted globally each year.
- Surplus food from restaurants and stores is often discarded.
- Communities in need lack efficient access to this surplus.

## Solution
Naimat provides a web platform to:
- Enable real-time tracking of surplus food inventory.
- Connect food donors with charities via a secure, user-friendly interface.
- Promote sustainability with the motto: *Turning Surplus into Support*.

## Tech Stack
- **Frontend**: React (Vite build), HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Monitoring Service**: Python, Flask (Prometheus metrics endpoint)
- **Database**: MongoDB (Mongoose schemas for donations and users)
- **Authentication**: JWT, bcrypt for password hashing
- **Version Control**: Git with GitHub
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Cloud**: AWS EC2 with PM2 for process management
- **Monitoring**: Grafana, Prometheus for performance and custom metrics

## Architecture
- **Frontend**: Single-page React app served via `serve` on port 5173.
- **Backend**: REST API with Express, handling donations and authentication.
- **Monitoring Service**: Flask app exposing `/metrics` on port 8085 for Prometheus.
- **Database**: MongoDB stores donation and user data.
- **Deployment**: Docker containers on AWS EC2, managed by PM2.
- **Monitoring**: Prometheus scrapes metrics; Grafana visualizes dashboards.

## API Endpoints
### Donation
- **POST /donate**
  - Creates a new food donation entry.
  - Payload: `{ username, foodType, quantity, contactInfo, pickupAddress, pickupTime, specificTime (optional), specialInstructions }`
  - Response: `201` on success, `500` on error.

### Authentication
- **POST /signup**
  - Registers a new user with hashed password.
  - Payload: `{ firstName, lastName, age, email, username, city, password, type }`
  - Response: `201` with JWT token, `400` if username exists, `500` on error.
- **POST /login**
  - Authenticates user and returns JWT token.
  - Payload: `{ username, password }`
  - Response: `200` with user data and token, `400` on invalid credentials, `500` on error.

## Monitoring
- **Flask Metrics Service**:
  - Runs on port 8085, exposing `/metrics` endpoint.
  - Metrics include:
    - `meals_received_total`: Total meals received (counter, e.g., 500).
    - `claims_made_total`: Total claims made (counter, e.g., 300).
    - `average_time_to_receive_seconds`: Avg. time to receive meals (gauge, e.g., 3600s).
    - `meals_saved_total`: Total meals saved (counter, e.g., 450).
    - `total_food_donated_kg`: Total food donated (gauge, e.g., 1200kg).
    - `donations_made_total`: Total donations (counter, e.g., 140).
    - `average_pickup_time_seconds`: Avg. pickup time (gauge, e.g., 4500s).
- **Prometheus**: Scrapes `/metrics` endpoint for real-time data.
- **Grafana**: Visualizes dashboards for API performance, server health, and custom metrics.
- Access: `[ec2-public-ip]:3000/grafana` (configure during setup).

## Installation
### Prerequisites
- Node.js (>=20.x)
- Python (>=3.11)
- MongoDB (>=4.x)
- AWS CLI configured
- PM2 for process management
- Docker (for metrics service)
- GitHub Actions secrets: `REMOTE_HOST`, `REMOTE_USER`, `NAIMAT_HACKOPS` (SSH key)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/naimat.git
   cd naimat
   ```
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```
4. Build and run metrics service:
   ```bash
   cd data
   docker build -t naimat-metrics .
   docker run -p 8085:8085 naimat-metrics
   ```
5. Set up environment variables in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/naimat
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```
6. Start the backend:
   ```bash
   cd backend
   npm start
   ```
7. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Usage
1. Access the app at `http://[ec2-public-ip]:5173` (frontend) or `http://localhost:5173` (local).
2. Donors: Sign up/login, use `/donate` to add surplus food.
3. Charities: Browse and request donations.
4. Monitor metrics at `http://[ec2-public-ip]:8085/metrics`.

## CI/CD Pipeline
- **Trigger**: Pushes to `main` or `dev` branches.
- **Steps**:
  1. Checks out code and sets up Node.js (v20).
  2. Builds frontend (Vite) and deploys `dist/*` to EC2.
  3. Deploys backend to EC2.
  4. Restarts apps using PM2.
- **Metrics Service**: Deployed via Docker to EC2 (manual or add to CI/CD).
- **Tools**: GitHub Actions, `appleboy/scp-action`, `appleboy/ssh-action`.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature-name"`.
4. Push to your fork: `git push origin feature-name`.
5. Open a pull request.

Follow our [Code of Conduct](CODE_OF_CONDUCT.md) and ensure tests pass.

## License
MIT License. See [LICENSE](LICENSE) for details.
