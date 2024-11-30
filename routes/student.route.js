import express from "express";
import { StudentController } from "../controllers/student.controller.js"; // Import the StudentController

const router = express.Router();

// Route for fetching all students
router.get("/", StudentController.getAllStudents);

// Route for adding a new student
router.post("/", StudentController.addStudent);

// Route for updating a student by studentId
router.put("/:studentId", StudentController.editStudent);

// Route for removing a student by studentId
router.delete("/:studentId", StudentController.removeStudent);

// Route for searching students by name (firstName or lastName)
router.get("/search", StudentController.searchStudentByName);

// Route for fetching a student by studentId
router.get("/:studentId", StudentController.getStudentById);

// Route for searching teachers by name
router.get("/search", StudentController.searchStudentByName);

export default router;
