var express = require('express');
var router = express.Router();
const multer = require("multer");
var User = require('../schema/user');
var message = require('../schema/message');
var Topic = require('../schema/topic');
var Institute = require('../schema/institute');
var Wishlist = require('../schema/wishlist_schema')
var jwtconfig = require('../jwttoken');
const uuidv1 = require('uuid/v1');
const { join } = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const { promisify } = require('util');
var nodemailer = require('nodemailer');
const read = promisify(require('fs').readFile);
const handlebars = require('handlebars');
var dateTime = require('node-datetime');
var base64 = require('base-64');
var shortid = require('shortid');
var API_KEY = 'rZ1SMhOZguUluAw1c1iFrMSdVNgxoFYK'
var SECRET = "SUPERSECRETSECRET"
var phoneReg = require('../lib/phone_verification')(API_KEY);
const Client = require('authy-client').Client;
const authy = new Client({key: API_KEY});

// var transporter = nodemailer.createTransport
//     ({
//         service: 'gmail',
//         auth: {
//             user:  "contact@aimedis.com",
//             pass: 'ankita@30webnexus'
//         }
//     });

var transporter = nodemailer.createTransport({
    host : "vwp3097.webpack.hosteurope.de",
    port : 25,
    secure: false,
    auth:{
        user: "wp1052892-aimedis00102",
        pass: "DyNaMiTe=2008"
    }
});
var storage = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, 'public/uploads')
        },
        filename: function (req, file, cb) {
            console.log('filesss', file),
                cb(null, Date.now() + '-' + file.originalname)
        }
    })

var upload2 = multer({ storage: storage }).single("MessageAttach");
var upload = multer({ storage: storage }).single("UploadDocument");
var upload_replace = multer({ storage: storage }).single("UploadDocument1");
var AllUser1 = [];

