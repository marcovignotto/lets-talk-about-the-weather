const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // get token
  const token = req.header("x-auth-token") || req.header("Bearer");
  // const token = req.header("Bearer");
  // check if not token
  if (!token) res.status(401).json({ msg: "No token, no auth!" });

  try {
    const decoded = jwt.verify(token, config.get("authLocalApi.jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "No valid token!" });
  }
};
