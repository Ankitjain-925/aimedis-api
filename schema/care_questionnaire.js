require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseEncription = require("mongoose-field-encryption").fieldEncryption;

const CareQuestionnaire = new mongoose.Schema(
 {
 
  submitDate: {
      type: Date,
      required: false,
      unique: false,
    },
    type: {
      type: String,
      required: false,
      unique: false
    },
    patient_id: {
      type: String,
      required: false,
      unique: false
    },
    case_id: {
      type: String,
      required: false,
      unique: false
    },
    patient_info: {
        type: String,
        required: false,
        unique: false,
      },
    nurse_info: {
        type: String,
        required: false,
        unique: false
      },
    nurse_id: {
        type: String,
        required: false,
        unique: false
      },
    house_id: {
        type: String,
        required: false,
        unique: false
      },
    service_id: {
        type: String,
        required: false,
        unique: false
      },
    questionnaire_answers: {
      type: Object,
      required: false
     }

 }
);
CareQuestionnaire.plugin(mongooseEncription, {
  fields: ["submitDate", "type","patient_id","case_id","nurse_id","house_id","service_id"],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});


var CareModel = mongoose.model('CareQuestionnaire', CareQuestionnaire );

module.exports = CareModel;
