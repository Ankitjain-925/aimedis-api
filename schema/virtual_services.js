require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var ServiceSchema = new Schema({
    title:{
        type: String,
        required: true,
        unique: false
    },
    description:{
      type: String,
      required: false,
      unique: false
    },
    price: {
        type : Number,
        required: false,
        unique: false 
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
    speciality_id: {
        type: Array,
        required: false,
        unique: false
    },
    status: {
        type: Boolean,
        required: false,
        unique: false
    },
    created_at: {
        type: String,
        required: false,
        unique: false
    },
},{ strict: false });

ServiceSchema.plugin(mongooseFieldEncryption, { fields: [ "title", "description" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Service = mongoose.model('virtual_service', ServiceSchema);
module.exports = virtual_Service;