const User = require('../model/userModel');

const Admin = require('../model/adminModel');

const Package = require('../model/packageModel');

const Banner = require('../model/bannerModel');

const confirmBooking = require('../model/confirmBookingsModel')

const Category = require('../model/categoryModel');

const Coupon = require('../model/couponModel')

const bcrypt = require('bcrypt');

const config = require('../config/config');

const moment = require('moment');

const { confirmBookings } = require('./userController');
const { findOne } = require('../model/userModel');


const securePassword = (config.securePassword);

const adminlogin = async (req, res) => {
    try {

        res.render('adminLogin')
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const adminData = await Admin.findOne({ email: email });

        if (adminData) {


            const passwordMatch = await bcrypt.compare(password, adminData.password);

            if (passwordMatch) {

                req.session.admin_id = adminData._id
                res.redirect('home')

            }

            else {

                res.render('adminLogin', { message: "Email or password is wrong" })

            }
        } else {

            res.render('adminLogin', { message: "Email or password is wrong" })
        }
    } catch (error) {

        console.log(error.message);
    }
}
const loadhome = async (req, res) => {
    try {
        const packagesData = {};
        const months = {};
        const years = {};
        const days = {};
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const bookingdate = await confirmBooking.find({});

        bookingdate.forEach(function (booking) {
            let bookingDate = new Date(booking.date);
            let packageName = booking.booking_id[0].package_name;

            if (booking.booking_id[1]) {

                let packageNames = booking.booking_id[1].package_name;

                if (!packagesData[packageNames]) {
                    packagesData[packageNames] = 0;
                }
                packagesData[packageNames]++;
            }
            if (!packagesData[packageName]) {
                packagesData[packageName] = 0;
            }
            packagesData[packageName]++;

            let year = bookingDate.getFullYear();
            if (!years[year]) {
                years[year] = 0;
            }
            years[year]++;

            let day = bookingDate.getDate();
            if (!days[day]) {
                days[day] = 0;
            }
            days[day]++;

            let month = monthNames[bookingDate.getMonth()];
            if (!months[month]) {
                months[month] = 0;
            }
            months[month]++;
        });

        Promise.all([
            User.countDocuments(),
            Coupon.countDocuments(),
            Package.countDocuments(),
            Category.countDocuments(),
            confirmBooking.countDocuments()
        ])
            .then((results) => {
                const users = results[0];
                const coupons = results[1];
                const packages = results[2];
                const categories = results[3];
                const bookings = results[4];

                res.render('home', { packagesData, years, days, months, users, coupons, packages, categories, bookings });
            })
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {
    try {

        req.session.admin_id = null;
        res.redirect('/admin');


    } catch (error) {
        console.log(error.message);
    }
}
const signupPage = async (req, res) => {
    try {
        res.render('signUp');
    } catch (error) {
        console.log(error.message);
    }
}

const insertAdmin = async (req, res) => {
    try {
        const password = req.body.password;
        const repassword = req.body.repassword;
        if (password === repassword) {
            const checkAdmin = await Admin.find({
                email: req.body.email
            })

            const spassword = await securePassword(req.body.password);

            if (checkAdmin == "") {


                const admin = new Admin({
                    name: req.body.name,
                    email: req.body.email,
                    password: spassword,
                });



                const adminData = await admin.save();

                if (adminData) {

                    res.redirect('/admin/login');
                }
                else {
                    res.render('signUp', { message: "Your registration has been failed" });
                }
            }
            else {
                res.render('signUp', {
                    message: "Admin already exist"
                })
            }
        } else {
            res.render('signUp', { message: "passwords not match" })
        }
    }

    catch (error) {
        console.log(error.message);
    }
}

const packageLoad = async (req, res) => {

    try {
        const pacakageData = await Package.find({});
        res.render('packageLoad', { package: pacakageData });
    } catch (error) {
        console.log(error.message);
    }
}

const addPackage = async (req, res) => {
    try {
        const categoryData = await Category.find({});

        res.render('addPackage', { packageroom: categoryData })
    } catch (error) {
        console.log(error.message);
    }
}

const fileFilter = (req, file, cb) => {
    try {

        if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
            cb(null, true);
        } else {
            cb("File type not defined", false);

        }
    }
    catch (error) {

        console.log(error.message);
    }
}

const insertPackage = async (req, res) => {

    try {
        const images = req.files.map((file) => {

            return file.filename
        })


        const package = new Package({
            name: req.body.name,
            category: req.body.category,
            class: req.body.class,
            price: req.body.price,
            description: req.body.description,
            image: images
        });

        const packageData = await package.save();
        res.redirect('/admin/packages');

    } catch (error) {
        console.log(error.message);
    }
}

const editPackage = async (req, res) => {

    try {
        const id = req.query.id
        const categoryData = await Category.find({});
        const packageData = await Package.findById({ _id: id });
        res.render('editPackage', { package: packageData, category: categoryData });

    } catch (error) {
        console.log(error.message);
    }
}

const updatePackage = async (req, res) => {

    try {
        const images = req.files.map((file) => {
            return file.filename
        })
        console.log(images.length);

        const id = req.body.id
        if (images.length === 0) {
            await Package.findByIdAndUpdate({ _id: id }, {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    class: req.body.class,
                    price: req.body.price,
                    description: req.body.description,

                }
            });
        }
        else {
            await Package.findByIdAndUpdate({ _id: id }, {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    class: req.body.class,
                    price: req.body.price,
                    description: req.body.description,
                    image: images
                }
            });

        }

        res.redirect('/admin/packages');
    } catch (error) {
        console.log(error.message);
    }
}
const blockPackage = async (req, res) => {
    try {

        const id = req.query.id;
        const packageData = await Package.findByIdAndUpdate({ _id: id }, {
            $set: {
                is_available: false
            }
        });
        res.redirect('/admin/packages');


    } catch (error) {
        console.log(error.message)
    }
}

