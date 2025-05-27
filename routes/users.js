const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/Pinterest');

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required : true,
    unique: true
  },
  password :{
    type: String,
    required: false
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  dp :{
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: { 
    type: String,
    required: true
  },
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);