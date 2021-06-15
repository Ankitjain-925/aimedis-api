require('dotenv').config();
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    uid:{
        type: String,
        required: true,
        unique: true
    },
    name:{
      type: String,
      required: false,
      unique: false
    },
    avatar:{
      type: String,
      required: false,
      unique: false
    },
    role: {
       type: String,
       required: false,
       unique: false
    },
    lastActiveAt: {
       type: Number,
       required: false,
       unique: false
    },
    conversationId: {
       type: String,
       required: false,
       unique: false
    }
},
{ strict: true },
);


var User = mongoose.model('comet_user', UserSchema);
module.exports = User;
 