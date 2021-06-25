/**
 * @description route for the authentication
 * of the users in the backend
 */

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { userEmailValidator } = require("../middleware/validators");

const { get, post } = require("../controllers/auth");

// @route   GET api/auth
// @desc    Get all auths
// @access  Private

router.get("/", auth, get);

// @route   POST api/auth
// @desc    add a auth
// @access  Public

router.post("/", userEmailValidator, post);

module.exports = router;
