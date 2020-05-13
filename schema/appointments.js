var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appointmentsSchema = new Schema({
    patient_id:{
        type:String,
        required:false,
        unique:false
    },
    doctor_id:{
        type:String,
        required:false,
        unique:false
    },
    name:{
        type:String,
        required:false,
        unique:false
    },
    first_name:{
        type:String,
        required:false,
        unique:false
    },
    last_name:{
        type:String,
        required:false,
        unique:false
    },
    date:{
        type:String,
        required:false,
        unique:false
    },
    time:{
        type:String,
        required:false,
        unique:false
    },
    email:{
        type:String,
        required:false,
        unique:false
    },
    birthday:{
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
    pin:{
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
    image:{
        type:String,
        required:false,
        unique:false
    }
});

var Appointments = mongoose.model('Appointments', appointmentsSchema);

module.exports = Appointments;
