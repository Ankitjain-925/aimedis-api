require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const StepSchema = new mongoose.Schema({
    step_name: {
        type: String,
        required: true,
        unique: false
     },
    step_order:{
        type: String,
        required: false,
     },
    house_id:{
        type: String,
        required: true,
    }, 
    case_numbers:Array,
    },{strict : false}); 
     
  StepSchema.plugin(mongooseFieldEncryption, {
    fields: ["step_name","step_order"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });
var virtual_step = mongoose.model('virtual_step',StepSchema);
module.exports =  virtual_step ;