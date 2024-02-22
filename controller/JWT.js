const jwt = require("jsonwebtoken");
const mus = require("../model/userschema");

const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies ? req.cookies.token : null;
    console.log(req.path);
    if (!req.path === "/products_list") req.session.sort = 'relevance';
    if (!token) {
      console.log("token1");
      return req.path === "/login" ||
        req.path === "/signup" ||
        req.path === "/otpverification" ||
        req.path === "/ForgotPassword"
        ? next()
        : res.redirect("/login");
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, success) => {
      if (err) {
        if (err.message === "TokenExpirationError") {
          req.session.err = "Session Expired";
          res.clearCookie("token");
          console.log("token2");
          return req.path === "/login" || req.path === "/signup"
            ? next()
            : res.redirect("/login");
        } else {
          req.sesssion.err = "Internal server Error";
          res.clearCookie("token");
          console.log("token3");
          return req.path === "/login" || req.path === "/signup"
            ? next()
            : res.redirect("/login");
        }
      } else {
        const user = await mus.findById(success.userId);
        console.log(user);
        if (!user) {
          req.session.err = "User Not Found";
          res.clearCookie("token");
          console.log("token4");
          return req.path === "/login" || req.path === "/signup"
            ? next()
            : res.redirect("/login");
        }
        if (user.isblocked) {
          req.session.err = "Sorry User Blocked";
          res.clearCookie("token");
          console.log("token5");
          return req.path === "/login" || req.path === "/signup"
            ? next()
            : res.redirect("/login");
        }
        if (req.path === "/login" || req.path === "/signup") {
          return res.redirect("/");
        }
        req.userId = user._id;
        return next();
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { verifyJwt };
