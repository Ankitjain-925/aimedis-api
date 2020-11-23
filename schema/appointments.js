var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentsSchema = new Schema({
    patient:{
        type:String,
        required:false,
        unique:false
    },
    doctor_id:{
        type:String,
        required:false,
        unique:false
    },
    appointment_type : {
        type:String,
        required:false,
        unique:false
    },
    date:{
        type:Date,
        required:false,
        unique:false
    },
    start_time:{
        type:String,
        required:false,
        unique:false
    },
    end_time:{
        type:String,
        required:false,
        unique:false
    },
    insurance:{
        type:String,
        required:false,
        unique:false
    },
    insurance_number:{
        type:String,
        required:false,
        unique:false
    },
    status:{
        type:String,
        required:false,
        unique:false
    },
    annotations:{
        type:String,
        required:false,
        unique:false
    },
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    patient_info :{}
},{ strict: false });

var Appointments = mongoose.model('Appointments', appointmentsSchema);

module.exports = Appointments;
