const mongoose = require("mongoose");
const { array } = require("../middileware/categorymulter");

const productschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
  },

  Description: {
    type: String,
    required: true,
  },

  stock: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    // required: true,
  },
  discount: {
    type: Number,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  image :[{
    type : String,
    // required : true

  }],
  islist :{
    type : Boolean,
    default : true
  }

});

 const product = mongoose.model('product',productschema);

 module.exports = product;
 


