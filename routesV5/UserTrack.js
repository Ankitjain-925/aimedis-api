require("dotenv").config();
var express = require("express");
var router = express.Router();
const multer = require("multer");
var user = require("../schema/user");
const { encrypt, decrypt } = require("./Cryptofile.js");
var kyc = require("../schema/kyc");
var Appointment = require("../schema/appointments");
var jwtconfig = require("../jwttoken");
const uuidv1 = require("uuid/v1");
const { join } = require("path");
const sendSms = require("./sendSms");
var virtual_Case = require("../schema/virtual_cases.js");
const moment = require("moment");
const { getMsgLang, trans } = require("./GetsetLang");
const {
    getSubject,
    SUBJECT_KEY,
    EMAIL,
    generateTemplate,
} = require("../emailTemplate/index.js");
const { promisify } = require("util");
const read = promisify(require("fs").readFile);
const handlebars = require("handlebars");
var nodemailer = require("nodemailer");
const { profile } = require("console");

var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 25,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

var trackrecord1 = [];
var track2 = [];
var CheckRole = require("./../middleware/middleware")

//var paths= "http:/localhost:5000/uploads/Trackrecord"
var paths = "https://aimedis1.com/public/uploads/Trackrecord";

router.post("/Addkyc", CheckRole("kyc_license"), function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        var data = req.body;
        var kycs = new kyc(data);
        kycs.save(function (err, AddUser) {
            if (err) return next(err);
            res.json({ status: 200, hassuccessed: true, msg: "KYC is added" });
        });
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Authentication required.",
        });
    }
});

router.get("/AppointOfDate1/:date", CheckRole("show_appointment"), function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        const patient = legit.id;
        const messageToSearchWith = new Appointment({ patient });
        messageToSearchWith.encryptFieldsSync();
        Appointment.find(
            {
                $or: [{ patient: messageToSearchWith.patient }, { patient: legit.id }],
                date: req.params.date,
            },
            function (err, Userinfo) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong.",
                        error: err,
                    });
                } else {
                    res.json({ status: 200, hassuccessed: true, data: Userinfo });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Authentication required.",
        });
    }
});

router.get("/AppointmentByDate1", CheckRole("show_appointment"), function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        const patient = legit.id;
        const messageToSearchWith = new Appointment({ patient });
        messageToSearchWith.encryptFieldsSync();
        Appointment.aggregate(
            [
                {
                    $match: {
                        $or: [
                            { patient: messageToSearchWith.patient },
                            { patient: legit.id },
                        ],
                        status: "accept",
                    },
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 },
                    },
                },
            ],
            function (err, results) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        msg: "Something went wrong",
                    });
                } else {
                    res.json({ status: 200, hassuccessed: true, data: results });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Authentication required.",
        });
    }
});

router.get("/AppointmentByDate", CheckRole("show_appointment"), function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        const doctor_id = legit.id;
        const messageToSearchWith = new Appointment({ doctor_id });
        messageToSearchWith.encryptFieldsSync();

        Appointment.aggregate(
            [
                {
                    $match: {
                        $or: [
                            { doctor_id: messageToSearchWith.doctor_id },
                            { doctor_id: legit.id },
                        ],
                        status: "accept",
                    },
                },
                {
                    $group: {
                        _id: "$date",
                        count: { $sum: 1 },
                    },
                },
            ],
            function (err, results) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        msg: "Something went wrong",
                    });
                } else {
                    res.json({ status: 200, hassuccessed: true, data: results });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Authentication required.",
        });
    }
});

