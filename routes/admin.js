var express = require('express');
var router = express.Router();
const use = require('../controller/admincontroller')
const upload = require('../middileware/categorymulter')
const admin_Verified = require('../middileware/adminverify')
const cat = require('../controller/admincategories')
const product_Control = require('../controller/adminproduct')



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

router.get('/weekly_Report',admin_Verified,use.weekly_Report)

router.get('/monthly_Report',admin_Verified,use.monthly_Report)









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

router.post('/status',admin_Verified,use.orderStatus)




module.exports = router;
