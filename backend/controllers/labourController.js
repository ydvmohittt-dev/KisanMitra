import Labour from "../models/Labour.js";
import User from "../models/User.js";


export const getLabours = async (req, res) => {
  try {
    const scope = req.query.scope || "village";

    let filter = {};

    if (scope !== "all") {
      const farmer = await User.findById(req.user.id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer profile not found" });
      }

      filter = scope === "city" ? { city: farmer.city } : { village: farmer.village, city: farmer.city };
    }

    const labours = await Labour.find(filter).sort({ createdAt: -1 });

    res.json({ labours });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get labour" });
  }
};


export const getLabourById = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }
    res.json(labour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Labour not found" });
  }
};


export const addLabour = async (req, res) => {
  try {
    const existingLabour = await Labour.findOne({ ownerId: req.user.id });
    if (existingLabour) {
      return res.status(400).json({ message: "You already have a labour profile." });
    }
    const labour = new Labour({...req.body,ownerId: req.user.id});
    const savedLabour = await labour.save();
    res.status(201).json(savedLabour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add labour" });
  }
};


export const deleteLabour = async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);
    if (!labour) {
      return res.status(404).json({ message: "Labour not found" });
    }

    if (labour.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only remove your own profile" });
    }

    await labour.deleteOne();
    res.json({ message: "Labour removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to remove labour" });
  }
};
