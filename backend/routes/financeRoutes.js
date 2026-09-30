import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getFinanceEntries,
  addFinanceEntry,
  getFinanceEntry,
  addPayment,
  deleteFinanceEntry,
} from "../controllers/financeController.js";

const router = express.Router();

router.get("/", protect, getFinanceEntries);
router.post("/", protect, addFinanceEntry);
router.get("/:id", protect, getFinanceEntry);
router.post("/:id/payments", protect, addPayment);
router.delete("/:id", protect, deleteFinanceEntry);

export default router;