router.post("/appointment", CheckRole("Add_appointment"), function (req, res) {
    var Appointments = new Appointment(req.body);
    Appointments.save(function (err, user_data) {
        if (err && !user_data) {
            console.log("err", err)
            res.json({ status: 200, message: "Something went wrong.", error: err });
        } else {
            var date = getDate(
                moment(req.body.date).format("YYYY/MM/DD"),
                "YYYY/MM/DD"
            );
            var lan1 = getMsgLang(req.body.patient);
            var lan2 = getMsgLang(req.body.doctor_id);

            lan1.then((result) => {
                generateTemplate(
                    EMAIL.patientEmail.appointmentSystem(result, {
                        doctor_name:
                            req.body.docProfile.first_name +
                            " " +
                            req.body.docProfile.last_name,
                        patient_name:
                            req.body.patient_info.first_name +
                            " " +
                            req.body.patient_info.last_name,
                        date: date,
                        time: req.body.start_time,
                        doctor_phone: req.body.patient_info.phone,
                    }),
                    (error, html2) => {
                        console.log("html", html2);
                        if (!error) {
                            let mailOptions = {
                                from: "contact@aimedis.com",
                                to: req.body.patient_info.email,
                                subject: getSubject(
                                    result,
                                    SUBJECT_KEY.aimedis_appointment_system
                                ),
                                html: html2,
                            };
                            console.log("html1", html2)
                            console.log("mailOptions1", mailOptions)
                            let sendmail = transporter.sendMail(mailOptions);
                            if (sendmail) {
                                console.log("Mail is sent ");
                            }
                        }
                    }
                );
                // var sendData = 'You have got an ONLINE / OFFLINE appointment with ' + req.body.docProfile.first_name + ' ' + req.body.docProfile.last_name + ' on DATE ' + date + ' at TIME ' + req.body.start_time + '.<br/>' +
                //     'If you cannot take the appointment, please cancel the appointment at least 24 hours before it begins.<br/>' +
                //     'If you have any questions, contact your doctor via PRACTICE PHONE NUMBER.<br/>' +
                //     'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/><br/><br/>' +
                //     'Your Aimedis Team ';

                // result = result === 'ch' ? 'zh' : result === 'sp' ? 'es' : result === 'rs' ? 'ru' : result;

                // trans(sendData, { source: "en", target: result }).then((res) => {
                //     var mailOptions = {
                //         from: "contact@aimedis.com",
                //         to: req.body.patient_info.email,
                //         subject: 'Appointment Request',
                //         html: res.replace(/ @ /g, '@')
                //     };
                //     var sendmail = transporter.sendMail(mailOptions)
                // });
            });
            lan2.then((result) => {
                generateTemplate(
                    EMAIL.doctorEmail.appointmentSystem(result, {
                        doctor_name:
                            req.body.docProfile.first_name +
                            " " +
                            req.body.docProfile.last_name,
                        patient_id: req.body.patient_info.patient_id,
                        patient_name:
                            req.body.patient_info.first_name +
                            " " +
                            req.body.patient_info.last_name,
                        date: date,
                        time: req.body.start_time,
                        patient_email: req.body.patient_info.email,
                        patient_phone: req.body.patient_info.phone,
                    }),
                    (error, html3) => {
                        console.log("html2", html3);
                        if (!error) {
                            let mailOptions = {
                                from: "contact@aimedis.com",
                                to: req.body.docProfile.email,
                                subject: getSubject(
                                    result,
                                    SUBJECT_KEY.aimedis_appointment_system
                                ),
                                html: html3,
                            };
                            console.log("html2", html3)
                            console.log("mail", mailOptions)
                            let sendmail = transporter.sendMail(mailOptions);
                            if (sendmail) {
                                console.log("Mail is sent ");
                            }
                        }
                    }
                );
                // var sendData = 'You have got an ONLINE / OFFLINE appointment with ' + req.body.patient_info.patient_id + ' on DATE ' + date + ' at TIME ' + req.body.start_time + '.<br/>' +
                //     'Please accept the appointment inside the system.<br/>' +
                //     'If you have any questions, contact the patient via ' + req.body.patient_info.email + '.<br/>' +
                //     'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/><br/><br/>' +
                //     'Your Aimedis team';

                // result = result === 'ch' ? 'zh' : result === 'sp' ? 'es' : result === 'rs' ? 'ru' : result;

                // trans(sendData, { source: "en", target: result }).then((res) => {
                //     var mailOptions = {
                //         from: "contact@aimedis.com",
                //         to: req.body.docProfile.email,
                //         subject: 'Appointment Request',
                //         html: res.replace(/ @ /g, '@')
                //     };
                //     var sendmail = transporter.sendMail(mailOptions)
                // });
            });

            // if (req.body.lan === 'de') {
            //     var dhtml = 'Sie haben am   DATE'+ date + 'um TIME '+req.body.start_time+' einen Termin bei '+req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' ONLINE/OFFLINE vereinbart. .<br/>'+
            //     'Sollten Sie den Termin nicht wahrnehmen können, sagen Sie den Termin bitte spätestens 24 Stunden vor Terminbeginn ab. <br/>'+
            //     'Kontaktieren Sie bei Fragen Ihren behandelnden Arzt unter PRACTICE PHONE NUMBER. <br/>'+
            //     'Alternativ können Sie uns unter contact@aimedis.com oder WhatApp kontaktieren, falls Sie Schwierigkeiten haben, mit Ihrem Arzt in Kontakt zu treten. '+
            //     '<b>Ihr Aimedis Team </b>'

            // }
            // else {
            //     var dhtml = 'You have got an ONLINE / OFFLINE appointment with '+ req.body.docProfile.first_name+' '+req.body.docProfile.last_name+' on DATE '+date +' at TIME '+ req.body.start_time+'.<br/>'+
            //     'If you cannot take the appointment, please cancel the appointment at least 24 hours before it begins. <br/>'+
            //     'If you have any questions, contact your doctor via PRACTICE PHONE NUMBER.<br/>'+
            //     'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/>'+
            //     '<b>Your Aimedis team </b>'

            // }
            // if (req.body.lan === 'de') {

            //     var dhtml2 = ' Sie haben für den  DATE'+ date + 'um TIME '+req.body.start_time+' einen Termin bei '+req.body.patient_info.patient_id+'ONLINE/OFFLINE vereinbart. .<br/>'+
            //     'Bitte bestätigen Sie den Termin innerhalb des Systems. <br/>'+
            //     'Sollten Sie Rückfragen an den Patienten haben, schreiben Sie ihm bitte eine E-Mail an'+req.body.patient_info.email+'. <br/>'+
            //     'Alternativ können Sie uns unter contact@aimedis.com oder WhatApp kontaktieren, falls Sie Schwierigkeiten haben, mit Ihrem Arzt in Kontakt zu treten.<br/> '+
            //     '<b>Ihr Aimedis Team </b>'
            // }
            // else {
            //     var dhtml2 ='You have got an ONLINE / OFFLINE appointment with '+ req.body.patient_info.patient_id+' on DATE '+ date  +' at TIME '+ req.body.start_time+'.<br/>'+
            //     'Please accept the appointment inside the system.<br/>'+
            //     'If you have any questions, contact the patient via '+req.body.patient_info.email+'.<br/>'+
            //     'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/>'+
            //     '<b>Your Aimedis team </b>'
            // }
            // var mailOptions = {
            //     from: "contact@aimedis.com",
            //     to:req.body.patient_info.email ,
            //     subject: 'Appointment Request',
            //     html: dhtml
            // };
            // var mailOptions2 = {
            //     from: "contact@aimedis.com",
            //     to: req.body.docProfile.email,
            //     subject: 'Appointment Request',
            //     html: dhtml2
            // };
            // var sendmail = transporter.sendMail(mailOptions)
            // var sendmail2 = transporter.ssendMail(mailOptions2)
            res.json({
                status: 200,
                message: "Added Successfully",
                hassuccessed: true,
                data: user_data,
            });
        }
    });
});

function getDate(date, dateFormat) {
    var d = new Date(date);
    var monthNames = [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
    ],
        month = monthNames[d.getMonth()],
        day = d.getDate(),
        year = d.getFullYear();
    if (day.length < 2) day = "0" + day;
    if (dateFormat === "YYYY/DD/MM") {
        return year + " / " + day + " / " + month;
    } else if (dateFormat === "DD/MM/YYYY") {
        return day + " / " + month + " / " + year;
    } else {
        return month + " / " + day + " / " + year;
    }
}

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}

function forEachPromises(items, right_management, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item, right_management);
        });
    }, Promise.resolve());
}

function mySorter(a, b) {
    var x = a.datetime_on.toLowerCase();
    var y = b.datetime_on.toLowerCase();
    return x > y ? -1 : x < y ? 1 : 0;
}

module.exports = router;