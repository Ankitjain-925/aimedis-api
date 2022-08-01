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






var AssignedSchema = new Schema(
  {
    title : {
      type: String,
      required: true,
      unique: false,
    },
    assinged_to: [ProfessionalInfo],
    speciality: {
      type: Object,
      required: false,
      unique: false,
    },
    amount:{
      type: String,
      required: false,
      unique: false,
    },
    
    assign_service: { 
      type: Array,
      required: true,
      unique: false,
    },
    description: {
      type: String,
      required: false,
      unique: false,
    },
    attachments: {
      type: Array,
      required: false,
      unique: false,
    },
    house_id: {
      type: String,
      required: true,
      unique: false,
    },
    archived: {
      type: Boolean,
      required: false,
      unique: false,
    },
    comments: {
      type: Array,
      required: false,
      unique: false,
    },
    created_at: {
      type: String,
      required: false,
      unique: false,
    },
    status: {
      type: String,
      required: true,
      unique: false,
    },
    patient: ProfessionalInfo,
    priority: {
      type: Number,
      required: false,
      unique: false,
    },
    patient_id: {
      type: String,
      required: false,
      unique: false,
    },
    case_id: {
      type: String,
      required: false,
      unique: false,
    },
    due_on: {
      type: Object,
    },
    is_decline: { 
      type: Boolean,
      required: false,
      unique: false,
    },

    service_type: { 
      type: String,
      required: false,
      unique: false,
    },

    date:{ 
      type: Date,
      required: false,
      unique: false,
    },
    due_on: {
      type: Object,
    },
  },
  { strict: false }
);

AssignedSchema.plugin(mongooseFieldEncryption, {

    fields: ["assign_service", "description","service_type","house_id","status",
"priority","patient_id","case_id","done_on","created_at","place_of_birth"
], secret: process.env.SOME_32BYTE_BASE64_STRING,

    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});
var assigned_Service = mongoose.model("Assigned_Service",AssignedSchema );
module.exports = assigned_Service;
