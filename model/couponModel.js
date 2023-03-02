const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
    coupon_code: {
        type: String,
        required: true
    },
    expiry_date: {
        type: Date,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
     },
     user_id:{
        type:Array
     }
})
module.exports = mongoose.model('Coupon', couponSchema);