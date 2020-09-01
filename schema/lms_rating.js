var mongoose= require("mongoose");
var Schema= mongoose.Schema;

var ratingSchema= new Schema({
    courseID:{
        type: String,
        required: false,
        unique: false
    },
    user_id:{
        type: String,
        required: false,
        unique:false
    },
    user_profile_id:{
        type: String,
        required: false,
        unique: false
    },
    rating:{
        type: Number,
        required: false,
        unique: false
    },
    short_message:{
        type: String,
        required: false,
        unique:false
    },
    addedDate :{
        type: String,
        required: false,
        unique:false
    }
},{ strict: false }) 

module.exports = mongoose.model('Rating', ratingSchema); 