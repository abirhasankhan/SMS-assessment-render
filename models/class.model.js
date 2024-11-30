import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher", // References the Teacher schema
        default: null
    },
    remarks: {
        type: String,
        maxlength: 200
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

export const Class = mongoose.model("Class", classSchema);
