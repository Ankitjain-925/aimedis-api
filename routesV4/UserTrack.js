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

//var paths= "http:/localhost:5000/uploads/Trackrecord"
var paths = "https://aimedis1.com/public/uploads/Trackrecord";

router.get("/getKyc/:UserId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const user_id = req.params.UserId;
    const messageToSearchWith = new kyc({ user_id });
    messageToSearchWith.encryptFieldsSync();
    kyc.findOne(
      {
        $or: [
          { user_id: messageToSearchWith.user_id },
          { user_id: req.params.UserId },
        ],
      },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "User is not found",
            error: err,
          });
        } else {
          if (doc) {
            var data = true;
          } else {
            var data = false;
          }
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Data is fetched",
            data: data,
            fulldata: doc,
          });
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

router.put("/updateKyc/:KYCId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  if (legit) {
    kyc.updateOne(
      { _id: req.params.KYCId },
      { $set: req.body },
      { new: true },
      (err, doc1) => {
        if (err && !doc1) {
          res.json({
            status: 450,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          res.json({
            status: 450,
            hassuccessed: true,
            message: "KYC is updated",
          });
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

router.get("/getAllKyc", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    kyc.find(function (err, doc) {
      if (err && !doc) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "User is not found",
          error: err,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Data is fetched",
          data: doc,
        });
      }
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.post("/Addkyc", function (req, res, next) {
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

router.get("/Get_patient_gender/:UserId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    user.findOne({ _id: req.params.UserId }, function (err, doc) {
      if (err && !doc) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "User is not found",
          error: err,
        });
      } else {
        if (doc && doc.sex) {
          var gender = doc.sex;
        } else {
          var gender = false;
        }
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Data iis fetched",
          data: gender,
        });
      }
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

//Edit track records
router.put("/AddTrack/:UserId/:TrackId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    // var track_id = {track_id : req.params.TrackId}

    req.body.data.created_by = encrypt(req.body.data.created_by);
    req.body.data._enc_created_by = true;

    user.findOneAndUpdate(
      {
        _id: req.params.UserId,
        "track_record.track_id": req.params.TrackId,
      },
      {
        $set: {
          "track_record.$": req.body.data,
        },
      },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "User is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "track is updated",
            });
          }
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

/*Added for the handle precriptions*/

router.put("/HandlePrescriptions/:UserId/:TrackId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    console.log("req.body.data.created_by", req.body.data.created_by);
    var created_by = req.body.data.created_by;
    req.body.data.created_by = encrypt(req.body.data.created_by);
    req.body.data._enc_created_by = true;

    user.findOneAndUpdate(
      {
        _id: req.params.UserId,
        "track_record.track_id": req.params.TrackId,
      },
      {
        $set: {
          "track_record.$": req.body.data,
        },
      },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "User is not found",
            });
          } else {
            console.log("created_by", created_by);
            user.findOne({ _id: created_by }).then((docUser) => {
              if (docUser) {
                var data = req.body.data;
                var lan1 = getMsgLang(docUser._id);

                lan1.then((result) => {
                  // var sendData = 'Hi' + docUser.first_name + ' ' + docUser.last_name + ",<br/><br/>" +
                  //     "Patient " + data.patient_name + "'s prescription is handled by " + data.pharma.name + '.<br/>' +
                  //     'If you have any questions for the pharmacist, please write him an email at ' + data.pharma.email + '. <br/>' +
                  //     'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/><br/></br>' +
                  //     'Your Aimedis team';
                  console.log("I am here");
                  generateTemplate(
                    EMAIL.doctorEmail.handledPrescriptionnSystem(result, {
                      doctor_name: docUser.first_name + " " + docUser.last_name,
                      patient_id: data.alies_id,
                      patient_name: data.patient_name,
                      date:
                        getDate(
                          moment(data.created_on).format("YYYY/MM/DD"),
                          "YYYY/MM/DD"
                        ) || "",
                      time:
                        getDate(
                          moment(data.created_on).format("YYYY/MM/DD"),
                          "YYYY/MM/DD"
                        ) || "",
                      pharmacy_id: data.pharma.alies_id || "",
                      pharmacy_name: data.pharma.name || "",
                    }),
                    (error, html) => {
                      if (!error) {
                        console.log("I am ghtf");
                        let mailOptions = {
                          from: "contact@aimedis.com",
                          to: docUser.email,
                          subject: "Prescription handled Report",
                          html: html,
                        };
                        let sendmail = transporter.sendMail(mailOptions);
                        if (sendmail) {
                          console.log("Mail is sent ");
                        }
                      }
                    }
                  );
                  // generateTemplate(
                  //     EMAIL.doctorEmail.handledPrescriptionnSystem(result, {
                  //      doctor_name: docUser.first_name + ' ' + docUser.last_name,
                  //      patient_id: data.alies_id,
                  //      patient_name : data.patient_name,
                  //      date : getDate(moment(data.created_on).format('YYYY/MM/DD'), 'YYYY/MM/DD')|| '',
                  //      time : getDate(moment(data.created_on).format('YYYY/MM/DD'), 'YYYY/MM/DD')|| '',
                  //      pharmacy_id : data.pharma.alies_id || '',
                  //      pharmacy_name : data.pharma.name || '',
                  //      pharmacy_email : data.pharma.email || '',
                  //      pharmacy_phone : data.pharma.mobile || ''
                  //     }),
                  //     (err, data) => {
                  //         console.log('I am here22')
                  //       if (!err) {
                  //         var mailOptions = {
                  //                     from: "contact@aimedis.com",
                  //                     to: 'ankita.webnexus@gmail.com',
                  //                     subject: 'Prescription handled Report',
                  //                     html:
                  //                 };
                  //                 var sendmail = transporter.sendMail(mailOptions)
                  //                 if (sendmail) {
                  //                     console.log('Mail is sent')
                  //                 }
                  //       }
                  //     }
                  //   );
                  // result = result === 'ch' ? 'zh' : result === 'sp' ? 'es' : result === 'rs' ? 'ru' : result;

                  // trans(sendData, { source: "en", target: result }).then((res) => {
                  //     var mailOptions = {
                  //         from: "contact@aimedis.com",
                  //         to: docUser.email,
                  //         subject: 'Prescription handled Report',
                  //         html: res.replace(/ @ /g, '@')
                  //     };
                  //     var sendmail = transporter.sendMail(mailOptions)
                  //     if (sendmail) {
                  //         console.log('Mail is sent')
                  //     }
                  // });
                  var sendData2 =
                    "Patient " +
                    data.patient_name +
                    "'s prescription is handled by " +
                    data.pharma.name +
                    " at " +
                    data.created_on +
                    " Regards, Aimedis team.";
                  trans(sendData2, { source: "en", target: result }).then(
                    (res) => {
                      let sentSMS = sendSms(docUser.mobile, res);
                      if (sentSMS) {
                        console.log("Message is sent .....");
                      }
                    }
                  );
                });
                // let dhtml =  'Hi <b>' + docUser.first_name +' '+ docUser.last_name + "</b>,<br/><br/>" +
                // "Patient " + data.patient_name + "'s prescription is handled by " + data.pharma.name + '.<br/>' +
                // 'If you have any questions for the pharmacist, please write him an email at ' + data.pharma.email + '. <br/>' +
                // 'Alternatively, you can contact us via contact@aimedis.com or WhatApp if you have difficulties contacting your doctor.<br/></br>' +
                // '<b>Your Aimedis team </b>'

                //     var mailOptions = {
                //         from: "contact@aimedis.com",
                //         to: docUser.email,
                //         subject: 'Prescription handled Report',
                //         html: dhtml
                //     };
                //     let sendmail = transporter.sendMail(mailOptions)
                //     if(sendmail){
                //         console.log('Mail is sent')
                //     }
              }
            });
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "track is updated",
            });
          }
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
//Add the track record

