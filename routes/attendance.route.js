import express from "express";
import { AttendanceController } from "../controllers/attendance.controller.js";

const router = express.Router();

// Add new attendance
router.post("/", AttendanceController.addAttendance);

// Edit attendance by ID
router.put("/:attendanceId", AttendanceController.editAttendance);

// Remove attendance by ID
router.delete("/:attendanceId", AttendanceController.removeAttendance);

// Search attendance by studentId and/or classId
router.get("/search", AttendanceController.searchAttendance);

// Fetch all attendance records
router.get("/", AttendanceController.getAllAttendance);

export default router;
