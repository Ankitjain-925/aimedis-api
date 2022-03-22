require('dotenv').config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

var pictureevaluation = new Schema({
    patient_id:{
        type: Object,
        required: false,
        unique: false
    },
    assingned_to :{
        type: String,
        required: false,
        unique: false
    },
    hospitaladmin_id:{
        type: String,
        required: false,
        unique: false
    },
    Age: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: false,
    },
    bloodpressure: {
        type: Object,
        required: false,
        unique: false
    },
    diabetes: {
        type: Boolean,
        required: false,
        unique: false
    },
    smoking_status: {
        type: Boolean,
        required: false,
        unique: false
    },
    allergies: {
        type: String,
        required: false,
        unique: false
    },
    family_history: {
        type: String,
        required: false,
        unique: false
    },
    treatment_so_far: {
        type: String,
        required: false,
        unique: false
    },
    place_of_birth: {
        type: String,
        required: false,
        unique: false
    },
    place_of_residence: {
        type: String,
        required: false,
        unique: false
    },
    race: {
        type: String,
        required: false,
        unique: false
    },
    travel_history: {
        type: String,
        required: false,
        unique: false
    },
    medical_precondition: {
        type: String,
        required: false,
        unique: false
    },
    premedication: {
        type: String,
        required: false,
        unique: false
    },
    image_evaluation: {
        type: Object,
        required: false,
        unique: false
    },
    start_date: {
        type: Date,
        required: false,
        unique: false
    },
    warm: {
        type: Boolean,
        required: false,
        unique: false
    },
    size_progress: {
        type: Boolean,
        required: false,
        unique: false
    },
    itch: {
        type: Boolean,
        required: false,
        unique: false
    },
    pain: {
        type: Boolean,
        required: false,
        unique: false
    },
    pain_level: {
        type: String,
        required: false,
        unique: false
    },
    body_temp: {
        type: String,
        required: false,
        unique: false
    },
    sun_before: {
        type: String,
        required: false,
        unique: false
    },
    cold: {
        type: String,
        required: false,
        unique: false
    },
    sexual_activities:{
        type: String,
        required: false,
        unique: false
    },
    payment_data:{
        type:Object,
        required: false,
        unique: false
    }

})


pictureevaluation.plugin(mongooseFieldEncryption, {
    fields: [""], secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});
module.exports = mongoose.model('pictureevaluation', pictureevaluation);