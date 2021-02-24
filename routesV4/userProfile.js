require('dotenv').config();
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
var Settings = require('../schema/settings')
const sendSms = require("./sendSms")
const {encrypt, decrypt} = require("./Cryptofile.js")
var jwtconfig = require('../jwttoken');
var base64 = require('base-64');
var dateTime = require('node-datetime');
var nodemailer = require('nodemailer');
var uuidv1 = require('uuid/v1');
var moment = require('moment');
var message = require('../schema/message');
const { join } = require('path');
var shortid = require('shortid');
var aws = require('aws-sdk');
const axios = require("axios");

var fs = require("fs")
var converter = require('json-2-csv');
var pdf = require('dynamic-html-pdf');
const { FieldValueContext } = require('twilio/lib/rest/preview/understand/assistant/fieldType/fieldValue');
var html = fs.readFileSync(join(`${__dirname}/Userdata.html`), 'utf8');
var html1 = fs.readFileSync(join(`${__dirname}/UserFullData.html`), 'utf8');
//for authy
// https://github.com/seegno/authy-client
var API_KEY = process.env.ADMIN_API_KEY
var SECRET = process.env.ADMIN_API_SECRET
var phoneReg = require('../lib/phone_verification')(API_KEY);
const Client = require('authy-client').Client;
const authy = new Client({ key: API_KEY });

var Mypat = [];
var GetUpcomingAppoint1 = [], GetPastAppoint1=[];

var GetResult1 = [], GetResult2 = [], GetResult3 = [];;

var transporter = nodemailer.createTransport({
    host : process.env.MAIL_HOST,
    port : 25,
    secure: false,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
    }
})

var Certificatestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/certificates')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single("uploadImage");
var upload1 = multer({ storage: storage }).array("UploadDocument", 5);
var upload2 = multer({ storage: Certificatestorage }).single("uploadCertificate");

router.post('/uploadImage', function (req, res, next) {
    const token = (req.headers.token)
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

// For landing pages
router.post('/SupportMail', function (req, res) {
    let mailOptions = {
        from: req.body.email,
        to: "contact@aimedis.com",
        subject: 'Contact and Support Message',
        html: '<div>This is -</b> ' + req.body.name + ' </b></div><div>' + req.body.msg + '</div>'
    };
    let sendmail = transporter.sendMail(mailOptions)
    if (sendmail) {
        res.json({ status: 200, message: 'Mail sent Successfully', hassuccessed: true });
    }
    else {
        res.json({ status: 200, msg: 'Mail is not sent', hassuccessed: false })
    }
})

// For landing pages
router.post('/IssuegetMail', function (req, res) {
    let mailOptions = {
        to: req.body.email,
        from: "contact@aimedis.com",
        subject: 'Got some issue on the Aimedis App',
        html: req.body.message 
    };
    let sendmail = transporter.sendMail(mailOptions)
    if (sendmail) {
        res.json({ status: 200, message: 'Mail sent Successfully', hassuccessed: true });
    }
    else {
        res.json({ status: 200, msg: 'Mail is not sent', hassuccessed: false })
    }
})



router.post('/sendRegisterationMail', function (req, res, next) {
    const token = (req.headers.token)
    var link = 'http://localhost:3000/';
    var mailOptions = {
        from: "contact@aimedis.com",
        to: req.body.email,
        subject: 'Aimedis Registration',
        html: '<div>You have registered successfully'
            + '<a href="' + link + '?token=' + token + '">click here</a> to login</div>'
            + '<div>If you have any questions, please do not hesitate to contact us via icuservices@aimedis.com.</div>'
            + '<div style="color:#ddd, font-size: 9px;">Aimedis Customer Support <br/> - Aimedis B.V. <br/> Sint Michaëlstraat 45935 BL Steyl<br/> Netherlands - <br/>Aimedis B.V. Netherlands'
            + '<br/>Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO <br/> VAT No.: NL858194478B01</div>'
    };
    var sendmail = transporter.sendMail(mailOptions)
})

//For login the user

router.post('/UserLogin', function (req, res, next) {
    if (req.body.email == '' || req.body.password == '') {
        res.json({ status: 450, message: "Email and password fields should not be empty", hassuccessed: false })
    } else {
        const email = req.body.email;
        const messageToSearchWith = new User({email});
        messageToSearchWith.encryptFieldsSync();
        User.findOne({ $or :[{email: { $regex: req.body.email, $options: "i" }}, {email: { $regex: messageToSearchWith.email, $options: "i" }}]}).exec()
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
                    
                            var decodes = base64.decode(user_data.password);
                            if(decodes === req.body.password || decrypt(parseReturn(decodes)) === req.body.password){   
    
                                if (user_data.verified === 'true') {
                                    if (!user_data.is2fa || user_data.is2fa === false) {
                                     
                                        let payload = {
                                            email: user_data.email,
                                            name: user_data.first_name + " " + user_data.last_name,
                                            id: user_data._id,
                                            type: user_data.type
                                        }
                                        var token = jwtconfig.sign(payload);
                                       
                                        if(user_data.type !=='superadmin'){
                                            User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: 0 } }, { new: true }, (err, doc1) => {});
                                            res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                        }
                                        else{
                                            res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                        }
                                       
                                    }
                                    else {
                                        if (user_data.authyId) {
                                            authy.requestSms({ authyId: user_data.authyId }, { force: true }, function (err, smsRes) {
                                                if (err) {
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

                                            if(user_data.type !=='superadmin'){
                                                User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: 0 } }, { new: true }, (err, doc1) => {});
                                                res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                            }
                                            else{
                                                res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                            }
                                        }

                                        else {
                                            res.json({ status: 450, message: "Can not get Mobile number for the notification", hassuccessed: false })
                                        }
                                    }

                                } else {
                                    res.json({ status: 450, message: "Your Account is not verified, please check your email account.", hassuccessed: false })
                                }
                            } else {
                                if(user_data.type !=='superadmin'){
                                    var count = (user_data.logWrongPass && user_data.logWrongPass < 5) ? user_data.logWrongPass+1 : 1;
                                    if(count==5){
                                        let payload1 = {
                                            email: user_data.email,
                                            id: user_data._id,
                                            type: user_data.type,
                                        }
                                        token1 = jwtconfig.sign(payload1);
                                        let link = 'https://aidoc.io/change-password';
                                        var mailOptions1 = {
                                            from: "contact@aimedis.com",
                                            to: user_data.email,
                                            subject: 'Reset Your Password immediately!!',
                                            html: '<div>Please reset Your Password immediately.</br>'
                                                + 'It is for security purpose, there are many login attempt from your email with wrong Password, We suggest go to link and reset the password.<br/>'+
                                                '<a href="' + link + '?token=' + token1 + '">LINK TO RESET PASSWORD </a><br/>' +
                                                'You can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/></br>' +
                                                '<b>Your Aimedis team </b>'
                                        };
                                        var sendmail = transporter.sendMail(mailOptions1)
                                        User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: count, isblock : true } }, { new: true }, (err, doc1) => {});
                                    }
                                    else{
                                        User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: count } }, { new: true }, (err, doc1) => {});
                                    }
                                    
                                    res.json({ status: 450, message: "Wrong password", hassuccessed: false })
                                }
                                else{
                                    res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                }
                                
                            }
                        })
                    }
                }
                else {
                   
                    res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                }
            })
    }
})

router.post('/UserLoginAdmin', function (req, res, next) {
    if (req.body.email == '' || req.body.password == '') {
        res.json({ status: 450, message: "Email and password fields should not be empty", hassuccessed: false })
    } else {
        const email = req.body.email;
        const messageToSearchWith = new User({email});
        messageToSearchWith.encryptFieldsSync();
        User.findOne({ $or :[{email: { $regex: req.body.email, $options: "i" }}, {email: { $regex: messageToSearchWith.email, $options: "i" }}]}).exec()
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
                            
                            var decodes = base64.decode(user_data.password);
                            if(decodes === req.body.password || decrypt(parseReturn(decodes)) === req.body.password){   
                                if (user_data.verified === 'true') {
                                    if (!user_data.is2fa || user_data.is2fa === false) {
                                       
                                        let payload = {
                                            email: user_data.email,
                                            name: user_data.first_name + " " + user_data.last_name,
                                            id: user_data._id,
                                            type: user_data.type
                                        }
                                        var token = jwtconfig.sign(payload);
                                        if(user_data.type ==='superadmin'){
                                            User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: 0 } }, { new: true }, (err, doc1) => {});
                                            res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                        }
                                        else{
                                            res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                        }
                                    }
                                    else {
                                        if (user_data.authyId) {
                                            authy.requestSms({ authyId: user_data.authyId }, { force: true }, function (err, smsRes) {
                                                if (err) {
                                             
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

                                            if(user_data.type ==='superadmin'){
                                                User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: 0 } }, { new: true }, (err, doc1) => {});
                                                res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, user: user_data, token: token })
                                            }
                                            else{
                                                res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                            }
                                        }

                                        else {
                                            res.json({ status: 450, message: "Can not get Mobile number for the notification", hassuccessed: false })
                                        }
                                    }

                                } else {
                                    res.json({ status: 450, message: "Your Account is not verified, please check your email account.", hassuccessed: false })
                                }
                            } else {
                                if(user_data.type ==='superadmin'){
                                    var count = (user_data.logWrongPass && user_data.logWrongPass < 5) ? user_data.logWrongPass+1 : 1;
                                    if(count==5){
                                        let payload1 = {
                                            email: user_data.email,
                                            id: user_data._id,
                                            type: user_data.type,
                                        }
                                        token1 = jwtconfig.sign(payload1);
                                        let link = 'https://aidoc.io/admin/change-password';
                                        var mailOptions1 = {
                                            from: "contact@aimedis.com",
                                            to: "aakash.webnexus@gmail.com",
                                            subject: 'Admin - Reset Your Password immediately!!',
                                            html: '<div>Admin Aimedis Please reset Your Password immediately.</br>'
                                                + 'It is for security purpose, there are many login attempt from your email with wrong Password, We suggest go to link and reset the password.<br/>'+
                                                '<a href="' + link + '?token=' + token1 + '">LINK TO RESET PASSWORD </a><br/>'
                                        };
                                        var sendmail = transporter.sendMail(mailOptions1)
                                    }
                                    User.findOneAndUpdate({ _id: user_data._id }, { $set: { logWrongPass: count } }, { new: true }, (err, doc1) => {});
                                    res.json({ status: 450, message: "Wrong password", hassuccessed: false })
                                }
                                else{
                                    res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                                }
                              
                            }
                        })
                    }
                }
                else {
                  
                    res.json({ status: 450, message: "User does not exist", hassuccessed: false })
                }
            })
    }
})


router.post('/verifyLogin', function (req, res, next) {
    authy.verifyToken({ authyId: req.body.authyId, token: req.body.mob_token })
        .catch(err =>  res.json({ status: 200, message: 'Something went wrong.', error: err, hassuccessed: false }))
        .then(regRes => {
            res.json({ status: 200, message: "Succefully fetched", hassuccessed: true, tokenRes: regRes })
        })
        
        // res.status(200).json(tokenRes);
})

/*-----------------------F-O-R---A-D-D-I-N-G---U-S-E-R-Ss-------------------------*/

