import { Attendance } from "../models/attendance.model.js";

export const AttendanceController = {
    // Add new attendance
    addAttendance: async (req, res) => {
        try {
            const { studentId, classId, date, status, remarks } = req.body;

            // Validate required fields
            if (!studentId || !classId || !date || !status) {
                return res.status(400).json({ message: "Student ID, Class ID, Date, and Status are required." });
            }

            // Ensure the combination of studentId, classId, and date is unique
            const existingAttendance = await Attendance.findOne({ studentId, classId, date });
            if (existingAttendance) {
                return res.status(409).json({
                    message: "Attendance for this student in the specified class on the given date already exists."
                });
            }

            const newAttendance = new Attendance({ studentId, classId, date, status, remarks });
            await newAttendance.save();
            res.status(201).json({ message: "Attendance added successfully.", newAttendance });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ message: "Validation failed.", error: error.message });
            }
            res.status(500).json({ message: "Failed to add attendance.", error: error.message });
        }
    },

    // Edit existing attendance
    editAttendance: async (req, res) => {
        try {
            const { attendanceId } = req.params;
            const updates = req.body;

            // Validate updates to prevent duplicates
            if (updates.studentId && updates.classId && updates.date) {
                const duplicate = await Attendance.findOne({
                    studentId: updates.studentId,
                    classId: updates.classId,
                    date: updates.date,
                    _id: { $ne: attendanceId }
                });
                if (duplicate) {
                    return res.status(409).json({
                        message: "An attendance record for this student in the specified class on the given date already exists."
                    });
                }
            }

            const updatedAttendance = await Attendance.findByIdAndUpdate(attendanceId, updates, {
                new: true,
                runValidators: true
            });
            if (!updatedAttendance) return res.status(404).json({ message: "Attendance not found." });

            res.status(200).json({ message: "Attendance updated successfully.", updatedAttendance });
        } catch (error) {
            if (error.name === "ValidationError") {
                return res.status(400).json({ message: "Validation failed.", error: error.message });
            }
            res.status(500).json({ message: "Failed to update attendance.", error: error.message });
        }
    },

    // Remove attendance by ID
    removeAttendance: async (req, res) => {
        try {
            const { attendanceId } = req.params;
            const removedAttendance = await Attendance.findByIdAndDelete(attendanceId);
            if (!removedAttendance) return res.status(404).json({ message: "Attendance not found." });

            res.status(200).json({ message: "Attendance removed successfully.", removedAttendance });
        } catch (error) {
            res.status(500).json({ message: "Failed to remove attendance.", error: error.message });
        }
    },

    // Search attendance by studentId and/or classId
    searchAttendance: async (req, res) => {
        try {
            const { studentId, classId } = req.query;

            if (!studentId && !classId) {
                return res.status(400).json({ message: "At least one of Student ID or Class ID query parameter is required." });
            }

            const query = {};
            if (studentId) query.studentId = studentId;
            if (classId) query.classId = classId;

            const attendances = await Attendance.find(query);
            if (attendances.length === 0) return res.status(404).json({ message: "No attendance records found." });

            res.status(200).json({ attendances });
        } catch (error) {
            res.status(500).json({ message: "Failed to search attendance.", error: error.message });
        }
    },

    // Fetch all attendance records
    getAllAttendance: async (req, res) => {
        try {
            const attendance = await Attendance.find();
            res.status(200).json({attendance});
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch attendance records.", error: error.message });
        }
    }
};
