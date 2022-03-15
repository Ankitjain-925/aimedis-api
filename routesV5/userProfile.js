require("dotenv").config();
var express = require("express");
let router = express.Router();
var User = require("../schema/user.js");
var Metadata = require("../schema/metadata");
var Appointment = require("../schema/appointments");
var Prescription = require("../schema/prescription");
var Second_opinion = require("../schema/second_option");
var Sick_certificate = require("../schema/sick_certificate");
var Settings = require("../schema/settings");
const sendSms = require("./sendSms");
const { encrypt, decrypt } = require("./Cryptofile.js");
var jwtconfig = require("../jwttoken");
var base64 = require("base-64");
var dateTime = require("node-datetime");
var nodemailer = require("nodemailer");
var uuidv1 = require("uuid/v1");
var moment = require("moment");
const { join } = require("path");
var shortid = require("shortid");
var aws = require("aws-sdk");
const axios = require("axios");
const { getMsgLang, trans } = require("./GetsetLang");
var fs = require("fs");
var converter = require("json-2-csv");
var html = fs.readFileSync(join(`${__dirname}/Userdata.html`), "utf8");
var html1 = fs.readFileSync(join(`${__dirname}/UserFullData.html`), "utf8");
var html_to_pdf = require("html-pdf-node");
var handlebars = require("handlebars");
const {
    getSubject,
    SUBJECT_KEY,
    EMAIL,
    generateTemplate,
} = require("../emailTemplate/index.js");
var phoneReg = require("../lib/phone_verification")(API_KEY);
const Client = require("authy-client").Client;
const appleReceiptVerify = require("node-apple-receipt-verify");
var Verifier = require("google-play-billing-validator");
const { request } = require("http");
var options = {
    email:
        "app-in-purchase-validator@pc-api-4692645912538711177-40.iam.gserviceaccount.com",
    key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCegeoN0LbVry0F\nauvahnfFY9/wMSMA6/UlsCK8mxMlLqWjMl6jNCshNfxaifOzE+CswhnX/P8D6Ylj\nK7j8mlCok7Quqm9oa5KVZiJ6dpdQSudkcOeiiiPMhlo/i/96EXXLO69mxQirf50L\n0rFRx6u/zHZr9PVavFyw2sgNL+bJts9HrkLgIrpeT69CKgpJMQzAadDNzMbnA0Vv\ne5m6iTHseipXvsG6/EZaMlLHENcd9HpH+f0evVGYnth21CtXfP5fym4eRXdfxJby\nAo6UuD0ypPhcjG2RKzz5oeDUSCsavnM2XIEzWneO1XfL2SC0cjXMkB+2azSobapK\nUASk3SFNAgMBAAECggEAD4SIdXHJdIIB1lXxYSNo9logwlMNKjnvdhEYVX6ZETrP\n3HpB6Zhh4I54diSrRwzbIg6emRaboLZsTNkq8w/odZiAO1FUNtTRNO8a0QJrLeEn\nZh3nj3IWrx84FqCOElVDQvJE6brAbom/xjiKQ4dYuR47ObZxjsCCEo5Yp3HZFkY3\n82C8b+1oB7lONEiEXNq8ucfcVKcFJ7Tk7IPJ1LJsW1kYZmfYOm1fUB1DCEoU8pG4\nl8mB9yLUmczppHmZ1A6IYAl9lZZ759eGnLaZ5PZDeoH1F4rDkbOQUAxGL/6Pe/b2\ng5k/fjt17Wj6MHa9RbOt/nm97o5DMWnJ2q+g1dxbwQKBgQDKtOBoX0bZfIJ0GGg0\nvBxPAWje3mXuHbH7CDoJx201OYIvXA3e5NbTmRy6/Z5aoGj3gWek6SQvsvY9YP1w\nVVoqCSD9CkxmWH6nki8edcF8gkf21HVDzX8Px+zE30cncfoLE3ZuEyxQjkUuxd2j\n/ymfij6a9ABN2guHSF+NrEfI+wKBgQDILjpju9Z0Jg7ADB9Vp+4OATb3LnhUsATR\nDOS9k3+JPKV6C6QsKY3CBEDg+1udLsFUbmNaGVEpsT/FKiNoG/odLHPpIn5u8MrI\n5qPus7SpCYXhO3zdTAGkbn31Kc1TCi+PS8Qdrht5AJt5KlWXqcEZC77UOpbhtj6T\nMCoZi4c8VwKBgGZhtxpgTPuaLJWQoklIXY/16U7vy1HaQ8PD4vR/eoQweLWM7CCR\nOoQDSISVhn7FmF6ySHP9oV5KKJ7Vtwwev/yNQdEse2wR9F6UsiHTXheSAeEEa/oD\n99Izqz3AfELLCXzApsdv/ajuQrkeDRVA0ngXLgm7hc/MepgokMKQqm0zAoGAJ2AI\ndjOtdD1EK3x28WdNyQ1uHWLTonzZBbHOkIehz4HRXtdJXLJzwtUJWfe3Roy61Hu+\nKSvPri7CR2sJeeH+6Zwj1JjHW9UbXjcXyc0pXRKVdf84iWL487oUJpQpYgsf3cTe\nd6QWnU+ERWoRWfq3E9EeoSpBIXayikswDMRIPpMCgYEAvZDsm6TB846hL8uZ0osa\n2SYa6a7ZPTRgYBZZx7XaBHp5Sb3Ehjo+jRp/KcoPNKPD6VshOlCgOtORQi5vVU2a\nR+jXPCKI07x6BYzuCjTPSAFqijH7g52O3Y+eWL16U5RXPQESJ6icxTWt/BD4OaZI\n/jKKFyF+mKT1UUS8fX/Hwu4=\n-----END PRIVATE KEY-----\n",
};
const UserType = {
    patient: "patient",
    doctor: "doctor",
    pharmacy: "pharmacy",
    nurse: "nurse",
    paramedic: "paramedic",
    insurance: "insurance",
    hospitaladmin: "hospitaladmin",
};
//for authy
// https://github.com/seegno/authy-client
var API_KEY = process.env.ADMIN_API_KEY;
var SECRET = process.env.ADMIN_API_SECRET;
var verifier = new Verifier(options);
const authy = new Client({ key: API_KEY });
var CheckRole = require("./../middleware/middleware")

