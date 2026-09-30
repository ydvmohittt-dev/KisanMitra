import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import labourRoutes from "./routes/labourRoutes.js";
import machineryRoutes from "./routes/machineryRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://kisan-mitra-kz0o7c81r-mohit-53ca.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/labours", labourRoutes);
app.use("/api/machinery", machineryRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/finance", financeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "KisanMitra API is running" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((e) => {
    console.log(e.message);
  });
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
