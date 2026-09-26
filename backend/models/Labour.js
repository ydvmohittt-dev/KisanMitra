import mongoose from "mongoose";

const labourSchema = new mongoose.Schema(
  {
    // The logged-in farmer who added this labour profile
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    city: {
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

export default mongoose.model("Labour", labourSchema);
