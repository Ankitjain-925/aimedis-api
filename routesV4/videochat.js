require("dotenv").config();
var express = require("express");
let router = express.Router();
const user = require("../schema/user.js");
var Video_Conference = require("../schema/doctor_feedback");
const vidchat = require("../schema/vid_chat_account.js")
const Appointment = require("../schema/appointments")
const virtual_Task = require("../schema/virtual_tasks")
const CareModel = require("../schema/care_questionnaire")
const virtual_invoice = require("../schema/virtual_invoice")
var sick_meeting = require("../schema/sick_meeting");
var User = require("../schema/user")
var handlebars = require("handlebars");
var refundform = require("../schema/refundform");

var fs = require("fs");
const { join } = require("path");
var bill3 = fs.readFileSync(join(`${__dirname}/bill2.html`), "utf8");
var jwtconfig = require("../jwttoken");
const { encrypt, decrypt } = require("./Cryptofile.js");

const moment = require("moment");

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

  try {
    if (legit) {
      const messageToSearchWith = new vidchat({ email: req.body.email });
      messageToSearchWith.encryptFieldsSync();
      vidchat.find(
        {
          email: { $in: [req.body.email, messageToSearchWith.email] }
        },
        function (err, userdata) {
          if (err && !userdata) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Information not found",
              error: err,
            });
          } else {
            if (userdata.length > 0) {
              res.json({ status: 200, hassuccessed: true, data: true, message: "user exists" })
            } else {
              res.json({ status: 200, hassuccessed: false, message: "Users Not Exists", data: false })
            }

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
  } catch (err) {

    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});



router.post("/AddVideoUserAccount", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  try {
    if (legit) {
      var email = req.body.email
      const VirtualtToSearchWith1 = new vidchat({ email });
      VirtualtToSearchWith1.encryptFieldsSync();
      vidchat.find({ $or: [{ email: req.body.email }, { email: VirtualtToSearchWith1.email }] },
        function (err, data1) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Information not found",
              error: err,
            })
          } else {
            if (data1.length > 0) {
              res.json({ status: 200, hassuccessed: false, data: "User Already Register" })
            } else {
              if (req.body.payment_data) {
                const data = {
                  email: legit.email || req.body.email,
                  patient_id: legit.patient_id || req.body.patient_id,
                  reg_amount: legit.reg_amount || req.body.reg_amount,
                  password: legit.password || req.body.password,
                  username: legit.username || req.body.username,
                  is_payment: legit.is_payment || req.body.is_payment,
                  prepaid_talktime: legit.prepaid_talktime || req.body.prepaid_talktime,
                  status: legit.stauts || req.body.status,
                  type: "video_conference",
                  payment_data: encrypt(JSON.stringify(req.body.payment_data)),
                  _enc_payment_data: true
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
                    console.log(err);
                    res.json({
                      status: 200,
                      msg: 'someting went wrong',
                      data: err,
                      hassuccessed: false
                    })
                  })
              }
              else {
                res.json({
                  status: 200,
                  msg: 'payment is pending so can not add',
                  data: 'payment is pending so can not add',
                  hassuccessed: false
                })
              }
            }
          }
        }

      )
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication Required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
})



