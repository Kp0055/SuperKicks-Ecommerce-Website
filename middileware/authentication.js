const jwt = require("jsonwebtoken");
const cookie = require("cookie");

function verifyToken(req, res, next) {
  const cookies = cookie.parse(req.headers.cookie || "");

  const token = cookies.token;
  console.log(token);

  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, "ACCESS_TOKEN_SECRET");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Token has expired
      return res.redirect("/login"); // Redirect to login page
    }
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
