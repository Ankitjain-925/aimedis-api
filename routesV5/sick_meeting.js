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
var sickleave = fs.readFileSync(join(`${__dirname}/email.html`), "utf8");
var bill = fs.readFileSync(join(`${__dirname}/bill.html`), "utf8");
var html_to_pdf = require("html-pdf-node");
var nodemailer = require("nodemailer");
const { virtual } = require("../schema/topic.js");
var flatArraya = [];
var Inhospital = [];
var InhopspitalInvoice = [];
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 2525,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
var mongoose = require("mongoose");

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

router.get("/GetAllPatientData/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { patient_id: req.params.patient_id },
      { task_type: "sick_leave" },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: userdata });
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
});

router.post("/DoctorMail", function (req, res) {
  var sendData = "Dear Doctor," + "<br/>";
  "Here is the new Sick leave certificate request from the " +
    req.body.first_name +
    req.body.last_name +
    req.body.profile_id +
    "for the time slot " +
    req.body.start +
    -+req.body.end +
    "at" +
    req.body.date +
    "<br/>" +
    "Please check the list of requests from the list page. Please update the status of request also accordingly.";
  generateTemplate(
    EMAIL.generalEmail.createTemplate("en", { title: "", content: sendData }),
    (error, html) => {
      if (req.body.email !== "") {
        let mailOptions = {
          from: "contact@aimedis.com",
          to: req.body.email,
          subject: "Sick leave certificate request",
          html: html,
        };
        let sendmail = transporter.sendMail(mailOptions);
        if (sendmail) {
          res.json({
            status: 200,
            message: "Mail sent Successfully",
            hassuccessed: true,
          });
        } else {
          res.json({
            status: 200,
            msg: "Mail is not sent",
            hassuccessed: false,
          });
        }
      } else {
        res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
      }
    }
  );
});

router.post("/approvedrequest/:task_id", function (req, res) {
  if (req.body.for_manage === "approved") {
    virtual_Task.updateOne(
      { _id: req.params.task_id },
      { approved: true },
      function (err, data) {
        if (err && !data) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          sendData = "Dear Patient," + "<br/>";
          "Your request for the sick leave certificate is accepted by the doctor on " +
            req.body.date +
            "at" +
            req.body.start +
            "to" +
            req.body.end +
            "So, for the further process please complete your payment process from the request list page";
          generateTemplate(
            EMAIL.generalEmail.createTemplate("en", {
              title: "",
              content: sendData,
            }),
            (error, html) => {
              if (req.body.email !== "") {
                let mailOptions = {
                  from: "contact@aimedis.com",
                  to: req.body.email,
                  subject: "Approve sick leave request by Doctor",
                  html: html,
                };
                let sendmail = transporter.sendMail(mailOptions);
                if (sendmail) {
                  res.json({
                    status: 200,
                    message: "Mail sent Successfully",
                    hassuccessed: true,
                  });
                } else {
                  res.json({
                    status: 200,
                    msg: "Mail is not sent",
                    hassuccessed: false,
                  });
                }
              } else {
                res.json({
                  status: 200,
                  msg: "Mail is not sent",
                  hassuccessed: false,
                });
              }
            }
          );
        }
      }
    );
  }
});

router.delete("/AddMeeting/:session_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    sick_meeting.findByIdAndRemove(req.params.session_id, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong.",
          error: err,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: true,
          message: "Meeting is Deleted Successfully",
        });
      }
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.post("/AddMeeting/:user_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var sick_meetings = new sick_meeting(req.body);
    sick_meetings.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        var sendData = `<div>Dear Patient,<br/>
        Your payment process for sick leave certificate application is completed successfully.
          "<br/>";
        Please do join the Video call at  
          ${req.body.date}
          from the time slot
          ${req.body.start}
          ${req.body.end}
        <br/>
        Your Video call joining link is
          ${req.body.patient_link}
        Please remind the date and timing as alloted.</div>`;

        var sendData1 = `<div>Dear Doctor<br/>
        The payment process for sick leave certificate application is completed successfully.
        <br/>
        Please do join the Video call at
          ${req.body.date}
          from the time slot
          ${req.body.start}+""+
          ${req.body.end}
          <br/>
        Your Video call joining link is
          ${req.body.doctor_link}
        Please remind the date and timing as alloted.</div>`;

        if (req.body.patient_mail !== "") {
          generateTemplate(
            EMAIL.generalEmail.createTemplate("en", {
              title: "",
              content: sendData,
            }),
            (error, html) => {
              if (!error) {
                let mailOptions = {
                  from: "contact@aimedis.com",
                  to: req.body.patient_mail,
                  subject: "Sick leave certificate request",
                  html: html,
                };

                let sendmail = transporter.sendMail(mailOptions);
              }
            }
          );
          User.find({ _id: req.params.user_id }, function (err, userdata) {
            if (err && !userdata) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              generateTemplate(
                EMAIL.generalEmail.createTemplate("en", {
                  title: "",
                  content: sendData1,
                }),
                (error, html) => {
                  if (!error) {
                    let mailOptions1 = {
                      from: "contact@aimedis.com",
                      to: userdata.email,
                      subject: "Sick leave certificate request",
                      html: html,
                    };

                    let sendmail1 = transporter.sendMail(mailOptions1);
                  }
                }
              );
            }
          });
        }

        res.json({
          status: 200,
          message: "Added Successfully",
          hassuccessed: true,
          data: user_data,
        });
      }
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.get("/PatientTask/:profile_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { "assinged_to.profile_id": req.params.profile_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: userdata });
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
});

module.exports = router;