router.put("/AddTrack/:UserId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var ids = { track_id: uuidv1() };
    req.body.data.created_by = encrypt(req.body.data.created_by);
    req.body.data._enc_created_by = true;
    var full_record = { ...ids, ...req.body.data };
    user.updateOne(
      { _id: req.params.UserId },
      { $push: { track_record: full_record } },
      { safe: true, upsert: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "User is not found",
            });
          } else {
            console.log("pharmacy_id", req.body.data.pharmacy_id);
            if (req.body.data && req.body.data.pharmacy_id) {
              const messageToSearchWith = new user({
                profile_id: req.body.data.pharmacy_id,
              });
              messageToSearchWith.encryptFieldsSync();
              var patient_id2 = {
                patient_id: req.body.data.patient_profile_id,
              };
              var full_record1 = { ...patient_id2, ...ids, ...req.body.data };
              user.updateOne(
                {
                  $or: [
                    { profile_id: req.body.data.pharmacy_id },
                    { profile_id: messageToSearchWith.profile_id },
                  ],
                },
                { $push: { track_record: full_record1 } },
                { safe: true, upsert: true },
                function (err, doc) {
                  if (err && !doc) {
                    res.json({
                      status: 200,
                      hassuccessed: false,
                      msg: "Something went wrong",
                      error: err,
                    });
                  } else {
                    if (doc.nModified == "0") {
                      console.log("I am heereee056");
                      res.json({
                        status: 200,
                        hassuccessed: false,
                        msg: "Pharmacy is not found",
                      });
                    } else {
                      console.log("I am heereee to send on Pharmcay too.");
                      res.json({
                        status: 200,
                        hassuccessed: true,
                        msg: "track is updated",
                      });
                    }
                  }
                }
              );
            } else {
              console.log("terrererer");
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "track is updated",
              });
            }
            // res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
          }
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

