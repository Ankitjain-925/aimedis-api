require("dotenv").config();
const axios = require("axios");
var express = require("express");
let router = express.Router();
var virtual_Case = require("../schema/virtual_cases.js");
var virtual_Task = require("../schema/virtual_tasks.js");
var User = require("../schema/user.js");
var Appointments = require("../schema/appointments");
var assigned_Service = require("../schema/assigned_service");
var sick_meeting = require("../schema/sick_meeting");
var answerspatient = require("../schema/answerspatient");
var Prescription = require("../schema/prescription");
var Cretificate = require("../schema/sick_certificate");
var handlebars = require("handlebars");
var jwtconfig = require("../jwttoken");
let lodash = require("lodash");
const moment = require("moment");
const { getMsgLang, trans } = require("./GetsetLang");
const sendSms = require("./sendSms");
const { join } = require("path");
const {
  getSubject,
  SUBJECT_KEY,
  EMAIL,
  generateTemplate,
} = require("../emailTemplate/index.js");
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

var mongoose = require("mongoose");
var arr = []




function getTimeStops(start, end, timeslots, breakstart, breakend) {
  var startTime = moment(start, "HH:mm");
  var endTime = moment(end, "HH:mm");

  var timeslot = parseInt(timeslots, 10);

  if (endTime.isBefore(startTime)) {
    endTime.add(1, "day");
  }
  var timeStops = [];

  while (startTime <= endTime) {
    timeStops.push(new moment(startTime).format("HH:mm"));
    startTime.add(timeslot, "minutes");
  }
  return timeStops;
}


