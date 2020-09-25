var express = require('express');
var router = express.Router();
const multer = require("multer");
var user = require('../schema/user');
var kyc = require('../schema/kyc');
var Appointment = require('../schema/appointments')
var jwtconfig = require('../jwttoken');
const uuidv1 = require('uuid/v1');
const {join} = require('path');
const moment = require('moment');
const {promisify} = require('util');
const read = promisify(require('fs').readFile);
const handlebars = require('handlebars');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host : "vwp3097.webpack.hosteurope.de",
    port : 25,
    secure: false,
    auth:{
        user: "wp1052892-aimedis00102",
        pass: "DyNaMiTe=2008"
    }
});


var trackrecord1 = [];
var track2 = [];

//var paths= "http:/localhost:5000/uploads/Trackrecord"
 var paths= "https://aimedis1.com/public/uploads/Trackrecord"
var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/Trackrecord')
        },
        filename: function (req, file, cb) {
            console.log('filesss', file),
                cb(null, Date.now() + '-' + file.originalname)
        }

    })

var storage1 = multer.diskStorage(
{
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/KYC')
    },
    filename: function (req, file, cb) {
        console.log('filesss', file),
            cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single("UploadTrackImage");
var upload1 = multer({ storage: storage }).array("UploadTrackImageMulti", 5);
var upload2 = multer({ storage: storage1 }).single("Uploadkyc");

//Temprary for add the User
// router.post('/AddUser', function (req, res, next) {
//     console.log('second file');
//     var data = req.body;
//     var users = new user(data);
//     users.save(function (err, AddUser) {
//         if (err) return next(err);
//         res.json({ status: 200, hassuccessed: true, msg: 'User is created' });
//     });
// });
router.get('/getKyc/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        kyc.findOne({ user_id: req.params.UserId },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    console.log('dsdfsdf', doc)
                    if(doc)
                    {
                        var data= true;
                    }
                    else 
                    {
                        var data = false;
                    }
                    res.json({ status: 200, hassuccessed: true, msg: 'Data is fetched', data: data, fulldata: doc })
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/updateKyc/:KYCId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    console.log('data', req.body)
    if (legit) {
        kyc.updateOne({ _id : req.params.KYCId}, { $set : req.body}, {new: true}, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 450, hassuccessed: false, message: 'Something went wrong' ,error : err})
            }else{
                res.json({ status: 450, hassuccessed: true, message: 'KYC is updated'}) 
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/getAllKyc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        kyc.find(
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    res.json({ status: 200, hassuccessed: true, msg: 'Data is fetched', data: doc })
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/Uploadkyc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload2(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Please upload images less than 6', error: err })
            } else if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            }
            else {
                var file_entry = { filename: res.req.file.filename, filetype: req.file.mimetype, url: res.req.file.destination + '/' + res.req.file.filename }
                res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/Addkyc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var data = req.body;
        var kycs = new kyc(data);
        kycs.save(function (err, AddUser) {
            if (err) return next(err);
            res.json({ status: 200, hassuccessed: true, msg: 'KYC is added' });
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/Get_patient_gender/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        user.findOne({ _id: req.params.UserId },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    if(doc && doc.sex)
                    {
                        var gender= doc.sex;
                    }
                    else 
                    {
                        var gender = false;
                    }
                    res.json({ status: 200, hassuccessed: true, msg: 'Data iis fetched', data: gender })
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Edit track records
router.put('/AddTrack/:UserId/:TrackId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // var track_id = {track_id : req.params.TrackId}
        var data = req.body.data
        user.findOneAndUpdate(
            {
                '_id': req.params.UserId,
                'track_record.track_id': req.params.TrackId
            },
            {
                $set: {
                    'track_record.$': data
                }
            },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    if (doc.nModified == '0') {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found' })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Add the track record

router.put('/AddTrack/:UserId', function (req, res, next) {
    console.log('req.body', req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var ids = { track_id: uuidv1() };
        var full_record = { ...ids, ...req.body.data }
        user.updateOne({ _id: req.params.UserId },
            { $push: { track_record: full_record } },
            { safe: true, upsert: true },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    if (doc.nModified == '0') {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found' })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//remove track record
router.delete('/AddTrack/:UserId/:TrackId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        user.updateOne({ _id: req.params.UserId },
            { $pull: { track_record: { track_id: req.params.TrackId } } },
            { multi: true },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    console.log('doc', doc);
                    if (doc.nModified == '0') {
                        res.json({ status: 200, hassuccessed: false, msg: 'Track record is not found' })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: true, msg: 'track is deleted' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});


//for upload the image 
router.post('/AddTrack/TrackUploadImage', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    console.log('req.params.TrackId', req.params.TrackId)
    if (legit) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Please upload images less than 6', error: err })
            } else if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            }
            else {
                var file_entry = [{ filename: res.req.file.filename, filetype: req.file.mimetype, url: res.req.file.destination + '/' + res.req.file.filename }]
                res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/AddTrack/TrackUploadImageMulti', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    console.log('req.params.TrackId', req.params.TrackId)
    if (legit) {
        upload1(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Please upload images less than 6', error: err })
            } else if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            }
            else {
                var file_entry = [];
                res.req.files.forEach((item, index) => {
                    file_entry.push({ filename: item.filename, filetype: item.mimetype, url: item.destination + '/' + item.filename })
                })
                res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/AppointOfDate/:date', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        console.log('Params', req.params.date )
        Appointment.find({ doctor_id: legit.id, date: req.params.date }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});
router.get('/AppointmentByDate', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Appointment.aggregate(
            [
                { 
                    $match: {
                        doctor_id : legit.id,
                        status: 'accept'
                    }
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 },
                       
                    }
                }
            ],
            function(err,results) {
                if (err) { res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else{ res.json({ status: 200, hassuccessed: true, data:  results}) };
            }
        )
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/appointment', function (req, res) {
    var Appointments = new Appointment(req.body);
    Appointments.save(function (err, user_data) {
        if (err && !user_data) {
            res.json({ status: 200, message: 'Something went wrong.', error: err });
        } else {
            if (req.body.lan === 'de') {
                var dhtml = 'Sie haben am   DATE'+ req.body.date + 'um TIME '+req.body.start_time+' einen Termin bei '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' ONLINE/OFFLINE vereinbart. .<br/>'+ 
                'Sollten Sie den Termin nicht wahrnehmen können, sagen Sie den Termin bitte spätestens 24 Stunden vor Terminbeginn ab. <br/>'+
                'Kontaktieren Sie bei Fragen Ihren behandelnden Arzt unter PRACTICE PHONE NUMBER. <br/>'+
                'Alternativ können Sie uns unter contact@aimedis.com oder WhatApp kontaktieren, falls Sie Schwierigkeiten haben, mit Ihrem Arzt in Kontakt zu treten. '+
            
                '<b>Ihr Aimedis Team </b>'
            
            }
            else {
                var dhtml = 'You have got an ONLINE / OFFLINE appointment with'+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' on DATE '+req.body.date +' at TIME'+ req.body.start_time+'.<br/>'+ 
                'If you cannot take the appointment, please cancel the appointment at least 24 hours before it begins. <br/>'+
                'If you have any questions, contact your doctor via PRACTICE PHONE NUMBER.<br/>'+
                'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/>'+
                
                '<b>Your Aimedis team </b>'
            
            }
            if (req.body.lan === 'de') {
            
                var dhtml2 = ' Sie haben für den  DATE'+ req.body.date + 'um TIME '+req.body.start_time+' einen Termin bei '+req.body.patient_info.patient_id+'ONLINE/OFFLINE vereinbart. .<br/>'+ 
                'Bitte bestätigen Sie den Termin innerhalb des Systems. <br/>'+
                'Sollten Sie Rückfragen an den Patienten haben, schreiben Sie ihm bitte eine E-Mail an'+req.body.patient_info.email+'. <br/>'+
                'Alternativ können Sie uns unter contact@aimedis.com oder WhatApp kontaktieren, falls Sie Schwierigkeiten haben, mit Ihrem Arzt in Kontakt zu treten.<br/> '+
            
                '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 ='You have got an ONLINE / OFFLINE appointment with'+ req.body.patient_info.patient_id+' on DATE '+req.body.date +' at TIME'+ req.body.start_time+'.<br/>'+ 
                'Please accept the appointment inside the system.<br/>'+ 
                'If you have any questions, contact the patient via '+req.body.patient_info.email+'.<br/>'+ 
                'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/>'+
                
                '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to:req.body.patient_info.email ,
                subject: 'Appointment Request',
                html: dhtml
            };
            var mailOptions2 = {
                from: "contact@aimedis.com",
                to: req.body.docProfile.email,
                subject: 'Appointment Request',
                html: dhtml2
            };
            var sendmail = transporter.sendMail(mailOptions)
            var sendmail2 = transporter.sendMail(mailOptions2)
            res.json({ status: 200, message: 'Added Successfully', hassuccessed: true, data: user_data });
        }
    })
})
//for emergency access by doctor
router.get('/getUser/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        user.findOne({ $or :  [{profile_id: req.params.UserId },{alies_id :req.params.UserId  }]},
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    if(doc == null || doc =='undefined' )
                    {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not exist' })
                      
                    }
                    else
                    {
                        // if (doc.family_doc.includes(legit.id)) {
                        //     res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id : doc._id  })
                        // }
                        // else {
                        if(req.query.comefrom && req.query.comefrom === 'healthdata')
                        {
                            if (req.query.pin && req.query.pin!=='undefined') {
                                console.log('here comes')
                                if (req.query.pin == doc.pin) {
                                    res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id : doc._id  })
                                }
                                else {
                                    res.json({ status: 200, hassuccessed: false, msg: 'Pin is not Correct' })
                                }
                            }
                            else {
                                res.json({ status: 200, hassuccessed: false, msg: 'Please Enter the Pin' })
                            }
                         }
                         else
                         {
                            res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id : doc._id  })
                         }
                        
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});
//Get the track record
router.get('/AddTrack/:UserId', function (req, res, next) {
    trackrecord1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        if (req.params.UserId === legit.id) {
            user.find({ _id: req.params.UserId },
                function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                    } else {
                        if(doc && doc.length>0)
                        {
                            doc[0].track_record.sort(mySorter);
                            if (doc[0].track_record.length > 0) {
    
                                forEachPromise(doc[0].track_record, getAlltrack)
                                    .then((result) => {
                                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: trackrecord1 })
                                    })
    
                            }
                            else {
                                res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                            }  
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                        }  
                   
                    }
                })
        }
        else {
            user.find({ _id: req.params.UserId },
                function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                    } else {
                        if(doc && doc.length>0)
                        {
                            // if (doc && doc[0] && doc[0].Rigt_management &&  doc[0].Rigt_management.length>0) {
                            //     if(doc.Rigt_management[0] && doc.Rigt_management[0].emergency_access === 'yes')
                            //     {
                                   
                                    var finaloutput = [];
                                    doc[0].track_record.sort(mySorter);
                                    if (doc[0].track_record.length > 0) {
                                        if (doc[0].track_record.length > 0) {
                                            forEachPromises(doc[0].track_record, doc[0].Rigt_management[0], getAlltrack1)
                                                .then((result) => {
                                                    res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: trackrecord1 })
                                                })
                                        }
                                    }
                                    else {
                                        res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                                    }
                            //     }
                            //     else
                            //     {
                            //         res.json({ status: 200, hassuccessed: false, msg: 'No authority access to get inforamtion' })
                            //     }
                            // } 
                            // else 
                            // {
                            //     res.json({ status: 200, hassuccessed: false, msg: 'No authority access to get inforamtion' })
                            // }     
                    }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                        }
                    }
                });
        }
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});
router.get('/ArchivedTrack/:UserId', function (req, res, next) {
    track2 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    user.find({ _id: req.params.UserId },
        function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
            } else {
                if(doc && doc.length>0)
                {
                    doc[0].track_record.sort(mySorter);
                    if (doc[0].track_record.length > 0) {

                        forEachPromise(doc[0].track_record, getAlltrack2)
                            .then((result) => {
                                res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: track2 })
                            })

                    }
                    else {
                        res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                    }  
                }
                else {
                    res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                }  
            
            }
        })
        
        
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}

