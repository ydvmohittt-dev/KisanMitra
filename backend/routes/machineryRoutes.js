import express from "express";
import {
  getMachinery,
  getMachineryById,
  addMachinery,
  deleteMachinery,
} from "../controllers/machineryController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMachinery);
router.get("/:id", protect, getMachineryById);
router.post("/", protect, addMachinery);
router.delete("/:id", protect, deleteMachinery);

export default router;
