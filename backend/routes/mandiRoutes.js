import express from "express";
import { getMandiPrices } from "../controllers/mandiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMandiPrices);

export default router;
