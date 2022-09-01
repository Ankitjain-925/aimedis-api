require("dotenv").config();
var express = require("express");
let router = express.Router();
const user = require("../schema/user.js");
var Video_Conference = require("../schema/pictureevaluation_feedback");
const vidchat = require("../schema/vid_chat_account.js")
const Cappointment = require("../schema/conference_appointment.js")
const Appointment = require("../schema/appointments")
const virtual_Task = require("../schema/virtual_tasks")
const CareModel = require("../schema/care_questionnaire")
var handlebars = require("handlebars");
var fs = require("fs");
const { join } = require("path");
var bill3 = fs.readFileSync(join(`${__dirname}/bill2.html`), "utf8");
var jwtconfig = require("../jwttoken");
var html_to_pdf = require("html-pdf-node");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 25,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
const {
  getSubject,
  SUBJECT_KEY,
  EMAIL,
  generateTemplate,
} = require("../emailTemplate/index.js");
const { type } = require("os");
const STRIPE_SECRET_KEY = process.env.LMS_STRIPE_SECRET_KEY_TEST;
const stripe = require('stripe')(STRIPE_SECRET_KEY);



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

router.post("/getuserchat", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let patient_id = req.body._id
    let email = req.body.email
    const messageToSearchWith = new user({ patient_id, email });
    messageToSearchWith.encryptFieldsSync();
    user.find(
      { $or: [{ _id: req.body._id }, { patient_id: messageToSearchWith._id }, { email: messageToSearchWith.email }] },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Information not found",
            error: err,
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: userdata });
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

router.post("/AddVideoUserAccount", function (req, res, next) {
    const token = req.headers.token;
    let  legit = jwtconfig.verify(token);
    console.log(legit)
    if (legit) {     
       const data = {
            email: legit.email || req.body.email,
            patient_id: legit.patient_id || req.body.patient_id,
            reg_amount: legit.reg_amount || req.body.reg_amount,
            password: legit.password     || req.body.password,
            username: legit.username     || req.body.username,
            is_payment: legit.is_payment || req.body.is_payment,
            prepaid_talktime: legit.prepaid_talktime || req.body.prepaid_talktime,
            status: legit.stauts || req.body.status,
      } 
      const Videodata = new vidchat(data)
      Videodata.save()
      .then(result => {
        res.json({
          status: 200,
          msg: 'User Register Successfully',
          data: result,
          hassuccessed: true
        })
      })
      .catch(err => {
        res.status(500).json({
          reeor: err
        })
      })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication Required.",
    });
  }
});

router.post("/AppointmentBook", function (req, res, next) {
  const token = req.headers.token;

  let legit = jwtconfig.verify(token);
  if (legit) {
    const Videodata = new Cappointment(req.body)
    Videodata.save()
      .then(result => {
        res.json({
          status: 200,
          msg: 'Appointment Book Successfully',
          data: result,
          hassuccessed: true
        })
      })
    })
    } else {

    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication Required.",
    });
  }
});

