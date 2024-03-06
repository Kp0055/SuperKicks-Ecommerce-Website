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
const Razorpay = require("razorpay");
const wallet = require("../model/wallet");
const ProductModel = require("../model/add_product");
const banner = require("../model/banner");
const coupon = require("../model/coupon");
const PDFDocument = require("pdfkit-table");

//function to generate otp

function generatorOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//get

const main = async (req, res, next) => {
  try {
    const categories = await category.find({ isActive: true });

    const banner_Display = await banner.find({});

    res.render("index", { category: categories, banner_Display });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getLogin = (req, res, next) => {
  try {
    const notfound = req.session.notfound;
    const userblocked = req.session.blocked;
    const passwordmessage = req.session.passwordmsg;
    const errMessage = req.session.err ? req.session.err : "";
    req.session.err = "";
    req.session.notfound = null;
    req.session.blocked = null;
    req.session.passwordmsg = null;

    res.render("login", { notfound, userblocked, passwordmessage, errMessage });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getRegister = (req, res, next) => {
  try {
    const userexists = req.session.alreadyuse;
    const userpassword = req.session.userpassword;
    req.session.alreadyuse = null;
    req.session.passwormsg = null;

    res.render("register", { userexists, userpassword });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const userOtp = (req, res, next) => {
  try {
    res.render("otp");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getOtpSucess = (req, res, next) => {
  try {
    res.send("otp sucessfull");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const fpassword = async (req, res, next) => {
  try {
    const mail = req.session.message;
    const resetmsg = req.session.reset;

    req.session.message = null;
    req.session.reset = null;

    res.render("forgotpassword", { mail, resetmsg });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const reset = async (req, res, next) => {
  const usertoken = req.params.id;

  try {
    const tokendata = await mus.findOne({ resetpasswordtoken: usertoken });

    if (!tokendata) {
      let errormsg = res.session.invalid;
      res.session.invalid = "invalid";
    } else {
      res.render("reset_password", { usertoken, errormsg });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const productScandels = async (req, res, next) => {
  try {
    res.render("productsliders");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const productCart = async (req, res, next) => {
  try {
    const categories = await category.find({ isActive: true });
    const userId = req.userId;

    const fullData = await cart
      .findOne({ user: userId })
      .populate("product.product");

    res.render("pcart", { fullData, category: categories });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const account = async (req, res, next) => {
  try {
    const categories = await category.find({ isActive: true });

    const ids = req.userId;

    const profileAddresses = await Myaddress.find({ parentuser: ids });
    const profileData = await mus.findOne({ _id: ids });
    const walletAmount = await wallet.findOne({ userId: ids });
    const Myorders = await Order.find({ userId: ids })
      .populate("product.productId")
      .sort({ createdAt: -1 });

    res.render("dashboard", {
      category: categories,
      profileAddresses,
      profileData,
      Myorders,
      walletAmount,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const editsAddress = async (req, res, next) => {
  const addressId = req.params.addressid;

  try {
    const profile_details = req.userId;

    const editts_Address = await Myaddress.findOne({
      parentuser: profile_details,
    });

    let addressDetails = editts_Address.address.filter(
      (address) => address._id.toString() === addressId
    );

    res.render("add_address", { editaddress: addressDetails[0] });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const checkout = async (req, res, next) => {
  const pro = req.userId;

  try {
    const couponData = await coupon.find({ islist: true });

    const userAddress = await Myaddress.findOne({ parentuser: pro }).populate(
      "address"
    );
    console.log(userAddress);

    const productorder = await cart
      .findOne({ user: pro })
      .populate("product.product");

    const selectedProducts = productorder.product.filter(
      (xx) => xx.isSelected === true
    );


    //corrected total price 

    // let totalAmount = 0;

    //   selectedProducts.forEach((selectedProduct) => {
    //   const price = selectedProduct.product.price;
    //   const quantity = selectedProduct.quantity;
    //   totalAmount += price * quantity;
    //   });

    //   req.session.orginalAmountCheckout = totalAmount;



    if (selectedProducts.length === 0) {
      return res.redirect("/cart");
    }

    let couponDetails = null;
    if (req.session && req.session.couponData) {
      couponDetails = req.session.couponData;
    }

    res.render("checkout", {
      userAddress,
      productorder,
      couponData,
      couponDetails,
      productorderprice: { product: selectedProducts },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const error = (req, res, next) => {
  try {
    res.render("404");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const orderSucess = async (req, res, next) => {
  try {
    const loooo = req.params.oid;

    console.log("//////////////////////////orde coming ///////");

    const categories = await category.find({ isActive: true });
    const orderDetails = await Order.findOne({ _id: loooo }).populate(
      "product.productId"
    );

    console.log("////////////////////////sucesss///psage////////");
    console.log(orderDetails);

    res.render("order_sucess", { category: categories, orderDetails });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//post

const postLogin = async (req, res, next) => {
  // console.log('res',req.body);
  try {
    const { lemail, lpassword } = req.body;

    console.log(lpassword);

    const userEmailFound = await mus.findOne({ email: lemail });

    if (userEmailFound) {
      if (userEmailFound.isblocked === false) {
        if (userEmailFound.verified == true) {
          const hpassword = await bcrypt.compare(
            lpassword,
            userEmailFound.password
          );

          if (hpassword) {
            const token = jwt.sign(
              { userId: userEmailFound._id },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "24hr",
              }
            );

            res.setHeader(
              "Set-Cookie",
              cookie.serialize("token", token, {
                httpOnly: true,
                maxAge: 3600,
                sameSite: "strict",
              })
            );

            return res.redirect("/");
          } else {
            req.session.passwordmsg = " password is wrong ";
            return res.redirect("/login");
          }
        } else {
          res.status(404);
        }
      }
      req.session.blocked = "User is blocked ";
      return res.redirect("/login");
    }
    req.session.notfound = "Email not Found";
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const postRegister = async (req, res, next) => {
  const {
    sfirstname,
    slastname,
    semail,
    spassword,
    sphonenumber,
    sconfirm_password,
  } = req.body;
  console.log({
    sfirstname,
    slastname,
    semail,
    spassword,
    sphonenumber,
    sconfirm_password,
  });

  // Check if any of the required fields are empty
  if (
    !sfirstname ||
    !slastname ||
    !semail ||
    !spassword ||
    !sphonenumber ||
    !sconfirm_password
  ) {
    req.session.errorMessage = "Please fill all the fields";
    return res.redirect("/signup");
  }

  const hashedPassword = await bcrypt.hash(spassword, 10);

  if (spassword.length < 10 || spassword !== sconfirm_password) {
    req.session.userpassword =
      "Password must be at least 10 characters long and match the confirmation.";
    return res.redirect("/signup");
  }

  console.log("njn vannu password ");

  try {
    const existingUser = await mus.findOne({
      $or: [{ username: sfirstname }, { email: semail }],
    });

    if (existingUser) {
      req.session.alreadyuse = "User already has an account.";
      return res.redirect("/signup"); // Redirect to the signup page or handle the response accordingly
    }

    let userdata = await mus.create({
      firstname: sfirstname,
      lastname: slastname,
      email: semail,
      phonenumber: sphonenumber,
      password: hashedPassword,
    });

    req.session.maindata = userdata;

    console.log("njn vannu email pova");

    async function sendOTPEmail(otp) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.session.maindata.email,
        subject: "This is your OTP",
        text: `Your OTP is ${otp}`,
      };

      req.session.verify = otp;
      console.log(otp);
      console.log("njn vannu email ayachu");

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);

        // Create user's address and cart
        await createAddress(req.session.maindata._id);
        await createCart(req.session.maindata._id);
        await createWallet(req.session.maindata._id);

        res.redirect("/otpverification");
      } catch (error) {
        console.error("Error sending mail", error);
      }
    }

    const otp = generatorOTP();
    sendOTPEmail(otp);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const otpresend = async (req, res) => {
  try {
    const newOtp = generatorOTP();

    await sendOTPEmail(newOtp);

    // Update the stored OTP in the session
    req.session.verify = newOtp;

    console.log("ResendOtp", newOtp);

    res.redirect("/otpverification");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const userPostOtp = async (req, res, next) => {
  console.log("otp verfiaction ....................");
  const storedOtp = req.session.verify;
  const Enteredotp = req.body.otp;
  console.log(storedOtp, Enteredotp);
  try {
    if (storedOtp === Number(Enteredotp)) {
      const update = await mus.updateOne(
        { email: req.session.maindata.email },
        { $set: { verified: true } }
      );

      res.status(200).json({ success: true });
    } else {
      res.send(error);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createAddress = async (userId) => {
  try {
    // Create the address for the user using the userId
    // Example:
    await Myaddress.create({ parentuser: userId, address: [] });
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

// Function to create user's cart
const createCart = async (userId) => {
  try {
    // Create the cart for the user using the userId
    // Example:
    await cart.create({ user: userId, products: [], totalamount: 0 });
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};
const createWallet = async (userId) => {
  try {
    // Create the wallet for the user using the userId
    // Example:
    await wallet.create({ userId: userId, transactions: [], balance: 0 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const foundemail = await mus.findOne({ email });

    if (foundemail) {
      const generate = crypto.randomBytes(20).toString("hex");
      const timer = Date.now() + 60 * 60 * 1000;

      const data = await mus.updateOne(
        { email: foundemail.email },
        {
          $set: {
            resetpasswordtoken: generate,
            resetpasswordexpire: timer, // for one hour
          },
        }
      );

      async function sendOTPEmail(otp) {
        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const link = `http://localhost:5000/reset_password/${generate}`;

        console.log(link);

        //EMAIL CONTENT
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: foundemail.email,
          subject: "This is your Otp",
          text: ` Your  reset password link is ${link}`,
        };
        // send mail
        try {
          const info = await transporter.sendMail(mailOptions);
          //    console.log('Email sent:', info.response);

          //    console.log("otp ", req.session.verify,otp);
          req.session.message = "Link sent to Your email";
          res.redirect("/ForgotPassword");
        } catch (error) {
          console.error("error sending mail", error);
        }
      }
      const otp = generatorOTP();

      sendOTPEmail(otp);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const postReset = async (req, res, next) => {
  const data = req.params.id;
  const { new_password, confirm_password } = req.body;

  try {
    const tokendata = await mus.findOne({ resetpasswordtoken: data });

    if (new_password === confirm_password) {
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await mus.updateOne(
        { resetpasswordtoken: data },
        { $set: { password: hashedPassword } }
      );
      res.redirect("/login");
    } else {
      console.log(" password is incorrect ");
      req.session.reset = " password is incorrect  please enter email ";
      return res.redirect("/ForgotPassword");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const postLogout = (req, res, next) => {
  try {
    res.clearCookie("token");

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const myAccount = async (req, res, next) => {
  const {
    name,
    phone,
    pin,
    locality,
    address,
    city,
    state,
    landmark,
    altphone,
  } = req.body;

  try {
    const newAddressData = {
      name: name,
      phoneNumber: phone,
      pincode: pin,
      locality: locality,
      address: address,
      city: city,
      state: state,
      landmark: landmark,
      alternativePhoneNumber: altphone,
    };

    // Assuming req.userId is available and represents the parent user ID
    const parentUserId = req.userId;

    // Find the document based on the parent user ID
    let userAddressDocument = await Myaddress.findOne({
      parentuser: parentUserId,
    });

    // If the document exists, push the new address data to the 'address' array
    if (userAddressDocument) {
      userAddressDocument.address.push(newAddressData);

      // Save the updated document
      await userAddressDocument.save();

      console.log("Address added to the document successfully");
    } else {
      // If the document doesn't exist, create a new address document for the user
      userAddressDocument = new Myaddress({
        parentuser: parentUserId,
        address: [newAddressData],
      });

      // Save the new document
      await userAddressDocument.save();

      console.log(
        "New address document created and address added successfully"
      );
    }
    res.redirect("/MyAccount");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const editProfile = async (req, res, next) => {
  const { fname, lname, pemail, phonenumber } = req.body;

  const indooo = req.userId;

  try {
    const update_profile = await mus.updateOne(
      { _id: indooo },

      {
        $set: {
          firstname: fname,
          lastname: lname,
          email: pemail,
          phonenumber: phonenumber,
        },
      }
    );

    res.redirect("/MyAccount");
    // if(!update_profile){return res.status(401).json({msg:"Update failed!"})}
    // return res.status(200).json({msg:`Profile has been Updated Successfully!`});
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const cartProduct = async (req, res, next) => {
  try {
    const productid = req.params.prodId;

    if (!productid) {
      return res.status(400).json("Product ID is missing!");
    }

    const userId = req.userId;

    let userCart = await cart.findOne({ user: userId });

    if (!userCart) {
      userCart = await cart.create({
        user: userId,
        product: [
          {
            product: productid,
            quantity: 1,
            isSelected: false,
          },
        ],
        totalamount: 0,
      });
    } else {
      const existingProduct = userCart.product.find(
        (item) => item.product.toString() === productid
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        userCart.product.push({
          product: productid,
          quantity: 1,
          isSelected: false,
        });
      }

      // userCart.totalamount =
      let total = 0;

      for (let productsData of userCart.product) {
        const productDetail = await product.findOne({
          _id: productsData.product,
        });

        total += productDetail.price * productsData.quantity;
      }

      userCart.totalamount = total;

      await userCart.save();
    }

    res.status(200).send("Success");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const productDel = async (req, res, next) => {
  const productIds = req.params.deleteid;

  try {
    // Find the cart document that contains the product to be deleted
    const userCart = await cart.findOne({ user: req.userId });

    // Use filter with a correct return statement
    userCart.product = userCart.product.filter((item) => {
      // Return true to keep the item, false to remove it
      return item.product.toString() !== productIds;
    });

    let total = 0;

    for (let productsData of userCart.product) {
      const productDetail = await product.findOne({
        _id: productsData.product,
      });

      total += productDetail.price * productsData.quantity;
    }

    userCart.totalamount = total;

    await userCart.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const cartQty = async (req, res, next) => {
  const { productId, quantity } = req.body;

  try {
    const productDetail = await product.findOne({ _id: productId });

    // Check if the requested quantity exceeds the available stock
    if (quantity > productDetail.stock) {
      return res.status(400).json({ success: false, message: "Out of stock" });
    }

    const updatedCart = await cart.updateOne(
      { user: req.userId, "product.product": productId },
      { $set: { "product.$.quantity": quantity } },
      { w: "majority" }
    );
    // Recalculate and update the totalamount for the entire cart
    const userCart = await cart.findOne({ user: req.userId });
  

    let total = 0;

    for (let productsData of userCart.product) {
      const productDetail = await product.findOne({
        _id: productsData.product,
      });


      const result =  productDetail.price * productsData.quantity
      total += result;
    
    userCart.totalamount = total;
  }

    await userCart.save();
    res.status(200).json({ sucess: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createNewOrder = async (
  paymentMethod,
  selectedProducts,
  profile_details,
  OrderAddress,
  totalAmountSelected,
  discountTotal,
  res
) => {
  try {
    console.log(
      paymentMethod,
      selectedProducts,
      profile_details,
      OrderAddress,
      totalAmountSelected,
      discountTotal
    );

    const newOrder = {
      userId: profile_details,
      totalamount: totalAmountSelected,
      PaymentMethod: paymentMethod,
      discountPrice: discountTotal,
      product: [],
      address: {
        name: OrderAddress.name,
        phoneNumber: OrderAddress.phoneNumber,
        pincode: OrderAddress.pincode,
        locality: OrderAddress.locality,
        address: OrderAddress.address,
        city: OrderAddress.city,
        state: OrderAddress.state,
        landmark: OrderAddress.landmark,
        alternativePhoneNumber: OrderAddress.alternativePhoneNumber,
      },
    };

    for (const item of selectedProducts) {
      newOrder.product.push({
        productId: item.product._id,
        quantity: item.quantity,
        saleprice: item.product.price,
        total: item.product.price * item.quantity,
        cancelOrder: "pending",
        reason: "",
      });
    }

    let savedOrder;

    if (paymentMethod === "razorpay") {
      // If payment method is razorpay, store data to session
      req.session.orderCreated = newOrder;
    } else {
      // Otherwise, save the new order to MongoDB
      savedOrder = await Order.insertMany([newOrder]);
    }

    for (const item of selectedProducts) {
      let stock = item.product.stock - item.quantity;
      if (stock < 0) {
        return res.status(401).json({
          error: `The product is out of stock.`,
        });
      } else {
        const updatedProduct = await item.product.updateOne({
          $set: {
            stock: stock,
          },
        });
      }
    }

    if (savedOrder) {
      const order = savedOrder[0];
      console.log("_____________________");
      console.log(order);
      console.log("_____________________");
      return order;
    } else {
      console.log("Order stored in session successfully.");
    }

    console.log("_____________________");
    console.log(Order);
    console.log("_____________________");

    return Order;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be handled outside the function
  }
};

const checkoutAddress = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      pin,
      city,
      state,
      locality,
      address,
      landmark,
      alternative,
    } = req.body;

    const newAddressData = {
      name: name,
      phoneNumber: phone,
      pincode: pin,
      locality: locality,
      address: address,
      city: city,
      state: state,
      landmark: landmark,
      alternativePhoneNumber: alternative,
    };

    const userId = req.userId;

    const findUser = await Myaddress.findOne({ parentuser: userId });
    findUser.address.push(newAddressData);

    await findUser.save();

    res.redirect("/checkout");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const postCheckout = async (req, res, next) => {
  try {
    const address_stored = req.body.addressId;
    const payment_stored = req.body.payment;
    const profile_details = req.userId;

    console.log(payment_stored);

    const profile = await Myaddress.findOne({ parentuser: profile_details });
    const cartproducts = await cart
      .findOne({ user: profile_details })
      .populate("product.product");

    const selectedProducts = cartproducts.product.filter(
      (xx) => xx.isSelected === true
    );

    if (selectedProducts.length === 0) {
      return res
        .status(400)
        .json({ error: "No products selected for checkout" });
    }

    const addressdetail = profile.address.filter(
      (add) => add._id.toString() === address_stored
    );
    const OrderAddress = addressdetail[0];

    const totalAmountSelected = selectedProducts.reduce((total, item) => {
      return total + item.quantity * item.product.price;
    }, 0);

    let finalAmount = totalAmountSelected;    
    let discountTotal = 0;

    if (req.session && req.session.couponData) {
      console.log(req.session.couponData);
      finalAmount = finalAmount - req.session.couponData.discountedTotalAmount;
      discountTotal = req.session.couponData.discountedTotalAmount;
    }

    console.log(
      finalAmount,
      discountTotal + "///////////////////////////////////"
    );

    console.log("checkoutpost final ", finalAmount);

    let result;

    if (payment_stored === "WALLET") {
      // check the wallet balance first
      const Userwallet = await wallet.findOne({ userId: profile_details });
      if (Userwallet.balance < totalAmountSelected) {
        throw new Error("Insufficient Balance!");
      } else {
        result = await createNewOrder(
          "WALLET",
          selectedProducts,
          profile_details,
          OrderAddress,
          finalAmount,
          discountTotal,
          res
        );
        if (result) {
          result.paymentStatus = "success";
          Userwallet.balance -= finalAmount;

          // Remove ordered products from the user's cart
          const updatedCart = await cart.findOneAndUpdate(
            { user: profile_details },
            {
              $pull: { product: { isSelected: true } },
              $unset: { totalamount: "" },
            },
            { new: true }
          );

          // Add transaction details
          const transaction = {
            type: "purchase",
            status: "completed",
            amount: finalAmount,
            timestamp: Date.now(),
          };
          Userwallet.transactions.push(transaction);

          await result.save();
          await Userwallet.save();
        }
      }
      return res.status(200).json(result._id);
    } else if (payment_stored === "COD") {
      result = await createNewOrder(
        "COD",
        selectedProducts,
        profile_details,
        OrderAddress,
        finalAmount,
        res
      );
      if (result) {
        result.paymentStatus = "success";
        await result.save();
      }
      // Remove ordered products from the user's cart
      const updatedCart = await cart.findOneAndUpdate(
        { user: profile_details },
        {
          $pull: { product: { isSelected: true } },
          $unset: { totalamount: "" },
        },
        { new: true }
      );
      console.log(
        "///////////////////////////////////COD CREATED  ////////////////////////////////"
      );
      console.log(result.orderId);
      return res.status(200).json(result._id);
    } else if (payment_stored === "PAYPAL") {
      result = await createNewOrder(
        "Razor Pay",
        selectedProducts,
        profile_details,
        OrderAddress,
        finalAmount,
        discountTotal,
        res
      );
      console.log(
        "///////////////////////////////////PAYPALCREATED ////////////////////////////////"
      );
      console.log(result);

      const options = {
        amount: finalAmount * 100,
        currency: "INR",
      };

      try {
        const order = await razorpayInstance.orders.create(options);
        const order_Details = await Order.findOne({
          orderId: result.orderId,
        }).populate("product.productId");

        console.log("/////////////////////updTED IS////////////////");

        console.log(order_Details);

        order_Details.orderId = order.id;
        order_Details.orderstatus = "failed";
        order_Details.paymentStatus = "failed";

        await order_Details.save();

        return res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
      } catch (error) {
        console.error(error);
        next(error);
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { payment_OrderId, payment_Signature, payment_Id } = req.body;
    // Construct the message to be signed
    const body = `${payment_OrderId}|${payment_Id}`;

    const orderId = payment_OrderId;

    console.log(
      "///////////////////////// Verify the data ///////////////////////"
    );
    console.log("Message to be signed:", body);

    // Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("///////////////////////// Signature ///////////////////////");
    console.log("Generated Signature:", generatedSignature);

    // Verify the signature
    if (generatedSignature === payment_Signature) {
      console.log(
        "///////////////////////// new  Signature ///////////////////////"
      );
      console.log(payment_Signature, generatedSignature);
      try {
        // Find the order based on orderId
        const orderDataId = await Order.findOne({ orderId: payment_OrderId });

        console.log(payment_OrderId, "////////////////////////lir");

        console.log(
          orderDataId,
          "//////////////////////////////// its working"
        );

        // If order exists
        if (orderDataId) {
          console.log(" njn vannu order sucess ayi 1 ");
          try {
            // Update payment status to "success"
            await Order.updateOne(
              { orderId: payment_OrderId },
              { $set: { paymentStatus: "success", orderstatus: "pending" } }
            );
            

            console.log(
              "Payment verification successful. Payment is successful."
            );

            // Retrieve the order details
            const newOrder = await Order.findOne({ orderId: payment_OrderId });

            // Store the order in session
            req.session.orderCreated = newOrder;

            // Send response with status 200 and the order ID
            res.status(200).json(newOrder._id);

            const profile_details = req.userId;

            const updatedCart = await cart.findOneAndUpdate(
              { user: profile_details },
              {
                $pull: { product: { isSelected: true } },
                $unset: { totalamount: "" },
              },
              { new: true }
            );
            console.log("Order ID:", newOrder._id);
          } catch (error) {
            console.error("Error updating payment status:", error);
            res.status(500).send("Internal Server Error");
          }
        } else {
          console.log(" njn vannu order sucess ayi 2 ");
          try {
            // Update payment status to "failed" if the order retrieval fails
            await Order.updateOne(
              { orderId: payment_OrderId },
              { $set: { orderstatus: "failed" } }
            );
            console.log(" njn vannu order sucess ayi 3");
            console.log("Order not found for the provided orderId.");
            res.status(404).send("Order not found");
          } catch (error) {
            console.error("Error updating payment status:", error);
            res.status(500).send("Internal Server Error");
          }
        }
      } catch (error) {
        console.error("Error occurred during payment verification:", error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      console.log(
        "Signature verification failed. Payload may have been tampered with."
      );
      res.status(400).send("Signature verification failed");
    }
  } catch (error) {
    console.error("Error occurred:", error);
    next(error);
  }
};

module.exports = verify;

const postEditAddress = async (req, res, next) => {
  const editaddressId = req.params.addressid;
  const profile_Id = req.userId;
  const {
    name,
    phone,
    pin,
    city,
    state,
    locality,
    address,
    landmark,
    altphone,
  } = req.body;

  try {
    // Find the document containing the addresses
    const Edit_Data = await Myaddress.findOne({ parentuser: profile_Id });

    if (!Edit_Data) {
      return res.status(404).send("Address not found");
    }

    // Find the address within the array
    const addressData = Edit_Data.address.find(
      (addr) => addr._id.toString() === editaddressId
    );

    if (!addressData) {
      return res.status(404).send("Address not found");
    }

    // Update the address properties
    addressData.name = name || addressData.name;
    addressData.phoneNumber = phone || addressData.phoneNumber;
    addressData.pincode = pin || addressData.pincode;
    addressData.locality = locality || addressData.locality;
    addressData.address = address || addressData.address;
    addressData.city = city || addressData.city;
    addressData.state = state || addressData.state;
    addressData.landmark = landmark || addressData.landmark;
    addressData.alternativePhoneNumber =
      altphone || addressData.alternativePhoneNumber;

    // Save the changes
    await Edit_Data.save();

    res.redirect("/checkout");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const addressDelete = async (req, res, next) => {
  const profileId = req.userId;

  const DeleteAddress = req.params.addressDelete;

  try {
    const FullAddress = await Myaddress.findOne({ parentuser: profileId });

    FullAddress.address = FullAddress.address.filter(
      (addr) => addr._id.toString() !== DeleteAddress
    );

    await FullAddress.save();

    res.status(200).send("sucess");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const orderCancel = async (req, res, next) => {
  try {
    const MyOrderId = req.params.Order;
    const OrderProduct = req.params.Product;
    const ProfileReason = req.body.reason;

    const myOrderData = await Order.findOne({ _id: MyOrderId });
    const index = myOrderData.product.find(
      (xx) => xx.productId.toString() === OrderProduct
    );
    const productData = await ProductModel.findOne({ _id: OrderProduct });
    const walletData = await wallet.findOne({ userId: req.userId });

    // Check if order, product, and wallet data are valid
    if (!myOrderData || !productData || !walletData) {
      return res.status(404).send("Data not found");
    }

    // Update user cancelOrder status
    index.cancelOrder = "canceled";
    index.reason = ProfileReason;
    productData.stock += index.quantity;

    // Calculate refund amount
    const refundAmount = index.quantity * productData.price;

    // Update wallet balance and add transaction record for refund
    walletData.balance += refundAmount;
    walletData.transactions.push({
      type: "refund",
      status: "completed",
      amount: refundAmount,
      timestamp: new Date(),
    });

    // Save changes
    await productData.save();
    await walletData.save();

    // Update order status to cancelled
    myOrderData.orderstatus = "canceled";
    await myOrderData.save();

    res.status(200).send("success");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const selectProduct = async (req, res, next) => {
  try {

    console.log('hrlooo');
    console.log(req.body.isChecked+'//////////////');
    const productSelected = req.params.selectedProduct_Id;
    const profileId = req.userId;

    const profileFound = await cart.findOne({ user: profileId }).populate('product.product');
    console.log(profileFound);
    let cartSelected = profileFound.product.find(
      (xx) => xx.product._id.toString() === productSelected
    );
    console.log(cartSelected);

   

    // Update isSelected based on isChecked sent from frontend
    cartSelected.isSelected = req.body.isChecked;
    
      let totalAmount=0
    for(let item of profileFound.product){
      if(item.isSelected){
      totalAmount+=(item.quantity * item.product.price);
      }
    }
    console.log(totalAmount);

  
    profileFound.totalamount=totalAmount;
    await profileFound.save();

    res.status(200).send("success");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const genrateInvoice = async (req, res) => {
  try {
    const orderId = req.query.orderId;

    console.log(orderId); // Extract orderId from query parameters

    // Find the order by its ID and populate the product details
    const order = await Order.findOne({ _id: orderId })
      .populate("product.productId")
      .sort({ date: 1 });

    if (!order) {
      throw new Error("Order not found");
    }

    // Initialize PDF generation
    const doc = new PDFDocument();
    const filename = `invoice_${order.orderId}.pdf`;

    // Set response headers for PDF file download
    res.setHeader(
      "Content-disposition",
      'attachment; filename="' + filename + '"'
    );
    res.setHeader("Content-type", "application/pdf");

    // Populate PDF with invoice details
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown(2);

    doc.text(`Order ID: ${order.orderId}`);

    doc.moveDown(1);

    // Populate the product details in a table
    const table = {
      headers: ["Product Name", "Price", "Quantity", "Total"],
      rows: [],
    };

    order.product.forEach((product) => {
      table.rows.push([
        product.productId.name,
        `$${product.saleprice}`,
        product.quantity.toString(),
        `$${product.total}`,
      ]);
    });

    doc.moveDown(1);
    doc.table(table, {
      width: 500,
      headerLines: 1,
      align: "center",
    });

    // Pipe the generated PDF data to the response stream
    doc.pipe(res);
    doc.end(); // End PDF generation
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).send("Error generating invoice");
  }
};

// Example usage: Pass the orderId to generate the invoice

module.exports = {
  main,
  getLogin,
  getRegister,
  postLogin,
  postRegister,
  userOtp,
  userPostOtp,
  getOtpSucess,
  fpassword,
  forgetPassword,
  reset,
  postReset,
  productScandels,
  productCart,
  account,
  myAccount,
  postLogout,
  editProfile,
  cartProduct,
  productDel,
  cartQty,
  checkout,
  editsAddress,
  postCheckout,
  error,
  orderSucess,
  postEditAddress,
  addressDelete,
  orderCancel,
  selectProduct,
  verify,
  checkoutAddress,
  genrateInvoice,
  otpresend,
};
