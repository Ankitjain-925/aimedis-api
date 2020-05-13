var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var Institutes = new Schema({
   institute_name:{
        type: String,
        required: false,
        unique: false
   },
   created_by: {
       type: String,
       required: false,
       unique: false
   }
});

var Institute = mongoose.model('Institute', Institutes);
module.exports = Institute;
