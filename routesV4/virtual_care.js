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
var sick_meeting = require("../schema/sick_meeting");
var answerspatient = require("../schema/answerspatient");
var Prescription = require("../schema/prescription");
var Cretificate = require("../schema/sick_certificate");
var handlebars = require("handlebars");
var jwtconfig = require("../jwttoken");
const moment = require("moment");
const { TrunkInstance } = require("twilio/lib/rest/trunking/v1/trunk");
var fullinfo = [];
var newcf = [];
const { getMsgLang, trans } = require("./GetsetLang");
const sendSms = require("./sendSms");
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
var bill3 = fs.readFileSync(join(`${__dirname}/bill2.html`), "utf8");

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
const { encrypt, decrypt } = require("./Cryptofile.js");

// function getDate(date, dateFormat) {
//   var d = new Date(date);
//   var monthNames = [
//     "01",
//     "02",
//     "03",
//     "04",
//     "05",
//     "06",
//     "07",
//     "08",
//     "09",
//     "10",
//     "11",
//     "12",
//   ],
//     month = monthNames[d.getMonth()],
//     day = d.getDate(),
//     year = d.getFullYear();
//   if (day.length < 2) day = "0" + day;
//   if (dateFormat === "YYYY/DD/MM") {
//     return year + " / " + day + " / " + month;
//   } else if (dateFormat === "DD/MM/YYYY") {
//     return day + " / " + month + " / " + year;
//   } else {
//     return month + " / " + day + " / " + year;
//   }
// }



  router.get(
    "/PrFuTask/:patient_profile_id",
    function (req, res, next) {
      const token = req.headers.token;
      let legit = jwtconfig.verify(token);
      if (legit) {
        var arr = [];
        
        virtual_Task.find(
          {
            "assinged_to.profile_id": req.params.patient_profile_id,
            $or: [{ is_decline: { $exists: false } }, { is_decline: false }],
          },
          function (err, userdata) {
            if (err && !userdata) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              for (i = 0; i < userdata.length; i++) {
                let today = new Date().setHours(0, 0, 0, 0);
              let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);
              if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))){
                // userdata.sort(mySorter);
                arr.push(userdata[i])
                }
              }
              res.json({ status: 200, hassuccessed: true, data: arr });
            }
          }
        );
      } else {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Authentication required.",
        });
      }
    }
  );

  router.get(
    "/PastTask/:patient_profile_id",
    function (req, res, next) {
      const token = req.headers.token;
      let legit = jwtconfig.verify(token);
      if (legit) {
        var arr1 = [];
        
        virtual_Task.find(
          {
            "assinged_to.profile_id": req.params.patient_profile_id,
            $or: [{ is_decline: { $exists: false } }, { is_decline: false }],
          },
          function (err, userdata) {
            if (err && !userdata) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              for (i = 0; i < userdata.length; i++) {
                let today = new Date().setHours(0, 0, 0, 0);
                
              let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);
              
              if (moment(data_d).isBefore(today)){
                // userdata.sort(mySorter);
                arr1.push(userdata[i])
                }
              }
              res.json({ status: 200, hassuccessed: true, data: arr1 });
            }
          }
        );
      } else {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Authentication required.",
        });
      }
    }
  );






module.exports = router;
