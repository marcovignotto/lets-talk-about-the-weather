const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const Location = require("../models/Location");

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

    const { task, priority } = req.body;

    try {
      const newLocation = new Location({
        task,
        priority,
      });

      const toDo = await newLocation.save();

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

// @route   DELETE api/location/:id
// @desc    Delete location
// @access  Private

module.exports = router;
