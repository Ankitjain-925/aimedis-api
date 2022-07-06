var express = require('express');
let router = express.Router();
const multer = require("multer");
var User = require('../schema/user.js');
var Membership = require('../schema/membership.js')
var Metadata = require('../schema/metadata')
var Appointment = require('../schema/appointments')
var DoctrorAppointment = require('../schema/doctor_appointment')
var Prescription = require('../schema/prescription')
var Second_opinion = require('../schema/second_option')
var Sick_certificate = require('../schema/sick_certificate')
var jwtconfig = require('../jwttoken');
var base64 = require('base-64');
var dateTime = require('node-datetime');
var nodemailer = require('nodemailer');
var uuidv1 = require('uuid/v1');
var moment = require('moment');
var message = require('../schema/message');
const {join} = require('path');
var shortid = require('shortid');
var fs= require("fs")
var pdf = require('dynamic-html-pdf');
var html = fs.readFileSync(join(`${__dirname}/Userdata.html`), 'utf8');
//for authy
// https://github.com/seegno/authy-client
var API_KEY = 'rZ1SMhOZguUluAw1c1iFrMSdVNgxoFYK'
var SECRET = "SUPERSECRETSECRET"
var phoneReg = require('../lib/phone_verification')(API_KEY);
const Client = require('authy-client').Client;
const authy = new Client({ key: API_KEY });

var transporter = nodemailer.createTransport({
    host: "vwp3097.webpack.hosteurope.de",
    port: 25,
    secure: false,
    auth: {
        user: "wp1052892-aimedis00102",
        pass: "JuPiTeR7=7?"
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        console.log('filesss', file),
            cb(null, Date.now() + '-' + file.originalname)
    }
})

var Certificatestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/certificates')
    },
    filename: function (req, file, cb) {
        console.log('filesss', file),
            cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single("uploadImage");
var upload1 = multer({ storage: storage }).array("UploadDocument", 5);
var upload2 = multer({ storage: Certificatestorage }).single("uploadCertificate");

router.post('/uploadImage', function (req, res, next) {
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
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

router.post('/uploadCertificate', function (req, res, next) {
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload2(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
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

router.post('/sendRegisterationMail', function (req, res, next) {
    const token = (req.headers.token)
    var link = 'http://localhost:3000/';
    var mailOptions = {
        from: "contact@aimedis.com",
        to: req.body.email,
        subject: 'Aimedis Registration',
        html: '<div>You have registered sucessfully'
            + '<a href="' + link + '?token=' + token + '">click here</a> to login</div>'
            + '<div>If you have any questions, please do not hesitate to contact us via icuservices@aimedis.com.</div>'
            + '<div style="color:#ddd, font-size: 9px;">Aimedis Customer Support <br/> - Aimedis B.V. <br/> Sint Michaëlstraat 45935 BL Steyl<br/> Netherlands - <br/>Aimedis B.V. Netherlands'
            + '<br/>Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO <br/> VAT No.: NL858194478B01</div>'
    };
    var sendmail = transporter.sendMail(mailOptions)
})

//For login the user

// router.post('/UserLogin',function (req, res, next) {
//     if(req.body.email=='' || req.body.password==''){
//     res.json({status: 450,message: "Email and password fields should not be empty",hassuccessed: false})
//     }else{
//     User.findOne({
//     email: req.body.email,
//     }).exec()
//     .then((user_data) => {
//     if (user_data) {
//     if (user_data.isblock === true) {
//     res.json({status: 450,hassuccessed: false, message: "User is blocked"})
//     }else {
//     let promise = new Promise(function (resolve, reject) {
//     if( req.body.logintoken != '' && req.body.logintoken != undefined ){
//     if(req.body.logintoken == user_data.usertoken){
//     User.findOneAndUpdate({ _id : user_data._id}, { $set :{verified : 'true' }}, {new: true}, (err, doc1) => {
//     if (err && !doc1) {
//     res.json({ status: 450, hassuccessed: false, message: 'Verification Failed' ,error : err})
//     }else{
//     console.log(doc1)
//     user_data = doc1
//     }
//     });
//     }else{
//     res.json({ status: 450, hassuccessed: false, message: 'Verification Failed'})
//     }
//     }
//     setTimeout(() => resolve(), 500);
//     });
//     promise.then(() => {
//     console.log(user_data)
//     var decode = base64.encode(req.body.password);
//     if (user_data.password === decode) {
//     if(user_data.verified === 'true'){
//     let payload = {
//     email : req.body.email,
//     name : user_data.first_name + " " + user_data.last_name,
//     id : user_data._id,
//     type : user_data.type
//     }
//     var token = jwtconfig.sign(payload);
//     res.json({status: 200,message: "Succefully fetched",hassuccessed: true, user: user_data,token: token})
//     }else{
//     res.json({status: 450,message: "Your Account is not verified, please check your email account.",hassuccessed: false })
//     }
//     }else {
//     res.json({status: 450,message: "Wrong password",hassuccessed: false })
//     }
//     })
//     }
//     }
//     else {
//     console.log('Seven');
//     res.json({status: 450,message: "User does'nt exist",hassuccessed: false})
//     }
//     })
//     }
//     })

router.post('/UserLogin', function (req, res, next) {
    if (req.body.email == '' || req.body.password == '') {
        res.json({ status: 450, message: "Email and password fields should not be empty", hassuccessed: false })
    } else {
        User.findOne({
            email:  {$regex: req.body.email, $options: "i"}}).exec()
            .then((user_data) => {
                if (user_data) {
                    if (user_data.isblock === true) {
                        res.json({ status: 450, hassuccessed: false, message: "User is blocked" })
                    } else {
                        let promise = new Promise(function (resolve, reject) {
                            if (req.body.logintoken != '' && req.body.logintoken != undefined) {
                                if (req.body.logintoken == user_data.usertoken) {
                                    User.findOneAndUpdate({ _id: user_data._id }, { $set: { verified: 'true' } }, { new: true }, (err, doc1) => {
                                        if (err && !doc1) {
                                            res.json({ status: 450, hassuccessed: false, message: 'Verification Failed', error: err })
                                        } else {
                                            console.log(doc1)
                                            user_data = doc1
                                        }
                                    });
                                } else {
                                    res.json({ status: 450, hassuccessed: false, message: 'Verification Failed' })
                                }
                            }
                            setTimeout(() => resolve(), 500);
                        });
                        promise.then(() => {
                            console.log(user_data)
                            var decode = base64.encode(req.body.password);
                            if (user_data.password === decode) {
                                if (user_data.verified === 'true') {
                                    if (!user_data.is2fa || user_data.is2fa === false) {
                                        console.log('data', user_data.type)
                                        let payload = {
                                            email: user_data.email,
                                            name: user_data.first_name + " " + user_data.last_name,
                                            id: user_data._id,
                                            type: user_data.type
                                        }
                                        var token = jwtconfig.sign(payload);

                                        res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                    }
                                    else {
                                        console.log('come here one')
                                        if (user_data.authyId) {
                                            authy.requestSms({ authyId: user_data.authyId }, { force: true }, function (err, smsRes) {
                                                if (err) {
                                                    console.log('ERROR requestSms', err);
                                                    res.json({ status: 450, hassuccessed: false, message: 'request not send', error: err })

                                                }
                                            });

                                            let payload = {
                                                email: user_data.email,
                                                name: user_data.first_name + " " + user_data.last_name,
                                                id: user_data._id,
                                                type: user_data.type
                                            }
                                            var token = jwtconfig.sign(payload);

                                            res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                        }

                                        else {
                                            res.json({ status: 450, message: "Can not get Mobile number for the notification", hassuccessed: false })
                                        }
                                    }

                                } else {
                                    res.json({ status: 450, message: "Your Account is not verified, please check your email account.", hassuccessed: false })
                                }
                            } else {
                                res.json({ status: 450, message: "Wrong password", hassuccessed: false })
                            }
                        })
                    }
                }
                else {
                    console.log('Seven');
                    res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                }
            })
    }
})

router.post('/verifyLogin', function (req, res, next) {
    authy.verifyToken({ authyId: req.body.authyId, token: req.body.mob_token }, function (err, tokenRes) {
        if (err) {
            res.json({ status: 200, message: 'Something went wrong.', error: err, hassuccessed: false });
        }
        res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, tokenRes: tokenRes })
        // res.status(200).json(tokenRes);

    });

})

/*-----------------------F-O-R---A-D-D-I-N-G---U-S-E-R-Ss-------------------------*/

router.post('/AddUser', function (req, res, next) {
    if (req.body.email == '' || req.body.email == undefined || req.body.password == '' || req.body.password == undefined) {
        res.json({ status: 450, message: "Email and password fields should not be empty", hassuccessed: false })
    } else {
       
        User.findOne( {$or: [{ email: req.body.email }, {email: req.body.email.toLowerCase()}, {email: req.body.email.toUpperCase()}]}).exec().then((data1) => {
            console.log('here', data1)
            if (data1) {
                res.json({ status: 200, message: 'Email is Already exist', hassuccessed: false });
            } else {
                var ids = shortid.generate();
                console.log('dddd', req.body.lan)
                if (req.body.lan === 'de') {
                    var dhtml = '<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>' +
                        'Mit Aimedis stehen Sie immer an der Seite Ihrer Patienten. Bieten Sie online Termine und Videosprechstunden an, stellen Sie Rezepte und Arbeitsunfähigkeitsbescheinigungen aus oder bieten Sie Zweitmeinungen über die Plattform an, alles bis auf Weiteres kostenfrei.<br/>' +
                        'Sobald Sie sich als medizinische Fachkraft legitimiert haben, schalten wir Ihren Zugang frei.<br/>' +
                        'In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung.<br/>' +
                        'Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>' +
                        'Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen.<br/><br/>' +
                        '<b>Ihr Aimedis Team</b><br/>' +
                        '<b>Jetzt einloggen: </b> <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                        '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';

                    if (req.body.type == 'patient') {
                        dhtml = '<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>' +
                            'Mit Aimedis sind Sie immer auf der sicheren Seite, denn nicht nur Ihre medizinischen Daten sondern auch die Ärzte Ihres Vertrauens begleiten Sie ab sofort weltweit und 24 Stunden am Tag.<br/>' +
                            'Bei Aimedis speichern Sie und Ihre Ärzte, Therapeuten und Kliniken Ihre Daten, Sie teilen wichtige Informationen mit Ihren Behandlern und greifen jederzeit auf diese zu. Vereinbaren Sie Termine, erhalten Sie einen Krankenschein, holen Sie eine Zweitmeinung zu einer geplanten OP ein oder sprechen Sie zu jeder Tag- und Nachtzeit mit einem Arzt Ihrer Wahl.<br/>' +
                            'Dabei profitieren Sie nicht nur von höchster Datensicherheit sondern auch der Aimedis eigenen Blockchain anhand derer Sie jederzeit sicherstellen können, dass Ihre Daten nur durch Sie und einen Behandler IHRER Wahl eingesehen werden können. Ihre Daten, Ihre Entscheidung. <br/>' +
                            'In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung. <br/>' +
                            'Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>' +
                            'Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen. <br/><br/><br/>' +
                            '<b>Ihr Aimedis Team</b><br/>' +
                            '<b>Jetzt einloggen: </b>  <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                            '<b>Der Aimedis Blog:</b> <a href="https://aimedix.com">https://blog.aimedis.com</a><br/>';
                    }
                }
                else {
                    var dhtml = '<b>Welcome to Aimedis - your health platform.</b><br/>' +
                        'With Aimedis you are always at your patients’ side. Offer online appointments and video consultations, issue prescriptions and sick certificates or offer second opinions via the platform, all free of charge until further notice. <br/>' +
                        'As soon as you have legitimized yourself as a medical specialist, we will activate your access. <br/>' +
                        'In view of the current situation and problems caused by the SARS coronavirus, Aimedis provides a corresponding diary for both patients and practitioners. <br/>' +
                        'In the attachment to this email you will find the terms and conditions as well as the data protection regulations. <br/>' +
                        'You can reach us via WhatsApp or email via contact@aimedis.com.<br/><br/><br/>' +
                        '<b>Your Aimedis team</b><br/>' +
                        '<b>Log in now:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                        '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';

                    if (req.body.type == 'patient') {
                        dhtml = '<b>Welcome to Aimedis - your health platform.</b><br/>' +
                            'With Aimedis you are always on the safe side, because not only your medical data but also the doctors you trust will accompany you worldwide and 24 hours a day.<br/>' +
                            'At Aimedis you and your doctors, therapists and clinics save your data, you share important information with your healthcare professionals and access them at any time. Make appointments, get a sick certificate, get a second opinion on a planned operation or speak to a doctor of your choice at any time of the day or night.<br/>' +
                            'You benefit not only from the highest level of data security, but also from Aimedis’ own blockchain, which you can use to ensure at any time that your data can only be viewed by you and a healthcare provider of your choice. Your data, your decision.<br/>' +
                            'In view of the current situation and problems caused by the SARS coronavirus, Aimedis provides a corresponding diary for both patients and practitioners.<br/>' +
                            'In the attachment to this email you will find the terms and conditions as well as the data protection regulations.<br/>' +
                            'You can reach us via WhatsApp or email via contact@aimedis.com.<br/><br/><br/>' +
                            '<b>Your Aimedis team</b><br/><br/><br/><br/>' +
                            '<b>Log in now:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                            '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';
                    }
                }


                if (req.body.type == 'patient') {
                    var profile_id = 'P_' + ids;
                }
                else if (req.body.type == 'nurse') {
                    var profile_id = 'N_' + ids;
                }
                else if (req.body.type == 'pharmacy') {
                    var profile_id = 'PH' + ids;
                }
                else if (req.body.type == 'paramedic') {
                    var profile_id = 'PA' + ids;
                }
                else if (req.body.type == 'insurance') {
                    var profile_id = 'I_' + ids;
                }
                else if (req.body.type == 'hospitaladmin') {
                    var profile_id = 'HA' + ids;
                }
                else if (req.body.type == 'doctor') {
                    var profile_id = 'D_' + ids;
                }
                var isblock = { isblock: true }

                if (req.body.type == 'patient') {
                    isblock = { isblock: false }
                }
                var dt = dateTime.create();
                var createdate = { createdate: dt.format('Y-m-d H:M:S') }
                var createdby = { pin: '1234' }
                var enpassword = base64.encode(req.body.password);
                var usertoken = { usertoken: uuidv1() }
                var verified = { verified: 'true' }
                var profile_id = { profile_id: profile_id }
                req.body.password = enpassword;

                var user_id;
                console.log('dfdsf', req.body.country_code)
                if (req.body.country_code && req.body.mobile) {
                    authy.registerUser({
                        countryCode: req.body.country_code,
                        email: req.body.email,
                        phone: req.body.mobile
                    })
                    .catch(err => res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false })) 
                    .then(regRes=>{
                            if (regRes && regRes.success) {
                                var authyId = { authyId: regRes.user.id };
                                datas = { ...authyId, ...profile_id, ...req.body, ...isblock, ...createdate, ...createdby, ...usertoken, ...verified }
                                var users = new User(datas);
                                users.save(function (err, user_data) {
                                    if (err && !user_data) {
                                        res.json({ status: 200, message: 'Something went wrong.', error: err, hassuccessed: false });
                                    } else {
                                        user_id = user_data._id;
                                        let token = user_data.usertoken;
                                        //let link = 'http://localhost:3000/';
                                        let link = 'https://aidoc.io/';
                                        let mailOptions = {
                                            from: "contact@aimedis.com",
                                            to: req.body.email,
                                            //to      :  'navdeep.webnexus@gmail.com',
                                            subject: 'Aimedis Registration',
                                            html: dhtml
                                        };
                                        let sendmail = transporter.sendMail(mailOptions)
                                        res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: user_data });
                                    }
                                })
                            }
                            else {
                                res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false });
                            }
                            })

                }
                else {
                    res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false });
                }

            }
        });
    }
})
router.put('/Bookservice', (req, res) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var paymentData = {
      created        : moment(new Date()).format("MM/DD/YYYY"),
      description    : req.body.description,
    }
    User.updateOne({ _id: legit.id },{ $push: { paid_services: paymentData } },
      { safe: true, upsert: true },  function (err, doc) {   
        if (err && !doc) {
            res.json({ status : 200, hassuccessed : false, message : 'something went wrong' ,error : err})
            } else {
            res.json({ status : 200, hassuccessed : true, message : 'booked sucessfully',data : doc})
        }
      });
  });

