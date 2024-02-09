const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");

const adminProductList = async (req, res, next) => {
  try {
  const call = req.query._id;

  console.log(call);


    const productlist = await product.find({}).populate("parentCategory");
    res.render("adminproduct_list", { productlist });
}catch(error){
    console.error(error);
    next(error)
  }
};

const addProduct = async (req, res, next) => {
  try {
    const categoryData = await categories.find({});
    // console.log(categoryData);
    res.render("adminaddproduct", { categoryData });
}catch(error){
    console.error(error);
    next(error)
  }
};

const adminEditProduct = async (req, res, next) => {
  try {
  const dataid = req.params.id;


    const products = await product.findOne({ _id: dataid });
    const category = await categories.find();

    res.render("admin_edit_product", { product: products, category });
}catch(error){
    console.error(error);
    next(error)
  }
};

const postProduct = async (req, res, next) => {
  //  console.log(req.files);
  try {
  const {
    name,
    Description,
    parentCategory,
    Stock,
    Size,
    color,
    Discount,
    Price,
  } = req.body;
 
    const filePaths = req.files.map((file) => file.filename);
    // console.log(filePaths);

    let productdata = await product.create({
      name: name,
      parentCategory: parentCategory,
      Description: Description,
      stock: Stock,
      size: Size,
      color: color,
      discount: Discount,
      price: Price,
      image: filePaths,
    });
}catch(error){
    console.error(error);
    next(error)
  }

  res.redirect("/admin/product_list");
};

const editProduct = async (req, res, next) => {
  const dataidd = req.params.id;
  const { name, Description, parentCategory, Stock, color, Discount, Price } =
    req.body;

  try {
    const filePaths = req.files.map((file) => file.filename);

    const productlist = await product.findOne({ _id: dataidd });

    const editfiles = productlist.image.concat(filePaths).slice(0, 5);

    if (!productlist) {
      res.send("usernotfound");
    } else {
      const update = await product.updateMany(
        { _id: dataidd },
        {
          $set: {
            name: name,
            parentCategory: parentCategory,
            Description: Description,
            stock: Stock,
            color: color,
            discount: Discount,
            price: Price,
            image: editfiles,
          },
        }
      );
      res.redirect("/admin/product_list");
    }
}catch(error){
    console.error(error);
    next(error)
  }
};
const unList = async (req, res, next) => {
  const lol = req.params.id;

  try {
    const findproduct = await product.findOne({ _id: lol });
    findproduct.islist = !findproduct.islist;
    await findproduct.save();

    res.status(200).send("sucess");
}catch(error){
    console.error(error);
    next(error)
  }
};

const deleteItem = async (req, res, next) => {
  const data = req.params.deleteId;
  try {
    const delete_data = await product.deleteOne({ _id: data });
}catch(error){
    console.error(error);
    next(error)
  }
  res.status(200).send("success");
};

const deleteImage = async (req, res, next) => {
  const index = req.query.index;

  const productimageid = req.params.productId;

  console.log(index, productimageid);

  try {
    const product_edit = await product.findOne({ _id: productimageid });
    product_edit.image.splice(index, 1);
    await product_edit.save();

    res.status(200).send("sucess");
}catch(error){
    console.error(error);
    next(error)
  }
};

const status = async (req, res, next) => {
  const Order_ID = req.params.ProductId;
  const product_ID = req.params.OrderId;
  const updateStatus = req.body.status;

  try {
      let result;

      result = await Order.findOne({ _id: Order_ID });

      if (updateStatus === 'canceled') {
          result.orderstatus = updateStatus;
          result.product.forEach((product) => {
              if (product.productId.toString() === product_ID) {
                  product.cancelOrder = updateStatus;
              }
          });
      } else {
          result.orderstatus = updateStatus;
      }
      await result.save();

      // Send a JSON response with success message
      res.status(200).json({ message: 'Status updated successfully' });

      console.log('//////////////////////updated status /////////////');
      console.log(result);
  } catch (error) {
      console.error(error);
      next(error);
  }
};





module.exports = {
  adminProductList,
  addProduct,
  adminEditProduct,
  postProduct,
  editProduct,
  unList,
  deleteItem,
  deleteImage,
  status,
};

