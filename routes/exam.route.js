import express from "express";
import { ExamController } from "../controllers/exam.controller.js";

const router = express.Router();

// Add a new exam
router.post("/add", ExamController.addExam);

// Edit an existing exam
router.put("/edit/:examId", ExamController.editExam);

// Remove an exam
router.delete("/remove/:examId", ExamController.removeExam);

// Search for exams with optional filters
router.get("/search", ExamController.searchExam);

// Fetch all exams
router.get("/all", ExamController.getAllExams);

export default router;