function forEachPromises(items, right_management,fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item, right_management);
        });
    }, Promise.resolve());
}

function getAlltrack(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            user.findOne({_id: data.created_by}).exec()
            .then(function(doc3){
                var new_data = data;
                if (doc3.last_name) {
                    var created_by = doc3.first_name + ' ' + doc3.last_name + ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )'; 
                }
                else {
                    var created_by = doc3.first_name + ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )';
                }
                new_data.created_by_temp = created_by;
                new_data.created_by_temp2 = created_by.substring(0,7) +'... ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )'
                return new_data;
             
            }).then(function(new_data){
                if(data.review_by)
                {
                     user.findOne({_id: data.review_by}).exec()
                    .then(function(doc5){
                        var new_data = data;
                        if (doc5.last_name) {
                            var reviewed_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var reviewed_by = doc5.first_name;
                        }
                        new_data.review_by_temp = reviewed_by;
                        return new_data;
                    
                    })
                }
                if(data.emergency_by)
                {
                    user.findOne({_id: data.emergency_by}).exec()
                    .then(function(doc5){
                        console.log('ttttt112',doc5);
                        var new_data = data;
                        if (doc5.last_name) {
                            var emergency1_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var emergency1_by = doc5.first_name;
                        }
                        new_data.emergency_by_temp = emergency1_by;
                        return new_data;
                    })
                    
                } 
                if(!data.archive)
                {
                    trackrecord1.push(new_data);
                }
                
                resolve(trackrecord1);
            })
        });
    });
}

