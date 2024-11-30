import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100
    },
    phone: {
        type: String,
        maxlength: 15
    },
    subject: {
        type: String,
        maxlength: 50
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
