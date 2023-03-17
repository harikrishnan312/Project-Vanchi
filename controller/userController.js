const User = require('../model/userModel');

// import { Calendar } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';

const Package = require('../model/packageModel');

const Category = require('../model/categoryModel')

const Dates = require('../model/dateModel');

const Booking = require('../model/bookingModel');

const confirmBooking = require('../model/confirmBookingsModel');

const Banner = require('../model/bannerModel');

const Coupon = require('../model/couponModel')

const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");

const moment = require('moment');

const Swal = require('sweetalert2');

const Razorpay = require('razorpay');

// const crypto = require('crypto')`

const config = require('../config/config');


const randomstring = require("randomstring");
const { findOne } = require('../model/userModel');
const { ObjectId } = require('mongodb');

//otp sending

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const otp = generateOTP();

//login page
const loginPage = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = (config.securePassword);

var instance = new Razorpay(
    {
        key_id: "rzp_test_UWN9YHKEBFWQUS",
        key_secret: "JovSRUtrFwTD16AbrEtgD0Pk"
    })

// for send mail
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: (config.emailUser),
                pass: (config.emailPassword)
            }
        });




        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Verification mail',
            html: '<p>Hii ' + name + ' This is your OTP  ' + otp + /*  Please click here to <a href="http://localhost:3000/otpverify?id='+ user_id + '"> Verify </a> your mail.*/'</p> '
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:-", info.response);

            }
        })
    } catch (error) {
        console.log(error.message);
    }
}



const insertUser = async (req, res) => {
    try {
        const password = req.body.password;
        const repassword = req.body.repassword;
        if (password === repassword) {
            const checkUser = await User.find({
                email: req.body.email
            })

            const mob = await User.find({
                mobile: req.body.mobile
            })



            const spassword = await securePassword(req.body.password);

            if (checkUser == "") {

                if (mob == "") {


                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        address: req.body.address,
                        password: spassword,
                        is_admin: 0,
                        token: otp
                    });



                    const userData = await user.save();

                    if (userData) {
                        sendVerifyMail(req.body.name, req.body.email, userData._id);
                        res.redirect('/otpverify?id=' + userData._id);
                    }
                    else {
                        res.render('signup', { message: "Your registration has been failed" });
                    }
                }
                else {
                    res.render('signup', {
                        message: " Email or mobile already taken"
                    })
                }
            }
            else {
                res.render('signup', {
                    message: " Email or mobile already taken"
                })
            }
        }
        else {
            res.render('signup', { error: "Passwords not match" })
        }
    }
    catch (error) {
        console.log(error.message);
    }
}
const otpverification = async (req, res) => {
    try {
        res.render('otpVerify', { message: 'please check email for otp' });
    } catch (error) {
        console.log(error.message);
    }
}

// verify using otp
const verifyMail = async (req, res) => {

    try {


        const userData = await User.findOne({ _id: req.query.id });
        // console.log(req.query.id);

        const enterotp = await req.body.otp;



        if (enterotp === userData.token) {
            const otpcheck = await User.updateOne({
                email: userData.email
            }, {
                $set: {
                    is_verified: 1
                }
            });
            // console.log(otpcheck);
            res.render('otpVerify', { message: "EMAIL successfully verified" })

        } else {
            res.render('otpVerify', {
                error: "invalid otp please check and retry"
            })
        }
    }
    catch (error) {

        console.log(error);
    }
}


//verify using email

// const verifyMail = async (req, res) => {
//     try {

//         const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });

//         console.log(updateInfo);
//         res.render("email_verified");

//     } catch (error) {

//     }
// }

const signupPage = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPassword = async (req, res) => {
    try {
        res.render('forgetPassword')
    } catch (error) {
        console.log(error.message);
    }
}
//for reseting password

