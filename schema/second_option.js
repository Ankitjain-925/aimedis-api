var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var second_optionschema = new Schema({
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
    }
}, { strict: false });

var Second_option = mongoose.model('Second_option', second_optionschema);

module.exports = Second_option;
