/**
 * @desc CTRL for auth route (authentication)
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

const BackendUser = require("../models/BackendUser");

exports.get = async (req, res, next) => {
  try {
    // req.user is assign in the middleware
    const user = await BackendUser.findById(req.user.id).select("-password");

    return res.json({ success: true, data: user });
  } catch (err) {
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};

exports.post = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await BackendUser.findOne({ email });

    if (!user) {
      return next({
        success: false,
        message: "Invalid credentials",
        status: 400,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next({
        success: false,
        message: "Invalid credentials",
        status: 400,
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );

    return res.send({
      success: true,
      message: "authenticated",
      data: token,
    });
  } catch (err) {
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};
