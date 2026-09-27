import Machinery from "../models/Machinery.js";
import User from "../models/User.js";


export const getMachinery = async (req, res) => {
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

    const machines = await Machinery.find(filter).sort({ createdAt: -1 });

    res.json({ machines });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get machinery" });
  }
};


export const getMachineryById = async (req, res) => {
  try {
    const machine = await Machinery.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }
    res.json(machine);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Machine not found" });
  }
};


export const addMachinery = async (req, res) => {
  try {
    const farmer = await User.findById(req.user.id);

    const machine = new Machinery({
      ...req.body,
      ownerId: req.user.id,
      village: req.body.village || farmer.village,
      city: req.body.city || farmer.city,
    });

    const savedMachine = await machine.save();
    res.status(201).json(savedMachine);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to list machine" });
  }
};


export const deleteMachinery = async (req, res) => {
  try {
    const machine = await Machinery.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    if (machine.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only remove machines you listed" });
    }

    await machine.deleteOne();
    res.json({ message: "Machine removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to remove machine" });
  }
};