function getAlltrack2(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            user.findOne({_id: data.created_by}).exec()
            .then(function(doc3){
                var new_data = data;
                if (doc3.last_name) {
                    var created_by = doc3.first_name + ' ' + doc3.last_name + ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )';
                }
                else {
                    var created_by = doc3.first_name + ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )';
                }
                new_data.created_by_temp = created_by;
                new_data.created_by_temp2 = created_by.substring(0,7) +'... ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )'
                return new_data;
             
            }).then(function(new_data){
                if(data.review_by)
                {
                     user.findOne({_id: data.review_by}).exec()
                    .then(function(doc5){
                        var new_data = data;
                        if (doc5.last_name) {
                            var reviewed_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var reviewed_by = doc5.first_name;
                        }
                        new_data.review_by_temp = reviewed_by;
                        return new_data;
                    
                    })
                }
                if(data.emergency_by)
                {
                    user.findOne({_id: data.emergency_by}).exec()
                    .then(function(doc5){
                        console.log('ttttt112',doc5);
                        var new_data = data;
                        if (doc5.last_name) {
                            var emergency1_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var emergency1_by = doc5.first_name;
                        }
                        new_data.emergency_by_temp = emergency1_by;
                        return new_data;
                    })
                    
                } 
                if(data.archive)
                {
                    track2.push(new_data);
                }
                
                resolve(track2);
            })
        });
    });
}

