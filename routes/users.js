const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Pintrest');

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required : true,
    unique: true
  },
  password :{
    type: String,
    required: true
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

module.exports = mongoose.model("user", userSchema);