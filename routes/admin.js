var express = require('express');
var router = express.Router();
const use = require('../controller/admincontroller')
const upload = require('../middileware/categorymulter')
const admin_Verified = require('../middileware/adminverify')
const cat = require('../controller/admincategories')
const product_Control = require('../controller/adminproduct')
const pdf = require('../controller/createPdf');
const banner = require('../controller/banner')
const banner_upload = require('../middileware/bannermulter')
const coupon = require('../controller/couponController')
   

router.get('/',admin_Verified,use.adminHome)

router.get('/login',use.getLogin)

router.get('/listuser',admin_Verified,use.adminUser)

router.get('/product_list',admin_Verified,product_Control.adminProductList)

router.get('/categories_list',admin_Verified,cat.adminCategoriesList)

router.get('/add_categories',admin_Verified,cat.addCategories)

router.get('/add_product',admin_Verified,product_Control.addProduct)

router.get('/edit_product/:id',admin_Verified,product_Control.adminEditProduct)

router.get('/OrderList',admin_Verified,use.listOrder)

router.get('/Order_view/:MyOrder',admin_Verified,use.orderDetails)

router.get('/logout',admin_Verified,use.logout)

router.get('/daily_Report',admin_Verified,use.daily_Report)

router.get('/generate-pdf',admin_Verified,pdf.pdfDoc)

router.get('/excelDownload',admin_Verified,pdf.excelSheet)

router.get('/adminChart',admin_Verified,use.chartData)

router.get('/banner',admin_Verified,banner.banner)

router.get('/coupon',admin_Verified,coupon.getCoupon)

router.get('/coupon_List',admin_Verified,coupon.couponList)

router.get('/coupon_Edit/:id',admin_Verified,coupon.couponEdit)
 





//post

router.post('/login',use.postLogin)

router.post('/add_category',upload.single('image'),admin_Verified,cat.postCategories)

router.post('/add_product',upload.array('image',5),admin_Verified,product_Control.postProduct)

router.post('/product_edit/:id',upload.array('image',5),admin_Verified,product_Control.editProduct)

router.post('/listuser/:userId',admin_Verified,use.block)

router.post('/list_unlist/:id',admin_Verified,product_Control.unList)

router.post('/category_list_unlist/:dataId',admin_Verified,cat.categoryUnlist)

router.post('/delete/:deleteId',admin_Verified,product_Control.deleteItem )

router.post('/deleteImage/:productId',admin_Verified,product_Control.deleteImage)

router.post('/update_status/:OrderId/:ProductId',admin_Verified,product_Control.status)

router.post('/status',admin_Verified,use.orderStatus);

router.post('/banner',banner_upload.single('image'),admin_Verified,banner.post_banner)

router.post('/coupon',admin_Verified,coupon.post_Coupon)

router.post('/coupon_Edit/:id',admin_Verified,coupon.post_EditCoupon);

router.post('/delete_Coupons/:couponId',admin_Verified,coupon.deleteCoupon);

router.post('/couponlist',admin_Verified,coupon.list)










module.exports = router;