/*-----------------------D-E-L-E-T-E---P-A-R-T-I-C-U-L-A-R---U-S-E-R-------------------------*/

router.delete('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findByIdAndRemove(req.params.User_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'User is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*-----------------------G-E-T---U-S-E-R-------------------------*/

router.get('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: req.params.User_id }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                if (Userinfo) {
                    Userinfo.password = base64.decode(Userinfo.password);
                    res.json({ status: 200, hassuccessed: true, data: Userinfo });
                } else {
                    res.json({ status: 200, hassuccessed: false, message: 'User not found' });
                }
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/Users/getDoc', function (req, res, next) {
    User.find({ type: doctor }, function (err, Userinfoonee) {
        if (err) {
            next(err);
        } else {
            res.json(Userinfoonee);
        }
    });
})

/*------U-P-D-A-T-E---U-S-E-R------*/

router.put('/Users/update', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
            }
            if (changeStatus) {
                var enpassword = base64.encode(req.body.password);
                req.body.password = enpassword;
                User.findByIdAndUpdate({ _id: changeStatus._id },
                    req.body,
                    function (err, doc) {
                        if (err && !doc) {
                            res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
                        } else {
                            res.json({ status: 200, hassuccessed: true, message: 'Updated' })
                        }
                    });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/Users/updateImage', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOneAndUpdate({ _id: legit.id }, { $set: { image: req.body.image } }, { new: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*------A-D-D---M-E-M-B-E-R-H-I-P------*/

router.post('/Membership', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
            }
            else {
                let user_id = { user_id: legit.id }
                let user_type = { user_type: changeStatus.type }
                datas = { ...req.body, ...user_type, ...user_id }
                var memberships = new Membership(datas);
                memberships.save(function (err, membershipData) {
                    if (err) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        User.updateOne({ _id: legit.id }, { $push: { membership: membershipData } },
                            { safe: true, upsert: true }, function (err, doc) {
                                if (err && !doc) {
                                    res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
                                } else {
                                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc })
                                }
                            });
                    }
                })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*------U-P-D-A-T-E---U-S-E-R---M-E-M-B-E-R-S-H-I-P------*/

router.put('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Membership.findByIdAndUpdate({ _id: req.params.Membership_id }, req.body, function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                // res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc })
                User.findOneAndUpdate({ _id: doc.user_id }, { $set: { membership: doc } }, { new: true }, (err, doc1) => {
                    if (err && !doc1) {
                        res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
                    } else {
                        res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
                    }
                });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------G-E-T---M-E-M-B-E-R-S-H-I-P---------*/

router.get('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Membership.findOne({ _id: req.params.Membership_id }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------D-E-L-E-T-E---M-E-M-B-E-R-S-H-I-P----------*/

router.delete('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var memId = req.params.Membership_id;
        Membership.findByIdAndRemove(req.params.Membership_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                User.updateOne({ _id: legit.id },
                    { $pull: { membership: { _id: memId } } },
                    { multi: true },
                    function (err, doc) {
                        if (err && !doc) {
                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                        } else {
                            if (doc.nModified == '0') {
                                res.json({ status: 200, hassuccessed: false, msg: ' record is not found' })
                            } else {
                                res.json({ status: 200, hassuccessed: true, msg: 'membership is deleted' })
                            }
                        }
                    });
            }
        });
    } else {
        res.status(401).json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

/*-----------M-E-T-E-D-A-T-A----------*/

router.post('/Metadata', function (req, res, next) {
    var Metadatas = new Metadata(req.body);
    Metadatas.save(function (err, user_data) {
        if (err && !user_data) {
            res.json({ status: 200, message: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: user_data });
        }
    })
})


router.put('/Metdata/:Metdata_id', function (req, res, next) {
    Metadata.findByIdAndUpdate({ _id: req.params.Metadata_id }, { $push: { speciality: req.body.speciality } },
        { safe: true, upsert: true }, function (err, updatedata) {
            if (err && !updatedata) {
                res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
            }
        })
})

router.get('/Metadata', function (req, res, next) {
    Metadata.find(function (err, Metadatas) {
        if (err) {
            next(err);
        } else {
            res.json(Metadatas);
        }
    });
})

/*---------R-I-S-K---M-A-N-A-G-E-M-E-N-T----------*/

router.put('/Rigt_management', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.findByIdAndUpdate({ _id: userdata._id }, { $set: { Rigt_management: req.body } }
                    , function (err, updatedata) {
                        if (err && !updatedata) {
                            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                        } else {
                            res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                        }
                    })
            }
        })
    }
})
/*----------O-R-G-A-N---D-O-N-O-R----------*/

router.put('/organDonor', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.findByIdAndUpdate({ _id: userdata._id }, { $set: { organ_donor: req.body } }
                    , function (err, updatedata) {
                        if (err && !updatedata) {
                            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                        } else {
                            res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                        }
                    })
            }
        })
    }
})

/*----------O-R-G-A-N---D-O-N-O-R---E-N-D-S----------*/

/*-----------R-E-G-I-S-T-R-A-T-I-O-N----------*/

router.post('/Registration', function (req, res, next) {
    var users = new User(req.body);
    var enpassword = base64.encode(req.body.password);
    req.body.password = enpassword;
    users.save(function (err, data) {
        if (err && !data) {
            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
        } else {
            res.json({ status: 200, hassuccessed: false, message: "saved successfully" })
        }
    })
})

/*----------P-R-E-S-C-C-R-I-P-T-I-O-N----------*/

router.post('/Prescription', function (req, res, next) {
    var prescriptions = new Prescription(req.body)
    prescriptions.save(function (err, data) {
        if (err && !data) {
            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
        } else {

            if (req.body.lan === 'de') {
                var dhtml = 'Sie haben ein Rezept (prescription) von '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' beantragt.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name + ' ( '+req.body.docProfile.email+' ) ' +'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>'+ 
                'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>'+ 
                '<b>Ihr Aimedis Team </b>'
            
            }
            else {
                var dhtml = 'You have requested a prescription from '+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+'.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name+ ' ( '+req.body.docProfile.email+' )' + ' will take care of the matter and contact you via email.<br/>'+ 
                'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben ein Rezept (prescription) Anfrage von '+req.body.patient_info.patient_id+' erhalten. '+ 
                'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>'+
                '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received a prescription inquiry from '+req.body.patient_info.patient_id+'<br/>'+ 
                'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to:req.body.patient_info.email ,
                subject: 'Prescription Request',
                html: dhtml
            };
            var mailOptions2 = {
                from: "contact@aimedis.com",
                to: req.body.docProfile.email,
                subject: 'Prescription Request',
                html: dhtml2
            };
            var sendmail = transporter.sendMail(mailOptions)
            var sendmail2 = transporter.sendMail(mailOptions2)

            res.json({ status: 200, hassuccessed: true, message: "success" })
        }
    })
})
// router.post('/Prescription', function (req, res, next) {
//     console.log('I am here tooo')
//     var prescription = new Prescription(req, body)
//     prescription.save(function (err, data) {
//         if (err && !data) {
//             res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
//         } else {
//             res.json({ status: 200, hasssuccessed: true, message: "no success" })
//         }
//     })
// })