router.put("/AddTrackAdmin", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var ids = { track_id: uuidv1() };
    req.body.data.created_by = encrypt(req.body.data.created_by);
    req.body.data._enc_created_by = true;
    var full_record = { ...ids, ...req.body.data };
      user.updateMany(
        {_id: { $in: req.body.data.UserId }},
        { $push: { track_record: full_record } },
        { safe: true, upsert: true },
        function (err, doc) {
          if (err && !doc) {
            console.log("err", err)
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          } else {
            console.log("doc", doc)
            if (doc.nModified == "0") {
              res.json({
                status: 200,
                hassuccessed: false,
                msg: "User is not found",
              });
            } else {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  msg: "track is updated",
                });
            }
          }
        })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});


//remove track record
router.delete("/AddTrack/:UserId/:TrackId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    user.updateOne(
      { _id: req.params.UserId },
      { $pull: { track_record: { track_id: req.params.TrackId } } },
      { multi: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Track record is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "track is deleted",
            });
          }
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

router.get("/AppointOfDate/:date", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const doctor_id = legit.id;
    const messageToSearchWith = new Appointment({ doctor_id });
    messageToSearchWith.encryptFieldsSync();
    Appointment.find(
      {
        $or: [
          { doctor_id: messageToSearchWith.doctor_id },
          { doctor_id: legit.id },
        ],
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

//Added by Ankita
router.get("/AppointOfDate1/:date", function (req, res, next) {
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

router.get("/AppointmentByDate1", function (req, res, next) {
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

router.get("/AppointmentByDate", function (req, res, next) {
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

router.post("/appointment", function (req, res) {
  var Appointments = new Appointment(req.body);
  Appointments.save(function (err, user_data) {
    if (err && !user_data) {
      res.json({ status: 200, message: "Something went wrong.", error: err });
    } else {
      var date = getDate(
        moment(req.body.date).format("YYYY/MM/DD"),
        "YYYY/MM/DD"
      );
      console.log("dates", date);
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
          (error, html) => {
            if (!error) {
              let mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.patient_info.email,
                subject: getSubject(
                  result,
                  SUBJECT_KEY.aimedis_appointment_system
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
          (error, html) => {
            if (!error) {
              let mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.docProfile.email,
                subject: getSubject(
                  result,
                  SUBJECT_KEY.aimedis_appointment_system
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
function getTime(date, timeFormat) {
  date = new Date(date);
  if (timeFormat === "12") {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  } else {
    var h = (date.getHours() < 10 ? "0" : "") + date.getHours();
    var m = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return h + ":" + m;
  }
}

//for emergency access by doctor
router.get("/getUser/:UserId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const profile_id = req.params.UserId;
    const alies_id = req.params.UserId;
    const messageToSearchWith = new user({ profile_id });
    const messageToSearchWith1 = new user({ alies_id });
    messageToSearchWith.encryptFieldsSync();
    messageToSearchWith1.encryptFieldsSync();
    user.findOne(
      {
        type: "patient",
        $or: [
          { alies_id: messageToSearchWith1.alies_id },
          { profile_id: messageToSearchWith.profile_id },
          { profile_id: req.params.UserId },
          { alies_id: req.params.UserId },
        ],
      },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "User is not found",
            error: err,
          });
        } else {
          if (doc == null || doc == "undefined") {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "User is not exist",
            });
          } else {
            // if (doc.family_doc.includes(legit.id)) {
            //     res.json({ status: 200, hassuccessed: true, msg: 'User is found', user_id : doc._id  })
            // }
            // else {
            if (req.query.comefrom && req.query.comefrom === "healthdata") {
              if (req.query.pin && req.query.pin !== "undefined") {
                if (req.query.pin == doc.pin) {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    msg: "User is found",
                    user_id: doc._id,
                  });
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    msg: "Pin is not Correct",
                  });
                }
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  msg: "Please Enter the Pin",
                });
              }
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "User is found",
                user_id: doc._id,
              });
            }
          }
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
//Get the track record
router.get("/AddTrack/:UserId", function (req, res, next) {
  trackrecord1 = [];
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.params.UserId === legit.id) {
      user.find({ _id: req.params.UserId }, function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "User is not found",
            error: err,
          });
        } else {
          if (doc && doc.length > 0) {
            doc[0].track_record.sort(mySorter);
            if (doc[0].track_record.length > 0) {
              forEachPromise(doc[0].track_record, getAlltrack).then(
                (result) => {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    msg: "User is found",
                    data: trackrecord1,
                  });
                }
              );
            } else {
              res.json({ status: 200, hassuccessed: false, msg: "No data" });
            }
          } else {
            res.json({ status: 200, hassuccessed: false, msg: "No data" });
          }
        }
      });
    } else {
      user.find({ _id: req.params.UserId }, function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "User is not found",
            error: err,
          });
        } else {
          if (doc && doc.length > 0) {
            var finaloutput = [];
            doc[0].track_record.sort(mySorter);
            if (doc[0].track_record.length > 0) {
              if (doc[0].track_record.length > 0) {
                forEachPromises(
                  doc[0].track_record,
                  doc[0].Rigt_management[0],
                  getAlltrack1
                ).then((result) => {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    msg: "User is found",
                    data: trackrecord1,
                  });
                });
              }
            } else {
              res.json({ status: 200, hassuccessed: false, msg: "No data" });
            }
          } else {
            res.json({ status: 200, hassuccessed: false, msg: "No data" });
          }
        }
      });
    }
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});
router.get("/ArchivedTrack/:UserId", function (req, res, next) {
  track2 = [];
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    user.find({ _id: req.params.UserId }, function (err, doc) {
      if (err && !doc) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "User is not found",
          error: err,
        });
      } else {
        if (doc && doc.length > 0) {
          doc[0].track_record.sort(mySorter);
          if (doc[0].track_record.length > 0) {
            forEachPromise(doc[0].track_record, getAlltrack2).then((result) => {
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "User is found",
                data: track2,
              });
            });
          } else {
            res.json({ status: 200, hassuccessed: false, msg: "No data" });
          }
        } else {
          res.json({ status: 200, hassuccessed: false, msg: "No data" });
        }
      }
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

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

