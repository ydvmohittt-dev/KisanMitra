import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    note: { type: String, default: "" },
  },
  { _id: true },
);

const financeEntrySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Receivable", "Payable"],
      required: true,
    },
    amount: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    description: { type: String, default: "" },
    payments: { type: [paymentSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("FinanceEntry", financeEntrySchema);
