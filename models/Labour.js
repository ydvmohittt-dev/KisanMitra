const mongoose = require("mongoose");

const labourSchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    workType: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      required: true,
    },

    expectedSalary: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    availability: {
      type: String,
      enum: ["Available", "Busy"],
      default: "Available",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Labour", labourSchema);
