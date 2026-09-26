import mongoose from "mongoose";

const machinerySchema = new mongoose.Schema(
  {
    // The logged-in farmer who listed this machine for rent
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    machineName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Tractor",
        "Thresher",
        "Harvester",
        "Rotavator",
        "Sprayer",
        "Seed Drill",
        "Cultivator",
        "Other",
      ],
    },

    ownerName: {
      type: String,
      required: true,
    },

    rentPerDay: {
      type: Number,
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

    phone: {
      type: String,
      required: true,
    },

    availability: {
      type: String,
      enum: ["Available", "Rented"],
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

export default mongoose.model("Machinery", machinerySchema);