function getAlltrack1(data, right_management) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            console.log('right_management', right_management)
            user.findOne({_id: data.created_by}).exec()
            .then(function(doc3){
                var new_data = data;
                if (doc3.last_name) {
                    var created_by = doc3.first_name + ' ' + doc3.last_name+ ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )';
                }
                else {
                    var created_by = doc3.first_name+ ' ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )';
                }
                new_data.created_by_temp = created_by;
                new_data.created_by_temp2 = created_by.substring(0,7) +'... ( '+doc3.type.charAt(0).toUpperCase() + doc3.type.slice(1) +' )'
                return new_data;
             
            }).then(function(new_data){
                if(data.review_by)
                {
                     user.findOne({_id: data.review_by}).exec()
                    .then(function(doc5){
                        var new_data = data;
                        if (doc5.last_name) {
                            var reviewed_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var reviewed_by = doc5.first_name;
                        }
                        new_data.review_by_temp = reviewed_by;
                        return new_data;
                    
                    })
                }
                if(data.emergency_by)
                {
                    user.findOne({_id: data.emergency_by}).exec()
                    .then(function(doc5){
                        var new_data = data;
                        if (doc5.last_name) {
                            var emergency1_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var emergency1_by = doc5.first_name;
                        }
                        new_data.emergency_by_temp = emergency1_by;
                        return new_data;
                    })
                    
                } 
                if (!new_data.public || new_data.public == '') {
                    if(!data.archive)
                    { 
                        if(right_management && right_management.opt && right_management.opt==='in')
                        {
                            if(right_management.opt_set && right_management.opt_set==='until')
                            {
                                var d1 = new Date();
                                var d2 = new Date(right_management.opt_until);
                                if (d1.getTime() >= d2.getTime()) {
                                    trackrecord1.push(new_data);    
                                }
                            } 
                        }
                        else if(right_management && right_management.opt && right_management.opt==='out')
                        {
                            if(right_management.opt_set && right_management.opt_set==='until')
                            {
                                var d1 = new Date();
                                var d2 = new Date(right_management.opt_until);
                                if (d1.getTime() <= d2.getTime()) {
                                    trackrecord1.push(new_data);    
                                }
                            } 
                            else
                            {
                                trackrecord1.push(new_data); 
                            }
                        }
                        else
                        {}
                    }
                 }
                else if (new_data.visible== 'show' && new_data.public == 'always') {
                     trackrecord1.push(new_data);
                }
                else {
                    var d1 = new Date();
                    var d2 = new Date(new_data.public);
                    console.log('item.public', new_data.public);
                    // if (d1.getTime() <= d2.getTime()) {
                    //     trackrecord1.push(new_data);
                    // }
                    if(new_data.visible == 'show')
                    {
                        if (d1.getTime() <= d2.getTime()) {
                            if(!data.archive)
                            {
                                trackrecord1.push(new_data);
                            }
                        }
                    }
                    else
                    {
                        if (d1.getTime() >= d2.getTime()) {
                            if(!data.archive)
                            {
                                trackrecord1.push(new_data);
                            }
                        }
                    }
                }
                resolve(trackrecord1);
            })
        });
    });
}

