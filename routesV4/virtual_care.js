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
const { getMsgLang, trans } = require("./GetsetLang");
const sendSms = require("./sendSms");

<<<<<<< HEAD
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
        if (!legit) {
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
                        console.log(userdata[0].due_on)
                        for (j = 0; j < userdata.length; j++) {
                        if (userdata[j].task_type == "sick_leave") {
                            for (i = 0; i < userdata.length; i++) {
                                let today = new Date().setHours(0, 0, 0, 0);
                                let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);
                                if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
                                    // userdata.sort(mySorter);
                                    arr.push(userdata[i])
                                }
                            }
                        }
                    }

                            for (i = 0; i < userdata.length; i++) {
                                let today = new Date().setHours(0, 0, 0, 0);
                                let data_d = new Date(userdata[i].due_on.date).setHours(0, 0, 0, 0);
                                if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
                                    // userdata.sort(mySorter);
                                    arr.push(userdata[i])
                                }
                            }


                            for (i = 0; i < userdata.length; i++) {
                                let today = new Date().setHours(0, 0, 0, 0);
                                let data_d = new Date(userdata[i].due_on.date).setHours(0, 0, 0, 0);
                                if (moment(data_d).isBefore(today) && userdata.status !== "done") {
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
        if (!legit) {
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
                       
                        for (j = 0; j < userdata.length; j++) {
                        if (userdata[j].task_type == "sick_leave") {
                            for (i = 0; i < userdata.length; i++) { 
                                let today = new Date().setHours(0, 0, 0, 0);

                                let data_d = new Date(userdata[i].date).setHours(0, 0, 0, 0);

                                if (moment(data_d).isBefore(today)) {
                                    // userdata.sort(mySorter);
                                    arr1.push(userdata[i])
                                }
                            }
                        }
                    }
                        
                            for (i = 0; i < userdata.length; i++) {
                                let today = new Date().setHours(0, 0, 0, 0);

                                let data_d = new Date(userdata[i].due_on.date).setHours(0, 0, 0, 0);

                                if (moment(data_d).isBefore(today) && userdata.status == "done") {
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
    if (!legit) {
        fullInfo = [];
        var arr1 = [];
        var full = [];
        var result1;
        virtual_Case.find({ $and: [{ external_space: true }, { inhospital: true }] }, function (err, userdata) {
            if (err && !userdata) {
                res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "user not found",
                    error: err,
                });
            } else {
                for (i = 0; i < userdata.length; i++) {
                    full.push(userdata[i].patient_id)
                }

                // console.log(userdata)
                
                    getfull(full).then((result1) => {
                        res.json({
                            status: 200,
                            hassuccessed: true,
                            message: "Successfully Found",
                            data: result1,
                        });
                    })
                
                //  final_array = [...arr, ...arra]
               

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
     console.log(data)
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            try {
                var arr1 = [];
                var arr2 = [];
                for (i = 0; i < data.length; i++) {
                User.findOne({ _id: data[i] },
                   
                    function (err, dataa) {
                      
                        // resolve(dataa);
                        //  console.log(dataa)
                        arr1.push(dataa)
                        // resolve(arr1);
                    }
                    
                  );
                  
                }
                arr2 = [...arr1]
                console.log(arr2)
            } catch (error) {
                resolve(data);
            }
        });
    });
}






=======
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
          else{
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
>>>>>>> 27f98bb8aed30001f128c17fa62c36c473831cfd





module.exports = router;