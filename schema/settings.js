var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var SettingSchema = new Schema({
    user_id:{
        type: String,
        required: true,
        unique: false
    },
    user_profile_id:{
      type: String,
      required: false,
      unique: true
    },
    date_format: {
       type: String,
       required: false,
       unique: false
    },
    time_format: {
       type: String,
       required: false,
       unique: false
    },
    mode: {
       type: String,
       required: false,
       unique: false
    },
    language: {
       type: String,
       required: false,
       unique: false
    }
},
{ strict: false },
);

var Setting = mongoose.model('Setting', SettingSchema);
module.exports = Setting;
 