router.post('/Addadminuser', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var institute_id = { institute_id: 0 }
    if (legit) {
        User.findOne( {$or: [{ email: req.body.email }, {email: req.body.email.toLowerCase()}, {email: req.body.email.toUpperCase()}]}).exec().then((data1) => {
            if (data1) {
                console.log('seruhjk');
                res.json({ status: 200, msg: 'Email is Already exist', success: false });
            }
            else {
                if(req.body.lan==='de') 
        {
            var  dhtml = '<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>' +
            'Mit Aimedis stehen Sie immer an der Seite Ihrer Patienten. Bieten Sie online Termine und Videosprechstunden an, stellen Sie Rezepte und Arbeitsunfähigkeitsbescheinigungen aus oder bieten Sie Zweitmeinungen über die Plattform an, alles bis auf Weiteres kostenfrei.<br/>'+
            'Sobald Sie sich als medizinische Fachkraft legitimiert haben, schalten wir Ihren Zugang frei.<br/>'+  
            'In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung.<br/>'+
            'Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>'+
            'Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen.<br/><br/>'+
            '<b>Ihr Aimedis Team</b><br/>'+
            '<b>Jetzt einloggen: </b> <a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>'+ 
            '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';

            if(req.body.type=='patient')
            {
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
        else
        {
            var dhtml =  '<b>Welcome to Aimedis - your health platform.</b><br/>' +
                'With Aimedis you are always at your patients’ side. Offer online appointments and video consultations, issue prescriptions and sick certificates or offer second opinions via the platform, all free of charge until further notice. <br/>' +
                'As soon as you have legitimized yourself as a medical specialist, we will activate your access. <br/>' +
                'In view of the current situation and problems caused by the SARS coronavirus, Aimedis provides a corresponding diary for both patients and practitioners. <br/>' +
                'In the attachment to this email you will find the terms and conditions as well as the data protection regulations. <br/>' +
                'You can reach us via WhatsApp or email via contact@aimedis.com.<br/><br/><br/>' + 
                '<b>Your Aimedis team</b><br/>' +
                '<b>Log in now:</b><a href="https://sys.aimedis.io">https://sys.aimedis.io</a><br/>' +
                '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';

            if(req.body.type=='patient')
            {
                dhtml =  '<b>Welcome to Aimedis - your health platform.</b><br/>' +
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
        var ids= shortid.generate();
                if(req.body.type=='patient')
                {
                    var profile_id =  'P_'+ids;
                }
                else if(req.body.type=='nurse')
                { 
                    var profile_id = 'N_'+ids;
                }
                else if(req.body.type=='pharmacy')
                {
                    var profile_id = 'PH'+ids;
                }
                else if(req.body.type=='paramedic')
                {
                    var profile_id = 'PA'+ids;
                }
                else if(req.body.type=='insurance')
                {
                    var profile_id = 'I_'+ids;
                }
                else if(req.body.type=='hospitaladmin')
                {
                    var profile_id = 'HA'+ids;
                }
                else if(req.body.type=='doctor')
                {
                    var profile_id =  'D_'+ids;
                }
        var isblock = { isblock: false }
        var dt = dateTime.create();
        var createdate = { createdate: dt.format('Y-m-d H:M:S') }
        var enpassword = base64.encode(req.body.password);
        var usertoken = { usertoken: uuidv1() }
        var verified = { verified: 'true' }
        // var parent_id = { parent_id: legit.id }
        var profile_id    = {profile_id: profile_id}
        if (req.body.institute_id) {
            institute_id = { institute_id: req.body.institute_id }
        }
        console.log('inst_id', institute_id);
        req.body.password = enpassword;

        console.log('country_code', req.body)
        if (req.body.country_code && req.body.mobile) {
            authy.registerUser({
                countryCode: req.body.country_code,
                email: req.body.email,
                phone: req.body.mobile
            })
            .catch(err => res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false })) 
            .then(regRes=>{
                var authyId = {authyId: regRes.user.id};
            datas = { ...authyId, ...profile_id, ...req.body, ...institute_id, ...isblock, ...createdate, ...usertoken, ...verified }
            var users = new User(datas);
            users.save((err, user_data) => {
            if (err && !user_data) {
                console.log('ddsds');
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                if (user_data) {
                    console.log(user_data, 'kkkkk')
                    user_id = user_data._id;
                    let token = user_data.usertoken;
                    if(user_data.type =='hospitaladmin')
                    {
                         var link = 'https://sys.aimedis.io/admin/';
                    }
                    else
                    {
                        var link = 'https://sys.aimedis.io/';
                    }
                    let mailOptions = {
                        from    :  "contact@aimedis.com",
                        to      :  req.body.email,
                        //to      :  'navdeep.webnexus@gmail.com',
                        subject : 'Aimedis Registeration',
                        html    : dhtml
                    };
                    let sendmail = transporter.sendMail(mailOptions)
                    
                    if (!req.body.institute_id && req.body.institute_name!="") {
                        console.log('inside_ifff')
                        var fullInstitute = { institute_name: req.body.institute_name, created_by: user_id }
                        var Institutes = new Institute(fullInstitute);
                        Institutes.save((err, inst) => {
                            if (err && !inst) {
                                console.log('ds');
                                res.json({ status: 200, message: 'Something went wrong on Institute creation', error: err });
                            } else {
                                if (inst) {
                                    console.log('fdsfd');
                                    User.updateOne({ _id: user_id },
                                        { institute_id: inst._id },
                                        function (err, doc) {
                                            if (err && !doc) {
                                                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err });
                                            }
                                            else {
                                                res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: user_data });
                                            }
                                        })
                                }
                                else {
                                    console.log('fdedadasfd');
                                    res.json({ status: 200, hassuccessed: false, message: 'Problem with assign the Institute', error: err });
                                }
                            }
                        })
                    }
                    else {
                        res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true, data: user_data });
                    }
                }
                else {
                    console.log('tttttttttt');
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                }
            }
        })
            })
        }
        else {
            res.json({ status: 200, message: 'Phone is not verified', error: err, hassuccessed: false });
        }
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/allusers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    AllUser1 = [];
    if (legit) {
        User.find().exec().then((data) => {
            if (data.length > 0) {
                forEachPromise(data, AllUser)
                    .then((result) => {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: AllUser1 })
                    })
            }
            else {
                res.json({ status: 200, hassuccessed: false, msg: 'No User found' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});
router.get('/allHospitalusers/:institute_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    AllUser1 = [];
    if (legit) {
        User.find({institute_id: req.params.institute_id}).exec().then((data) => {
            if (data.length > 0) {
                forEachPromise(data, AllUser)
                    .then((result) => {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: AllUser1 })
                    })
            }
            else {
                res.json({ status: 200, hassuccessed: false, msg: 'No User found' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/messageUsers', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    AllUser1 = [];
    if (legit) {
        User.find({ _id: legit.id }).exec().then((data) => {
            if (data.length > 0) {
                User.find({ $or: [{ _id: data[0].parent_id }, { parent_id: legit.id }] }).exec().then((data22) => {
                    if (data22.length > 0) {
                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: data22 })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: false, msg: 'No User found' });
                    }
                })
            }
            else {
                res.json({ status: 200, hassuccessed: false, msg: 'User not found' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.delete('/deleteUser/:UserId', function (req, res, next) {
    User.findOneAndRemove({ _id: req.params.UserId }, function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'User is Deleted' });
        }
    })
})

router.put('/Updateadminuser', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.updateOne({ _id: legit.id }, req.body, { new: true }, function (err, userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Profile is Updated Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/BlockUser/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.updateOne({ _id: req.params.UserId }, req.body, { new: true }, function (err, userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'User status is Updated' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});


function AllUser(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
           if(!data.institute_id || data.institute_id=="0")
           {
                var new_data = data;
                var institute_name = '';
               
                new_data.institute_name = institute_name;
               
                AllUser1.push(new_data);
                resolve(AllUser1);
           }
           else
           { 
            
            Institute.find({ _id: data.institute_id }, function (err, doc3) {
                if (err) {
               
                } else {
                    var new_data = data;
                    var institute_name = '';
                    if (doc3 && doc3.length>0 && doc3[0].institute_name) {
                        institute_name = doc3[0].institute_name
                    }
                   

                    new_data.institute_name = institute_name;
                  
                    AllUser1.push(new_data);
                    resolve(AllUser1);
                }
            })
           }

        });
    });
}

router.post('/fileAttachment', function (req, res, next) {
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
                var data = {
                    file_url: res.req.file.destination + '/' + res.req.file.filename,
                    filename: res.req.file.filename, filetype: req.file.mimetype
                }
                res.json({ status: 200, hassuccessed: true, message: 'File is uploaded', data: data });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/Messages1', function (req, res, next) {
    console.log(req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var data = {
            message_header: req.body.message_header, message_text: req.body.message_text,
            sent_date: req.body.sent_date,
            sender_id: req.body.sender_id,
            reciever_id: req.body.reciever_id
        }
        var messages = new message(data);
        messages.save(function (err, messages_data) {
            if (err && !messages_data) {
                console.log(err);
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                console.log(messages_data);
                res.json({ status: 200, hassuccessed: true, msg: 'messages is added Successfully' });
            }
        })
    }

    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/Messages', function (req, res, next) {
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


router.post('/Messages', function (req, res, next) {
    console.log('withattach', req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {

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
                console.log(err);
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', err: err });
            } else {
                console.log(messages_data);
                res.json({ status: 200, hassuccessed: true, msg: 'messages is added Successfully' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});


//add document
router.post('/Document', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
      console.log('req.query', req.query)
      var data = { DocumentId: uuidv1(), version: 1, status: true, filename : req.query.filename, url : req.query.url };

    User.findByIdAndUpdate(legit.id,
    { $push: { documents: data } },
    { safe: true, upsert: true },
    function (err, doc) {
        if (err && !doc) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'Document is added Successfully' });
        }
    })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/Document', function (req, res, next) {
    const datas = Array();
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.find({
            _id: legit.id
        }, function (err, doc) {
            if (err && !changeStatus) {

            } else {
                if (doc !== 'undefined' && doc.length > 0 && doc[0] !== null) {
                    console.log('doc[0]', doc[0])
                    res.json({ status: 200, hassuccessed: true, msg: 'Document is found', data: doc[0].documents });
                }
                else {
                    res.json({ status: 200, hassuccessed: false, msg: "no data found" });
                }
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/ChangeStatus/:DocumentId', function (req, res, next) {
    var dataspull = Array();
    var dataspush = Array();
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.updateOne(
            {
                '_id': legit.id,
                'documents.DocumentId': req.params.DocumentId
            },
            {
                $set: {
                    'documents.$.status': req.body.status
                }
            },
            function (err, doc) {
                if (err && !doc) {
                    console.log("rttttt")
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    console.log('doc', doc);
                    if (doc.nModified == '0') {
                        console.log("rttttwwwwt")
                        res.json({ status: 200, hassuccessed: false, msg: 'Document is not found' })
                    }
                    else {
                        console.log("rtttwwwwtwwwwt")
                        res.json({ status: 200, hassuccessed: true, msg: 'Document is updated' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/ReplaceDocument/:DocumentId', function (req, res, next) {
    console.log('dddddd', req.file);
    var dataspull = Array();
    var dataspush = Array();
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload_replace(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log('dddddd');
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
            } else if (err) {
                console.log('eeeeeee');
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            }
            else {
                var data = {
                    DocumentId: req.params.DocumentId,
                    version: 1,
                    status: true,
                    filename: res.req.file.filename,
                    filetype: req.file.mimetype,
                    url: res.req.file.destination + '/' + res.req.file.filename
                }
                User.updateOne(
                    {
                        '_id': legit.id,
                        'documents.DocumentId': req.params.DocumentId
                    },
                    {
                        $set: {
                            'documents.$': data
                        }
                    },
                    function (err, doc) {
                        if (err && !doc) {
                            console.log("rttttt")
                            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                        } else {
                            console.log('doc', doc);
                            if (doc.nModified == '0') {
                                console.log("rttttwwwwt")
                                res.json({ status: 200, hassuccessed: false, msg: 'Document is not found' })
                            }
                            else {
                                console.log("rtttwwwwtwwwwt")
                                res.json({ status: 200, hassuccessed: true, msg: 'Document is updated' })
                            }
                        }
                    });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/ShareDocument/:DocumentId', function (req, res, next) {
    var dataspull = Array();
    var dataspush = Array();
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({
            _id: legit.id
        }, function (err, changeStatus) {
            if (err) { }
            else {
                console.log('users', req.body.reciever_id);
                if (changeStatus.documents) {
                    changeStatus.documents.forEach(function (item3) {
                        if (item3.DocumentId == req.params.DocumentId) {
                            dataspull.push(item3);
                            User.updateOne({ _id: legit.id },
                                { $pull: { documents: dataspull[0] } },
                                { safe: true, upsert: true },
                                function (err) {
                                    if (err) { }
                                });
                            dataspush.push(item3);
                            dataspush[0].sender_id = legit.id;
                            dataspush[0].reciver_id = req.body.reciever_id;
                            User.updateOne({ _id: legit.id },
                                { $push: { documents: dataspush[0] } },
                                { safe: true, upsert: true },
                                function (err) {
                                    if (err) { console.log(err); }
                                    else { res.json({ status: 200, hassuccessed: true, msg: "Document is Shared" }); }
                                })
                            if (Array.isArray(req.body.reciever_id)) {
                                req.body.reciever_id.forEach(function (usershare) {
                                    console.log('usershare', usershare);
                                    User.findOne({ _id: usershare, documents: { $elemMatch: { DocumentId: req.params.DocumentId } } },
                                        function (err, data2) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log('data222222', data2)
                                                if (data2 === null) {
                                                    console.log('data2', usershare)
                                                    User.updateOne({ _id: usershare },
                                                        { $push: { documents: dataspush[0] } },
                                                        { safe: true, upsert: true },
                                                        function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                            else { }
                                                        })
                                                }
                                            }
                                        })
                                })
                            }
                        }
                    })
                }
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/GetHintinstitute', function (req, res, next) {
    const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
        colName = req.body.institute_name;
        Institute.find({ $and: [{ "institute_name": { $regex: '.*' + colName + '.*', $options: "i" } }, { created_by: legit.id }] },
            function (err, allinstitute) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
                } else {
                    res.json({ status: 200, hassuccessed: true, msg: 'Institute found', data: allinstitute });
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/GetHintinstitute', function (req, res, next) {
    const token = (req.headers.token);
    let legit = jwtconfig.verify(token)
    if (legit) {
        Institute.find({},
            function (err, allinstitute) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
                } else {
                    res.json({ status: 200, hassuccessed: true, msg: 'Institute found', data: allinstitute });
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

//for delete the document
router.delete('/Document/:DocumentId', function (req, res, next) {
    var dataspull = Array();
    var dataspush = Array();
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var data = req.body.data
    if (legit) {
        User.updateOne({ _id: legit.id },
            { $pull: { documents: { DocumentId: req.params.DocumentId } } },
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

router.post('/topic', function (req, res, next) {
    console.log(req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var topics = new Topic(req.body);
        topics.save(function (err, messages_data) {
            if (err && !messages_data) {
                console.log(err);
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                console.log(messages_data);
                res.json({ status: 200, hassuccessed: true, msg: 'topic is added Successfully' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});
router.get('/topic', function (req, res, next) {
    console.log(req.body);
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
       
        Topic.find({}, function (err, messages_data) {
            if (err && !messages_data) {
                console.log(err);
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                console.log(messages_data);
                res.json({ status: 200, hassuccessed: true, msg: 'topic is find Successfully', data : messages_data });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.delete('/topic/:id', function (req, res, next) {
    Topic.findOneAndRemove({ _id: req.params.id }, function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'User is Deleted' });
        }
    })
});

router.delete('/removeWishlist/:id', function (req, res) {
    let legit = jwtconfig.verify(req.headers.token)
    if (legit) {
    Wishlist.findOneAndRemove({ _id: req.params.id }, function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'Wishlist is Deleted' });
        }
    })
}
else { res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' }) }
});

router.put('/topic/:id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Topic.updateOne({ _id: req.params.id }, req.body, { new: true }, function (err, userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Topic is Updated Successfully' });
            }
        });
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

module.exports = router;