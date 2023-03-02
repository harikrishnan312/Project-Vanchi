const mongoose = require("mongoose");
const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    //  image: {
    //     type: String,
    //      required: true
    //  },
    password: {
        type: String,
        required: true
    },
    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:''
    },
    address: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model('User',userSchema);