router.get("/DoctorList", async (req, res) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      user.find({ type: 'doctor', first_name: { $exists: true } })
        .then(result => {
          res.status(200).json({
            newbook: result

          });
        })
    } catch {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong."
      });
    }
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.post("/MailtoDrandPatient", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const messageToSearchWith = new user({ patient: req.body.patient });
    messageToSearchWith.encryptFieldsSync();
    Appointment.findOne({ patient: req.body.patient, type: "video-conference" }, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
          error: err,
        });
      } else {
        sendData = `Dear ${data.patient_info.first_name + " " + data.patient_info.last_name}<br/>
        You have an appointment with Dr. ${data.docProfile.first_name + " " + data.docProfile.last_name} on ${data.date} at ${data.start_time}.
        If you cannot take the appointment, please cancel it at least 24 hours before.
        If you have any questions, contact your doctor via .
        Alternatively, you can contact us via contact@aimedis.com.com or the Aimedis support chat if you have difficulties contacting your doctor.`
        sendData2 = `Dear ${data.docProfile.first_name + " " + data.docProfile.last_name}<br/>
        You have got an appointment with ${data.patient_info.first_name + " " + data.patient_info.last_name} on ${data.date} at ${data.start_time}.
       Please accept the appointment inside your Aimdis Profile. If you have  any questions,please contact the patient via ${data.patient_info.email} or Alternatively you can contact us via contact@aimedis.com. or the Aimedis support chat if you have difficulties contacting the patient.`;
        generateTemplate(
          EMAIL.generalEmail.createTemplate("en", {
            title: "",
            content: sendData,
          }),
          (error, html) => {
            if (data.patient_info.email !== "") {
              let mailOptions = {
                from: "contact@aimedis.com",
                to: data.patient_info.email,
                subject: "Approve sick leave request by Doctor",
                html: html,
              };
              let sendmail = transporter.sendMail(mailOptions);
              if (sendmail) {

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
        generateTemplate(
          EMAIL.generalEmail.createTemplate("en", {
            title: "",
            content: sendData2,
          }),
          (error, html) => {
            if (data.docProfile.email !== "") {
              let mailOptions = {
                from: "contact@aimedis.com",
                to: data.docProfile.email,
                subject: "Appointment System",
                html: html,
              };
              let sendmail = transporter.sendMail(mailOptions);
              if (sendmail) {

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
        res.json({
          status: 200,
          message: "Mail sent Successfully",
          hassuccessed: true,
        });
      }

    })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
})

router.post("/DownloadbillVC", async (req, res) => {

  try {
    handlebars.registerHelper("ifCond", function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
    var admit = [];
    var bill2 = [];
    var birthday = [];
    // var Data=[];
    {
      Object.entries(req.body).map(([key, value]) => {
        if (key === "data") {
          Object.entries(value).map(([key1, value1]) => {
            if (key1 === "birthday") {
              key1 = getDate(value1, "YYYY/MM/DD");
              birthday.push({ key1 });
            }
          });
        } else if (key === "admit_date") {
          admit.push({ k: "admit_date", v: getDate(value, "YYYY/MM/DD") });
        } else if (key === "bill_date") {
          bill2.push({ k: "bill_date", v: getDate(value, "YYYY/MM/DD") });
        }
      });
    }
    let task_id = req.body.task_id;
    var VirtualtToSearchWith = new virtual_Task({ _id: task_id });
    VirtualtToSearchWith.encryptFieldsSync();
    virtual_Task.find(
      {
        _id: { $in: [task_id, VirtualtToSearchWith._id] },

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
          var Date = getDate(userdata[0].created_at, "YYYY/MM/DD");
          var template1 = handlebars.compile(bill3);
          var htmlToSend2 = template1({
            bill2: bill2,
            admit: admit,
            pat_info: req.body,
            birthday: birthday,
            amt: userdata[0].amount,
            date: Date
          });

          var filename = "GeneratedReport.pdf";
          if (htmlToSend2) {
            var options = {
              args: ["--no-sandbox", "--disable-setuid-sandbox"],
              format: "A4",
              path: `${__dirname}/${filename}`,
              displayHeaderFooter: true,
              margin: { top: 80, bottom: 80, left: 60, right: 60 },
            };
            let file = [{ content: htmlToSend2 }];
            html_to_pdf.generatePdfs(file, options).then((output) => {
              const file = `${__dirname}/${filename}`;
              res.download(file);
            });
          }
          else {
            res.json({ status: 200, hassuccessed: true, filename: filename });
          }
        }
      }
    );
  } catch (e) {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Something went wrong.",
      error: e,
    });
  }
});


// router.get("/DoctorVC", function(req, res){
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//       .find({ type: 'doctor' },function(err,data){
//         if(err){
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             message: "Something went wrong",
//             error: err,
//           });
//         }else{
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             data:data,
//           });
//         }
//       })

//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });


router.post("/SaveQuestion", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      var type = "video-conference",
        datas = {
          ...req.body,
          type,
        }
      var bookdata = new CareModel(datas)
      bookdata.save(function (err, user_data) {
        if (err && !user_data) {
          res.json({ status: 200, message: "Something went wrong.", error: err });
        } else {
          res.json({
            status: 200,
            message: "Added Successfully",
            hassuccessed: true,
          });
        }
      });
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something wnet Wrong",
      });
    }

  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});



