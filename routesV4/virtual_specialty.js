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

router.delete("/AddSpecialty/:specialty_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_Specialty.findByIdAndRemove(
      req.params.specialty_id,
      function (err, data) {
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
            message: "Speciality is Deleted Successfully",
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

router.put("/AddSpecialty/:specialty_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_Specialty.updateOne(
      { _id: req.params.specialty_id },
      req.body,
      function (err, userdata) {
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
            message: "Specialty is updated",
            data: userdata,
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

router.post("/AddSpecialty", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var Virtual_Specialtys = new Virtual_Specialty(req.body);
    Virtual_Specialtys.save(function (err, user_data) {
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
      message: "Authentication required.",
    });
  }
});

router.get("/AddSpecialty/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let house_id = req.params.house_id;
    const VirtualtToSearchWith = new Virtual_Specialty({ house_id });
    VirtualtToSearchWith.encryptFieldsSync();
    Virtual_Specialty.find(
      {
        $or: [
          { house_id: req.params.house_id },
          { house_id: VirtualtToSearchWith.house_id },
        ],
      },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
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

router.post("/AddTask", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_tasks = new virtual_Task(req.body);
    Virtual_tasks.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        var task_type = "sick_leave"
        const VirtualtToSearchWith1 = new virtual_Task({ task_type });
        VirtualtToSearchWith1.encryptFieldsSync();
        virtual_Task.updateOne({ _id: user_data._id, task_type: { $in: [task_type, VirtualtToSearchWith1.task_type] } }, { approved_date: req.body.created_at, approved: true }).exec(function (err, doc1) {
          if (err && !doc) {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          }
          else {
            User.findOne({ _id: req.body.patient_id }).exec(function (err, doc) {
              if (err && !doc) {
                console.log("err", err)
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
                  if (req.body.task_type !== "picture_evaluation") {
                    var m = new Date();
                    var dateString =
                      m.getUTCFullYear() +
                      "/" +
                      (m.getUTCMonth() + 1) +
                      "/" +
                      m.getUTCDate() +
                      " " +
                      m.getUTCHours() +
                      ":" +
                      m.getUTCMinutes() +
                      ":" +
                      m.getUTCSeconds();
                    var lan1 = getMsgLang(doc._id);
                    lan1.then((result) => {
                      result =
                        result === "ch"
                          ? "zh"
                          : result === "sp"
                            ? "es"
                            : result === "rs"
                              ? "ru"
                              : result;
                      var sms1 =
                        "There was a task added on in your Aimedis profile -" +
                        req.body.task_name +
                        " (" +
                        req.body.description +
                        ") at " +
                        dateString;
                      trans(sms1, { source: "en", target: result }).then((res1) => {
                        sendSms(doc.mobile, res1)
                          .then((result) => { })
                          .catch((e) => {

                          });
                      });
                      if (doc.emergency_number && doc.emergency_number !== "") {
                        var sms2 =
                          "There was a task added on -" +
                          doc.first_name +
                          " " +
                          doc.last_name +
                          " Aimedis profile ( " +
                          doc.profile_id +
                          " )  " +
                          " - " +
                          req.body.task_name +
                          " (" +
                          req.body.description +
                          ") at " +
                          dateString;
                        trans(sms2, { source: "en", target: result }).then(
                          (res1) => {
                            sendSms(doc.emergency_number, res1)
                              .then((result) => { })
                              .catch((e) => {

                              });
                          }
                        );
                      }
                      ApproveReq(doc, req.body.start, req.body.end, req.body.date).then(() => {

                      })
                    });
                  }

                  res.json({
                    status: 200,
                    message: "Added Successfully",
                    hassuccessed: true,
                    data: user_data,
                  });
                }
              }
            });

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
});


function ApproveReq(doc, start, end, date) {
  return new Promise((resolve, reject) => {
    try {
      console.log("user_data", date)
      let date_fn = moment(date).format("YYYY-MM-DD")
      sendData = `Dear Patient<br/>
      Your request for the sick leave certificate is accepted by the doctor on 
       ${date_fn}
        at 
        ${start} 
        to
        ${end}
        So, for the further process please complete your payment process from the request list page. The process of paymnet is 15 minutes process, So please do payment for this request within 15 minutes. Otherwise this request goes to at archive section automiatically.`;
      generateTemplate(
        EMAIL.generalEmail.createTemplate("en", {
          title: "",
          content: sendData,
        }),
        (error, html) => {
          let mailOptions = {
            from: "contact@aimedis.com",
            to: doc.email,
            subject: "Approve sick leave request by Doctor",
            html: html,
          };
          let sendmail = transporter.sendMail(mailOptions);
          if (sendmail) {

          } else {
            reject(err)
          }
        }
      );

    } catch (err) {
      reject(err);
    }
  });
}

router.delete("/AddTask/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.findByIdAndRemove(req.params.task_id, function (err, data) {
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
          message: "Task is Deleted Successfully",
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

router.put("/AddTask/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.body.payment_data && req.body.payment_data !== null) {
      req.body.payment_data = encrypt(JSON.stringify(req.body.payment_data))
    }
    virtual_Task.updateOne(
      { _id: req.params.task_id },
      req.body,
      function (err, userdata) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          if (req.body.is_decline) {
            virtual_Task.findOne(
              { _id: req.params.task_id },
              function (err, data1) {
                if (err) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "Something went wrong",
                    error: err,
                  });
                } else {
                  if (data1.task_type === "picture_evaluation") {
                    User.findOne(
                      { _id: req.body.patient_id },
                      function (err, data) {
                        if (err) {
                          res.json({
                            status: 200,
                            message: "Something went wrong.",
                            error: err,
                          });
                        } else {
                          var sendData = `<div> Dear ${data.first_name + " " + data.last_name} , </div><br/><div>The request is declined by the hospital. Please create a new request with full detail and good quality of pictures.</div><br/>`;


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
                                  subject: "Decline picture evaluation",
                                  html: html,
                                };

                                let sendmail =
                                  transporter.sendMail(mailOptions);
                                if (sendmail) {
                                  res.json({
                                    status: 200,
                                    message: "Mail sent Successfully",
                                    hassuccessed: true,
                                  });
                                }
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    res.json({
                      status: 200,
                      hassuccessed: true,
                      message: "Task is updated",
                      data: userdata,
                    });
                  }
                }
              }
            );
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Task is updated",
              data: userdata,
            });
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
});

router.get("/GetAllTask/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let house_id = req.params.house_id;
    const VirtualtToSearchWith = new virtual_Task({ house_id });
    VirtualtToSearchWith.encryptFieldsSync();
    // const VirtualtToSearchWith1 = new virtual_Task({ task_type: "sick_leave" });
    // VirtualtToSearchWith1.encryptFieldsSync();

    const VirtualtToSearchWith2 = new virtual_Task({
      task_type: "picture_evaluation",
    });
    VirtualtToSearchWith2.encryptFieldsSync();

    virtual_Task.find(
      {
        house_id: { $in: [house_id, VirtualtToSearchWith.house_id] },
        archived: { $ne: true },
        $or: [{ is_payment: { $exists: false } }, { is_payment: true }],
        $or: [
          // { task_type: { $ne: "sick_leave" } },
          // { task_type: { $ne: VirtualtToSearchWith1.task_type } },
          { task_type: { $exists: true, $eq: "picture_evaluation" } },
          { task_type: { $exists: true, $eq: VirtualtToSearchWith2.task_type } },
          { task_type: { $exists: false } },
        ],
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
          userdata.sort(mysort1);
          res.json({
            status: 200,
            hassuccessed: true,
            message: "success",
            data: userdata,
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

router.get("/GetAllArchivedTask/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let house_id = req.params.house_id;
    const messageToSearchWith = new virtual_Task({
      house_id,
    });
    messageToSearchWith.encryptFieldsSync();
    virtual_Task.find(
      {
        house_id: { $in: [house_id, messageToSearchWith.house_id] },
        archived: { $eq: true },
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

router.get("/AddTask/:task_ids", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.findOne(
      { _id: req.params.task_ids },
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

router.get("/PatientsTask/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const messageToSearchWith = new virtual_Task({
      patient_id: req.params.patient_id,
    });
    messageToSearchWith.encryptFieldsSync();
    virtual_Task.find(
      {
        patient_id: {
          $in: [messageToSearchWith.patient_id, req.params.patient_id],
        },
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

router.get("/ProfessionalTask/:patient_profile_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { "assinged_to.profile_id": req.params.patient_profile_id },
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

router.get(
  "/ProfessionalTask/:patient_profile_id/:house_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      let house_id = req.params.house_id;
      var VirtualtToSearchWith = new virtual_Task({ house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Task.find(
        {
          "assinged_to.profile_id": req.params.patient_profile_id,
          house_id: { $in: [house_id, VirtualtToSearchWith.house_id] },
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
            userdata.sort(mySorter);
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
  }
);

router.post("/ProfessionalTaskComment/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    req.body.comment_id =
      req.params.task_id + "_" + req.body.comment_by + "_" + Date.now();
    virtual_Task.updateOne(
      { _id: req.params.task_id },
      { $push: { comments: req.body } },
      { safe: true, upsert: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Task is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Comment is added",
            });
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
});

router.put(
  "/ProfessionalTaskComment/:task_id/:comment_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_Task.updateOne(
        {
          _id: req.params.task_id,
          "comments.comment_id": req.params.comment_id,
        },
        {
          $set: {
            "comments.$": req.body,
          },
        },
        function (err, doc) {
          if (err && !doc) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
              error: err,
            });
          } else {
            if (doc.nModified == "0") {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Task is not found",
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Comment is updated",
              });
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
  }
);

router.delete(
  "/ProfessionalTaskComment/:task_id/:comment_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_Task.updateOne(
        { _id: req.params.task_id },
        { $pull: { comments: { comment_id: req.params.comment_id } } },
        { multi: true },
        function (err, doc) {
          if (err && !doc) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
              error: err,
            });
          } else {
            if (doc.nModified == "0") {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Comment is not found",
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Comment is deleted",
              });
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
  }
);

router.delete("/AddService/:service_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Service.findByIdAndRemove(
      req.params.service_id,
      function (err, data) {
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
            message: "Service is Deleted Successfully",
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

router.put("/AddService/:service_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Service.updateOne(
      { _id: req.params.service_id },
      req.body,
      function (err, userdata) {
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
            message: "Service is updated",
            data: userdata,
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

router.post("/AddService", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var Virtual_Services = new virtual_Service(req.body);
    Virtual_Services.save(function (err, user_data) {
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
      message: "Authentication required.",
    });
  }
});

router.get("/GetService/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let house_id = req.params.house_id;
    const messageToSearchWith = new virtual_Service({ house_id });
    messageToSearchWith.encryptFieldsSync();
    virtual_Service.find(
      {
        $or: [
          { house_id: req.params.house_id },
          { house_id: messageToSearchWith.house_id },
        ],
      },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "services not found",
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

router.delete("/AddInvoice/:bill_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Invoice.findByIdAndRemove(req.params.bill_id, function (err, data) {
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
          message: "Invoice is Deleted Successfully",
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

router.put("/AddInvoice/:bill_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Invoice.updateOne(
      { _id: req.params.bill_id },
      req.body,
      function (err, userdata) {
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
            message: "Invoice is updated",
            data: userdata,
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

router.post("/AddInvoice", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var virtual_Invoices = new virtual_Invoice(req.body);
    var invoice_id = req.body.invoice_id;
    const AppointToSearchWith = new virtual_Invoice({ invoice_id });
    AppointToSearchWith.encryptFieldsSync();
    virtual_Invoice.find(
      {
        $or: [
          { invoice_id: invoice_id },
          { invoice_id: AppointToSearchWith.invoice_id },
        ],
      },
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          if (data.length) {
            res.json({ status: 200, message: "Invoice Already Exits" });
          } else {
            virtual_Invoices.save(function (err, user_data) {
              if (err && !user_data) {
                res.json({
                  status: 200,
                  message: "Something went wrong.",
                  error: err,
                });
              } else {
                res.json({
                  status: 200,
                  message: "Added Successfully",
                  hassuccessed: true,
                });
              }
            });
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
});

router.get("/AddInvoice/:house_id/:status", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let house_id = req.params.house_id;
    const VirtualtToSearchWith = new virtual_Invoice({ house_id });
    VirtualtToSearchWith.encryptFieldsSync();

    var search = {
      house_id: { $in: [req.params.house_id, VirtualtToSearchWith.house_id] },
    };
    if (req.params.status !== "all") {
      var search = {
        house_id: { $in: [req.params.house_id, VirtualtToSearchWith.house_id] },
        "status.value": req.params.status,
      };
    }
    virtual_Invoice.find(search, function (err, userdata) {
      if (err && !userdata) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "invoice not found",
          error: err,
        });
      } else {
        userdata.sort(mysort1);
        res.json({ status: 200, hassuccessed: true, data: userdata });
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

router.get("/infoOfHouses", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    fullInfo = [];
    User.findOne({ _id: legit.id }, function (err, userdata) {
      if (err && !userdata) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "user not found",
          error: err,
        });
      } else {
        if (userdata && userdata.houses && userdata.houses.length > 0) {
          forEachPromise(userdata.houses, getfullInfo).then((result) => {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Houses is found",
              data: fullInfo,
            });
          });
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

router.post("/checkPatient", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.body.patient_id) {
      const profile_id = req.body.patient_id;
      const messageToSearchWith = new User({ profile_id });
      messageToSearchWith.encryptFieldsSync();
      const alies_id = req.body.patient_id;
      const messageToSearchWith1 = new User({ alies_id });
      messageToSearchWith1.encryptFieldsSync();
      User.findOne(
        {
          $or: [
            { profile_id: messageToSearchWith.profile_id },
            { alies_id: messageToSearchWith1.alies_id },
            { profile_id: req.body.patient_id },
            { alies_id: req.body.patient_id },
          ],
        },
        function (err, userdata) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            try {
              if (userdata) {
                var createCase = false;
                if (req.body.pin) {
                  createCase = req.body.pin == userdata.pin ? true : false;
                } else {
                  var pos = 0;
                  userdata &&
                    userdata.assosiated_by.filter(
                      (data) => data.institute_id === req.body.institute_id
                    );
                  createCase =
                    userdata.parent_id === req.body.institute_id ? true : false;
                }
                if (createCase) {
                  virtual_Case.findOne(
                    { patient_id: userdata._id.toString(), inhospital: true },
                    function (err, data) {
                      if (err & !data) {
                        res.json({
                          status: 200,
                          message: "Something went wrong.",
                          hassuccessed: false,
                          error: err,
                        });
                      } else {
                        if (data) {
                          Institute.findOne(
                            {
                              "institute_groups.houses.house_id":
                                data.house_id.toString(),
                            },
                            function (err, doc3) {
                              if (err & !doc3) {
                                res.json({
                                  status: 200,
                                  message: "Something went wrongq.",
                                  hassuccessed: false,
                                  error: err,
                                });
                              } else {
                                var infoHouse = {};
                                if (doc3) {
                                  doc3.institute_groups.map(function (dataa) {
                                    dataa.houses.map(function (data1) {
                                      if (data1.house_id == data.house_id) {
                                        infoHouse.house = data1;
                                        infoHouse.institute_groups = {
                                          group_name: dataa.group_name,
                                          _id: dataa._id,
                                        };
                                      }
                                    });
                                  });
                                  res.json({
                                    status: 200,
                                    hassuccessed: false,
                                    message: "Already in other hospital",
                                    data: infoHouse,
                                  });
                                }
                              }
                            }
                          );
                        } else {
                          res.json({
                            status: 200,
                            hassuccessed: true,
                            message: "information get successfully",
                            data: userdata,
                          });
                        }
                      }
                    }
                  );
                } else {
                  if (req.body.pin) {
                    res.json({
                      status: 200,
                      hassuccessed: false,
                      message: "pin is not correct",
                    });
                  } else {
                    res.json({
                      status: 200,
                      hassuccessed: false,
                      message: "user is not associated need pin to add",
                    });
                  }
                }
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "patient is not exist",
                });
              }
            } catch (err) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong.",
                error: err,
              });
            }
          }
        }
      );
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Please enter patient id",
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

// router.post("/checkPatient1", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     if (req.body.patient_id) {
//       const profile_id = req.body.patient_id;
//       const messageToSearchWith = new User({ profile_id });
//       messageToSearchWith.encryptFieldsSync();
//       const alies_id = req.body.patient_id;
//       const messageToSearchWith1 = new User({ alies_id });
//       messageToSearchWith1.encryptFieldsSync();
//       User.findOne(
//         {
//           $or: [
//             { profile_id: messageToSearchWith.profile_id },
//             { alies_id: messageToSearchWith1.alies_id },
//             { profile_id: req.body.patient_id },
//             { alies_id: req.body.patient_id }
//           ],
//         },
//         function (err, userdata) {
//           if (err) {
//             res.json({
//               status: 200,
//               hassuccessed: false,
//               message: "Something went wrong.",
//               error: err,
//             });
//           } else {
//             try {
//               if (userdata) {

//                 virtual_Case.findOne({ patient_id: userdata._id.toString(), inhospital: true }, function (err, data) {
//                   if (err & !data) {
//                     res.json({ status: 200, message: "Something went wrong.", hassuccessed: false, error: err })
//                   }
//                   else {
//                     if (data) {
//                       Institute.findOne({ "institute_groups.houses.house_id": data.house_id.toString() }, function (err, doc3) {
//                         if (err & !doc3) {
//                           res.json({ status: 200, message: "Something went wrongq.", hassuccessed: false, error: err })
//                         }
//                         else {
//                           var infoHouse = {}
//                           if (doc3) {
//                             doc3.institute_groups.map(function (dataa) {
//                               dataa.houses.map(function (data1) {
//                                 if (data1.house_id == data.house_id) {
//                                   infoHouse.house = data1;
//                                   infoHouse.institute_groups = { group_name: dataa.group_name, _id: dataa._id };
//                                 }
//                               })
//                             })
//                             res.json({
//                               status: 200,
//                               hassuccessed: false,
//                               message: "Already in other hospital",
//                               data: infoHouse,
//                             });
//                           }
//                         }

//                       })

//                     }
//                     else {
//                       res.json({
//                         status: 200,
//                         hassuccessed: true,
//                         message: "information get successfully",
//                         data: userdata,
//                       });
//                     }
//                   }
//                 })

//               } else {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "patient is not exist",
//                 });
//               }
//             } catch (err) {
//               res.json({ status: 200, hassuccessed: false, message: "Something went wrong.", error: err })
//             }
//           }
//         }
//       );
//     }
//     else if (req.body.email) {
//       const email = req.body.email;
//       const messageToSearchWith = new User({ email });
//       messageToSearchWith.encryptFieldsSync();
//       User.findOne(
//         {
//           $or: [
//             { email: messageToSearchWith.email },
//             { email: req.body.email }
//           ],
//         },
//         function (err, userdata) {
//           if (err) {
//             res.json({
//               status: 200,
//               hassuccessed: false,
//               message: "Something went wrong.",
//               error: err,
//             });
//           }
//           else {
//             try {
//               if (userdata) {
//                 virtual_Case.findOne({ patient_id: userdata._id.toString(), inhospital: true }, function (err, data) {
//                   if (err & !data) {
//                     res.json({ status: 200, message: "Something went wrong.", hassuccessed: false, error: err })
//                   }
//                   else {
//                     if (data) {
//                       Institute.findOne({ "institute_groups.houses.house_id": data.house_id.toString() }, function (err, doc3) {
//                         if (err & !doc3) {
//                           res.json({ status: 200, message: "Something went wrongq.", hassuccessed: false, error: err })
//                         }
//                         else {
//                           var infoHouse = {}
//                           if (doc3) {
//                             doc3.institute_groups.map(function (dataa) {
//                               dataa.houses.map(function (data1) {
//                                 if (data1.house_id == data.house_id) {
//                                   infoHouse.house = data1;
//                                   infoHouse.institute_groups = { group_name: dataa.group_name, _id: dataa._id };
//                                 }
//                               })
//                             })
//                             res.json({
//                               status: 200,
//                               hassuccessed: false,
//                               message: "Already in other hospital",
//                               data: infoHouse,
//                             });
//                           }
//                         }

//                       })

//                     }
//                     else {
//                       res.json({
//                         status: 200,
//                         hassuccessed: true,
//                         message: "information get successfully",
//                         data: userdata,
//                       });
//                     }
//                   }
//                 })
//               } else {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "patient is not exist",
//                 });
//               }
//             } catch (err) {
//               res.json({ status: 200, hassuccessed: false, message: "Something went wrong.", error: err })

//             }
//           }
//         }
//       );
//     }
//     else if (req.body.first_name && req.body.last_name && req.body.birthday && req.body.mobile) {
//       // else if (req.body.first_name && req.body.last_name && req.body.mobile) {
//       const first_name = req.body.first_name;
//       const messageToSearchWithfirst = new User({ first_name });
//       messageToSearchWithfirst.encryptFieldsSync();

//       const messageToSearchWithfirst2 = new User({
//         first_name: first_name && first_name.toUpperCase(),
//       });
//       messageToSearchWithfirst2.encryptFieldsSync();
//       const messageToSearchWithfirst1 = new User({
//         first_name: first_name && first_name.toLowerCase(),
//       });
//       messageToSearchWithfirst1.encryptFieldsSync();

//       const last_name = req.body.last_name;
//       const messageToSearchWith1 = new User({ last_name });
//       messageToSearchWith1.encryptFieldsSync();

//       const messageToSearchWithlast2 = new User({
//         last_name: last_name && last_name.toUpperCase(),
//       });
//       messageToSearchWithlast2.encryptFieldsSync();
//       const messageToSearchWithlast3 = new User({
//         last_name: last_name && last_name.toLowerCase(),
//       });
//       messageToSearchWithlast3.encryptFieldsSync();

//       const mobile = req.body.mobile;
//       const messageToSearchWith2 = new User({ mobile });
//       messageToSearchWith2.encryptFieldsSync();
//       // const birthday = req.body.birthday;
//       // const messageToSearchWith3 = new User({ birthday });
//       // messageToSearchWith3.encryptFieldsSync();
//       User.findOne(
//         {
//           $and: [
//             {
//               $or: [
//                 { first_name: messageToSearchWithfirst.first_name },
//                 { first_name: req.body.first_name },
//                 {first_name:first_name.toLowerCase()},
//                 {first_name:first_name.toUpperCase()},
//                 {first_name:messageToSearchWithfirst1.first_name},
//                 {first_name:messageToSearchWithfirst1.first_name}
//               ]
//             },
//             {
//               $or: [
//                 { last_name: messageToSearchWith1.last_name },
//                 { last_name: req.body.last_name },
//                 {last_name:last_name.toLowerCase()},
//                 {last_name:last_name.toUpperCase()},
//                 {last_name:messageToSearchWithlast2.last_name},
//                 {last_name:messageToSearchWithlast3.last_name}
//               ]
//             },
//             {
//               $or: [
//                 { mobile: messageToSearchWith2.mobile },
//                 { mobile: req.body.mobile }
//               ]
//             }
//             // ,   { $or: [
//             //   { birthday: messageToSearchWith3.birthday },
//             //   { birthday: req.body.birthday }
//             // ]}

//           ]
//         },
//         function (err, userdata) {
//           if (err) {
//             res.json({
//               status: 200,
//               hassuccessed: false,
//               message: "Something went wrong.",
//               error: err,
//             });
//           } else {
//             try {
//               if (userdata) {
//                 var existDat = ""
//                 if (userdata && userdata.birthday) {
//                   existDat = new Date(userdata.birthday).setHours(0, 0, 0, 0)
//                 }
//                 if (existDat === new Date(req.body.birthday).setHours(0, 0, 0, 0)) {
//                   virtual_Case.findOne({ patient_id: userdata._id.toString(), inhospital: true }, function (err, data) {
//                     if (err & !data) {
//                       res.json({ status: 200, message: "Something went wrong.", hassuccessed: false, error: err })
//                     }
//                     else {
//                       if (data) {
//                         Institute.findOne({ "institute_groups.houses.house_id": data.house_id.toString() }, function (err, doc3) {
//                           if (err & !doc3) {
//                             res.json({ status: 200, message: "Something went wrongq.", hassuccessed: false, error: err })
//                           }
//                           else {
//                             var infoHouse = {}
//                             if (doc3) {
//                               doc3.institute_groups.map(function (dataa) {
//                                 dataa.houses.map(function (data1) {
//                                   if (data1.house_id == data.house_id) {
//                                     infoHouse.house = data1;
//                                     infoHouse.institute_groups = { group_name: dataa.group_name, _id: dataa._id };
//                                   }
//                                 })
//                               })
//                               res.json({
//                                 status: 200,
//                                 hassuccessed: false,
//                                 message: "Already in other hospital",
//                                 data: infoHouse,
//                               });
//                             }
//                           }

//                         })

//                       }
//                       else {
//                         res.json({
//                           status: 200,
//                           hassuccessed: true,
//                           message: "information get successfully",
//                           data: userdata,
//                         });
//                       }
//                     }
//                   })
//                 }
//                 else {
//                   res.json({
//                     status: 200,
//                     hassuccessed: false,
//                     message: "patient is not exist",
//                   });
//                 }

//               } else {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "patient is not exist",
//                 });
//               }
//             } catch (err) {
//               res.json({ status: 200, hassuccessed: false, message: "Something went wrong.", error: err })

//             }
//           }
//         }
//       );
//     }
//     else {
//       res.json({
//         status: 200,
//         hassuccessed: false,
//         message: "Please enter patient id",
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

router.post("/checkPatient1", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.body.patient_id) {
      const profile_id = req.body.patient_id;
      const messageToSearchWith = new User({ profile_id });
      messageToSearchWith.encryptFieldsSync();
      const alies_id = req.body.patient_id;
      const messageToSearchWith1 = new User({ alies_id });
      messageToSearchWith1.encryptFieldsSync();
      User.findOne(
        {
          $or: [
            { profile_id: messageToSearchWith.profile_id },
            { alies_id: messageToSearchWith1.alies_id },
            { profile_id: req.body.patient_id },
            { alies_id: req.body.patient_id },
          ],
        },
        function (err, userdata) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            try {
              if (userdata) {
                virtual_Case.findOne(
                  { patient_id: userdata._id.toString(), inhospital: true },
                  function (err, data) {
                    if (err & !data) {
                      res.json({
                        status: 200,
                        message: "Something went wrong.",
                        hassuccessed: false,
                        error: err,
                      });
                    } else {
                      if (data) {
                        Institute.findOne(
                          {
                            "institute_groups.houses.house_id":
                              data.house_id.toString(),
                          },
                          function (err, doc3) {
                            if (err & !doc3) {
                              res.json({
                                status: 200,
                                message: "Something went wrongq.",
                                hassuccessed: false,
                                error: err,
                              });
                            } else {
                              var infoHouse = {};
                              if (doc3) {
                                doc3.institute_groups.map(function (dataa) {
                                  dataa.houses.map(function (data1) {
                                    if (data1.house_id == data.house_id) {
                                      infoHouse.house = data1;
                                      infoHouse.institute_groups = {
                                        group_name: dataa.group_name,
                                        _id: dataa._id,
                                      };
                                    }
                                  });
                                });
                                res.json({
                                  status: 200,
                                  hassuccessed: false,
                                  message: "Already in other hospital",
                                  data: infoHouse,
                                });
                              } else {
                              }
                            }
                          }
                        );
                      } else {
                        res.json({
                          status: 200,
                          hassuccessed: true,
                          message: "information get successfully",
                          data: userdata,
                        });
                      }
                    }
                  }
                );
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "patient is not exist",
                });
              }
            } catch (err) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong.",
                error: err,
              });
            }
          }
        }
      );
    } else if (req.body.email) {
      const email = req.body.email;
      const messageToSearchWith = new User({ email });
      messageToSearchWith.encryptFieldsSync();
      User.findOne(
        {
          $or: [
            { email: messageToSearchWith.email },
            { email: req.body.email },
          ],
        },
        function (err, userdata) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            try {
              if (userdata) {
                virtual_Case.findOne(
                  { patient_id: userdata._id.toString(), inhospital: true },
                  function (err, data) {
                    if (err & !data) {
                      res.json({
                        status: 200,
                        message: "Something went wrong.",
                        hassuccessed: false,
                        error: err,
                      });
                    } else {

                      if (data) {
                        Institute.findOne(
                          {
                            "institute_groups.houses.house_id":
                              data.house_id.toString(),
                          },
                          function (err, doc3) {
                            if (err & !doc3) {
                              res.json({
                                status: 200,
                                message: "Something went wrongq.",
                                hassuccessed: false,
                                error: err,
                              });
                            } else {
                              var infoHouse = {};
                              if (doc3) {
                                doc3.institute_groups.map(function (dataa) {
                                  dataa.houses.map(function (data1) {

                                    if (data1.house_id == data.house_id) {
                                      infoHouse.house = data1;
                                      infoHouse.institute_groups = {
                                        group_name: dataa.group_name,
                                        _id: dataa._id,
                                      };
                                    }
                                  });
                                });
                                res.json({
                                  status: 200,
                                  hassuccessed: false,
                                  message: "Already in other hospital",
                                  data: infoHouse,
                                });
                              }
                            }
                          }
                        );
                      } else {
                        res.json({
                          status: 200,
                          hassuccessed: true,
                          message: "information get successfully",
                          data: userdata,
                        });
                      }
                    }
                  }
                );
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "patient is not exist",
                });
              }
            } catch (err) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong.",
                error: err,
              });
            }
          }
        }
      );
    } else if (
      req.body.first_name &&
      req.body.last_name &&
      req.body.birthday &&
      req.body.mobile
    ) {
      const first_name = req.body.first_name;
      const messageToSearchWithfirst = new User({ first_name });
      messageToSearchWithfirst.encryptFieldsSync();

      const messageToSearchWithfirst2 = new User({
        first_name: first_name && first_name.toUpperCase(),
      });
      messageToSearchWithfirst2.encryptFieldsSync();
      const messageToSearchWithfirst1 = new User({
        first_name: first_name && first_name.toLowerCase(),
      });
      messageToSearchWithfirst1.encryptFieldsSync();

      const last_name = req.body.last_name;
      const messageToSearchWith1 = new User({ last_name });
      messageToSearchWith1.encryptFieldsSync();

      const messageToSearchWithlast2 = new User({
        last_name: last_name && last_name.toUpperCase(),
      });
      messageToSearchWithlast2.encryptFieldsSync();
      const messageToSearchWithlast3 = new User({
        last_name: last_name && last_name.toLowerCase(),
      });
      messageToSearchWithlast3.encryptFieldsSync();

      const mobile = req.body.mobile;
      const messageToSearchWith2 = new User({ mobile });
      messageToSearchWith2.encryptFieldsSync();

      User.find(
        {
          $and: [
            {
              $or: [
                { first_name: messageToSearchWithfirst.first_name },
                { first_name: req.body.first_name },
                { first_name: first_name.toLowerCase() },
                { first_name: first_name.toUpperCase() },
                { first_name: messageToSearchWithfirst1.first_name },
                { first_name: messageToSearchWithfirst1.first_name },
              ],
            },
            {
              $or: [
                { last_name: messageToSearchWith1.last_name },
                { last_name: req.body.last_name },
                { last_name: last_name.toLowerCase() },
                { last_name: last_name.toUpperCase() },
                { last_name: messageToSearchWithlast2.last_name },
                { last_name: messageToSearchWithlast3.last_name },
              ],
            },
            {
              $or: [
                { mobile: messageToSearchWith2.mobile },
                { mobile: req.body.mobile },
              ],
            },
            // ,   { $or: [
            //   { birthday: messageToSearchWith3.birthday },
            //   { birthday: req.body.birthday }
            // ]}
          ],
        },
        function (err, userdata) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            try {
              if (userdata && userdata.length > 0) {

                var newData = userdata.filter(
                  (item) =>
                    moment(item.birthday).format("MM/DD/YYYY") ===
                    moment(req.body.birthday).format("MM/DD/YYYY")
                );

                if (newData && newData.length > 0) {
                  virtual_Case.findOne(
                    { patient_id: newData[0]._id.toString(), inhospital: true },
                    function (err, data) {
                      if (err & !data) {
                        res.json({
                          status: 200,
                          message: "Something went wrong.",
                          hassuccessed: false,
                          error: err,
                        });
                      } else {
                        if (data) {
                          Institute.findOne(
                            {
                              "institute_groups.houses.house_id":
                                data.house_id.toString(),
                            },
                            function (err, doc3) {
                              if (err & !doc3) {
                                res.json({
                                  status: 200,
                                  message: "Something went wrongq.",
                                  hassuccessed: false,
                                  error: err,
                                });
                              } else {
                                var infoHouse = {};
                                if (doc3) {
                                  doc3.institute_groups.map(function (dataa) {
                                    dataa.houses.map(function (data1) {

                                      if (data1.house_id == data.house_id) {
                                        infoHouse.house = data1;
                                        infoHouse.institute_groups = {
                                          group_name: dataa.group_name,
                                          _id: dataa._id,
                                        };
                                      }
                                    });
                                  });
                                  res.json({
                                    status: 200,
                                    hassuccessed: false,
                                    message: "Already in other hospital",
                                    data: infoHouse,
                                  });
                                }
                              }
                            }
                          );
                        } else {
                          res.json({
                            status: 200,
                            hassuccessed: true,
                            message: "information get successfully",
                            data: newData[0],
                          });
                        }
                      }
                    }
                  );
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "patient is not exist",
                  });
                }
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "patient is not exist",
                });
              }
            } catch (err) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong.",
                error: err,
              });
            }
          }
        }
      );
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Please enter patient id",
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

