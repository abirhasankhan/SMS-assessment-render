import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    studentId: {
        type: String, // Using String for studentID
        ref: "Student", // References the studentID field in the Student schema
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam", // References the Exam schema
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        maxlength: 5,
        required: true
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

export const Result = mongoose.model("Result", resultSchema);