const unblockPackage = async (req, res) => {
    try {

        const id = req.query.id;
        const packageData = await Package.findByIdAndUpdate({ _id: id }, {
            $set: {
                is_available: true
            }
        });
        res.redirect('/admin/packages');

    } catch (error) {
        console.log(error.message);
    }
}

const loadCategory = async (req, res) => {

    try {
        const categoryData = await Category.find({});
        res.render('categoryLoad', { category: categoryData });
    } catch (error) {
        console.log(error.message);
    }
}

const addCategory = async (req, res) => {

    try {
        res.render('addCategory');
    } catch (error) {
        console.log(error.message);
    }
}

const insertCategory = async (req, res) => {

    try {
        const checkCategory = await Category.findOne({ room: req.body.room });

        if (checkCategory) {
            res.render('addCategory', { message: "category already exists" })
        } else {
            const category = new Category({
                room: req.body.room
            });

            const categoryData = await category.save();
            res.redirect('/admin/category');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const editCategory = async (req, res) => {

    try {
        const id = req.query.id
        const categoryData = await Category.findById({ _id: id })
        res.render('editCategory', { category: categoryData });

    } catch (error) {
        console.log(error.message);
    }
}

const updateCategory = async (req, res) => {

    try {

        const room = req.body.room
        const categoryData = await Category.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                room: room
            }
        })

        res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.query.id;
        const categoryData = await Category.deleteOne({ _id: id });
        res.redirect('/admin/category');


    } catch (error) {
        console.log(error.message)
    }
}

const usersLoad = async (req, res) => {

    try {
        const userData = await User.find({})
        res.render('userLoad', { users: userData })
    } catch (error) {
        console.log(error.message);
    }
}

const blockUser = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findByIdAndUpdate({ _id: id }, {
            $set: {
                is_blocked: true
            }
        });
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error.message);
    }
}

const unblockUser = async (req, res) => {

    try {
        const id = req.query.id
        const userData = await User.findByIdAndUpdate({ _id: id }, {
            $set: {
                is_blocked: false
            }
        });
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error.message)
    }
}
const loadBanner = async (req, res) => {

    try {
        const bannerData = await Banner.find({})
        res.render('loadBanner', { banner: bannerData });
    } catch (error) {
        console.log(error.message);
    }
}

const addBanner = async (req, res) => {
    try {
        res.render('addBanner')
    } catch (error) {
        console.log(error.message);
    }
}
const insertBanner = async (req, res) => {

    try {

        const banner = new Banner({

            name: req.body.name,
            image: req.file.filename
        });

        const bannerData = await banner.save();
        res.redirect('/admin/banner')
    } catch (error) {
        console.log(error.message);
    }
}
const editBanner = async (req, res) => {

    try {
        const id = req.query.id
        const bannerData = await Banner.findById({ _id: id })
        res.render('editBanner', { banner: bannerData });

    } catch (error) {
        console.log(error.message);
    }
}
const updateBanner = async (req, res) => {

    try {
        const id = req.body.id
        const bannerData = await Banner.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                image: req.file.filename
            }
        });

        res.redirect('/admin/banner');
    } catch (error) {
        console.log(error.message);
    }
}