const sendResetPasswordMail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset password',
            html: '<p>Hii ' + name + ' please click here to <a href="https://vanchi.online/forget-password?token=' + token + '"> Reset </a> your password.</p>'
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been sent:-", info.response);

            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {

        const email = req.body.email;
        const userData = await User.findOne({ email: email });

        if (userData) {

            if (userData.is_verified === 0) {

                res.render('forgetPassword', { message: "Please verify your mail" });

            } else {

                const randomString = randomstring.generate();
                const UpdatedData = await User.updateOne({ email: email }, { $set: { token: randomString } });
                sendResetPasswordMail(userData.name, userData.email, randomString);
                res.render('forgetPassword', { message: "Please check your mail for reseting your password." });

            }


        } else {
            res.render('forgetPassword', { error: "User email is incorrect." });
        }

    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({ token: token });

        if (tokenData) {

            res.render('forgetPasswordEmail', { user_id: tokenData._id });

        } else {
            res.render('404', { error: "Token is invalid" });
        }



    } catch (error) {
        console.log(error.message);
    }
}


const resetPassword = async (req, res) => {
    try {
        const repassword = req.body.repassword;
        const password = req.body.password;

        if (repassword === password) {
            const user_id = req.body.user_id;
            const secure_Password = await securePassword(password);

            const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_Password } });

            res.render('forgetPasswordEmail', { message: "Password reset successfully" })
        }
        else {
            const token = req.query.token;
            const tokenData = await User.findOne({ token: token });

            if (tokenData) {

                res.render('forgetPasswordEmail', { message: "Passwords not match", user_id: tokenData._id });

            } else {
                res.render('404', { message: "Token is invalid" });
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;



        const userData = await User.findOne({ email: email });



        if (userData) {
            if (userData.is_blocked === false) {

                const passwordMatch = await bcrypt.compare(password, userData.password);

                if (passwordMatch) {

                    if (userData.is_verified === 0) {


                        res.render('login', { message: 'Please verify your mail' });
                    } else {


                        req.session.user_id = userData._id

                        res.redirect('/home');

                    }

                } else {
                    res.render('login', { message: 'Email and password is incorrect' })

                }

            }
            else {
                res.render('login', { error: "You are blocked" })

            }
        }
        else {
            res.render('login', { error: 'Email and password is incorrect' })
        }

    } catch (error) {

        console.log(error.message);

    }
}

const loadhome = async (req, res) => {
    try {

        const bannerData = await Banner.find()
        const packageData = await Package.find({ is_available: true })
        const categoryData = await Category.find({});
        if (req.session.user_id) {
            const userData = await User.findById({ _id: req.session.user_id });
            res.render('home', { package: packageData, userData: userData, banner: bannerData, packageRoom: categoryData })
        } else {
            res.render('home', { package: packageData, banner: bannerData, packageRoom: categoryData })
        }


    } catch (error) {
        console.log(error.message);
    }
}
const packageCheck = async (req, res) => {
    try {
        let packageCheck;
        const checkinDate = req.body.checkin;
        const checkoutDate = req.body.checkout;
        const categoryData = req.body.category;
        const categoryDatas = await Category.find({});
        // console.log(categoryData);
        const userData = await User.findById({ _id: req.session.user_id });

        const bannerData = await Banner.find({})

        let checkDate = new Date(checkinDate);
        const checkin = (checkDate > new Date());

        const checkinCheck = await Dates.find({
            $or: [{ checkin: req.body.checkin },
            { $and: [{ checkin: { $lt: checkinDate } }, { checkout: { $gt: checkinDate } }] },
            { $and: [{ checkin: { $lt: checkoutDate } }, { checkout: { $gt: checkoutDate } }] },
            { $and: [{ checkin: { $gt: checkinDate } }, { checkin: { $lt: checkoutDate } }] }]
        }, { package_id: 1, _id: 0 });

        if (checkin) {

            if (checkinCheck) {
                const arr = checkinCheck.map(({ package_id }) => (package_id))
                if (categoryData === 'All') {
                    packageCheck = await Package.find({ _id: { $nin: arr }, is_available: true })
                } else {
                    packageCheck = await Package.find({ _id: { $nin: arr }, is_available: true, category: categoryData })
                }


                if (packageCheck.length === 0) {

                    res.render('home', {
                        userData: userData,
                        message: 'Packages fully booked for selected date, please choose another date',
                        banner: bannerData, availablePackage: packageCheck, checkinDate, checkoutDate, packageRoom: categoryDatas
                    })

                } else {

                    res.render('home', {
                        userData: userData, banner: bannerData,
                        availablePackage: packageCheck, checkinDate, checkoutDate, packageRoom: categoryDatas
                    })
                }
            } else {
                const packageCheck = await Package.find({ is_available: true })

                res.render('home', {
                    userData: userData, banner: bannerData,
                    availablePackage: packageCheck, checkinDate, checkoutDate, packageRoom: categoryDatas
                })
            }
        }else{

            res.render('home', {
                userData: userData,message:"Bookings closed for these dates, please choose another date", banner: bannerData,
                availablePackage:[], checkinDate, checkoutDate, packageRoom: categoryDatas
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const profileLoad = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id });
        res.render('profile', { userData: userData })
    } catch (error) {
        console.log(error.message);
    }
}

const editProfile = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id })

        res.render('editProfile', { userData: userData })
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {

        const userData = await User.updateOne({ _id: req.session.user_id }, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address
            }
        });
        res.redirect('/profile')
    } catch (error) {
        console.log(error.message);
    }
}

