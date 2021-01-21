require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var wishlist = new Schema({
    user_id: {
        type: String,
        required: true,
        default: ''
      },
    user_profile_id: {
        type: String,
        required: true,
        default: ''
      },
    userName:{
        type: String,
        required: false,
        default: ''
    },
    userType:{
        type: String,
        required: true,
        default: ''
    },
    email:{
        type: String,
        required: true,
        default: ''
    },
    courseId: {
        type: String,
        required: false,
        unique: false
    },
    courseTitle: {
        type: String,
        required: false,
        unique: false
    },
    courseDesc: {
        type: String,
        required: false,
        unique: false
    },
    price: {
        type: Number,
        required: false,
        unique: false
    },
    language: {
        type: String,
        required: false,
        unique: false
    },
    topic: {
        type: Array,
        required: false,
        unique: false
    },
    attachment:[],
    teaser: {
        type: Object,
        required: false,
        unique: false
    },
    wishlistAddedDate:{
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: false,
        unique: false
    },
    createdAt: {
        type: String,
        required: false,
        unique: false
    }
},{ strict: false })

wishlist.plugin(mongooseFieldEncryption, { fields: [ "user_id","user_profile_id","userName","userType",
"email", "courseId", "courseTitle", "courseDesc","language", "createdBy", "createdAt"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

module.exports = mongoose.model('wishlist', wishlist);