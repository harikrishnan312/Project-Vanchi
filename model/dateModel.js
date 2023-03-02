const mongoose = require("mongoose");
const dateSchema = mongoose.Schema({
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    package_id:{
        type: String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    is_booked:{
        type:Boolean,
        default:true
    }

})
    module.exports = mongoose.model('Date',dateSchema);