router.post('/DowloadTrack/:Patientid', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        user.findOne({ '_id': req.params.Patientid, type: 'patient' }, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
            }
            else {
            }
        })      
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

//for second opinion mailss
router.post('/mailenglish',function (req,res,next){
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
      console.log(legit);
        var html = 'Dear Mr./Mrs.'+legit.name+'<br/>'+
        'you sent a second opinion request with <b>the following information:<br/><br/>'+
        'Selected specialist:</b>   '+ req.body.specialist+'<br/>'+
        '<b>Way of transfer:</b>   '+req.body.online_offline+'<br/>'+
        '<b>Selected specialty:</b>   '+req.body.speciality+'<br/>'+
        '<b>How are you?:</b>   '+req.body.how_are_you+'<br/>'+
        '<b>Knows diseases:    '+req.body.know_diseases+'</b><br/>'+
        '<b>Medication:   '+req.body.medication+'</b><br/>'+
        '<b>Allergies:   '+req.body.allergies+'</b><br/>'+
        '<b>Profession:   '+req.body.professions+'</b><br/>'+
        '<b>Uploaded files:   attached to this mail</b><br/>'+
        '<b>Detailed questions:   '+req.body.details+'</b><br/><br/>'+
        'We will get back to you as soon as possible. Prof. Barker might be willing to arrange a videocall with you. He will contact you via your Aimedis mail system and email if this is the case.'+
        'Before the second opinion is processed, we will send you an estimate of costs, that has to be paid via bank wire, via credit card or via cryptocurrencies such as Bitcoin (BTC), Ethereum (ETH) or the Aimedis token (AIM) (AIM will give you a 10% discount compared to all other payment methods.'+
        'Please contact us to learn more about buying and spending AIM tokens. Optionally you can send us an assumption of costs by your health insurance company.<br/><br/>'+
        'Thanks for your trust.<br/>'+
        'Kind regards<br/>'+
        'Your Aimedis Second Opinion Team<br/><br/>'+
        
        '<b>Aimedis B.V.</b><br/>'+
        'Sint Michaëlstraat 4<br/>'+
        '5935 BL Steyl<br/>'+ 
        'Netherlands<br/>'+
        'secondopinion@aimedis.com<br/>'+
        '+31 (0) 20 262 29 02<br/><br/><br/><br/>'+
        '<hr/><br/><I>Aimedis B.V. Netherlands<br/>'+
        'Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO<br/>'+
        'VAT No.: NL858194478B01<br/>'+
        '<hr/><br/>'+
        'The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and / or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message or their agent, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message and any attachments. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.'+ 
        '</I><hr/>';
        console.log('data', req.body);
        if(req.body.filename)
        {
            var mailOptions = {
                from    : 'ankita.webnexus@gmail.com',
                to      : 'aakash.webnexus@gmail.com',
                subject : 'Aimedis Second Opinion',
                html    : html,
                attachments: [
                    {
                    filename: req.body.filename,
                    path:  './public/uploads/'+ req.body.filename,
                    cid: 'uniq-'+ req.body.filename,
                    }
                ]
                      
            };
        }
        else
        {
            var mailOptions = {
                from    : 'ankita.webnexus@gmail.com',
                to      : 'aakash.webnexus@gmail.com',
                subject : 'Aimedis Second Opinion',
                html    : html    
            }
        }
       
        // var sendmail = transporter.sendMail(mailOptions);
        // var sendmail1 = sendmailteam(req.body, legit);
        if(sendmail && sendmail1)
        {
            res.json({ status: 200, hassuccessed: true, msg: 'mail is sent' })
        }
        else
        {
            res.json({ status: 200, hassuccessed: true, msg: 'something went wrong' })
        }
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }

})

