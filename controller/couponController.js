const mongoose = require("mongoose");
const coupon = require("../model/coupon");
const cart = require('../model/cart') 

// CREATE  COUPON
const getCoupon = (req, res, next) => {
  res.render("adminCoupon");
};



const couponList = async (req,res, next )=>{
    try{

        const couponData = await coupon.find({});

        res.render("adminCoupon_List",{couponData})
    }catch(error){
        console.error(error);
        next(error)
    }

}

const couponEdit = async(req,res,next)=>{

  try{

    const {
      code,
      discount,
      isPercent,
      startDate,
      endDate,
      usageLimit,
      isActive,
      min,
      max
    } = req.body;

    const id  = req.params.id;

    const result = await coupon.findOne({_id:id});

    res.render('admin_edit_Coupon',{result})
  }catch(error){
    console.error(error);
    next(error)
  }
}

const post_Coupon = async (req, res) => {

  const {
    code,
    discount,
    isPercent,
    startDate,
    endDate,
    usageLimit,
    isActive,
    min,
    max
  } = req.body;

  console.log(isActive);

  const createCoupon = await coupon.create({
    code: code,
    discount: parseInt(discount),
    isPercent: isPercent,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
    usageLimit: parseInt(usageLimit),
    isActive: isActive ,
    minAmount: parseFloat(min),
    maxAmount: parseFloat(max) || null
  });

  console.log(createCoupon);
  return res.redirect("/admin/coupon")

}

const post_EditCoupon = async(req,res,next)=>{
  const {
    code,
    discount,
    isPercent,
    startDate,
    endDate,
    usageLimit,
    isActive,
    min,
    max
  } = req.body;

  const id = req.params.id;

  const update  = await  coupon.updateOne({ _id: id },{
      $set:{
        code:code,
        discount:parseInt(discount),
        isPercent:isPercent==="true",
        startDate:new Date(startDate).toISOString(),
        endDate:new Date(endDate).toISOString(),
        usageLimit:parseInt(usageLimit)||0,
        isActive:isActive,
        minAmount:parseFloat(min),
        maxAmount: (max!==undefined)?parseFloat(max):null
      }
  })

  res.redirect('/admin')

}
const couponApply = async (req, res, next) => {
  try {
    const { couponCode } = req.body;
    const idData = req.userId;
    console.log(couponCode+'//////////////////////////////');

    const couponData = await coupon.findOne({ code: couponCode });
    console.log('KERI 1');

    if (!couponData || !couponData.isActive) {
      return res.status(400).json({ message: 'Coupon is not active' });
    }
    console.log('KERI 2');

    // Check if the coupon is expired
    const currentDate = new Date();
    if (currentDate < couponData.startDate || currentDate > couponData.endDate) {
      return res.status(400).json({ message: 'Coupon is expired' });
    }
    console.log('KERI 3');

    // Find the user's cart
    const findUserCart = await cart.findOne({ user: idData });
    let totalPrice = findUserCart.totalamount;



    // Check if the total amount is greater than 5000
    if (findUserCart.totalamount <= 1000) {
      return res.status(400).json({ message: 'Total amount must be greater than 5000 for the coupon to be applicable' });
    }
    console.log('KERI 4');

    // Check if the coupon has been used more than the allowed usage limit
    if (couponData.usageLimit <= 0) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Apply the coupon discount logic
    // Apply the coupon discount to the total amount
    let discountedTotalAmount = findUserCart.totalamount;
    console.log('KERI 5');

    // Calculate the discount amount based on whether it's a percentage or a fixed amount
    let discountAmount;
    if (couponData.isPercent) {
      discountAmount = (couponData.discount / 100) * discountedTotalAmount;
    } else {
      discountAmount = couponData.discount;
    }
    console.log('KERI 6');

    // Check if the discount amount exceeds the maximum allowed discount
    if (discountAmount > couponData.maxAmount) {
      discountAmount = couponData.maxAmount;
    }
    console.log('KERI 7');

    // Apply the discount to the total amount
    discountedTotalAmount -= discountAmount;

    // Update the total amount in the user's cart
    findUserCart.totalamount = discountedTotalAmount;
    await findUserCart.save();
    console.log('KERI 9');

    // Reduce the usage limit of the coupon by 1
    couponData.usageLimit -= 1;
    await couponData.save();

    let full = req.session.couponData = {
      couponBody :couponCode,
      findUserCart :totalPrice,
      discountedTotalAmount : Math.round(discountAmount,2),
    }  

    console.log(full);    
   

    res.status(200).json({ message: 'Coupon applied successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}


const couponRemove = async (req,res,next)=>{

  try{
    const sessionData = req.session.couponData;

    const couponCode = sessionData.couponBody;
    const idData = req.userId;
    console.log(couponCode);
    console.log('keri 1');
    const couponVerify = await coupon.findOne({code:couponCode});
    const updatePrice = await cart.findOne({user:idData});
    console.log('keri 2');
  
    console.log('keri 3');

    updatePrice.totalamount = sessionData.findUserCart ;
    console.log('keri 4');
    await updatePrice.save();
    req.session.couponData = null;
    console.log('keri 5');
    console.log('update cheyithuu ',updatePrice);

    console.log('keri 6');
    console.log('its ok njn vannu ',sessionData.findUserCart);

    res.status(200).json({message:'Coupon removed Successfully', data:updatePrice})
    

  }catch(error){
    console.error(error);
    next(error)
  }

}

const deleteCoupon = async (req, res, next) => {
  try {
      const couponId = req.params.couponId;

      // Find the coupon by ID
      const couponData = await coupon.findOne({ _id: couponId });

      // If the coupon is not found, return a 404 error
      if (!couponData) {
          return res.status(404).json({ error: 'Coupon not found' });
      }

      // Delete the coupon from the database
      await coupon.deleteOne({ _id: couponId });

      // Respond with a success message
      return res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
      // Handle any errors that occur during the deletion process
      console.error('Error deleting coupon:', error);
      return res.status(500).json({ error: 'An error occurred while deleting the coupon' });
  }
}

const list = async  (req,res,next)=>{

  const couponId = req.body

  const findCoupon = await coupon.findOne({_id : couponId.id});

  findCoupon.islist = !findCoupon.islist

  await  findCoupon.save()
  res.status(200).json(findCoupon)


}




module.exports = {
  getCoupon,
  post_Coupon,
  couponList,
  couponEdit,
  post_EditCoupon,
  couponApply,
  couponRemove,
  deleteCoupon,
  list
};