router.get("/withdrawal", function (req, res) {
  stripe.balanceTransactions.retrieve(
    'txn_1032HU2eZvKYlo2CEPtcnUvl', function (err, data) {
      if (err) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        res.json({
          status: 200,
          message: "Paayment Withdrawal",
          hassuccessed: true,
        });
      }
    }
  )
})


  router.post("/Get_Doctor", async(req, res) => {

    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      try{
    var alies_id = req.body.alies_id
    var email = req.body.email
    var profile_id = req.body.profile_id
    var speciality = req.body.speciality
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    const VirtualtToSearchWith1 = new user({ alies_id, email, profile_id, speciality, first_name, last_name });
    VirtualtToSearchWith1.encryptFieldsSync();
    var condition = {}
    if(req.body.alies_id || req.body.email || req.body.profile_id || req.body.speciality || req.body.first_name || req.body.last_name){
      if (req.body.alies_id) {
        condition["alies_id"] ={ $in: [req.body.alies_id, VirtualtToSearchWith1.alies_id]} ; 
      }
      if (req.body.email) {
        condition["email"] = { $in: [req.body.email, VirtualtToSearchWith1.email]}; 
      }
      if (req.body.profile_id) {
        condition["profile_id"] = { $in: [req.body.profile_id, VirtualtToSearchWith1.profile_id]} 
      }
      if (req.body.speciality) {
        condition["speciality"] = { $in: [req.body.speciality, VirtualtToSearchWith1.speciality]} ; 
      }
      if (req.body.first_name) {
        condition["first_name"] =  { $in: [req.body.first_name, VirtualtToSearchWith1.first_name]}; 
      }
      if (req.body.last_name) {
        condition["last_name"] =  { $in: [req.body.last_name, VirtualtToSearchWith1.last_name]}; 
      } 
      user.find(condition, function (err, data1) {
        if (err) {
          res.json({ status: 200, hassuccessed: true, error: err });
        } else {
          res.json({ status: 200, hassuccessed: true, data: data1 }); 
          }
        }
      )
    }
  } catch {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong."
      });
    }
    } else {
      res.json({
        status: 200,   
        hassuccessed: false,
        message: "Authentication required.",
    });
  }
})

router.get("/GetConferencePatient/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
    let patient_id =req.params.patient_id
    const messageToSearchWith = new vidchat({patient_id });
    messageToSearchWith.encryptFieldsSync();
    vidchat.find (
      {$or:[ {patient_id: req.params.patient_id},{patient_id:messageToSearchWith.patient_id} ]},
      function (err, userdata) {
        if (err && !userdata) {
          res.json ({
            status: 200,
            hassuccessed: false,
            message: "Information not found",
            error: err,
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: userdata });
        }
      }
      );
    }
  catch {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Something went wrong."
    });
  }
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.post("/givefeedback", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
      const token = req.headers.token;
      let legit = jwtconfig.verify(token);
      if (legit) {
      var type = "video-conference",
          datas = {
            ...req.body,
            type,
          }
          var bookdata = new Video_Conference(datas)
          bookdata.save(function (err, user_data) {
          if (err && !user_data) {
                  res.json({ status: 200, message: "Something went wrong.", error: err });
          } else {
              res.json({
                 status: 200,
                 message: "Added Successfully",
                 hassuccessed: true,
            });
          }
      });
      } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something wnet Wrong",
      });
    }
   } else {
     res.json({
       status: 200,
       hassuccessed: false,
       message: "Authentication required.",
    });
  }
});

router.get("/getfeedbackfordoctor/:doctor_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var type = "video-conference",
    datas = {
      type,
    }
    Video_Conference
        .findOne({ doctor_id: req.params.doctor_id, type: "video-conference" })
        .exec(function (err, data) {
        if (err && !data) {
          res.json ({
            status: 200,
            message: "Something went wrong.",
            error: err,
            hassuccessed: false,
          });
        } else {
          res.json ({
            status: 200,
            message: "data fetch",
            hassuccessed: true,
            data: data,
          });
        }
      });
  } else {
    res.json ({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});


module.exports = router;                                                                            