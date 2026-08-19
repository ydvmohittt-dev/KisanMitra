const express = require("express");
const router = express.Router();

const Labour = require("../models/Labour");

// GET ALL LABOURS

router.get("/", async (req, res) => {
  try {
    const labours = await Labour.find();

    res.json({
      labours: labours,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get labour",
    });
  }
});

// GET ONE LABOUR

router.get("/:id", async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id);

    res.json(labour);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Labour not found",
    });
  }
});

// ADD LABOUR

router.post("/", async (req, res) => {
  try {
    const existingLabour = await Labour.findOne({
            ownerId: req.body.ownerId
        });

        if (existingLabour) {
            return res.status(400).json({
                message: "You already have a labour profile."
            });
        }
    const labour = new Labour(req.body);

    const savedLabour = await labour.save();

    res.json(savedLabour);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add labour",
    });
  }
});

// DELETE LABOUR

router.delete("/:id", async (req, res) => {
  try {
    await Labour.findByIdAndDelete(req.params.id);

    res.json({
      message: "Labour removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to remove labour",
    });
  }
});

module.exports = router;
