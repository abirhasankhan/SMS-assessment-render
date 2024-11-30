import { Result } from "../models/result.model.js";

export const ResultController = {
    addResult: async (req, res) => {
        try {
            const { studentId, examId, marks, grade, remarks } = req.body;
            const newResult = new Result({ studentId, examId, marks, grade, remarks });
            await newResult.save();
            res.status(201).json({ message: "Result added successfully.", newResult });
        } catch (error) {
            res.status(500).json({ message: "Failed to add result.", error: error.message });
        }
    },

    editResult: async (req, res) => {
        try {
            const { resultId } = req.params;
            const updates = req.body;
            const updatedResult = await Result.findByIdAndUpdate(resultId, updates, { new: true });
            if (!updatedResult) return res.status(404).json({ message: "Result not found." });
            res.status(200).json({ message: "Result updated successfully.", updatedResult });
        } catch (error) {
            res.status(500).json({ message: "Failed to update result.", error: error.message });
        }
    },

    removeResult: async (req, res) => {
        try {
            const { resultId } = req.params;
            const removedResult = await Result.findByIdAndDelete(resultId);
            if (!removedResult) return res.status(404).json({ message: "Result not found." });
            res.status(200).json({ message: "Result removed successfully.", removedResult });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove result.", error: error.message });
        }
    },

    searchResult: async (req, res) => {
        try {
            const { studentId, examId } = req.query;
            const filters = {};
            if (studentId) filters.studentId = studentId;
            if (examId) filters.examId = examId;

            const results = await Result.find(filters);
            if (results.length === 0) return res.status(404).json({ message: "No results found." });
            res.status(200).json({ results });
        } catch (error) {
            res.status(500).json({ message: "Failed to search results.", error: error.message });
        }
    },

    // Fetch all results
    getAllResults: async (req, res) => {
        try {
            const results = await Result.find();
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
