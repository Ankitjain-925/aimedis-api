var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sickCertificateSchema = new Schema({
    patient_id : {
        type:String,
        required:false,
        unique:false
    },
    doctor_id : {
        type:String,
        required:false,
        unique:false
    },
    doctor_type : {
        type:String,
        required:false,
        unique:false
    },
    status : {
        type:String,
        required:false,
        unique:false
    },
    country : {
        type:String,
        required:false,
        unique:false
    },
    how_are_you : {
        type:String,
        required:false,
        unique:false
    },
    fever : {
        type:String,
        required:false,
        unique:false
    },
    which_symptomps : {
        type:String,
        required:false,
        unique:false
    },
    since_when : {
        type:String,
        required:false,
        unique:false
    },
    which_symptomp_first : {
        type:String,
        required:false,
        unique:false
    },
    time_unable_work : {
        type:String,
        required:false,
        unique:false
    },
    same_problem_before : {
        type:String,
        required:false,
        unique:false
    },
    known_diseases : {
        type:String,
        required:false,
        unique:false
    },
    medication : {
        type:String,
        required:false,
        unique:false
    },
    allergies : {
        type:String,
        required:false,
        unique:false
    },
    professions : {
        type:String,
        required:false,
        unique:false
    },
    annotations : {
        type:String,
        required:false,
        unique:false
    },
    first_name : {
        type:String,
        required:false,
        unique:false
    },

    last_name : {
        type:String,
        required:false,
        unique:false
    },

    birthday : {
        type:String,
        required:false,
        unique:false
    },
    profile_image : {
        type:String,
        required:false,
        unique:false
    },
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    docs:{
        type:Object,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    }
});

var Sick_certificate = mongoose.model('Sick_certificate', sickCertificateSchema);

module.exports = Sick_certificate;
