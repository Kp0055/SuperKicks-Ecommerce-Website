const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BannerSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  image :{
    type : String,
  },
  
});

// Create a model for the banner schema
const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
