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

const productList = async (req, res, next) => {
  try {
    const CAteQuery = req.query._id || null;
    let sort = { _id: 1 };
    // Define the query condition based on the existence of CAteQuery
    if (req.session.sort) {
      if (req.session.sort === "low") sort = { price: 1 };
      else if (req.session.sort === "high") sort = { price: -1 };
      else if (req.session.sort === "new") sort = { _id: -1 };
    } else {
      req.session.sort = "relevance";
    }

    console.log(sort,'__________________________');
    const queryCondition = CAteQuery
      ? { islist: true, parentCategory: CAteQuery }
      : { islist: true };

    const productdetails = await product
      .find(queryCondition)
      .sort(sort)
      .populate("parentCategory");

    const categories = await category.find({ isActive: true });

    res.render("product_list", {
      productdetails,
      category: categories,
      sort: req.session.sort,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const sort = async (req, res) => {
  try {
    const { sort } = req.body;
    req.session.sort = sort;
    res.status(200).json({ status: true });
  } catch (e) {
    console.log(e);
    res.status(404).json({ status: true });
  }
};

const productDetails = async (req, res, next) => {
  try {
    const productid = req.params.id;

    const productdetails = await product
      .findOne({ _id: productid })
      .populate("parentCategory");
    const categories = await category.find({ isActive: true });

    res.render("product", { productdetails, category: categories });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  productList,
  productDetails,
  sort,
};
