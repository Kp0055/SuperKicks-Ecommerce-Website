const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");
const mongoosePaginate = require("mongoose-paginate");
const { currentLineHeight } = require("pdfkit");

const adminHome = async (req, res, next) => {
  try {
    // Find all orders and populate product details
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get the date of one week ago

    const ordersCountPerDayOfWeek = await Order.aggregate([
      {
        $match: {
          date: { $gte: oneWeekAgo, $lt: today }, // Filter orders for the past week
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" }, // Group by day of the week (Sunday: 1, Monday: 2, ..., Saturday: 7)
          count: { $sum: 1 }, // Count the orders for each day
        },
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
                { case: { $eq: ["$_id", 7] }, then: "Saturday" },
              ],
            },
          },
          count: 1,
        },
      },
    ]);



    const totalAmount =  await Order.find({})
    .populate("product")
    

    const latest_Order = await Order.find({})
      .populate("product.productId")
      .sort({ date: -1 })
      .limit(5);

    const orderCount = await Order.find({}).countDocuments();
    const userCount = await mus.find({}).countDocuments();

    latest_Order.sort((a, b) => b.date - a.date);

    // Organize orders by date and count orders for each day
    const ordersByDay = {};

    latest_Order.forEach((order) => {
      const dateKey = order.date.toDateString(); // Extract date without time
      if (!ordersByDay[dateKey]) {
        ordersByDay[dateKey] = 1; // Initialize count for the day
      } else {
        ordersByDay[dateKey]++;
      }
    });

    const orderCountOfDaily = {};
    ordersCountPerDayOfWeek.forEach((data) => {
     
      const dateKey = data.day; // Extract date without time
      orderCountOfDaily[dateKey] = data.count; // Initialize count for the day
    });

     //best selling 

     const bestSeller = await Order.aggregate([
      { $unwind: "$product" },
      { $group: {
          _id: "$product.productId",
          totalQuantitySold: { $sum: "$product.quantity" }
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 3 },
      { $lookup: {
          from: "products", // Name of the collection in your database
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      { $project: {
          _id: 1,
          totalQuantitySold: 1,
          name: "$productInfo.name",
          image: "$productInfo.image"
        }
      }
  ]);
  

  const bestCategories = await Order.aggregate([
    // Unwind the product array to de-normalize it
    { $unwind: '$product' },
    // Lookup to fetch the details of the product
    {
      $lookup: {
        from: 'products', // Assuming your product collection is named 'products'
        localField: 'product.productId',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    // Unwind the productDetails array
    { $unwind: '$productDetails' },
    // Group by category and sum the quantities sold
    {
      $group: {
        _id: '$productDetails.parentCategory',
        totalQuantitySold: { $sum: '$product.quantity' }
      }
    },
    // Lookup to fetch the category details
    {
      $lookup: {
        from: 'categories', // Assuming your category collection is named 'categories'
        localField: '_id',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    // Unwind the categoryDetails array
    { $unwind: '$categoryDetails' },
    // Project to shape the output
    {
      $project: {
        categoryName: '$categoryDetails.name',
        categoryImage: '$categoryDetails.image', // Include the image field
        totalQuantitySold: 1
      }
    },
    // Sort in descending order of totalQuantitySold
    { $sort: { totalQuantitySold: -1 } },
    // Limit to the top 10 categories
    { $limit: 3 }
  ]);
    

    res.render("admin", {
      ordersByDay: JSON.stringify(ordersByDay),
      totalAmount :totalAmount,
      latest_Order: latest_Order,
      orderCount: orderCount,
      userCount: userCount,
      bestSeller: bestSeller,
      bestCategories:bestCategories,
      ordersCountPerDayOfWeek: JSON.stringify(orderCountOfDaily),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getLogin = (req, res, next) => {
  try {
    if (req.session.verify) {
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

const adminUser = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page);
    const limit = 10;

    const skipIndex = (page -1) * limit;

    const totalUser = await mus.countDocuments();
    const totalPages = Math.ceil(totalUser/limit);

    const Data = await mus.find({})
    .sort({createdAt:-1})
    .skip(skipIndex)
    .limit(limit);

    res.render("adminuser", { Data, totalPages, currentPage:page });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const listOrder = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameters or default to 1
    const limit = 10; // Number of documents per page

    const skipIndex = (page - 1) * limit;

    // Find total number of documents to calculate total pages for frontend pagination
    const totalOrders = await Order.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch orders for the current page
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .skip(skipIndex)
      .limit(limit);

    res.render("admin_Order", { orders, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const orderDetails = async (req, res, next) => {
  try {
    const orderId = req.params.MyOrder;
    const selected = req.body.dataToSend;



    const productOrder = await Order.find({ _id: orderId }).populate(
      "product.productId"
    );

    res.render("admin_order_detail", { productOrder });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    req.session.destroy();

    res.redirect("/admin/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const daily_Report = async (req, res, next) => {
  try {
    let { page, limit, start_date, end_date } = req.query;

    let query = {};

    if (start_date && end_date) {
      const startDate = (req.session.startDate = new Date(start_date));
      const endDate = (req.session.endDate = new Date(end_date));

      console.log(endDate, startDate);

      if (!isNaN(startDate.valueOf()) && !isNaN(endDate.valueOf())) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
      } else {
        throw new Error("Invalid date format");
      }
    }

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // If start_date and end_date are not provided, query all orders
    const order_Query =
      start_date && end_date ? Order.find(query) : Order.find();

    const order_Report = await order_Query
      .populate("product.productId")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(query);

    res.render("admin_daily_report", {
      order_Report,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    next("error");
  }
};

const chartData = async (req, res, next) => {
  let data;

  try {
    const currentDate = new Date();
    console.log(req.query);
    if (req.query.report_type === "daily") {
      console.log("if working");

      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); 

      data = await Order.aggregate([
        {
          $match: {
            date: { $gte: oneWeekAgo, $lt: currentDate }, // Filter orders for the past week
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$date" }, // Group by day of the week (Sunday: 1, Monday: 2, ..., Saturday: 7)
            count: { $sum: 1 }, // Count the orders for each day
          },
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
                  { case: { $eq: ["$_id", 7] }, then: "Saturday" },
                ],
              },
            },
            count: 1,
          },
        },
      ]);

      const orderCountOfDaily = {};
      data.forEach((data) => {

        const dateKey = data.day; // Extract date without time
        orderCountOfDaily[dateKey] = data.count; // Initialize count for the day
      });
      data = orderCountOfDaily
     

    } else if (req.query.report_type === "monthly") {
     
      const startOfMonth = new Date(currentDate.getFullYear(), 0, 1);

      // End of the current month
      const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
      );
      data = await Order.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth, // Define startOfMonth as the beginning of the current month
              $lt: endOfMonth, // Define endOfMonth as the beginning of the next month
            },
          },
        },
        {
          $group: {
            _id: { $month: "$date" }, // Group by month of the year
            count: { $sum: 1 }, 
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", 1] }, then: "January" },
                  { case: { $eq: ["$_id", 2] }, then: "February" },
                  { case: { $eq: ["$_id", 3] }, then: "March" },
                  { case: { $eq: ["$_id", 4] }, then: "April" },
                  { case: { $eq: ["$_id", 5] }, then: "May" },
                  { case: { $eq: ["$_id", 6] }, then: "June" },
                  { case: { $eq: ["$_id", 7] }, then: "July" },
                  { case: { $eq: ["$_id", 8] }, then: "August" },
                  { case: { $eq: ["$_id", 9] }, then: "September" },
                  { case: { $eq: ["$_id", 10] }, then: "October" },
                  { case: { $eq: ["$_id", 11] }, then: "November" },
                  { case: { $eq: ["$_id", 12] }, then: "December" },
                ],
              },
            },
            count: 1,
          },
        },
      ]);
      let data1 = {}
      data.map((item)=>{
        data1[item.month] = item.count
      })
      data = data1
    } else if (req.query.report_type === "yearly") {
      // Define the current year and the year before it
      const currentYear = new Date().getFullYear();
      const startOfPreviousYear = new Date(currentYear - 1, 0, 1); // Beginning of the previous year
      const endOfCurrentYear = new Date(currentYear, 11, 31); 

console.log(startOfPreviousYear,endOfCurrentYear);
      data = await Order.aggregate([
        {
          $match: {
            date: {
              $gte: startOfPreviousYear, // Beginning of two years ago
              $lt: endOfCurrentYear, // Beginning of last year
            },
          },
        },
        {
          $group: {
            _id: { $year: "$date" }, // Group by year
            count: { $sum: 1 }, // Count the orders for each year
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id", // Project the year
            count: 1,
          },
        },
      ]);

      console.log(data);
      let obj1 = {}
      data.map((item)=>{
        obj1[item.year]= item.count;
      })

      data = obj1

    }
  } catch (error) {
   
  } finally { 

    res.status(200).json({ data });

  }
};

//post
const postLogin = async (req, res, next) => {
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
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const block = async (req, res, next) => {
  const data = req.params.userId;

  console.log(data);

  try {
    const findData = await mus.findOne({ _id: data });

    findData.isblocked = !findData.isblocked;
    await findData.save();

    res.status(200).send("sucess");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
const orderStatus = async (req, res, next) => {
  try {
    const { orderId, currentStatus, newStatus } = req.body;

    console.log(orderId, currentStatus, newStatus);

    // Assuming you have a valid order model and schema
    const order = await Order.findOne({ oederId: orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if the current status matches the status in the database
    if (order.orderstatus !== currentStatus) {
      // Fixed case sensitivity: change "orderStatus" to "orderstatus"
      return res.status(400).json({ error: "Invalid current order status" });
    }

    // Update the order status
    order.orderstatus = newStatus; // Fixed case sensitivity: change "orderStatus" to "orderstatus"

    // Update the cancelOrder status based on the new order status
    if (
      [
        "canceled",
        "returned",
        "failed",
        "pending",
        "processing",
        "shipped",
        "delivered",
      ].includes(newStatus)
    ) {
      order.product.forEach((product) => {
        product.cancelOrder = newStatus;
      });
    }

    await order.save();

    return res
      .status(200)
      .json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    next(error);
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
  chartData,
};
