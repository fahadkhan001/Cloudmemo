const mongoose =require('mongoose')
const mongoURI ="mongodb://127.0.0.1:27017"

//can use promises but we are using async await
const connectToMongoose=()=>{
    mongoose.connect(mongoURI)
    console.log("connected to mongoose")


}

module.exports = connectToMongoose;