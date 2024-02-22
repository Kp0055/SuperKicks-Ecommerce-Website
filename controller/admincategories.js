const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");

const adminCategoriesList = async (req, res, next) => {
  try {
    const perPage = 10; // Number of categories per page
    let page = parseInt(req.query.page) || 1; // Get the current page from query parameters
    page = Math.max(1, page); // Ensure page is at least 1

    // Fetch categories for the current page
    const categoriesData = await categories.find({})
      .skip(perPage * (page - 1))
      .limit(perPage);

    // Count total number of categories
    const totalCategories = await categories.countDocuments();

    res.render("admincategories_list", {
      categoriesData,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / perPage),
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


const addCategories = (req, res, next) => {
  try{
  const categoriemessage = req.session.categorieMessage;

  req.session.categorieMessage = null;

  res.render("adminaddcategories", { categoriemessage });
}catch(error){
  console.error(error);
  next(error)
}
};

const postCategories = async (req, res, next) => {
  const { name, Description, Discount } = req.body;

  try {
    const existingCategory = await categories.findOne({
      name: { $regex: new RegExp("^" + name + "$", "i") },
    });

    if (!existingCategory) {
      const image = req.file.filename;

      await categories.create({
        name: name,
        description: Description,
        discount: Discount,
        image: image,
      });

      res.redirect("/admin/categories_list");
    } else {
      req.session.categorieMessage = "Category already exists";
      return res.redirect("/admin/add_categories");
    }
  }catch(error){
    console.error(error);
    next(error)
  }
};

const categoryUnlist = async (req, res, next) => {
  const data = req.params.dataId;
  try {
    const finddata = await categories.findOne({ _id: data });
    finddata.isActive = !finddata.isActive;
    await finddata.save();
    if (finddata.isActive === false) {
      await product.updateMany(
        { parentCategory: data },
        { $set: { islist: false } }
      );
    }
  }catch(error){
    console.error(error);
    next(error)
  }
  res.status(200).send("sucess");
};

module.exports = {

    adminCategoriesList,
    addCategories,
    postCategories,
    categoryUnlist
    
};
