var mongoose= require("mongoose");
var Schema= mongoose.Schema;

var lmsSchema= new Schema({
    courseTitle:{
        type: String,
        required: false,
        unique: false
    },
    courseDesc:{
        type: String,
        required: false,
        unique:false
    },
    price:{
        type: Number,
        required: false,
        unique: false
    },
    permission:{
        type: Array,
        required: false,
        unique: false
    },
    language:{
        type: String,
        required: false,
        unique:false
    },
    topic:{
        type: Array,
        required: false,
        unique: false
    },
    isActive:{
        type: Boolean,
        required: false,
        unique: false
    },
    courseContent:[],
    teaser:{
        type: Object,
        required: false,
        unique:false
    },
    createdBy:{
        type:String,
        required: false,
        unique: false
    },
    createdAt:{
        type: String,
        required: false,
        unique: false
    },
    status:{
        type: String,
        required: false,
        unique: false
    }
},{ strict: false }) 

module.exports = mongoose.model('Lms', lmsSchema); 