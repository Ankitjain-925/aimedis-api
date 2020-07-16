var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var KYCschema = new Schema({
    user_id:{
        type: String,
        required: true,
        unique: false
    },
    country:{
      type: String,
      required: false,
      unique: false
    },
    number: {
       type: String,
       required: false,
       unique: false
    },
    authority: {
       type: String,
       required: false,
       unique: false
    },
    attachment:{
       type: Array,
       required: false,
       unique: false
    }
    
},{ strict: false });

var kyc = mongoose.model('kyc', KYCschema);
module.exports = kyc;
 