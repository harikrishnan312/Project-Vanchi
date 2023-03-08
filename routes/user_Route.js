const express = require("express");

const userRoute = express();

const config = require('../config/config');

const auth = require('../middleware/auth')

userRoute.use(express.static('public'));

userRoute.set('views', './views/users');

userRoute.use(express.json());
userRoute.use(express.urlencoded({ extended: true }));

const userController = require('../controller/userController');


userRoute.get('/', userController.loadhome);

userRoute.get('/login', auth.isLogout, userController.loginPage);

userRoute.post('/login', userController.verifyLogin);

userRoute.get('/logout', userController.userLogout);


userRoute.get('/signup', auth.isLogout, userController.signupPage);

userRoute.post('/signup', auth.isLogout, userController.insertUser);


userRoute.get('/otpverify', auth.isLogout, userController.otpverification);

userRoute.post('/otpverify', auth.isLogout, userController.verifyMail);


userRoute.get('/forgetpassword', auth.isLogout, userController.forgetPassword);

userRoute.post('/forgetpassword', auth.isLogout, userController.forgetVerify);

userRoute.get('/forget-password', auth.isLogout, userController.forgetPasswordLoad);

userRoute.post('/forget-password', auth.isLogout, userController.resetPassword);


userRoute.get('/home', auth.isLogin, userController.loadhome);

userRoute.post('/home',auth.isLogin,userController.packageCheck);


userRoute.get('/packageview', auth.isLogin, userController.packageload);

userRoute.post('/packageview', auth.isLogin, userController.checkinCheck);


userRoute.get('/profile', auth.isLogin, userController.profileLoad);

userRoute.get('/editprofile', auth.isLogin, userController.editProfile);

userRoute.post('/editprofile', auth.isLogin, userController.updateProfile);

userRoute.get('/editpassword', auth.isLogin, userController.editPassword);

userRoute.post('/editpassword', auth.isLogin, userController.updatePassword);


userRoute.get('/bookingscart', auth.isLogin, userController.bookingsCart);

userRoute.post('/bookingscart', auth.isLogin, userController.confirmPayment);


userRoute.post('/create/orderId', auth.isLogin, userController.createOrderId);

userRoute.post("/api/payment/verify", auth.isLogin, userController.paymentVerify);


userRoute.get('/delete', auth.isLogin, userController.deleteBooking);

userRoute.get('/editDate', auth.isLogin, userController.editDate);

userRoute.post('/editDate', auth.isLogin, userController.updateDate);

userRoute.get('/bookings', auth.isLogin, userController.bookingsLoad);

userRoute.get('/deleteBooking', auth.isLogin, userController.deleteBookings);


userRoute.post('/coupons',auth.isLogin,userController.couponsLoad);

module.exports = userRoute;