router.get('/Prescription/:Prescription_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Prescription.findOne({ _id: req.params.Prescription_id }, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: data });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


router.delete('/Prescription/:Prescription_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Prescription.findByIdAndRemove(req.params.Prescription_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Prescription is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/GetPrescription', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Prescription.find({ doctor_id: legit.id, $or: [{ status: 'free' }, { status: 'pending' }] }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/GetPrescription/:Prescription_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Prescription.findOne({ _id: req.params.Prescription_id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                var dt = dateTime.create();

                if (req.body.status === "decline") {
                    var data = {
                        message_header: 'Decline Prescription request',
                        message_text: 'Dear Patient, your request is declined for Prescription by - ' + legit.name + '. Thanks Aimedis Team',
                        sent_date: new Date(),
                        sender_id: legit.id,
                        reciever_id: [userdata.patient_id]
                    }
                    var messages = new message(data);
                    messages.save(function (err, messages_data) {
                        if (err && !messages_data) {
                            console.log(err);
                        } else {
                            console.log(messages_data);
                        }
                    })
                }
                if (req.body.status === "accept" && userdata.attachfile.length == 0) {
                    req.body.status = "pending";
                }
                Prescription.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status, accept_datetime: dt.format('Y-m-d H:M:S') } }, { new: true }, function (err, updatedata) {
                    if (err && !updatedata) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        console.log('updatedata.attachfile', updatedata.attachfile);
                        if (updatedata.status == 'accept' && updatedata.attachfile.length > 0) {
                            var ids = { track_id: uuidv1() };
                            var type = { type: req.body.type };
                            var datetime_on = { datetime_on: updatedata.accept_datetime };
                            var created_by = { created_by: updatedata.doctor_id };
                            var created_by_temp = { created_by_temp: req.body.doctor_name };
                            var created_on = { created_on: dt.format('Y-m-d') };
                            var created_at = { created_at: dt.format('H:M') }
                            var attachfile = { attachfile: updatedata.attachfile }
                            var public = { public: 'always' }

                            var full_record = { ...ids, ...type, ...created_by, ...created_on, ...public, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
                            User.updateOne({ _id: updatedata.patient_id },
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
                                            var dhtml = 'Your Prescription Request Accepted.<br/>'+ 
                                                'And sick certifiace added in to your timeline.<br/>'+ 
                                                '<b>Your Aimedis team </b>'
                                                var mailOptions = {
                                                from: "contact@aimedis.com",
                                                to:updatedata.patient_email ,
                                                subject: 'Prescription Accepted',
                                                html: dhtml
                                                };
                                                var sendmail = transporter.sendMail(mailOptions)
                                            res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                        }
                                    }
                                });
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'File is not attached' })
                        }
                        // res.json({ status: 200 , hassuccessed: true , message: "user updated" , data: userdata })
                    }
                })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------S-I-C-K---C-E-R-T-I-F-I-C-A-T-E----------*/

router.post('/SickCertificate', function (req, res, next) {
    var SickCertificate = new Sick_certificate(req.body)
    SickCertificate.save(function (err, data) {
        if (err && !data) {
            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
        } else {
            if (req.body.lan === 'de') {
                var dhtml = 'Sie haben eine AU (sick certificate) von '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' beantragt.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name + ' ( '+req.body.docProfile.email+' ) ' +'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>'+ 
                'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>'+ 
                '<b>Ihr Aimedis Team </b>'

            }
            else {
                var dhtml = 'You have requested an AU (sick certificate) from '+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+'.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name+ ' ( '+req.body.docProfile.email+' )' + ' will take care of the matter and contact you via email.<br/>'+ 
                'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben  eine AU (sick certificate)  Anfrage von '+req.body.patient_info.patient_id+' erhalten. '+ 
                'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>'+
                '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received an AU (sick certificate) inquiry from '+req.body.patient_info.patient_id+'<br/>'+ 
                'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to:req.body.patient_info.email ,
                subject: 'Sick Certificate Request',
                html: dhtml
            };
            var mailOptions2 = {
                from: "contact@aimedis.com",
                to: req.body.docProfile.email,
                subject: 'Sick Certificate Request',
                html: dhtml2
            };
            var sendmail = transporter.sendMail(mailOptions)
            var sendmail2 = transporter.sendMail(mailOptions2)
            res.json({ status: 200, hassuccessed: true, message: "success" })
        }
    })
})


router.get('/SickCertificate/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Sick_certificate.findOne({ _id: req.params.sick_certificate_id }, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: data });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/SickCertificate/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Sick_certificate.findByIdAndRemove(req.params.sick_certificate_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Certificate is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/GetSickCertificate', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Sick_certificate.find({ doctor_id: legit.id, $or: [{ status: 'free' }, { status: 'pending' }] }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/GetSickCertificate/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Sick_certificate.findOne({ _id: req.params.sick_certificate_id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                var dt = dateTime.create();
                console.log('userdata.attachfile.length', userdata.attachfile.length);
                if (req.body.status === "accept" && userdata.attachfile.length == 0) {
                    req.body.status = "pending";
                }
                if (req.body.status === "decline") {
                    var data = {
                        message_header: 'Decline Sick certificate request',
                        message_text: 'Dear Patient, your request is declined for sick certificate by - ' + legit.name + '. Thanks Aimedis Team',
                        sent_date: new Date(),
                        sender_id: legit.id,
                        reciever_id: [userdata.patient_id]
                    }
                    var messages = new message(data);
                    messages.save(function (err, messages_data) {
                        if (err && !messages_data) {
                            console.log(err);
                        } else {
                            console.log(messages_data);
                        }
                    })
                }
                Sick_certificate.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status, accept_datetime: dt.format('Y-m-d H:M:S') } }, { new: true }, function (err, updatedata) {
                    if (err && !updatedata) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        console.log('updatedata.attachfile', updatedata.attachfile);
                        if (updatedata.status == 'accept' && updatedata.attachfile.length > 0) {
                            var ids = { track_id: uuidv1() };
                            var type = { type: req.body.type };
                            var datetime_on = { datetime_on: updatedata.accept_datetime };
                            var created_by = { created_by: updatedata.doctor_id };
                            var created_by_temp = { created_by_temp: req.body.doctor_name };
                            var created_on = { created_on: dt.format('Y-m-d') };
                            var created_at = { created_at: dt.format('H:M') }
                            var attachfile = { attachfile: updatedata.attachfile }
                            var public = { public: 'always' }

                            var full_record = { ...ids, ...type, ...created_by, ...created_on, ...public, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
                            User.updateOne({ _id: updatedata.patient_id },
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
                                            var dhtml = 'Your Sick certificate Request Accepted.<br/>'+ 
                                            'And sick certifiace added in to your timeline.<br/>'+ 
                                            '<b>Your Aimedis team </b>'
                                        var mailOptions = {
                                            from: "contact@aimedis.com",
                                            to:updatedata.patient_email ,
                                            subject: 'Sick certificate Accepted',
                                            html: dhtml
                                        };
                                        var sendmail = transporter.sendMail(mailOptions)
                                            res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                        }
                                    }
                                });
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'File is not attached' })
                        }
                        // res.json({ status: 200 , hassuccessed: true , message: "user updated" , data: userdata })
                    }
                })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------M-Y---P-A-T-I-E-N-T-S----------*/
router.get('/Mypatients', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ parent_id: legit.id, type: 'patient' }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/Mypatients/:patient_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        console.log(req.params.patient_id);
        User.findByIdAndRemove(req.params.patient_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'User is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------A-P-P-O-I-N-T-M-E-N-T-S----------*/

router.get('/Appointments', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Appointment.find({ doctor_id: legit.id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/PatientAcceptAppointments', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Appointment.find({ patient: legit.id, status : 'accept' }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, datsa: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/Mypatients/create_patient', function (req, res, next) {
    count = token = req.headers.token
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ email: req.body.email }).exec().then((data1) => {
            if (data1) {
                res.json({ status: 200, message: 'Email is Already exist', hassuccessed: false });
            } else {
                var parent_id = { parent_id: legit.id }
                var enpassword = base64.encode(req.body.password);
                req.body.password = enpassword;
                datas = { ...req.body, ...parent_id }
                var users = new User(datas);
                var user_id;
                users.save(function (err, user_data) {
                    if (err && !user_data) {
                        res.json({ status: 200, message: 'Something went wrong.', error: err });
                    } else {
                        user_id = user_data._id;
                        res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: user_data });
                    }
                })
            }
        });
    }
})

router.post('/second_opinion', function (req, res, next) {
    var Second_opinions = new Second_opinion(req.body);
    Second_opinions.save(function (err, user_data) {
        if (err && !user_data) {
            res.json({ status: 200, message: 'Something went wrong.', error: err });
        } else {
            if (req.body.lan === 'de') {
                var dhtml = 'Sie haben eine Zweitmeinung (second opinion) von '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' beantragt.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name + ' ( '+req.body.docProfile.email+' ) ' +'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>'+ 
                'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>'+ 
                '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml = 'You have requested a second opinion from '+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+'.<br/>'+ 
                req.body.docProfile.first_name+' '+req.body.docProfile.last_name+ ' ( '+req.body.docProfile.email+' )' + ' will take care of the matter and contact you via email.<br/>'+ 
                'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben eine Zweitmeinung (second opinion) Anfrage von '+req.body.patient_info.patient_id+' erhalten. '+ 
                'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>'+
                '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received a second opinion inquiry from '+req.body.patient_info.patient_id+'<br/>'+ 
                'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> '+
                '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to:req.body.patient_info.email ,
                subject: 'Second Opinion Request',
                html: dhtml
            };
            var mailOptions2 = {
                from: "contact@aimedis.com",
                to: req.body.docProfile.email,
                subject: 'Second Opinion Request',
                html: dhtml2
            };
            var sendmail = transporter.sendMail(mailOptions)
            var sendmail2 = transporter.sendMail(mailOptions2)
            res.json({ status: 200, message: 'Added Successfully', hassuccessed: true, data: user_data });
        }
    })
})

