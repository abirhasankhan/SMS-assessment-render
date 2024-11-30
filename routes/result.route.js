import express from "express";
import { ResultController } from "../controllers/result.controller.js"; // Import the ResultController

const router = express.Router();

// Route for fetching all results
router.get("/", ResultController.getAllResults);

// Route for adding a new result
router.post("/", ResultController.addResult);


// Route for updating a result by ID
router.put("/:resultId", ResultController.editResult);

// Route for removing a result by ID
router.delete("/:resultId", ResultController.removeResult);

// Route for searching results by studentId or examId
router.get("/search", ResultController.searchResult);

export default router;