const deleteBanner = async (req, res) => {
    try {
        const id = req.query.id;
        const bannerData = await Banner.deleteOne({ _id: id });
        res.redirect('/admin/banner')
    } catch (error) {
        console.log(error.message);
    }
}

const bookingsLoad = async (req, res) => {
    try {
        const bookings = await confirmBooking.find({}).sort({ date: -1 })
        if (bookings) {
            res.render('bookingsLoad', { bookings: bookings })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const cancelBooking = async (req, res) => {
    try {
        const id = req.query.id

        const booking = await confirmBooking.findOne({ _id: id });
        if (booking.is_blocked) {
            await confirmBooking.updateOne({ _id: id }, { $set: { is_blocked: false } });
        }
        else {
            await confirmBooking.updateOne({ _id: id }, { $set: { is_blocked: true } });
        }
        res.redirect('/admin/bookings')
    } catch (error) {
        console.log(error.message);
    }
}

const bookingsReport = async (req, res) => {
    try {
        const bookings = await confirmBooking.find({ status: true });
        res.render('bookingsReport', { bookings })

    } catch (error) {
        console.log(error.message);
    }
}
const statusChange = async (req, res) => {
    try {
        const id = req.query.id;
        const status = await confirmBooking.findOne({ _id: id })
        if (status.status) {
            await confirmBooking.updateOne({ _id: id }, { $set: { status: false } })
        } else {
            await confirmBooking.updateOne({ _id: id }, { $set: { status: true } })
        }
        res.redirect('/admin/bookings')
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async (req, res) => {
    try {
        res.render('addCoupon')

    } catch (error) {
        console.log(error.message);
    }
}

const insertCoupon = async (req, res) => {
    try {
        const name = req.body.name;
        const expiry_date = req.body.expiry_date;
        const coupon_code = req.body.coupon_code;
        const discount = req.body.discount;

        const couponCheck = await Coupon.findOne({ coupon_code: coupon_code })
        if (couponCheck) {

            res.render('addCoupon', { message: 'Coupon already exists' })
        } else {
            const coupon = new Coupon({
                name: name,
                expiry_date: expiry_date,
                coupon_code: coupon_code,
                discount: discount
            })
            await coupon.save()

            res.redirect('/admin/coupons')
        }


    } catch (error) {
        console.log(error.message);
    }
}

const couponLoad = async (req, res) => {
    try {
        const coupon = await Coupon.find({})
        if (coupon) {
            const formattedCouponData = coupon.map((coupons) => ({
                ...coupons._doc,
                expiry_date: moment(coupons.expiry_date).format("MM/DD/YYYY"),
            }));
            res.render('couponsLoad', { coupon: formattedCouponData })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const couponDelete = async (req, res) => {
    try {
        await Coupon.deleteOne({ _id: req.query.id });
        res.redirect('/admin/coupons')

    } catch (error) {
        console.log(error.message);
    }
}

const couponEdit = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ _id: req.query.id });
        res.render('editCoupon', { coupon })
    } catch (error) {
        console.log(error.message);
    }
}

const updateCoupon = async (req, res) => {

    try {


        await Coupon.findByIdAndUpdate({ _id: req.body.id }, {
            $set: {
                name: req.body.name,
                coupon_code: req.body.coupon_code,
                expiry_date: req.body.expiry_date,
                discount: req.body.discount
            }
        })

        res.redirect('/admin/coupons');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    adminlogin,
    verifyLogin,
    loadhome,
    signupPage,
    insertAdmin,
    addPackage,
    loadCategory,
    addCategory,
    insertCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    packageLoad,
    insertPackage,
    editPackage,
    updatePackage,
    blockPackage,
    unblockPackage,
    usersLoad,
    blockUser,
    unblockUser,
    logout,
    fileFilter,
    addBanner,
    loadBanner,
    insertBanner,
    editBanner,
    updateBanner,
    deleteBanner,
    bookingsLoad,
    addCoupon,
    insertCoupon,
    couponLoad,
    couponDelete,
    couponEdit,
    updateCoupon,
    statusChange,
    bookingsReport,
    cancelBooking
}