router.post('/Second_opinion/UploadDocument', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    console.log(legit.id, 'navdeep')
    if (legit) {
        upload1(req, res, function (err) {
            console.log('1');
            if (err instanceof multer.MulterError) {
                console.log('2');
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
            } else if (err) {
                console.log('3');
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            } else {
                console.log('4');
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

/*----------D-O-C-T-O-R---A-P-P-O-I-N-T-M-E-N-T---S-C-H-E-D-U-L-E----------*/

router.put('/private_appointments/:doctor_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOneAndUpdate({ _id: req.params.doctor_id }, { $set: { private_appointments: req.body } }, { new: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/DaysforPractices/:doctor_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOneAndUpdate({ _id: req.params.doctor_id }, { $set: { days_for_practices: req.body } }, { new: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/onlineAppointments/:doctor_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOneAndUpdate({ _id: req.params.doctor_id }, { $set: { online_appointment: req.body } }, { new: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------E-N-D----------*/

/*-----------G-E-T---D-O-C-T-O-R-S----------*/

router.get('/DoctorUsers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ type: 'doctor', first_name: { $exists: true } }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
router.get('/PatientUsers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ type: 'patient', first_name: { $exists: true } }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
router.get('/DoctorUsersChat', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ type: 'doctor'}, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


router.get('/UserlistSize', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find().exec(function (err, results) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                var count = results.length
            res.json({ status: 200, hassuccessed: true, data: count });
            }
          });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/PatientUsersChat', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ type: 'patient'}, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
router.get('/getFvDoc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ fav_doctor: { $elemMatch: { doctor: legit.id } } }, function (err2, userdata2) {
            if (err2) {
                res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
            } else {

                res.json({ status: 200, hassuccessed: false, message: "get ffav docs", data: userdata2 })
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
// router.get('/FavDoctor', function (req, res, next){
//     const token = (req.headers.token)
//     let legit   = jwtconfig.verify(token)
//     if(legit){
//         User.find({type:'doctor',first_name:{ $exists:true }}, function (err, Userinfo) {
//             if (err) {
//                 res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
//             } else {
//                 //res.json({status: 200, hassuccessed: true, data : Userinfo});
//                 User.findOne({ _id : legit.id }, function( err1 , userdata ){
//                     if(userdata.fav_doctor.length > 0){
//                         for(let i=0 ; i<userdata.fav_doctor.length ; i++){

//                         }
//                     }else{
//                         res.json({status: 200, hassuccessed: true, data : Userinfo});
//                     }
//                 })
//             }
//         });
//     }
// })

router.get('/DoctorProfile/:doctor_id', function (req, res, next) {
    User.findOne({ _id: req.params.doctor_id }, function (err, Userinfo) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, data: Userinfo });
        }
    });
})

/*----------E-N-D----------*/

/*----------S-T-R-I-P-E---P-A-Y-M-E-N-T----------*/
router.put('/paid_services', function (req, res, next) {
    console.log(req, 'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.findByIdAndUpdate({ _id: userdata._id }, { $push: { paid_services: req.body } }
                    , function (err, updatedata) {
                        if (err && !updatedata) {
                            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                        } else {
                            res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                        }
                    })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------A-D-D---F-A-V-O-I-R-I-T-E---D-O-C-T-O-R----------*/

router.put('/AddFavDoc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.findOne({ profile_id: req.body.doctor }, function (err1, userdata1) {
                    if (err1) {
                        res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                    } else {
                        if (userdata1) {
                            User.find({ _id: userdata._id, fav_doctor: { $elemMatch: { doctor: req.body.doctor } } }, function (err2, userdata2) {
                                if (err2) {
                                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                                } else {
                                    if (userdata2.length != 0) {
                                        res.json({ status: 200, hassuccessed: false, message: "Doctor already exists", error: err })
                                    } else {
                                        User.findByIdAndUpdate({ _id: userdata._id },{parent_id:  userdata1._id, $push: { fav_doctor: req.body} }, function (err2, updatedata) {
                                            if (err2 && !updatedata) {
                                                res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err2 })
                                            } else {
                                                res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                        }

                    }
                })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddRecDoc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.findOne({ profile_id: req.body.doctor }, function (err1, userdata1) {
                    if (err1) {
                        res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                    } else {
                        if (userdata1) {
                            User.find({ _id: userdata._id, fav_doctor: { $elemMatch: { doctor: req.body.doctor } } }, function (err2, userdata2) {
                                if (err2) {
                                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                                } else {
                                        User.findOneAndUpdate({ _id: userdata._id, 'fav_doctor.profile_id' : req.body.doctor}, {$set: {
                                            'fav_doctor.$.type' : 'active',
                                            parent_id:  userdata1._id
                                        }}, function (err2, updatedata) {
                                            if (err2 && !updatedata) {
                                                res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err2 })
                                            } else {
                                                res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                                            }
                                        })
                                }
                            })
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                        }

                    }
                })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddFavTDoc/:id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                User.find({ profile_id: req.params.id, fav_doctor: { $elemMatch: { doctor: userdata.profile_id } } }, function (err2, userdata2) {
                    if (err2) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else{
                        if (userdata2.length != 0) {
                            res.json({ status: 200, hassuccessed: false, message: "Doctor already exists", error: err })
                        } else {
                            var data = {doctor : userdata.profile_id, profile_id : userdata.profile_id, type: 'recommended' };
                            User.findOneAndUpdate({ profile_id: req.params.id }, { $push: { fav_doctor: data} },{upsert:true}, function (err2, updatedata) {
                                if (err2 && !updatedata) {
                                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                                } else {
                                    res.json({ status: 200, hassuccessed: true, message: "user updated", data: userdata })
                                }
                            })
                        }
                    }
                }) 
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    } 
})

/*-----------------------D-E-L-E-T-E---F-A-V-O-U-R-I-T-E---D-O-C-T-O-R-------------------------*/

router.delete('/favDocs/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.update({ _id: legit.id }, {parent_id: "0", $pull: { fav_doctor: { doctor: req.params.User_id } } },
            { multi: true },
            function (err, userdata) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                } else {
                    res.json({ status: 200, hassuccessed: true, message: 'Deleted Successfully' });
                }
            })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


/*----------U-P-L-O-A-D---L-I-C-E-N-C-E----------*/
router.post('/UploadLicence', function (req, res, next) {
    upload1(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
        } else if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
        } else {
            var file_entry = [];
            res.req.files.forEach((item, index) => {
                file_entry.push({ filename: item.filename, filetype: item.mimetype, url: item.destination + '/' + item.filename })
            })
            res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
        }
    })
});

/**/
router.put('/UpdatePrescription/:prescription_id', function (req, res, next) {

    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Prescription.findOneAndUpdate({ _id: req.params.prescription_id }, { $push: { attachfile: req.body.docs } }, { safe: true, upsert: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {
                if (doc1.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found' })
                }
                else {
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
                }
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/UpdateSickCertificate/:Sick_id', function (req, res, next) {
    console.log(req.body, 'nnnnnnnnnnnnnnnnnnn')
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Sick_certificate.findOneAndUpdate({ _id: req.params.Sick_id }, { $push: { attachfile: req.body.docs } }, { safe: true, upsert: true }, (err, doc1) => {
            if (err && !doc1) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
            } else {

                if (doc1.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found' })
                }
                else {
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data: doc1 })
                }
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/GetAppointment', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Appointment.find({ doctor_id: legit.id, status: 'free' }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/GetAppointment/:GetAppointment_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Appointment.findOne({ _id: req.params.GetAppointment_id }, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                Appointment.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status } }, { new: true }, function (err, updatedata) {
                    if (err && !updatedata) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        if(req.body.status ==='accept')
                        {
                            console.log('come inside')
                            if (req.body.lan === 'de') {
                                var dhtml = 'Ihre Terminanfrage wurde von '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+'.<br/>'+ 
                                '<b>Ihr Aimedis Team </b>'
                            
                            }
                            else {
                                var dhtml = 'Your Appointment Request Accepted by '+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+'.<br/>'+ 
                                '<b>Your Aimedis team </b>'
                            
                            }
                            
                            var mailOptions = {
                                from: "contact@aimedis.com",
                                to:req.body.email ,
                                subject: 'Appointment Accepted',
                                html: dhtml
                            };
                            var sendmail = transporter.sendMail(mailOptions)
                        }
                        res.json({ status: 200, hassuccessed: true, msg: 'track is updated', data: updatedata })
                    }
                })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*-----------------------G-E-T---L-O-C-A-T-I-O-N-------------------------*/

function getTimeStops(start, end, timeslots) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');
    var timeslot = parseInt(timeslots, 10)

    if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
    }
    var timeStops = [];
    while (startTime <= endTime) {
        timeStops.push(new moment(startTime).format('HH:mm'));
        startTime.add(timeslot, 'minutes');
    }
    return timeStops;
}

router.get('/DoctorAppointments', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ type: 'doctor', first_name: { $exists: true } }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                var finalArray = [];
                let monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text;
                for (let i = 0; i < Userinfo.length; i++) {
                    var user = [];
                    var online_users = [];
                    var Practices = [];
                    for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
                        if(Userinfo[i].private_appointments[j].custom_text)
                        {  
                            custom_text = Userinfo[i].private_appointments[j].custom_text;
                        }
                        if (Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text })
                    }
                    for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
                        if (Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    for (let l = 0; l < Userinfo[i]. days_for_practices.length; l++) {
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i]. days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    finalArray.push({
                        data: Userinfo[i],
                        appointments: user,
                        online_appointment: online_users,
                        practice_days : Practices,
                        
                    })
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
        });
    }
})

