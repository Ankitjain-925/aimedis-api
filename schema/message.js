var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var MessageSchema = new Schema ({
    sender_id: {
        type: String,
        required: false,
        unique: false
    },
    reciever_id: {
        type: Array,
        required: false,
        unique: false
    },
    message_header: {
        type: String,
        required: false,
        unique: false
    },
    message_text: {
        type: String,
        required: true,
        unique: false
    },
    sent_date: {
        type: String,
        required: true,
        unique: false
    },
    attachment: {}
});


module.exports =  mongoose.model('message',MessageSchema);