var Mypat = [];
var GetUpcomingAppoint1 = [],
    GetPastAppoint1 = [];

var GetResult1 = [],
    GetResult2 = [],
    GetResult3 = [];

var transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 25,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});


router.post("/AddNewUseradiitional", CheckRole("add_user"), function (req, res, next) {
    const response_key = req.body.token;
    console.log("resp", response_key)
    // Making POST request to verify captcha
    var config = {
        method: "post",
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.recaptchasecret_key}&response=${response_key}`
    };
    axios(config)
        .then(function (google_response) {
            if (google_response.data.success == false) {
                if (
                    req.body.email == "" ||
                    req.body.email == undefined ||
                    req.body.password == "" ||
                    req.body.password == undefined
                ) {
                    res.json({
                        status: 450,
                        message: "Email and password fields should not be empty",
                        hassuccessed: false,
                    });
                } else {
                    const email = req.body.email;
                    const messageToSearchWith = new User({ email });
                    messageToSearchWith.encryptFieldsSync();

                    const messageToSearchWith1 = new User({
                        email: req.body.email.toLowerCase(),
                    });
                    messageToSearchWith1.encryptFieldsSync();

                    const messageToSearchWith2 = new User({
                        email: req.body.email.toUpperCase(),
                    });
                    messageToSearchWith2.encryptFieldsSync();

                    const first_name = req.body.first_name;
                    const messageToSearchWithFirst = new User({ first_name });
                    messageToSearchWithFirst.encryptFieldsSync();

                    const messageToSearchWithFirst1 = new User({
                        first_name: first_name && first_name.toLowerCase(),
                    });
                    messageToSearchWithFirst1.encryptFieldsSync();

                    const messageToSearchWithFirst2 = new User({
                        first_name: first_name && first_name.toUpperCase(),
                    });
                    messageToSearchWithFirst2.encryptFieldsSync();

                    const last_name = req.body.last_name;
                    const messageToSearchWithLast = new User({ last_name });
                    messageToSearchWithLast.encryptFieldsSync();

                    const messageToSearchWithLast1 = new User({
                        last_name: last_name && last_name.toLowerCase(),
                    });
                    messageToSearchWithLast1.encryptFieldsSync();

                    const messageToSearchWithLast2 = new User({
                        last_name: last_name && last_name.toUpperCase(),
                    });
                    messageToSearchWithLast2.encryptFieldsSync();


                    const mobile = req.body.mobile;
                    const messageToSearchWithPhone = new User({ mobile });
                    messageToSearchWithPhone.encryptFieldsSync();

                    User.findOne({

                        $or: [
                            { email: messageToSearchWith1.email },
                            { email: messageToSearchWith.email },
                            { email: messageToSearchWith2.email },
                            { email: req.body.email },
                            { email: req.body.email && req.body.email.toLowerCase() },
                            { email: req.body.email && req.body.email.toUpperCase() },
                        ]
                    }).exec()
                        .then((data1) => {
                            console.log("data1", data1)
                            if (data1) {
                                res.json({
                                    status: 200,
                                    message: "Email is Already exist",
                                    hassuccessed: false,
                                });
                            } else {
                                var condition = {}
                                if (first_name) {
                                    condition.first_name = {
                                        $in: [first_name, first_name.toLowerCase(), first_name.toUpperCase(), messageToSearchWithFirst.first_name,
                                            messageToSearchWithFirst1.first_name, messageToSearchWithFirst2.first_name]
                                    }
                                }
                                if (last_name) {
                                    condition.last_name = {
                                        $in: [last_name, last_name.toLowerCase(), last_name.toUpperCase(), messageToSearchWithLast.last_name,
                                            messageToSearchWithLast1.last_name, messageToSearchWithLast2.last_name]
                                    }
                                }
                                if (mobile) {
                                    condition.mobile = { $in: [mobile, messageToSearchWithPhone.mobile] }
                                }

                                User.findOne(
                                    condition
                                ).exec().then((data2) => {
                                    console.log("data2", data2)
                                    if (data2 && new Date(req.body.birthday).setHours(0, 0, 0, 0) === new Date(data2 && data2.birthday).setHours(0, 0, 0, 0)) {
                                        console.log("for birthday")
                                        res.json({
                                            status: 200,
                                            message: "User is Already exist",
                                            hassuccessed: false,
                                        });
                                    }
                                    else {
                                        console.log("for null")
                                        var ids = shortid.generate();
                                        let _language = req.body.lan || "en";
                                        let _usertype = req.body.type;

                                        if (req.body.type == "patient") {
                                            var profile_id = "P_" + ids;
                                        } else if (req.body.type == "nurse") {
                                            var profile_id = "N_" + ids;
                                        } else if (req.body.type == "pharmacy") {
                                            var profile_id = "PH" + ids;
                                        } else if (req.body.type == "paramedic") {
                                            var profile_id = "PA" + ids;
                                        } else if (req.body.type == "insurance") {
                                            var profile_id = "I_" + ids;
                                        } else if (req.body.type == "hospitaladmin") {
                                            var profile_id = "HA" + ids;
                                        } else if (req.body.type == "doctor") {
                                            var profile_id = "D_" + ids;
                                        } else if (req.body.type == "adminstaff") {
                                            var profile_id = "AS" + ids;
                                        }
                                        var isblock = { isblock: true };

                                        if (req.body.type == "patient") {
                                            isblock = { isblock: false };
                                        }
                                        var dt = dateTime.create();
                                        var createdate = { createdate: dt.format("Y-m-d H:M:S") };
                                        var createdby = { pin: "1234" };
                                        var enpassword = base64.encode(
                                            JSON.stringify(encrypt(req.body.password))
                                        );
                                        var usertoken = { usertoken: uuidv1() };
                                        var verified = { verified: "false" };
                                        var profile_id = { profile_id: profile_id, alies_id: profile_id };
                                        req.body.password = enpassword;

                                        var user_id;

                                        if (req.body.country_code && req.body.mobile) {
                                            authy
                                                .registerUser({
                                                    countryCode: req.body.country_code,
                                                    email: req.body.email,
                                                    phone: req.body.mobile,
                                                })
                                                .catch((err) =>
                                                    res.json({
                                                        status: 200,
                                                        message: "Phone is not verified",
                                                        error: err,
                                                        hassuccessed: false,
                                                    })
                                                )
                                                .then((regRes) => {
                                                    if (regRes && regRes.success) {
                                                        var authyId = { authyId: regRes.user.id };
                                                        req.body.mobile =
                                                            req.body.country_code.toUpperCase() + "-" + req.body.mobile;
                                                        datas = {
                                                            ...authyId,
                                                            ...profile_id,
                                                            ...req.body,
                                                            ...isblock,
                                                            ...createdate,
                                                            ...createdby,
                                                            ...usertoken,
                                                            ...verified,
                                                        };
                                                        var users = new User(datas);
                                                        users.save(function (err, user_data) {
                                                            if (err && !user_data) {
                                                                res.json({
                                                                    status: 200,
                                                                    message: "Something went wrong.",
                                                                    error: err,
                                                                    hassuccessed: false,
                                                                });
                                                            } else {
                                                                user_id = user_data._id;
                                                                let token = user_data.usertoken;
                                                                //let link = 'http://localhost:3000/';
                                                                let link = "https://aimedix.com/";
                                                                var verifylink = `https://aimedix.com/?token=${token}`
                                                                let datacomposer = (lang, { verifylink }) => {
                                                                    return {};
                                                                };
                                                                switch (_usertype) {
                                                                    case UserType.patient:
                                                                        datacomposer = EMAIL.patientEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.doctor:
                                                                        datacomposer = EMAIL.doctorEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.pharmacy:
                                                                        datacomposer = EMAIL.pharmacyEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.insurance:
                                                                        datacomposer = EMAIL.insuranceEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.paramedic:
                                                                        datacomposer = EMAIL.insuranceEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.hospitaladmin:
                                                                        datacomposer = EMAIL.hospitalEmail.welcomeEmail;
                                                                        break;
                                                                    case UserType.nurse:
                                                                        datacomposer = EMAIL.nursetEmail.welcomeEmail;
                                                                        break;
                                                                }
                                                                generateTemplate(
                                                                    datacomposer(_language, { verifylink: verifylink }),
                                                                    (error, html) => {
                                                                        if (!error) {
                                                                            let mailOptions = {
                                                                                from: "contact@aimedis.com",
                                                                                to: req.body.email,
                                                                                subject: getSubject(
                                                                                    _language,
                                                                                    SUBJECT_KEY.welcome_title_aimedis
                                                                                ),
                                                                                html: html,
                                                                            };
                                                                            let sendmail = transporter.sendMail(mailOptions);
                                                                            if (sendmail) {
                                                                                console.log("Mail is sent ");
                                                                            }
                                                                        }
                                                                    }
                                                                );

                                                                User.findOne({ _id: user_id }, function (err, doc) {
                                                                    if (err && !doc) {
                                                                        res.json({
                                                                            status: 200,
                                                                            hassuccessed: false,
                                                                            message: "Something went wrong",
                                                                            error: err,
                                                                        });
                                                                    } else {
                                                                        console.log("doc", doc);
                                                                        res.json({
                                                                            status: 200,
                                                                            message: "User is added Successfully",
                                                                            hassuccessed: true,
                                                                            data: doc,
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        res.json({
                                                            status: 200,
                                                            message: "Phone is not verified",
                                                            error: err,
                                                            hassuccessed: false,
                                                        })
                                                    }
                                                });
                                        } else {
                                            datas = {
                                                ...profile_id,
                                                ...req.body,
                                                ...isblock,
                                                ...createdate,
                                                ...createdby,
                                                ...usertoken,
                                                ...verified,
                                            };
                                            var users = new User(datas);
                                            users.save(function (err, user_data) {
                                                if (err && !user_data) {
                                                    res.json({
                                                        status: 200,
                                                        message: "Something went wrong.",
                                                        error: err,
                                                        hassuccessed: false,
                                                    });
                                                } else {
                                                    user_id = user_data._id;
                                                    let token = user_data.usertoken;
                                                    //let link = 'http://localhost:3000/';
                                                    let link = "https://aimedix.com/";
                                                    var verifylink = `https://aimedix.com/?token=${token}`
                                                    let datacomposer = (lang, { verifylink }) => {
                                                        return {};
                                                    };
                                                    switch (_usertype) {
                                                        case UserType.patient:
                                                            datacomposer = EMAIL.patientEmail.welcomeEmail;
                                                            break;
                                                        case UserType.doctor:
                                                            datacomposer = EMAIL.doctorEmail.welcomeEmail;
                                                            break;
                                                        case UserType.pharmacy:
                                                            datacomposer = EMAIL.pharmacyEmail.welcomeEmail;
                                                            break;
                                                        case UserType.insurance:
                                                            datacomposer = EMAIL.insuranceEmail.welcomeEmail;
                                                            break;
                                                        case UserType.paramedic:
                                                            datacomposer = EMAIL.insuranceEmail.welcomeEmail;
                                                            break;
                                                        case UserType.hospitaladmin:
                                                            datacomposer = EMAIL.hospitalEmail.welcomeEmail;
                                                            break;
                                                        case UserType.nurse:
                                                            datacomposer = EMAIL.nursetEmail.welcomeEmail;
                                                            break;
                                                    }
                                                    generateTemplate(
                                                        datacomposer(_language, { verifylink: verifylink }),
                                                        (error, html) => {
                                                            if (!error) {
                                                                let mailOptions = {
                                                                    from: "contact@aimedis.com",
                                                                    to: req.body.email,
                                                                    subject: getSubject(
                                                                        _language,
                                                                        SUBJECT_KEY.welcome_title_aimedis
                                                                    ),
                                                                    html: html,
                                                                };
                                                                let sendmail = transporter.sendMail(mailOptions);
                                                                if (sendmail) {
                                                                    console.log("Mail is sent ");
                                                                }
                                                            }
                                                        }
                                                    );

                                                    User.findOne({ _id: user_id }, function (err, doc) {
                                                        if (err && !doc) {
                                                            res.json({
                                                                status: 200,
                                                                hassuccessed: false,
                                                                message: "Something went wrong",
                                                                error: err,
                                                            });
                                                        } else {
                                                            console.log("doc", doc);
                                                            res.json({
                                                                status: 200,
                                                                message: "User is added Successfully",
                                                                hassuccessed: true,
                                                                data: doc,
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        });
                }
            } else {
                console.log("1")
                res.json({
                    status: 200,
                    hassuccessed: false,
                    msg: "Authentication required.",
                });
            }
        })
        .catch(function (error) {
            console.log("err", error)
            res.json({
                status: 200,
                hassuccessed: false,
                msg: "Authentication required.",
            });

        })

});

module.exports = router;