router.get('/getLocation/:radius', function (req, res, next) {
    if (!req.query.speciality) {
        User.find({
            area: {
                $near: {
                    $maxDistance: Number(req.params.radius),
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(req.query.longitude), Number(req.query.Latitude)]
                    }
                }
            }, type: 'doctor'
        }).find((error, Userinfo) => {
            if (error) {
                res.json({ status: 200, hassuccessed: false, error: error })
            } else {
                var finalArray = [];
                let monday, tuesday, wednesday, thursday, friday, saturday, sunday,custom_text
                for (let i = 0; i < Userinfo.length; i++) {
                    var user = [];
                    var online_users = [];
                    var Practices = [];
                    for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
                        console.log('try', Userinfo[i].private_appointments[j].custom_text)
                        if(Userinfo[i].private_appointments[j].custom_text)
                        {  
                            custom_text = Userinfo[i].private_appointments[j].custom_text;
                        }
                        if (Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text })
                    }
                    for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
                        if (Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    for (let l = 0; l < Userinfo[i]. days_for_practices.length; l++) {
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i]. days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    finalArray.push({
                        data: Userinfo[i],
                        appointments: user,
                        online_appointment: online_users,
                        practice_days : Practices
                    })
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
        })
    } else {
        User.find({
            area: {
                $near: {
                    $maxDistance: Number(req.params.radius),
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(req.query.longitude), Number(req.query.Latitude)]
                    }
                }
            }, type: 'doctor', speciality: req.query.speciality
        }).find((error, Userinfo) => {
            if (error) {
                res.json({ status: 200, hassuccessed: false, error: error })
            } else {
                var finalArray = [];
                let monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text
                for (let i = 0; i < Userinfo.length; i++) {
                    var user = [];
                    var online_users = [];
                    var Practices = [];
                    for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
                        console.log('try11', Userinfo[i].private_appointments[j].custom_text)
                        if(Userinfo[i].private_appointments[j].custom_text)
                        {  
                            custom_text = Userinfo[i].private_appointments[j].custom_text;
                        }
                        if (Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].private_appointments[j].monday_start, Userinfo[i].private_appointments[j].monday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].private_appointments[j].tuesday_start, Userinfo[i].private_appointments[j].tuesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].private_appointments[j].wednesday_start, Userinfo[i].private_appointments[j].wednesday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].private_appointments[j].thursday_start, Userinfo[i].private_appointments[j].thursday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].private_appointments[j].friday_start, Userinfo[i].private_appointments[j].friday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].private_appointments[j].saturday_start, Userinfo[i].private_appointments[j].saturday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        if (Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].private_appointments[j].sunday_start, Userinfo[i].private_appointments[j].sunday_end, Userinfo[i].private_appointments[j].duration_of_timeslots)
                        }
                        user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text })
                    }
                    for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
                        if (Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].online_appointment[k].monday_start, Userinfo[i].online_appointment[k].monday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].online_appointment[k].tuesday_start, Userinfo[i].online_appointment[k].tuesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].online_appointment[k].wednesday_start, Userinfo[i].online_appointment[k].wednesday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].online_appointment[k].thursday_start, Userinfo[i].online_appointment[k].thursday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].online_appointment[k].friday_start, Userinfo[i].online_appointment[k].friday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].online_appointment[k].saturday_start, Userinfo[i].online_appointment[k].saturday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        if (Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].online_appointment[k].sunday_start, Userinfo[i].online_appointment[k].sunday_end, Userinfo[i].online_appointment[k].duration_of_timeslots)
                        }
                        online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    for (let l = 0; l < Userinfo[i]. days_for_practices.length; l++) {
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i]. days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i]. days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            thursday = getTimeStops(Userinfo[i].days_for_practices[l].thursday_start, Userinfo[i].days_for_practices[l].thursday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            friday = getTimeStops(Userinfo[i].days_for_practices[l].friday_start, Userinfo[i].days_for_practices[l].friday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            saturday = getTimeStops(Userinfo[i].days_for_practices[l].saturday_start, Userinfo[i].days_for_practices[l].saturday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            sunday = getTimeStops(Userinfo[i].days_for_practices[l].sunday_start, Userinfo[i].days_for_practices[l].sunday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday })
                    }
                    finalArray.push({
                        data: Userinfo[i],
                        appointments: user,
                        online_appointment: online_users,
                        practice_days : Practices
                    })
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
        })
    }
});

router.get('/allusers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // User.find({ $or: [{type: 'hospitaladmin'}, {type: 'pharmacy'},{type: 'superadmin'},{type: 'doctor'},{type: 'therepist'}]}, function (err, Userinfo) {
        //     if (err) {
        //         res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
        //     } else {
        //         res.json({status: 200, hassuccessed: true, data : Userinfo});
        //     }
        // });
        User.find({ type: 'superadmin' }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/sendMessages', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        if (req.body.pin) {
            User.findOne({ _id: req.body.reciever_id }, { type: 'patient' }).exec().then((err, data) => {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'User not found', error: err });
                } else {
                    if (data.pin == req.body.pin) {
                        var data = {
                            message_header: req.body.message_header,
                            message_text: req.body.message_text,
                            sent_date: req.body.sent_date,
                            sender_id: req.body.sender_id,
                            reciever_id: req.body.reciever_id,
                            sent_date: req.body.sent_date,
                            attachment: {
                                file_url: req.body.file_url,
                                filename: req.body.filename
                            }
                        }
                        var messages = new message(data);
                        messages.save(function (err, messages_data) {
                            if (err && !messages_data) {
                                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', err: err });
                            } else {
                                res.json({ status: 200, hassuccessed: true, msg: 'messages is added Successfully' });
                            }
                        })
                    } else {
                        res.json({ status: 200, hassuccessed: false, msg: 'User pin not matched', err: err });
                    }
                }
            });
        }
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/sendMessages1', function (req, res, next) {
    console.log(req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        if (req.body.pin) {
            User.findOne({ _id: req.body.reciever_id, type: 'patient' }, function (err, Userinfo) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'No user found.', error: err });
                } else {
                    if (Userinfo.pin == req.body.pin) {
                        var data = {
                            message_header: req.body.message_header,
                            message_text: req.body.message_text,
                            sent_date: req.body.sent_date,
                            sender_id: req.body.sender_id,
                            reciever_id: req.body.reciever_id
                        }
                        var messages = new message(data);
                        messages.save(function (err, messages_data) {
                            if (err && !messages_data) {
                                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', err: err });
                            } else {
                                res.json({ status: 200, hassuccessed: true, msg: 'messages is added Successfully' });
                            }
                        })
                    } else {
                        res.json({ status: 200, hassuccessed: false, msg: 'User pin not matched', err: err });
                    }
                }
            });
        } else {
            var data = {
                message_header: req.body.message_header,
                message_text: req.body.message_text,
                sent_date: req.body.sent_date,
                sender_id: req.body.sender_id,
                reciever_id: req.body.reciever_id
            }
            var messages = new message(data);
            messages.save(function (err, messages_data) {
                if (err && !messages_data) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', err: err });
                } else {
                    res.json({ status: 200, hassuccessed: true, msg: 'messages is added Successfully' });
                }
            })
        }
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/getMessages', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        message.find({ reciever_id: legit.id }
            , function (err, recieve_message) {
                if (err && !recieve_message) {
                    console.log(err);
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong1.' });
                } else {
                    message.find({ sender_id: legit.id }, function (err, send_message) {
                        if (err && !recieve_message) {
                            console.log(err);
                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong2.' });
                        } else {
                            var messages = { recieve: recieve_message, sents: send_message }
                            res.json({ status: 200, hassuccessed: true, messages: messages });
                        }
                    })
                }
            })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/Docallusers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ $or: [{ type: 'hospitaladmin' }, { type: 'pharmacy' }, { type: 'superadmin' }, { type: 'doctor' }, { type: 'patient' }] }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/Nurseallusers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ $or: [{ type: 'hospitaladmin' }, { type: 'superadmin' }, { type: 'doctor' }] }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/Pharmacyallusers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ $or: [{ type: 'superadmin' }, { type: 'doctor' }, { type: 'patient' }] }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


