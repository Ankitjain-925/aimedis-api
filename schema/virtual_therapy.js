require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
    require("mongoose-field-encryption").fieldEncryption;
    
const ProfessionalInfo = new mongoose.Schema(
    {
      image: {
        type: String,
        required: false,
        unique: false,
      },
      first_name: {
        type: String,
        required: false,
        unique: false,
      },
      profile_id: {
        type: String,
        required: false,
        unique: false,
      },
      alies_id: {
        type: String,
        required: false,
        unique: false,
      },
      user_id: {
        type: String,
        required: false,
        unique: false,
      },
      last_name:{
        type: String,
        required: false,
        unique: false,
      }
    },
    { strict: false }
  );
  
  ProfessionalInfo.plugin(mongooseFieldEncryption, {
    fields: ["last_name","first_name","image", "alies_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
      return "1234567890123456"; // should ideally use the secret to return a string of length 16
    },
  });

var TherapySchema = new Schema(
    {

        house_id: {
            type: String,
            required: false,
            unique: false,
        },
        sequence_list: {
            type: Array,
            required: false,
            unique: false,
        },
        therapy_name: {
            type: String,
            required: false,
            unique: false,
        },
        disease_name: {
            type: String,
            required: false,
            unique: false,
        },

        therapy_description: {
            type: String,
            required: false,
            unique: false,
        },
        assinged_to: [ProfessionalInfo],
    },
    { strict: false }
);

TherapySchema.plugin(mongooseFieldEncryption, {

    fields: ["house_id", "therapy_name", "disease_name", "therapy_description"

    ],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    },
});
var virtual_therapy = mongoose.model("virtual_therapy", TherapySchema);
module.exports = virtual_therapy;
