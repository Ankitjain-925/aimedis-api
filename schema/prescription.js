var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PrescriptionSchema = new Schema({
    patient_id : {
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
    
    status : {
        type:String,
        required:false,
        unique:false
    },
    malignant_diseases : {
        type:String,
        required:false,
        unique:false
    },
    follow_up_prescription : {
        type:String,
        required:false,
        unique:false
    },
    musculosceletal_diseases : {
        type:String,
        required:false,
        unique:false
    },

    substance : {
        type:String,
        required:false,
        unique:false
    },

    eye_diseases : {
        type:String,
        required:false,
        unique:false
    },

    dose : {
        type:String,
        required:false,
        unique:false
    },

    infectious_diseases : {
        type:String,
        required:false,
        unique:false
    },

    trade_name : {
        type:String,
        required:false,
        unique:false
    },


    medication : {
        type:String,
        required:false,
        unique:false
    },

    atc_code : {
        type:String,
        required:false,
        unique:false
    },
    
    manufacturer : {
        type:String,
        required:false,
        unique:false
    },

    pack_size : {
        type:String,
        required:false,
        unique:false
    },

    allergies : {
        type:String,
        required:false,
        unique:false
    },

    pulmonary_diseases : {
        type:String,
        required:false,
        unique:false
    },

    renal_diseases : {
        type:String,
        required:false,
        unique:false
    },

    endrinologic_diseases : {
        type:String,
        required:false,
        unique:false
    },

    hypertension : {
        type:String,
        required:false,
        unique:false
    },

    diabetes : {
        type:String,
        required:false,
        unique:false
    },
    
    thyroid_diseases : {
        type:String,
        required:false,
        unique:false
    },
    
    annotations : {
        type:String,
        required:false,
        unique:false
    },
    liver_diseases : {
        type:String,
        required:false,
        unique:false
    },
    prescription_type : {
        type:String,
        required:false,
        unique:false
    },
    country : {
        type:String,
        required:false,
        unique:false
    }
    ,heart_diseases : {
        type:String,
        required:false,
        unique:false
    },
    accept_datetime: {
        type: String,
        required:false,
        unique:false
    },
    attachfile:{
        type:Array,
        required:false,
        unique:false
    },
    annotations : {
        type:String,
        required:false,
        unique:false
    }
})

var Prescription = mongoose.model('prescription',PrescriptionSchema);

module.exports = Prescription;