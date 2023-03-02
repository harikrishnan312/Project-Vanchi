require('dotenv').config();

const bcrypt = require('bcrypt');

const secretkey = process.env.secretkey;
// const emailUser = process.env.emailUser;
// const emailPassword = process.env.emailPassword;
const emailUser = "harikrishnanks9645969312@gmail.com";
const emailPassword = "lyyjnbykdvpngumq";

const key_id= process.env.key_id ;
const key_secret= process.env.key_secret;

const Db =  () =>{
    const mongoose = require('mongoose');
    
    mongoose.set('strictQuery', false);
    mongoose.connect("mongodb://127.0.0.1:27017/"+"Vanchi_project");
    
}
const securePassword = async (password) => {
    try {
        const passwordHAsh = await bcrypt.hash(password, 10);
        return passwordHAsh;
    }
    catch (error) {
        console.log(error.message);
    }
}

module.exports={
    secretkey,
    emailUser,
    emailPassword,
    Db,
    securePassword,
    key_id,
    key_secret
};