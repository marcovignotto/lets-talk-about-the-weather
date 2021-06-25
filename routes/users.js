/**
 * @description route for the creation / edit / delete
 * of users for the backend
 */

const express = require("express");
const router = express.Router();

const { post } = require("../controllers/users");

const { userEmailValidator } = require("../middleware/validators");

/**
 * @desc commmet route to disable signup
 */

router.post("/", userEmailValidator, post);

module.exports = router;
