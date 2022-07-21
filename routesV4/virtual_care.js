require("dotenv").config();
var re = require("../regions.json");
const axios = require("axios");
var express = require("express");
let router = express.Router();
var virtual_Case = require("../schema/virtual_cases.js");
var User = require("../schema/user.js");
var sick_meeting = require("../schema/sick_meeting");
var answerspatient = require("../schema/answerspatient");
var Prescription = require("../schema/prescription");
var Cretificate = require("../schema/sick_certificate");
var handlebars = require("handlebars");
var jwtconfig = require("../jwttoken");
const moment = require("moment");
const { TrunkInstance } = require("twilio/lib/rest/trunking/v1/trunk");
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
var arr=[]



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
                console.log("data", data)
                console.log("data", data.country, data.country_code)
                if (data.address && data.city && data.street && data.country && data.pastal_code) {
                  virtual_Case.updateMany({ case_number: { $in: [case_number, VirtualtToSearchWith.case_number] } }, { external_space: true }, function (err, data2) {
                    if (err) {
                      console.log("err2", err)
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

          }
          else {
            for (i = 0; i < userdata.length; i++) {
              let today = new Date().setHours(0, 0, 0, 0);
              let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);
              if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
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

              if (moment(data_d).isBefore(today)) {
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

router.get("/infoOfPatients", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  arr=[]
  if (!legit) {
    arr1 = [];
    virtual_Case.find({ $and: [{ external_space: true }, { inhospital: true }] }, function (err, userdata) {
      if (err && !userdata) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "user not found",
          error: err,
        });
      } else {
        userdata.forEach((element)=>{
          arr1.push(element.patient_id)
        })
          forEachPromise(arr1,getfull).then((result)=>{ 
            console.log("arr",arr.length)
          res.json({
            status: 200,
            hassuccessed: true,
            data:arr
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
        console.log("1",data)
        User.findOne({ _id: data },
          function (err, dataa) {
            if(err){
              console.log("err",err)
            }
            else {
            arr.push(dataa)
            resolve(arr)
            }
          })

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



module.exports = router;