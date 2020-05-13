var mongoose = require('mongoose');
var Schema   = mongoose.Schema
 
var doctorAppointment = new Schema({
    doctor_id : {
        type : String,
        required : false
    },
    type : {
        type : String,
        required : false
    },
    monday_start : {
        type : String,
        required : false
    },
    monday_end :{
        type :String,
        required : false
    },
    tuesday_start :{
        type :String,
        required :false
    },
    tuesday_end :{
        type :String,
        required:false
    },
    wednesday_start :{
        type :String,
        required :false
    },
    wednesday_end :{
        type :String,
        required :false
    },
    thursday_start :{
        type :String,
        required :false
    },
    thursday_end :{
        type :String,
        required :false
    },
    friday_start :{
        type :String,
        required :false
    },
    friday_end :{
        type : String,
        required :false
    },
    saturday_start :{
        type : String,
        required :false
    },
    saturday_end :{
        type :String,
        required :false
    },
    sunday_start :{
        type : String,
        required :false
    },
    sunday_end :{
        type :String,
        required :false
    },
    appointment_days :{
        type : String,
        required :false
    },
    appointment_hours :{
        type :String,
        required :false
    },
    breakslot_start :{
        type :String,
        required :false
    },
    breakslot_end :{
        type :String,
        required :false
    },
    duration_of_timeslots :{
        type :String,
        required :false
    },
    custom_text :{
        type :String,
        required :false
    }
})

var DoctorAppointment = mongoose.model('DoctorAppointment', doctorAppointment);
module.exports        = DoctorAppointment;

