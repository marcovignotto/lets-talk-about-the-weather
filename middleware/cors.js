/**
 * @desc CORS Custom middleware
 */

module.exports = (req, res, next) => {
  const origin = req.headers.origin || "http://" + req.headers.host;

  const allowedOrigins = [
    "http://localhost:5000/",
    "http://127.0.0.1:5000/",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
  ];

  if (allowedOrigins.includes(origin)) {
    res.header(
      "Access-Control-Allow-Origin",
      allowedOrigins[allowedOrigins.findIndex((x) => x === origin)]
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.header("Access-Control-Allow-Credentials", true);

    next();
  } else {
    console.log("Access not allowed");
    return next({
      message: "Access not allowed",
      status: res.status(401),
    });
  }
};
