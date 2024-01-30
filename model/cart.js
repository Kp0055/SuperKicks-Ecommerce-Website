const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mus", 
  },
  product: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", 
      },
      quantity: {
        type: Number,
        required: true,
      },
      isSelected: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalamount: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

