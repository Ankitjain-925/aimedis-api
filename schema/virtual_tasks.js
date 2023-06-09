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
    },
    type: {
      type: String,
      required: false,
      unique: false,
    },
    staff_id: {
      type: String,
      required: false,
      unique: false,
    },
    teammember: {
      type: Array,
      required: false,
      unique: false,
    },
    staff:{
      type: Array,
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






var TaskSchema = new Schema(
  {
    due_on: {
      type: Object,
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
    start:{
      type: String,
      required: false,
      unique: false,
    },
    end:{
      type: String,
      required: false,
      unique: false,
    },
    task_name: {
      type: String,
      required: true,
      unique: false,
    },
    approved_date:{
      type: Date,
      required: false,
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
    done_on: {
      type: String,
      required: false,
      unique: false,
    },
    bloodpressure: {
      type: Object,
      required: false,
      unique: false,
    },
    diabetes: {
      type: Object,
      required: false,
      unique: false,
    },
    smoking_status: {
      type: Object,
      required: false,
      unique: false,
    },
    allergies: {
      type: String,
      required: false,
      unique: false,
    },
    family_history: {
      type: String,
      required: false,
      unique: false,
    },
    treatment_so_far: {
      type: String,
      required: false,
      unique: false,
    },
    start:{
      type: String,
      required: false,
      unique: false,
    },
    end:{
      type: String,
      required: false,
      unique: false,
    },
    place_of_birth: {
      type: String,
      required: false,
      unique: false,
    },
    race: {
      type: String,
      required: false,
      unique: false,
    },
    travel_history: {
      type: String,
      required: false,
      unique: false,
    },
    medical_precondition: {
      type: String,
      required: false,
      unique: false,
    },
    premedication: {
      type: String,
      required: false,
      unique: false,
    },
    image_evaluation: {
      type: Object,
      required: false,
      unique: false,
    },
    start_date: {
      type: Date,
      required: false,
      unique: false,
    },
    warm: {
      type: String,
      required: false,
      unique: false,
    },
    size_progress: {
      type: String,
      required: false,
      unique: false,
    },
    itch: {
      type: String,
      required: false,
      unique: false,
    },
    pain: {
      type: String,
      required: false,
      unique: false,
    },
    pain_level: {
      type: String,
      required: false,
      unique: false,
    },
    body_temp: {
      type: String,
      required: false,
      unique: false,
    },
    sun_before: {
      type: String,
      required: false,
      unique: false,
    },
    cold: {
      type: String,
      required: false,
      unique: false,
    },
    sexual_activities: {
      type: String,
      required: false,
      unique: false,
    },
    payment_data: {
      type: Object,
      required: false,
      unique: false,
    },
    is_payment: {
      type: Boolean,
      required: false,
      unique: false,
    },
    is_decline: {
      type: Boolean,
      required: false,
      unique: false,
    },
    approved: {
      type: Boolean,
      required: false,
      unique: false,
    },
    task_type: {
      type: String,
      required: false,
      unique: false,
    },
    isviewed: {
      type: Boolean,
      required: false,
      unique: false,
    },
    meetingjoined:{
      type: Boolean,
      required: false,
      unique: false,
    },
    date:{
      type: Date,
      required: false,
      unique: false,
    },
    approved_date:{
      type: Date,
      required: false,
      unique: false,
    }
  },
  { strict: false }
);

TaskSchema.plugin(mongooseFieldEncryption, {

    fields: ["task_name", "description","task_type","sexual_activities","house_id","status","medical_precondition",
"cold","sun_before","priority","patient_id","case_id","done_on","allergies","family_history","treatment_so_far","race","travel_history",
"premedication","warm","size_progress","itch","pain","pain_level","body_temp","created_at","place_of_birth"
], secret: process.env.SOME_32BYTE_BASE64_STRING,

    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});
var virtual_Task = mongoose.model("virtual_task", TaskSchema);
module.exports = virtual_Task;
