import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    studentId: {
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
    dob: {
        type: Date,
        required: true
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
    address: {
        type: String,
        maxlength: 255
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", // References the Class schema
        default: null
    },
    medicalHistory: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

export const Student = mongoose.model("Student", studentSchema);
