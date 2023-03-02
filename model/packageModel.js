const mongoose = require("mongoose");
const packageSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
  
    image: {
        type: Array,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    is_available:{
        type:Boolean,
        default:true
    }

    
});

module.exports = mongoose.model('Package',packageSchema);