router.post('/AddUser', function (req, res, next) {
    if (req.body.email == '' || req.body.email == undefined || req.body.password == '' || req.body.password == undefined) {
        res.json({ status: 450, message: "Email and password fields should not be empty", hassuccessed: false })
    } else {
        const email = req.body.email;
        const messageToSearchWith = new User({email});
        messageToSearchWith.encryptFieldsSync();

        const messageToSearchWith1 = new User({email : req.body.email.toLowerCase()});
        messageToSearchWith1.encryptFieldsSync();

        const messageToSearchWith2 = new User({email :  req.body.email.toUpperCase()});
        messageToSearchWith2.encryptFieldsSync();

        User.findOne({ $or: [{ email: messageToSearchWith1.email }, { email: messageToSearchWith.email }, { email: messageToSearchWith2.email }, { email: req.body.email }, { email: req.body.email.toLowerCase() }, { email: req.body.email.toUpperCase() }] }).exec().then((data1) => {
      
            if (data1) {
                res.json({ status: 200, message: 'Email is Already exist', hassuccessed: false });
            } else {
                var ids = shortid.generate();
               
                if (req.body.lan === 'de') {
                    var dhtml = '<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>' +
                        'Mit Aimedis stehen Sie immer an der Seite Ihrer Patienten. Bieten Sie online Termine und Videosprechstunden an, stellen Sie Rezepte und Arbeitsunfähigkeitsbescheinigungen aus oder bieten Sie Zweitmeinungen über die Plattform an, alles bis auf Weiteres kostenfrei.<br/>' +
                        'Sobald Sie sich als medizinische Fachkraft legitimiert haben, schalten wir Ihren Zugang frei.<br/>' +
                        'In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung.<br/>' +
                        'Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>' +
                        'Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen.<br/><br/>' +
                        '<b>Ihr Aimedis Team</b><br/>' +
                        '<b>Jetzt einloggen: </b> <a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
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
                            '<b>Jetzt einloggen: </b>  <a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
                            '<b>Der Aimedis Blog:</b> <a href="https://sys.aimedis.io">https://blog.aimedis.com</a><br/>';
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
                        '<b>Log in now:</b><a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
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
                            '<b>Log in now:</b><a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
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
                var enpassword =  base64.encode(JSON.stringify(encrypt(req.body.password)));
                var usertoken = { usertoken: uuidv1() }
                var verified = { verified: 'true' }
                var profile_id = { profile_id: profile_id, alies_id: profile_id }
                req.body.password = enpassword;

                var user_id;
          
                if (req.body.country_code && req.body.mobile) {
                    authy.registerUser({
                        countryCode: req.body.country_code,
                        email: req.body.email,
                        phone: req.body.mobile
                    })
                        .catch(err => res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false }))
                        .then(regRes => {
                        
                            if (regRes && regRes.success) {
                                var authyId = { authyId: regRes.user.id };
                                req.body.mobile = req.body.country_code.toUpperCase() + '-' + req.body.mobile;
                                datas = { ...authyId, ...profile_id, ...req.body, ...isblock, ...createdate, ...createdby, ...usertoken, ...verified }
                                var users = new User(datas);
                                users.save(function (err, user_data) {
                                    if (err && !user_data) {
                                        res.json({ status: 200, message: 'Something went wrong.', error: err, hassuccessed: false });
                                    } else {

                                        user_id = user_data._id;
                                        let token = user_data.usertoken;
                                        //let link = 'http://localhost:3000/';
                                        let link = 'https://sys.aimedis.io/';
                                        let mailOptions = {
                                            from: "contact@aimedis.com",
                                            to: req.body.email,
                                            //to      :  'navdeep.webnexus@gmail.com',
                                            subject: 'Aimedis Registration',
                                            html: dhtml
                                        };
                                        let sendmail = transporter.sendMail(mailOptions)
                                        User.findOne({ _id: user_id },
                                            function (err, doc) {
                                                if (err && !doc) {
                                                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err });
                                                }
                                                else {
                                                    console.log('doc', doc)
                                                res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: doc });
                                            }
                                        })
                                    }
                                })
                            }
                            else {
                                res.json({ status: 200, message: 'Phone is not verified', hassuccessed: false });
                            }
                        })

                }
                else {
                    res.json({ status: 200, message: 'Phone is not verified', hassuccessed: false });
                }

            }
        });
    }
})
router.put('/Bookservice', (req, res) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var paymentData = {
        created: moment(new Date()).format("MM/DD/YYYY"),
        description: req.body.description,
    }
    User.updateOne({ _id: legit.id }, { $push: { paid_services: paymentData } },
        { safe: true, upsert: true }, function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, message: 'something went wrong', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'booked successfully', data: doc })
            }
        });
});