function getAlltrack(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      var created_by =
        data._enc_created_by === true
          ? decrypt(data.created_by)
          : data.created_by;
      user
        .findOne({ _id: created_by })
        .exec()
        .then(function (doc3) {
          var new_data = data;
          if (doc3) {
            if (doc3.last_name) {
              var created_by =
                doc3.first_name +
                " " +
                doc3.last_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            } else {
              var created_by =
                doc3.first_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            }

            new_data.created_by_temp = created_by;
            new_data.created_by = doc3._id;
            new_data.created_by_temp2 =
              created_by.substring(0, 7) +
              "... ( " +
              doc3.type.charAt(0).toUpperCase() +
              doc3.type.slice(1) +
              " )";
            new_data.created_by_image = doc3.image;
            if (doc3.alies_id) {
              new_data.created_by_profile = doc3.alies_id;
            } else {
              new_data.created_by_profile = doc3.profile_id;
            }
          }
          return new_data;
        })
        .then(function (new_data) {
          if (data.review_by) {
            user
              .findOne({ _id: data.review_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var reviewed_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var reviewed_by = doc5.first_name;
                  }
                  new_data.review_by_temp = reviewed_by;
                }
                return new_data;
              });
          }
          if (data.emergency_by) {
            user
              .findOne({ _id: data.emergency_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var emergency1_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var emergency1_by = doc5.first_name;
                  }
                  new_data.emergency_by_temp = emergency1_by;
                }
                return new_data;
              });
          }
          if (!data.archive) {
            trackrecord1.push(new_data);
          }

          resolve(trackrecord1);
        });
    });
  });
}

