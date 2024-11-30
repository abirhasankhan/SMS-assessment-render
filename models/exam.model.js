import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", // References the Class schema
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    examTime: {
        type: String,
        required: true
    },

    remarks: {
        type: String
    }
}, {
    timestamps: true
});

export const Exam = mongoose.model("Exam", examSchema);
