import { Fee } from "../models/fee.model.js";

export const FeeController = {
    addFee: async (req, res) => {
        try {
            const { studentId, amount, dueDate, status, remarks } = req.body;
            const newFee = new Fee({ studentId, amount, dueDate, status, remarks });
            await newFee.save();
            res.status(201).json({ message: "Fee added successfully.", newFee });
        } catch (error) {
            res.status(500).json({ message: "Failed to add fee.", error: error.message });
        }
    },

    editFee: async (req, res) => {
        try {
            const { feeId } = req.params;
            const updates = req.body;
            const updatedFee = await Fee.findByIdAndUpdate(feeId, updates, { new: true });
            if (!updatedFee) return res.status(404).json({ message: "Fee record not found." });
            res.status(200).json({ message: "Fee updated successfully.", updatedFee });
        } catch (error) {
            res.status(500).json({ message: "Failed to update fee.", error: error.message });
        }
    },

    removeFee: async (req, res) => {
        try {
            const { feeId } = req.params;
            const removedFee = await Fee.findByIdAndDelete(feeId);
            if (!removedFee) return res.status(404).json({ message: "Fee record not found." });
            res.status(200).json({ message: "Fee removed successfully.", removedFee });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove fee.", error: error.message });
        }
    },

    searchFee: async (req, res) => {
        try {
            const { studentId, status } = req.query;
            const filters = {};
            if (studentId) filters.studentId = studentId;
            if (status) filters.status = { $regex: status, $options: "i" };

            const fees = await Fee.find(filters);
            if (fees.length === 0) return res.status(404).json({ message: "No fee records found." });
            res.status(200).json({ fees });
        } catch (error) {
            res.status(500).json({ message: "Failed to search fees.", error: error.message });
        }
    },

    // Fetch all fee records
    getAllFees: async (req, res) => {
        try {
            const fees = await Fee.find();
            res.status(200).json(fees);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