router.post("/UpdateAddress", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.findOne({ _id: req.body.case_id }, function (err, data1) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
          error: err,
        });
      } else {
        if (data1) {
          User.findOne({ _id: data1.patient_id }, function (err, data) {
            if (err) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong",
                error: err,
              });
            } else {
              if (data) {
                if (data.address && data.city && data.country && data.pastal_code) {
                  virtual_Case.updateOne({ _id: req.body.case_id }, {
                    '$unset':
                    {
                      'bed': '',
                      'rooms': '',
                      'wards': ''
                    },
                    $set: { external_space: true } 


                  }, function (err, data2) {
                    if (err) {
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
                        message: "Updated successfully",
                      });
                    }
                  })
        } else {
          var sendData =
            `<div>Dear Patient,
                    Please fill your full address at your profile of Aimedis, The hospital- ${req.body.HospitalName} wants to add you in AIS Care, for that hospital admin staff needs your proper address, So hospital can add you as AIS Care. Please update full address immediately.</div>`;
          var sendMob = `Dear Patient,Please fill your full address at your profile of Aimedis, The hospital- ${req.body.HospitalName} wants to add you in AIS Care, for that hospital admin staff needs your proper address, So hospital can add you as AIS Care. Please update full address immediately.`

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
            message: "address is not updated",
            hassuccessed: false,
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
        } else {
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

router.get("/PresentFutureTask/:patient_profile_id",
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
              if (userdata[i].task_type == "sick_leave") {
                let today = new Date().setHours(0, 0, 0, 0);
                let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);
                if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
                  // userdata.sort(mySorter);
                  arr.push(userdata[i])
                }
              }
              let today = new Date().setHours(0, 0, 0, 0);
              let data_d = new Date(userdata[i].due_on.date).setHours(0, 0, 0, 0);
              if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {

                arr.push(userdata[i])
              }
              if (moment(data_d).isBefore(today) && userdata[i].status !== "done") {

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
              if (userdata[i].task_type == "sick_leave") {
                let today = new Date().setHours(0, 0, 0, 0);

                let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);

                if (moment(data_d).isBefore(today)) {
                  // userdata.sort(mySorter);
                  arr1.push(userdata[i])
                }
              }

              let today = new Date().setHours(0, 0, 0, 0);

              let data_d = new Date(userdata[i].due_on.date).setHours(0, 0, 0, 0);

              if (moment(data_d).isBefore(today) && userdata[i].status == "done") {
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

var arr1 = [];

router.get("/infoOfPatients/:house_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    arr = []
    fullinfo = [];
    const AppointToSearchWith = new virtual_Case({ house_id: req.params.house_id });
    AppointToSearchWith.encryptFieldsSync();
    if (legit) {
        arr1 = [];
        virtual_Case.find({ house_id: { $in: [req.params.house_id, AppointToSearchWith.house_id] }, $and: [{ external_space: true }, { inhospital: true }] }, function (err, userdata) {
            if (err && !userdata) {
                res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "user not found",
                    error: err,
                });
            } else {
                forEachPromise(userdata, getfull).then((result) => {
                    res.json({
                        status: 200,
                        hassuccessed: true,
                        data: fullinfo
                    });
                })
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



function getfull(data) {
  
    return new Promise((resolve, reject) => {
        try {
                if (data) {
                  console.log(data.case_id)
                  User.findOne({ _id: data.patient_id })
                    .exec()
                    .then(function (doc5) {
                      if (doc5) {
                          var data5 = {}
                          data5 = doc5;
                          var Tasks = new Promise((resolve, reject) => {
                            virtual_Task.aggregate([
                              {
                                "$facet": {
                                  "total_task": [
                                    { "$match": { "case_id": data._id.toString(), "status": { "$exists": true, } } },
                                    { "$count": "total_task" },
                                  ],
                                  "done_task": [
                                    { "$match": { "case_id": data._id.toString(), "status": "done" } },
                                    { "$count": "done_task" }
                                  ],
                                  "total_comments": [
                                    { "$match": { "case_id": data._id.toString(), } },
                                    {
                                      "$group": {
                                        "_id": null,
                                        "total_count": { $sum: { $size: "$comments" } }
                                      }
                                    },]
                                }
                              },
                              {
                                "$project": {
                                  "total_task": { "$arrayElemAt": ["$total_task.total_task", 0] },
                                  "done_task": { "$arrayElemAt": ["$done_task.done_task", 0] },
                                  "total_comments": { "$arrayElemAt": ["$total_comments.total_count", 0] }
                                }
                              }
    
                            ], function (err, results) {
                              resolve(results)
                            })
                          }).then((data3) => {
                            // console.log(data3[0].done_task)
                            if (data3 && data3.length > 0) {
                              data.done_task = data3[0].done_task;
                              data.total_task = data3[0].total_task;
                              data.total_comments = data3[0].total_comments;
                              data.full_address = {address: data5.address,email: data5.email,mobile: data5.mobile, city: data5.city, pastal_code: data5.pastal_code, country: data5.country }                           
                              fullinfo.push(data)
                              resolve(fullinfo);
                            }
                            else {
                              fullinfo.push(data);
                              resolve(fullinfo);
                            }
                          })
                      }
                      else {
                        resolve(fullinfo);
                      }
                    })
                }
                else {
                  resolve(fullinfo);
                }
        } catch (error) {
            console.log(error)
            resolve(data);
        }
    });

}

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}

function forEachPromise(items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}

router.post("/nurseapp", function (req, res) {
  User.findOne({ _id: req.body.nurse_id }, function (err, Userinfo) {
    if (err) {
      console.log("err", err)
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
        error: err,
      });
    } else {
      var finalArray = [];
      for (let i = 0; i < Userinfo.length; i++) {
        var user = [];
        var online_users = [];
        var Practices = [];
        var monday = [],
          tuesday = [],
          wednesday = [],
          thursday = [],
          friday = [],
          saturday = [],
          sunday = [],
          custom_text = "",
          breakslot_start = "",
          breakslot_end = "",
          holidays_end = "",
          holidays_start = "",
          appointment_days = "";
        if (
          Userinfo[i].we_offer &&
          Userinfo[i].we_offer.Offer_office_prescription
        ) {
          console.log("1")
          for (let j = 0; j < Userinfo[i].private_appointments.length; j++) {
            if (Userinfo[i].private_appointments[j].custom_text) {
              custom_text = Userinfo[i].private_appointments[j].custom_text;
            }
            if (Userinfo[i].private_appointments[j].appointment_days) {
              appointment_days =
                Userinfo[i].private_appointments[j].appointment_days;
            }
            if (Userinfo[i].private_appointments[j].holidays_start) {
              holidays_start =
                Userinfo[i].private_appointments[j].holidays_start;
            }
            if (Userinfo[i].private_appointments[j].holidays_end) {
              holidays_end = Userinfo[i].private_appointments[j].holidays_end;
            }
            if (Userinfo[i].private_appointments[j].breakslot_start) {
              breakslot_start =
                Userinfo[i].private_appointments[j].breakslot_start;
            }
            if (Userinfo[i].private_appointments[j].breakslot_end) {
              breakslot_end =
                Userinfo[i].private_appointments[j].breakslot_end;
            }
            if (
              (Userinfo[i].private_appointments[j].monday_start,
                Userinfo[i].private_appointments[j].monday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              monday = getTimeStops(
                Userinfo[i].private_appointments[j].monday_start,
                Userinfo[i].private_appointments[j].monday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].tuesday_start,
                Userinfo[i].private_appointments[j].tuesday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              tuesday = getTimeStops(
                Userinfo[i].private_appointments[j].tuesday_start,
                Userinfo[i].private_appointments[j].tuesday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].wednesday_start,
                Userinfo[i].private_appointments[j].wednesday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              wednesday = getTimeStops(
                Userinfo[i].private_appointments[j].wednesday_start,
                Userinfo[i].private_appointments[j].wednesday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].thursday_start,
                Userinfo[i].private_appointments[j].thursday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              thursday = getTimeStops(
                Userinfo[i].private_appointments[j].thursday_start,
                Userinfo[i].private_appointments[j].thursday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].friday_start,
                Userinfo[i].private_appointments[j].friday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              friday = getTimeStops(
                Userinfo[i].private_appointments[j].friday_start,
                Userinfo[i].private_appointments[j].friday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].saturday_start,
                Userinfo[i].private_appointments[j].saturday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              saturday = getTimeStops(
                Userinfo[i].private_appointments[j].saturday_start,
                Userinfo[i].private_appointments[j].saturday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].private_appointments[j].sunday_start,
                Userinfo[i].private_appointments[j].sunday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots)
            ) {
              sunday = getTimeStops(
                Userinfo[i].private_appointments[j].sunday_start,
                Userinfo[i].private_appointments[j].sunday_end,
                Userinfo[i].private_appointments[j].duration_of_timeslots
              );
            }

            user.push({
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
              sunday,
              custom_text,
              breakslot_end,
              breakslot_start,
              holidays_start,
              holidays_end,
              appointment_days,
            });
          }
        }
        (monday = []),
          (tuesday = []),
          (wednesday = []),
          (thursday = []),
          (friday = []),
          (saturday = []),
          (sunday = []),
          (custom_text = ""),
          (breakslot_start = ""),
          (breakslot_end = ""),
          (holidays_start = ""),
          (holidays_end = ""),
          (appointment_days = "");
        console.log("user", user)

        if (
          Userinfo[i].we_offer &&
          Userinfo[i].we_offer.Offre_online_appointments
        ) {
          for (let k = 0; k < Userinfo[i].online_appointment.length; k++) {
            if (Userinfo[i].online_appointment[k].appointment_days) {
              appointment_days =
                Userinfo[i].online_appointment[k].appointment_days;
            }
            if (Userinfo[i].online_appointment[k].holidays_start) {
              holidays_start =
                Userinfo[i].online_appointment[k].holidays_start;
            }
            if (Userinfo[i].online_appointment[k].holidays_end) {
              holidays_end = Userinfo[i].online_appointment[k].holidays_end;
            }
            if (Userinfo[i].online_appointment[k].breakslot_start) {
              breakslot_start =
                Userinfo[i].online_appointment[k].breakslot_start;
            }
            if (Userinfo[i].online_appointment[k].breakslot_end) {
              breakslot_end = Userinfo[i].online_appointment[k].breakslot_end;
            }
            if (
              (Userinfo[i].online_appointment[k].monday_start,
                Userinfo[i].online_appointment[k].monday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              monday = getTimeStops(
                Userinfo[i].online_appointment[k].monday_start,
                Userinfo[i].online_appointment[k].monday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].tuesday_start,
                Userinfo[i].online_appointment[k].tuesday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              tuesday = getTimeStops(
                Userinfo[i].online_appointment[k].tuesday_start,
                Userinfo[i].online_appointment[k].tuesday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].wednesday_start,
                Userinfo[i].online_appointment[k].wednesday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              wednesday = getTimeStops(
                Userinfo[i].online_appointment[k].wednesday_start,
                Userinfo[i].online_appointment[k].wednesday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].thursday_start,
                Userinfo[i].online_appointment[k].thursday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              thursday = getTimeStops(
                Userinfo[i].online_appointment[k].thursday_start,
                Userinfo[i].online_appointment[k].thursday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].friday_start,
                Userinfo[i].online_appointment[k].friday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              friday = getTimeStops(
                Userinfo[i].online_appointment[k].friday_start,
                Userinfo[i].online_appointment[k].friday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].saturday_start,
                Userinfo[i].online_appointment[k].saturday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              saturday = getTimeStops(
                Userinfo[i].online_appointment[k].saturday_start,
                Userinfo[i].online_appointment[k].saturday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].online_appointment[k].sunday_start,
                Userinfo[i].online_appointment[k].sunday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots)
            ) {
              sunday = getTimeStops(
                Userinfo[i].online_appointment[k].sunday_start,
                Userinfo[i].online_appointment[k].sunday_end,
                Userinfo[i].online_appointment[k].duration_of_timeslots
              );
            }
            online_users.push({
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
              sunday,
              breakslot_start,
              breakslot_end,
              holidays_start,
              holidays_end,
              appointment_days,
            });
          }
        }
        if (
          Userinfo[i].we_offer &&
          Userinfo[i].we_offer.Offer_practice_appointment
        ) {
          (monday = []),
            (tuesday = []),
            (wednesday = []),
            (thursday = []),
            (friday = []),
            (saturday = []),
            (sunday = []),
            (custom_text = ""),
            (breakslot_start = ""),
            (breakslot_end = ""),
            (holidays_start = ""),
            (holidays_end = ""),
            (appointment_days = "");
          for (let l = 0; l < Userinfo[i].days_for_practices.length; l++) {
            if (Userinfo[i].days_for_practices[l].appointment_days) {
              appointment_days =
                Userinfo[i].days_for_practices[l].appointment_days;
            }
            if (Userinfo[i].days_for_practices[l].holidays_start) {
              holidays_start =
                Userinfo[i].days_for_practices[l].holidays_start;
            }
            if (Userinfo[i].days_for_practices[l].holidays_end) {
              holidays_end = Userinfo[i].days_for_practices[l].holidays_end;
            }
            if (Userinfo[i].days_for_practices[l].breakslot_start) {
              breakslot_start =
                Userinfo[i].days_for_practices[l].breakslot_start;
            }
            if (Userinfo[i].days_for_practices[l].breakslot_end) {
              breakslot_end = Userinfo[i].days_for_practices[l].breakslot_end;
            }
            if (
              (Userinfo[i].days_for_practices[l].monday_start,
                Userinfo[i].days_for_practices[l].monday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              monday = getTimeStops(
                Userinfo[i].days_for_practices[l].monday_start,
                Userinfo[i].days_for_practices[l].monday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].tuesday_start,
                Userinfo[i].days_for_practices[l].tuesday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              tuesday = getTimeStops(
                Userinfo[i].days_for_practices[l].tuesday_start,
                Userinfo[i].days_for_practices[l].tuesday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].wednesday_start,
                Userinfo[i].days_for_practices[l].wednesday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              wednesday = getTimeStops(
                Userinfo[i].days_for_practices[l].wednesday_start,
                Userinfo[i].days_for_practices[l].wednesday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].thursday_start,
                Userinfo[i].days_for_practices[l].thursday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              thursday = getTimeStops(
                Userinfo[i].days_for_practices[l].thursday_start,
                Userinfo[i].days_for_practices[l].thursday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].friday_start,
                Userinfo[i].days_for_practices[l].friday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              friday = getTimeStops(
                Userinfo[i].days_for_practices[l].friday_start,
                Userinfo[i].days_for_practices[l].friday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].saturday_start,
                Userinfo[i].days_for_practices[l].saturday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              saturday = getTimeStops(
                Userinfo[i].days_for_practices[l].saturday_start,
                Userinfo[i].days_for_practices[l].saturday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            if (
              (Userinfo[i].days_for_practices[l].sunday_start,
                Userinfo[i].days_for_practices[l].sunday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots)
            ) {
              sunday = getTimeStops(
                Userinfo[i].days_for_practices[l].sunday_start,
                Userinfo[i].days_for_practices[l].sunday_end,
                Userinfo[i].days_for_practices[l].duration_of_timeslots
              );
            }
            Practices.push({
              monday,
              tuesday,
              wednesday,
              thursday,
              friday,
              saturday,
              sunday,
              breakslot_start,
              breakslot_end,
              holidays_end,
              holidays_start,
              appointment_days,
            });
          }
        }

        finalArray.push({
          data: Userinfo[i],
          appointments: user,
          online_appointment: online_users,
          practice_days: Practices,
        });
      }
      res.json({ status: 200, hassuccessed: true, data: finalArray });
    }


  })
})


router.post("/nurseafter", function (req, res) {
  doctor_id = req.body.nurse_id
  const AppointToSearchWith = new Appointments({ doctor_id });
  AppointToSearchWith.encryptFieldsSync();
  const result = []
  var sample_1 = []
  Appointments.find({
    $or: [
      { doctor_id: doctor_id },
      { doctor_id: AppointToSearchWith.doctor_id },
    ]
  }, function (err, data) {
    if (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
        error: err,
      });
    } else {
      assigned_Service.find({ "assinged_to.user_id": doctor_id }, function (err, data2) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          sample_1 = [...data, ...data2];
          sample_1.forEach((element) => {
            coming_date = (element.task_name || element.title) ? new Date(element.due_on.date).setHours(0, 0, 0, 0) : new Date(element.date).setHours(0, 0, 0, 0)
            today_date = new Date().setHours(0, 0, 0, 0)
            console.log("today_date", today_date)
            if (moment(today_date).isSameOrBefore(coming_date)) {
              result.push(element)
              result.sort(mySorter1);
            }
          })
          res.json({ status: 200, hassuccessed: true, data: result })
        }
      })

    }
  })
})

function mySorter1(a, b) {
  if (a.date && b.date) {
    return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
  } else {
    return -1;
  }
}

function mySorter(a, b) {
  if (a.date && b.date) {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
  } else {
    return -1;
  }
}
router.post("/nursebefore", function (req, res) {
  doctor_id = req.body.nurse_id
  const AppointToSearchWith = new Appointments({ doctor_id });
  AppointToSearchWith.encryptFieldsSync();
  const result = []
  sample_1 = [];
  Appointments.find({
    $or: [
      { doctor_id: doctor_id },
      { doctor_id: AppointToSearchWith.doctor_id },
    ]
  }, function (err, data) {
    if (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
      });
    } else {
      assigned_Service.find({ "assinged_to.user_id": doctor_id }, function (err, data2) {
        if (err) {
          console.log("err", err)
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          sample_1 = [...data, ...data2];
          sample_1.forEach((element) => {
            coming_date = (element.task_name || element.title) ? new Date(element.due_on.date).setHours(0, 0, 0, 0) : new Date(element.date).setHours(0, 0, 0, 0)
            today_date = new Date().setHours(0, 0, 0, 0)
            console.log("today_date", today_date)
            if (moment(today_date).isSameOrAfter(coming_date)) {
              result.push(element)
              result.sort(mySorter);
            }
          })
          res.json({ status: 200, hassuccessed: true, data: result })
        }
      })
    }
  })
})

