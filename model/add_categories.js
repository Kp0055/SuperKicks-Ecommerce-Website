const mongoose = require("mongoose");

const categorieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },

  discount: {
    type: Number,

  },
  image: {
    type: String,
  },
  isActive: {
    type : Boolean,
    default :true
  },
});

const categories = mongoose.model("categories", categorieSchema);

module.exports = categories