// function Get_id(type)
// {
//     console.log('Get_id')
//     var random = Math.floor(Math.random()*1000000000) + 1;
//     var result = false;
//     if(type='patient')
//     {
//         console.log(type);
//        var profile_id = 'P'+random;
//     }
//     else if(type='nurse')
//     {
//         console.log(type);
//         var profile_id = 'N'+random;
//     }
//     else if(type='pharmacy')
//     {
//         console.log(type);
//         var profile_id = 'M'+random;
//     }
//     else if(type='doctor')
//     {
//         console.log(type);
//         var profile_id = 'D'+random;
//     }
//     else if(type='paramedic')
//     {
//         console.log(type);
//         var profile_id = 'R'+random;
//     }
//     else if(type='insurance')
//     {
//         console.log(type);
//         var profile_id = 'I'+random;
//     }
//     else if(type='hospitaladmin')
//     {
//         console.log(type);
//         var profile_id = 'H'+random;
//     }
//     let promise = new Promise(function (resolve, reject) {
//     User.findOne({
//         profile_id: profile_id,
//     }).exec()
//         .then((user_data) => {
//             console.log('check in db')
//             if(user_data){
//             console.log('userdata',user_data)
//                 result= false;
//                 setTimeout(() => resolve(result), 200);
//             }
//             else
//             {
//                 console.log('get_id');
//                result = profile_id;
//                setTimeout(() => resolve(result), 200);
//             }
//         })
//     });
//     promise.then((result) => { 
//         return result;
//     })         

