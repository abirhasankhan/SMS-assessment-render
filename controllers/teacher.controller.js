import { Teacher } from "../models/teacher.model.js";

// Controller for handling teacher-related operations
export const TeacherController = {
    // Add a new teacher
    addTeacher: async (req, res) => {
        try {
            const { teacherId, firstName, lastName, email, phone, subject, remarks } = req.body;

            // Check for duplicate email or teacherId
            const existingTeacher = await Teacher.findOne({ $or: [{ email }, { teacherId }] });
            if (existingTeacher) {
                return res.status(400).json({ message: "Email or Teacher ID already exists." });
            }

            // If no teacherID is provided
            if (!teacherId) {
                return res.status(400).json({ message: "Teacher ID is required." });
            }

            // Create and save a new teacher
            const teacher = new Teacher({ teacherId, firstName, lastName, email, phone, subject, remarks });
            await teacher.save();

            res.status(201).json({ message: "Teacher added successfully.", teacher });
        } catch (error) {
            res.status(500).json({ message: "Failed to add teacher.", error: error.message });
        }
    },

    // Edit an existing teacher
    editTeacher: async (req, res) => {
        try {
            const { teacherId } = req.params;
            const updates = req.body;

            // Find and update teacher by teacherId
            const teacher = await Teacher.findOneAndUpdate({ teacherId }, updates, { new: true });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found." });
            }

            res.status(200).json({ message: "Teacher updated successfully.", teacher });
        } catch (error) {
            res.status(500).json({ message: "Failed to update teacher.", error: error.message });
        }
    },

    // Remove a teacher
    removeTeacher: async (req, res) => {
        try {
            const { teacherId } = req.params;

            // Find and delete teacher by teacherId
            const teacher = await Teacher.findOneAndDelete({ teacherId });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found." });
            }

            res.status(200).json({ message: "Teacher removed successfully.", teacher });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove teacher.", error: error.message });
        }
    },

    // Fetch all teachers
    getAllTeachers: async (req, res) => {
        try {
            const teachers = await Teacher.find();
            res.status(200).json({ teachers });
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch teachers.", error: error.message });
        }
    },

    // Fetch a single teacher by teacherId
    getTeacherById: async (req, res) => {
        try {
            const { teacherId } = req.params;
            const teacher = await Teacher.findOne({ teacherId });
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found." });
            }

            res.status(200).json({ teacher });
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch teacher.", error: error.message });
        }
    },

    // Search teachers by name
    searchTeacherByName: async (req, res) => {
        try {
            const { name } = req.query;

            if (!name) {
                return res.status(400).json({ message: "Name query parameter is required." });
            }

            // Perform case-insensitive search using regex
            const teachers = await Teacher.find({
                $or: [
                    { firstName: { $regex: name, $options: "i" } },
                    { lastName: { $regex: name, $options: "i" } }
                ]
            });

            if (teachers.length === 0) {
                return res.status(404).json({ message: "No teachers found with the given name." });
            }

            res.status(200).json({ teachers });
        } catch (error) {
            res.status(500).json({ message: "Failed to search teachers.", error: error.message });
        }
    }
};
