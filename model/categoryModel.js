const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
    room: {
        type: String,
        required: true
    }
})
    module.exports = mongoose.model('Category',categorySchema);