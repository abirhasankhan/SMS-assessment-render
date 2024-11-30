import { Student } from "../models/student.model.js";

export const StudentController = {
    // Add a new student
    addStudent: async (req, res) => {
        try {
            const {
                studentId,
                firstName,
                lastName,
                dob,
                email,
                phone,
                address,
                classId,
                medicalHistory,
                remarks,
            } = req.body;

            // Check for duplicate email or teacherId
            const existingStudent = await Student.findOne({
                $or: [{ email }, { studentId }],
            });
            if (existingStudent)
                return res.status(400).json({
                    message: "Email or Student ID already exists.",
                });

            // If no teacherID is provided
            if (!studentId) {
                return res.status(400).json({ message: "Student ID is required." });
            }

            // Create and save a new student
            const student = new Student({
                studentId,
                firstName,
                lastName,
                dob,
                email,
                phone,
                address,
                classId,
                medicalHistory,
                remarks,
            });

            await student.save();

            res.status(201).json({
                message: "Student added successfully.",
                student: student,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to add student.",
                error: error.message,
            });
        }
    },

    // Edit an existing student
    editStudent: async (req, res) => {
        try {
            const { studentId } = req.params;
            const updates = req.body;

            const updatedStudent = await Student.findOneAndUpdate(
                { studentId },
                updates,
                { new: true }
            );

            if (!updatedStudent)
                return res.status(404).json({ message: "Student not found." });

            res.status(200).json({
                message: "Student updated successfully.",
                student: updatedStudent,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update student.",
                error: error.message,
            });
        }
    },

    // Remove a student by ID
    removeStudent: async (req, res) => {
        try {
            const { studentId } = req.params;

            const removedStudent = await Student.findOneAndDelete({studentId});

            if (!removedStudent)
                return res.status(404).json({ message: "Student not found." });

            res.status(200).json({
                message: "Student removed successfully.",
                student: removedStudent,
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to remove student.",
                error: error.message,
            });
        }
    },

    // Search students by name (firstName or lastName)
    searchStudentByName: async (req, res) => {
        try {
            const { name } = req.query;

            if (!name)
                return res
                    .status(400)
                    .json({ message: "Name query parameter is required." });

            const students = await Student.find({
                $or: [
                    { firstName: { $regex: name, $options: "i" } },
                    { lastName: { $regex: name, $options: "i" } },
                ],
            });

            if (students.length === 0)
                return res.status(404).json({ message: "No students found." });

            res.status(200).json(students);
        } catch (error) {
            res.status(500).json({
                message: "Failed to search students.",
                error: error.message,
            });
        }
    },

    // Fetch all students
    getAllStudents: async (req, res) => {
        try {
            const students = await Student.find();
            res.status(200).json({students});
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch students.",
                error: error.message,
            });
        }
    },

    // Fetch a student by ID
    getStudentById: async (req, res) => {
        try {
            const { studentId } = req.params;
            const student = await Student.findOne({ studentId });

            if (!student)
                return res.status(404).json({ message: "Student not found." });

            res.status(200).json(student);
        } catch (error) {
            res.status(500).json({
                message: "Failed to fetch student.",
                error: error.message,
            });
        }
    },

    // Search teachers by name
    searchStudentByName: async (req, res) => {
        try {
            const { name } = req.query;

            if (!name) {
                return res.status(400).json({ message: "Name query parameter is required." });
            }

            // Perform case-insensitive search using regex
            const students = await Student.find({
                $or: [
                    { firstName: { $regex: name, $options: "i" } },
                    { lastName: { $regex: name, $options: "i" } }
                ]
            });

            if (students.length === 0) {
                return res.status(404).json({ message: "No students found with the given name." });
            }

            res.status(200).json({ students });
        } catch (error) {
            res.status(500).json({ message: "Failed to search students.", error: error.message });
        }
    }
};