function getAlltrack2(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      var created_by =
        data._enc_created_by === true
          ? decrypt(data.created_by)
          : data.created_by;
      user
        .findOne({ _id: created_by })
        .exec()
        .then(function (doc3) {
          var new_data = data;
          if (doc3) {
            if (doc3.last_name) {
              var created_by =
                doc3.first_name +
                " " +
                doc3.last_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            } else {
              var created_by =
                doc3.first_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            }

            new_data.created_by_temp = created_by;
            new_data.created_by = doc3._id;
            new_data.created_by_temp2 =
              created_by.substring(0, 7) +
              "... ( " +
              doc3.type.charAt(0).toUpperCase() +
              doc3.type.slice(1) +
              " )";
            new_data.created_by_image = doc3.image;
            if (doc3.alies_id) {
              new_data.created_by_profile = doc3.alies_id;
            } else {
              new_data.created_by_profile = doc3.profile_id;
            }
          }
          return new_data;
        })
        .then(function (new_data) {
          if (data.review_by) {
            user
              .findOne({ _id: data.review_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var reviewed_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var reviewed_by = doc5.first_name;
                  }
                  new_data.review_by_temp = reviewed_by;
                }
                return new_data;
              });
          }
          if (data.emergency_by) {
            user
              .findOne({ _id: data.emergency_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var emergency1_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var emergency1_by = doc5.first_name;
                  }
                  new_data.emergency_by_temp = emergency1_by;
                }
                return new_data;
              });
          }
          if (data.archive) {
            track2.push(new_data);
          }

          resolve(track2);
        });
    });
  });
}

