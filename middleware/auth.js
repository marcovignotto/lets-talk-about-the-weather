const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  // OLD
  const token = req.header("Authorization").split(" ")[1];
  if (!token) res.status(401).json({ msg: "No token, no auth!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "No valid token!" });
  }
};
