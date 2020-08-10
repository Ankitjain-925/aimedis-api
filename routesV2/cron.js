var express = require('express');
let router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../schema/user.js');

var transporter = nodemailer.createTransport({
    host: "vwp3097.webpack.hosteurope.de",
    port: 25,
    secure: false,
    auth: {
        user: "wp1052892-aimedis00102",
        pass: "DyNaMiTe=2008"
    }
});

function sendreminder(req, res)
{
    User.find({ type: "patient",  track_record: { $elemMatch: { type: 'medication' } } }, function (err, Userinfoonee) {
        if (err) {
            res.json({ status : 200, hassuccessed : false, message : 'Something went wrong' ,error : err});
        } else {
            
            res.json({ status : 200, hassuccessed : true, data : Userinfoonee});
        }
    })
}


router.get('/', (req, res) => {
    sendreminder(req, res);    
});



module.exports = router;