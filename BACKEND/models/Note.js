const mongoose = require('mongoose')
const {Schema} =mongoose

const NotesSchema = new Schema({
  //which user id will come from User.js
  user:{
    type:mongoose.Schema.Types.ObjectId ,
    //putting reference model from user

    ref : "user"
  },//after this i can store the user
    title:{
      type:String,
      required:true
    },
    description:{
      type:String,
      required:true,
     
    },
    tag:{
      type:String,
      default:"General"
    },
    date:{
      type:Date,
      default :Date.now
    },
  });

  module.exports = mongoose.model('notes', NotesSchema);