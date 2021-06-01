require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var QuesSchema = new Schema({
    question:{
        type: String,
        required: true,
        unique: false
    },
    options:{
        type: Array,
        required: false,
        unique: false
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
  
},{ strict: false });

QuesSchema.plugin(mongooseFieldEncryption, { fields: [ "task_name", "description", "house_id"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Task = mongoose.model('questionaire', QuesSchema);
module.exports = virtual_Task;