router.post("/linkforAccepthospital", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var lan1 = getMsgLang(req.body.patient);
    lan1.then((result) => {
      if (req.body.email) {
        var sendData =
          "Dear,<br/><b>" +
          req.body.patient_name +
          "</b><br/> " +
          "The hospital - Want to the get your information, for the addmission, For approve the request or decline the request go to the <b><a style='color:black;' href='" +
          "https://virtualhospital.aimedis.io/approveHospital/" +
          req.body.case_id +
          "'>LINK</a></b>";
        ".<br/>" + "<b>Your Aimedis team </b>";

        generateTemplate(
          EMAIL.generalEmail.createTemplate(result, {
            title: "",
            content: sendData,
          }),
          (error, html) => {
            if (!error) {
              let mailOptions = {
                from: "contact@aimedis.com",
                to: req.body.email,
                subject: "Request to access you information from Hospital",
                html: html,
              };
              let sendmail = transporter.sendMail(mailOptions);
              if (sendmail) {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  message: "Mail is sent",
                });
              }
            }
          }
        );
      }
      if (req.body.mobile) {
        result =
          result === "ch"
            ? "zh"
            : result === "sp"
              ? "es"
              : result === "rs"
                ? "ru"
                : result;
        var sms1 =
          "Dear, " +
          req.body.patient_name +
          "The hospital - Want to the get your information, for the addmission, For approve the request or decline the request go to the this link\n" +
          " https://virtualhospital.aimedis.io/approveHospital/" +
          req.body.case_id;

        trans(sms1, { source: "en", target: result }).then((res1) => {
          sendSms(req.body.mobile, res1)
            .then((result) => {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Message is sent",
              });
            })
            .catch((e) => {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Message is not sent",
              });
            });
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

