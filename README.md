# 📋 MERN Todo App

A full-stack Todo application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring JWT authentication, glassmorphism UI, and complete CRUD operations.

![MERN Todo App](https://img.shields.io/badge/MERN-Todo%20App-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green)
![React](https://img.shields.io/badge/React-v18%2B-blue)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | JWT-based login and registration system |
| ✅ **Complete CRUD** | Create, Read, Update, and Delete todos |
| 🔄 **Toggle Status** | Mark todos as complete/incomplete with one click |
| 👤 **User-Specific** | Each user sees only their own todos |
| 🔍 **Duplicate Prevention** | Case-insensitive check prevents duplicate todos |
| 🎨 **Modern UI** | Glassmorphism design with smooth animations |
| 📱 **Responsive** | Works perfectly on all devices (mobile, tablet, desktop) |
| ⚡ **Real-time Updates** | Instant feedback on all actions |

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | v14+ | JavaScript runtime |
| **Express.js** | v4.x | Web framework |
| **MongoDB** | v6.x | NoSQL database |
| **Mongoose** | v7.x | ODM for MongoDB |
| **JWT** | v9.x | Authentication tokens |
| **Bcrypt** | v5.x | Password hashing |
| **Cors** | v2.x | Cross-origin resource sharing |
| **Dotenv** | v16.x | Environment variables |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | v18.x | UI library |
| **React Router** | v6.x | Navigation |
| **CSS3** | - | Styling with glassmorphism |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AmokSingh/To-Do-List.git
cd To-Do-List

2. Install Backend Dependencies
bash
cd server
npm install

3. Install Frontend Dependencies
bash
cd ../client
npm install

4. Configure Environment Variables
Create a .env file in the server folder:

bash
cd ../server
touch .env
Add the following to .env:

env
PORT=3001
MONGODB_URI=<Your Mongodb URI>
JWT_SECRET_KEY=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000

5. Start the Application
Run Backend:

bash
cd server
npm start
Server runs on http://localhost:3001


Run Frontend (in new terminal):

bash
cd client
npm start
App runs on http://localhost:3000

