const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const General = require("../models/General");

// @route   GET api/location
// @desc    Get all locations
// @access  Private

router.get("/", async (req, res) => {
  try {
    const location = await Location.find({ location: req.location });
    // const location\ = await Location.find({ location: req.location }).sort({ date: -1 });

    res.json(location);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/location
// @desc    add a location
// @access  Private

router.post(
  "/",
  //   [
  //     check("Location", "Task is required").not().isEmpty(),
  //     check("priority", "Give it a priority").not().isEmpty(),
  //   ],
  async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // const { task, priority } = req.body;

    try {
      const newGeneral = new General({});

      const toDo = await newGeneral.save();

      res.json(toDo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/location/:id
// @desc    Update location
// @access  Private

// 6017c8b6ee1e290f38a21a9f
router.put("/:id", async (req, res) => {
  //   const { task, priority } = req.body;

  //   const todoFields = {};
  //   if (task) todoFields.task = task;
  //   if (priority) todoFields.priority = priority;

  try {
    let updGeneral = await General.findById(req.params.id);

    if (!updGeneral) return res.status(404).json({ msg: "General not found" });

    updGeneral = await General.findByIdAndUpdate(req.params.id, {
      date: Date.now(),
    });

    res.json(updGeneral);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/location/:id
// @desc    Delete location
// @access  Private

module.exports = router;
