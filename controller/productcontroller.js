const mus = require("../model/userschema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { consumers } = require("nodemailer/lib/xoauth2");
const crypto = require("crypto");
const { log } = require("console");
const { token } = require("morgan");
const product = require("../model/add_product");
const category = require("../model/add_categories");
const cookie = require("cookie");
const Myaddress = require("../model/add_address");
const mongoose = require("mongoose");
const cart = require("../model/cart");
const Order = require("../model/order");
const { addAbortSignal } = require("stream");

const productList = async (req, res,next) => {
    try {
      const CAteQuery = req.query._id || null;
  
      // Define the query condition based on the existence of CAteQuery
      const queryCondition = CAteQuery
        ? { islist: true, parentCategory: CAteQuery }
        : { islist: true };
  
      const productdetails = await product
        .find(queryCondition)
        .populate("parentCategory");
  
      const categories = await category.find({ isActive: true });
  
      res.render("product_list", { productdetails, category: categories });
    } catch (error) {
      console.error(error);
      next(error)
    }
  };
  
  const productDetails = async (req, res,next) => {
    try{
    const productid = req.params.id;
  
    const productdetails = await product
      .findOne({ _id: productid })
      .populate("parentCategory");
    const categories = await category.find({ isActive: true });
  
    res.render("product", { productdetails, category: categories });
  } catch (error) {
    console.error(error);
    next(error)
  }
  };

module.exports = {
    productList,
    productDetails

}