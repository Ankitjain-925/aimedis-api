require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const RoomsAdd = new mongoose.Schema({
    room_name: {
        type: String,
        required: false,
        unique: false
     },
     beds:{
        type: Number,
        required: false,
        unique: false 
     }
},{ strict: false });

RoomsAdd.plugin(mongooseFieldEncryption, {
    fields: ["room_name"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

const WardsAdd = new mongoose.Schema({
    rooms:[RoomsAdd],
    ward_name: {
        type: String,
        required: false,
        unique: false
     },
},{ strict: false });

WardsAdd.plugin(mongooseFieldEncryption, {
    fields: ["ward_name"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var SpecialtySchema = new Schema({
    specialty_name:{
        type: String,
        required: true,
        unique: false
    },
    color:{
      type: String,
      required: false,
      unique: false
    },
    wards: [WardsAdd],
    virtual_hospital_id: {
        type: String,
        required: true,
        unique: false
    }
},{ strict: false });

SpecialtySchema.plugin(mongooseFieldEncryption, { fields: [ "specialty_name", "color"], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var Virtual_Specialty = mongoose.model('virtual_specialty', SpecialtySchema);
module.exports = Virtual_Specialty;
 