/**
 * @desc CTRL for users route (signup)
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BackendUser = require("../models/BackendUser");

exports.post = async (req, res, next) => {
  const { userName, email, password } = req.body;

  try {
    let user = await BackendUser.findOne({ email });

    if (user) {
      return next({
        success: false,
        message: "Username already exists!",
        status: 400,
      });
    }

    user = new BackendUser({
      userName,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);

    // insert the hashed password into the obj
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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
    console.error(err.message);
    return next({
      success: false,
      message: "Server error",
      status: 500,
      error: err.message,
    });
  }
};
