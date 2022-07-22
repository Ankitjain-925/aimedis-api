require("dotenv").config();
const axios = require("axios");
var express = require("express");
let router = express.Router();
var virtual_Case = require("../schema/virtual_cases.js");
var User = require("../schema/user.js");
var jwtconfig = require("../jwttoken");
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
            if (err){ 
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

router.get(
    "/PresentFutureTask/:patient_profile_id",
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

router.get("/infoOfPatients", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    arr = []
    if (legit) {
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
                userdata.forEach((element) => {
                    arr1.push(element.patient_id)
                })
                forEachPromise(arr1, getfull).then((result) => {
                    console.log("arr", arr.length)
                    res.json({
                        status: 200,
                        hassuccessed: true,
                        data: arr
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
                console.log("1", data)
                User.findOne({ _id: data },
                    function (err, dataa) {
                        if (err) {
                            console.log("err", err)
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

module.exports = router;