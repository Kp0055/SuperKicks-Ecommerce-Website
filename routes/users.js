var express = require("express");
var router = express.Router();
const use = require("../controller/usercontroller");
const productController = require("../controller/productcontroller");
const wallet = require("../controller/walletcontroller");
const { verifyJwt } = require("../controller/JWT");
const coupon = require("../controller/couponController");

/* GET users listing. */
router.get("/", use.main);

router.get("/login", verifyJwt, use.getLogin);

router.get("/signup", verifyJwt, use.getRegister);

router.get("/otpverification", verifyJwt, use.userOtp);

router.get("/otpsucess", verifyJwt, use.getOtpSucess);

router.get("/ForgotPassword", verifyJwt, use.fpassword);

router.get("/products_list", productController.productList);

router.get("/product/:id", verifyJwt, productController.productDetails);

router.get("/reset_password/:id", use.reset);

router.get("/product_scandel", verifyJwt, use.productScandels);

router.get("/cart", verifyJwt, use.productCart);

router.get("/MyAccount", verifyJwt, use.account);

router.get("/Edit_address/:addressid", verifyJwt, use.editsAddress);

router.get("/logout", verifyJwt, use.postLogout);

router.get("/checkout", verifyJwt, use.checkout);

router.get("/custom-404-page", verifyJwt, use.error);

router.get("/orderplaced/:oid", verifyJwt, use.orderSucess);

router.get("/sort", verifyJwt, productController.sort);

router.get('/generate_invoice',verifyJwt,use.genrateInvoice)

//post

router.post("/login", use.postLogin);

router.post("/signup", use.postRegister);

router.post("/otpverification", use.userPostOtp);

router.post("/ForgotPassword", use.forgetPassword);

router.post("/reset_password/:id", use.postReset);

router.post("/MyAccount", verifyJwt, use.myAccount);

router.post("/profile_edit", verifyJwt, use.editProfile);

router.post("/product/:prodId", verifyJwt, use.cartProduct);

router.post("/Delete_product/:deleteid", verifyJwt, use.productDel);

router.post("/update-cart-quantity", verifyJwt, use.cartQty);

router.post("/checkout", verifyJwt, use.postCheckout);

router.post("/checkoutAddress", verifyJwt, use.checkoutAddress);

router.post("/Edit_address/:addressid", verifyJwt, use.postEditAddress);

router.post("/delete_address/:addressDelete", verifyJwt, use.addressDelete);

router.post("/cancelOrder/:Order/:Product", verifyJwt, use.orderCancel);

router.post("/cartSelect/:selectedProduct_Id", verifyJwt, use.selectProduct);

router.post("/verify_Payment", verifyJwt, use.verify);

router.post("/add_Wallet/:id", verifyJwt, wallet.walletAmount);

router.post("/withdrawel/:id", verifyJwt, wallet.withDrawal);

router.post("/apply_Coupon", verifyJwt, coupon.couponApply);

router.post("/remove_coupon", verifyJwt, coupon.couponRemove);

router.post("/sort", productController.sort);

router.post('/resendOtp',use.otpresend)
 


module.exports = router;
