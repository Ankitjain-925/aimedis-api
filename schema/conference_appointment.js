require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;




var appointmentsSchema1 = new Schema({
    patient_id:{
        type:String,
        required:false,
        unique:false
    },
    Speciality:{
        type:String,
        required:false,
        unique:false
    },

    date:{
        type:Date,
        required:false,
        unique:false
    },
    start_time:{
        type:String,
        required:false,
        unique:false
    },
    end_time:{
        type:String,
        required:false,
        unique:false
    },
    status:{
        type:String,
        required:false,
        unique:false
    },

    payment_type :{
        type: String,
        required: false,
        unique: false
     },
     total_amount :{
        type: String,
        required: false,
        unique: false
     },
     created_at: {
        type: String,
        required: false,
        unique: false,
      },
 
},{ strict: false });

appointmentsSchema1.plugin(mongooseFieldEncryption, { fields: [ "payment_type","patient_id","created_at",], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });

var Conference_Appointment = mongoose.model('Appointments1', appointmentsSchema1);

module.exports = Conference_Appointment;
