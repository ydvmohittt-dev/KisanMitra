const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const labourRoutes = require("./routes/labourRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use("/api/labours", labourRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "labour.html"));
});
app.get("/hirelabour",(req,res)=>{
    res.sendFile(path.join(__dirname, "public", "labour.html"))
})
app.get("/weatherdetails",(req,res)=>{
    res.sendFile(path.join(__dirname, "public", "weather.html"))
})
app.get("/mandi",(req,res)=>{
    res.sendFile(path.join(__dirname, "public", "mandi.html"))
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
