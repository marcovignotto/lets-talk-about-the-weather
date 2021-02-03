const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  // get token
  // const token = req.header("x-auth-token");
  // for bearer token auth

  // OLD
  // const token = req.header("Authorization").split(" ")[1];
  // if (!token)
  //   res.status(401).json({ msg: "No token, no auth!" });

  // starts automaticaly
  try {
    let reqHeader = await req.header("Authorization");
    // console.log(reqHeader);
    let token = "";

    if (reqHeader !== undefined) {
      token = req.header("Authorization").split(" ")[1];
    }
    if (!reqHeader || reqHeader === undefined || reqHeader === null)
      res.status(401).json({ msg: "No token, no auth!" });
    // console.log(token);

    const decoded = jwt.verify(token, config.get("authLocalApi.jwtSecret"));

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "No valid token!" });
  }
};
