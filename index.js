import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";

import teacherRoutes from "./routes/teacher.route.js";  // Import the teacher routes
import classRoutes from "./routes/class.route.js";  // Import the class routes
import studentRoutes from "./routes/student.route.js";  // Import the student routes
import attendanceRoutes from "./routes/attendance.route.js";  // Import the attendance routes
import examRoutes from "./routes/exam.route.js";  // Import the exam routes
import feeRoutes from "./routes/fee.route.js";  // Import the fee routes
import resultRoutes from "./routes/result.route.js";  // Import the result routes

import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ 
  origin: process.env.CLIENT_URL, 
  credentials: true, // Include credentials such as cookies or authorization headers
}));

app.use(express.json()); // for parsing application/json

app.use(cookieParser()); // allow us to parse incoming cookies


app.use("/api/auth", authRoutes);

// Use the teacher routes
app.use("/api/teachers", teacherRoutes);

// Use the class routes
app.use("/api/classes", classRoutes);

// Use the student routes
app.use("/api/students", studentRoutes);

// Use the attendance routes
app.use("/api/attendance", attendanceRoutes);

// Use the exam routes
app.use("/api/exams", examRoutes);

// Use the fee routes
app.use("/api/fees", feeRoutes);

// Use the result routes
app.use("/api/results", resultRoutes);


// use the client app
app.use(express.static(path.join(__dirname,"client/dist")));

// Render the index.html for the client app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});



app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
