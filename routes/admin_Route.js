const express = require('express');
const adminRoute = express();


const adminAuth = require('../middleware/adminAuth')

const upload = require('../middleware/multer');

adminRoute.set('views', './views/admin');

adminRoute.use(express.json());
adminRoute.use(express.urlencoded({ extended: true }));

adminRoute.use(express.static('public'));

const adminController = require('../controller/adminController');


adminRoute.get('/', adminAuth.isLogout, adminController.adminlogin);

adminRoute.get('/login', adminAuth.isLogout, adminController.adminlogin);

adminRoute.get('/logout', adminAuth.isLogin, adminController.logout);

adminRoute.post('/', adminController.verifyLogin);

adminRoute.get('/home', adminAuth.isLogin, adminController.loadhome);

adminRoute.get('/signup', adminAuth.isLogout, adminController.signupPage);

adminRoute.post('/signup', adminController.insertAdmin);


adminRoute.get('/packages', adminAuth.isLogin, adminController.packageLoad)

adminRoute.get('/addpackage', adminAuth.isLogin, adminController.addPackage);

adminRoute.post('/addpackage', adminAuth.isLogin,upload.array('image',4), adminController.insertPackage)

adminRoute.get('/editpackage', adminAuth.isLogin, adminController.editPackage);

adminRoute.post('/editpackage',adminAuth.isLogin, upload.array('image',4), adminController.updatePackage);

adminRoute.get('/blockpackage', adminAuth.isLogin, adminController.blockPackage);

adminRoute.get('/unblockpackage', adminAuth.isLogin, adminController.unblockPackage);



adminRoute.get('/category', adminAuth.isLogin, adminController.loadCategory);

adminRoute.get('/addcategory', adminAuth.isLogin, adminController.addCategory);

adminRoute.post('/addcategory', adminController.insertCategory);

adminRoute.get('/editcategory', adminAuth.isLogin, adminController.editCategory);

adminRoute.post('/editcategory', adminController.updateCategory);

adminRoute.get('/deletecategory', adminAuth.isLogin, adminController.deleteCategory);


adminRoute.get('/users', adminAuth.isLogin, adminController.usersLoad);

adminRoute.get('/blockuser', adminAuth.isLogin, adminController.blockUser);

adminRoute.get('/unblockuser', adminAuth.isLogin, adminController.unblockUser);


adminRoute.get('/banner',adminAuth.isLogin,adminController.loadBanner);

adminRoute.get('/addBanner',adminAuth.isLogin,adminController.addBanner);

adminRoute.post('/addBanner',adminAuth.isLogin,upload.single('image'),adminController.insertBanner);

adminRoute.get('/editBanner',adminAuth.isLogin,adminController.editBanner);

adminRoute.post('/editBanner',adminAuth.isLogin,upload.single('image'),adminController.updateBanner);

adminRoute.get('/deleteBanner',adminAuth.isLogin,adminController.deleteBanner);


adminRoute.get('/bookings',adminAuth.isLogin,adminController.bookingsLoad);

adminRoute.get('/status',adminAuth.isLogin,adminController.statusChange);


adminRoute.get('/addCoupon',adminAuth.isLogin,adminController.addCoupon);

adminRoute.post('/addCoupon',adminAuth.isLogin,adminController.insertCoupon);

adminRoute.get('/coupons',adminAuth.isLogin,adminController.couponLoad);

adminRoute.get('/deletecoupon',adminAuth.isLogin,adminController.couponDelete);

adminRoute.get('/editcoupon',adminAuth.isLogin,adminController.couponEdit);

adminRoute.post('/editcoupon',adminAuth.isLogin,adminController.updateCoupon);

adminRoute.get('/bookingsReport',adminAuth.isLogin,adminController.bookingsReport);



module.exports = adminRoute;
