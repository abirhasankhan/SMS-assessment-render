import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
    studentId: {
        type: String,
        ref: "Student", // References the Student schema
        required: true
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        maxlength: 20,
        required: true
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

export const Fee = mongoose.model("Fee", feeSchema);
