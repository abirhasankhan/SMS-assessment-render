import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            ref: "Student", // References the Student schema
            required: true
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class", // References the Class schema
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Late", "Excused"],
            default: "Present",
            required: true
        },
        remarks: {
            type: String,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
);

// Ensure a student cannot have duplicate attendance for the same class on the same date
attendanceSchema.index({ studentId: 1, classId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
