require("dotenv").config();
var re = require("../regions.json");
const axios = require("axios");
var express = require("express");
let router = express.Router();
var Virtual_Specialty = require("../schema/virtual_specialty.js");
var virtual_Case = require("../schema/virtual_cases.js");
var virtual_Task = require("../schema/virtual_tasks.js");
var virtual_Service = require("../schema/virtual_services.js");
var virtual_Invoice = require("../schema/virtual_invoice.js");
var picture_Evaluation = require("../schema/pictureevaluation_feedback");
var User = require("../schema/user.js");
var questionaire = require("../schema/questionaire");
var Institute = require("../schema/institute.js");
var Appointments = require("../schema/appointments");
var virtual_step = require("../schema/virtual_step");
var answerspatient = require("../schema/answerspatient");
var Prescription = require("../schema/prescription");
var Cretificate = require("../schema/sick_certificate");
var sick_meeting = require("../schema/sick_meeting");
var marketing_user = require("../schema/marketing_user");
var handlebars = require("handlebars");
var jwtconfig = require("../jwttoken");
const moment = require("moment");
var fs = require("fs");
const { join } = require("path");
const {
  getSubject,
  SUBJECT_KEY,
  EMAIL,
  generateTemplate,
} = require("../emailTemplate/index.js");
var html = fs.readFileSync(join(`${__dirname}/Invoice.html`), "utf8");
var html2 = fs.readFileSync(join(`${__dirname}/index.html`), "utf8");
var billinvoice1 = fs.readFileSync(join(`${__dirname}/medical.html`), "utf8");
var billinvoice2 = fs.readFileSync(join(`${__dirname}/2image.html`), "utf8");
var billinvoice3 = fs.readFileSync(join(`${__dirname}/3image.html`), "utf8");
var bill = fs.readFileSync(join(`${__dirname}/bill.html`), "utf8");
var sick = fs.readFileSync(join(`${__dirname}/email.html`), "utf8");
var html_to_pdf = require("html-pdf-node");
var nodemailer = require("nodemailer");
const { virtual } = require("../schema/topic.js");
var flatArraya = [];
var Inhospital = [];
var InhopspitalInvoice = [];
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 25,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
var mongoose = require("mongoose");
var re = require("../regions.json");
var aws = require("aws-sdk");
const { getMsgLang, trans } = require("./GetsetLang");
const sendSms = require("./sendSms");

router.post("/UpdateAddress", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var case_number = req.body.case_number
    const VirtualtToSearchWith = new virtual_Case({ case_number });
    VirtualtToSearchWith.encryptFieldsSync();
    virtual_Case.findOne({ case_number: { $in: [case_number, VirtualtToSearchWith.case_number] } }, function (err, data1) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
          error: err,
        });
      } else {
        if(data1){
          User.findOne({ _id: data1.patient_id }, function (err, data) {
            if (err) {
              console.log("err",err)
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              if (data) {
                console.log("data",data)
                console.log("data",data.country,data.country_code)
                if (data.address && data.city && data.street && data.country && data.pastal_code) {
                  virtual_Case.updateMany({ case_number: { $in: [case_number, VirtualtToSearchWith.case_number] } }, { external_space: true }, function (err, data2) {
                    if (err) {
                      console.log("err2",err)
                      res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong",
                        error: err,
                      });
                    } else {
                      res.json({
                        status: 200,
                        hassuccessed: true,
                        message: "Already upto date",
                      });
                    }
                  })
                } else {
                  var sendData =
                    `<div>Dear Patient,
                    Please fill your full address at your profile of Aimedis, The hospital- ${req.body.HospitalName} wants to add you in AIS Care, for that hospital admin staff needs your proper address, So hospital can add you as AIS Care. Please update full address immediately.</div>`;
                    var sendMob=`Dear Patient,Please fill your full address at your profile of Aimedis, The hospital- ${req.body.HospitalName} wants to add you in AIS Care, for that hospital admin staff needs your proper address, So hospital can add you as AIS Care. Please update full address immediately.`
  
                  generateTemplate(
                    EMAIL.generalEmail.createTemplate("en", {
                      title: "",
                      content: sendData,
                    }),
                    (error, html) => {
                      if (!error) {
                        let mailOptions = {
                          from: "contact@aimedis.com",
                          to: data.email,
                          subject: "Update your Address",
                          html: html,
                        };
                        let sendmail = transporter.sendMail(mailOptions);
                      }
                    }
                  );
                  var lan1 = getMsgLang(data._id);
                  lan1.then((result) => {
                    result = result === "ch" ? "zh" : result === "sp" ? "es" : result === "rs" ? "ru" : result;
                    trans(sendMob, { source: "en", target: result }).then((res1) => {
                      sendSms(data.mobile, res1).then((result) => { }).catch((e) => { })
                    });
                  })
                  res.json({
                    status: 200,
                    message: "Mail sent Successfully",
                    hassuccessed: true,
                  })
                }
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "No User Found",
                });
              }
            }
          })
        }else{
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No User Found",
          });
        }
      }
    })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }

});


module.exports = router;