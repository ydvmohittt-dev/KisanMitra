import FinanceEntry from "../models/FinanceEntry.js";

//calculation of total paid 
const getPaidAmount = (entry) =>
  entry.payments.reduce((total, payment) => total + payment.amount, 0);

const addStatus = (entry) => {
  const paid = getPaidAmount(entry);
  const remaining = Math.max(entry.amount - paid, 0);

  return {
    ...entry.toObject(),
    paidAmount: paid,
    remainingAmount: remaining,
    status: remaining === 0 ? "Paid" : "Pending",
  };
};

export const getFinanceEntries = async (req, res) => {
  try {
    const entries = await FinanceEntry.find({
      ownerId: req.user.id,
    }).sort({
      date: -1,
    });

    let receivable = 0;
    let payable = 0;

    const formattedEntries = entries.map((entry) => {
      const item = addStatus(entry);

      if (item.type === "Receivable") {
        receivable += item.remainingAmount;
      }

      if (item.type === "Payable") {
        payable += item.remainingAmount;
      }

      return item;
    });

    res.json({
      summary: {
        receivable,
        payable,
        netBalance: receivable - payable,
      },
      entries: formattedEntries,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to load finance entries",
    });
  }
};

// POST /api/finance
export const addFinanceEntry = async (req, res) => {
  try {
    const { personName, mobile, type, amount, date, dueDate, description } =
      req.body;

    if (!personName || !mobile || !type || !amount || !date || !dueDate) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const entry = await FinanceEntry.create({
      ownerId: req.user.id,
      personName,
      mobile,
      type,
      amount: Number(amount),
      date,
      dueDate,
      description,
    });

    res.status(201).json(addStatus(entry));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add finance entry" });
  }
};

// GET /api/finance/:id
export const getFinanceEntry = async (req, res) => {
  try {
    const entry = await FinanceEntry.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Finance entry not found" });
    }

    res.json(addStatus(entry));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load finance entry" });
  }
};

// POST /api/finance/:id/payments
export const addPayment = async (req, res) => {
  try {
    const { amount, date, note } = req.body;
    const entry = await FinanceEntry.findOne({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Finance entry not found" });
    }

    const paidAmount = getPaidAmount(entry);
    const remaining = entry.amount - paidAmount;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Enter a valid payment amount" });
    }

    if (Number(amount) > remaining) {
      return res.status(400).json({
        message: `Payment cannot be more than the remaining amount of ₹${remaining}`,
      });
    }

    entry.payments.push({
      amount: Number(amount),
      date: date || new Date(),
      note: note || "",
    });
    await entry.save();

    res.json(addStatus(entry));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add payment" });
  }
};

export const deleteFinanceEntry = async (req, res) => {
  try {
    const entry = await FinanceEntry.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Finance entry not found" });
    }

    res.json({ message: "Finance entry deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete finance entry" });
  }
};