router.delete('/Bookservice/:description', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.updateOne({ _id: legit.id },
            { $pull: { paid_services: { description: req.params.description } } },
            { multi: true },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    
                    if (doc.nModified == '0') {
                        res.json({ status: 200, hassuccessed: false, msg: 'Services not deactivate' })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: true, msg: 'services is deactivated' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

/*-----------------------D-E-L-E-T-E---P-A-R-T-I-C-U-L-A-R---U-S-E-R-------------------------*/
function emptyBucket(bucketName, foldername) {
    aws.config.update({
        region: 'ap-south-1', // Put your aws region here
        accessKeyId: 'AKIASQXDNWERH3C6MMP5',
        secretAccessKey: 'SUZCeBjOvBrltj/s5Whs1i1yuNyWxHLU31mdXkyC'
    })

    var s3 = new aws.S3({ apiVersion: '2006-03-01' });
    var params = {
        Bucket: bucketName,
        Prefix: foldername
    };

    s3.listObjects(params, function (err, data) {
        if (err) return err;

        if (data.Contents.length == 0) {
            console.log("Bucket is empty!");
        }

        else {
            params = { Bucket: bucketName };
            params.Delete = { Objects: [] };

            data.Contents.forEach(function (content) {
                params.Delete.Objects.push({ Key: content.Key });
            });

            s3.deleteObjects(params, function (err, data) {
                if (err) return err;
                if (data && data.Contents && data.Contents.length != 0) emptyBucket(bucketName, foldername);

            });
        }
    });
}
router.delete('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findByIdAndRemove(req.params.User_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                if (req.query.bucket) {
                   
                    var buck = req.query.bucket
                }
                else {
                 
                    var buck = 'aimedisfirstbucket'
                }
                emptyBucket(buck, data.profile_id)
                res.json({ status: 200, hassuccessed: true, message: 'User is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*-----------------------G-E-T---U-S-E-R-------------------------*/

router.get('/existorblock/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    User.findOne({ _id: req.params.User_id })
    .select("-password")
    .exec(function(err, Userinfo) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
        } else {
            if (Userinfo){
                if(Userinfo.isblock){
                    res.json({ status: 200, hassuccessed: false});
                }else{
                    res.json({ status: 200, hassuccessed: true });
                }    
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

router.get('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    User.findOne({ _id: req.params.User_id })
    .select("-password -track_record")
    .exec(function(err, Userinfo) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
        } else {
            if (Userinfo){
                if(Userinfo.organ_donor && Userinfo.organ_donor.length>0 && Userinfo.organ_donor[0].OptionData && Userinfo.organ_donor[0]._enc_OptionData===true){
                    if(decrypt(Userinfo.organ_donor[0].OptionData).indexOf("{") !== -1){
                        Userinfo.organ_donor[0].OptionData = JSON.parse(decrypt(Userinfo.organ_donor[0].OptionData));
                    }
                    else{
                        Userinfo.organ_donor[0].OptionData = decrypt(Userinfo.organ_donor[0].OptionData);  
                    }
                    
                }
                res.json({ status: 200, hassuccessed: true, data: Userinfo });
            } else {
                res.json({ status: 200, hassuccessed: false, message: 'User not found' });
            }
        }
    });
        // User.findOne({ _id: req.params.User_id }, function (err, Userinfo) {
           
        // });
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

router.put('/Users/changePass', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
            }
            else{
                if (req.body.password) {
                    var enpassword = base64.encode(JSON.stringify(encrypt(req.body.password)));
                    req.body.password = enpassword;
                }
                         
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

const parseReturn = (code) => {
    try {
        let res = JSON.parse(code);
        return (res);
    } catch (e) {
        return (code);
    }
    
};
router.post('/Users/checkPass', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: legit.id }, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
            }
            else{
                if(changeStatus){
                    var decodes = base64.decode(changeStatus.password);
                    if(decodes === req.body.password || decrypt(parseReturn(decodes)) === req.body.password){
                        res.json({ status: 200, hassuccessed: true, message: 'Password matched', data: true})
                    }
                    else{
                        res.json({ status: 200, hassuccessed: true, message: 'Password not matched', data: false})
                    }
                }
                else{
                    res.json({ status: 200, hassuccessed: true, message: 'Password not matched', data: false})
                } 
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
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
                // if (req.body.password) {
                //     var enpassword = base64.encode(req.body.password);
                //     req.body.password = enpassword;
                // }
                if (req.body.mobile) {
                    var country_code = '';
                    var mob = req.body.mobile && req.body.mobile.split("-")
                    var mob1 = mob.pop()
                    if (mob && mob.length > 0 && mob[0] && mob[0].length == 2) {
                        country_code = mob[0]
                        if (country_code && country_code === '') {
                            let tt = changeStatus.mobile.split("-")
                            if (tt && tt.length > 0 && tt[0] && tt[0].length == 2) {
                                country_code === tt[0]
                            }
                        }
                    }
                    
                    authy.registerUser({
                        countryCode: country_code,
                        email: changeStatus.email,
                        phone: mob1
                    })
                        .catch(err => res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false }))
                        .then(regRes => {
                            if (regRes && regRes.success) {
                                var authyId = { authyId: regRes.user.id };
                                datas = { ...authyId, ...req.body }
                                User.findByIdAndUpdate({ _id: changeStatus._id },
                                    datas,
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
                    User.findByIdAndUpdate({ _id: changeStatus._id },
                        req.body,
                        function (err, doc) {
                            if (err && !doc) {
                                res.json({ status: 200, hassuccessed: false, message: 'update data failed', error: err })
                            } else {
                                res.json({ status: 200, hassuccessed: true, message: 'Updated' })
                            }

                        })
                }

            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

//For change setting 
router.put('/updateSetting', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // Find the document
        Settings.updateOne({ user_id: req.body.user_id }, req.body, { upsert: true, new: true, setDefaultsOnInsert: true }, function (error, result) {
            if (error) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: error })
            }
            else {
                res.json({ status: 200, hassuccessed: true, message: 'Setting Updated' })
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

//For get setting 
router.get('/updateSetting', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // Find the document
        Settings.findOne({ user_id: legit.id }, function (error, result) {
            if (error) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: error })
            }
            else {
                res.json({ status: 200, hassuccessed: true, message: 'get Settings', data :  result})
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

//For get setting perticular user
router.get('/updateSetting/:user_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // Find the document
        Settings.findOne({ user_id: req.params.user_id }, function (error, result) {
            if (error) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: error })
            }
            else {
                res.json({ status: 200, hassuccessed: true, message: 'get Settings', data :  result})
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

// For check alies profile id 

router.get('/checkAlies', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
       
        User.find({ $or: [{ alies_id: req.query.alies_id }, { profile_id: req.query.alies_id }] }, function (err, changeStatus) {
        
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
            }
            if (changeStatus && changeStatus.length > 0) {
                res.json({ status: 200, hassuccessed: true, message: 'Already exist' })
            }
            else {
                res.json({ status: 200, hassuccessed: false, message: 'No Data exist' })
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
                if(typeof req.body.OptionData ==='string'){
                    var optionData = encrypt(req.body.OptionData)
                }
                else{
                    var optionData = encrypt(JSON.stringify(req.body.OptionData));
                }
               
                req.body.OptionData = optionData;
                req.body._enc_OptionData = true
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
    var enpassword = base64.encode(JSON.stringify(encrypt(req.body.password)));
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
                var dhtml = 'Sie haben ein Rezept (prescription) von ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' beantragt.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' ) ' + 'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>' +
                    'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'

            }
            else {
                var dhtml = 'You have requested a prescription from ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + '.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' )' + ' will take care of the matter and contact you via email.<br/>' +
                    'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben ein Rezept (prescription) Anfrage von ' + req.body.patient_info.patient_id + ' erhalten. ' +
                    'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received a prescription inquiry from ' + req.body.patient_info.patient_id + '<br/>' +
                    'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.patient_info.email,
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
        const doctor_id = legit.id;
        const messageToSearchWith = new Prescription({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        Prescription.find({$or : [{doctor_id :  messageToSearchWith.doctor_id },{ doctor_id: legit.id}], status: { $ne: "remove" }}, function (err, Userinfo) {
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

router.get('/GetPrescription', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const doctor_id = legit.id;
        const messageToSearchWith = new Prescription({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        Prescription.find({$or : [{doctor_id :  messageToSearchWith.doctor_id },{ doctor_id: legit.id}], status: { $ne: "remove" }}, function (err, Userinfo) {
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


//Added by Ankita to get the Second opinion of the doctor
router.get('/GetSecondOpinion', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const doctor_id = legit.id;
        const messageToSearchWith = new Second_opinion({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        
        Second_opinion.find({$or : [{doctor_id :  messageToSearchWith.doctor_id },{ doctor_id: legit.id}], status: { $ne: "remove" }}, function (err, Userinfo) {
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
                if(userdata && typeof userdata =='object') userdata= userdata.toObject()

                if (req.body.status === "accept" && userdata.attachfile.length == 0) {
                    req.body.status = "pending";
                }
                Prescription.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status, accept_datetime: dt.format('Y-m-d H:M:S') } }, { new: true }, function (err, updatedata) {
                    if (err && !updatedata) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        
                        if (updatedata.status == 'accept' && updatedata.attachfile.length > 0) {
                            var ids = { track_id: uuidv1() };
                            var type = { type: req.body.type };
                            var datetime_on = { datetime_on: updatedata.accept_datetime };
                            var created_by = { created_by: updatedata.doctor_id };
                            var created_by_temp = { created_by_temp: req.body.doctor_name };
                            var created_on = { created_on: dt.format('Y-m-d') };
                            var event_date = { event_date: dt.format('Y-m-d') };
                            var created_at = { created_at: dt.format('H:M') }
                            var attachfile = { attachfile: updatedata.attachfile }
                            
                            if(req.body.send_to_timeline){
                            var full_record = { ...ids, ...type, ...created_by, ...created_on, ...event_date, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
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
                                            var dhtml = 'Your Prescription Request Accepted.<br/>' +
                                                'And prescription added in to your timeline.<br/>' +
                                                '<b>Your Aimedis team </b>'
                                            var mailOptions = {
                                                from: "contact@aimedis.com",
                                                to: updatedata.patient_email,
                                                subject: 'Prescription Accepted',
                                                html: dhtml
                                            };
                                            var sendmail = transporter.sendMail(mailOptions)
                                            if(req.body.sendPharmacy){
                                                const messageToSearchWith = new User({profile_id :req.body.sendPharmacy });
                                                messageToSearchWith.encryptFieldsSync();
                                                var patient_id2 = { patient_id: updatedata.patient_profile_id };
                                                var full_record1 = { ...patient_id2, ...ids, ...type, ...created_by, ...created_on, ...event_date, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
                                                User.updateOne({$or: [{ profile_id: req.body.sendPharmacy }, {profile_id: messageToSearchWith.profile_id}]},
                                                    { $push: { track_record: full_record1 } },
                                                    { safe: true, upsert: true },
                                                    function (err, doc) {
                                                        if (err && !doc) {
                                                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                                                        } else {
                                                            if (doc.nModified == '0') {
                                                                console.log('I am heereee056')
                                                                res.json({ status: 200, hassuccessed: false, msg: 'Pharmacy is not found' })
                                                            }
                                                            else {
                                                                console.log('I am heereee to send on Pharmcay too.')
                                                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                                            }
                                                        }
                                                    });
                                            }
                                            else{
                                                console.log('I am hereeee')
                                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                            }
                                            
                                        }
                                    }
                                });
                            }
                            else{
                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                            }
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
                var dhtml = 'Sie haben eine AU (sick certificate) von ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' beantragt.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' ) ' + 'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>' +
                    'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'

            }
            else {
                var dhtml = 'You have requested an AU (sick certificate) from ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + '.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' )' + ' will take care of the matter and contact you via email.<br/>' +
                    'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben  eine AU (sick certificate)  Anfrage von ' + req.body.patient_info.patient_id + ' erhalten. ' +
                    'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received an AU (sick certificate) inquiry from ' + req.body.patient_info.patient_id + '<br/>' +
                    'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.patient_info.email,
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

router.get('/RequestedSickCertificate', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    getResult1 = [];
    if (legit) {
        const patient_id = legit.id;
        const messageToSearchWith = new Sick_certificate({patient_id});
        messageToSearchWith.encryptFieldsSync();
        Sick_certificate.find({$or : [{patient_id :  messageToSearchWith.patient_id },{ patient_id: legit.id }]}, function (err, data) {
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

router.get('/RequestedAppointment', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    getResult3 = [];
    if (legit) {
        Appointment.find({ patient: legit.id }, function (err, data) {
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

router.get('/RequestedPrescription', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    getResult2 = [];
    if (legit) {
        const patient_id = legit.id;
        const messageToSearchWith = new Prescription({patient_id});
        messageToSearchWith.encryptFieldsSync();
        Prescription.find({$or : [{patient_id :  messageToSearchWith.patient_id },{ patient_id: legit.id }]}, function (err, data) {
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


//For requested Second opinion
router.get('/RequestedSecond', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    getResult2 = [];
    if (legit) {
        const patient_id = legit.id;
        const messageToSearchWith = new Second_opinion({patient_id});
        messageToSearchWith.encryptFieldsSync();
        Second_opinion.find({$or : [{patient_id :  messageToSearchWith.patient_id },{ patient_id: legit.id }]}, 
        function (err, data) {
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
        const doctor_id = legit.id;
        const messageToSearchWith = new Sick_certificate({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        Sick_certificate.find({$or : [{doctor_id :  messageToSearchWith.doctor_id },{ doctor_id: legit.id}], status: { $ne: "remove" }}, function (err, Userinfo) {
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
                if(userdata && typeof userdata =='object') userdata= userdata.toObject()
                var dt = dateTime.create();
                
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
                       
                        if (updatedata.status == 'accept' && updatedata.attachfile.length > 0) {
                            var ids = { track_id: uuidv1() };
                            var type = { type: req.body.type };
                            var datetime_on = { datetime_on: updatedata.accept_datetime };
                            var event_date = { event_date: dt.format('Y-m-d') };
                            var created_by = { created_by: updatedata.doctor_id };
                            var created_by_temp = { created_by_temp: req.body.doctor_name };
                            var created_on = { created_on: dt.format('Y-m-d') };
                            var created_at = { created_at: dt.format('H:M') }
                            var attachfile = { attachfile: updatedata.attachfile }
                            if(req.body.send_to_timeline){
                                var full_record = { ...ids, ...type, ...created_by, ...event_date, ...created_on, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
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
                                                var dhtml = 'Your Sick certificate Request Accepted.<br/>' +
                                                    'And sick certificate added in to your timeline.<br/>' +
                                                    '<b>Your Aimedis team </b>'
                                                var mailOptions = {
                                                    from: "contact@aimedis.com",
                                                    to: updatedata.patient_email,
                                                    subject: 'Sick certificate Accepted',
                                                    html: dhtml
                                                };
                                                var sendmail = transporter.sendMail(mailOptions)
                                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                            }
                                        }
                                    });
                            }
                            else{
                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                            }    
                            
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


//Add bY Ankita to update the Second opinion
router.put('/GetSecondOpinion/:Prescription_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Second_opinion.findOne({ _id: req.params.Prescription_id }, function (err, userdata) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
                } else {
                    var dt = dateTime.create();
                    if(userdata && typeof userdata =='object') userdata= userdata.toObject()
                    if (req.body.status === "decline") {
                        var data = {
                            message_header: 'Decline Second Opinion request',
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
                    Second_opinion.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status, accept_datetime: dt.format('Y-m-d H:M:S') } }, { new: true }, function (err, updatedata) {
                        if (err && !updatedata) {
                            res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                        } else {
                          
                            if (updatedata.status == 'accept' && updatedata.attachfile.length > 0) {
                             
                                var ids = { track_id: uuidv1() };
                                var type = { type: req.body.type };
                                var datetime_on = { datetime_on: dt.format('Y-m-d') };
                                var created_by = { created_by: updatedata.doctor_id };
                                var created_by_temp = { created_by_temp: req.body.doctor_name };
                                var created_on = { created_on: dt.format('Y-m-d') };
                                var event_date = { event_date: dt.format('Y-m-d') };
                                var created_at = { created_at: dt.format('H:M') }
                                var attachfile = { attachfile: updatedata.attachfile }
                                if(req.body.send_to_timeline){
                                var full_record = { ...ids, ...type, ...created_by, ...created_on, ...event_date, ...created_at, ...datetime_on, ...created_by_temp, ...attachfile }
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
                                                var dhtml = 'Your Second opinion Request Accepted.<br/>' +
                                                    'And  Second opinion added in to your timeline.<br/>' +
                                                    '<b>Your Aimedis team </b>'
                                                var mailOptions = {
                                                    from: "contact@aimedis.com",
                                                    to: updatedata.patient_email,
                                                    subject: ' Second opinion Accepted',
                                                    html: dhtml
                                                };
                                                var sendmail = transporter.sendMail(mailOptions)
                                           
                                                res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                                            }
                                        }
                                    });
                                }
                                else{
                                    res.json({ status: 200, hassuccessed: true, msg: 'track is updated' }) 
                                }
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

router.put('/UpdateSecondOpinion/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    
        Second_opinion.updateOne({ _id: req.params.sick_certificate_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Second Opinion is updated', data: userdata })
            }
        })    
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
//Add bY Ankita to update the Sick certificate
router.put('/UpdateSickcertificate/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        
        Sick_certificate.updateOne({ _id: req.params.sick_certificate_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Sick certificate is updated', data: userdata })
            }
        })
          
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

//Add bY Ankita to update the Prescription
router.put('/UpdatePrescription/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {

        Prescription.updateOne({ _id: req.params.sick_certificate_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Prescription is updated', data: userdata })
            }
        })    
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

//Added by Ankita for Upcoming Appointment
router.get('/UpcomingAppintmentDoc', function (req, res, next) {

    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const doctor_id = legit.id;
        const messageToSearchWith = new Appointment({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        var date = new Date();
        date = date.setDate(date.getDate() - 1);
        date = new Date(date);
        Appointment.find(  {$and: [{$or: [{doctor_id :  messageToSearchWith.doctor_id },{doctor_id : legit.id}]}, 
            {$or : [
                {date: { $gte: date, }},
                {date: { $eq: date, }}
                ],
            status : 'free'
            }]},
            function(err,results) {
                if (err) { res.json({err: err, status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else{ res.json({ status: 200, hassuccessed: true, data:  results}) };
            }
        )
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Added by Ankita for Upcoming Appointment
router.get('/UpcomingAppintmentPat', function (req, res, next) {
    GetUpcomingAppoint1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const patient = legit.id;
        const messageToSearchWith = new Appointment({patient});
        messageToSearchWith.encryptFieldsSync();
        var date = new Date();
        date = date.setDate(date.getDate() - 1);
        date = new Date(date);
        Appointment.find( {$and: [{$or: [{patient :  messageToSearchWith.patient },{patient : legit.id}]}, 
           { $or : [
            {date: { $gte: date, }},
            {date: { $eq: date, }}
            ]}]
        },
            function(err,results) {
                if (err) { res.json({ err: err, status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else{  
                    forEachPromise(results, GetUpcomingAppoint)
                    .then((result) => {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: GetUpcomingAppoint1 })
                    })  
                }
            }
        ) 
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Added by Ankita for Upcoming Appointment
router.get('/UpcomingAppintmentPat/:Userid', function (req, res, next) {
    GetUpcomingAppoint1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const patient = req.params.Userid;
        const messageToSearchWith = new Appointment({patient});
        messageToSearchWith.encryptFieldsSync();
        var date = new Date();
        date = date.setDate(date.getDate() - 1);
        date = new Date(date);
        Appointment.find( {$and: [{$or: [{patient :  messageToSearchWith.patient },{patient : req.params.Userid}]}, 
            {$or : [
            {date: { $gte: date, }},
            {date: { $eq: date, }}
            ]}]
        },
            function(err,results) {
                if (err) { res.json({ err: err, status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else { 
                    forEachPromise(results, GetUpcomingAppoint)
                    .then((result) => {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: GetUpcomingAppoint1 })
                    })
                };
            }
        ) 
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});


//Added by Ankita for Upcoming Appointment
router.get('/PastAppintmentPat', function (req, res, next) {
    GetPastAppoint1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const patient = legit.id;
        const messageToSearchWith = new Appointment({patient});
        messageToSearchWith.encryptFieldsSync();
        Appointment.find({$and: [ {$or: [{patient :  messageToSearchWith.patient },{patient : legit.id}]}, 
            {$or : [
                { date: { $lte: new Date() }},
            ]}]},
            function(err,results) {
                if (err) { res.json({ err: err, status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else{ 
                    forEachPromise(results, GetPastAppoint)
                    .then((result) => {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: GetPastAppoint1 })
                    })};
            }
        ) 
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Added by Ankita for Upcoming Appointment
router.get('/PastAppintmentDoc', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const doctor_id = legit.id;
        const messageToSearchWith = new Appointment({doctor_id});
        messageToSearchWith.encryptFieldsSync();
        Appointment.find( {$and: [{$or: [{doctor_id :  messageToSearchWith.doctor_id },{doctor_id : legit.id}]},  
            {$or : [
                { date: { $lte: new Date() }},
            ]}
        ]},
            function(err,results) {
                if (err) { res.json({ err: err, status: 200, hassuccessed: false, msg: 'Something went wrong' })}
                else{ res.json({ status: 200, hassuccessed: true, data:  results}) };
            }
        ) 
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//Add bY Ankita to update the Second Opinion
router.put('/UpdateSecond/:sick_certificate_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        
        Second_opinion.updateOne({ _id: req.params.sick_certificate_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Second Opinion is updated', data: userdata })
            }
        })    
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
/*----------M-Y---P-A-T-I-E-N-T-S----------*/

router.post('/AddtoPatientList/:id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const profile_id = req.params.id;
        const messageToSearchWith = new User({profile_id});
        messageToSearchWith.encryptFieldsSync();
        User.findOneAndUpdate({ $or:[{profile_id: req.params.id },{profile_id: messageToSearchWith.profile_id}]}, { $push: { myPatient: req.body } }, function (err2, updatedata) {
            if (err2 && !updatedata) {
                res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err2 })
            } else {
                res.json({ status: 200, hassuccessed: true, message: "Add to Patient list", data: updatedata })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/Mypatients', function (req, res, next) {
    Mypat = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({ _id: legit.id },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    if (doc && doc.length > 0) {
                        if (doc[0].myPatient.length > 0) {
                            forEachPromise(doc[0].myPatient, getMyPat)
                                .then((result) => {
                                    res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: Mypat })
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
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}
function getMyPat(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            const profile_id = data.profile_id;
            const messageToSearchWith = new User({profile_id});
            messageToSearchWith.encryptFieldsSync();
            User.findOne({$or:[{ profile_id: data.profile_id },{profile_id : messageToSearchWith.profile_id}]}).exec()
            .then(function (doc3) {
                if (doc3) {
                    Mypat.push(doc3)
                    resolve(Mypat);
                }
                else {
                    resolve(Mypat);
                }
            })
        });
    });
}

function GetUpcomingAppoint(item) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
        var new_data = item;
        if(new_data.appointment_type==="appointments"){
            console.log('I am here34',item.appointment_type )
            User.findOne({type: 'doctor', _id: item.doctor_id }).exec()
            .then(function(doc3){
                if(doc3){
                    if(doc3.private_appointments && doc3.private_appointments.length>0)
                    {
                        var custom_text = doc3.private_appointments[0].custom_text;
                        new_data.custom_text = custom_text;
                   
                    } 
                }
                GetUpcomingAppoint1.push(new_data); 
                resolve(GetUpcomingAppoint1);
            })
        }
        else{
            console.log('I am here36',item.appointment_type )
            GetUpcomingAppoint1.push(item); 
            resolve(GetUpcomingAppoint1);
        }
            
        })
    })
}   

function GetPastAppoint(item) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
        var new_data = item;
        if(item.appointment_type==="appointments"){
            User.findOne({type: 'doctor', _id: item.doctor_id }).exec()
            .then(function(doc3){
                if(doc3){
                    if(doc3.private_appointments && doc3.private_appointments.length>0)
                    {
                        var custom_text = doc3.private_appointments[0].custom_text;
                        new_data.custom_text = custom_text;
                   
                    } 
                }
                return new_data;
            }).then(function(new_data){
                GetPastAppoint1.push(new_data); 
                resolve(GetPastAppoint1);
            })
        }
        else{
            GetPastAppoint1.push(new_data); 
            resolve(GetPastAppoint1);
        }
            
        })
    })
}   

router.delete('/Mypatients/:patient_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
      
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
        Appointment.find({ patient: legit.id, status: 'accept' }, function (err, userdata) {
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
                var enpassword = base64.encode(JSON.stringify(encrypt(req.body.password)));
                req.body.password = enpassword;
                datas = { ...req.body, ...parent_id }
                var users = new User(datas);
                var user_id;
                users.save(function (err, user_data) {
                    if (err && !user_data) {
                        res.json({ status: 200, message: 'Something went wrong.', error: err });
                    } else {
                        user_id = user_data._id;
                        User.findOne({ _id: user_id },
                            function (err, doc) {
                                if (err && !doc) {
                                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err });
                                }
                                else {
                                res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: doc });
                            }
                        })
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
                var dhtml = 'Sie haben eine Zweitmeinung (second opinion) von ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' beantragt.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' ) ' + 'wird sich der Sache annehmen und Sie via E-Mail kontaktieren.<br/>' +
                    'Wir bitten um 24 bis 48 Stunden Geduld. Sollten Sie Rückfragen haben, bitten wir Sie sich via contact@aimedis.com oder WhatsApp bei uns zu melden.<br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml = 'You have requested a second opinion from ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + '.<br/>' +
                    req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' ( ' + req.body.docProfile.email + ' )' + ' will take care of the matter and contact you via email.<br/>' +
                    'We ask for patience 24 to 48 hours. If you have any questions, please contact us via contact@aimedis.com or WhatsApp.<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            if (req.body.lan === 'de') {
                var dhtml2 = ' Sie haben eine Zweitmeinung (second opinion) Anfrage von ' + req.body.patient_info.patient_id + ' erhalten. ' +
                    'Bitte überprüfen Sie diese innerhalb des Systems. <br/><br/><br/>' +
                    '<b>Ihr Aimedis Team </b>'
            }
            else {
                var dhtml2 = 'You have received a second opinion inquiry from ' + req.body.patient_info.patient_id + '<br/>' +
                    'Please check the inquiry inside the Aimedis system. .<br/><br/><br/> ' +
                    '<b>Your Aimedis team </b>'
            }
            var mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.patient_info.email,
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
 
    if (legit) {
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
        User.find({ type: 'doctor' }, function (err, Userinfo) {
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
        User.find({ type: 'patient' }, function (err, Userinfo) {
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
router.get('/NursePharmaChat', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({
            $or: [{ type: 'nurse' },
            { type: 'pharmacy' }, { type: 'therapist' }]
        }, function (err, Userinfo) {
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
                const profile_id = req.body.doctor;
                const messageToSearchWith = new User({profile_id});
                messageToSearchWith.encryptFieldsSync();
                User.findOne({$or: [{ profile_id: req.body.doctor },{profile_id: messageToSearchWith.profile_id}]}, function (err1, userdata1) {
                    if (err1) {
                        res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                    } else {
                        if (userdata1) {
                           
                            User.find({ _id: userdata._id, fav_doctor: { $elemMatch: {$or: [{ doctor: req.body.doctor },{doctor: messageToSearchWith.profile_id}]} } }, function (err2, userdata2) {
                                if (err2) {
                                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                                } else {
                                    if (userdata2.length != 0) {
                                        res.json({ status: 200, hassuccessed: false, message: "Doctor already exists", error: err })
                                    } else {
                                        User.findByIdAndUpdate({ _id: userdata._id }, { parent_id: userdata1._id, $push: { fav_doctor: req.body } }, function (err2, updatedata) {
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

router.put('/AddFavDoc1/:user_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const profile_id = req.body.doctor;
        const messageToSearchWith = new User({profile_id});
        messageToSearchWith.encryptFieldsSync();
        const messageToSearchWith2 = new User({profile_id : req.params.user_id});
        messageToSearchWith2.encryptFieldsSync();
         
        User.findOne({$or: [{ profile_id: req.params.user_id },{profile_id: messageToSearchWith2.profile_id}]}, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
               
                User.findOne({$or:[{ profile_id: req.body.doctor }, {profile_id: messageToSearchWith.profile_id}]}, function (err1, userdata1) {
                    if (err1) {
                        res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                    } else {
                    
                        if (userdata1) {
                            User.find({ _id: userdata._id, fav_doctor: { $elemMatch: {$or:[{ doctor: req.body.doctor }, {doctor: messageToSearchWith.profile_id}]} } }, function (err2, userdata2) {
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
                const profile_id = req.body.doctor;
                const messageToSearchWith = new User({profile_id});
                messageToSearchWith.encryptFieldsSync();
                User.findOne({$or: [{ profile_id: req.body.doctor },{profile_id : messageToSearchWith.profile_id}]}, function (err1, userdata1) {
                    if (err1) {
                        res.json({ status: 200, hassuccessed: false, message: "Invalid doctor Id", error: err1 })
                    } else {
                        if (userdata1) {
                            User.find({ _id: userdata._id, fav_doctor: { $elemMatch: { doctor: req.body.doctor } } }, function (err2, userdata2) {
                                if (err2) {
                                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                                } else {
                                    User.findOneAndUpdate({ _id: userdata._id, 'fav_doctor.profile_id': req.body.doctor }, {
                                        $set: {
                                            'fav_doctor.$.type': 'active',
                                            parent_id: userdata1._id
                                        }
                                    }, function (err2, updatedata) {
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
                const profile_id = req.params.id;
                const messageToSearchWith = new User({profile_id});
                messageToSearchWith.encryptFieldsSync();
                User.find({ $or:[{ profile_id: req.params.id},{profile_id: messageToSearchWith.profile_id}], fav_doctor: { $elemMatch: { doctor: userdata.profile_id } } }, function (err2, userdata2) {
                    if (err2) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                    
                        if (userdata2.length != 0) {
                            res.json({ status: 200, hassuccessed: false, message: "Doctor already exists", error: err })
                        } else {
                            var data = { doctor: userdata.profile_id, profile_id: userdata.profile_id, type: 'recommended' };
                            
                            User.findOneAndUpdate({$or : [{ profile_id: req.params.id }, {profile_id: messageToSearchWith.profile_id}]}, { $push: { fav_doctor: data } }, { upsert: true }, function (err2, updatedata) {
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
        res.json({ status: 200, hassuccessed: false, message: 'A uthentication required.' })
    }
})

/*-----------------------D-E-L-E-T-E---F-A-V-O-U-R-I-T-E---D-O-C-T-O-R-------------------------*/

router.delete('/favDocs/:User_id/:patient_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {

        const profile_id = req.params.User_id;
        const messageToSearchWith = new User({profile_id});
        messageToSearchWith.encryptFieldsSync();

        User.update({ _id: legit.id }, { parent_id: "0", $pull: { fav_doctor:  {$or : [{ doctor: req.params.User_id },{ doctor: messageToSearchWith.profile_id }]} } },
            { multi: true },
            function (err, userdata) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                } else {
                        const profile_ids =  req.params.patient_id ;
                        const messageToSearchWith1 = new User({profile_ids});
                        messageToSearchWith1.encryptFieldsSync();
                    User.update({ profile_id: req.params.User_id }, { $pull: { myPatient: {$or: [{ profile_id: req.params.patient_id },{profile_id: messageToSearchWith1.profile_ids}]} } },
                        { multi: true },
                        function (err, userdata2) {
                            if (err) {
                                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                            } else {
                                res.json({ status: 200, hassuccessed: true, message: 'Deleted Successfully' });
                            }
                        })

                }
            })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


router.delete('/favPatients/:User_id/:doctor_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.update({ profile_id: req.params.User_id }, { parent_id: "0", $pull: { fav_doctor: { doctor: req.params.doctor_id } } },
        { multi: true },
        function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                User.update({ _id: legit.id }, { $pull: { myPatient: { profile_id: req.params.User_id } } },
                { multi: true },
                function (err, userdata2) {
                    if (err) {
                        res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                    } else {
                        res.json({ status: 200, hassuccessed: true, message: 'Deleted Successfully' });
                    }
                })
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
                var dt = dateTime.create();
                Appointment.findOneAndUpdate({ _id: userdata._id }, { $set: { status: req.body.status, accept_datetime: dt.format('Y-m-d H:M:S') } }, { new: true }, function (err, updatedata) {
                    if (err && !updatedata) {
                        res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                    } else {
                        if (req.body.status === 'accept') {
                           
                            if (req.body.lan === 'de') {
                                var dhtml = 'Ihre Terminanfrage wurde von ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + '.<br/>' +
                                    '<b>Ihr Aimedis Team </b>'

                            }
                            else {
                                var dhtml = 'Your Appointment Request Accepted by ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + '.<br/>' +
                                    '<b>Your Aimedis team </b>'

                            }

                            var mailOptions = {
                                from: "contact@aimedis.com",
                                to: req.body.email,
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


router.post('/abletocancel/:doctor_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({_id: req.params.doctor_id}, function(err, Userinfo){
            if(err){
                res.json({ status: 200, hassuccessed: false, msg: "something went wrong" });
            }
            else{
               var appot = req.body.appointment_type ==='appointments' ? Userinfo.private_appointments
               : req.body.appointment_type ==='online_apointment'? Userinfo.online_appointment : Userinfo.days_for_practices
               console.log('appot[0].appointment_hours', appot[0].appointment_hours)
               if(appot && appot.length>0 && appot[0].appointment_hours)
               {
                   if(req.body.timedifference > appot[0].appointment_hours)
                   {
                        res.json({ status: 200, hassuccessed: true, msg: "this is able to remove" });
                   }
                   else{
                        res.json({ status: 200, hassuccessed: false, msg: "this is not able to remove" });
                   } 
               }
               else{
                    res.json({ status: 200, hassuccessed: true, msg: "this is able to remove" });  
               }
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
/*-----------------------G-E-T---L-O-C-A-T-I-O-N-------------------------*/

function getTimeStops(start, end, timeslots, breakstart, breakend) {
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
                        if (Userinfo[i].private_appointments[j].custom_text) {
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
                    for (let l = 0; l < Userinfo[i].days_for_practices.length; l++) {
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
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
                        practice_days: Practices,

                    })
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
        });
    }
})
router.get('/timeSuggest', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    User.findOne({
        _id: legit.id,
    }, function (error, Userinfo) {
        if (error) {
            res.json({
                status: 200,
                hassuccessed: false,
                error: error
            })
        } else {
            var getAvailable = Userinfo && Userinfo.paid_services && Userinfo.paid_services.length>0 && Userinfo.paid_services.filter((data)=>data.description === 'appointment')

            
                var user = [];
                var online_users = [];
                var Practices = [];
                var monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="", holidays_end="", holidays_start= "", breakslot_start="",breakslot_end="", appointment_days="";
                if(Userinfo.we_offer && Userinfo.we_offer.Offer_office_prescription){
                for (let j = 0; j < Userinfo.private_appointments.length; j++) {
                    if (Userinfo.private_appointments[j].custom_text) {
                        custom_text = Userinfo.private_appointments[j].custom_text;
                    }
                    if (Userinfo.private_appointments[j].appointment_days) {
                        appointment_days = Userinfo.private_appointments[j].appointment_days;
                    }
                    if (Userinfo.private_appointments[j].holidays_start) {
                        holidays_start = Userinfo.private_appointments[j].holidays_start;
                    }
                    if (Userinfo.private_appointments[j].holidays_end) {
                        holidays_end = Userinfo.private_appointments[j].holidays_end;
                    }
                    if (Userinfo.private_appointments[j].breakslot_start) {
                        breakslot_start = Userinfo.private_appointments[j].breakslot_start;
                    }
                    if (Userinfo.private_appointments[j].breakslot_end) {
                        breakslot_end = Userinfo.private_appointments[j].breakslot_end;
                    }
                    if (Userinfo.private_appointments[j].monday_start, Userinfo.private_appointments[j].monday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        monday = getTimeStops(Userinfo.private_appointments[j].monday_start, Userinfo.private_appointments[j].monday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].tuesday_start, Userinfo.private_appointments[j].tuesday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        tuesday = getTimeStops(Userinfo.private_appointments[j].tuesday_start, Userinfo.private_appointments[j].tuesday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].wednesday_start, Userinfo.private_appointments[j].wednesday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        wednesday = getTimeStops(Userinfo.private_appointments[j].wednesday_start, Userinfo.private_appointments[j].wednesday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].thursday_start, Userinfo.private_appointments[j].thursday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        thursday = getTimeStops(Userinfo.private_appointments[j].thursday_start, Userinfo.private_appointments[j].thursday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].friday_start, Userinfo.private_appointments[j].friday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        friday = getTimeStops(Userinfo.private_appointments[j].friday_start, Userinfo.private_appointments[j].friday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].saturday_start, Userinfo.private_appointments[j].saturday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        saturday = getTimeStops(Userinfo.private_appointments[j].saturday_start, Userinfo.private_appointments[j].saturday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                    if (Userinfo.private_appointments[j].sunday_start, Userinfo.private_appointments[j].sunday_end, Userinfo.private_appointments[j].duration_of_timeslots) {
                        sunday = getTimeStops(Userinfo.private_appointments[j].sunday_start, Userinfo.private_appointments[j].sunday_end, Userinfo.private_appointments[j].duration_of_timeslots)
                    }
                
                    user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text, breakslot_end, breakslot_start, holidays_end, holidays_start , appointment_days})    
                }
            }
                monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="",breakslot_start="",breakslot_end="", holidays_end="", holidays_start= "", appointment_days="";
                if(Userinfo.we_offer && Userinfo.we_offer.Offre_online_appointments){
                for (let k = 0; k < Userinfo.online_appointment.length; k++) {
                    if (Userinfo.online_appointment[k].appointment_days) {
                        appointment_days = Userinfo.online_appointment[k].appointment_days;
                    }
                    if (Userinfo.online_appointment[k].holidays_end) {
                        holidays_end = Userinfo.online_appointment[k].holidays_end;
                    }
                    if (Userinfo.online_appointment[k].holidays_start) {
                        holidays_start = Userinfo.online_appointment[k].holidays_start;
                    }
                    if (Userinfo.online_appointment[k].breakslot_start) {
                        breakslot_start = Userinfo.online_appointment[k].breakslot_start;
                    }
                    if (Userinfo.online_appointment[k].breakslot_end) {
                        breakslot_end = Userinfo.online_appointment[k].breakslot_end;
                    }
                    if (Userinfo.online_appointment[k].monday_start, Userinfo.online_appointment[k].monday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        monday = getTimeStops(Userinfo.online_appointment[k].monday_start, Userinfo.online_appointment[k].monday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].tuesday_start, Userinfo.online_appointment[k].tuesday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        tuesday = getTimeStops(Userinfo.online_appointment[k].tuesday_start, Userinfo.online_appointment[k].tuesday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].wednesday_start, Userinfo.online_appointment[k].wednesday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        wednesday = getTimeStops(Userinfo.online_appointment[k].wednesday_start, Userinfo.online_appointment[k].wednesday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].thursday_start, Userinfo.online_appointment[k].thursday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        thursday = getTimeStops(Userinfo.online_appointment[k].thursday_start, Userinfo.online_appointment[k].thursday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].friday_start, Userinfo.online_appointment[k].friday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        friday = getTimeStops(Userinfo.online_appointment[k].friday_start, Userinfo.online_appointment[k].friday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].saturday_start, Userinfo.online_appointment[k].saturday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        saturday = getTimeStops(Userinfo.online_appointment[k].saturday_start, Userinfo.online_appointment[k].saturday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    if (Userinfo.online_appointment[k].sunday_start, Userinfo.online_appointment[k].sunday_end, Userinfo.online_appointment[k].duration_of_timeslots) {
                        sunday = getTimeStops(Userinfo.online_appointment[k].sunday_start, Userinfo.online_appointment[k].sunday_end, Userinfo.online_appointment[k].duration_of_timeslots)
                    }
                    online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_start, breakslot_end, holidays_start, holidays_end, appointment_days })
                }
            }
            monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="", breakslot_start="",breakslot_end="", holidays_start="",appointment_days="", holidays_end="";
                if(Userinfo.we_offer && Userinfo.we_offer.Offer_practice_appointment){
                
                for (let l = 0; l < Userinfo.days_for_practices.length; l++) {
                    
                    if (Userinfo.days_for_practices[l].appointment_days) {
                        appointment_days = Userinfo.days_for_practices[l].appointment_days;
                    }
                    if (Userinfo.days_for_practices[l].holidays_start) {
                        holidays_start = Userinfo.days_for_practices[l].holidays_start;
                    }
                    if (Userinfo.days_for_practices[l].holidays_end) {
                        holidays_end = Userinfo.days_for_practices[l].holidays_end;
                    }
                    if (Userinfo.days_for_practices[l].breakslot_start) {
                        breakslot_start = Userinfo.days_for_practices[l].breakslot_start;
                    }
                    if (Userinfo.days_for_practices[l].breakslot_end) {
                        breakslot_end = Userinfo.days_for_practices[l].breakslot_end;
                    }
                    if (Userinfo.days_for_practices[l].monday_start, Userinfo.days_for_practices[l].monday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        monday = getTimeStops(Userinfo.days_for_practices[l].monday_start, Userinfo.days_for_practices[l].monday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].tuesday_start, Userinfo.days_for_practices[l].tuesday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        tuesday = getTimeStops(Userinfo.days_for_practices[l].tuesday_start, Userinfo.days_for_practices[l].tuesday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].wednesday_start, Userinfo.days_for_practices[l].wednesday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        wednesday = getTimeStops(Userinfo.days_for_practices[l].wednesday_start, Userinfo.days_for_practices[l].wednesday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].thursday_start, Userinfo.days_for_practices[l].thursday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        thursday = getTimeStops(Userinfo.days_for_practices[l].thursday_start, Userinfo.days_for_practices[l].thursday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].friday_start, Userinfo.days_for_practices[l].friday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        friday = getTimeStops(Userinfo.days_for_practices[l].friday_start, Userinfo.days_for_practices[l].friday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].saturday_start, Userinfo.days_for_practices[l].saturday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        saturday = getTimeStops(Userinfo.days_for_practices[l].saturday_start, Userinfo.days_for_practices[l].saturday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    if (Userinfo.days_for_practices[l].sunday_start, Userinfo.days_for_practices[l].sunday_end, Userinfo.days_for_practices[l].duration_of_timeslots) {
                        sunday = getTimeStops(Userinfo.days_for_practices[l].sunday_start, Userinfo.days_for_practices[l].sunday_end, Userinfo.days_for_practices[l].duration_of_timeslots)
                    }
                    Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_start, breakslot_end, holidays_start, holidays_end, appointment_days })
                }
            }
            if(Userinfo && getAvailable  && getAvailable.length>0)
            {
                var finalArray = {
                    data: Userinfo,
                    appointments: user,
                    online_appointment: online_users,
                    practice_days: Practices
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
            else{
                custom_text = ""
                if (Userinfo.private_appointments && Userinfo.private_appointments.length>0 && Userinfo.private_appointments[0].custom_text) {
                    custom_text = Userinfo.private_appointments[0].custom_text;
                }
                var finalArray = {
                    data: Userinfo,
                    appointments: [{custom_text: custom_text}],
                    online_appointment: [],
                    practice_days: []
                }
                res.json({ status: 200, hassuccessed: true, data: finalArray });
            }
        }
    })
}
else {
    res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
}

});

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
            }, type: 'doctor', 'paid_services.description': "appointment"
        }).find((error, Userinfo) => {
            if (error) {
                res.json({ status: 200, hassuccessed: false, error: error })
            } else {
                var finalArray = [];
                for (let i = 0; i < Userinfo.length; i++) {
                    var user = [];
                    var online_users = [];
                    var Practices = [];
                    var monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="", breakslot_start="",breakslot_end="", holidays_end="", holidays_start="", appointment_days="";
                    if(Userinfo[i].we_offer && Userinfo[i].we_offer.Offer_office_prescription){
                        for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
                            if (Userinfo[i].private_appointments[j].custom_text) {
                                custom_text = Userinfo[i].private_appointments[j].custom_text;
                            }
                            if (Userinfo[i].private_appointments[j].appointment_days) {
                                appointment_days = Userinfo[i].private_appointments[j].appointment_days;
                            }
                            if (Userinfo[i].private_appointments[j].holidays_start) {
                                holidays_start = Userinfo[i].private_appointments[j].holidays_start;
                            }
                            if (Userinfo[i].private_appointments[j].holidays_end) {
                                holidays_end = Userinfo[i].private_appointments[j].holidays_end;
                            }
                            if (Userinfo[i].private_appointments[j].breakslot_start) {
                                breakslot_start = Userinfo[i].private_appointments[j].breakslot_start;
                            }
                            if (Userinfo[i].private_appointments[j].breakslot_end) {
                                breakslot_end = Userinfo[i].private_appointments[j].breakslot_end;
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
                        
                            user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text, breakslot_end, breakslot_start , holidays_start, holidays_end, appointment_days })    
                        }
                    }
                     monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="",breakslot_start="",breakslot_end="", holidays_start="", holidays_end="", appointment_days="";
                if(Userinfo[i].we_offer && Userinfo[i].we_offer.Offre_online_appointments){
                     for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
                        if (Userinfo[i].online_appointment[k].appointment_days) {
                            appointment_days = Userinfo[i].online_appointment[k].appointment_days;
                        }
                        if (Userinfo[i].online_appointment[k].holidays_start) {
                            holidays_start = Userinfo[i].online_appointment[k].holidays_start;
                        }
                        if (Userinfo[i].online_appointment[k].holidays_end) {
                            holidays_end = Userinfo[i].online_appointment[k].holidays_end;
                        }
                        if (Userinfo[i].online_appointment[k].breakslot_start) {
                            breakslot_start = Userinfo[i].online_appointment[k].breakslot_start;
                        }
                        if (Userinfo[i].online_appointment[k].breakslot_end) {
                            breakslot_end = Userinfo[i].online_appointment[k].breakslot_end;
                        }
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
                        online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_start, breakslot_end, holidays_start, holidays_end,appointment_days })
                    }
                }
                if(Userinfo[i].we_offer && Userinfo[i].we_offer.Offer_practice_appointment){
                
                     monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="", breakslot_start="",breakslot_end="", holidays_start="", holidays_end="", appointment_days="";
                    for (let l = 0; l < Userinfo[i].days_for_practices.length; l++) {
                        if (Userinfo[i].days_for_practices[l].appointment_days) {
                            appointment_days = Userinfo[i].days_for_practices[l].appointment_days;
                        }
                        if (Userinfo[i].days_for_practices[l].holidays_start) {
                            holidays_start = Userinfo[i].days_for_practices[l].holidays_start;
                        }
                        if (Userinfo[i].days_for_practices[l].holidays_end) {
                            holidays_end = Userinfo[i].days_for_practices[l].holidays_end;
                        }
                        if (Userinfo[i].days_for_practices[l].breakslot_start) {
                            breakslot_start = Userinfo[i].days_for_practices[l].breakslot_start;
                        }
                        if (Userinfo[i].days_for_practices[l].breakslot_end) {
                            breakslot_end = Userinfo[i].days_for_practices[l].breakslot_end;
                        }
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
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
                        Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_start, breakslot_end, holidays_end, holidays_start, appointment_days })
                    }
                }
                    
                    finalArray.push({
                        data: Userinfo[i],
                        appointments: user,
                        online_appointment: online_users,
                        practice_days: Practices
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
            }, type: 'doctor', 'speciality.value':  req.query.speciality
        }).find((error, Userinfo) => {
            if (error) {
                res.json({ status: 200, hassuccessed: false, error: error })
            } else {
                var finalArray = [];
             
                for (let i = 0; i < Userinfo.length; i++) {
                    var user = [];
                    var online_users = [];
                    var Practices = [];
                    var monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], custom_text="", breakslot_start="",breakslot_end="", holidays_end="", holidays_start="", appointment_days="";
                    for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
                        if (Userinfo[i].private_appointments[j].custom_text) {
                            custom_text = Userinfo[i].private_appointments[j].custom_text;
                        }
                        if (Userinfo[i].private_appointments[j].appointment_days) {
                            appointment_days = Userinfo[i].private_appointments[j].appointment_days;
                        }
                        if (Userinfo[i].private_appointments[j].holidays_start) {
                            holidays_start = Userinfo[i].private_appointments[j].holidays_start;
                        }
                        if (Userinfo[i].private_appointments[j].holidays_end) {
                            holidays_end = Userinfo[i].private_appointments[j].holidays_end;
                        }
                        if (Userinfo[i].private_appointments[j].breakslot_start) {
                            breakslot_start = Userinfo[i].private_appointments[j].breakslot_start;
                        }
                        if (Userinfo[i].private_appointments[j].breakslot_end) {
                            breakslot_end = Userinfo[i].private_appointments[j].breakslot_end;
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
                        user.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, custom_text , breakslot_end, breakslot_start, holidays_end, holidays_start, appointment_days})
                    }
                    monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[],breakslot_start="",breakslot_end="", holidays_end="", holidays_start="", appointment_days="";
                    for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
                        if (Userinfo[i].private_appointments[k].appointment_days) {
                            appointment_days = Userinfo[i].online_appointment[k].appointment_days;
                        }
                        if (Userinfo[i].private_appointments[k].holidays_start) {
                            holidays_start = Userinfo[i].online_appointment[k].holidays_start;
                        }
                        if (Userinfo[i].private_appointments[k].holidays_end) {
                            holidays_end = Userinfo[i].online_appointment[k].holidays_end;
                        }
                        if (Userinfo[i].online_appointment[k].breakslot_start) {
                            breakslot_start = Userinfo[i].online_appointment[k].breakslot_start;
                        }
                        if (Userinfo[i].online_appointment[k].breakslot_end) {
                            breakslot_end = Userinfo[i].online_appointment[k].breakslot_end;
                        }
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
                        online_users.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_end, breakslot_start, holidays_end, holidays_start, appointment_days })
                    }
                     monday=[], tuesday=[], wednesday=[], thursday=[], friday=[], saturday=[], sunday=[], breakslot_start="",breakslot_end="", holidays_end="", holidays_start="", appointment_days="";
                    for (let l = 0; l < Userinfo[i].days_for_practices.length; l++) {
                        if (Userinfo[i].private_appointments[l].appointment_days) {
                            appointment_days = Userinfo[i].online_appointment[l].appointment_days;
                        }
                        if (Userinfo[i].private_appointments[l].holidays_start) {
                            holidays_start = Userinfo[i].online_appointment[l].holidays_start;
                        }
                        if (Userinfo[i].private_appointments[l].holidays_end) {
                            holidays_end = Userinfo[i].online_appointment[l].holidays_end;
                        }
                        if (Userinfo[i].days_for_practices[l].breakslot_start) {
                            breakslot_start = Userinfo[i].days_for_practices[l].breakslot_start;
                        }
                        if (Userinfo[i].days_for_practices[l].breakslot_end) {
                            breakslot_end = Userinfo[i].days_for_practices[l].breakslot_end;
                        }
                        if (Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            monday = getTimeStops(Userinfo[i].days_for_practices[l].monday_start, Userinfo[i].days_for_practices[l].monday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            tuesday = getTimeStops(Userinfo[i].days_for_practices[l].tuesday_start, Userinfo[i].days_for_practices[l].tuesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
                        }
                        if (Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots) {
                            wednesday = getTimeStops(Userinfo[i].days_for_practices[l].wednesday_start, Userinfo[i].days_for_practices[l].wednesday_end, Userinfo[i].days_for_practices[l].duration_of_timeslots)
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
                        Practices.push({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, breakslot_end, breakslot_start, holidays_end, holidays_start, appointment_days })
                    }
                    finalArray.push({
                        data: Userinfo[i],
                        appointments: user,
                        online_appointment: online_users,
                        practice_days: Practices
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
                
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong1.' });
                } else {
                    message.find({ sender_id: legit.id }, function (err, send_message) {
                        if (err && !recieve_message) {
                           
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


router.put('/setpassword', function (req, res, next) {
    const token = (req.headers.token);
   
    let legit = jwtconfig.verify(token)
    if (legit) {
        var enpassword = base64.encode(JSON.stringify(encrypt(req.query.password)));
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
        const profile_id = req.params.UserId;
        const alies_id = req.params.UserId;
        const messageToSearchWith = new User({profile_id});
        const messageToSearchWith1 = new User({alies_id});
        messageToSearchWith.encryptFieldsSync();
        messageToSearchWith1.encryptFieldsSync();
        User.findOne( {$or:[ {alies_id : messageToSearchWith1.alies_id},{ profile_id :  messageToSearchWith.profile_id}, {alies_id : req.params.UserId}, { profile_id : req.params.UserId }]})

            .exec(function (err, doc) {
                if (err && !dofc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                } else {
                    if (doc == null || doc == 'undefined') {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not exist' })

                    }
                    else {
                        var m = new Date();
                        var dateString = m.getUTCFullYear() + "/" + (m.getUTCMonth() + 1) + "/" + m.getUTCDate() + " " + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
                       
                        if (req.body.lan === 'de') {


                            var dhtml =
                                'Es gab einen Notfallzugriff auf die Daten in Ihrem Aimedis Profil.<br/>' +
                                'Der Notfallzugriff erfolgte durch <b>' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' am ' + dateString + '</b>.<br/>' +
                                'Sollte es sich Ihrer Meinung nach um einen missbräuchlichen Zugriff handeln, so wenden Sie sich bitte<br/>' +
                                'unverzüglich unter der E-Mail Adresse contact@aimedis.com an uns.<br/> <br/>' +
                                'Herzliche Grüße und alles Gute<br/>' +
                                '<b>Ihr Aimedis Team </b>'

                        }
                        else {
                            var dhtml = 'There was an emergency access to the data in your Aimedis profile.<br/>' +
                                'The emergency access was made by <b>' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' on ' + dateString + '</b>.<br/>' +
                                'If you believe that the access is improper, please contact us immediately via contact@aimedis.com.<br/><br/>'
                            'Best regards<br/>' +
                                '<b>Your Aimedis team </b>'
                        }
                        if (req.body.lan === 'de') {
                            var dhtml2 = 'Es gab einen Notfallzugriff auf die Daten in Ihrem Aimedis Profils von </b>' + doc.first_name + ' ' + doc.last_name + ' ( ' + doc.profile_id + ' ).</b><br/>' +
                                'Der Notfallzugriff erfolgte durch <b>' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' am ' + dateString + '</b>.<br/>' +
                                'Sollte es sich Ihrer Meinung nach um einen missbräuchlichen Zugriff handeln, so wenden Sie sich bitte<br/>' +
                                'unverzüglich unter der E-Mail Adresse contact@aimedis.com an uns.<br/> <br/>' +
                                'Herzliche Grüße und alles Gute<br/>' +
                                '<b>Ihr Aimedis Team </b>'
                        }
                        else {
                            var dhtml2 = 'There was an emergency access to the data in your Aimedis profile of <b>' + doc.first_name + ' ' + doc.last_name + ' ( ' + doc.profile_id + ' )</b><br/>' +
                                'The emergency access was made by <b>' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' on ' + dateString + '</b>.<br/>' +
                                'If you believe that the access is improper, please contact us immediately via contact@aimedis.com.<br/><br/>'
                            'Best regards<br/>' +
                                '<b>Your Aimedis team </b>'
                        }
                        var mailOptions = {
                            from: "contact@aimedis.com",
                            to: doc.email,
                            subject: 'Emergency Access',
                            html: dhtml
                        };
                        sendSms(doc.mobile, 'There was an emergency an access to the data in your Aimedis profile ( ' + doc.profile_id + ' ) by Doctor - ' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' on ' + dateString).then(result => {
                           
                        }).catch(e => {
                            console.log('Message is not sent', e)
                        })
                        if(doc.emergency_number && doc.emergency_number !== ''){
                            sendSms(doc.emergency_number, 'There was an emergency access to the data in'+ doc.first_name+' '+doc.last_name +' Aimedis profile ( ' + doc.profile_id + ' ) by Doctor - ' + req.body.current_info.profile_id + ' - ' + req.body.current_info.first_name + ' ' + req.body.current_info.last_name + ' on ' + dateString).then(result => {
                             
                            }).catch(e => {
                                console.log('Message is not sent', e)
                            })
                        }
                        if (req.body.comefrom === 'pharmacy') {
                            
                            if (req.body.pin && req.body.pin == doc.pin && req.body.pin !== "") {
                               
                                var sendmail = transporter.sendMail(mailOptions)
                                if (doc.emergency_email && doc.emergency_email !== '') {
                                    var mailOptions2 = {
                                        from: "contact@aimedis.com",
                                        to: doc.emergency_email,
                                        subject: 'Emergency Access',
                                        html: dhtml2
                                    };
                                    var sendmail2 = transporter.sendMail(mailOptions2)
                                }
                                res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id: doc._id })
                            }
                            else {
                                res.json({ status: 200, hassuccessed: false, msg: 'Pin is not correct' })
                            }
                        }
                        else {
                            var sendmail = transporter.sendMail(mailOptions)
                            if (doc.emergency_email && doc.emergency_email !== '') {
                                var mailOptions2 = {
                                    from: "contact@aimedis.com",
                                    to: doc.emergency_email,
                                    subject: 'Emergency Access',
                                    html: dhtml2
                                };
                                var sendmail2 = transporter.sendMail(mailOptions2)
                            }
                            res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id: doc._id })
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
        const email = req.query.email;
        const messageToSearchWith = new User({email});
        messageToSearchWith.encryptFieldsSync();
        User.findOne({ $or:[{email: req.query.email},{email: messageToSearchWith.email}]
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
            var link = 'https://sys.aimedis.io/change-password';
            if (req.body.passFrom === 'landing') {
                link = '/change-password';
                // link = 'https://aidoc.io/change-password'
                link = 'https://sys.aimedis.io/change-password';
            }
            // var link = 'http://aidoc.io/change-password';
           
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
    
            var sendmail = transporter.sendMail(mailOptions)
            if (sendmail) {
                res.json({ status: 200, msg: 'Mail is sent' })
            }
            else {
               res.json({ status: 200, msg: 'Mail is not sent' })
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
            var dhtml = 'Der Doktor (' + req.body.first_name + ' ' + req.body.last_name + ') Ich möchte, dass Sie Aimedis beitreten. Schickte auch diese Nachricht an Sie- <br/>' +
                '<b>' + req.body.message + '</b><br/><br/><br/>' +
                '<b>Ihr Aimedis Team</b><br/>' +
                '<b>Webadresse: </b> <a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
                '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';
        }
        else {
            var dhtml = 'The doctor (' + req.body.first_name + ' ' + req.body.last_name + ') want to you join Aimedis. Also sent this message to you - <br/> . ' +
                '<b>' + req.body.message + '</b><br/><br/><br/>' +
                '<b>Ihr Aimedis Team</b><br/>' +
                '<b>Website Url:</b><a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
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
            res.json({ status: 200, hassuccessed: false, msg: 'Mail is not sent' })
        }
    }
    else {
        res.status(401).json({ status: 401, success: false, message: 'Authentication required.' })
    }
})
router.get('/AskPatientProfile/:id', function (req, res, next) {
    const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
        const profile_id = req.params.id;
        const alies_id = req.params.id;
        const messageToSearchWith = new User({profile_id});
        const messageToSearchWith1 = new User({alies_id});
        const email = req.params.id;
        const messageToSearchWith2 = new User({email});
        messageToSearchWith2.encryptFieldsSync();
        messageToSearchWith.encryptFieldsSync();
        messageToSearchWith1.encryptFieldsSync();
        User.findOne({type : 'patient',
            $or: [{ email: req.params.id },{email: messageToSearchWith2.email}, 
                {alies_id : messageToSearchWith1.alies_id},{ profile_id :  messageToSearchWith.profile_id},
                {profile_id: req.params.id},{alies_id: req.params.id} ]
        }).exec()
            .then((user_data1) => {
                if (user_data1) {
                    res.json({ status: 200, hassuccessed: true, msg: 'Data is exist', data: user_data1 })
                }
                else {
                    res.json({ status: 450, hassuccessed: false, msg: 'User does not exist' })
                }
            })
    }
    else {
        res.status(401).json({ status: 401, success: false, message: 'Authentication required.' })
    }
})

router.post('/AskPatient/:id', function (req, res, next) {
    const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
        const profile_id = req.params.id;
        const alies_id = req.params.id;
        const messageToSearchWith = new User({profile_id});
        const messageToSearchWith1 = new User({alies_id});
        messageToSearchWith.encryptFieldsSync();
        messageToSearchWith1.encryptFieldsSync();
        User.findOne({ type: 'patient', $or :  [
            {alies_id : messageToSearchWith1.alies_id},{ profile_id :  messageToSearchWith.profile_id},{profile_id: req.params.id },{alies_id :req.params.id  }]}).exec()
            .then((user_data1) => {
                if (user_data1) {
                    // var Link1 = 'https://aidoc.io/patient'
                    var Link1 = 'https://sys.aimedis.io/patient'
                    if (req.body.lan === 'de') {
                        var dhtml = 'Sie haben die Anfrage erhalten, einen neuen DOKTOR (' + req.body.first_name + ' ' + req.body.last_name + ')' +
                            ' zu Ihrer Liste vertrauenswürdiger privater Ärzte hinzuzufügen. Um diese Anfrage anzunehmen / abzulehnen / zu verschieben, folgen Sie bitte dem <a target="_blank" href="' + Link1 + '">LINK</a>.<br/><br/><br/> ' +
                            '<b>Ihr Aimedis Team</b><br/>' +
                            '<b>Webadresse: </b> <a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
                            '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';
                    }
                    else {
                        var dhtml = 'You got a request to add a new DOCTOR (' + req.body.first_name + ' ' + req.body.last_name + ')'+
                            ' to your trusted private doctor list. To accept / decline / postpone this request please follow the <a target="_blank" href="' + Link1 + '">LINK</a>.<br/><br/><br/> ' +
                            '<b>Your Aimedis team</b><br/>' +
                            '<b>Website Url:</b><a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
                            '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';
                    }

                    var mailOptions = {
                        from: "contact@aimedis.com",
                        to: user_data1.email,
                        subject: 'Private doctor request',
                        html: dhtml
                    };
                    var sendmail = transporter.sendMail(mailOptions)
                    if (sendmail) {
                        res.json({ status: 200, hassuccessed: true, msg: 'Mail is sent' })
                    }
                    else {
                       res.json({ status: 200, hassuccessed: false, msg: 'Mail is not sent' })
                    }
                }
                else {
                    res.json({ status: 450, hassuccessed: false, msg: 'User does not exist' })
                }
            })

    }
    else {
        res.status(401).json({ status: 401, success: false, message: 'Authentication required.' })
    }
})

router.get('/AllusersMessages', function (req, res, next) {
    const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find()
            .exec(function (err, Userinfo) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                } else {
                    res.json({ status: 200, hassuccessed: true, data: Userinfo });
                }
            });

    }
    else {
        res.status(401).json({ status: 401, success: false, message: 'Authentication required.' })
    }
}
)

///Add by Ankita (17-04-2020)

//Add by Ankita (01-07-2020)
// For landing pages
router.post('/requireCSV', function (req, res, next) {
    const todos = req.body.Content;
    // convert JSON array to CSV string
    var config1 = {
        method: 'get',
        url: 'https://aimedis.agilecrm.com/dev/api/contacts/search/email/' + req.body.Content.email,
        headers: {
            'Authorization': 'Basic bWljaGFlbC5rYWxkYXNjaEBhaW1lZGlzLmNvbTo2MnR0Y2lma2xucXZyY3Q2YXBrNjBlbzhlag==',
        }
    };
    axios(config1)
        .then(function (response) {
            if (response.data.id) {
                res.json({ status: 200, hassuccessed: false, msg: 'User already exist' })
            }
            else {
                if (req.body.Subject === "Aimedis Staff Recruitment") {
                    var staff = req.body.Content.staff;
                    staff.push(req.body.Content.industry)
                    var data = { tags: staff, type: "PERSON", properties: [{ type: "SYSTEM", name: "first_name", "value": req.body.Content.first_name }, { type: "SYSTEM", name: "last_name", value: req.body.Content.last_name }, { type: "SYSTEM", name: "email", subtype: "", value: req.body.Content.email }, { type: "SYSTEM", name: "company", value: req.body.Content.company }, { name: "phone", value: req.body.Content.phone, subtype: "" }] };
                    var config = {
                        method: 'post',
                        url: 'https://aimedis.agilecrm.com/dev/api/contacts',
                        headers: {
                            'Authorization': 'Basic bWljaGFlbC5rYWxkYXNjaEBhaW1lZGlzLmNvbTo2MnR0Y2lma2xucXZyY3Q2YXBrNjBlbzhlag==',
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    axios(config)
                        .then(function (response) {
                            converter.json2csv(todos, (err, csv) => {
                                if (err) {
                                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.55', error: err });
                                }
                                var mailOptions = {
                                    from: "contact@aimedis.com",
                                    to: "contact@aimedis.com",
                                    subject: req.body.Subject,
                                    html: 'Here the Attach file related to the ' + req.body.Subject + ' <br/><br/>' +
                                        '<b>Your Aimedis team </b>',
                                    attachments: [{
                                        filename: 'Reqested.csv',
                                        content: csv,
                                        contentType: 'text/csv'
                                    }]

                                };
                                var sendmail = transporter.sendMail(mailOptions)
                                res.json({ status: 200, hassuccessed: true, msg: 'Added in to CRM' })
                            })
                        })
                        .catch(function (error) {
                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong1' })
                        });
                }
                else {
                    var staff = []
                    staff.push(req.body.Content.qualification)
                    staff.push(req.body.Content.specilization)
                    staff.push(req.body.Content.profession)
                    var data = { tags: staff, type: "PERSON", properties: [{ type: "SYSTEM", name: "first_name", "value": req.body.Content.first_name }, { type: "SYSTEM", name: "last_name", value: req.body.Content.last_name }, { type: "SYSTEM", name: "email", subtype: "", value: req.body.Content.email }, { name: "phone", value: req.body.Content.phone, subtype: "" }] };
                
                    var config = {
                        method: 'post',
                        url: 'https://aimedis.agilecrm.com/dev/api/contacts',
                        headers: {
                            'Authorization': 'Basic bWljaGFlbC5rYWxkYXNjaEBhaW1lZGlzLmNvbTo2MnR0Y2lma2xucXZyY3Q2YXBrNjBlbzhlag==',
                            'Content-Type': 'application/json'
                        },
                        data: data
                    };
                    axios(config)
                        .then(function (response) {
                            converter.json2csv(todos, (err, csv) => {
                              
                                var mailOptions = {
                                    from: "contact@aimedis.com",
                                    to: "contact@aimedis.com",
                                    subject: req.body.Subject,
                                    html: 'Here the Attach file related to the ' + req.body.Subject + ' <br/><br/>' +
                                        '<b>Your Aimedis team </b>',
                                    attachments: [{
                                        filename: 'Reqested.csv',
                                        content: csv,
                                        contentType: 'text/csv'
                                    }]

                                };
                                if (err) {
                                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.45', error: err });
                                }
                                var sendmail = transporter.sendMail(mailOptions)
                                res.json({ status: 200, hassuccessed: true, msg: 'Added in to CRM' })
                            })
                        })
                        .catch(function (error) {
                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong2', err: error })
                        });
                }
            }
        })
        .catch(function (error) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong3' })
        });
});


router.post('/downloadPdf', function (req, res, next) {
    // Custom handlebar helper
    pdf.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    })

    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm"
    };
    var Data = [];
    {
        Object.entries(req.body.Dieseases).map(([key, value]) => {
            if (key !=='event_date' && key !== 'SARS' &&  key !== 'Positive_SARS' && key !== 'attachfile' && key !== 'created_by_image' && key !== 'created_by_profile' && key !== 'created_by_temp2' && key !== 'type' && key !== 'created_by_temp' && key !== 'created_by' && key !== 'created_on' && key !== 'publicdatetime' && key !== 'track_id') {
                if (Array.isArray(value)) {
                    Data.push({ 'k': key.replace(/_/g, ' '), 'v': Array.prototype.map.call(value, s => s.label).toString().split(/[,]+/).join(',  ') })
                }
                else if (typeof value === 'string') {
                    if(key === 'notes' || key === 'remarks' || key === 'symptoms' || key === 'free_text' || key === 'explanation'){
                        Data.push({ 'k': key.replace(/_/g, ' '), 'v': value })
                    }
                    else if(key === 'date_measured' || key === 'emergency_on' || key === 'review_on' || key === 'diagnosed_on' || key === 'when_to' ||
                    key === 'when_until' || key === 'date_doctor_visit' || key === 'dod_onset' || key === 'dob' || key === 'dod' || key === 'first_visit_date' 
                    || key === 'last_visit_date' || key === 'date_measured' || key === 'prescribed_on' || key === 'until'  || key === 'from_when'  || key === 'until_when' 
                    || key === 'data_of_vaccination'){
                        Data.push({ 'k': key.replace(/_/g, ' '), 'v': getDate(value, 'YYYY/MM/DD') })
                    }
                    else if(key === 'reminder_time_taken'||key === 'time_taken' ){
                        Data.push({ 'k': key.replace(/_/g, ' '), 'v': getReminder(value,'24') })
                    }
                    else if(key === 'time_measured' ){
                        Data.push({ 'k': key.replace(/_/g, ' '), 'v': getTime(value,'24') })
                    }
                    else if(key === 'datetime_on')
                    {
                       
                        Data.push({ 'k': 'Date of event', 'v': getDate(value, 'YYYY/MM/DD') })
                    }
                    else{
                        Data.push({ 'k': key.replace(/_/g, ' '), 'v': value })
                    }
                }
            }
            if (key === 'created_by_temp') { Data.push({ 'k': 'Created by', 'v': value }) }
        })
    }
    
    var filename = 'GeneratedReport.pdf'
    var document = {
        type: 'file',     // 'file' or 'buffer'
        template: html,
        context: {
            Dieseases: Data,
            pat_info: req.body.patientData,
            type: req.body.Dieseases.type.replace('_', ' ')
        },
        path: `${__dirname}/${filename}`  // it is not required if type is buffer
    };
    pdf.create(document, options)
        .then(res22 => {
            const file = `${__dirname}/${filename}`;
        
            res.download(file); // Set disposition and send it.  
        })
        .catch(error => {
            res.json({ status: 200, hassuccessed: true, filename: filename });
        });

})

router.post('/downloadfullPdf', function (req, res, next) {
    // Custom handlebar helper
    pdf.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    })

    var options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm"
    };
    var Data = [];
    {
       
        Object.entries(req.body.Dieseases).map(([key, value]) => {
                if (Array.isArray(value)) {
                    Data.push({ 'k': key.replace(/_/g, ' '), 'v':  Array.prototype.map.call(value, s => s).toString().split(/[,]+/).join('<br/> ') })
                }
        })
    }
    
    var filename = 'GeneratedReport.pdf'
    var document = {
        type: 'file',     // 'file' or 'buffer'
        template: html1,
        context: {
            Dieseases: Data,
            pat_info: req.body.patientData,
    
        },
        path: `${__dirname}/${filename}`  // it is not required if type is buffer
    };
    pdf.create(document, options)
        .then(res22 => {
            const file = `${__dirname}/${filename}`;
         
            res.download(file); // Set disposition and send it.  
        })
        .catch(error => {
            res.json({ status: 200, hassuccessed: true, filename: filename });
        });

})

function getReminder(reminder, timeFormat){
    if(reminder && reminder.length>0){
        var data=[];
        reminder.map((itm)=>{
            var date = new Date(itm.value);
            if(timeFormat ==='12')
            {   
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0'+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                data.push(strTime);
            }
            else {
                var h = (date.getHours() < 10 ? '0' : '') + date.getHours();
                var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                data.push(h + ':' + m);
            }   
        })
        return data.join(', ');
    }
}

function getTime (date, timeFormat){
    date = new Date(date);
    if(timeFormat ==='12')
    {   
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    else {
        var h = (date.getHours() < 10 ? '0' : '') + date.getHours();
        var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        return h + ':' + m;
    }   
}

function getDate (date, dateFormat){
    var d = new Date(date);
    var monthNames = ["01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"],
        month = monthNames[d.getMonth()],
        day = d.getDate(),
        year = d.getFullYear()
    if (day.length < 2) day = '0' + day;
    if(dateFormat === 'YYYY/DD/MM') { return year + ' / ' + day + ' / ' + month; }
    else if(dateFormat === 'DD/MM/YYYY') {  return day + ' / ' + month + ' / ' + year; }
    else { return month + ' / ' + day + ' / ' + year;}
}


//API to get the
//Added by Ankita for Upcoming Appointment
router.put('/SuggestTimeSlot', function (req, res, next) {      
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        let email = req.body.email,
        apppinment_id= req.body._id,
        oldSchedule= req.body.oldSchedule,
        doctorProfile = req.body.docProfile,
        timeslot = req.body.timeslot
        return Appointment.update({_id:apppinment_id},{status:'cancel'}).exec()
            .then((chnageData)=>{
                let mailOptions = {
                    from:'contact@aimedis.com',
                    to : email,
                    subject: 'Appoinment Cancel And New Time Suggestion',
                    html: `<div>The appoinment with Dr. ${doctorProfile.first_name+ ' '+ doctorProfile.last_name} on ${oldSchedule} is cancelled due to appoinment time, This is the suggested time ${timeslot}, on which you can send request appoinment.</div> `
                };
               
                let sendmail = transporter.sendMail(mailOptions)

                res.json({ status: 200, hassuccessed: true, msg: 'Request Send succesfully' })
            })
            .catch((err)=>{
                res.json({ status: 200, hassuccessed: false, msg: 'Request Send Unsuccesfull' })
            })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});



module.exports = router;