function getAlltrack1(data, right_management) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      var created_by =
        data._enc_created_by === true
          ? decrypt(data.created_by)
          : data.created_by;
      user
        .findOne({ _id: created_by })
        .exec()
        .then(function (doc3) {
          var new_data = data;
          if (doc3) {
            if (doc3.last_name) {
              var created_by =
                doc3.first_name +
                " " +
                doc3.last_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            } else {
              var created_by =
                doc3.first_name +
                " ( " +
                doc3.type.charAt(0).toUpperCase() +
                doc3.type.slice(1) +
                " )";
            }

            new_data.created_by_temp = created_by;
            new_data.created_by = doc3._id;
            new_data.created_by_temp2 =
              created_by.substring(0, 7) +
              "... ( " +
              doc3.type.charAt(0).toUpperCase() +
              doc3.type.slice(1) +
              " )";
            new_data.created_by_image = doc3.image;
            if (doc3.alies_id) {
              new_data.created_by_profile = doc3.alies_id;
            } else {
              new_data.created_by_profile = doc3.profile_id;
            }
          }
          return new_data;
        })
        .then(function (new_data) {
          if (data.review_by) {
            user
              .findOne({ _id: data.review_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var reviewed_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var reviewed_by = doc5.first_name;
                  }
                  new_data.review_by_temp = reviewed_by;
                }
                return new_data;
              });
          }
          if (data.emergency_by) {
            user
              .findOne({ _id: data.emergency_by })
              .exec()
              .then(function (doc5) {
                var new_data = data;
                if (doc5) {
                  if (doc5.last_name) {
                    var emergency1_by = doc5.first_name + " " + doc5.last_name;
                  } else {
                    var emergency1_by = doc5.first_name;
                  }
                  new_data.emergency_by_temp = emergency1_by;
                }
                return new_data;
              });
          }
          if (!new_data.public || new_data.public == "") {
            if (!data.archive) {
              if (
                right_management &&
                right_management.opt &&
                right_management.opt === "in"
              ) {
                if (
                  right_management.opt_set &&
                  right_management.opt_set === "until"
                ) {
                  var d1 = new Date();
                  let end_date = new Date(right_management.opt_until);
                  end_date = end_date.setDate(end_date.getDate() + 1);
                  var d2 = new Date(end_date).setHours(0, 0, 0, 0);
                  if (d1 >= d2) {
                    console.log("rrr45r");
                    trackrecord1.push(new_data);
                  }
                }
              } else if (
                right_management &&
                right_management.opt &&
                right_management.opt === "out"
              ) {
                if (
                  right_management.opt_set &&
                  right_management.opt_set === "until"
                ) {
                  var d1 = new Date();
                  let end_date = new Date(right_management.opt_until);
                  end_date = end_date.setDate(end_date.getDate() + 1);
                  var d2 = new Date(end_date).setHours(0, 0, 0, 0);
                  if (d1 <= d2) {
                    trackrecord1.push(new_data);
                  }
                } else {
                  trackrecord1.push(new_data);
                }
              } else {
              }
            }
          } else if (!new_data.visible && new_data.public == "always") {
            if (!data.archive) {
              if (
                right_management &&
                right_management.opt &&
                right_management.opt === "in"
              ) {
                if (
                  right_management.opt_set &&
                  right_management.opt_set === "until"
                ) {
                  var d1 = new Date();
                  let end_date = new Date(right_management.opt_until);
                  end_date = end_date.setDate(end_date.getDate() + 1);
                  var d2 = new Date(end_date).setHours(0, 0, 0, 0);
                  console.log("rrrr");
                  if (d1 >= d2) {
                    console.log("rrr333r");
                    trackrecord1.push(new_data);
                  }
                }
              } else if (
                right_management &&
                right_management.opt &&
                right_management.opt === "out"
              ) {
                if (
                  right_management.opt_set &&
                  right_management.opt_set === "until"
                ) {
                  var d1 = new Date();
                  let end_date = new Date(right_management.opt_until);
                  end_date = end_date.setDate(end_date.getDate() + 1);
                  var d2 = new Date(end_date).setHours(0, 0, 0, 0);
                  if (d1 <= d2) {
                    trackrecord1.push(new_data);
                  }
                } else {
                  trackrecord1.push(new_data);
                }
              } else {
              }
            }
          } else if (
            new_data.visible == "show" &&
            new_data.public == "always"
          ) {
            trackrecord1.push(new_data);
          } else {
            var d1 = new Date();
            let end_date = new Date(new_data.public);
            end_date = end_date.setDate(new Date(end_date).getDate() + 1);
            var d2 = new Date(end_date).setHours(0, 0, 0, 0);
            // if (d1.getTime() <= d2.getTime()) {
            //     trackrecord1.push(new_data);
            // }
            if (new_data.visible == "show") {
              if (d1 <= d2) {
                if (!data.archive) {
                  trackrecord1.push(new_data);
                }
              }
            } else {
              if (d1 >= d2) {
                if (!data.archive) {
                  trackrecord1.push(new_data);
                }
              }
            }
          }
          resolve(trackrecord1);
        });
    });
  });
}

