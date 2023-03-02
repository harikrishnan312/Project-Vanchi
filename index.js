
const config = require('./config/config')

const express = require("express");
const app = express();

config.Db();

const session = require('express-session');
app.use(session({
    secret:"mysessionkey",
    //secret: (config.secretkey),
    saveUninitialized: false,
    resave: false
}));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store');
    next();
});

app.set('view engine', 'hbs');

app.use(express.static('public'));

const userRoute = require("./routes/user_Route");
app.use('/', userRoute)

const adminRoute = require("./routes/admin_Route");
const { connect } = require('mongoose');
app.use('/admin', adminRoute)

const { notFound, errorHandler } = require("./middleware/errorHandling");

app.use("*", notFound);
app.use(errorHandler);

app.listen(3000, function () {
    console.log("Server started on port 3000");
});