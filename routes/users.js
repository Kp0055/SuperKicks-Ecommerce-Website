var express = require('express');
var router = express.Router();
const use =require('../controller/usercontroller')
const verifyToken = require('../middileware/authentication')
const blocked = require('../middileware/block_middleware')
const productController = require('../controller/productcontroller')


/* GET users listing. */
router.get('/',verifyToken,blocked,use.main)

router.get('/login',use.getLogin)

router.get('/signup',use.getRegister)

router.get('/otpverification',use.userOtp)

router.get('/otpsucess',use.getOtpSucess)

router.get('/ForgotPassword',use.fpassword)

router.get('/products_list',verifyToken,blocked,productController.productList)

router.get('/product/:id',verifyToken,blocked,productController.productDetails)

router.get('/reset_password/:id',use.reset)

router.get('/product_scandel',verifyToken,blocked,use.productScandels)

router.get('/cart',verifyToken,blocked,use.productCart)

router.get('/MyAccount',verifyToken,blocked,use.account);

router.get('/Edit_address/:addressid',verifyToken,blocked,use.editsAddress)

router.get('/logout',verifyToken,blocked,use.postLogout)

router.get ('/checkout',verifyToken,blocked,use.checkout)

router.get ('/custom-404-page',verifyToken,blocked,use.error)

router.get ('/orderplaced/:oid',verifyToken,blocked,use.orderSucess)









//post 

router.post('/login',use.postLogin)

router.post('/signup',use.postRegister)

router.post('/otpverification',use.userPostOtp)

router.post('/ForgotPassword',use.forgetPassword)

router.post('/reset_password/:id',use.postReset)

router.post ('/MyAccount',verifyToken,blocked,use.myAccount)

router.post ('/profile_edit',verifyToken,blocked,use.editProfile)

router.post ('/product/:prodId',verifyToken,blocked,use.cartProduct)

router.post ('/Delete_product/:deleteid',verifyToken,blocked,use.productDel)

router.post ('/update-cart-quantity',verifyToken,blocked,use.cartQty)

router.post ('/checkout',verifyToken,blocked,use.postCheckout)

router.post ('/Edit_address/:addressid',verifyToken,blocked,use.postEditAddress)

router.post ('/delete_address/:addressDelete',verifyToken,blocked,use.addressDelete)

router.post ('/cancelOrder/:Order/:Product',verifyToken,blocked,use.orderCancel)

router.post('/cartSelect/:selectedProduct_Id',verifyToken,blocked,use.selectProduct)

router.post ('/verify_Payment',verifyToken,blocked,use.verify)  













module.exports = router;