router.post("/AppointmentBook", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  // console.log(legit)
  try {
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
        .catch(err => {
          console.log(err);
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});


router.get("/Get_Doctor/:data", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var final
  try {
    if (legit) {
      user.find({ type: "doctor", houses: { $exists: true, $not: { $size: 0 } }, institute_id: { $exists: true, $not: { $size: 0 } } }, function (err, data1) {
        if (err) {
          console.log("err", err)
          res.json({ status: 200, hassuccessed: true, error: err });
        } else {
          
          var final = data1.filter((element) => {
            var name = element.first_name.toUpperCase() + element.last_name.toUpperCase()
            if (name.includes(req.params.data.toUpperCase().split(" ").join("")) || (element.alies_id.toUpperCase()).includes(req.params.data.toUpperCase())  || (element.profile_id.toUpperCase()).includes(req.params.data.toUpperCase()) || element.speciality.includes(req.params.data) || (element.email == req.params.data.toLowerCase()) ) {
              return element
            }
          })
          
          res.json({ status: 200, hassuccessed: true, data: final })
        }
      }
      )
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication required.",
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


router.post("/MailtoDrandPatient", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      sendData = `Dear ${req.body.patient_info.first_name + " " + req.body.patient_info.last_name}<br/>
    You have online video conference appointment with Dr. ${req.body.docProfile.first_name + " " + req.body.docProfile.last_name} on ${req.body.date} at ${req.body.start_time}.
    That you have requested from the Video conference system. Here is your access key to join call via system - ${req.body.access_key}
    you can contact via email or mobile number.
    Alternatively, you can contact us via contact@aimedis.com.com or the Aimedis support chat if you have difficulties contacting your doctor.`
      sendData2 = `Dear ${req.body.docProfile.first_name + " " + req.body.docProfile.last_name}<br/>
    You have got an online video conference appointment with ${req.body.patient_info.first_name + " " + req.body.patient_info.last_name} on ${req.body.date} at ${req.body.start_time}.
    Here is your access key to join call via system - ${req.body.access_key}`
      generateTemplate(
        EMAIL.generalEmail.createTemplate("en", {
          title: "",
          content: sendData,
        }),
        (error, html) => {
          if (req.body.patient_info.email !== "") {
            let mailOptions = {
              from: "contact@aimedis.com",
              to: req.body.patient_info.email,
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
          if (req.body.docProfile.email !== "") {
            let mailOptions = {
              from: "contact@aimedis.com",
              to: req.body.docProfile.email,
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
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
})

router.post("/DownloadbillVC", function (req, res) {

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


// router.post("/SaveQuestion", function (req, res) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     const token = req.headers.token;
//     let legit = jwtconfig.verify(token);
//     if (legit) {
//       var type = "video-conference",
//         datas = {
//           ...req.body,
//           type,
//         }
//       var bookdata = new CareModel(datas)
//       bookdata.save(function (err, user_data) {
//         if (err && !user_data) {
//           res.json({ status: 200, message: "Something went wrong.", error: err });
//         } else {
//           res.json({
//             status: 200,
//             message: "Added Successfully",
//             hassuccessed: true,
//           });
//         }
//       });
//     } else {
//       res.json({
//         status: 200,
//         hassuccessed: false,
//         message: "Something wnet Wrong",
//       });
//     }

//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });



// router.get("/withdrawal", function (req, res) {
//   stripe.balanceTransactions.retrieve(
//     'txn_1032HU2eZvKYlo2CEPtcnUvl', function (err, data) {
//       if (err) {
//         res.json({ status: 200, message: "Something went wrong.", error: err });
//       } else {
//         res.json({
//           status: 200,
//           message: "Paayment Withdrawal",
//           hassuccessed: true,
//         });
//       }
//     }
//   )
// })

// router.post("/AddMeeting/:start_time/:end_time", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     try {
//       var sick_meetings = new sick_meeting(req.body);
//       sick_meetings.save(function (err, user_data) {
//         if (err && !user_data) {
//           res.json({ status: 200, message: "Something went wrong.", error: err });
//         } else {
//           var meetingDate = getDate(req.body.date, "YYYY/MM/DD");
//           // var start_date = new Date(req.body.start_time);
//           // var end_date = new Date(req.body.end_time);
//           // var start_time = start_date.getHours()+':'+ start_date.getMinutes();
//           // var end_time = end_date.getHours()+':'+ end_date.getMinutes();

//           var start_time = req.params.start_time;
//           var end_time = req.params.end_time;
//           var sendData = `Dear Patient,


//     Your payment process for  Video Conference application is completed successfully.
//     Please do join the Video call at ${meetingDate} from the time slot  ${start_time
//             } to ${end_time} 
//     Your Video call joining link is  ${req.body.access_key ? req.body.access_key : "Not mentioned"
//             }
//     Please remind the date and timing as alloted.`;

//           var sendData1 = `Dear Doctor,

//     The payment process for   Video Conference application is completed successfully.
//     Please do join the Video call at  ${meetingDate} from the time slot ${start_time
//             } to ${end_time}
//     Your Video call joining link is  ${req.body.access_key ? req.body.access_key : "Not mentioned"
//             }
//     Please remind the date and timing as alloted.</div>`;

//           if (req.body.patient_mail !== "") {
//             generateTemplate(
//               EMAIL.generalEmail.createTemplate("en", {
//                 title: "",
//                 content: sendData,
//               }),
//               (error, html) => {
//                 if (!error) {
//                   let mailOptions = {
//                     from: "contact@aimedis.com",
//                     to: req.body.patient_mail,
//                     subject: "Link for the Video Conferencce",
//                     html: html,
//                   };

//                   let sendmail = transporter.sendMail(mailOptions);
//                   if (sendmail) {
//                   }
//                 }
//               }
//             );
//             User.findOne({ _id: req.body.doctor_id }, function (err, userdata) {
//               if (err && !userdata) {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "Something went wrong",
//                   error: err,
//                 });
//               } else {
//                 generateTemplate(
//                   EMAIL.generalEmail.createTemplate("en", {
//                     title: "",
//                     content: sendData1,
//                   }),
//                   (error, html) => {
//                     if (!error) {
//                       let mailOptions1 = {
//                         from: "contact@aimedis.com",
//                         to: userdata.email,
//                         subject: "Link for the Video Conference",
//                         html: html,
//                       };
//                       let sendmail1 = transporter.sendMail(mailOptions1);
//                       if (sendmail1) {
//                       }
//                     }
//                   }
//                 );
//               }
//             });
//             res.json({
//               status: 200,
//               message: "Mail sent Successfully",
//               hassuccessed: true,
//             });
//           }
//         }
//       });
//     } catch (err) {
//       res.json({
//         status: 200,
//         hassuccessed: false,
//         message: "Something went wrong",
//         error: err,
//     })
//   }
// }else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });
// router.get("/refund", function (req, res) {
//   stripe.balanceTransactions.retrieve(
//     { _id: 'txn_1032HU2eZvKYlo2CEPtcnUvl' }, function (err, data) {
//       if (err) {
//         res.json({ status: 200, message: "Something went wrong.", error: err });
//       } else {
//         if (data.amount < req.body.amount) {
//           res.json({ status: 200, message: "Enter over Amount" });
//         } else {
//           stripe.refunds.create({
//             charge: data.source,
//             amount: req.body.amount
//           }, function (err, data) {
//             if (err) {
//               res.json({
//                 status: 200, message: "Something went wrong.", error: err
//               })
//             } else {
//               res.json({ status: 200, message: "Refund Suceessfully" })
//             }
//           })
//         }
//       }
//     }
//   )
// })


// router.get("/Get_Doctor/:data", function (req, res) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     const VirtualtToSearchWith1 = new user({ alies_id: req.params.data, email: req.params.data, profile_id: req.params.data, speciality: req.params.data, first_name: req.params.data, last_name: req.params.data });
//     VirtualtToSearchWith1.encryptFieldsSync();
//     user.find({
//       type: "doctor",
//       $or: [
//         { alies_id: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { alies_id: { $regex: '.*' + VirtualtToSearchWith1.alies_id + '.*', $options: 'i' } },
//         { email: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { email: { $regex: '.*' + VirtualtToSearchWith1.email + '.*', $options: 'i' } },
//         { profile_id: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { profile_id: { $regex: '.*' + VirtualtToSearchWith1.profile_id + '.*', $options: 'i' } },
//         { speciality: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { speciality: { $regex: '.*' + VirtualtToSearchWith1.speciality + '.*', $options: 'i' } },
//         { first_name: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { first_name: { $regex: '.*' + VirtualtToSearchWith1.first_name + '.*', $options: 'i' } },
//         { last_name: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
//         { last_name: { $regex: '.*' + VirtualtToSearchWith1.last_name + '.*', $options: 'i' } }
//         ]
//     }, function (err, data1) {
//       if (err) {
//         res.json({ status: 200, hassuccessed: true, error: err });
//       } else {
//         res.json({ status: 200, hassuccessed: true, data: data1 });
//       }
//     }
//     )
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

router.get("/GetConferencePatient/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      let patient_id = req.params.patient_id
      const messageToSearchWith = new vidchat({ patient_id });
      messageToSearchWith.encryptFieldsSync();
      vidchat.find(
        { $or: [{ patient_id: req.params.patient_id }, { patient_id: messageToSearchWith.patient_id }] },
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


// router.post("/transfer", function(req, res){
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   // var amount = ''
//   if (legit) {

//     virtual_invoice.findOne({ _id: req.body._id }, function (err, data) {
//       if (err) {
//         console.log("err",err)
//         res.json({
//           status: 200,
//           hassuccessed: false,
//           message: "Something went wrong",
//           error: err,
//         });
//       } else {
//         console.log('data',data)
//         console.log('data',data.total_amount)

//        if(data.total_amount>req.body.amount){

//         virtual_invoice.updateOne({ _id: req.body._id },
//          { $inc: {total_amount: Number(-req.body.amount) }}, function (err, updt) {
//             if (err) {
//               console.log("err", err)
//             } else {
//               res.json({
//                 status: 200,
//                 hassuccessed: true,
//                 message:"Update the balance"
//               });
//             }
//           })
//        }else{
//         res.json({
//           status: 200,
//           hassuccessed: true,
//           message:"Low Balance"
//         });
//        }

//       }

//     })


//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });



// router.post("/PaymentWithWallet", function(req, res){
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   // var amount = ''
//   if (legit) {

//     virtual_invoice.findOne({ _id: req.body._id }, function (err, data) {
//       if (err) {
//         res.json({
//           status: 200,
//           hassuccessed: false,
//           message: "Something went wrong",
//           error: err,
//         });
//       } else {
//        if(data.total_amount < req.body.amount){
//         res.json({
//           status: 200,
//           hassuccessed: false,
//           message: "Low Balance switch to Card payment",
//         })
//        }else{
//         res.json({
//           status: 200,
//           hassuccessed: false,
//           message: "Transaction Successfully",
//         })
//         }
//       }
//     })
//   }
//   else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

router.post("/givefeedback", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      const token = req.headers.token;
      let legit = jwtconfig.verify(token);
      if (legit) {
        var type = "video_conference",
          datas = {
            ...req.body,
            type,
          }
        var bookdata = new Video_Conference(datas)
        bookdata.save(function (err, user_data) {
          if (err && !user_data) {
            res.json({ status: 200, message: "Something went wrong.", hassuccessed: false, error: err });
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.get("/getfeedbackfordoctor/:doctor_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      var doctor_id = req.params.doctor_id
      const VirtualtToSearchWith1 = new Video_Conference({ doctor_id });
      VirtualtToSearchWith1.encryptFieldsSync();
      Video_Conference
        .find({ doctor_id: { $in: [req.params.doctor_id, VirtualtToSearchWith1.doctor_id] } })
        .limit(10)
        .sort({ _id: -1 })
        .exec(function (err, data) {
          if (err && !data) {
            res.json({
              status: 200,
              message: "Something went wrong.",
              error: err,
              hassuccessed: false,
            });
          } else {
            res.json({
              status: 200,
              message: "data fetch",
              hassuccessed: true,
              data: data,
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.post("/UsernameLogin", function (req, res, next) {
  try {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var email = req.body.email;
    const VirtualtToSearchWith1 = new vidchat({ username, password, email });
    VirtualtToSearchWith1.encryptFieldsSync();
    if (req.body.username == "" || req.body.password == "") {
      res.json({
        status: 400,
        message: "username and password fields should not be empty",
        hassuccessed: false,
      });
    } else {
      vidchat
        .findOne({ username: { $in: [req.body.username, VirtualtToSearchWith1.username] }, email: { $in: [req.body.email, VirtualtToSearchWith1.email] } })
        .exec()
        .then((user_data) => {
          if (!user_data) {
            res.json({
              status: 400,
              hassuccessed: false,
              message: "Username not match",
            });
          } else {
            if (user_data.password !== req.body.password) {
              res.json({
                status: 400,
                hassuccessed: false,
                message: "Password not match",
              });
            } else {
              res.json({ status: 200, hassuccessed: true, data: user_data });
            }
          }
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

router.post("/managePrepaid", async (req, res) => {
  try {
    const { manage_for, _id, prepaid_talktime_min, paid_amount_obj, used_talktime } = req.body;
    if (manage_for == "add") {
      let response = await vidchat.findByIdAndUpdate({ _id }, { "prepaid_talktime_min": prepaid_talktime_min, $push: { "paid_amount_obj": paid_amount_obj } })
      if (response) {
        let response3 = await vidchat.findOne({ _id })
        res.json({ status: 200, hassuccessed: true, data: response3 });
      } else {
        res.json({
          status: 400,
          hassuccessed: false,
          message: "Something went wrong",
        });
      }
    } else if (manage_for == 'use') {
      let response = await vidchat.findByIdAndUpdate({ _id }, { "prepaid_talktime_min": prepaid_talktime_min, $push: { "used_talktime": used_talktime } })
      if (response) {
        let response3 = await vidchat.findOne({ _id })
        res.json({ status: 200, hassuccessed: true, data: response3 });
      } else {
        res.json({
          status: 400,
          hassuccessed: false,
          message: "Something went wrong",
        });
      }
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
})

router.delete('/userdelete/:_id', function (req, res, next) {
  const token = (req.headers.token);
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      const { password } = req.body;
      vidchat.findById(req.params._id)
        .exec(function (err, getdtata) {
          if (getdtata.password !== password && getdtata.password !== "") {
            res.json({ status: 400, messages: "password not match" })
          }
          else {
            if (getdtata.prepaid_talktime_min > 0) {
              res.json({ status: 400, messages: "You can't not delete account, because you still havae minutes left ", save: getdtata.prepaid_talktime_min })
            }
            else {
              vidchat.findByIdAndRemove(req.params._id, function (err, data) {
                if (err) {
                  res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
                } else {
                  res.json({ status: 200, hassuccessed: true, message: 'Deleted Successfully' });
                }
              })
            }
          }
        })
    }
    catch {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong."
      });
    }
  }
  else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
})

router.post("/DynamicSlots", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      User.find({ _id: req.body._id }, function (err, userdata) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
            hassuccessed: false,
          })
        } else {

          var finalArray = [];
          for (let i = 0; i < userdata.length; i++) {
            let Monday,
              Tuesday,
              Wednesday,
              Thursday,
              Friday,
              Saturday,
              Sunday,
              custom_text;
            var user = [];
            console.log("user", userdata[0].online_appointment)
            for (
              let j = 0;
              j < userdata[i].online_appointment.length;
              j++
            ) {
              if (userdata[i].online_appointment[j].custom_text) {
                custom_text =
                  userdata[i].online_appointment[j].custom_text;
              }
              if (
                (userdata[i].online_appointment[j].monday_start,
                  userdata[i].online_appointment[j].monday_end
                )
              ) {
                Monday = getTimeStops(
                  userdata[i].online_appointment[j].monday_start,
                  userdata[i].online_appointment[j].monday_end,
                  req.body.duration_of_timeslots
                );
              }
              if (
                (userdata[i].online_appointment[j].tuesday_start,
                  userdata[i].online_appointment[j].tuesday_end
                )
              ) {
                Tuesday = getTimeStops(
                  userdata[i].online_appointment[j].tuesday_start,
                  userdata[i].online_appointment[j].tuesday_end,
                  req.body.duration_of_timeslots
                );
              }
              if (
                (userdata[i].online_appointment[j].wednesday_start,
                  userdata[i].online_appointment[j].wednesday_end
                )
              ) {
                Wednesday = getTimeStops(
                  userdata[i].online_appointment[j].wednesday_start,
                  userdata[i].online_appointment[j].wednesday_end,
                  req.body.duration_of_timeslots

                );
              }
              if (
                (userdata[i].online_appointment[j].thursday_start,
                  userdata[i].online_appointment[j].thursday_end
                )
              ) {
                Thursday = getTimeStops(
                  userdata[i].online_appointment[j].thursday_start,
                  userdata[i].online_appointment[j].thursday_end,
                  req.body.duration_of_timeslots
                );
              }
              if (
                (userdata[i].online_appointment[j].friday_start,
                  userdata[i].online_appointment[j].friday_end
                )
              ) {
                Friday = getTimeStops(
                  userdata[i].online_appointment[j].friday_start,
                  userdata[i].online_appointment[j].friday_end,
                  req.body.duration_of_timeslots

                );
              }
              if (
                (userdata[i].online_appointment[j].saturday_start,
                  userdata[i].online_appointment[j].saturday_end
                )
              ) {
                Saturday = getTimeStops(
                  userdata[i].online_appointment[j].saturday_start,
                  userdata[i].online_appointment[j].saturday_end,
                  req.body.duration_of_timeslots

                );
              }
              if (
                (userdata[i].online_appointment[j].sunday_start,
                  userdata[i].online_appointment[j].sunday_end
                )
              ) {
                Sunday = getTimeStops(
                  userdata[i].online_appointment[j].sunday_start,
                  userdata[i].online_appointment[j].sunday_end,
                  req.body.duration_of_timeslots

                );
              }
              user.push({
                Monday,
                Tuesday,
                Wednesday,
                Thursday,
                Friday,
                Saturday,
                Sunday,
                custom_text,
              });
            }

            finalArray.push({
              data: userdata[i],
              slot: user,
            });

          }

        }
        res.json({ status: 200, hassuccessed: true, data: finalArray })

      })


    }
    else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication required.",
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
  console.log("timestops", timeStops)
  return timeStops;

}

router.post("/getSlotTime", function (req, res) {
  const token = req.headers.token;
  var finalArray = []
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      const messageToSearchWith = new Appointment({ doctor_id: req.body.doctor_id });
      messageToSearchWith.encryptFieldsSync();
      Appointment.find({ doctor_id: { $in: [req.body.doctor_id, messageToSearchWith.doctor_id] } })
        .exec(function (err, data) {
          if (err && !data) {
            res.json({
              status: 200,
              message: "Something went wrong.",
              error: err,
              hassuccessed: false,
            });
          } else {
            virtual_Task.find({ "assinged_to.user_id": req.body.doctor_id }, function (err, data2) {
              if (err) {
                res.json({
                  status: 200,
                  message: "Something went wrong.",
                  error: err,
                  hassuccessed: false,
                });
              } else {
                data.map((element) => {
                  if (moment(req.body.date).format("DD/MM/YYYY") == moment(element.date).format("DD/MM/YYYY")) {
                    finalArray.push({
                      starttime: element.start_time,
                      endtime: element.end_time
                    })
                  }
                })
                data2.map((element) => {
                  if (moment(req.body.date).format("DD/MM/YYYY") == moment(element.date).format("DD/MM/YYYY")) {
                    finalArray.push({
                      starttime: element.start,
                      endtime: element.end
                    })
                  }
                })

                res.json({
                  status: 200,
                  messaage: "Time slots",
                  data: finalArray,
                  hassuccessed: true
                })

              }
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.get("/GetVideoTask/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  // var full_data;
  try {
    if (legit) {
      let patient_id = req.params.patient_id;
      var VirtualtToSearchWith = new virtual_Task({ patient_id });
      VirtualtToSearchWith.encryptFieldsSync();
      const VirtualtToSearchWith1 = new virtual_Task({ task_type: "video_conference" });
      VirtualtToSearchWith1.encryptFieldsSync();
      virtual_Task.find(
        {
          $and: [{
            patient_id: { $in: [patient_id, VirtualtToSearchWith.patient_id] },
            $or: [
              { task_type: { $eq: "video_conference" } },
              { task_type: { $eq: VirtualtToSearchWith1.task_type } },
            ],
            archived: { $ne: true }
          }]
        },
        function (err, userdata) {

          // full_data=userdata.filter((item)=>item.task_type==="video_conference")}
          if (!userdata) {
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.put('/UpdateVideoAccount/:_id', function (req, res, next) {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  if (legit) {
    vidchat.updateOne({ _id: req.params._id },  {$set: req.body}, { new: true }, function (err, userinfo) {
          if (err) {
              res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.' });
          } else {
              res.json({ status: 200, hassuccessed: true, msg: 'VideoAccount is Updated Successfully' });
          }
      });
  }
  else {
      res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
  }
});

router.post("/AddRefundInfo", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      var VideoChatAccountId = req.body.VideoChatAccountId
      const VirtualtToSearchWith1 = new refundform({ VideoChatAccountId });
      VirtualtToSearchWith1.encryptFieldsSync();
      refundform.find({ $or: [{ VideoChatAccountId: req.body.VideoChatAccountId }, { VideoChatAccountId: VirtualtToSearchWith1.VideoChatAccountId }] },
        function (err, data1) {
          console.log(data1)
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Information not found",
              error: err,
            })
          } else {
            if (data1.length > 0) {
              res.json({ status: 200, hassuccessed: false, data: "Account detail for refund Already exist" })
            } else {
              const Videodata = new refundform(req.body)
              Videodata.save()
                .then(result => {
                  res.json({
                    status: 200,
                    msg: 'Account detail for refund add Successfully',
                    data: result,
                    hassuccessed: true
                  })
                })
                .catch(err => {
                  console.log(err);
                  res.json({
                    status: 200,
                    msg: 'someting went wrong',
                    data: err,
                    hassuccessed: false
                  })
                })
            }
          }
        })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication Required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
})

router.get('/refundformdetail/:UserId', function (req, res, next) {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  try {
    if (legit) {
      var User_id = req.params.UserId
      const VirtualtToSearchWith1 = new refundform({ User_id });
      VirtualtToSearchWith1.encryptFieldsSync();
      refundform.find({ $or: [{ User_id: req.params.UserId }, { User_id: VirtualtToSearchWith1.UserId }] },
        function (err, doc) {
          if (err && !doc) {
            res.json({ status: 200, hassuccessed: false, msg: 'Refund form detail is not found', error: err })
          } else {
            if (doc && doc.length > 0) {
              res.json({ status: 200, hassuccessed: true, msg: 'Refund detail is found', data: doc })
            }
            else {
              res.json({ status: 200, hassuccessed: false, msg: 'No data ' })
            }

          }
        })
    }
    else {
      res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.get("/refundformlist", (req, res, next) => {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  try {
    if (legit) {
      refundform.find({}, function (err, result) {
        if (err) {
          res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
        } else {
          res.json({ status: 200, message: 'Get all refund form ', hassuccessed: true, data: result });
        }
      });
    }
    else {
      res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
})

router.delete('/deleteRefundForm/:FormId', function (req, res, next) {
  refundform.findOneAndRemove({ _id: req.params.FormId }, function (err, data12) {
    if (err) {
      res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
    } else {
      res.json({ status: 200, hassuccessed: true, msg: 'Refund Form is Deleted' });
    }
  })
})

module.exports = router;                                                                            