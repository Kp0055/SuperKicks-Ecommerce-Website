const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");
const mongoosePaginate = require('mongoose-paginate');

const adminHome = async (req, res, next) => {
  try {
    // Find all orders and populate product details
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date of one week ago
    
    const ordersCountPerDayOfWeek = await Order.aggregate([
      {
        $match: {
          date: { $gte: oneWeekAgo, $lt: today } // Filter orders for the past week
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" }, // Group by day of the week (Sunday: 1, Monday: 2, ..., Saturday: 7)
          count: { $sum: 1 } // Count the orders for each day
        }
      },
      {
        $project: {
          _id: 0,
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                { case: { $eq: ["$_id", 2] }, then: "Monday" },
                { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                { case: { $eq: ["$_id", 6] }, then: "Friday" },
                { case: { $eq: ["$_id", 7] }, then: "Saturday" }
              ]
            }
          },
          count: 1
        }
      }
    ]);
    
    console.log(ordersCountPerDayOfWeek);
    



    const latest_Order = await Order.find({}).populate('product.productId').sort({ date: -1 }).limit(5);

    const orderCount = await Order.find({}).countDocuments();
    const userCount = await mus.find({}).countDocuments();

    // Sort orders by date in descending order
    latest_Order.sort((a, b) => b.date - a.date);

    // Organize orders by date and count orders for each day
    const ordersByDay = {};
    latest_Order.forEach(order => {
      const dateKey = order.date.toDateString(); // Extract date without time
      if (!ordersByDay[dateKey]) {
        ordersByDay[dateKey] = 1; // Initialize count for the day
      } else {
        ordersByDay[dateKey]++; // Increment count for the day
      }
    });

    // Send organized data to the frontend
    res.render("admin", {
      ordersByDay: JSON.stringify(ordersByDay),
      latest_Order: latest_Order,
      orderCount: orderCount,
      userCount: userCount,
      ordersCountPerDayOfWeek
  });
  

    console.log(ordersByDay);


  } catch (error) {
    console.error(error);
    next(error);
  }
};


const getLogin = (req, res, next) => {
  try {
   
    if ( req.session.verify) {
     
      res.redirect("/admin");
    } else {
      // User is not logged in, render the login page

      // Retrieve session variables
      const notfound = req.session.notfound;
      const passwordmessage = req.session.passwordmsg;

      // Clear session variables
      req.session.notfound = null;
      req.session.passwordmsg = null;

      // Render the login page
      res.render("admin-login", { notfound, passwordmessage });
    }
  } catch (error) {
    console.error(error);
    next(error);
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
  const full_Order = await Order.find({}).sort({ createdAt: -1 });

  res.render("admin_Order", { full_Order });
  
}catch(error){
  console.error(error);
  next(error)
}
};
const orderDetails = async (req, res,next) => {
  try{
  const orderId = req.params.MyOrder;
  const selected = req.body.dataToSend

  console.log(selected);

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


const daily_Report = async (req, res, next) => {
  try {
    let { page, limit, start_date, end_date } = req.query;

    let query = {};

   
    if (start_date && end_date) {
     
      const startDate = req.session.startDate = new Date(start_date);
      const endDate = req.session.endDate = new Date(end_date);

      console.log(endDate,startDate);

   
      if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate
        };
      } else {
        throw new Error('Invalid date format');
      }
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // If start_date and end_date are not provided, query all orders
    const order_Query = start_date && end_date ? Order.find(query) : Order.find();

    const order_Report = await order_Query
      .populate('product.productId')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.render('admin_daily_report', {
      order_Report,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    next('error');
  }
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
};
