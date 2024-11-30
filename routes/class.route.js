import express from "express";
import { ClassController } from "../controllers/class.controller.js";

const router = express.Router();

/**
 * @route   GET /api/classes
 * @desc    Fetch all classes with optional pagination and sorting
 */
router.get("/", ClassController.getAllClasses);

/**
 * @route   POST /api/classes
 * @desc    Add a new class
 */
router.post("/", ClassController.addClass);

/**
 * @route   PUT /api/classes/:classId
 * @desc    Update an existing class by ID
 */
router.put("/:classId", ClassController.editClass);

/**
 * @route   DELETE /api/classes/:classId
 * @desc    Remove a class by ID
 */
router.delete("/:classId", ClassController.removeClass);

/**
 * @route   GET /api/classes/search
 * @desc    Search classes by name
 */
router.get("/search", ClassController.searchClassByName);

export default router;
