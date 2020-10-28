var express = require('express');
let router = express.Router();
var nodemailer = require('nodemailer');
var User = require('../schema/user.js');


var transporter = nodemailer.createTransport({
    host : "vwp3097.webpack.hosteurope.de",
    port : 25,
    secure: false,
    auth:{
        user: "wp1052892-aimedis00102",
        pass: "JuPiTeR7=7?"
    }
});

function sendreminder(req, res)
{
    User.find({ type: "patient",  track_record: { $elemMatch: { type: 'medication' } } }, function (err, Userinfoonee) {
        if (err) {
            res.json({ status : 200, hassuccessed : false, message : 'Something went wrong' ,error : err});
        } else {
            Userinfoonee.forEach(element => {
                element.track_record.forEach(element1=>{
                    date1 = new Date();
                    date2 = new Date(element1.lastRemindersent);
                    date1.setHours(0, 0, 0, 0) 
                    date2.setHours(0, 0, 0, 0) 
                    if(element1.type === 'medication' && !element1.lifelong && element1.until && new Date(element1.until) > new Date() && date1 != date2)
                    {
                        let mailOptions = {
                            from:'contact@aimedis.com',
                            to :'ankita.webnexus@gmail.com',
                            subject: 'Reminder from the Aimedis',
                            html: '<div>This is reminder for the Medication to take medication - <b>' +element1.substance+ ' </b>and dosage <b>'+element1.dosage+'</b></div>'
                        };
                        let sendmail = transporter.sendMail(mailOptions)
                       
                        var data = element1;
                        data.lastRemindersent = new Date();
                        User.updateOne({
                                '_id': element._id,
                                'track_record.track_id': element1.track_id
                            },
                            {
                                $set: {
                                    'track_record.$': data
                                }
                            },
                            function (err, doc) {
                                if (err && !doc) {
                                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                                } 
                                else
                                {
                                    
                                }
                            }); 
                    }
                })
            })
            res.json({ status: 200, message: 'Mail sent Successfully', hassuccessed: true });
        }
    })
}


router.get('/', (req, res) => {
    sendreminder(req, res);    
});



module.exports = router;