// }
router.put('/setpassword', function (req, res, next) {
    const token = (req.headers.token);
    console.log('password', req.query.password);
    let legit = jwtconfig.verify(token)
    if (legit) {
        var enpassword = base64.encode(req.query.password);
        User.findOneAndUpdate({ _id: legit.id }, { password: enpassword }, { new: true }, function (err, Isbolck) {
            if (err) {
                res.json({ status: 450, msg: 'User is not exists' });
            } else {
                res.json({ status: 200, msg: 'Password is updated' });
            }
        })
    }
    else {
        res.status(401).json({ status: 401, success: false, message: 'Authentication required.' })
    }
})
//Added by Ankita
router.post('/GetUserInfo/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ profile_id: req.params.UserId })
        .select('profile_id first_name last_name _id email pin emergency_email')
        .exec(function(err, doc) { 
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    if(doc == null || doc =='undefined' )
                    {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not exist' })
                      
                    }
                    else
                    {
                        var m = new Date();
                        var dateString = m.getUTCFullYear() +"/"+ (m.getUTCMonth()+1) +"/"+ m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
                        console.log('data', req.body)
                        if (req.body.lan === 'de') {
                        

                            var dhtml = 
                            'Es gab einen Notfallzugriff auf die Daten in Ihrem Aimedis Profil.<br/>'+
                            'Der Notfallzugriff erfolgte durch <b>'+ req.body.current_info.profile_id + ' - '+req.body.current_info.first_name+' '+req.body.current_info.last_name+' am ' + dateString+ '</b>.<br/>'+
                            'Sollte es sich Ihrer Meinung nach um einen missbräuchlichen Zugriff handeln, so wenden Sie sich bitte<br/>'+
                            'unverzüglich unter der E-Mail Adresse contact@aimedis.com an uns.<br/> <br/>'+
                            'Herzliche Grüße und alles Gute<br/>'+
                            '<b>Ihr Aimedis Team </b>'
            
                        }
                        else {
                            var dhtml = 'There was emergency access to the data in your Aimedis profile.<br/>'+ 
                            'The emergency access was made by <b>'+ req.body.current_info.profile_id + ' - '+req.body.current_info.first_name+' '+req.body.current_info.last_name+' on ' + dateString+'</b>.<br/>'+ 
                            'If you believe that the access is improper, please contact us immediately via contact@aimedis.com.<br/><br/>'
                            'Best regards<br/>'+
                            '<b>Your Aimedis team </b>'
                        }
                        if (req.body.lan === 'de') {
                            var dhtml2 =   'Es gab einen Notfallzugriff auf die Daten in Ihrem Aimedis Profils von </b>' + doc.first_name +' '+ doc.last_name + ' ( '+ doc.profile_id+' ).</b><br/>'+
                            'Der Notfallzugriff erfolgte durch <b>'+ req.body.current_info.profile_id + ' - '+req.body.current_info.first_name+' '+req.body.current_info.last_name+' am ' + dateString+ '</b>.<br/>'+
                            'Sollte es sich Ihrer Meinung nach um einen missbräuchlichen Zugriff handeln, so wenden Sie sich bitte<br/>'+
                            'unverzüglich unter der E-Mail Adresse contact@aimedis.com an uns.<br/> <br/>'+
                            'Herzliche Grüße und alles Gute<br/>'+
                            '<b>Ihr Aimedis Team </b>'
                        }
                        else {
                            var dhtml2 = 'There was emergency access to the data in your Aimedis profile of <b>' + doc.first_name +' '+ doc.last_name + ' ( '+ doc.profile_id+' )</b><br/>'+ 
                            'The emergency access was made by <b>'+ req.body.current_info.profile_id + ' - '+req.body.current_info.first_name+' '+req.body.current_info.last_name+' on ' + dateString+'</b>.<br/>'+ 
                            'If you believe that the access is improper, please contact us immediately via contact@aimedis.com.<br/><br/>'
                            'Best regards<br/>'+
                            '<b>Your Aimedis team </b>'
                        }
                        var mailOptions = {
                            from: "contact@aimedis.com",
                            to:doc.email ,
                            subject: 'Emergency Access',
                            html: dhtml
                        };
                       
                      if(req.body.comefrom === 'pharmacy')
                      {
                        console.log('I here', req.body.pin)
                        if(req.body.pin && req.body.pin == doc.pin && req.body.pin !== "" )
                        {
                            console.log('I here2', req.body.pin)
                            var sendmail = transporter.sendMail(mailOptions)
                            if(doc.emergency_email && doc.emergency_email!=='')
                            {
                                var mailOptions2 = {
                                    from: "contact@aimedis.com",
                                    to: doc.emergency_email,
                                    subject: 'Emergency Access',
                                    html: dhtml2
                                };
                                var sendmail2 = transporter.sendMail(mailOptions2)
                            }
                            res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id : doc._id  })
                        }
                        else{
                            res.json({ status: 200, hassuccessed: false, msg: 'Pin is not correct' })
                        }
                      }
                      else
                      {
                        var sendmail = transporter.sendMail(mailOptions)
                        if(doc.emergency_email && doc.emergency_email!=='')
                        {
                            var mailOptions2 = {
                                from: "contact@aimedis.com",
                                to: doc.emergency_email,
                                subject: 'Emergency Access',
                                html: dhtml2
                            };
                            var sendmail2 = transporter.sendMail(mailOptions2)
                        }
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

router.post('/forgotPassword', function (req, res, next) {
    var token;
    let promise = new Promise(function (resolve, reject) {
        User.findOne({
            email: req.query.email,
        }).exec()
            .then((user_data1) => {
                if (user_data1) {
                    let payload = {
                        email: req.query.email,
                        id: user_data1._id,
                        type: user_data1.type,
                    }
                    token = jwtconfig.sign(payload);
                }
                else {
                    res.json({ status: 450, msg: 'User does not exist' })
                }

            })
        setTimeout(() => resolve(token), 500);

    });
    promise.then((token) => {
        if (token !== '') {
            var link = 'https://aidoc.io/change-password';
            // var link = 'http://localhost:3000/change-password';
            console.log('sdfsdf', req.body.lan)
            if (req.body.lan === 'de') {
                var dhtml = 'Sie haben Ihr Passwort vergessen und ein neues angefordert.<br/>' +
                    'Bitte klicken Sie auf diesen Link, um ein neues Passwort zu wählen:<br/>' +
                    '<a href="' + link + '?token=' + token + '">LINK TO RESET PASSWORD </a><br/>' +
                    'Sollten Sie Ihren Zugang zur 2 Faktor Authentifizierung verloren haben, setzen Sie sich bitte mit uns via contact@aimedis.com in Verbindung. Alternativ kontaktieren Sie uns bitte via WhatsApp. <br/><br/><br/>' +
                    '<b>Herzliche Grüße </b><br/>'
                '<b>Ihr Aimedis Team </b>'

            }
            else {
                var dhtml = 'You forgot your password and requested a new one.<br/>' +
                    'Please click this link to choose a new password:<br/>' +
                    '<a href="' + link + '?token=' + token + '">LINK TO RESET PASSWORD </a><br/>' +
                    'If you have lost your access to 2-factor authentication, please contact us via contact@aimedis.com. Alternatively, please contact us via WhatsApp.<br/><br/><br/>' +
                    '<b>Best regards</b><br/>'
                '<b>Your Aimedis team </b>'
            }

            var mailOptions = {
                from: "contact@aimedis.com",
                to: req.query.email,
                subject: 'Forgot Password',
                html: dhtml
            };
            // // var sendmail = transporter.sendMail(mailOptions)
            // sendEmail(mailOptions)
            // .then(function(info){console.log(info)
            //     res.json({ status: 200, msg: 'Mail is sent' })})   // if successful
            // .catch(function(err){ console.log(err);res.json({ status: 200, msg: 'Mail is not sent' });});  
            var sendmail = transporter.sendMail(mailOptions)
            if (sendmail) {
                res.json({ status: 200, msg: 'Mail is sent' })
            }
            else {
                console.log('there is errro', err); res.json({ status: 200, msg: 'Mail is not sent' })
            }

        }
        else {
            res.json({ status: 450, msg: 'User does not exist' })
        }

    })
})

router.post('/AskPatient1/:id', function (req, res, next) {
    const token = (req.headers.token);
let legit = jwtconfig.verify(token)
if (legit) {
        
                    if (req.body.lan === 'de') {
                        var dhtml = 'Der Doktor ('+req.body.first_name + ' ' +req.body.last_name +') Ich möchte, dass Sie Aimedis beitreten. Schickte auch diese Nachricht an Sie- <br/>'+
                        '<b>'+req.body.message+'</b><br/><br/><br/>'+
                        '<b>Ihr Aimedis Team</b><br/>' +
'<b>Webadresse: </b> <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
'<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';
                    }
                    else {
                        var dhtml = 'The doctor ('+req.body.first_name + ' ' +req.body.last_name +') want to you join Aimedis. Also sent this message to you - <br/> . ' +
                        '<b>'+req.body.message+'</b><br/><br/><br/>'+
                        '<b>Ihr Aimedis Team</b><br/>' +
                        '<b>Website Url:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                        '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';
                    }
                    var mailOptions = {
                        from: "contact@aimedis.com",
                        to: req.params.id,
                        subject: 'Invitation for the join Aimedis',
                        html: dhtml
                    }; 
                    var sendmail = transporter.sendMail(mailOptions)
                    if (sendmail) {
                        res.json({ status: 200, hassuccessed: true, msg: 'Mail is sent' })
                    }
                    else {
                        console.log('there is errro', err); res.json({ status: 200, hassuccessed: false, msg: 'Mail is not sent' })
                    } 
}
    else {
        res.status(401).json({ status: 401, success: false,  message: 'Authentication required.' })
    }  
})

    router.post('/AskPatient/:id', function (req, res, next) {
        const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
            User.findOne({$or: [{ email: req.params.id },{
                profile_id: req.params.id,}]}).exec()
                .then((user_data1) => {
                    if (user_data1) {
                        if (req.body.lan === 'de') {
                            var dhtml = 'Sie haben eine Anfrage zum Hinzufügen eines Lieblingsarztes vom DOKTOR ('+req.body.first_name + ' ' +req.body.last_name +').<br/><br/><br/>'+
                            '<b>Ihr Aimedis Team</b><br/>' +
                            '<b>Webadresse: </b> <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                            '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';
                        }
                        else {
                            var dhtml = 'You have got a request to add favorite doctor from the DOCTOR ('+req.body.first_name + ' ' +req.body.last_name +') .<br/><br/><br/> ' +
                            '<b>Your Aimedis team</b><br/>' +
                            '<b>Website Url:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                            '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>'; 
                        }
                       
                        var mailOptions = {
                            from: "contact@aimedis.com",
                            to: user_data1.email,
                            subject: 'Ask for become favorite doctor',
                            html: dhtml
                        }; 
                        var sendmail = transporter.sendMail(mailOptions)
                        if (sendmail) {
                            res.json({ status: 200, hassuccessed: true, msg: 'Mail is sent' })
                        }
                        else {
                            console.log('there is errro', err); res.json({ status: 200, hassuccessed: false, msg: 'Mail is not sent' })
                        }
                    }
                    else { 
                        res.json({ status: 450,  hassuccessed: false,  msg: 'User does not exist' })
                    }
                })
                 
    }
        else {
            res.status(401).json({ status: 401, success: false,  message: 'Authentication required.' })
        }  
})

router.get('/AllusersMessages', function (req, res, next) {
    const token = (req.headers.token);
let legit = jwtconfig.verify(token)
if (legit) {
    User.find()
        .select('profile_id first_name last_name _id email')
        .exec(function(err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            }
});
        
}
    else {
        res.status(401).json({ status: 401, success: false,  message: 'Authentication required.' })
    }  
}
)

///Add by Ankita (17-04-2020)


router.post('/downloadPdf', function (req, res, next) {
    const token = (req.headers.token)
    let   legit = jwtconfig.verify(token)
    if (legit) {
        var patientData= req.body
        var trackID = patientData.Dieseases
        delete trackID["track_id"];
        delete trackID["created_by"];
        trackID["created_by"] = trackID["created_by_temp"]
        delete trackID["created_by_temp"];
      
            var patient=[
                {
                    name:  patientData.patientData.name,
                    email: patientData.patientData.email,
                    DOB: patientData.patientData.birthday,
                    Mobile: patientData.patientData.mobile
                }
            ]
            let dignoseKeys= Object.keys(patientData.Dieseases),
                dignoseValues= Object.values(patientData.Dieseases)
            var filename= patientData.Dieseases.type+uuidv1()+'.pdf'
            var document = { 
                type: 'file',
                template: html,
                context: {
                    type: patientData.Dieseases.type,
                    patient: patient,
                    Dignose_Key: dignoseKeys,
                    Dignose_Value: dignoseValues
                },
                path: 'public/uploads/pdfs/'+ filename
            };
            
            var options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm"
            };
            
            pdf.create(document, options).then(res4 => {
                    res.json({ status: 200, hassuccessed: true, data: filename });
                }).catch(error => {
                    res.json({ status: 200, hassuccessed: false, message: error });
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


module.exports = router;