function sendmailteam(data, legit) {
  var html =
    "Dear Aimedis Second Opinion team,<br/>" +
    "Mr./Mrs. " +
    legit.name +
    " Patient ID " +
    legit.id +
    ", sent a second opinion request with <b>the following information:<br/><br/>" +
    "Selected specialist:</b>   " +
    data.specialist +
    "<br/>" +
    "<b>Way of transfer:</b>   " +
    data.online_offline +
    "<br/>" +
    "<b>Selected specialty:</b>   " +
    data.speciality +
    "<br/>" +
    "<b>How are you?:</b>   " +
    data.how_are_you +
    "<br/>" +
    "<b>Knows diseases:    " +
    data.know_diseases +
    "</b><br/>" +
    "<b>Medication:   " +
    data.medication +
    "</b><br/>" +
    "<b>Allergies:   " +
    data.allergies +
    "</b><br/>" +
    "<b>Profession:   " +
    data.professions +
    "</b><br/>" +
    "<b>Uploaded files:   attached to this mail</b><br/>" +
    "<b>Detailed questions:   " +
    data.details +
    "</b><br/><br/>" +
    "Help now! <br/><br/>" +
    "<b>Aimedis B.V.</b><br/>" +
    "Sint Michaëlstraat 4<br/>" +
    "5935 BL Steyl<br/>" +
    "Netherlands<br/>" +
    "secondopinion@aimedis.com<br/>" +
    "+31 (0) 20 262 29 02<br/><br/><br/><br/>" +
    "<hr/><br/><I>Aimedis B.V. Netherlands<br/>" +
    "Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO<br/>" +
    "VAT No.: NL858194478B01<br/>" +
    "<hr/><br/>" +
    "The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and / or privileged information and may be legally protected from disclosure. If you are not the intended recipient of this message or their agent, or if this message has been addressed to you in error, please immediately alert the sender by reply email and then delete this message and any attachments. If you are not the intended recipient, you are hereby notified that any use, dissemination, copying, or storage of this message or its attachments is strictly prohibited." +
    "</I><hr/>";

  if (data.filename) {
    var mailOptions = {
      from: "ankita.webnexus@gmail.com",
      to: "aakash.webnexus@gmail.com",
      subject: "Aimedis Second Opinion",
      html: html,
      attachments: [
        {
          filename: data.filename,
          path: "./public/uploads/" + data.filename,
          cid: "uniq-" + data.filename,
        },
      ],
    };
  } else {
    var mailOptions = {
      from: "ankita.webnexus@gmail.com",
      to: "aakash.webnexus@gmail.com",
      subject: "Aimedis Second Opinion",
      html: html,
    };
  }

  // var sendmail = transporter.sendMail(mailOptions);
  if (sendmail) {
    return true;
  } else {
    return false;
  }
}

router.get("/getPatientProfileId", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      user
        .find({ type: "patient" }, { profile_id: 1 })
        .then((patient) => {
          let profile_id = [];
          if (patient && patient.length > 0) {
            patient.map((data) => {
              if (data && data.profile_id)
                if (data.profile_id.startsWith("P"))
                  profile_id.push(data.profile_id);
            });
          }
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Data is fetched",
            data: profile_id,
          });
        })
        .catch((err) => {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
            err,
          });
        });
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.get("/getAllUserProfileId", (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      user
        .find()
        .then((user) => {
          let profile_id = [];
          if (user && user.length > 0) {
            user.map((data) => {
              if (data && data.profile_id && data.type !== "hospitaladmin") {
                if (isNaN(data.profile_id[0])) profile_id.push(data.profile_id);
              }
            });
          }
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Data is fetched",
            data: profile_id,
          });
        })
        .catch((err) => {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
            err,
          });
        });
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.get("/PatientListPromotion/:house_id/:institute_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.find(
      { $and: [{ house_id: req.params.house_id }, { inhospital: true }] },
      function (err, user_data) {
        if (err && !user_data) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          user.find({ institute_id: req.params.institute_id, type:'patient' })
          .exec()
          .then((data) => {
            console.log('user_daya', data, user_data)
            var LisiUser= [...user_data, ...data];
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "User is found",
                data: LisiUser,
              });
          });
          
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


function mySorter(a, b) {
  var x = a.datetime_on.toLowerCase();
  var y = b.datetime_on.toLowerCase();
  return x > y ? -1 : x < y ? 1 : 0;
}

module.exports = router;
