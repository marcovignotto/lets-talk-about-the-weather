/**
 * @description CRUD route for the weather users
 * linkend with  a location, displayed in the backend
 */
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { locationValidator } = require("../middleware/validators");

const { get, post, put, del } = require("../controllers/weatherUsers");

// @route   GET api/weatherusers
// @desc    Get all weatherusers
// @access  Private

router.get("/", auth, get);

// @route   POST api/weatherusers
// @desc    add a weatherusers
// @access  Private

router.post("/", auth, locationValidator, post);

// @route   PUT api/weatherusers/:id
// @desc    Update weatherusers
// @access  Private

router.put("/:id", auth, locationValidator, put);

// @route   DELETE api/weatherusers/:id
// @desc    Delete weatherusers
// @access  Private

router.delete("/:id", auth, del);

module.exports = router;
