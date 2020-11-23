var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var second_optionschema = new Schema({
    patient_id:{
        type:String,
        required:false,
        unique:false
    },
    patient_email : {
        type:String,
        required:false,
        unique:false
    },
    doctor_id : {
        type:String,
        required:false,
        unique:false
    },
    patient_profile_id: {
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
    user_id:{
        type:String,
        required:false,
        unique:false
    },
    specialist:{
        type:String,
        required:false,
        unique:false
    },
    online_offline:{
        type:String,
        required:false,
        unique:false
    },
    speciality:{
        type:String,
        required:false,
        unique:false
    },
    how_are_you:{
        type:String,
        required:false,
        unique:false
    },
    know_diseases:{
        type:String,
        required:false,
        unique:false
    },
    medication:{
        type:String,
        required:false,
        unique:false
    },
    allergies:{
        type:String,
        required:false,
        unique:false
    },
    professions:{
        type:String,
        required:false,
        unique:false
    },
    details:{
        type:String,
        required:false,
        unique:false
    },
    documents:{
        type:Array,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    },
    status : {
        type:String,
        required:false,
        unique:false
    },
}, { strict: false });

var Second_option = mongoose.model('Second_option', second_optionschema);

module.exports = Second_option;
