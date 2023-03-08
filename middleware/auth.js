const User= require('../model/userModel') ;

const isLogin = async (req, res, next) => {
    try {
       
        if (req.session.user_id) {
            y
            const userData = await User.findOne({_id:req.session.user_id});
            if (userData.is_blocked === false) {
                
        } else {
            req.session.user_id = null;
            res.redirect('/')
        }} else {
            res.redirect('/');
        }

        next();
    } catch (error) {

        console.log(error.message);

    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/home')
        } else {

        }
        next();
    } catch (error) {

        console.log(error.message);

    }
}

module.exports = {
    isLogin,
    isLogout
}