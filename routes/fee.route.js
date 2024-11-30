import express from "express";
import { FeeController } from "../controllers/fee.controller.js"; // Import the FeeController

const router = express.Router();

// Route for fetching all fee records
router.get("/", FeeController.getAllFees);

// Route for adding a new fee record
router.post("/", FeeController.addFee);

// Route for updating a fee record by ID
router.put("/:feeId", FeeController.editFee);

// Route for removing a fee record by ID
router.delete("/:feeId", FeeController.removeFee);

// Route for searching fees by student ID or status
router.get("/search", FeeController.searchFee);

export default router;
