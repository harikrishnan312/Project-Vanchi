const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const bookingSchema = mongoose.Schema({
    package_id: {
        type: ObjectId,
        required: true
    },
    package_name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    date_id: {
        type: ObjectId,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    checkin: {
        type: String,
        required: true
    },
    checkout: {
        type: String,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    guests: {
        type: Number,
        required: true
    }


})

module.exports = mongoose.model('Booking', bookingSchema);