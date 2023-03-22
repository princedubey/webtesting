const mongoose  = require("mongoose");
require('dotenv').config();
mongoose.set('strictQuery', true);

const connect = async() =>{
    try {
        const response = await mongoose.connect(process.env.MONGO_DB)
        console.log("Connected with databse");
    } catch (error) {
        console.log(error)
    }
}

module.exports = connect;