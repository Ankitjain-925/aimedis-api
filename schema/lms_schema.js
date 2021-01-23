require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const FileList = new mongoose.Schema({
    filename:{
        type: String,
        required: false,
        unique: false
    },
    title:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false });

FileList.plugin(mongooseFieldEncryption, {
    fields: ["title"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var lmsSchema= new Schema({
    courseTitle:{
        type: String,
        required: false,
        unique: false
    },
    courseDesc:{
        type: String,
        required: false,
        unique:false
    },
    price:{
        type: Number,
        required: false,
        unique: false
    },
    permission:{
        type: Array,
        required: false,
        unique: false
    },
    language:{
        type: String,
        required: false,
        unique:false
    },
    topic:{
        type: Array,
        required: false,
        unique: false
    },
    isActive:{
        type: Boolean,
        required: false,
        unique: false
    },
    courseContent:{ 
        type: Object,
        required: false,
        unique:false
    },
    teaser: [FileList],
    attachment: [FileList],
    createdBy:{
        type:String,
        required: false,
        unique: false
    },
    createdAt:{
        type: String,
        required: false,
        unique: false
    },
    status:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false }) 

lmsSchema.plugin(mongooseFieldEncryption, { fields: [ "createdAt", "createdBy", "courseContent", "language", "courseTitle", "courseDesc"  ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
module.exports = mongoose.model('Lms', lmsSchema); 