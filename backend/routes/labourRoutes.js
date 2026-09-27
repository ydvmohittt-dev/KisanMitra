import express from "express";
import { getLabours, getLabourById, addLabour, deleteLabour } from "../controllers/labourController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLabours);
router.get("/:id", protect, getLabourById);
router.post("/", protect, addLabour);
router.delete("/:id", protect, deleteLabour);

export default router;
