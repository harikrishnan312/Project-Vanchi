const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const confirmBookingSchema = mongoose.Schema({
    booking_id:{
        type:Array,
        required:true
    },
    user_id:{
        type:String,
        required:true
    } ,
    order_id:{
        type:String,
        required:true
    },
    package:[
        {
            id:{type:ObjectId}
        }
    ],
    payment_method:{
        type:String,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
       default:false
    }
})

module.exports = mongoose.model('confirmBooking',confirmBookingSchema);