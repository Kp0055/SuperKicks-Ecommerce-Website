const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    parentuser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mus',
      },
      

      address:[{

  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  landmark: {
    type: String
  },
  alternativePhoneNumber: {
    type: String
  }
}]
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