const editPassword = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id });
        res.render('editPassword', { userData: userData });

    } catch (error) {
        console.log(error.message);
    }
}

const updatePassword = async (req, res) => {
    try {
        const userData = await User.findOne({ _id: req.session.user_id });

        const password = req.body.password;
        const newpassword = req.body.newpassword;
        const repassword = req.body.repassword;

        const secure_Password = await securePassword(newpassword);

        const passwordmatch = await bcrypt.compare(password, userData.password)

        if (passwordmatch) {

            if (newpassword === repassword) {

                const updatepassword = await User.updateOne({ _id: userData._id }, {
                    $set: {
                        password: secure_Password
                    }
                })

                res.redirect('/profile');

            } else {
                res.render('editPassword', { message: "Passwords doesn't match" })
            }


        } else {
            res.render('editPassword', { message: "Password wrong" })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const userLogout = async (req, res) => {
    try {

        req.session.user_id = null;
        res.redirect('/')

    } catch (error) {
        console.log(error.message);
    }
}

const packageload = async (req, res) => {

    try {
        const checkin = req.query.in;
        const checkout = req.query.out;
        const id = req.query.id
        const packageData = await Package.findOne({ _id: id })
        res.render('packageView', { package: packageData, checkin, checkout });
    } catch (error) {
        console.log(error.message)
    }
}
const checkinCheck = async (req, res) => {
    try {
        const checkoutDate = req.body.checkout;
        const checkinDate = req.body.checkin;
        const guests = req.body.guests;
        const bookingDate = await Booking.find({ user_id: req.session.user_id });

        const id = req.query.id;
        const userData = await User.findOne({ _id: req.session.user_id })
        const packagecheck = await Dates.findOne({ package_id: req.body.packageid })
        const datedata = await Dates.findOne({ checkin: req.body.checkin, package_id: id });
        const packageData = await Package.findOne({ _id: id });

        let checkDate = new Date(checkinDate);
        const checkin = (checkDate > new Date());

        const checkinCheck = await Dates.findOne({

            $or: [{ $and: [{ checkin: { $lt: checkinDate } }, { checkout: { $gt: checkinDate } }, { package_id: id }] },
            { $and: [{ checkin: { $lt: checkoutDate } }, { checkout: { $gt: checkoutDate } }, { package_id: id }] },
            { $and: [{ checkin: { $gt: checkinDate } }, { checkin: { $lt: checkoutDate } }, { package_id: id }] }]
        });
        if (checkin) {
            if (bookingDate.length === 2) {
                res.render('packageView', { message: "Booking Cart is full ", package: packageData })
            } else {
                if (packagecheck) {

                    if (datedata) {

                        res.render('packageView', { message: "Sorry Someone already taken your date ", package: packageData })
                    }
                    else {
                        if (checkinCheck) {
                            res.render('packageView', { message: "Sorry Someone already taken your date ", package: packageData })

                        } else {

                            const date = new Dates({
                                checkin: req.body.checkin,
                                checkout: req.body.checkout,
                                package_id: req.body.packageid,
                                user_id: userData._id
                            })
                            const dateData = await date.save();
                            if (dateData) {

                                const checkIn = moment(dateData.checkin);
                                const checkOut = moment(dateData.checkout);
                                const checkinData = checkIn.format('MMMM DD YYYY');
                                const checkoutData = checkOut.format('MMMM DD YYYY');

                                const checkout = dateData.checkout;
                                const checkin = dateData.checkin;
                                const checkindate = moment(checkin, 'YYYY-MM-DD');
                                const checkoutdate = moment(checkout, 'YYYY-MM-DD');
                                const days = checkoutdate.diff(checkindate, 'days');
                                const totalPrice = (packageData.price * days);


                                const booking = new Booking({
                                    package_id: dateData.package_id,
                                    package_name: packageData.name,
                                    user_id: userData._id,
                                    user_name: userData.name,
                                    date_id: dateData._id,
                                    price: totalPrice,
                                    checkin: checkinData,
                                    checkout: checkoutData,
                                    days: days,
                                    guests: guests
                                })

                                const bookingData = await booking.save();

                                res.redirect('/bookingscart')
                            }
                            else {
                                console.log(error.message);
                            }
                        }
                    }
                } else {


                    const date = new Dates({
                        checkin: req.body.checkin,
                        checkout: req.body.checkout,
                        package_id: req.body.packageid,
                        user_id: userData._id
                    })
                    const dateData = await date.save();



                    if (dateData) {

                        const checkIn = moment(dateData.checkin);
                        const checkOut = moment(dateData.checkout);
                        const checkinData = checkIn.format('MMMM DD YYYY');
                        const checkoutData = checkOut.format('MMMM DD YYYY');


                        const checkout = await dateData.checkout;
                        const checkin = await dateData.checkin;
                        const checkindate = moment(checkin, 'YYYY-MM-DD');
                        const checkoutdate = moment(checkout, 'YYYY-MM-DD');
                        const days = checkoutdate.diff(checkindate, 'days');
                        const totalPrice = (packageData.price * days);

                        const booking = new Booking({
                            package_id: dateData.package_id,
                            package_name: packageData.name,
                            user_id: userData._id,
                            user_name: userData.name,
                            date_id: dateData._id,
                            price: totalPrice,
                            checkin: checkinData,
                            checkout: checkoutData,
                            days: days,
                            guests: guests
                        })

                        const bookingData = await booking.save();

                        res.redirect('/bookingsCart');
                    }
                    else {
                        console.log(error.message);
                    }
                }
            }
        } else {
            res.render('packageView', { message: "Booking closed for these dates..", package: packageData })
        }



    } catch (error) {
        console.log(error.message);
    }
}

const bookingsCart = async (req, res) => {
    try {

        const bookingData = await Booking.aggregate([{ $match: { user_id: req.session.user_id } }, {
            $lookup:
            {
                from: "packages",
                localField: "package_id",
                foreignField: "_id",
                as: "package_details"
            }
        },
        {
            $lookup:
            {
                from: "dates",
                localField: "date_id",
                foreignField: "_id",
                as: "date_details"
            }
        }]);

        let subtotal = 0;

        if (bookingData.length !== 0) {

            bookingData.forEach((packageData) => {
                subtotal = subtotal + Number(packageData.price);
            })

            // for(i=0;i<bookingData.length;i++){
            //      packageDetails = bookingData[i].package_details;

            //     packageDetails.forEach((packageData) => {
            //                     subtotal = subtotal + Number(packageData.price);

        }


        res.render('bookingsCart', { bookingData, subtotal })
    } catch (error) {
        console.log(error.message);
    }
}
// payment option

const confirmPayment = async (req, res) => {
    try {
        let total;
        const datetime = new Date()


        const bookingsData = await Booking.find({ user_id: req.session.user_id })
        const { package_id, payment, subtotal, coupon_code } = req.body;


        console.log(subtotal + "PASSED");
        if (payment[0] == 1) {
            method = "Pay at checkin"
            total = subtotal;
        } else {
            method = "Razorpay"
            total = subtotal / 100;
        }
        const result = Math.random().toString(36).substring(2, 7);
        const id = Math.floor(100000 + Math.random() * 900000);
        const orderId = result + id;

        const confirmBookings = package_id.map((item, i) => ({
            id: package_id[i]
        }));
        const data = new confirmBooking({
            user_id: req.session.user_id,
            order_id: orderId,
            package: confirmBookings,
            booking_id: bookingsData,
            payment_method: method,
            total: total,
            date: datetime
        })

        // console.log(data);
        const confirmbooking = await data.save();

        const clearBooking = await Booking.deleteMany({ user_id: req.session.user_id });

        if (confirmbooking && clearBooking) {

            await Coupon.updateOne({ coupon_code: coupon_code }, { $push: { user_id: req.session.user_id } })

            res.json("success")
        } else {
            const handlePlacementissue = await confirmBooking.deleteMany({ orderId: orderId, });
            res.json("try again")

        }

    } catch (error) {
        console.log(error.message);
        res.json("try again")

    }
};

// try {
//     const userid = req.session.user_id
//     const subtotal = req.body.subtotal;
//     const bookingsData = await Booking.find({ user_id: req.session.user_id })
//     payment_method = req.body.paymentMethod;

//         const confirm = new confirmBooking({
//             price: subtotal,
//             user_id: userid,
//             booking_id: bookingsData
//         });

//         const confirmed = await confirm.save();

//         if(confirmed){
//             res.json("success")}


//         const deleteBooking = await Booking.deleteMany({user_id:userid}) ;
//         const deleteDates = await Date.deleteMany({user_id:userid})

//         if(confirmed){
//             res.json("success")}
//             else{
//                 console.log(error);
//             }
//         res.redirect('/home')

//     } 


//  catch (error) {
//     console.log(error.message);
// }


const deleteBooking = async (req, res) => {
    try {
        const id = await req.query.id;
        const date_id = await req.query.dateid;


        const deletebooking = await Booking.deleteOne({ _id: id });
        const deletedate1 = await Dates.deleteOne({ _id: date_id });

        res.redirect('/bookingsCart')


    } catch (error) {
        console.log(error.message);
    }
}
const editDate = async (req, res) => {

    try {
        const dateid = req.query.dateid;
        const dates = await Booking.findOne({ date_id: dateid })
        const id = req.query.id
        const packageData = await Package.findOne({ _id: id })

        res.render('editDate', { package: packageData, dates: dates });
    } catch (error) {
        console.log(error.message)
    }
}
const updateDate = async (req, res) => {
    try {
        const checkoutDate = req.body.checkout
        const checkinDate = req.body.checkin
        const guests = req.body.guests;
        const dateid = req.query.dateid;

        const blockBooking = await Dates.updateOne({ _id: dateid }, {
            $set: {
                is_booked: false
            }
        })
        const dates = await Booking.findOne({ date_id: dateid })

        const id = req.query.id;
        const userData = await User.findOne({ _id: req.session.user_id })
        // const packagecheck = await Dates.findOne({ package_id: req.body.packageid })
        const packageData = await Package.findOne({ _id: id });
        console.log(packageData);
        const checkinCheck = await Dates.findOne({
            $and: [{ package_id: req.body.packageid },
            {
                $or: [{ checkin: req.body.checkin }, { $and: [{ checkin: { $lt: checkinDate } }, { checkout: { $gt: checkinDate } }] },
                { $and: [{ checkin: { $lt: checkoutDate } }, { checkout: { $gt: checkoutDate } }] },
                { $and: [{ checkin: { $gt: checkinDate } }, { checkin: { $lt: checkoutDate } }] }]
            }]
        });
        if (checkinCheck && checkinCheck.is_booked) {

            res.render('editDate', { message: "Sorry Someone already taken your date ", package: packageData, dates: dates })

            await Dates.updateOne({ _id: req.query.dateid }, {
                $set: {
                    is_booked: true
                }
            })
        } else {

            const date = await Dates.updateOne({ _id: req.query.dateid }, {
                $set: {
                    checkin: req.body.checkin,
                    checkout: req.body.checkout,
                    package_id: req.body.packageid,
                    user_id: userData._id,
                    is_booked: true
                }
            })
            const dates = await Dates.findOne({ _id: req.query.dateid });
            const checkIn = moment(dates.checkin);
            const checkOut = moment(dates.checkout);
            const checkinData = checkIn.format('MMMM DD YYYY');
            const checkoutData = checkOut.format('MMMM DD YYYY');

            const checkout = dates.checkout;
            const checkin = dates.checkin;
            const checkindate = moment(checkin, 'YYYY-MM-DD');
            const checkoutdate = moment(checkout, 'YYYY-MM-DD');
            const days = checkoutdate.diff(checkindate, 'days');
            const totalPrice = (packageData.price * days);


            const booking = await Booking.updateOne({ date_id: dates._id }, {
                $set: {
                    package_id: dates.package_id,
                    user_id: userData._id,
                    date_id: dates._id,
                    price: totalPrice,
                    checkin: checkinData,
                    checkout: checkoutData,
                    days: days,
                    guests: guests
                }
            })

            res.redirect('/bookingsCart')
        }


    } catch (error) {
        console.log(error.message);
    }
}

const bookingsLoad = async (req, res) => {
    try {
        const bookingData = await confirmBooking.find({ user_id: req.session.user_id }).sort({ date: -1 });
        if (bookingData) {
            const formattedBookingData = bookingData.map((booking) => ({
                ...booking._doc,
                date: moment(booking.date).format("MM/DD/YYYY"),
            }));
            res.render('bookings', { booking: formattedBookingData })
        }
    } catch (error) {
        console.log(error.message);
    }
}
const deleteBookings = async (req, res) => {
    try {
        const id = req.query.id;
        const date_id1 = req.query.dateid1;
        const date_id2 = req.query.dateid2;

        const deleteBookings = await confirmBooking.deleteOne({ _id: id })
        if (deleteBookings) {
            res.redirect('/bookings')
        }
        const deletedate1 = await Dates.deleteOne({ _id: date_id1 });
        if (date_id2) {
            const deletedate2 = await Dates.deleteOne({ _id: date_id2 });
        }

    } catch (error) {
        console.log(error.message);
    }
}

const createOrderId = async (req, res) => {
    try {
        console.log("Create OrderId Request", req.body)
        var options = {
            amount: req.body.amount, // amount in the smallest currency unit
            currency: "INR",
            receipt: "rcp1"
        };
        instance.orders.create(options, function (err, order) {
            console.log(order);
            res.send({ orderId: order.id });//EXTRACT5NG ORDER ID AND SENDING IT TO CHECKOUT
        });
    }
    catch (error) {
        console.log(error.message);
    }
}
const paymentVerify = async (req, res) => {
    try {

        let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', 'JovSRUtrFwTD16AbrEtgD0Pk')
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        var response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature)
            response = { "signatureIsValid": "true" }
        res.send(response);
    }
    catch (error) {
        console.log(error.message);
    }
}

const couponsLoad = async (req, res) => {
    try {
        const user_id = req.session.user_id;
        const dateNow = new Date();

        const { subtotal, coupon_code } = req.body;
        const couponFind = await Coupon.findOne({ coupon_code: coupon_code });
        const userFind = await Coupon.findOne({ $and: [{ user_id: user_id }, { coupon_code: coupon_code }] });

        if (couponFind) {

            if (userFind) {
                res.json("used")

            } else {

                if (dateNow > couponFind.expiry_date) {
                    res.json("expired")
                } else {

                    const amount = subtotal * couponFind.discount / 100;
                    const finalPrice = subtotal - amount
                    console.log(finalPrice);
                    res.json(finalPrice)
                }
            }

        } else {
            res.json("try again")
        }
        // res.redirect('/bookingsCart');

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loginPage,
    signupPage,
    forgetPassword,
    insertUser,
    verifyMail,
    verifyLogin,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    loadhome,
    otpverification,
    packageload,
    userLogout,
    profileLoad,
    editProfile,
    updateProfile,
    editPassword,
    updatePassword,
    checkinCheck,
    bookingsCart,
    deleteBooking,
    editDate,
    updateDate,
    confirmPayment,
    bookingsLoad,
    deleteBookings,
    createOrderId,
    paymentVerify,
    couponsLoad,
    packageCheck,
}
