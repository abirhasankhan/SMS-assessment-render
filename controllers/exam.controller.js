import { Exam } from "../models/exam.model.js";

export const ExamController = {
    // Add a new exam
    addExam: async (req, res) => {
        try {
            const { classId, examDate, examTime, remarks } = req.body;

            // Check for conflicts
            const existingExam = await Exam.findOne({
                classId,
                examDate,
                examTime
            });

            if (existingExam) {
                return res.status(400).json({
                    message: "Conflict detected: An exam for this class is already scheduled at the same time and date."
                });
            }

            const newExam = new Exam({ classId, examDate, examTime, remarks });
            await newExam.save();
            res.status(201).json({ message: "Exam added successfully.", newExam });
        } catch (error) {
            res.status(500).json({ message: "Failed to add exam.", error: error.message });
        }
    },

    // Edit an existing exam
    editExam: async (req, res) => {
        try {
            const { examId } = req.params;
            const { classId, examDate, examTime } = req.body;

            // Check for conflicts, excluding the current exam
            const conflictingExam = await Exam.findOne({
                classId,
                examDate,
                examTime,
                _id: { $ne: examId } // Exclude the exam being updated
            });

            if (conflictingExam) {
                return res.status(400).json({
                    message: "Conflict detected: Another exam for this class is already scheduled at the same time and date."
                });
            }

            const updatedExam = await Exam.findByIdAndUpdate(examId, req.body, { new: true });
            if (!updatedExam) return res.status(404).json({ message: "Exam not found." });
            res.status(200).json({ message: "Exam updated successfully.", updatedExam });
        } catch (error) {
            res.status(500).json({ message: "Failed to update exam.", error: error.message });
        }
    },

    // Remove an exam
    removeExam: async (req, res) => {
        try {
            const { examId } = req.params;
            const removedExam = await Exam.findByIdAndDelete(examId);
            if (!removedExam) return res.status(404).json({ message: "Exam not found." });
            res.status(200).json({ message: "Exam removed successfully.", removedExam });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove exam.", error: error.message });
        }
    },

    // Search for exams with filters
    searchExam: async (req, res) => {
        try {
            const { classId, examDate, examTime } = req.query;
            const filters = {};
            if (classId) filters.classId = classId;
            if (examDate) filters.examDate = new Date(examDate);
            if (examTime) filters.examTime = examTime;

            const exams = await Exam.find(filters);
            if (exams.length === 0) return res.status(404).json({ message: "No exams found." });
            res.status(200).json({ exams });
        } catch (error) {
            res.status(500).json({ message: "Failed to search exams.", error: error.message });
        }
    },

    // Fetch all exams
    getAllExams: async (req, res) => {
        try {
            const exams = await Exam.find();
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch exams.", error: error.message });
        }
    }
};
