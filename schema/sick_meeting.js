require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
  require("mongoose-field-encryption").fieldEncryption;

var SickSchema = new Schema(
  {
    patient_profile_id: {
      type: String,
      required: false,
      unique: true,
    },
    patient_id: {
      type: String,
      required: false,
      unique: false,
    },
    doctor_profile_id: {
      type: String,
      required: false,
      unique: true,
    },
    doctor_id: {
      type: String,
      required: false,
      unique: false,
    },

    start_time: {
      type: String,
      required: false,
      unique: false,
    },
    end_time: {
      type: String,
      required: false,
      unique: false,
    },

    date: {
      type: String,
      required: false,
      unique: false,
    },
    sesion_id: {
      type: String,
      required: false,
      unique: true,
    },
    link: {
      type: String,
      required: false,
      unique: true,
    },
  },
  { strict: false },
  { timestamps: true }
);

SickSchema.index({ area: "2dsphere" });

SickSchema.plugin(mongooseFieldEncryption, {
  fields: [
  ],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});
var Sick = mongoose.model("Sick", SickSchema);
module.exports = Sick;