router.post('/mailgerman',function (req,res,next){
    console.log(__dirname);
    // const token = (req.headers.token)
    // let legit = jwtconfig.verify(token)
    // if (legit) {
        // var mailOptions = {
        //     from    : 'ankita.webnexus@gmail.com',
        //     to      : 'ankita.webnexus@gmail.com, aakash.webnexus@gmail.com',
        //     subject : 'Aimedis zweite Meinung',
        //     html    : '<div>Demo for second opinion mail</div>',
        //     attachments: [
        //         {

        //           filename: req.body.filename,
        //           path:  __dirname + '/'+ req.body.filename,
        //           cid: 'uniq-mailtrap.png' 
        //         }
        //       ]
        // };
        // var sendmail = transporter.sendMail(mailOptions)
        // if(sendmail)
        // {
        //     res.json({ status: 200, hassuccessed: true, msg: 'mail is sent' })
        // }
        // else
        // {
        //     res.json({ status: 200, hassuccessed: true, msg: 'something went wrong' })
        // }
    // }
    // else {
    //     res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    // }
})

function sendmailteam(data, legit){

    var html = 'Dear Aimedis Second Opinion team,<br/>'+
    'Mr./Mrs. '+legit.name+' Patient ID '+legit.id+', sent a second opinion request with <b>the following information:<br/><br/>'+
    'Selected specialist:</b>   '+ data.specialist+'<br/>'+
    '<b>Way of transfer:</b>   '+data.online_offline+'<br/>'+
    '<b>Selected specialty:</b>   '+data.speciality+'<br/>'+
    '<b>How are you?:</b>   '+data.how_are_you+'<br/>'+
    '<b>Knows diseases:    '+data.know_diseases+'</b><br/>'+
    '<b>Medication:   '+data.medication+'</b><br/>'+
    '<b>Allergies:   '+data.allergies+'</b><br/>'+
    '<b>Profession:   '+data.professions+'</b><br/>'+
    '<b>Uploaded files:   attached to this mail</b><br/>'+
    '<b>Detailed questions:   '+data.details+'</b><br/><br/>'+
    'Help now! <br/><br/>'+
    
    '<b>Aimedis B.V.</b><br/>'+
    'Sint Michaëlstraat 4<br/>'+
    '5935 BL Steyl<br/>'+ 
    'Netherlands<br/>'+
    'secondopinion@aimedis.com<br/>'+
    '+31 (0) 20 262 29 02<br/><br/><br/><br/>'+
    '<hr/><br/><I>Aimedis B.V. Netherlands<br/>'+
    'Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO<br/>'+
    'VAT No.: NL858194478B01<br/>'+
    '<hr/><br/>'+
    'The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and / or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message or their agent, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message and any attachments. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited.'+ 
    '</I><hr/>';

    console.log('data2', data)
    if(data.filename)
    {
        var mailOptions = {
            from    : 'ankita.webnexus@gmail.com',
            to      : 'aakash.webnexus@gmail.com',
            subject : 'Aimedis Second Opinion',
            html    : html,
            attachments: [
                {
                filename: data.filename,
                path:  './public/uploads/'+ data.filename,
                cid: 'uniq-'+ data.filename,
                }
            ]
                  
        };
    }
    else
    {
        var mailOptions = {
            from    : 'ankita.webnexus@gmail.com',
            to      : 'aakash.webnexus@gmail.com',
            subject : 'Aimedis Second Opinion',
            html    : html       
        }
    }
   
    // var sendmail = transporter.sendMail(mailOptions);
    if(sendmail)
    {
        return true;
    }
    else
    {
        return false;
    }
}

function mySorter(a, b) {
    var x = a.datetime_on.toLowerCase();
    var y = b.datetime_on.toLowerCase();
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

module.exports = router;