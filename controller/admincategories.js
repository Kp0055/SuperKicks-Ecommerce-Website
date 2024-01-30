const mongoose = require("mongoose");
const adminmongo = require("../model/adminschema");
const mus = require("../model/userschema");
const categories = require("../model/add_categories");
const product = require("../model/add_product");
const Order = require("../model/order");

const adminCategoriesList = async (req, res, next) => {
  try{
  const categorieData = await categories.find({});
  res.render("admincategories_list", { categorieData });
}catch(error){
  console.error(error);
  next(error)
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
