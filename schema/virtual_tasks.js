require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

const ProfessionalInfo = new mongoose.Schema({
    image:{
        type: String,
        required: false,
        unique: false
    },
    name:{
        type: String,
        required: false,
        unique: false
    },
    profile_id:{
        type: String,
        required: false,
        unique: false
    },
    alies_id:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false });

ProfessionalInfo.plugin(mongooseFieldEncryption, {
    fields: ["name", "image", "alies_id"],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
} });

var TaskSchema = new Schema({
    assinged_to: [ProfessionalInfo],
    task_name:{
        type: String,
        required: true,
        unique: false
    },
    description:{
      type: String,
      required: false,
      unique: false
    },
    attachments: {
        type : Array,
        required: false,
        unique: false 
    },
    house_id: {
        type: String,
        required: true,
        unique: false
    },
    archived: {
        type: Boolean,
        required: false,
        unique: false
    },
    comments:{
        type : Array,
        required: false,
        unique: false 
    },
    created_at: {
        type: String,
        required: false,
        unique: false
    },
    status:{
        type: String,
        required: true,
        unique: false
    },
    patient: ProfessionalInfo,
    priority: {
        type: Number,
        required: false,
        unique: false
    },
    patient_id: {
        type: String,
        required: false,
        unique: false
    },
    case_id:{
        type: String,
        required: false,
        unique: false
    },
    done_on:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false });

TaskSchema.plugin(mongooseFieldEncryption, { fields: [ "task_name", "description", "patient_id" ], secret: process.env.SOME_32BYTE_BASE64_STRING,
saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  } });
var virtual_Task = mongoose.model('virtual_task', TaskSchema);
module.exports = virtual_Task;