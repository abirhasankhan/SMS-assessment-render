# SMS-assessment (School Management System)

**This is a demo deployment of SMS-assessment. Original GitHub repository: [SMS-assessment](https://github.com/abirhasankhan/SMS-assessment)**  

❗ Important Note:
This application uses a free instance that spins down due to inactivity, causing delays of up to 1 minute on the first request. Please be patient.  

```plaintext
Admin Login Credentials:
Email: admin@info.com  
Password: Abir@123
```

## Introduction

SMS-assessment is a comprehensive School Management System designed to streamline administrative tasks, improve communication, and enhance the educational experience for students, teachers, and administrators. This system provides user-friendly features tailored to each role, ensuring efficient management of school operations.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [License](#license)

## Live Demo

Access the live demo here: **[SMS-assessment](#)**  
**Note:** Please allow up to 1 minute for the app to load initially due to server inactivity.

## Features

- **Student Management**: Add, update, and manage student records, including personal details, grades, and attendance.  
- **Teacher Management**: Manage teacher profiles and assignments.  
- **Class Scheduling**: Schedule and track class sessions.  
- **Grades & Attendance**: Record and track student grades and attendance.  
- **User Roles & Permissions**: Admin, Teacher, and Student roles with specific permissions.  
- **Notifications**: Real-time notifications for students and teachers.  
- **Reports**: Generate reports for student performance, class performance, and more.

## Technologies

### Backend

- **Node.js** with **Express.js**: For handling server requests and managing APIs.  
- **MongoDB**: NoSQL database to store school data.  
- **JWT (JSON Web Tokens)**: For managing authentication and authorization.  
- **Mongoose**: ODM for MongoDB for easier data modeling.  
- **NodeMailer**: For email notifications to users.  
- **bcryptjs**: For secure password hashing.  
- **dotenv**: For environment variables.  
- **Axios**: For making HTTP requests from the frontend.

### Frontend

- **React**: For building a dynamic and responsive user interface.  
- **Tailwind CSS**: For styling and responsive design.  
- **React Router DOM**: For routing between pages.  
- **Framer Motion**: For smooth animations and transitions.  
- **Zustand**: For state management in React.  
- **React Toastify**: For real-time notifications.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)  
- [MongoDB](https://www.mongodb.com/)

### Web Server Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/abirhasankhan/SMS-assessment-render.git
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Start the backend server:

   ```bash
   npm start
   ```

## Environment Variables

To run this project, add the following environment variables to a `.env` file in both the `backend` and `frontend` directories:

```plaintext
# Server port
PORT=5000  # Backend server's listening port

# MongoDB URI
MONGO_URI=your_mongodb_uri  # Database connection string

# JWT Secret
JWT_SECRET=your_jwt_secret  # Secret key for token signing

# Mailtrap Configuration
MAILTRAP_USER=your_mailtrap_user  # Mailtrap username for email testing
MAILTRAP_PASSWORD=your_mailtrap_password  # Mailtrap password

# Environment
NODE_ENV=development  # Set to 'development' or 'production'

# Frontend URL
CLIENT_URL=http://localhost:3000  # URL for the frontend application
```

## Usage

1. Register a new account via the registration form.  
2. Admins can manage student and teacher records.  
3. Teachers can manage student grades and attendance.  
4. Students can view their grades, attendance, and schedule.  
5. Notifications and alerts are provided for important actions.


## License

This project is licensed under the MIT License.  

--- 
