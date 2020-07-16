var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var metadataSchema = new Schema({
   gender:{
        type: Array,
        required: false,
        unique: false
    },
    languages:{
        type: Array,
        required: false,
        unique: false
    },
    speciality:{
        type: Array,
        required: false,
        unique: false
    },
    subspeciality :{
        type : Array,
        required :false,
        unique : false
    },
    title_degreeData : {
        type : Array,
        required : false,
        unique : false
    }
},{ strict: false });

var Metadata = mongoose.model('Metadata', metadataSchema);
// make this available to our users in our Node applications
module.exports = Metadata;
