/**
 * @description CRUD route for the locations
 * displayed in the frontend
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { get, post, put, del } = require("../controllers/locations");

// @route   GET api/location
// @desc    Get all locations
// @access  Public

router.get("/", get);

// @route   POST api/location
// @desc    add a location
// @access  Private

router.post("/", auth, post);

// @route   PUT api/location/:id
// @desc    Update location
// @access  Private

router.put("/:id", auth, put);

// @route   DELETE api/location/:id
// @desc    Delete location
// @access  Private

router.delete("/:id", auth, del);

module.exports = router;
