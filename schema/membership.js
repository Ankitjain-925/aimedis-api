var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var MembershipSchema = new Schema({
    user_id : {
        type : String,
        required: false,
        unique: false
    },
    user_type : {
        type: String,
        required: false,
        unique: false
    },
    period_day: {
        type: String,
        required: false,
        unique: false
    },
    is_reccuring: {
        type: String,
        required: false,
        unique: false
    },
    status: {
        type: String,
        required: false,
        unique: false
    }
});

var Membership = mongoose.model('Membership', MembershipSchema);
// make this available to our users in our Node applications
module.exports = Membership;
