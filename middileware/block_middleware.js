const mus = require("../model/userschema");

const block = async (req, res, next) => {
  try {
    const blockdata = req.userId;

    // Use findOne to find a single document
    const user = await mus.findOne({ _id: blockdata });

    

    if (user && user.isblocked === true) {
      // Redirect if the user is blocked
      return res.redirect("/login");
    }

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = block;
