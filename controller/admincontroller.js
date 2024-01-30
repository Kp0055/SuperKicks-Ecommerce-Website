const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");
const mongoosePaginate = require('mongoose-paginate');

const adminHome = async (req, res,next) => {
  try {

    const latest_Order = await Order.find({}).populate('product.productId').sort({date: -1});


    res.render("admin",{latest_Order});
 
  }catch(error){
    console.error(error);
    next(error)
  }
};

const getLogin = (req, res,next) => {

  try{

    const notfound = req.session.notfound
    const passwordmessage =   req.session.passwordmsg;

    req.session.notfound = null;
    req.session.passwordmsg = null;
    

  res.render("admin-login",{notfound,passwordmessage});
  
}catch(error){
  console.error(error);
  next(error)
}
  

};

const adminUser = async (req, res,next) => {
  try {
    const Data = await mus.find({});
    res.render("adminuser", { Data });
 
  }catch(error){
    console.error(error);
    next(error)
  }
};

const listOrder = async (req, res,next) => {
  try{
  const full_Order = await Order.find({});

  res.render("admin_Order", { full_Order });
  
}catch(error){
  console.error(error);
  next(error)
}
};
const orderDetails = async (req, res,next) => {
  try{
  const orderId = req.params.MyOrder;

  const productOrder = await Order.find({ _id: orderId }).populate(
    "product.productId"
  );

  res.render("admin_order_detail", { productOrder });
  
}catch(error){
  console.error(error);
  next(error)
}
};

const logout = (req, res,next) => {
  try{
  req.session.destroy();

  res.redirect("/admin/login");
  
}catch(error){
  console.error(error);
  next(error)
}
};

const daily_Report = async(req,res)=>{

  const order_Report = await Order.find({}).populate('product.productId').sort({ createdAt: +1 });

  

  res.render('admin_daily_report',{order_Report})
}

 const weekly_Report = async (req,res)=>{

  const order_Report = await Order.find({}).populate('product.productId').sort({ createdAt: -1 });

  res.render('admin_weekly_report',{order_Report})
 }

 const monthly_Report = async (req,res)=>{

  const order_Report = await Order.find({}).populate('product.productId').sort({ createdAt: -1 });
  res.render('admin_monthly_report',{order_Report})
 }

//post
const postLogin = async (req, res,next) => {
  const { email, password } = req.body;
  try {
    const adminData = await adminmongo.findOne({ email: email });

    if (!adminData) {
      req.session.notfound = "Email not Found";
      return res.redirect("/admin/login");
    }

    if (adminData.password === password) {
      req.session.verify = adminData;

      res.redirect("/admin");
    } else {
      req.session.passwordmsg = " password is wrong ";
      return res.redirect("/admin/login");
    }

  }catch(error){
    console.error(error);
    next(error)
  }
};

const block = async (req, res,next) => {
  const data = req.params.userId;

  console.log(data);

  try {
    const findData = await mus.findOne({ _id: data });

    findData.isblocked = !findData.isblocked;
    await findData.save();

    res.status(200).send("sucess");

  }catch(error){
    console.error(error);
    next(error)
  }
};
const orderStatus = async (req, res,next) => {
  try {
    const { orderId, currentStatus, newStatus } = req.body;

    console.log(orderId, currentStatus, newStatus);

    // Assuming you have a valid order model and schema
    const order = await Order.findOne({ oederId: orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the current status matches the status in the database
    if (order.orderstatus !== currentStatus) { // Fixed case sensitivity: change "orderStatus" to "orderstatus"
      return res.status(400).json({ error: 'Invalid current order status' });
    }

    // Update the order status
    order.orderstatus = newStatus; // Fixed case sensitivity: change "orderStatus" to "orderstatus"

    // Update the cancelOrder status based on the new order status
    if (['canceled', 'returned', 'failed', 'pending', 'processing', 'shipped', 'delivered'].includes(newStatus)) {
      order.product.forEach(product => {
        product.cancelOrder = newStatus;
      });
    }

    await order.save();

    return res.status(200).json({ success: true, message: 'Order status updated successfully' });
 
  }catch(error){
    console.error(error);
    next(error)
  }
};



module.exports = {
  adminHome,
  getLogin,
  adminUser,
  postLogin,
  block,
  listOrder,
  orderDetails,
  logout,
  orderStatus,
  daily_Report,
  weekly_Report,
  monthly_Report,
};