router.post("/addPatientToVH", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var virtual_Cases = new virtual_Case(req.body);
    virtual_Cases.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        res.json({
          status: 200,
          message: "Case number is assigned",
          hassuccessed: true,
          data: user_data._id,
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

router.put("/addPatientToVH/:case_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.updateOne(
      { _id: req.params.case_id },
      req.body,
      function (err, userdata) {
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
            message: "Case is updated",
            data: userdata,
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

router.delete("/addPatientToVH/:case_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.findByIdAndRemove(req.params.case_id, function (err, data) {
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
          message: "Case is Deleted Successfully",
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

router.get("/getPatientFromVH/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const messageToSearchWithlast3 = new virtual_Case({
      house_id: req.params.house_id,
    });
    messageToSearchWithlast3.encryptFieldsSync();
    virtual_Case.find(
      {
        $and: [
          {
            house_id: {
              $in: [req.params.house_id, messageToSearchWithlast3.house_id],
            },
          },
          { inhospital: true },
          { verifiedbyPatient: true },
        ],
      },
      function (err, user_data) {
        if (err && !user_data) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get the patients",
            hassuccessed: true,
            data: user_data,
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

router.get("/getAppointTask/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      { "houses.value": req.params.House_id, type: "doctor" },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
            error: err,
          });
        } else {
          Promise.all([
            virtualAppointment(userdata),
            virtualTask(req.params.House_id),
          ]).then((list1) => {
            var flatArray = Array.prototype.concat.apply([], list1);
            res.json({
              status: 200,
              hassuccessed: true,
              data: flatArray,
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

router.get("/getAppointTask1/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      { "houses.value": req.params.House_id, type: "doctor" },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
            error: err,
          });
        } else {
          virtualTask(req.params.House_id).then((list) => {
            res.json({ status: 200, hassuccessed: true, data: list });
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

router.get("/statisticstopinfo/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  if (legit) {
    Promise.all([
      virtualCase(req.params.House_id),
      User_Case(req.params.House_id),
      User_Case1(req.params.House_id),
    ]).then((list1) => {
      var flatArray = Array.prototype.concat.apply([], list1);

      res.json({ status: 200, hassuccessed: true, data: flatArray });
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.get("/stasticsrightinfo/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_step.findOne(
      { house_id: req.params.house_id },
      function (err, userdata) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
            error: err,
          });
        } else {
          if (userdata) {
            let count = userdata.steps && userdata.steps.length > 0 && userdata.steps.map((element) => {
              return {
                step_name: element.step_name, counts: element.case_numbers ? element.case_numbers.length : 0,
              };
            });
            res.json({ status: 200, hassuccessed: true, data: count });
          } else {
            res.json({ status: 200, hassuccessed: true, data: [] });
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
});

router.get("/sortinfo/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Promise.all([
      virtualInvoiceforPatient(req.params.patient_id),
      virtualTasksforPatient(req.params.patient_id),
    ]).then((data, data1) => {
      res.json({ status: 200, hassuccessed: true, data: data, data1 });
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.get("/sortinfo1/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Invoice
      .aggregate([
        {
          $match: {
            "patient._id": ObjectId(req.params.patient_id),
            // "patient.patient_id": req.params.patient_id,
          },
        },
        {
          $lookup: {
            from: "virtual_tasks",
            localField: "patient_id",
            foreignField: "patient_id",
            as: "complete_info",
          },
        },
        {
          $project: {
            services: 1,
            invoice_id: 1,
            patient: 1,
            case_id: 1,
            status: 1,
            total_amount: 1,
            house_id: 1,
            created_at: 1,
            virtualtask: "$complete_info",
          },
        },
        //  { $unwind: "$complete_info"}
      ])
      .exec(function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {

          res.json({ status: 200, hassuccessed: true, result: data });
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

router.get("/BedAvability/:specialty_id/:ward_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let wards = {};
  let ward1 = {};
  var allData = [];
  try {
    if (legit) {
      Virtual_Specialty.find(
        { _id: req.params.specialty_id },
        function (err, data) {
          if (err & !data) {
            res.json({ status: 200, hassuccessed: true, error: err });
          } else {

            if (data && data.length > 0) {
              data[0].wards.forEach((element) => {
                if (element._id == req.params.ward_id) {
                  wards.rooms = element.rooms;
                }
              });
              virtual_Case.find(
                { "wards._id": req.params.ward_id },
                function (err, room) {
                  if (err & !room) {
                    res.json({ status: 200, hassuccessed: true, error: err });
                  } else {
                    // console.log("rooms", room[0].rooms)
                    // wards.rooms.forEach((element) => {
                    //   if (room[0].rooms._id == element._id) {
                    //     console.log("element.room",element.room)
                    //     wards.cases = element.room
                    //     console.log("wards",wards)
                    //     res.json({ status: 200, hassuccessed: true, data: wards })
                    //   }

                    // });
                    var bedData = [];
                    wards &&
                      wards.rooms &&
                      wards.rooms.length > 0 &&
                      wards.rooms.forEach((element) => {
                        for (var i = 1; i <= element.no_of_bed; i++) {
                          var data =
                            room &&
                            room.length > 0 &&
                            room.filter((item) => {
                              return (
                                item.rooms._id == element._id && item.bed == i
                              );
                            });
                          bedData.push({
                            bed: i,
                            cases: data && data.length > 0 ? data[0] : {},
                          });
                        }
                        ward1.bedData = bedData;
                        ward1.room_id = element._id;
                        ward1.rooms = element;
                        allData.push(ward1);
                        ward1 = {};
                        bedData = [];
                        // room.forEach((element2) => {
                        //   if (element2.rooms._id == element._id) {
                        //     ward1.room_id = element2.rooms._id
                        //     ward1.cases = room
                        //     allData.push(ward1)
                        //     ward1 = {}
                        //   }
                        // })
                      });
                    res.json({
                      status: 200,
                      hassuccessed: true,
                      data: allData,
                    });
                  }
                }
              );
            } else {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "speciality not found",
              });
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
  } catch {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.post("/downloadInvoicePdf", function (req, res, next) {
  // Custom handlebar helper
  try {
    handlebars.registerHelper("ifCond", function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
    var Data = [];
    var date1 = [];
    var filename = "GeneratedReport.pdf";
    var logo1 =
      "data:image/png;base64,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";
    logo2 =
      "data:image/png;base64,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";

    if (req.body.choice == 1) {
      Object.entries(req.body).map(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => Data.push(Object.assign({}, v)));
        }
        if (
          key === "invoice_id" ||
          key === "Number" ||
          key === "status" ||
          key === "patient"
        ) {
          Data.push({
            k: key.replace(/_/g, " "),
            v: value,
          });
        }
        if (key === "total_amount") {
          Data.push({
            k: key,
            v: value,
          });
        } else if (key === "created_at") {
          date1.push({ k: "created_at", v: getDate(value, "YYYY/MM/DD") });
        }
      });
      let data1 = date1.map((element) => {
        return element.v;
      });

      var template = handlebars.compile(html2);
      let house_name = req.body.house_name;
      var htmlToSend = template({
        Invoice: Data,
        pat_info: req.body,
        Service: house_name,
        date: data1,
      });

      if (htmlToSend) {
        var options = {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          format: "A4",
          path: `${__dirname}/${filename}`,
          displayHeaderFooter: true,
          margin: { top: 80, bottom: 80, left: 60, right: 60 },
          headerTemplate: `<div style="text-align: center; width: 100%; font-size: 30px;"><img src="${logo1}" alt="Girl in a jacket" height="40"></div>`,
          footerTemplate: `<div style="text-align: center;  width: 100%; font-size: 30px;"><img src="${logo2}" alt="Girl in a jacket" height="30"></div>`,
        };

        let file = [{ content: htmlToSend }];
        html_to_pdf.generatePdfs(file, options).then((output) => {
          const file = `${__dirname}/${filename}`;
          res.download(file);
        });
      } else {
        res.json({ status: 200, hassuccessed: true, filename: filename });
      }
    }
    if (req.body.choice == 2) {
      Object.entries(req.body).map(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => Data.push(Object.assign({}, v)));
        } else if (
          key === "invoice_id" ||
          key === "case_id" ||
          key === "total_amount"
        ) {
          Data.push({
            k: key.replace(/_/g, " "),
            v: value,
          });
        } else if (key === "created_at") {
          date1.push({ k: "created_at", v: getDate(value, "YYYY/MM/DD") });
        }
      });
      var template = handlebars.compile(billinvoice1);
      let house_name = req.body.house_name;

      let data1 = date1.map((element) => {
        return element.v;
      });

      var htmlToSend = template({
        Invoice: Data,
        pat_info: req.body,
        Service: house_name,
        date: data1,
      });
      var filename = "GeneratedReport.pdf";

      if (htmlToSend) {
        var options = {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          format: "A4",
          path: `${__dirname}/${filename}`,
          displayHeaderFooter: true,
          margin: { top: 80, bottom: 80, left: 60, right: 60 },
          headerTemplate: `<div style="text-align: center; width: 100%; font-size: 30px;"><img src="${logo1}" alt="Girl in a jacket" height="40"></div>`,
          footerTemplate: `<div style="text-align: center;  width: 100%; font-size: 30px;"><img src="${logo2}" alt="Girl in a jacket" height="30"></div>`,
        };

        let file = [{ content: htmlToSend }];
        html_to_pdf.generatePdfs(file, options).then((output) => {
          const file = `${__dirname}/${filename}`;
          res.download(file);
        });
      } else {
        res.json({ status: 200, hassuccessed: true, filename: filename });
      }
    }
    if (req.body.choice == 3) {
      Object.entries(req.body).map(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => Data.push(Object.assign({}, v)));
        } else if (
          key === "invoice_id" ||
          key === "case_id" ||
          key === "total_amount"
        ) {
          Data.push({
            k: key.replace(/_/g, " "),
            v: value,
          });
        } else if (key === "created_at") {
          Data.push({ k: "created_at", v: getDate(value, "YYYY/MM/DD") });
        }
      });
      var template = handlebars.compile(billinvoice2);
      let house_name = req.body.house_name;

      var htmlToSend = template({
        Invoice: Data,
        pat_info: req.body,
        Service: house_name,
      });
      var filename = "GeneratedReport.pdf";

      if (htmlToSend) {
        var options = {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          format: "A4",
          path: `${__dirname}/${filename}`,
          displayHeaderFooter: true,
          margin: { top: 80, bottom: 80, left: 60, right: 60 },
          headerTemplate: `<div style="text-align: center; width: 100%; font-size: 30px;"><img src="${logo1}" alt="Girl in a jacket" height="40"></div>`,
          footerTemplate: `<div style="text-align: center;  width: 100%; font-size: 30px;"><img src="${logo2}" alt="Girl in a jacket" height="30"></div>`,
        };

        let file = [{ content: htmlToSend }];
        html_to_pdf.generatePdfs(file, options).then((output) => {
          const file = `${__dirname}/${filename}`;
          res.download(file);
        });
      } else {
        res.json({ status: 200, hassuccessed: true, filename: filename });
      }
    }
    if (req.body.choice == 4) {
      Object.entries(req.body).map(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => Data.push(Object.assign({}, v)));
        } else if (
          key === "invoice_id" ||
          key === "case_id" ||
          key === "total_amount"
        ) {
          Data.push({
            k: key.replace(/_/g, " "),
            v: value,
          });
        } else if (key === "created_at") {
          date1.push({ k: "created_at", v: getDate(value, "YYYY/MM/DD") });
        }
      });
      var template = handlebars.compile(billinvoice3);
      let data1 = date1.map((element) => {
        return element.v;
      });

      let house_name = req.body.house_name;

      var htmlToSend = template({
        Invoice: Data,
        pat_info: req.body,
        Service: house_name,
        date: data1,
      });
      var filename = "GeneratedReport.pdf";
      if (htmlToSend) {
        var options = {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          format: "A4",
          path: `${__dirname}/${filename}`,
          displayHeaderFooter: true,
          margin: { top: 80, bottom: 80, left: 60, right: 60 },
          headerTemplate: `<div style="text-align: center; width: 100%; font-size: 30px;"><img src="${logo1}" alt="Girl in a jacket" height="40"></div>`,
          footerTemplate: `<div style="text-align: center;  width: 100%; font-size: 30px;"><img src="${logo2}" alt="Girl in a jacket" height="30"></div>`,
        };

        let file = [{ content: htmlToSend }];
        html_to_pdf.generatePdfs(file, options).then((output) => {
          const file = `${__dirname}/${filename}`;
          res.download(file);
        });
      } else {
        res.json({ status: 200, hassuccessed: true, filename: filename });
      }
    }
    if (req.body.choice == 5) {
      handlebars.registerHelper("ifCond", function (v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });

      var Data = [];
      {
        Object.entries(req.body).map(([key, value]) => {
          if (Array.isArray(value)) {
            Data.push({
              k: key.replace(/_/g, " "),
              v: value.map((element) => {
                // return element
                return (
                  element.price_per_quantity &&
                  element.quantity &&
                  element.service &&
                  element.price
                );
              }),
            });
          } else if (
            key === "invoice_id" ||
            key === "case_id" ||
            key === "total_amount"
          ) {
            Data.push({
              k: key.replace(/_/g, " "),
              v: value,
            });
          } else if (key === "created_at") {
            Data.push({ k: "created_at", v: getDate(value, "YYYY/MM/DD") });
          }
        });
      }
      var template = handlebars.compile(html);
      var htmlToSend = template({
        Invoice: Data,
        pat_info: req.body,
      });
      var filename = "GeneratedReport.pdf",
        logo1 =
          "data:image/png;base64,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";
      logo2 =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA9EAAAOwCAYAAAA5mPeMAAAACXBIWXMAACxKAAAsSgF3enRNAAAgAElEQVR4nOzdTXZcx5km4Agfz8FeAdDj6j5ETyXLgETOCSNrTmgFglcgeAVGrUDguDMJsGTZskWJ4MCaEqiy1cMCV1DACm6fS15K4A+AROb9ibjxPOfwuMoyb96MgGW9/L74IlZVFQCAbsXHz9dCCPWvOyGE9ebDmn8vvvns+q/dveFFnr/z/581v2onIYTz+l+r7d+e21IAaJ8QDQAtirPn601IrgPy5s/BOF73Gdf+xWWchhDPmnBd/zqrtj85sd8AsDghGgAWFGfP3wTlN8F548onDROir3r28yZUH9e/qu1PVK0BYE5CNADMKc6e11XlrSY4179W5//NC//FJc317JdNoD4SqgHgekI0AFwjzo7XXwfnuDXHeeVrHrTwX1zSQs8+DSEcNIFa+zcAXCJEA8A7muC801Sdm2rzkkE3rxB92cumQn0gUAOAEA0Ar8TZ8VoTmnc/3KZdbIi+7E2F+qja/uRs/t8GAOMhRANQtDg73mqqzg+uXwch+h1PQogH1fZvjrr6AABIkRANQHHi7PhOU3HemX84mBB9xbPrdu/91+3evzGQDIDRE6IBKEbTsr0XQnh4++8sRN/w7Ivm7PRetf0brd4AjJYQDcDoLRee3xCib/HsR8I0AGMlRAMwWu2E5zeE6AWeLUwDMDpCNACj0254fkOIXuLZwjQAoyFEAzAacfbsTgixHhj2ZfvfSYhe8tkXzQCyfQPIAMiZEA3AKMTZs53XIS2udPN9hOiWnv2yqUoftP8+ANA9IRqArMXZs/Wmwrnx+nt0FRqF6Jaf/by+YkyLNwC5EaIByNLr1u1X556/ePv9hejMnv2Havs3e208CAD6IEQDkJ04e7YZQqjbgVfff3chOsNnnzZV6ZO2HggAXRGiAcjG1dXny4TojJ+tKg1A8oRoALLQnH2uq893r39fITrzZ6tKA5C0X9keAFIXZ8/qa6te3BygGYF6j4/j47/v2EwAUqQSDUCymvbtuvr8YP53VIke0bMfhRB2q+2P3SsNQDKEaACSNH/79ruE6JE9u27v3qq2P3YVFgBJ0M4NQHLi7NlW3dKrfZvmZ+AkPv77psUAIAVCNABJibNn9XTmwxDCip2hUf8sPHNOGoAUaOcGIBlx9qxu33643Pto5x75sx9V2x8L0wAMRogGYHDNALGW2reF6AKe/eT1NVgGjgHQPyEagEG1G6CDEF3Os+uBY5uCNAB9cyYagME0E7hPDBBjAW/uk75j8QDok0o0AINoAvRx+wPEVKILe7aKNAC9UokGoHfdBWgKVFekz+Ljv6/bfAD6oBINQK/i7If1EGKHAVolutBnX4QQ1qvtj88WWiYAmJNKNAC9eR2gVaDpRP0zdeSMNABdE6IB6EWc/bArQNMxw8YA6Jx2bgA6FWc/1IHmIITw4JfPybF9WTt3Rs82bAyAzqhEA9CZJkAfvx2goXN3mz+4AYDWCdEAdOJSgHYHNEN4EB//XZAGoHVCNACtE6BJxMP4+O+7NgOANgnRAHThSIAmEX+Mj/++ZTMAaIsQDUCr4uyHuoV2w6qSkIP4+O/rNgSANgjRALQmzn7Yq1torSiJWWmCtKuvAFiaEA1AK+Lsh50QwpdWk0TVxwv2bQ4Ay3JPNABLi7Mf1ptBYivzPcs90a0+e/EPLvHZv6+2PxamAViYEA3AUppJ3CchhNX5nyNEt/rsxT+4xGdfhBA3q+2PTjpcGABGTDs3AMs6ul2AhkG9Oh9tCwBYlBANwMKaQWImcZObu/Hxj1q6AViIdm4AFhJnP2yGEJ4t+Ls7XHTt3J4997M/rbY/Ou7wgwAYISEagFtb7Bz0ZUJ0q89e/INLf/bLEMJ6tf3ReYeLBMDIaOcGYBEHzkEzAvXP8J6NBOA2VKIBuJU4+2ErhHC43KqpRLf67MU/2LNf+z+mdQMwL5VoAObWtHGbbMzY+JkGYG5CNAC3cdBcEQRjUk/r3rWjAMxDOzcAc2mnjfsN7dytPnvxD/bsX1yEENYMGQPgJirRANxIGzcFWDFkDIB5CNEAzGNPGzcF+CI+/nHNRgNwHSEagGvF2Q/rdbiwShRCNRqAawnRANxk3wpRkIfx8Y+bNhyAqwjRAFypGSa2YYUojGo0AFcSogG4jio0JdpQjQbgKkI0AB8UZz/U1bhVq0OhVKMB+CD3RAPwnjj7/k4I8ay7idzuiW712Yt/sGdf739W2x+ddbiAAGRIJRqAD9l1pRWoRgPwPpVoAN7yugodzkKIHYZolehWn734B3v2zVSjAXiLSjQA71KFhl/sWAsALhOiAfhZU4XetSLwM/99AOAtQjQAl6lCw9tW4uMfVaMB+JkQDcArqtBwJSEagJ8J0QC8saMKDR+0ER//uGZpAAhCNACXqELD1fz3A4BXhGgA6lbuugq9aiXgSluWBoAgRAPQcOYTrrcaH/8oSAMgRAOULs6+X6/PfJa+DjAHIRoAIRoAZz1hTkI0ACFWVWUVAArVXGv13x/+9rHDRcnx2Us+99rfbq0zevan1fZHx8s8AIC8qUQDlM1ZaLgd1WiAwgnRAGXTyg23I0QDFE6IBihUM1DMtVZwO/WU7jVrBlAuIRqgXKrQsBjVaICCCdEA5RIEYDGb1g2gXEI0QIHi7Ps6QK/Ye1iIEA1QMCEaoEymcsPiVuLjH9etH0CZhGiAwjR3Qz+w77AU1WiAQgnRAOVxFhqWJ0QDFEqIBiiPEA3L084NUKhYVZW9ByhE08r93/N929jhouT47CWfe+1vt9aZPvt/VNsfnbf1MADyoBINUBZVaGiPajRAgYRogLII0dAe56IBCiREA5TFP/RDe9asJUB5hGiAQsTZ93UVesV+Q2uEaIACCdEA5VCFhnZtWE+A8gjRAOVwHhpaFh//eMeaApRFiAYoQJx9X08RXrXX0DoTugEKI0QDlEErN3RDJRqgMEI0QBmEaOiG/24BFEaIBijDA/sMnTBrAKAwQjTAyMXZ9ypl0J3V+PhH56IBCiJEA4yfEA3dci4aoCBCNMD4CdHQLZVogIII0QDjt2GPoVMq0QAFEaIBRsx5aOiFEA1QECEaYNyEaOiedm6AggjRAOMmRAMAtEiIBhg356EBAFokRAOMVJx9r8UU+rFmnQHKIUQDjJdWbujHqnUGKIcQDTBeKtEAAC0TogHGS4gGAGiZEA0wXnftLQBAu4RogBGKs++dhwYA6IAQDTBOQjQAQAeEaIBxch4aAKADQjTAOLm3FvpzYa0ByiFEA4yToWLQnxNrDVAOIRpgZAwVAwDojhANMD5auQEAOiJEA4yPoWLQrzPrDVAOIRpgfIRo6JcQDVAQIRpgfIRoAICOCNEAIxJn398JIazYU+jVseUGKIcQDTAuqtAAAB0SogHGRYiGnlXbH6lEAxREiAYYF9dbQb8urDdAWYRogHFRiYZ+nVhvgLII0QDjohIN/RKiAQojRAOMy6r9hF65IxqgMEI0wEjE2fdauaF/KtEAhRGiAcbjjr2EfpnMDVAeIRpgPDbtJfTq1HIDlEeIBhgPlWjolyo0QIGEaIDxcCYa+iVEAxRIiAYYD5Vo6JehYgAFEqIBxuOuvYTenFbbH7neCqBAQjTACMTZ92v2EXqllRugUEI0wDgI0dAvIRqgUEI0wDg4Dw09qrY/OrLeAGUSogHGwWRu6M8Taw1QLiEaYBxUoqE/qtAABROiAcZBJRr6I0QDFEyIBgCY35Nq+6Nz6wVQLiEaYBw27CP0QhUaoHBCNADA/IRogMIJ0QCZi7Pv3REN/XiklRsAIRogf0I09EMVGgAhGgBgDi+r7Y+EaACEaIAR2LSJ0LkDSwxAEKIBAOYiRAPwihANkD9noqFb9UCxM2sMQBCiAUZBiIZuqUID8DMhGgDgaqfV9kfH1geAN4RogPyt20PozL6lBeAyIRogfyv2EDpRX2ullRuAtwjRAAAftmddAHhXrKrKogBkKs6+r1u5X3Tz9rHDRcnx2Us+99rfbq0TfHZdhTa0D4D3qEQD5O2O/YNOqEID8EFCNADA25yFBuBKQjRA3kzmhvapQgNwJSEaIG/auaFdqtAAXEuIBgD4hSo0ANcSogHyphIN7XmuCg3ATYRogLw5Ew3tUYUG4EZCNABACE+q7Y+OrQMANxGiAYDSXYQQdktfBADmI0QD5E07Nyxvv9r+6Mw6AjAPIRogbyv2D5ZSX2nlLDQAcxOiAYCS7dh9AG5DiAYASmWYGAC3JkQDZCrOnjoPDYu7UIUGYBFCNEC+7tg7WNhetf3RueUD4LaEaACgNM+r7Y/27ToAixCiAYCSaOMGYClCNEC+1uwd3NqeO6EBWIYQDZAvIRpu53m1/bE2bgCWIkQDACXQxg1AK4RoAKAEO9X2x9q4AViaEA0AjN2javvjI7sMQBuEaIB8rds7uNHLEMKuZQKgLUI0QL7u2Du40Va1/fG5ZQKgLUI0ADBWv6+2Pz6xuwC0SYgGAMboieusAOiCEA0AjM1L11kB0BUhGiBfa/YO3nPhHDQAXRKiAfK1au/gPbvOQQPQJSEaABiL+j7oA7sJQJeEaABgDE6r7Y+dgwagc0I0AJC7+hz0pl0EoA9CNACQs1cB2iAxAPoiRANkKM6erts3eMUgMQB6JUQD5OmOfYPwB4PEAOibEA0A5KiexL1n5wDomxANAOTGJG4ABiNEAwA5OTWJG4AhCdEAQC7qSdw7JnEDMCQhGiBPBotRmjdXWZnEDcCghGiAPLniitK4ygqAJAjRAEDqPneVFQCpEKIBgJT9XoAGICVCNACQqvou6H27A0BKhGgAIEWP3AUNQIqEaAAgNQI0AMkSogHy5Iorxuq02v6NAA1AsoRogDy54ooxOq3vgrazAKRMiAYAUvAqQFfbvzm3GwCkTIgGAIYmQAOQDSEaABiSAA1AVoRoAGAoAjQA2RGiAYAhCNAAZEmIBgD6JkADkC0hGgDokwANQNaEaIA8bdg3MiRAA5A9IRoA6IMADcAoCNEAQNcEaABGQ4gGALokQAMwKkI0ANCVRwI0AGPzazsKAHTgUbX9mx0LC8DYqEQDAG0ToAEYLSEaAGiTAA3AqAnRAJmJs6d37BmJEqABGD0hGiA/6/aMBH0uQANQAiEaAFhWHaAPrCIAJRCiAYBlCNAAFEWIBgAWcSFAA1Ai90QDALdVB+jNavs3J1YOgNKoRAMAt9EE6E8EaACKJEQDAPMSoAEonhANAMzjtL5eTYAGoHTORAPk5449o2enTQX63MIDUDqVaID8rNszeiRAA8AlQjQAcJVHAjQAvE07NwDwIY+q7U92rAwAvE0lGgB4lwANAFcQogGAy34vQAPA1bRzAwBvfF5tf3JgNQDgairRAEAQoAFgPirRAFC2ixDCVrX9yXHpCwEA8xCiAfKzZs9oyUVzhdWJBQWA+WjnBsiPEE0bBGgAWIAQDQDlOa3/MEaABoDbE6IBoCynTQX63L4DwO0J0QBQDgEaAJZksBgAlOFRtf3Jjr0GgOWoRAPA+AnQANASIRoAxu3fBGgAaI92boD8uOKKeX1ebX9yYLUAoD0q0QD5WbVnzOHzavu3AjQAtEyIBoBxuRCgAaA72rkBYDwuXl9h9dsTewoA3VCJBoBxEKABoAdCNADk76UADQD90M4NAHk7bQL0uX0EgO6pRANAvgRoAOiZEA2QkTh7umm/aAjQADAA7dwAkJ9H1fZvd+wbAPRPJRoA8iJAA8CAhGgAyIcADQADE6IBIA//JkADwPCciQaA9H1ebf/2wD4BwPBUogHysma/iiNAA0BChGiAvAjRZRGgASAxQjQApEmABoAEORMNAGm5CCFsVtu/PbEvAJAelWgASIcADQCJE6IBIA0CNABkQIgGyIvBYuMkQANAJoRogLwI0eMjQANARoRoABjOSwEaAPJiOjcADOP0dYDeOLf+AJAPlWgA6J8ADQCZEqIBoF8CNABkTIgGyMuG/cqaAA0AmROiAaAfAjQAjIAQDQDdE6ABYCSEaADolgANACMiRANAd14H6IkADQBjIUQDZCLOnm7aq6wI0AAwQkI0ALRPgAaAkRKiAaBdAjQAjJgQDQDtEaABYOSEaIB8rNmrpAnQAFAAIRogH0J0ugRoACiEEA0AyxGgAaAgQjQALE6ABoDCCNEA+dDOnZaLEMKWAA0AZRGiAfIhRKfjoqlAn5W+EABQGiEaAG7nTYA+sW4AUB4hGgDmJ0ADQOGEaIB8aOcelgANAAjRABlZtVmD2hGgAQAhGgBu9nk12TiyTgCAEA0A1/u8mmweWCMAIAjRAHmIs6frtmoQvxegAYDLhGiAPNyxT717VE029wv7zgDADYRoAHhfHaB3rAsA8C4hGiAPrrfqzxMBGgC4ihANkAchuh+n9VVWJXxRAGAxQjQAvFYH6M1qsnluPQCAqwjRAHkwWKxbF3UFWoAGAG4iRAPkwRVX3bloKtAnY/2CAEB7hGgASrcjQAMA8xKiAfKgnbsbn1eTzaMxfjEAoBtCNEAe7tqn1v1bNdk8GNl3AgA6JkQDUKJH1WRz184DALcVq6qyaAAJi7OndSv3f3/4DWOHLz7aZ59Wk02D2gCAhahEA6RP4GvPq7ugx/JlAID+CdEAlMJd0ADA0oRogPSt2aNWbLnKCgBYlhANkD4henn1VVbHuX8JAGB4QjQAY/fIVVYAQFuEaID0GYS1uOfVZHMn15cHANIjRAMwVvUk7i27CwC0SYgGSJ8z0bdnEjcA0AkhGiB9q/bo1nZM4gYAuiBEAzA2f6gmm0d2FQDoghANkLA4e2qo2O3Uk7j3cnphACAvQjQAY1EPEtu1mwBAl4RogLSt25+5NIPEPjVIDADolBANkLY79mcudYA2SAwA6JwQDZA211vd7A/V5FODxACAXgjRAGkToq/3vJp8apAYANAbIRogbdq5r1afg95K9eUAgHESogHSdtf+XGnTIDEAoG9CNECi4uypKvTVfm+QGAAwBCEaIF2ut/qwJ9Xk0/0UXwwAGD8hGiBdKtHve1lfZ5XaSwEA5RCiAdKlEv2+LeegAYAhCdEA6VKJfptz0ADA4IRogHSpRP/iuXPQAEAKhGiAdK3Zm1fcBw0AJEOIBkjXqr15xTloACAZQjRAguLsqSr0a/9WTT49TuFFAACCEA2QLCE6hNNq8uluAu8BAPAzIRogTYaKuQ8aAEiQEA2QptKvt3KdFQCQJCEaIE2bBe+L66wAgGQJ0QBpKrUSfaGNGwBImRANkKa7he7LbjX59CyB9wAA+CAhGiAxcfa01KFiT6rJpwcJvAcAwJWEaID0lNjKrY0bAMiCEA2QnhKHiu1Uk0/PE3gPAIBrCdEA6VkrbE/qNu6jBN4DAOBGQjRAekoK0dq4AYCsCNEA6dkoaE+0cQMAWRGiARISZ09LqkI/18YNAORGiAZISykhWhs3AJAlIRogLaVM5t6rJp+eJfAeAAC3IkQDpKWESnTdxr2fwHsAANyaEA2QlvUC9mM3gXcAAFiIEA2Qlrsj348/VJPPThJ4DwCAhQjRAImIs6djr0K/DCFo4wYAsiZEA6Rj7CF6t5p85k5oACBrQjRAOsY8VOxJNfnMndAAQPaEaIB0jPV6qwvDxACAsRCiAdIx1nbu/WrymTuhAYBRiFVV2UmAgcXZ07qV+79u/xaxwxdv5dkvq8lnJdx9DQAUQiUaIA1jrULvJPAOAACtEaIB0jDGEP28mnx2nMB7AAC0RogGSMMYh4qpQgMAoyNEA6RhbJXoPxgmBgCMkRANMLA4e1oH6JUR7UN9pdV+Au8BANA6IRpgeGOrQu9Wk8/OE3gPAIDWCdEAwxtTiK6vtDpI4D0AADohRAMMb0xDxQwTAwBGTYgGGN7dkeyBK60AgNETogEGFGdPx1SF3k3gHQAAOiVEAwxrLCH6UTX57CSB9wAA6JQQDTCssYTovQTeAQCgc0I0wLDGMJn7D9Xks7ME3gMAoHNCNMBA4uxpHaBXMl//ixDCfgLvAQDQCyEaYDhjaOXeryafnSfwHgAAvRCiAYaTe4hWhQYAiiNEAwwn9xCtCg0AFCdWVWXXAXrWnId+sfynxg5f/Npnv6wmn611+OEAAElSiQYYRu5VaFdaAQBFEqIBhpFziK6r0AcJvAcAQO+EaIBh5ByiVaEBgGI5Ew3Qs/bOQ4chzkQ7Cw0AFE0lGqB/WxmvuSo0AFA0IRqgf7m2cjsLDQAUT4gG6FGcPb0TQtjIdM33E3gHAIBBCdEA/cq1Cn0RQlCFBgCKJ0QD9CvX89D71eSz8wTeAwBgUEI0QL9yrERfaOUGAHhNiAboSXO11WqG660KDQDQEKIB+pPreWhnoQEAGkI0QH92MlzrR9Xks7ME3gMAIAlCNEAP4uzpWgjhboZrvZfAOwAAJEOIBuhHjlO5n6hCAwC8TYgG6EeOrdwmcgMAvCNWVWVNADrUtHL/VzefELt68dNqcm+9q4cDAORKJRqgezm2cqtCAwB8gBAN0L3cWrlfVpN7rrUCAPgAIRqgQ5lO5RagAQCuIEQDdGs3w/XVyg0AcAUhGqBbuZ2HflRN7p0n8B4AAEkSogE6EmdP6wC9mtn6qkIDAFxDiAboTm5V6Ppaq5ME3gMAIFlCNEAH4uzpnRDCw8zWVhUaAOAGQjRAN3IbKHbhWisAgJsJ0QDdyO1uaAEaAGAOQjRAywwUAwAYLyEaoH25tXI/ryb3zhJ4DwCA5AnRAC2Ks6frIYSNzNZUKzcAwJyEaIB2GSgGADBiQjRAS+Ls6VqG11oJ0AAAtyBEA7Qntyp0EKIBAG4nVlVlyQCWFGdP74QQ6uFcK/2uZVzmN59Wk3vr7b0LAMD4qUQDtGO3/wC9NFVoAIBbEqIBltRUobVyAwAUQIgGWF6OVegn1eTeeQLvAQCQFSEaYAlx9l2uVeijBN4BACA7QjTAcnKsQgchGgBgMUI0wIIyrkJr5QYAWJAQDbC4/Uyr0McJvAMAQJaEaIAFxNl3ayGEh5munVZuAIAFCdEAi9nPdN1Oq8m9swTeAwAgS0I0wC3F2XebIYQHma6bVm4AgCUI0QC3t5fxmmnlBgBYQqyqyvoBzCnOvtsJIXz19n86Drh8t/rsi2py70537wIAMH4q0QBzaq60yvUsdNDKDQCwPCEaYH67mV5p9YYQDQCwJCEaYA7NlVZfZr5WQjQAwJKEaID5HGS+TvV56JME3gMAIGtCNMANmmFiG5mvkyo0AEALhGiAa4xgmNgbQjQAQAuEaIDr7Wc+TOwNrdwAAC1wTzTAFeLsu80QwrOb1yf9e6Kryb0hXxIAYDRUogE+oGnjzn2Y2BvP03gNAID8CdEAH7YXQlgdydpo5QYAaIkQDfCOpo37ixGtixANANASIRrgkpG1cb9hMjcAQEuEaIC3jamNu3ZRTe6dJfAeAACjIEQDNOLsu62RtXEHrdwAAO0SogHG28YdtHIDALRLiAZ4rQ7QKyNcC63cAAAtEqKB4sXZd7shhAcjXQft3AAALYpVVVlPoFhx9t16COHFct8/Drh81392Nbk35MsBAIyOSjRQrBGfg37jeRqvAQAwHkI0ULL9EMLdEX9/56EBAFomRANFirPvdkIID0f+3YVoAICWCdFAcZpz0PsFfG/XWwEAtEyIBorSnIM+Gul1Vu9SiQYAaJkQDZSmHiS2WsJ3rib3hGgAgJYJ0UAx4uy7vRHfB/0uk7kBADogRANFiLPvtkIIXxa026rQAAAdEKKB0Yuzv62P/D7oDxGiAQA6IEQDoxZnf7vTBOgSBolddpLOqwAAjIcQDYxdPYn7boG7fJ7AOwAAjE6sqsquAqMUZ3+rK9APX3+32OFX7PLZi312Nbk35EsBAIyWSjQwSnH2t51fAnRxLvxUAwB0Q4gGRifO/rYZQviq4J11HhoAoCNCNDAqzSTuo8J31WRuAICOCNHAaDSTuI8KnMT9LiEaAKAjQjQwCk2APg4hrNpR7dwAAF0RooGxKPUqqw9xvRUAQEeEaCB7zVVWG3byZyrRAAAdEaKBrMXZ3/YLvsrqg6rJPZVoAICOCNFAtpq7oL+wg285TehdAABGR4gGstQE6JLvgr6KKjQAQIeEaCA7AvS1nIcGAOiQEA1kJc7+th5C2LdrV1KJBgDokBANZKMJ0PVd0Ct27Upnib4XAMAoCNFAFgTouQnRAAAdEqKB5AnQt6KdGwCgQ7GqKusLJKu9AB07/IpdPvt2n11N7g35MgAAo6cSDSRLBRoAgNQI0UCSBOiFPM/wnQEAsiJEA8kRoAEASJUQDSRFgF7KScbvDgCQBSEaSIYAvTSTuQEAOiZEA0mIs78K0MsTogEAOiZEA4MToFujnRsAoGNCNDAoARoAgJwI0cBgBOjWnY3s+wAAJEeIBgYRZ3/dEqDbVU3uCdEAAB0TooHexdlfd0IIhwI0AAC5EaKBXjUB+iur3rrTkX0fAIAkCdFAb+Lsr7sCdGdcbwUA0INfW2SgD3H214MQwkOLDQBAzlSigc4J0L04LuA7AgAMTiUa6Eyc/fVOCOEohLBhlQEAGAMhGuhEE6Dr6uhdKwwAwFho5wZaF2d/XQ8hnAjQvdLODQDQA5VooFVNgD52BzQAAGOkEg20prkDWoAGAGC0YlVVdhdYWhOgl7wDOna4Ebk+e77vVU3uDfkSAADF0M4NLM0VVgAAlEKIBhbWTOCuA/QDqwgAQAmEaGAhcfbXteYOaBO4h3da+gIAAPRFiAZuzQTu5JyXvgAAAH0xnRu4lTj71gRuAACKJUQDc4uzb/eaCdwCdFpUogEAeqKdG7hRnH1bDxDbN4E7WSelLwAAQF+EaOBacfatAWIAANAQooErxdm3BogBAMAlzkQDH9QMEHshQGdBOzcAQE9UooH3xNm3B84/Z8VgMQCAngjRwM+aAWLHzj8DAMCHaecGXmnOP58J0AAAcLVYVZXlgcI155+/mn8VYkcL1tVzc84CFakAACAASURBVH72zd+rmtwb8gUAAIqinRsK5v5nAAC4HSEaCuX+ZwAAuD1noqFAcfbtVnMtkgANAAC3IERDYeLs270QwqH7n0fjeekLAADQJ+3cUIjm/HPdvr1hzwEAYDFCNBSgub7qWPUZAACWo50bRi7Ovt0NIbwQoAEAYHkq0TBSTfv2QQjhgT0etZPSFwAAoE9CNIxQnP1lPYRYn39etb+jd176AgAA9Ek7N4xMnP3lTfu2AA0AAC1TiYaRiLO/aN8GAICOqUTDCMTZXzabs7ECdHm0cwMA9EiIhszF2V/2QgjPtG8Xy2AxAIAeaeeGTDXt2/XwsA17CAAA/VCJhgzF2V+2QghnAjQAAPRLiIbMxNlf9kMIhyGEFXsHAAD90s4NmXh99/Or6dt37RmXnFkMAID+qERDBpq7n48FaN5VTe4J0QAAPVKJhoS5+xkAANIiREOimrufj5x9BgCAdGjnhgTF6avhYc8EaAAASItKNCQkTg0P41ZeWi4AgH6pREMi4tTwMG7NUDEAgJ6pRMPA4vTV8LD67POGvQAAgLSpRMOA4vQvW001UYAGAIAMqETDAOL0z83VVdHVVQAAkBGVaOhZnP65vrrqxN3PAACQH5Vo6ElTfd4LIXxhzWnJsYUEAOiXEA09iNM/rzfDw1atNwAA5Es7N3QsTv9cV59fCNAAAJA/lWjoSFN9PnDvMwAAjIdKNHTgUvVZgAYAgBFRiYYWxemf15qzz8IzfTi3ygAA/VKJhpbE6Z93m6urBGj6cmKlAQD6pRINS2qqz/XZ5w1rCQAA46YSDUu4VH0WoAEAoAAq0bAA1WcAACiTSjTckuozAACUSyUa5qT6TIJM5wYA6Fmsqsqaww2a6nN99/NKu2sVF/pLSz97aV09O8d37vrZV6sm94f5YACAgqlEwzXi9Ju1EKLqMwAA8Ioz0XCFOP3G2WcAAOAtKtHwjjj9Zr05+3zX2gAAAJepRMMlcfpNfe75hQANAAB8iEo0qD4DAABzUommeKrPZOq5jQMA6J9KNMWK0282Qwj7wjMAADAvIZrixOk3d5o7n7+w+wAAwG0I0RSlqT7XZ59X7TwAAHBbQjRFaKrPdev2QzsOAAAsSohm9OL0m62m+rxitwEAgGUI0YxWU32uw/MDu8wIndtUAID+ueKKUYrTb3ZDCGcCNCN2YnMBAPqnEs2oxOk3a031ecPOAgAAbVOJZjTi9Ju9pjonQAMAAJ1QiSZ7cfqn9RBiXX2+azcBAIAuCdFkK07/VA8Oq88+f2kXAQCAPgjRZClO/7TZnH1etYMAAEBfhGiy0lSf67PPX9g5CueKKwCAAQjRZCNO/7TVVJ9X7Bq44goAYAhCNMmL0z/V11btu/MZAAAYmiuuSFqc/mm3qbgJ0AAAwOBUoklSU30+cOczAACQEpVokhOnf6oHh/2XAA0AAKRGJZpkNNdW1Wef79oVAAAgRUI0g3NtFQAAkItYVZXNYjBN9bk++7y63DvEDr/CQM9e+mNzXJMR7mNHqsn9/j8UAACVaIbRVJ8PTN0GAAByYrAYvYvTP+2EEM4EaAAAIDcq0fTGtVUAAEDuVKLpRZx+vRtCOBGgAQCAnKlE06k4/Xq9qT67tgoAAMieEE0n4vTrenBYXX3+0goDAABjIUTTujj9uqVrq4ArXFgYAIBhCNG0pqk+74UQvrCq0KkTywsAMAwhmlbE6ddbTfV5xYoCAABjJUSzlKb6fODOZwAAoASuuGJhcfr1TgjhTIAGAABKoRLNrcXp12tN9dmdzwAAQFFUormVOP16txlqJEADAADFUYlmLnH69XoIYV94BgAASqYSzY3i9Ov62qoXAjQkwxVXAAADUYnmSk31uT77fNcqQVLObQcAwDCEaN7TXFtVn33+0uoAAAD8QojmLXH69WZTfV61MgAAAG8TonklTv+9rj7vhRC/sCIAAAAfJkRTB2jVZwAAgDkI0QX7pfocVJ8BAADmIEQXSvUZAADg9oTowqg+wygc20YAgGEI0QVRfQYAAFiOEF0A1WcAAIB2CNEjp/oMAADQHiF6pFSfAQAA2idEj5DqMwAAQDeE6BFRfQYAAOiWED0Scfrv6031+W7pawEFOLPJAADD+JV1z1+c/ntdfX4hQEMZqsl9IRoAYCAq0RlTfQYAAOiXSnSm4vTfd0MIxwI0AABAf1SiMxOnT+6EEI9CCBulrwUAAEDfVKIzEqdPtpqBQgI0AADAAFSiM/C6+hz2QwgPS18LAACAIQnRiYvTJ5vN8LDV0tcCAABgaNq5ExanT+qrq54J0MAlzy0GAMBwVKITFKdP1kIIRyZvAwAApEUlOjFx+mQnhHAiQAMAAKRHJToRhocBAACkT4hOQJw+WW/at519BgAASJh27oHF6ZPdEMILARoAACB9KtEDadq366urHhS5AAAAABkSogegfRtYwonFAwAYjnbunmnfBpZ0bgEBAIajEt0T7dsAAAD5E6J7oH0bAABgHLRzd0z7NgAAwHioRHekad/eDyE8HOUXBAAAKJAQ3YE4PVoPIdbnn++O7ssBAAAUTDt3y+L0aCuEcCxAAx1xxRUAwICE6BbF6dFeCOEwhLAymi8FpMYVVwAAA9LO3YI4PXJ9FQAAQAFUopf0+vzzq/ZtARoAAGDkVKKXEKdHm839z9q3AQAACqASvaA4PdoJITwToAEAAMqhEr2AOD06cP8zAABAeWJVVbZ9Ts0Asbp9e+Pm3xG7fBPPLuHZSy9XjuvtZ+Qm1eR+fx8GAMB7tHPP6dIAsTkCNAAAAGOknXsOlwK0888AAAAFU4m+QTNATIAGAABAJfo6TYD+Kt03BAAAoE9C9BVM4AYAAOBd2rk/QIAGEvXSxgAADEsl+pLbXWEF0LszSw4AMCwhutEE6HqA2N0kXggAAIDkaOcWoAEAAJhT8SH60h3QAjQAAADXKrqdO06PNpsz0O6ABgAA4EbFVqLj9LC+A/qZAA1kxGAxAICBFVmJjtNDV1gBORKiAQAGVlSIjtPDeoBYHaAfJPA6AAAAZKaYEN0EaAPEAAAAWFgRZ6Lj9LCewH0iQAMAALCM0VeimwB9bIAYAAAAyxp1JVqABkbGYDEAgIGNNkQ3V1i9EKCBERGiAQAGNsoQ3QTorxJ4FQAAAEZkdCFagAYAAKArowrRAjQAAABdGk2IFqABAADoWqyqKvtFXjxAxy5ex7M9u51nL/2xOe6ln7/rVJP7/XwQAABXyr4SrQINAABAX7IO0XF6uCVAAwAA0JdsQ3ScHq6HEA4SeBUAAAAKkWWIbgL0cQhhJYHXAQAAoBDZheg4PVwToIECndp0AIDhZRWi4/TwTgjhSIAGCnRu0wEAhpdNiG4CdF2BvpvA6wAAAFCgnCrR+wI0AAAAQ8oiRMfpYR2gHybwKgAAABQs+RAdp4c7IYQvEngVgCGdWH0AgOElHaLj9HF9ldVXCbwKwNAMFgMASECyITpOH78ZJAYAAABJSLkS7S5oAAAAkpJkiI7TxwcmcQMAAJCa5EJ0nD7eMYkb4D2OtwAAJCCpEN0MEttP4FUAAADgPcmE6GaQ2JFz0AAAAKQqpUp0fQ56NYH3AAAAgA9KIkQ356AfJPAqAKk6szMAAMOLVVUN+hLNOehrrrOKXX66Z3t2us9e+ivluCZ+tq9STe53/yEAANwohUr0gXPQAAAA5GDQEB2nj/fcBw0AAEAuBgvRcfp4M4TwpZ8UAAAAcjFIiG6uszrwUwIwl+eWCQAgDUNVovdcZwUAAEBueg/RTRv3F35SAAAAyE2vIVobNwAAADnruxK9q40b4NZOLBkAQBp6C9Fx+njdNG6AhZxbNgCANPRZid635wAAAOSslxAdp4/rNu4NPykAAADkrPMQ3QwT2/NTArAwZ6IBABLRRyW6buNeseEAC3MmGgAgEZ2G6OZO6Ic2GwAAgDHouhKtjRsAAIDRiFVVdfJd4vTxTgjhqxae1MbreLZn5/fspb9SjmviZ/tDqsn9bj8AAIC5dVmJVoUGAABgVDoJ0XH6uA7Qq35UAAAAGJPWQ3RzpdWunxKAVlxYRgCAdHRRid51pRVAa9wRDQCQkFZDdJw+XlOFBgAAYKzarkTvqUIDAAAwVq2F6KYK/dBPCkCrtHMDACSkzUq0K60A2nduTQEA0tFKiI7TmSo0AAAAo9dWJVoVGqAbKtEAAAlZOkTH6eyOKjRAZ5yJBgBISBuVaFdaAQAAUISlQnRThRaiAQAAKMKylegd90IDdKea3D+2vAAA6Vg2RKtCAwAAUIyFQ3Sczuoq9KofFQAAAEqxTCV6x08JQKdOLS8AQFoWCtFxOlsPIWzYS4BOuSMaACAxi1ainYUGAACgOLcO0c21Vlt+VAA6d2KJAQDSskglesu1VgC90M4NAJCYRUK0Vm4AAACKdKsQ3QwUu+tHBaAX2rkBABJz20q0KjRAf7RzAwAk5rYh2kAxAAAAijV3iI7TmYFiAP3Szg0AkJjbVKJ3bB5Af6rJfe3cAACJmStEN3dDP7B5AAAAlGzeSrSz0AD9em69AQDSI0QDAADAnG4M0Vq5AQbhPDQAQILmqUSrQgP0z2RuAIAECdEAAAAwp2tDtFZugMGcWXoAgPTcVInetGcAgxCiAQASdFOI1soNAAAADSEaIEHV5P6xfQEASM+VITpOZ+shhBV7BgAAAK9dV4lWhQYYxkvrDgCQputCtKFiAMMwVAwAIFHXhegNmwYAAAC/+GCIjtOZVm6A4RgqBgCQqKsq0Vq5AQAA4B1CNEB6TuwJAECargrRd+0XwGDOLT0AQJreC9FxOlOFBhiWEA0AkKgPVaKFaIABVZP72rkBABIlRAMAAMCcPhSi1y0ewGCeW3oAgHS9FaLjdLYWQlixXwAAAPC+dyvRqtAAw3IeGgAgYUI0QFpM5gYASNi7IdpQMYBhqUQDACRMJRogLSrRAAAJ+zlEx+nsjqFiAIM7swUAAOm6XIlWhQYYWDW5L0QDACTscoh2HhpgWC+tPwBA2i6H6Dv2CmBQqtAAAInTzg2QDiEaACBxv770ekI0wLCEaADglXj4n3c+kNHOqt/9b/+8MLDLIdpkboBh+R9FABipePgfayGEy78uh+T6/1/95ZvHKxchHv7nu//WRQjhpPm/z5pf582/J3R34FWIjtOZoWIAw/M/cgAwAvHwPzabgLzeBOSNDr/VyqXnv/c5Teg+bf454ySEeFz/a/W7/3XuZ20xv+7ioQAsRIgGgMw0FebN5lcdmu8m+A3uNr8ehBC+DK/e+x/1rSDHTcX6uPrd/zq5+TGESyFaJRpgYO6IBoD0xcPTO6/zU9xqctRqpttWv/fD5lcdquu28KMmWB+pVF9NJRogDaf2AQDSFA9P31Sbt5pq7hitXArVX8XDf9T/bHLQBGp/0H+JSjRAGvxpLwAkpKk4b408OF+nbv/+Y/1LoH6bSjRAGpxDAoAExMPTusC486bNmVcuB+onTZg+KHVp3oRod0QDDEslGgAG0lSd6+C8m/EZ577UVfkH8fAf+yGE+tdBadXpXzX/6o5ogGEdW38A6Fd91jkenh40N2T8UYC+lZVm0vd/xcN/HMTDfxRzRFg7N0AaVKIBoCdatlv3aiBZPPzn8xDCXvW7fxl1cSCG/zutf4CetfGobnT13C7f2bM9u4VnL/2xOe5luT9/1eR+ly8IAPwSnvdCCBvLr4d/br7m2aMO0yrRAMN7aQ8AoDvNFVX7hU7ZHkL9hxTPxlqZFqIBhlf8VREA0IVmYNi+tu3BvAnT9UTv3ep3/zKKf+b5lcncAINzvRUAtCwenuw1f1AtQA/vwesBZP/ci4f/vJP7l6lDdPZfAiBzhooBQEvi4clmPDw5ayZHu4UoLfWenMXDf27l/CW0cwMMz/VWALCkeHiidTsP9R9sHDbnpXdybPH+1Rz/GQC65Uw0ACwhHp5sad3OTn1e+iQe/nM3txdXiQYYWDW5L0QDwAJUn7NXV6X/2LR3Z1OVrivRmwm8B0CpTu08ANxeffa5Gc4pQOfvTVU6i7PS2rkBhqUKDQC31EzefhZCWLV2o/HmrPRB6hO8hWiAYbneCgDmVLdvx8OT42bKM+NUdxYcx8N/rqX67YRogGGpRAPAHOLhyXrzh88b1mv07qbc3i1EAwxLiAaAG8TDk53mSkjt2+V40969l9o3FqIBBlRN7rsjGgCu0Zx//qoJVZTny/qcdErfWogGGM5Law8AV4uHJwfOP1Ofk46HP53Ew5+SGDgmRAMMRys3AHxAM0DM9VVcdvf1wLHhg7QQDTAcrdwA8I46QDf/G3nX2vCO+mfiLB7+tD7kwgjRAMNRiQaASwRo5rDSVKQHC9JCNMBw3BENAA0BmlsYNEgL0QADqSb3hWgAEKBZzGBBWogGGMapdQcAAZqlDBKkhWiAYTgPDUDx4uELAZpl9R6kf+VMHsAg/L0XgKIJ0LSoDtJHfV1/VYfoc7sH0DvXWwFQugMBmhat9nWPtHZugGFo5wagWPHwRR2gH/gJoGX1H8ocdb2oQjRA/y6qyX0hGoAixcMXuyGEh3afjmzEw58OulxcIRqgf85DA1CkePhiM4TwR7tPxx7Gw592u/qIXzmXB9A7f98FoDjx8MV6H6220PhjPPxps4vFUIkG6J9KNABFaSZxHzRTlKEvnUzsFqIB+idEA1CafZO4GcBKFx2A7okG6JehYgAUJR6+2DFIjAHdjYc/7bf58b+q/nXinmiA/viDSwCKEQ9frDVVaBjSF22ej9bODdAvQ8UAKMmRc9AkorXz0W9C9HM7C9ALlWgAihAPX+w5B01CVprhdktTiQbolxANwOg111l9aadJzIN4+NPWsq/0JkT7hzqA7hkqBkApWqn4QQcOlm3rfhOiDRcD6J7z0ACMnjZuErey7LA7lWiA/vh7LQCj1kzj3rXLJO7hMtO6VaIB+qMSDcDY7ZvGTSYWPnKgEg3QH3+vBWC04uGLurL3wA6TidV4+NNCXROvQnT1rxOVaIBunVaT+/5eC8CYGSZGbvYWGTJ2+Yord0UDdEcVGoDRiocvdurKnh0mM/XRg73bvvLlEO3aFYDuOA8NwCjFwxd3lp12DAP6Ih79v7XbfLwQDdAPIRqAsdo1TIzM3aoafTlE+wc8gG5cVJP7/qASgNFpqtCutCJ3D29TjVaJBuieP6QEYKxUoRmLuavRP4fo/9/e3SS3caRpAM6aC1g3MLeWPCGqL9B0hOW/XpgQsG/qBK0btHSCkU4w5B4TIO05gHgBi/TGyyFvQJ6gJgpIUKAIkiigAFRlPk+Ewr9KglUElG99X2aWg74QDbAeQjQAyVGFJjELV6P/44t/tkM3QPOEaABSpApNahaqRn8Zoh3BAtCsaj20z1YAUnTgrpKYharRQjTAeqlCA5Ac50KTsEcfDgnRAOslRAOQImuhSdWjP9u3QnQ56AvRAM0SogFISjH6tBtCeO6ukqiviuO/HqxGf1mJDjYXA2iM9dAApEgVmtQ9+DM+L0Sb8AE0QxUagKTEY6323VUS97w4/mv3vm9xXog26QNoxrHrCEBi9h1rRSbubekWogHWx+cpAKnRyk0uFg/R5aB/FUI496MBsJLLsv/9hUsIQCqK0acdG4qRkWqDsblLF+ZVooN10QArU4UGIDXWQpObWiHa5A9gNT5HAUjNg8f+QIJqhWib4QCsRogGIBlaucnU3JbuuSHaumiAlVgPDUBqtHKTq8VCdKSKArAc3TwApGbPHSVTd372HwrRJoEAy/EQEoDU/OqOkqmvi+O/dme/9XtDdDnoV5PAaz8pAPWU/e89hAQgGcXoD63c5O5WNfqhSnRQTQGo7cQlAyAxWrnJXa0QrZoCUI+HjwCkRogmd7eWM6hEAzTLw0cAklGM/njiaCsIoTj+6+Zh0oMhuhz0Lxx1BbCwc0dbAZCYXTcUxm7eC49VoiuHrhnAQlShAUiNVm6YWKwSHZkUAizG5yUAqRGiYWLxSrSWboCFXJb9789cKgASo50bJqrzoqs9AhaqRAct3QCPUoUGIClxU7Gv3FW4MX6otGiINjkEeNh71weAxKhCw23j5Q0LhWgt3QAPsis3ACmyHhpu2wk1KtFBlQXgXpa8AJCiJ+4q3FI7RGvpBpjP5yMAKdLODbfVWhNdtXRfhRBOXESAW060cgOQqB03Fm4Zb7RXpxIdtCwC3KEKDUCqvnZn4bbi+K+9oizLWpelGP7Pxfw3VLGmy7uucY1t7JaPvfK31MVr0rnXfF32X1ovBkByitEfVRX6/z5/X+afxk547KLW2N/VrUQH1WiAG6rQAKRKKzfMtytEAyzPqQUAAHl5UjtExzOjbTAG5O687L88y/0iAJAsO3PDPZapRAfVaABVaACSZs8PmG+pdu6qGl2tA7x0UYFMXVsPDQCQpfrt3DNUYYBcHZf9l1fuPgBAflYJ0YexGgOQm7fuOACJ23ODYb6lQ3Q56F9ZGw1k6LTsv7xw4wEA8rRKJTpo6QYy5OEhAEC+VloTPT3u6sgPEJCJy7L/UogGAMjX81Ur0cHaQCAjAjQAQOZWDtGxGn2a+4UEsmAJCwBA5pqoRAfVaCADR461AgDI3mUjIboc9D+qRgOJ87AQAICLpirRwQQTSJhjrQAAGGssRJeDV6rRQKo8JAQgN2fuOMzXZCU6mGgCCaqq0B/dWAAyYx8QuEejITpWo09cbCAhHg4CAHCj6Up05Y3LCyRCFRoAgFkfGw/R5eBVtfnOkcsMJODQTQQgU9ZEwz3WUYkOsRp97aIDHVZVoYVoAHJlTTTcYy0huhy8qt507110oMOshQYgZ0I0zNd8O/eMKkRfuvBAB1kLDUDWyt7ftHPDPdYWomM1WiUH6CKfXQBgeSbMc7bOSnQVpKv1hKcuPdAhqtAAMKEaDV8o97+5WmuIjhx5BXTJgbsFAGPWRcNt4wLx2kN0OXhVPcH64OIDHXBU9l9euFEAMKYSDbeNHyxtohId4vpCayqANrvWOQMAtwjRcNv4PbGREB03GdMiCbTZ27L/UtsaAHymOwtu21yIDpMgfWyTMaClzsv+S2fbA8AMx1zBHZsN0dGBtm6ghbRxA8B8imAwcV3ufzPuzthoiC4Hry6cvwq0zJEjrQDgXqrRMHHzXth0JboK0u890QJawmZiAPAwD5ph4ua9sPEQHWnrBtrgwGZiAPAglWiY2G6I1tYNtMBJ2X957EYAwP3K3t+qefulSwRbbOee0tYNbNG1Y/cAYGFausndebn/zU334tZCdLSvrRvYAm3cALA4IZrc3XoPbDVEl4NXV6pBwIYdaeMGgFqEaHJ3a+647Up0FaSrF/Rh268DyMKl3bgBoJ64LvrcZSNT1fnQ7alEz3jrjQlswL42bgBYimo0ubrzs9+KED3T1m19NLAur8v+S8d0AMByDl03MnVnGWBbKtFVkD7TZgmsSbUO2h/+ALCksvfizFFXZKq9ITpMgnQ1yT1qwUsB0nHuAR0ANMLGnOTmZPZoq6lWhegwCdIH1kcDDamWiOyV/R+sgwaA1enqIjdzHxy1LkRHzo8GViVAA0CDtHSToe6E6HLw6iIGaYBlvSn7P9hIDACapRpNLo7mtXKHFleiqyBdbSX+ugUvBeie12X/B3/IA0Dz/PlKLu7dA6C1ITrYaAxYzjsBGgDWo+y9qDpGT11eEndZ7n/TzRAdxkG6d+CNCizoqOz/8NbFAoC18rCa1D34M976EB3t27EbeEQVoA9cJABYr7L34tAGYySu+yG6HPSu7NgNPECABoDNUo0mVdWGYhcPfW9dqURXQbr6RvYEaeALHwRoANi49y45iXr0AVFnQnSYBOnquBqTZWCq2oX7jasBAJtV9l5c2QCYBJ2W+998fOzb6lSIDpMgfezoK8AxVgCwdTbzJDUL/Ux3LkSHSZA+FKQhawI0AGxZPO5KNZpULFSFDl0N0eFzkPamhfwI0ADQHqrRpGLhn+XOhujw+QxpQRrycSRAA0B7qEaTiIWr0KHrIToI0pATx1gBQDupRtN1tX6GOx+igyANORCgAaClYjX6g/tDR9WqQodUQnQQpCFlAjQAtF9Vybt2n+ig2selJhOigyANKRKgAaAD4rnR790rOuao7D09q/uSi7Isk7vRxXBUbTz0zwX+z3W+CmMbe7WxV/6yXbyXt8YVoAGgY4rRp6q1++t6r9r809hbGbvqnNgpe0+v6v7GpCrRUyrS0HnvBGgA6CR/ftMVb5cJ0CHVSvRUMRxVLSX/euD/WOdXN7axVxs730q0c6ABoMOK0afjEMKvi38H5p/G3vjY52Xv6e6yvznJSvRUOehVi8Rft+PVAAsQoAGg+w5sMkbLrdQxkXSIDpMgfShIQ+tdC9AAkIa4yZi2btrq3TKbic1Kup17VjEc7YUQqtaSrz7/ay0Yxm7x2Pm0c1cBeq/s/7jShxkA0C6Lt3Wb2xp7Y2Ov1MY9lXwleqoc9KoDtPe0lkCrXArQAJAsbd20TSMdEtmE6DAJ0tVEfad6AtGClwO5q96HuwI0AKRJWzcts3Ib91RWITpMgvRVrEiftODlQK6OYgV6qWMFAIBuKHsvqpbuD24XW3Za9p6+beolZLMmep5iePzIEVgrjb6eYY2dz9jprol+V/Z/bOxDDABot2L06UkIoVpa+Xz+CzVHNPZax66WFOwseyb0PNlVomeVg/3pEVjWasD6Ve+zngANAHmZaes252Yb9psM0CH3EB0mQfowtndftuDlQKqmG4gdu8MAkJ+y9+LM+mi2oFoH/bHpL5t9iA6TIF29qautzk9b8HIgNSc2EAMA4vrod9lfCDblqMl10LOyXhM9T3PrpK2RMPaKY6exJtr6ZwDglrvnR5t/Grvxsc/HXZANt3FPqUR/Ia6T7lmzASup3j/fCdAAwBwHjpxlja7XGaCDED1fOdg/1t4NSzsd74DY/7Hx9ScAM07LaAAABqRJREFUQPfFjcb2FK1Yg7UH6KCd+3HF8LiqpP17id+5zldl7BzG7mY7t/ZtAGAhxejT7uToq+Kr9V0x88/Mxv5uHRuJ3XklQvTjiuFx9aSs2sX76xq/a52vyNg5jN2tEH05Pj7A5mEAQA2TIF1UoWdNQdr8M6OxX5e9p4crfYkFaedeQDnY/xjbu49a/2Jh8z7YfRsAWEY8+mrPxWNFGwvQQSW6vmJ4vB+r0o88LfP0yNgrjt3+SvR1rD5b+wwArKQYnVWbjf1381fR3DaDsTcaoINKdH1x07GdePYt5OrE5mEAQFPK3m4Vgl67oNS08QAdVKJX83BV2tMjY684djsr0dXa54Oy/5PwDAA0rvmKtLltwmNvJUAHlejVzFSlP3T5+4AFxbXPAjQAsB6xIv3C8Vc8YmsBOqhENyfu4P0+hPB8MqinR8Zecez2VKLPQwhvhGcAYFOK0Vk8/mrVXbvNbRMce6sBOgjRzYvnSr9x3p2xVx57+yG6egL8tuz/9H7VgQAA6opB+rjeMbNfMrdNaOxqbrpX9p5u/UQYIXoNiuHxTghFFab/uaavsM5Xb+y2jL3dEH0Uq89Xq74KAIBlFaOzJ7Ei/Xy5IcxtExn7MoRivw0BOgjR61UMT6oW7ypM/73ZL+RNlcXY2wnRp7H6rHUbAGiFGKTfL1egMv9MYOzzSQX6WWuKO0L0BhTDk4MYpldoRZnlTZXF2JsN0ZcxPG91fQkAwH2K0dmbEMJ/1btA5p8dH/uo7D07aHrQVQnRG1IMT55M1kqPf9kgwdiPj72ZEF2tLXlf9n96u+pXAwBYt2J0thfXSS84nzb/7OjY1+Olhb1nrSzwCNEb1kyYzv5NlcfY6w3R17Et6r11zwBAlxSjs50YpBdYJ23+2cGxqw7J/bL3rBXrn+cRorckhmlrO4y91H9acewPsXVbeAYAOqsYnVWddP9++PWbf3Zs7KNYgW71PFWI3rJieLIT10vXCNPesFmM3XyIPorh+WLVkQEA2iC2dx/ev/eQ+WdHxq66JA/K3rPjpb+tDRKiW6Jem7c3bBZjNxOitW0DAEmLu3dXRal/3f0+zT87MPZpDNCdKfQI0S2zWJj2hs1i7NUu13UIhfAMAGRjflXa/LPFY1+PuyR7z94v/a1siRDdYvcfjeUNm8XYy12ueFTVz46qAgCyc7cqbf7Z0rFPYvW5k8UeIboDiuHJXqxM/zp5td6wWYxd73KdTKrOP39c/TUBAHRbMTrbnSxpK/6+vm/E3HaJsS9jeO70nFWI7pC4CdmbEIqD1c+avo8Pg9aM/fi3dB1blqrwbLMwAIAvFKPzezo7m2BuW2PszrZuzyNEd1Qx/K36QNj/XJ1uig+D1ox9/3+qNl841LINALCYYnT+drENfOswt11w7Hfjok9HW7fnEaI7rhj+VlWnD+KvBp6w+TBozdi3/9NlrDofqjoDANRXjM5rnIazCHPbR8Y+itXn5OauQnRCiuFvuzOBeskPBh8GrRm7GLe9HMd27bMGvhgAQPaaC9PmtveMnWx4nhKiE1UMf9uP7d779T4cfBhseexpcD4uBz934rB5AIAumgnTS3Z0mtvOuI4buR2mHJ6nhOgMxEC9FwP1Ix8QPgy2MHbVqv1RcAYA2I64AVn1q8Zu3ua20+NVx/PY3rfJrHl+jBCdmdjyvRc/JJ7f/e59GGxo7PNJxbmogrNWbQCAFihG57uxOr1AN2fWc9uj8V49vW+zPF5ViM5YMfztyUyFem9SpRZ01zT2tNocK86/ZPOkDgCgi2J1+oHTcLKb255PWrbzqjrPI0RzY7LTd7EXA/Ve8+fpZfVBMxuaP5aDX+yoDQDQQXHt9P7dQJ3F3PY8nhBTBWfz2UiI5l7F8PdppXp35q92MJyvOrv5LIbmM6EZACA9M4F6L4Si5ga+dWxtbns97ZxUcb6fEE0txfD3KkjvzATrncUr1kmE6OsYlm9+lYNfrGkGAMhQMfpzd6aLc6+5UL3xue2kezLTNc51CdE0ohj+Pg3UO/ED5Mndjcs6FaKr1pWryQdKcTUTmD2NAwBgrmL0585MB+fu8p2ca5s3n4ZQfC4G9b5VDFqCEM1axZbw3cnXGK+3DvGfn8S/r3GMwENqr+2YhuHp07az+O8uysE/tGIDANCIGKx3ZubA0znxA/PglUL0afzr2eeiULgoe/9pjtsQIZrWKIb/O/2A+dLe46/x5oPmIv6adVUO/uEpGwAArVOM/pwpOo09CaHYfeR1fjnnFZI3JYTw/+RlP+YQt8HlAAAAAElFTkSuQmCC";

      if (htmlToSend) {
        var options = {
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          format: "A4",
          path: `${__dirname}/${filename}`,
          displayHeaderFooter: true,
          margin: { top: 80, bottom: 80, left: 60, right: 60 },
          headerTemplate: `<div style="text-align: center; width: 100%; font-size: 30px;"><img src="${logo1}" alt="Girl in a jacket" height="40"></div>`,
          footerTemplate: `<div style="text-align: center;  width: 100%; font-size: 30px;"><img src="${logo2}" alt="Girl in a jacket" height="30"></div>`,
        };

        let file = [{ content: htmlToSend }];

        html_to_pdf.generatePdfs(file, options).then((output) => {
          const file = `${__dirname}/${filename}`;
          res.download(file);
        });
      } else {
        res.json({ status: 200, hassuccessed: true, filename: filename });
      }
    }
  } catch (e) {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Something went wrong.",
      error: e,
    });
  }
});

router.get("/Getinstitutename/:house_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let house_name = "";
  if (legit) {
    Institute.findOne({
      "institute_groups.houses.house_id": req.params.house_id,
    }).exec(function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {

        if (data) {
          data.institute_groups.map((item) => {

            item.houses.map((item2) => {
              if (item2.house_id == req.body.house_id) {
                house_name = item2.house_name;
              }
            });
          });
          res.json({ status: 200, hassuccessed: true, data: house_name });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "House not found",
          });
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


router.post("/downloadPEBill", function (req, res, next) {
  // Custom handlebar helper
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
      // console.log("data",Data)
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

          if (req.body.type == "sick_leave") {
            var template1 = handlebars.compile(bill3);

            var htmlToSend2 = template1({
              bill2: bill2,
              admit: admit,
              pat_info: req.body,
              birthday: birthday,
              amt: userdata[0].amount
            });
          }
          else {
            var template = handlebars.compile(bill);

            var htmlToSend = template({
              bill2: bill2,
              admit: admit,
              pat_info: req.body,
              birthday: birthday,
            });
          }
          var filename = "GeneratedReport.pdf";
          if (htmlToSend) {
            var options = {
              args: ["--no-sandbox", "--disable-setuid-sandbox"],
              format: "A4",
              path: `${__dirname}/${filename}`,
              displayHeaderFooter: true,
              margin: { top: 80, bottom: 80, left: 60, right: 60 },
            };

            let file = [{ content: htmlToSend }];
            html_to_pdf.generatePdfs(file, options).then((output) => {
              const file = `${__dirname}/${filename}`;
              res.download(file);
            });
          }
          else if (htmlToSend2) {
            console.log(htmlToSend2)
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


router.get("/patientjourneyQue/:patient_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    newcf = [];
    var patient_id = req.body.patient_id;
    const VirtualtToSearchWith = new virtual_Case({ patient_id });
    VirtualtToSearchWith.encryptFieldsSync();

    virtual_Case.find(
      {
        patient_id: { $in: [patient_id, VirtualtToSearchWith.patient_id] },
        inhospital: false,
        viewQuestionaire: true,
      },
      function (err, data) {
        if (err & !data) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          if (data && data.length > 0) {
            const result1 = data.filter(
              (thing, index, self) =>
                index === self.findIndex((t) => t.house_id === thing.house_id)
            );
            forEachPromise(result1, GetAllQuestion).then((result) => {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "succefully find",
                data: newcf,
              });
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "succefully find",
              data: [],
            });
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
});

function GetAllQuestion(item) {
  return new Promise((resolve, reject) => {
    try {
      const VirtualtToSearchWith = new questionaire({
        house_id: item.house_id,
      });
      VirtualtToSearchWith.encryptFieldsSync();
      questionaire
        .find({
          $or: [
            { house_id: item.house_id },
            { house_id: VirtualtToSearchWith.house_id },
          ],
        })
        .exec(function (err, data2) {
          if (err) {
            resolve(newcf);
          } else {
            if (data2.length > 0) {
              newcf.push(data2);
              resolve(newcf);
            } else {
              resolve(newcf);
            }
          }
        });
    } catch (err) {
      resolve(newcf);
    }
  });
}

router.get("/patientjourney/:patient_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let Array_flat = [];
  if (legit) {
    flatArraya = [];
    Inhospital = [];
    InhopspitalInvoice = [];
    var patient_id = req.body.patient_id;
    const VirtualtToSearchWith = new virtual_Case({ patient_id });
    VirtualtToSearchWith.encryptFieldsSync();

    virtual_Case.find(
      { patient_id: { $in: [patient_id, VirtualtToSearchWith.patient_id] } },
      function (err, data) {
        if (err & !data) {
          res.json({ status: 200, hassuccessed: true, error: err });
        } else {
          if (data && data.length > 0) {
            forEachPromise(data, taskfromhouseid).then((result) => {
              //  var ansfromhousessid = ansfromhouseid(req.params.patient_id)
              // ansfromhousessid.then((result)=> {

              //   flatArraya.push(...result);
              flatArraya.sort(mySorter);
              res.json({
                status: 200,
                hassuccessed: true,
                message: "succefully find",
                data: flatArraya,
              });
              // })
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "succefully find",
              data: [],
            });
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
});

// router.get("/patientjourney/:patient_id", function (req, res) {
//   const token = (req.headers.token)
//   let legit = jwtconfig.verify(token)
//   if (legit) {
//     virtual_Case.find({ patient_id: req.params.patient_id, inhospital: false }, function (err, data) {
//       if (err & !data) {
//     
//         res.json({ status: 200, hassuccessed: true, error: err })
//       }
//       else {
//          if (data && data.length > 0) {
//           Promise.all([ansfromhouseid(data), taskfromhouseid(data), invoicefromhouseid(data)]).then((final_data) => {
//             var flatArray = Array.prototype.concat.apply([], final_data);
//        
//             // flatArray.sort(mySorter);
//             res.json({ status: 200, hassuccessed: true, message: 'succefully find', data: flatArray })
//           })
//         }
//         else {
//           res.json({ status: 200, hassuccessed: true, message: 'succefully find', data: [] })
//         }
//       }
//     })
//   }
//   else {
//     res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })

//   }
// })

function mySorter(a, b) {
  if (a.created_at && b.created_at) {
    var x = a.created_at.toLowerCase();
    var y = b.created_at.toLowerCase();
    return x > y ? -1 : x < y ? 1 : 0;
  } else {
    return -1;
  }
}
function mysort1(a, b) {
  if (a.created_at && b.created_at) {
    var x = a.created_at.toLowerCase();
    var y = b.created_at.toLowerCase();
    return x > y ? 1 : x < y ? -1 : 0;
  } else {
    return -1;
  }
}

router.post("/TaskFilter", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {


    var house_id = req.body.house_id;
    const VirtualtToSearchWith1 = new virtual_Task({ house_id });
    VirtualtToSearchWith1.encryptFieldsSync();

    var condition = {
      house_id: { $in: [req.body.house_id, VirtualtToSearchWith1.house_id] },
    };
    if (req.body.assigned_to) {
      condition["assinged_to.user_id"] = { $in: req.body.assigned_to };
    }
    if (req.body.status) {
      var status = req.body.status;
      statuscheck = status.map((element) => {
        VirtualtToSearchWith3 = new virtual_Task({ status: element });
        VirtualtToSearchWith3.encryptFieldsSync();
        return VirtualtToSearchWith3.status;
      });

      statuscheck = [...status, ...statuscheck];
      console.log('statuscheck', statuscheck)
      condition.status = { $in: statuscheck };
    }
    if (req.body.speciality_id) {
      condition["speciality._id"] = req.body.speciality_id;
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
        console.log("errr", err)
        res.json({ status: 200, hassuccessed: true, error: err });
      } else {
        console.log("data", data)
        let condition3 = {
          house_id: {
            $in: [req.body.house_id, VirtualtToSearchWith1.house_id],
          },
        };
        if (req.body.ward_id || req.body.room_id) {
          if (req.body.room_id) {
            condition3["rooms._id"] = req.body.room_id;
          }
          if (req.body.ward_id) {
            condition3["wards._id"] = req.body.ward_id;
          }

          virtual_Case.find(condition3, function (err, data1) {
            if (err) {
              console.log("err", err)
              res.json({ status: 200, hassuccessed: true, error: err });
            } else {
              var equals = data1.length === data.length && data1.every((e, i) => e.patient_id === data[i].patient_id);
              console.log("equals", equals)
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

router.post("/setCasenotInhospital", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var case_id = req.body.case_id;
    virtual_Case
      .updateMany(
        { _id: { $in: case_id } },
        { $set: { inhospital: false, status: "5" } }
      )
      .exec(function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {

          res.json({
            status: 200,
            hassuccessed: true,
            msg: "update",
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

router.post("/CalenderFilter", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      var house_id = req.body.house_id;
      const VirtualtToSearchWith1 = new virtual_Task({ house_id });
      VirtualtToSearchWith1.encryptFieldsSync();

      var condition = {
        house_id: { $in: [req.body.house_id, VirtualtToSearchWith1.house_id] },
      };

      if (req.body.speciality_id) {
        condition["speciality._id"] = req.body.speciality_id;
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
            house_id: {
              $in: [req.body.house_id, VirtualtToSearchWith1.house_id],
            },
          };
          if (req.body.ward_id || req.body.room_id) {
            if (req.body.room_id) {
              condition3["rooms._id"] = req.body.room_id;
            }
            if (req.body.ward_id) {
              condition3["wards._id"] = req.body.ward_id;
            }

            virtual_Case.find(condition3, function (err, data1) {
              if (err) {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "Something went wrong.",
                  error: err,
                });
              } else {

                let patient_en = data1.map((element) => {
                  var VirtualtToSearchWith = new Appointments({
                    patient: element.patient_id,
                  });
                  VirtualtToSearchWith.encryptFieldsSync();
                  return VirtualtToSearchWith.patient;
                });

                let patient_id = data1.map((element) => {
                  return element.patient_id;
                });

                patient_id = [...patient_id, ...patient_en];
                Appointments.find(
                  { patient: { $in: patient_id } },
                  function (err, appointments) {
                    if (err) {
                      res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong.",
                        error: err,
                      });
                    } else {

                      if (req.body.filter == "All") {
                        let final_data = [...data, ...data1, ...appointments];
                        res.json({
                          status: 200,
                          hassuccessed: true,
                          data: final_data,
                        });
                      }
                    }
                  }
                );

                // res.json({ status: 200, hassuccessed: true, data: data1 })
                // }
                // else {
                //   res.json({ status: 200, hassuccessed: false, message: "No data found" })

                // }
              }
            });
          } else {

            res.json({ status: 200, hassuccessed: true, data: data });
          }
        }
      });
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

router.post("/temp1", function (req, res) {
  let patient_id = ["5e871b1ec8a5ee77d0ceba36", "60113e84b488aa271effa411"];


  // var VirtualtToSearchWith= new  Appointments({patient:{ $in:patient_id} });
  // VirtualtToSearchWith.encryptFieldsSync();

  patient_en = patient_id.map((element) => {
    VirtualtToSearchWith = new Appointments({ patient: element });
    VirtualtToSearchWith.encryptFieldsSync();
    return VirtualtToSearchWith.patient;
  });

  patient_id = [...patient_id, ...patient_en];

  Appointments.find(
    { patient: { $in: patient_id } },
    function (err, appointments) {
      if (err) {

        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong.",
          error: err,
        });

        res.json({ status: 200, hassuccessed: true, data: appointments });
      }
    }
  );
});

router.post("/billfilter", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      let house_id = req.body.house_id;
      var VirtualtToSearchWith = new virtual_Invoice({ house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      var condition = {
        house_id: { $in: [house_id, VirtualtToSearchWith.house_id] },
      };
      if (req.body.status && req.body.status.length > 0) {
        condition["status.value"] = { $in: req.body.status };
      }
      if (req.body.patient_id && req.body.patient_id.length > 0) {
        condition["patient.patient_id"] = { $in: req.body.patient_id };
      }
      virtual_Invoice.find(condition, function (err, data2) {
        if (err & !data2) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          if (req.body.speciality && req.body.speciality.length > 0) {
            virtual_Case.find(
              {
                "speciality._id": { $in: req.body.speciality },
                house_id: req.body.house_id,
              },
              function (err, data) {
                if (err & !data) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "Something went wrong.",
                    error: err,
                  });
                } else {
                  var finalData =
                    data2 &&
                    data2.length > 0 &&
                    data2.filter((item) => item.case_id === data._id);
                  res.json({ status: 200, hassuccessed: true, data: finalData });
                }
              }
            );
          } else {
            res.json({ status: 200, hassuccessed: true, data: data2 });
          }
        }
      });
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong.",
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

router.delete("/AddTrack", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.updateOne(
      { _id: req.body.UserId },
      { $pull: { track_record: { track_id: req.body.TrackId } } },
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

router.post("/LeftInfoPatient", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var leftdataPatient = {};
  if (legit) {
    try {
      let house_id = req.body.house_id;
      const VirtualtToSearchWith = new virtual_Case({ house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      const VirtualtToSearchWith1 = new virtual_Case({ patient_id: req.body.patient_id });
      VirtualtToSearchWith1.encryptFieldsSync();
      virtual_Case.findOne(
        {
          $or: [{ house_id: house_id, house_id: VirtualtToSearchWith.house_id }],
          $or: [{ patient_id: req.body.patient_id, patient_id: VirtualtToSearchWith1.patient_id }],
          inhospital: true,
        },
        function (err, data) {
          if (err & !data) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            try {
              leftdataPatient = data;
              if (data) {
                const VirtualtToSearchWith2 = new virtual_Task({ case_id: data._id.toString() });
                VirtualtToSearchWith2.encryptFieldsSync();
                virtual_Task.aggregate(
                  [
                    {
                      $facet: {
                        total_task: [
                          {
                            $match: {
                              $or: [{ case_id: data._id.toString(), case_id: VirtualtToSearchWith2.case_id }],
                              status: { $exists: true },
                            },
                          },
                          { $count: "total_task" },
                        ],
                        done_task: [
                          {
                            $match: {
                              $or: [{ case_id: data._id.toString(), case_id: VirtualtToSearchWith2.case_id }],
                              status: "done",
                            },
                          },
                          { $count: "done_task" },
                        ],
                      },
                    },
                    {
                      $project: {
                        total_task: {
                          $arrayElemAt: ["$total_task.total_task", 0],
                        },
                        done_task: { $arrayElemAt: ["$done_task.done_task", 0] },
                      },
                    },
                  ],
                  function (err, results) {
                    console.log('results', results)
                    if (results && results.length > 0) {
                      leftdataPatient.done_task = results[0].done_task;
                      leftdataPatient.total_task = results[0].total_task;
                    }
                    User.findOne({ _id: req.body.patient_id }).exec(function (
                      err,
                      data2
                    ) {
                      if (err) {
                        res.json({
                          status: 200,
                          hassuccessed: false,
                          message: "Something went wrong.",
                          error: err,
                        });
                      } else {
                        let treck_record = data2 && data2.track_record;
                        leftdataPatient.entries = treck_record.length;
                        let sum = 0;
                        treck_record.forEach((element) => {
                          if (
                            element.attachfile &&
                            element.attachfile.length > 0
                          ) {
                            sum = element.attachfile.length + sum;
                            leftdataPatient.document_file = sum;
                          }
                        });
                        virtual_step
                          .findOne({
                            "steps.case_numbers.case_id": data._id.toString(),
                          })
                          .exec(function (err, data3) {
                            if (err) {
                              res.json({
                                status: 200,
                                hassuccessed: false,
                                message: "Something went wrong.",
                                error: err,
                              });
                            } else {
                              if (
                                data3 &&
                                data3.steps &&
                                data3.steps.length > 0
                              ) {
                                data3.steps.map((item) => {
                                  if (
                                    item.case_numbers &&
                                    item.case_numbers.length > 0
                                  ) {
                                    item.case_numbers.map((item2) => {
                                      if (item2.case_id == data._id.toString()) {
                                        leftdataPatient.step = item;
                                      }
                                    });
                                  }
                                });
                              }
                              virtual_Invoice
                                .find({ $or: [{ case_id: data._id.toString(), case_id: VirtualtToSearchWith2.case_id }] })
                                .exec(function (err, invoice) {
                                  if (err) {
                                    res.json({
                                      status: 200,
                                      hassuccessed: false,
                                      message: "Something went wrong.",
                                      error: err,
                                    });
                                  } else {
                                    leftdataPatient.invoice = invoice;
                                    res.json({
                                      status: 200,
                                      hassuccessed: true,
                                      message: "succefully find",
                                      data: leftdataPatient,
                                    });
                                  }
                                });
                            }

                          });

                      }
                    });
                  }
                );
              } else {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  message: "succefully find",
                  data: [],
                });
              }
            } catch (e) {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Something went wrong.",
                error: e,
              });
            }
          }
        }
      );
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Something went wrong",
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

router.post("/deletehouse", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      let house_id = req.body.house_id;
      house_id.forEach((element, index) => {
        User.updateMany({ houses: element }, { $pull: { houses: element } }).exec(
          function (err, data) {
            if (err && !data) {

            } else {

            }
          }
        );
      });
      let patient_en = house_id.map((element) => {
        var VirtualtToSearchWith = new virtual_Case({ house_id: element });
        VirtualtToSearchWith.encryptFieldsSync();
        return VirtualtToSearchWith.house_id;
      });

      let final_house_id = [...patient_en, ...house_id];
      house_id.forEach((element1, index) => {
        Institute.updateMany(
          {
            "institute_groups.houses.house_id": element1,
          },
          {
            $pull: {
              institute_groups: {
                houses: { $elemMatch: { house_id: element1 } },
              },
            },
          }
        ).exec(function (err, data) {
          if (err && !data) {

          } else {

          }
        });
      });

      virtual_Case
        .updateMany(
          { house_id: { $in: final_house_id } },
          { $set: { inhospital: false } }
        )
        .exec(function (err, data1) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          } else {

            res.json({
              status: 200,
              hassuccessed: true,
              message: "Update in houses",
            });
          }
        });
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Something went wrong",
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
// router.post("/deletehous", function (req, res) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     let house_id = req.body.house_id;
//     house_id.forEach((element, index) => {
//       User.updateMany({ houses: element }, { $pull: { houses: element } }).exec(
//         function (err, data) {
//           if (err && !data) {
//        
//           } else {
//    
//           }
//         }
//       );
//     });
//     let patient_en = house_id.map((element) => {
//       var VirtualtToSearchWith = new virtual_Case({ house_id: element });
//       VirtualtToSearchWith.encryptFieldsSync();
//       return VirtualtToSearchWith.house_id;
//     });

//     let final_house_id = [...patient_en, ...house_id];
//     house_id.forEach((element1, index) => {
//       Institute.updateMany(
//         {
//           "institute_groups.houses.house_id": element1,
//         },
//         {
//           $pull: {
//             institute_groups: {
//               houses: { $elemMatch: { house_id: element1 } },
//             },
//           },
//         }
//       ).exec(function (err, data) {
//         if (err && !data) {
//    
//         } else {
//        
//         }
//       });
//     });

//     virtual_Case
//       .updateMany(
//         { house_id: { $in: final_house_id } },
//         { $set: { inhospital: false } }
//       )
//       .exec(function (err, data1) {
//         if (err) {
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             msg: "Something went wrong",
//             error: err,
//           });
//         } else {
//    
//           res.json({
//             status: 200,
//             hassuccessed: true,
//             message: "Update in houses",
//           });
//         }
//       });
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       msg: "Authentication required.",
//     });
//   }
// });

router.post("/setCasenotInhospital", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var case_id = req.body.case_id;
    virtual_Case
      .updateMany(
        { _id: { $in: case_id } },
        { $set: { inhospital: false, status: "5" } }
      )
      .exec(function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
            error: err,
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "update",
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

router.get("/pa", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let patient_id = new mongoose.Types.ObjectId(req.body.patient_id);
    // let patient_id = req.body.patient_id

    const VirtualtToSearchWith = new User({ patient_id });
    VirtualtToSearchWith.encryptFieldsSync();
    answerspatient
      .aggregate([
        {
          $match: {
            $or: [
              {
                patient_id: patient_id,
                patient_id: VirtualtToSearchWith.patient_id,
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "patient_id",
            foreignField: "_id",
            as: "complete_info",
          },
        },
        {
          $project: {
            questionaire_id: 1,
            answers: 1,
            patient: 1,
            house_name: 1,
            house_id: 1,
            house_logo: 1,
            patient_id: 1,
            profile_id: "$complete_info.profile_id",
            email: "$complete_info.email",
            first_name: "$complete_info.first_name",
            last_name: "$complete_info.last_name",
            mobile: "$complete_info.mobile",
          },
        },
        //  { $unwind: "$complete_info"}
      ])
      .exec(function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {

          res.json({ status: 200, hassuccessed: true, result: data });
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

router.post("/getSubmitQuestionnaire", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let result = {};
  if (legit) {
    try {
      let patient_id = req.body.patient_id;
      const VirtualtToSearchWith = new answerspatient({ patient_id });
      VirtualtToSearchWith.encryptFieldsSync();
      let house_id = req.body.house_id;
      const VirtualtToSearchWithhouseid = new answerspatient({ house_id });
      VirtualtToSearchWithhouseid.encryptFieldsSync();

      answerspatient.find(
        {
          $or: [
            { patient_id: patient_id },
            { patient_id: VirtualtToSearchWith.patient_id },
            { house_id: house_id },
            { house_id: VirtualtToSearchWithhouseid.house_id },
          ],
        },
        function (err, data) {
          if (err) {

            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
            });
          } else {

            result.data = data;
            if (data && data.length > 0) {
              let pat = data.map((element) => {
                return element.patient_id;
              });

              User.find({ _id: { $in: pat } }, function (err, data2) {
                if (err) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "Something went wrong",
                  });
                } else {

                  result.profile_id = data2[0].profile_id;
                  result.first_name = data2[0].first_name;
                  result.last_name = data2[0].last_name;
                  result.email = data2[0].email;
                  result.mobile = data2[0].mobile;

                  res.json({ status: 200, hassuccessed: true, data: result });
                }
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "Not found",
              });
            }
          }
        }
      );
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
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

router.post("/virtualstep1", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      virtual_step.find({ house_id: req.body.house_id }, function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          if (data) {

            virtual_step
              .updateMany({ house_id: req.body.house_id })
              .exec(function (err, data) {
                res.json({ status: 200, hassuccessed: false, message: "delete" });
              });
            // virtual_step.findByIdAndRemove(req.body.house_id , function (err, data2) {
            //   res.json({ status: 200, hassuccessed: false, message: "delete" })

            // })
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "No user found",
            });
          }
        }

      });
    } catch (e) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
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

router.post("/virtualstep2", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      let house_id = req.body.house_id;
      const VirtualtToSearchWith = new virtual_Task({ house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Task.find(
        { house_id: { $in: [house_id, VirtualtToSearchWith.house_id] } },
        function (err, data) {
          if (err) {

            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
            });
          } else {

            if (data) {

              virtual_Task
                .updateMany({
                  house_id: { $in: [house_id, VirtualtToSearchWith.house_id] },
                })
                .exec(function (err, data) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "delete",
                  });
                });
              // virtual_Task.findByIdAndRemove(req.body.house_id, function (err, data2) {
              //   res.json({ status: 200, hassuccessed: false, message:"delete" })
              // })
            } else {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "No user found",
              });
            }
          }
        }
      );
    } catch (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Something went wrong",
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

// router.get("/trackrecords", function (req, res) {
//   const token = (req.headers.token)
//   let legit = jwtconfig.verify(token)
//   console.log("legit", legit)
//   finaldata = []
//   if (legit) {
//     User.find().exec(function (err, data) {
//       if (err) {
//         console.log("err", err)
//         res.json({ status: 200, hassuccessed: false, message: 'Something went wrong' })

//       }
//       else {
//         trackrecords = data.map((element) => {
//           return element.track_record
//         })
//         // console.log("track", trackrecords)
//         if (trackrecords.length > 0) {

// //       }
// //       else {
// //         trackrecords = data.map((element) => {
// //           return element.track_record
// //         })
// //         // console.log("track", trackrecords)
// //         if (trackrecords.length > 0) {

// //           trackrecords.forEach((element2) => {
// //             lastdata = element2.slice(-1)
// //             var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
// //             let d2 = new Date(lastdata[0] && lastdata[0].datetime_on).setHours(0, 0, 0, 0);
// //             if (d1 <= d2) {
// //               finaldata.push(lastdata[0].datetime_on)
// //             }
// //           })
// //           console.log("finaldata", finaldata)
// //           let finaldata1 = finaldata.length
// //           console.log("finaldata123", finaldata1)
// //           res.json({ status: 200, hassuccessed: true, data: finaldata1 })
// //         }
// //         else {
// //           res.json({ status: 200, hassuccessed: false, message: 'No user found' })
// //         }
// //       }

// //     })
// //   } else {
// //     res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })

// //   }
// // })

router.get("/trackrecordsbytype", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  finaldata = [];
  if (legit) {
    User.find({ type: req.body.type }).exec(function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        if (data.length > 0) {
          let finalcount = data.length;
          res.json({ status: 200, hassuccessed: false, data: finalcount });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.get("/trackrecordsbytype2", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  finaldata = [];
  if (legit) {
    User.aggregate(
      [
        {
          $match: { type: req.body.type },
        },
        {
          $count: "Totalnumber",
        },
      ],
      function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          if (data.length > 0) {
            res.json({ status: 200, hassuccessed: false, data: data });
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "No user found",
            });
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
});

// router.get("/trackrecordsforappointment", function (req, res) {
//   const token = (req.headers.token)
//   let legit = jwtconfig.verify(token)
//   finaldata = []
//   finaldata1 = []
//   if (legit) {
//     Appointments.find().exec(function (err, data) {
//       if (err) {
//       
//         res.json({ status: 200, hassuccessed: false, message: 'Something went wrong' })

//       }
//       else {

//         if (data.length > 0) {

//           data.forEach((element2) => {
//    

//             var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
//             let d2 = new Date(element2.date).setHours(0, 0, 0, 0);
//             if (d1 <= d2) {
//               finaldata.push(element2.date)
//          
//               finaldata1 = finaldata.length

//             }

//           })
//           res.json({ status: 200, hassuccessed: true, data: finaldata1 })

//         }
//         else {
//           res.json({ status: 200, hassuccessed: false, message: 'No user found' })
//         }
//       }

//     })
//   } else {
//     res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })

//   }
// })

router.post("/trackrecordsforpatient", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    let patient_id = req.body.patient_id;
    const VirtualtToSearchWith = new virtual_Task({
      patient_id: req.body.patient_id,
    });
    VirtualtToSearchWith.encryptFieldsSync();
    const VirtualtToSearchWith1 = new virtual_Task({
      task_type: "picture_evaluation",
    });
    VirtualtToSearchWith1.encryptFieldsSync();
    virtual_Task
      .find({
        patient_id: { $in: [patient_id, VirtualtToSearchWith.patient_id] },
        task_type: {
          $in: ["picture_evaluation", VirtualtToSearchWith1.task_type],
        },
      })
      .exec(function (err, data) {
        if (err) {

          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {

          data.sort(mysort1);
          if (data.length > 0) {
            res.json({
              status: 200,
              hassuccessed: true,
              data: data,
              message: "Successfully fetch",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "No Task Found",
            });
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

router.get("/trackrecordsforappointment", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var date = new Date(req.body.date);
  if (legit) {
    Appointments.aggregate(
      [
        {
          $match: { date: { $gte: date } },
        },
        {
          $group: {
            _id: "$patient",
            count: { $sum: 1 },
          },
        },
      ],
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: data });
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
router.post("/trackrecordsfordr", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var date = new Date(req.body.date);
  if (legit) {
    Appointments.aggregate(
      [
        {
          $match: { date: { $gte: date } },
        },
        {
          $group: {
            _id: "$doctor_id",
            count: { $sum: 1 },
          },
        },
      ],
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {

          // if(data.length>0){
          //   User.find()
          // }
          res.json({ status: 200, hassuccessed: true, data: data });
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

router.post("/trackrecordsforprescription", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let finaldata = [];
  finaldata1 = [];
  if (legit) {
    Prescription.find().exec(function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        if (data.length > 0) {
          data.forEach((element2) => {

            var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
            let d2 = new Date(element2.send_on).setHours(0, 0, 0, 0);
            if (d1 <= d2) {
              finaldata.push(element2.send_on);
              finaldata1 = finaldata.length;
            }
          });
          res.json({ status: 200, hassuccessed: true, data: finaldata1 });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.post("/trackrecordsforsickcertificate", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let finaldata = [];
  finaldata1 = [];
  if (legit) {
    Cretificate.find({}, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {

        if (data.length > 0) {
          data.forEach((element2) => {

            var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
            let d2 = new Date(element2.send_on).setHours(0, 0, 0, 0);
            if (d1 <= d2) {
              finaldata.push(element2.send_on);
              finaldata1 = finaldata.length;
            }
          });
          res.json({ status: 200, hassuccessed: true, data: finaldata1 });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.post("/pictureevaluationfeedback", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var picture_evaluation = new picture_Evaluation(req.body);
    picture_evaluation.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({
          status: 200,
          message: "Something went wrong.",
          error: err,
          hassuccessed: false,
        });
      } else {
        res.json({
          status: 200,
          message: "Feedback Submit",
          hassuccessed: true,
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

router.get("/checkFeedBack/:task_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    picture_Evaluation.findOne(
      { task_id: req.params.task_id },
      function (err, user_data) {
        if (err && !user_data) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
            hassuccessed: false,
          });
        } else {
          if (user_data) {
            res.json({
              status: 200,
              message: "Already exists",
              hassuccessed: true,
              data: user_data,
            });
          } else {
            res.json({
              status: 200,
              message: "Not exists",
              hassuccessed: false,
            });
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
});

router.get("/getfeedbackforpatient/:patient_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    picture_Evaluation
      .findOne({ "patient_infos.patient_id": req.params.patient_id })
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
});

router.get("/getfeedbackfordoctor/:doctor_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    picture_Evaluation
      .findOne({ doctor_id: req.params.doctor_id })
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
});

router.delete("/pictureevaluationfeedback/:_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    picture_Evaluation.deleteOne({ _id: req.params._id }, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          message: "Something went wrong.",
          error: err,
          hassuccessed: false,
        });
      } else {
        res.json({
          status: 200,
          message: "Delete Feedback",
          hassuccessed: true,
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

router.put("/pictureevaluationfeedback/:_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    picture_Evaluation.updateOne(
      { _id: req.params._id },
      req.body,
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
            hassuccessed: false,
          });
        } else {
          res.json({
            status: 200,
            message: "Update Feedback",
            hassuccessed: true,
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

router.get("/trackrecords", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  finaldata = [];
  if (legit) {
    User.find().exec(function (err, data) {
      if (err) {

        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        trackrecords = data.map((element) => {

          return element.track_record;
        });

        if (trackrecords.length > 0) {
          var finalLength = trackrecords.length;
          trackrecords.forEach((element2) => {
            lastdata = element2 && element2.slice(-1);
            var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
            let d2 = new Date(lastdata[0] && lastdata[0].datetime_on).setHours(
              0,
              0,
              0,
              0
            );
            if (d1 <= d2) {
              finaldata.push(lastdata[0].datetime_on);
            }
          });
          let finaldata1 = finaldata.length;

          res.json({
            status: 200,
            hassuccessed: true,
            data: finaldata1,
            byUser: finalLength,
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.get("/trackrecordsforappointment", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var date = new Date(req.body.date);
  if (legit) {
    Appointments.aggregate(
      [
        {
          $match: { date: { $gte: date } },
        },
        {
          $group: {
            _id: "$patient",
            count: { $sum: 1 },
          },
        },
      ],
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          res.json({ status: 200, hassuccessed: true, data: data });
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

router.post("/trackrecordsfordr", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var date = new Date(req.body.date);
  if (legit) {
    Appointments.aggregate(
      [
        {
          $match: { date: { $gte: date } },
        },
        {
          $group: {
            _id: "$doctor_id",
            count: { $sum: 1 },
          },
        },
      ],
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          // if(data.length>0){
          //   User.find()
          // }
          res.json({ status: 200, hassuccessed: true, data: data });
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

router.post("/trackrecordsforprescription", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let finaldata = [];
  finaldata1 = [];
  if (legit) {
    Prescription.find().exec(function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        if (data.length > 0) {
          data.forEach((element2) => {
            var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
            let d2 = new Date(element2.send_on).setHours(0, 0, 0, 0);
            if (d1 <= d2) {
              finaldata.push(element2.send_on);
              finaldata1 = finaldata.length;
            }
          });
          res.json({ status: 200, hassuccessed: true, data: finaldata1 });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.get("/trackrecordsbytype", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  finaldata = [];
  if (legit) {
    User.find({ type: req.body.type }).exec(function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        if (data.length > 0) {
          let finalcount = data.length;
          res.json({ status: 200, hassuccessed: false, data: finalcount });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

router.get("/trackrecordsbytype2", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  finaldata = [];
  if (legit) {
    User.aggregate(
      [
        {
          $match: { type: req.body.type },
        },
        {
          $count: "Totalnumber",
        },
      ],
      function (err, data) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
          });
        } else {
          if (data.length > 0) {
            res.json({ status: 200, hassuccessed: false, data: data });
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "No user found",
            });
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
});

router.post("/trackrecordsforsickcertificate", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  let finaldata = [];
  finaldata1 = [];
  if (legit) {
    Cretificate.find({}, function (err, data) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong",
        });
      } else {
        if (data.length > 0) {
          data.forEach((element2) => {

            var d1 = new Date(req.body.date).setHours(0, 0, 0, 0);
            let d2 = new Date(element2.send_on).setHours(0, 0, 0, 0);
            if (d1 <= d2) {
              finaldata.push(element2.send_on);
              finaldata1 = finaldata.length;
            }
          });
          res.json({ status: 200, hassuccessed: true, data: finaldata1 });
        } else {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "No user found",
          });
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

// router.post("/LeftInfoPatient", function (req, res) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   var leftdataPatient = {}
//   if (legit) {
//     let house_id = req.body.house_id
//     const VirtualtToSearchWith = new User({ house_id });
//     VirtualtToSearchWith.encryptFieldsSync();
//     virtual_Case.findOne({ $or: [{ house_id: house_id, house_id: VirtualtToSearchWith.house_id }], patient_id: req.body.patient_id, inhospital: true }, function (err, data) {
//       if (err & !data) {
//         res.json({ status: 200, hassuccessed: false, error: err })
//       } else {
//         leftdataPatient.data = data;
//         if (data) {
//           var Tasks = new Promise((resolve, reject)=>{
//             virtual_Task.aggregate([
//               { "$facet": {
//                 "total_task": [
//                   { "$match" : {"case_id": data._id,  "status": { "$exists": true,  }}},
//                   { "$count": "total_task" },
//                 ],
//                 "done_task": [
//                   { "$match" : {"case_id": data._id,  "status": "done"}},
//                   { "$count": "done_task" }
//                 ]
//               }},
//               { "$project": {
//                 "total_task": { "$arrayElemAt": ["$total_task.total_task", 0] },
//                 "done_task": { "$arrayElemAt": ["$done_task.done_task", 0] }
//               }}
//             ], function (err, results) {
//               resolve(results)
//           })
//           }).then((data3)=>{
//            if(data3 && data3.length>0){
//             leftdataPatient.done_task = data3[0].done_task;
//             leftdataPatient.total_task = data3[0].total_task;
//             User.findOne({ _id: req.body.patient_id }).exec(function (err, data2) {
//               if (err) {
//                 res.json({ status: 200, hassuccessed: false, error: err })
//               }
//               else {
//                 let treck_record = data2 && data2.track_record
//                 leftdataPatient.entries = treck_record.length
//                 let sum = 0

//                 treck_record.forEach((element) => {
//                   if (element.attachfile && element.attachfile.length > 0) {
//                     sum = element.attachfile.length + sum
//                     leftdataPatient.document_file = sum
//                   }
//                 })
//                 res.json({ status: 200, hassuccessed: true, data: leftdataPatient })
//               }
//             })
//            }
//           })
//         } else {
//           res.json({ status: 200, hassuccessed: true, message: 'succefully find', data: [] })
//         }
//       }
//     })
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       msg: "Authentication required.",
//     });
//   }
// });

/*Must be need in future can not be delete it*/
function ansfromhouseid(patient_id) {
  return new Promise((resolve, reject) => {
    const VirtualtToSearchWith = new answerspatient({ patient_id });
    VirtualtToSearchWith.encryptFieldsSync();
    answerspatient
      .find({
        $or: [
          { patient_id: patient_id },
          { patient_id: VirtualtToSearchWith.patient_id },
        ],
      })
      .exec(function (err, ans) {
        if (err) {
          reject([]);
        } else {
          resolve(ans);
        }
      });
  });
}

function taskfromhouseid(item) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      try {
        let infoHouse1 = {};
        let house_id = item.house_id;
        const VirtualtToSearchWith = new virtual_Task({ house_id });
        VirtualtToSearchWith.encryptFieldsSync();
        const VirtualtToSearchWith1 = new virtual_Task({
          task_type: "picture_evaluation",
        });
        VirtualtToSearchWith1.encryptFieldsSync();
        virtual_Task
          .find({
            $or: [
              { house_id: item.house_id },
              { house_id: VirtualtToSearchWith.house_id },
            ],
            $or: [
              { task_type: { $ne: "picture_evaluation" } },
              { task_type: { $ne: VirtualtToSearchWith1.task_type } },
            ],
          })
          .exec(function (err, task) {
            if (err) {
              resolve(flatArraya);
            } else {
              if (!Inhospital.includes(item.house_id)) {
                flatArraya.push(...task);
              }
              if (item.inhospital == false) {
                if (!InhopspitalInvoice.includes(item.house_id)) {
                  var invoices = invoicefromhouseid(item);
                  invoices.then((result) => {
                    flatArraya.push(...result);
                  });
                }
                InhopspitalInvoice.push(item.house_id);
              }
              Inhospital.push(item.house_id);
              resolve(flatArraya);
            }
          });
      } catch (error) {
        resolve(item);
      }
    });
  });
}

// function taskfromhouseid(data) {
//   return new Promise((resolve, reject) => {
//     let flatArray = []
//     let house_id = data[0].house_id
//     const VirtualtToSearchWith = new virtual_Task({ house_id });
//     VirtualtToSearchWith.encryptFieldsSync();
//     virtual_Task.find({ $or: [{ house_id: data[0].house_id }, { house_id: VirtualtToSearchWith.house_id }] }).exec(function (err, task) {
//       if (err) {
//         reject([])
//       } else {
//         Institute.find({ "institute_groups.houses.house_id": data[0].house_id }).exec(function (err, task2) {
//           if (err) {
//             reject(err)
//           } else {
//             let infoHouse1 = {}
//             task2[0].institute_groups.map(function (dataa) {
//               dataa.houses.map(function (data1) {
//                 if (data1.house_id == data[0].house_id) {
//                   infoHouse1 = { house_name: data1.house_name, house_logo: data1.house_logo };
//                 }
//               })

//             })
//             var finalTasktask = { ...task, ...infoHouse1 }
//             flatArray.push(finalTasktask);
//             resolve(flatArray)
//           }
//         })
//       }
//     })
//   })
// }

function invoicefromhouseid(data) {
  return new Promise((resolve, reject) => {
    try {
      let house_id = data.house_id;
      const VirtualtToSearchWith = new virtual_Task({ house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Invoice
        .find({
          $or: [
            { house_id: house_id },
            { house_id: VirtualtToSearchWith.house_id },
          ],
        })
        .exec(function (err, invoice) {
          if (err) {
            resolve([]);
          } else {
            resolve(invoice);
          }
        });
    } catch (e) {
      resolve(data);
    }
  });
}

function virtualInvoiceforPatient(patient_id) {
  return new Promise((resolve, reject) => {
    try {
      virtual_Invoice
        .find({ "patient.patient_id": patient_id })
        .sort({ created_at: "desc" })
        .exec(function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    } catch (err) {
      reject(err);
    }
  });
}

function virtualTasksforPatient(patient_id) {
  return new Promise((resolve, reject) => {
    try {
      const VirtualtToSearchWith = new virtual_Task({ patient_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Task
        .find({
          $or: [
            { patient_id: patient_id },
            { patient_id: VirtualtToSearchWith.patient_id },
          ],
        })
        .sort({ created_at: "desc" })
        .exec(function (err, data1) {
          if (err) {
            reject(err);
          } else {
            resolve(data1);
          }
        });
    } catch (err) {
      reject(err);
    }
  });
}

function User_Case(House_id) {
  return new Promise((resolve, reject) => {
    try {
      User.countDocuments(
        { "houses.value": House_id, type: "doctor" },
        function (err, userdata) {
          if (err) {
            reject(err);
          } else {
            resolve(userdata);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function User_Case1(House_id) {
  return new Promise((resolve, reject) => {
    try {
      User.countDocuments(
        { "houses.value": House_id, type: "nurse" },
        function (err, userdata) {
          if (err) {
            reject(err);
          } else {
            resolve(userdata);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function virtualCase(House_id) {
  return new Promise((resolve, reject) => {
    try {
      console.log('sdfdsfsfsf', House_id)
      const VirtualtToSearchWith = new virtual_Case({ house_id: House_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Case.countDocuments(
        {
          house_id: { $in: [House_id, VirtualtToSearchWith.house_id] }
        },
        function (err, count) {
          console.log('counssssst', count)
          if (err) {
            reject(err);
          } else {
            resolve(count);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function virtualTask(house_id) {
  return new Promise((resolve, reject) => {
    try {
      const VirtualtToSearchWith = new virtual_Task({ house_id: house_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_Task.find(
        { house_id: { $in: [house_id, VirtualtToSearchWith.house_id] } },
        function (err, list) {
          if (err) {
            reject(err);
          } else {
            var finaldata = [...list];
            resolve(finaldata);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

function virtualAppointment(userdata) {
  return new Promise((resolve, reject) => {
    Appoint = [];
    forEachPromise(userdata, getApointsDoctor).then((result) => {
      resolve(Appoint);
    });
  });
}

function getApointsDoctor(user) {
  return new Promise((resolve, reject) => {
    try {
      process.nextTick(() => {
        if (user) {
          const AppointToSearchWith = new Appointments({ doctor_id: user._id });
          AppointToSearchWith.encryptFieldsSync();
          Appointments.find(
            {
              $or: [
                { doctor_id: user._id },
                { doctor_id: AppointToSearchWith.doctor_id },
              ],
            },
            function (err, list1) {
              if (err) {
                reject(err);
              } else {
                if (list1) {
                  Appoint = [...Appoint, ...list1];
                  resolve(Appoint);
                }
              }
            }
          );
        } else {
          resolve(Appoint);
        }
      });
    } catch (err) {
      resolve(user);
    }
  });
}

function getfullInfo(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      try {
        Institute.findOne({ "institute_groups.houses.house_id": data.value })
          .exec()
          .then(function (doc3) {
            pos = fullinfo.filter((data) => data._id === doc3._id);
            if (pos && pos.length === 0) {
              fullInfo.push(doc3);
            }
            resolve(fullInfo);
          });
      } catch (error) {
        resolve(data);
      }
    });
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