function forEachPromise(items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}


router.post("/NurseHomeVisitMail", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {

      User.findOne({ _id: req.body.nurse_id },
        function (err, user_data1) {

          if (err && !user_data1) {
            res.json({ status: 200, message: "Something went wrong.", error: err });
          } else {
            var meetingDate = getDate(req.body.date, "YYYY/MM/DD");
            var time = new Date(req.body.time);
            // var end_date = new Date(req.body.end_time);
            var final_time = time.getHours() + ':' + time.getMinutes();
            // var end_time = end_date.getHours()+':'+ end_date.getMinutes();



            User.findOne({ _id: req.body.patient_id },
              function (err, user_data2) {

                if (err && !user_data2) {
                  res.json({ status: 200, message: "Something went wrong.", error: err });
                } else {
                  user11 = user_data1.first_name.toUpperCase(),
                    user12 = user_data1.last_name.toUpperCase(),
                    user21 = user_data2.first_name.toUpperCase(),
                    user22 = user_data2.last_name.toUpperCase(),

                    sendData = `Dear ${user21 + " " + user22},
  
                                    As you routine checkup from AIS CARE - ${req.body.hospital_name} there a nurse ${user11 + " " + user12 + " " + user_data1.profile_id},
                                    will come `;

                  sendData1 = `at your address ${user_data2.address} on date ${meetingDate} at ${final_time}. Please ${user21 + " " + user22 + " " + user_data2.profile_id}, must be available for same, when nurse will come at your place. And for any emergency patient is not available on that date/time please inform to the hospital admin.`;

                  generateTemplate(
                    EMAIL.generalEmail.createTemplate("en", {
                      title: "",
                      content: sendData + sendData1,
                    }),
                    (error, html) => {
                      if (!error) {

                        let mailOptions = {
                          from: "contact@aimedis.com",
                          to: user_data2.email,
                          subject: "Link for the Sick leave certificate",
                          html: html,
                        };

                        let sendmail = transporter.sendMail(mailOptions);
                        if (sendmail) {
                        }
                      }

                    }
                  );

                  res.json({
                    status: 200,
                    message: "Mail sent Successfully",
                    hassuccessed: true,
                  });

                }
              });

          }
        });
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
        error: err,
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


router.get("/patientTaskandService/:patient_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  final_data = {}
  if (legit) {
    patient_id = req.params.patient_id
    const AppointToSearchWith = new virtual_Task({ patient_id });
    AppointToSearchWith.encryptFieldsSync();
    virtual_Task.find({ patient_id: { $in: [req.params.patient_id, AppointToSearchWith.patient_id] } }, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        patient_id = req.params.patient_id
        const AppointToSearchWith = new assigned_Service({ patient_id });
        AppointToSearchWith.encryptFieldsSync();
        assigned_Service.find({ patient_id: { $in: [req.params.patient_id, AppointToSearchWith.patient_id] } }, function (err, data2) {
          if (err) {
            console.log("err", err)
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
            });
          } else {
            final_data = [...data, ...data2];
            var final_data1 = lodash.sortBy(final_data, (e) => {
              return e.due_on.date
            });
            if (final_data1 && final_data.length > 0) {
              final_data1.reverse()
            }
            res.json({
              status: 200,
              hassuccessed: true,
              data: final_data1,
              msg: 'successfully fetched'
            })
          }
        })

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


router.get(
  "/PastAppointmentServiceTask/:patient_profile_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    doctor_id = req.params.patient_profile_id;
    const AppointToSearchWith = new Appointments({ doctor_id });
    AppointToSearchWith.encryptFieldsSync();
    if (legit) {
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      var finalArray = [];

      Appointments.find({
        $or: [
          { doctor_id: doctor_id },
          { doctor_id: AppointToSearchWith.doctor_id },
        ]
      },
        function (err, userdata1) {
          if (err && !userdata1) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
              error: err,
            });
          } else {


            assigned_Service.find({ "assinged_to.user_id": doctor_id },
              function (err, userdata2) {
                if (err && !userdata2) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "Something went wrong",
                    error: err,
                  });
                } else {
                  
                  virtual_Task.find(
                    {
                      "assinged_to.user_id": doctor_id,
                      $or: [{ is_decline: { $exists: false } }, { is_decline: false }],
                    },
                    function (err, userdata3) {
                      if (err && !userdata3) {
                        res.json({
                          status: 200,
                          hassuccessed: false,
                          message: "Something went wrong",
                          error: err,
                        });
                      } else {
                        for (i = 0; i < userdata1.length; i++) {

                          let today = new Date().setHours(0, 0, 0, 0);

                          let data_d = new Date(userdata1[i].date).setHours(0, 0, 0, 0);

                          if (moment(data_d).isBefore(today)) {
                            // userdata1.sort(mySorter);
                            arr1.push(userdata1[i])
                          }

                        }

                        for (i = 0; i < userdata2.length; i++) {

                          let today2 = new Date().setHours(0, 0, 0, 0);

                          let data_d2 = new Date(userdata2[i].date).setHours(0, 0, 0, 0);

                          if (moment(data_d2).isBefore(today2)) {
                            // userdata2.sort(mySorter);
                            arr2.push(userdata2[i])
                          }
                        }


                        for (i = 0; i < userdata3.length; i++) {
                          if (userdata3[i].task_type == "sick_leave") {
                            let today = new Date().setHours(0, 0, 0, 0);

                            let data_d = new Date(userdata3[i].date).setHours(0, 0, 0, 0);

                            if (moment(data_d).isBefore(today)) {
                              // userdata3.sort(mySorter);
                              arr3.push(userdata3[i])
                            }
                          }

                          let today = new Date().setHours(0, 0, 0, 0);

                          let data_d = new Date(userdata3[i].due_on.date).setHours(0, 0, 0, 0);

                          if (moment(data_d).isBefore(today) && userdata3[i].status == "done") {
                            // userdata3.sort(mySorter);
                            arr3.push(userdata3[i])
                          }
                        }

                        finalArray = [...arr1, ...arr2, ...arr3];

                        finalArray.sort(mySorter);
                        res.json({ status: 200, hassuccessed: true, data: finalArray });
                      }
                    }
                  );
                }
              }
            );
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

router.post("/AssignFilter", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var house_id = req.body.house_id;
    const VirtualtToSearchWith1 = new virtual_Task({ house_id });
    VirtualtToSearchWith1.encryptFieldsSync();

    var condition = {
      house_id: { $in: [req.body.house_id, VirtualtToSearchWith1.house_id] },
    };
    if (req.body.assinged_to) {
      condition["assinged_to.user_id"] = { $in: req.body.assinged_to };
    }
    if (req.body.status) {
      var status = req.body.status;
      statuscheck = status.map((element) => {
        VirtualtToSearchWith3 = new virtual_Task({ status: element });
        VirtualtToSearchWith3.encryptFieldsSync();
        return VirtualtToSearchWith3.status;
      });

      statuscheck = [...status, ...statuscheck];
      condition.status = { $in: statuscheck };
    }
  
    if (req.body.patient_id) {
      var patient_id = req.body.patient_id;

      patient_en = patient_id.map((element) => {
        VirtualtToSearchWith3 = new virtual_Task({ patient_id: element });
        VirtualtToSearchWith3.encryptFieldsSync();
        return VirtualtToSearchWith3.patient_id;
      });

      patient_id = [...patient_id, ...patient_en];

      condition.patient_id = { $in: patient_id };
    }

    virtual_Task.find(condition, function (err, data) {
      if (err & !data) {
        res.json({ status: 200, hassuccessed: true, error: err });
      } else {
        let condition3 = {
          house_id: { $in: [req.body.house_id, VirtualtToSearchWith1.house_id] },
        };
        if (req.body.assinged_to || req.body.assign_service) {
          if (req.body.assinged_to) {
            condition3["assinged_to.user_id"] = req.body.assinged_to;
          }
          if (req.body.assign_service) {
            condition3.assign_service = req.body.assign_service;
          }
          assigned_Service.find(condition3, function (err, data1) {
            if (err) {
              res.json({ status: 200, hassuccessed: true, error: err });
            } else {
              var equals = data1.length === data.length && data1.every((e, i) => e.patient_id === data[i].patient_id);
              if (equals) {
                res.json({ status: 200, hassuccessed: true, data: data1 });
              } else {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  message: "No data found",
                });
              }
            }
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: data });
        }
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

router.get("/GetTaskandService/:case_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  final_data = {}
  if (legit) {
    case_id = req.params.case_id
    const AppointToSearchWith = new virtual_Task({ case_id });
    AppointToSearchWith.encryptFieldsSync();
    virtual_Task.find({ case_id: { $in: [req.params.case_id, AppointToSearchWith.case_id] } }, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        case_id = req.params.case_id
        const AppointToSearchWith = new assigned_Service({ case_id });
        AppointToSearchWith.encryptFieldsSync();
        assigned_Service.find({ case_id: { $in: [req.params.case_id, AppointToSearchWith.case_id] } }, function (err, data2) {
          if (err) {
            console.log("err", err)
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              data: { Task: data, assigned_service: data2 },
              msg: 'successfully fetched'
            })
          }
        })

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

router.get("/GetUserData/:user_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    user_id = req.params.user_id
    const AppointToSearchWith = new User({ _id: user_id });
    AppointToSearchWith.encryptFieldsSync();
    User.findOne({ _id: { $in: [req.params.user_id, AppointToSearchWith._id] } }, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        console.log(data)
            res.json({
              status: 200,
              hassuccessed: true,
              data: {first_name: data.first_name, last_name: data.last_name, profile_id: data.profile_id, alies_id: data.alies_id, image: data.image, address: data.address,email: data.email,mobile: data.mobile, city: data.city, pastal_code: data.pastal_code, country: data.country },
              msg: 'successfully fetched'
            })
          
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
module.exports = router;