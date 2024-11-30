import { Class } from "../models/class.model.js";

export const ClassController = {
    addClass: async (req, res) => {
        try {
            const { className, teacherId, remarks } = req.body;

            // Validate input
            if (!className) return res.status(400).json({ message: "Class name is required." });

            const newClass = new Class({ className, teacherId, remarks });
            await newClass.save();
            res.status(201).json({ message: "Class added successfully.", newClass });
        } catch (error) {
            res.status(500).json({ message: "Failed to add class.", error: error.message });
        }
    },

    editClass: async (req, res) => {
        try {
            const { classId } = req.params;

            // Validate classId
            if (!classId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid class ID format." });
            }

            const updates = req.body;
            const updatedClass = await Class.findByIdAndUpdate(classId, updates, { new: true });
            if (!updatedClass) return res.status(404).json({ message: "Class not found." });
            res.status(200).json({ message: "Class updated successfully.", updatedClass });
        } catch (error) {
            res.status(500).json({ message: "Failed to update class.", error: error.message });
        }
    },

    removeClass: async (req, res) => {
        try {
            const { classId } = req.params;

            // Validate classId
            if (!classId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid class ID format." });
            }

            const removedClass = await Class.findByIdAndDelete(classId);
            if (!removedClass) return res.status(404).json({ message: "Class not found." });
            res.status(200).json({ message: "Class removed successfully.", removedClass });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove class.", error: error.message });
        }
    },

    searchClassByName: async (req, res) => {
        try {
            const { name } = req.query;
            if (!name) return res.status(400).json({ message: "Name query parameter is required." });

            const classes = await Class.find({ className: { $regex: name, $options: "i" } });
            res.status(200).json({ message: "Classes fetched successfully.", classes });
        } catch (error) {
            res.status(500).json({ message: "Failed to search classes.", error: error.message });
        }
    },

    getAllClasses: async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = "createdAt" } = req.query;

            const classes = await Class.find()
                .sort({ [sort]: 1 })
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Class.countDocuments();

            res.status(200).json({
                message: "Classes fetched successfully.",
                total,
                page: Number(page),
                limit: Number(limit),
                classes
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch classes.", error: error.message });
        }
    }
};
