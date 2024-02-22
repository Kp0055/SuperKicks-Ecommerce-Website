const mongoose = require('mongoose');
const crypto = require('crypto');
const { stringify } = require('querystring');
const { Stream } = require('stream');
const mongoosePaginate = require('mongoose-paginate');

const orderSchema = mongoose.Schema({
  orderId: {
      type: String,
      unique: true,
      default: function () {
          const randomstring = crypto.randomBytes(6).toString('hex').toUpperCase();
          return `ORDER${randomstring}`;
      }
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
  },
  date: {
      type: Date,
      default: Date.now(),
  },
  totalamount: {
      type: Number,
      required: true
  },
  PaymentMethod: {
      type: String,
      required: true,  // Fixed the typo here
  },
  product: [
      {
          productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "product"
          },
          quantity: {
              type: Number,
              required: true
          },
          saleprice: {
              type: Number,
          },
          total: {
              type: Number,
          },
          cancelOrder: {
              type: String,
              default: 'pending',
              cancelStatus: ['pending', 'processing', 'shipping', 'deliverd', 'canceled', 'returned', 'failed']
          },
          reason: {
              type: String,
          },
      },
  ],
  address: {
      name: {
          type: String,
          require: true
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
      },
  },
  discountPrice :{
    type:Number,
    require:true,
  },
  orderstatus: {
      type: String,
      default: 'pending',
      ordercancelStatus: ['pending', 'processing', 'shipped', 'delivered', 'canceled', 'returned', 'failed']
  },
  deliverDate: {
      type: Date,
      default: '',
  },
  paymentStatus: {
      type: String,
      default: 'pending',
  },
}, {
  timestamps: true,
});


orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

