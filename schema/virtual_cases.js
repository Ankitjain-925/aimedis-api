require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var CaseSchema = new Schema({
    speciality:{
        type: Object,
        required: true,
        unique: false
    },
    case_number:{
      type: String,
      required: false,
      unique: false
    },
    patitent:{
        type: Object,
        required: false,
        unique: false
    },
    wards: {
        type: Object,
        required: true,
        unique: false},
    room: {
        type: Object,
        required: true,
        unique: false
    },
    bed:{
        type: String,
        required: true,
        unique: false
    },

},{ strict: false });

CaseSchema.plugin(mongooseFieldEncryption, { fields: [ "case_number" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Case = mongoose.model('virtual_specialty', CaseSchema);
module.exports = virtual_Case;