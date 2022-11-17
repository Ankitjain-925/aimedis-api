require("dotenv").config();
var express = require("express");
var router = express.Router();
const multer = require("multer");
var User = require("../schema/user");
var Topic = require("../schema/topic");
var Institute = require("../schema/institute");
const { encrypt, decrypt } = require("./Cryptofile.js");
var Wishlist = require("../schema/wishlist_schema");
var jwtconfig = require("../jwttoken");
const vidchat = require("../schema/vid_chat_account.js")
const uuidv1 = require("uuid/v1");
const pdf = require("html-pdf");
const { promisify } = require("util");
var nodemailer = require("nodemailer");
const read = promisify(require("fs").readFile);
const handlebars = require("handlebars");
var dateTime = require("node-datetime");
var aws = require("aws-sdk");
var fs = require("fs");
var base64 = require("base-64");
var shortid = require("shortid");
var API_KEY = process.env.ADMIN_API_KEY;
var SECRET = process.env.ADMIN_API_SECRET;
const Client = require("authy-client").Client;
const authy = new Client({ key: API_KEY });

var transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 25,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

var AllUser1 = [];

router.post("/Addadminuser", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var institute_id = { institute_id: 0 };
  if (legit) {
    const email = req.body.email;
    const messageToSearchWith = new User({ email });
    messageToSearchWith.encryptFieldsSync();

    const messageToSearchWith1 = new User({
      email: req.body.email.toLowerCase(),
    });
    messageToSearchWith1.encryptFieldsSync();

    const messageToSearchWith2 = new User({
      email: req.body.email.toUpperCase(),
    });
    messageToSearchWith2.encryptFieldsSync();

    User.findOne({
      $or: [
        { email: messageToSearchWith1.email },
        { email: messageToSearchWith.email },
        { email: messageToSearchWith2.email },
        { email: req.body.email },
        { email: req.body.email.toLowerCase() },
        { email: req.body.email.toUpperCase() },
      ],
    })
      .exec()
      .then((data1) => {
        if (data1) {
          res.json({
            status: 200,
            msg: "Email is Already exist",
            success: false,
          });
        } else {
          if (req.body.lan === "de") {
            var dhtml =
              "<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>" +
              "Mit Aimedis stehen Sie immer an der Seite Ihrer Patienten. Bieten Sie online Termine und Videosprechstunden an, stellen Sie Rezepte und Arbeitsunfähigkeitsbescheinigungen aus oder bieten Sie Zweitmeinungen über die Plattform an, alles bis auf Weiteres kostenfrei.<br/>" +
              "Sobald Sie sich als medizinische Fachkraft legitimiert haben, schalten wir Ihren Zugang frei.<br/>" +
              "In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung.<br/>" +
              "Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>" +
              "Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen.<br/><br/>" +
              "<b>Ihr Aimedis Team</b><br/>" +
              '<b>Jetzt einloggen: </b> <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
              '<b>Der Aimedis Blog: </b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a>';

            if (req.body.type == "patient") {
              dhtml =
                "<b>Herzlich Willkommen bei Aimedis – Ihrer Gesundheitsplattform.</b><br/>" +
                "Mit Aimedis sind Sie immer auf der sicheren Seite, denn nicht nur Ihre medizinischen Daten sondern auch die Ärzte Ihres Vertrauens begleiten Sie ab sofort weltweit und 24 Stunden am Tag.<br/>" +
                "Bei Aimedis speichern Sie und Ihre Ärzte, Therapeuten und Kliniken Ihre Daten, Sie teilen wichtige Informationen mit Ihren Behandlern und greifen jederzeit auf diese zu. Vereinbaren Sie Termine, erhalten Sie einen Krankenschein, holen Sie eine Zweitmeinung zu einer geplanten OP ein oder sprechen Sie zu jeder Tag- und Nachtzeit mit einem Arzt Ihrer Wahl.<br/>" +
                "Dabei profitieren Sie nicht nur von höchster Datensicherheit sondern auch der Aimedis eigenen Blockchain anhand derer Sie jederzeit sicherstellen können, dass Ihre Daten nur durch Sie und einen Behandler IHRER Wahl eingesehen werden können. Ihre Daten, Ihre Entscheidung. <br/>" +
                "In Anbetracht der aktuellen Lage und Problematik durch das SARS Coronavirus stellt Aimedis sowohl für Patienten und Behandler ein entsprechendes Tagebuch zur Verfügung. <br/>" +
                "Im Anhang zu dieser E-Mail finden Sie die AGB sowie die Datenschutzbestimmungen.<br/>" +
                "Sie können uns per WhatsApp oder E-Mail via contact@aimedis.com erreichen. <br/><br/><br/>" +
                "<b>Ihr Aimedis Team</b><br/>" +
                '<b>Jetzt einloggen: </b>  <a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                '<b>Der Aimedis Blog:</b> <a href="https://aimedix.com">https://blog.aimedis.com</a><br/>';
            }
          } else {
            var dhtml =
              "<b>Welcome to Aimedis - your health platform.</b><br/>" +
              "With Aimedis you are always at your patients’ side. Offer online appointments and video consultations, issue prescriptions and sick certificates or offer second opinions via the platform, all free of charge until further notice. <br/>" +
              "As soon as you have legitimized yourself as a medical specialist, we will activate your access. <br/>" +
              "In view of the current situation and problems caused by the SARS coronavirus, Aimedis provides a corresponding diary for both patients and practitioners. <br/>" +
              "In the attachment to this email you will find the terms and conditions as well as the data protection regulations. <br/>" +
              "You can reach us via WhatsApp or email via contact@aimedis.com.<br/><br/><br/>" +
              "<b>Your Aimedis team</b><br/>" +
              '<b>Log in now:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
              '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';

            if (req.body.type == "patient") {
              dhtml =
                "<b>Welcome to Aimedis - your health platform.</b><br/>" +
                "With Aimedis you are always on the safe side, because not only your medical data but also the doctors you trust will accompany you worldwide and 24 hours a day.<br/>" +
                "At Aimedis you and your doctors, therapists and clinics save your data, you share important information with your healthcare professionals and access them at any time. Make appointments, get a sick certificate, get a second opinion on a planned operation or speak to a doctor of your choice at any time of the day or night.<br/>" +
                "You benefit not only from the highest level of data security, but also from Aimedis’ own blockchain, which you can use to ensure at any time that your data can only be viewed by you and a healthcare provider of your choice. Your data, your decision.<br/>" +
                "In view of the current situation and problems caused by the SARS coronavirus, Aimedis provides a corresponding diary for both patients and practitioners.<br/>" +
                "In the attachment to this email you will find the terms and conditions as well as the data protection regulations.<br/>" +
                "You can reach us via WhatsApp or email via contact@aimedis.com.<br/><br/><br/>" +
                "<b>Your Aimedis team</b><br/><br/><br/><br/>" +
                '<b>Log in now:</b><a href="https://aimedix.com">https://aimedix.com</a><br/>' +
                '<b>The Aimedis blog:</b> <a href="https://blog.aimedis.com">https://blog.aimedis.com</a><br/>';
            }
          }
          var ids = shortid.generate();
          if (req.body.type == "patient") {
            var profile_id = "P_" + ids;
          } else if (req.body.type == "nurse") {
            var profile_id = "N_" + ids;
          } else if (req.body.type == "pharmacy") {
            var profile_id = "PH" + ids;
          } else if (req.body.type == "paramedic") {
            var profile_id = "PA" + ids;
          } else if (req.body.type == "insurance") {
            var profile_id = "I_" + ids;
          } else if (req.body.type == "hospitaladmin") {
            var profile_id = "HA" + ids;
          } else if (req.body.type == "doctor") {
            var profile_id = "D_" + ids;
          } else if (req.body.type == "adminstaff") {
            var profile_id = "AS" + ids;
          }
          var isblock = { isblock: false };
          var dt = dateTime.create();
          var createdate = { createdate: dt.format("Y-m-d H:M:S") };
          var enpassword = base64.encode(
            JSON.stringify(encrypt(req.body.password))
          );
          var usertoken = { usertoken: uuidv1() };
          var verified = { verified: "true" };
          var createdby = { pin: "1234" };
          // var parent_id = { parent_id: legit.id }
          var profile_id = { profile_id: profile_id, alies_id: profile_id };
          if (req.body.institute_id) {
            institute_id = { institute_id: req.body.institute_id };
          }

          req.body.password = enpassword;

          if (req.body.country_code && req.body.mobile) {
            authy
              .registerUser({
                countryCode: req.body.country_code,
                email: req.body.email,
                phone: req.body.mobile,
              })
              .catch((err) =>
                res.json({
                  status: 200,
                  message: "Phone is not verified",
                  error: err,
                  hassuccessed: false,
                })
              )
              .then((regRes) => {
                var authyId = { authyId: regRes.user.id };
                req.body.mobile =
                  req.body.country_code.toUpperCase() + "-" + req.body.mobile;
                datas = {
                  ...authyId,
                  ...profile_id,
                  ...req.body,
                  ...institute_id,
                  ...isblock,
                  ...createdate,
                  ...createdby,
                  ...usertoken,
                  ...verified,
                };
                var users = new User(datas);
                users.save((err, user_data) => {
                  if (err && !user_data) {
                    res.json({
                      status: 200,
                      message: "Something went wrong.",
                      error: err,
                    });
                  } else {
                    if (user_data) {
                      user_id = user_data._id;
                      let token = user_data.usertoken;
                      if (user_data.type == "hospitaladmin") {

                        var link = "https://aidoc.io/admin/";
                      } else {
                        var link = "https://aidoc.io/";

                      }
                      let mailOptions = {
                        from: "contact@aimedis.com",
                        to: req.body.email,
                        //to      :  'navdeep.webnexus@gmail.com',
                        subject: "Aimedis Registeration",
                        html: dhtml,
                      };
                      let sendmail = transporter.sendMail(mailOptions);

                      if (
                        !req.body.institute_id &&
                        req.body.institute_name != ""
                      ) {
                        var fullInstitute = {
                          institute_name: req.body.institute_name,
                          created_by: user_id,
                        };
                        var Institutes = new Institute(fullInstitute);
                        Institutes.save((err, inst) => {
                          if (err && !inst) {
                            res.json({
                              status: 200,
                              message:
                                "Something went wrong on Institute creation",
                              error: err,
                            });
                          } else {
                            if (inst) {
                              User.updateOne(
                                { _id: user_id },
                                { institute_id: inst._id },
                                function (err, doc) {
                                  if (err && !doc) {
                                    res.json({
                                      status: 200,
                                      hassuccessed: false,
                                      message: "Something went wrong",
                                      error: err,
                                    });
                                  } else {
                                    User.findOne(
                                      { _id: user_id },
                                      function (err, doc) {
                                        if (err && !doc) {
                                          res.json({
                                            status: 200,
                                            hassuccessed: false,
                                            message: "Something went wrong",
                                            error: err,
                                          });
                                        } else {
                                          console.log("doc", doc);
                                          res.json({
                                            status: 200,
                                            message:
                                              "User is added Successfully",
                                            hassuccessed: true,
                                            data: doc,
                                          });
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
                                message: "Problem with assign the Institute",
                                error: err,
                              });
                            }
                          }
                        });
                      } else {
                        User.findOne({ _id: user_id }, function (err, doc) {
                          if (err && !doc) {
                            res.json({
                              status: 200,
                              hassuccessed: false,
                              message: "Something went wrong",
                              error: err,
                            });
                          } else {
                            console.log("doc33", doc);
                            res.json({
                              status: 200,
                              message: "User is added Successfully",
                              hassuccessed: true,
                              data: doc,
                            });
                          }
                        });
                      }
                    } else {
                      res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong.",
                        error: err,
                      });
                    }
                  }
                });
              });
          } else {
            res.json({
              status: 200,
              message: "Phone is not verified",
              error: err,
              hassuccessed: false,
            });
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

router.get("/allusers", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  AllUser1 = [];
  if (legit) {
    User.find()
      .exec()
      .catch((error) => {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong",
          data: error,
        });
      })
      .then((data) => {
        if (data.length > 0) {
          forEachPromise(data, AllUser).then((result) => {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "User is found",
              data: AllUser1,
            });
          });
        } else {
          res.json({ status: 200, hassuccessed: false, msg: "No User found" });
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

router.get("/allHospitalusers/:institute_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  AllUser1 = [];
  if (legit) {
    User.find({ institute_id: req.params.institute_id })
      .exec()
      .then((data) => {
        if (data.length > 0) {
          forEachPromise(data, AllUser).then((result) => {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "User is found",
              data: AllUser1,
            });
          });
        } else {
          res.json({ status: 200, hassuccessed: false, msg: "No User found" });
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

router.get("/messageUsers", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  AllUser1 = [];
  if (legit) {
    User.find({ _id: legit.id })
      .exec()
      .then((data) => {
        if (data.length > 0) {
          User.find({
            $or: [{ _id: data[0].parent_id }, { parent_id: legit.id }],
          })
            .exec()
            .then((data22) => {
              if (data22.length > 0) {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  msg: "User is found",
                  data: data22,
                });
              } else {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  msg: "No User found",
                });
              }
            });
        } else {
          res.json({ status: 200, hassuccessed: false, msg: "User not found" });
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

function emptyBucket(bucketName, foldername) {
  aws.config.update({
    region: "ap-south-1", // Put your aws region here
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  });

  var s3 = new aws.S3({ apiVersion: "2006-03-01" });
  var params = {
    Bucket: bucketName,
    Prefix: foldername,
  };

  s3.listObjects(params, function (err, data) {
    if (err) return err;

    if (data.Contents.length == 0) {
      console.log("Bucket is empty!");
    } else {
      params = { Bucket: bucketName };
      params.Delete = { Objects: [] };

      data.Contents.forEach(function (content) {
        params.Delete.Objects.push({ Key: content.Key });
      });

      s3.deleteObjects(params, function (err, data) {
        if (err) return err;
        if (data && data.Contents && data.Contents.length != 0)
          emptyBucket(bucketName, foldername);
      });
    }
  });
}

router.delete("/deleteUser/:UserId", function (req, res, next) {
  User.findOneAndRemove({ _id: req.params.UserId }, function (err, data12) {
    if (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Something went wrong.",
        error: err,
      });
    } else {
      const messageToSearchWith = new vidchat({ UserId: req.params.UserId });
      messageToSearchWith.encryptFieldsSync();
      vidchat.findOne(
        {
          patient_id: { $in: [req.params.UserId, messageToSearchWith.UserId] }
        })
        .exec(function (err, getdata) {
          if (getdata.prepaid_talktime_min > 0) {
            res.json({ status: 400, messages: `You can't not delete account, because you still have ${getdata.prepaid_talktime_min} minutes left. Please deactivate your account ` })
          }
          else {
      if (req.query.bucket) {
        var buck = req.query.bucket;
      } else {
        var buck = "aimedisfirstbucket";
      }
      emptyBucket(buck, data12.profile_id);
      var patient_id = req.params.UserId
      const VirtualtToSearchWith1 = new virtual_cases({ patient_id });
      VirtualtToSearchWith1.encryptFieldsSync();
      virtual_cases.updateOne({ patient_id: { $in: [patient_id, VirtualtToSearchWith1.patient_id] } },
        {
          '$unset': {
            'patient.image': ''
          }
        }, function (err, data) {
          if (err) {
            console.log("err", err)
          } else {
            console.log("data", data)
          }
        })
      var patient_id = req.params.UserId
      const VirtualtToSearchWith = new virtual_tasks({ patient_id });
      VirtualtToSearchWith.encryptFieldsSync();
      virtual_tasks.updateOne({ patient_id: { $in: [patient_id, VirtualtToSearchWith.patient_id] } },
        {
          '$unset': {
            'patient.image': ""
          }
        }, function (err, data2) {
          if (err) {
            console.log("err", err)

          } else {
            console.log("data", data2)
          }
        })

      virtual_Invoice.updateOne({ "patient.patient_id": req.params.UserId },
        {
          '$unset': {
            'patient.image': ""
          }
        }, function (err, data3) {
          if (err) {
            console.log("err3", err)
          } else {
            console.log("data", data3)
          }
        })
      var patient = req.params.UserId
      const VirtualtToSearchWith2 = new Appointments({ patient });
      VirtualtToSearchWith2.encryptFieldsSync();
      Appointments.updateOne({
        patient: { $in: [patient, VirtualtToSearchWith2.patient] }
      }, {
        '$unset': {
          'patient_info.profile_image': ""
        }
      }, function (err, data4) {
        if (err) {
          console.log("err", err)

        } else {
          console.log("data", data4)
        }

      })
      res.json({ status: 200, hassuccessed: true, msg: "User is Deleted" });
    }
  });
}
  });
});

router.put("/BlockUser/:UserId", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.updateOne(
      { _id: req.params.UserId },
      req.body,
      { new: true },
      function (err, userinfo) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "User status is Updated",
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

function AllUser(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      if (!data.institute_id || data.institute_id == "0") {
        var new_data = data;
        var institute_name = "";

        new_data.institute_name = institute_name;

        AllUser1.push(new_data);
        resolve(AllUser1);
      } else {
        Institute.find({ _id: data.institute_id }, function (err, doc3) {
          if (err) {
          } else {
            var new_data = data;
            var institute_name = "";
            if (doc3 && doc3.length > 0 && doc3[0].institute_name) {
              institute_name = doc3[0].institute_name;
            }

            new_data.institute_name = institute_name;

            AllUser1.push(new_data);
            resolve(AllUser1);
          }
        });
      }
    });
  });
}

//add document
router.post("/Document", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var data = {
      DocumentId: uuidv1(),
      version: 1,
      status: true,
      filename: req.query.filename,
      url: req.query.url + "&bucket=" + req.query.bucket,
    };

    User.findByIdAndUpdate(
      legit.id,
      { $push: { documents: data } },
      { safe: true, upsert: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Document is added Successfully",
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

router.get("/Document", function (req, res, next) {
  const datas = Array();
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      {
        _id: legit.id,
      },
      function (err, doc) {
        if (err && !changeStatus) {
        } else {
          if (doc !== "undefined" && doc.length > 0 && doc[0] !== null) {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "Document is found",
              data: doc[0].documents,
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "no data found",
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

router.put("/ChangeStatus/:DocumentId", function (req, res, next) {
  var dataspull = Array();
  var dataspush = Array();
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.updateOne(
      {
        _id: legit.id,
        "documents.DocumentId": req.params.DocumentId,
      },
      {
        $set: {
          "documents.$.status": req.body.status,
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
              msg: "Document is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "Document is updated",
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

router.post("/GetHintinstitute", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    colName = req.body.institute_name;
    Institute.find(
      {
        $and: [
          { institute_name: { $regex: ".*" + colName + ".*", $options: "i" } },
          { created_by: legit.id },
        ],
      },
      function (err, allinstitute) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Institute found",
            data: allinstitute,
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

router.get("/GetHintinstitute", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.find(
      { institute_name: { $exists: true } },
      function (err, allinstitute) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Institute found",
            data: allinstitute,
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

//for delete the document
router.delete("/Document/:DocumentId", function (req, res, next) {
  var dataspull = Array();
  var dataspush = Array();
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var data = req.body.data;
  if (legit) {
    User.updateOne(
      { _id: legit.id },
      { $pull: { documents: { DocumentId: req.params.DocumentId } } },
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

router.post("/topic", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var topics = new Topic(req.body);
    topics.save(function (err, messages_data) {
      if (err && !messages_data) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong.",
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "topic is added Successfully",
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
router.get("/topic", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Topic.find({}, function (err, messages_data) {
      if (err && !messages_data) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong.",
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "topic is find Successfully",
          data: messages_data,
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

router.delete("/topic/:id", function (req, res, next) {
  Topic.findOneAndRemove({ _id: req.params.id }, function (err, data12) {
    if (err) {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Something went wrong.",
        error: err,
      });
    } else {
      res.json({ status: 200, hassuccessed: true, msg: "User is Deleted" });
    }
  });
});

router.delete("/removeWishlist/:id", function (req, res) {
  let legit = jwtconfig.verify(req.headers.token);
  if (legit) {
    Wishlist.findOneAndRemove({ _id: req.params.id }, function (err, data12) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          msg: "Something went wrong.",
          error: err,
        });
      } else {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Wishlist is Deleted",
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

router.put("/topic/:id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Topic.updateOne(
      { _id: req.params.id },
      req.body,
      { new: true },
      function (err, userinfo) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong.",
          });
        } else {
          res.json({
            status: 200,
            hassuccessed: true,
            msg: "Topic is Updated Successfully",
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


router.get("/allusers/:type", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
      var batchSize = 10000;
      User.find({ type: req.params.type}).count().then((count) => {
  
      //   const operations = [];
      //   for (let i = 0; i < count; i += batchSize) {
      //     operations.push(
            User.find({type: req.params.type}).skip(0).limit(count).then((batchHandler) => {
              res.json({ status: 200, hassuccessed: true, data: batchHandler })
            })
      //     )
      //   }
      }).catch((err)=>{
        res.json({ status: 200, hassuccessed: true, err: err })
  
      })
  //   User.find({ type: req.params.type }, function (err, data){
  //     if (err && !data) {
  //       res.json({ status: 200, hassuccessed: false, message: "Users not found", error: err })
  //     } else {
  //       res.json({ status: 200, hassuccessed: true, data: data })
  //     }
  //   })  
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});

router.get("/allusers/:type/:pagenumber", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find({ type: req.params.type }).count().lean().then((count) => {
      let pagenumber = req.params.pagenumber
      var page_limit = 20
      if (pagenumber && pagenumber > 0) {
        const operations = [];
        operations.push(
          User.find({ type: req.params.type }).skip((pagenumber - 1) * page_limit).limit(page_limit).then((batchHandler) => {
              res.json({ status: 200, hassuccessed: true, data: batchHandler, Total_count:count})
          })
        )
      } else {
        User.find({ type: req.params.type }).skip(0).limit(20).then((batchHandler) => {
          res.json({ status: 200, hassuccessed: true, data: batchHandler, Total_count: count })
        })
      }
    }).catch((err) => {
      console.log("err", err)
      res.json({ status: 200, hassuccessed: true, err: err })

    })

  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});



router.get("/allHospitalusers/:institute_id/:type/:pagenumber", function (req, res) {
  const token = req.headers.token;
  
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find({ institute_id: req.params.institute_id, type: req.params.type }).count().then((count)=>{
      let pagenumber = req.params.pagenumber
      var page_limit = 20
      if (pagenumber && pagenumber > 0) {
        const operations = [];
        operations.push(
          User.find({ institute_id: req.params.institute_id,type: req.params.type }).skip((pagenumber - 1) * page_limit).limit(page_limit).then((batchHandler) => {
              res.json({ status: 200, hassuccessed: true, data: batchHandler, Total_count:count})
          })
        )
      } else {
        User.find({institute_id: req.params.institute_id, type: req.params.type }).skip(0).limit(20).then((batchHandler) => {
          res.json({ status: 200, hassuccessed: true, data: batchHandler, Total_count: count })
        })
      }

    }).catch((err) => {
      console.log("err", err)
      res.json({ status: 200, hassuccessed: true, err: err })

    })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Authentication required.",
    });
  }
});


// router.post("/allSearchusers", function (req, res) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//   if(req.body.type && req.body.search){
//       const Useremail = new User({ email: req.body.search });
//       Useremail.encryptFieldsSync();
//       const Useremail1 = new User({ email: req.body.search.toUpperCase() });
//       Useremail1.encryptFieldsSync();
//       const Useremail2 = new User({ email: req.body.search.toLowerCase() });
//       Useremail2.encryptFieldsSync();
//       const Userfirstname = new User({ first_name : req.body.search});
//       Userfirstname.encryptFieldsSync();
//       const Userfirstname1 = new User({ first_name : req.body.search.toUpperCase()});
//       Userfirstname1.encryptFieldsSync();
//       const Userfirstname2 = new User({ first_name : req.body.search.toLowerCase()});
//       Userfirstname2.encryptFieldsSync();
//       const Userlastname = new User({ last_name : req.body.search });
//       Userlastname.encryptFieldsSync();
//       const Userlastname1 = new User({ last_name : req.body.search.toUpperCase() });
//       Userlastname1.encryptFieldsSync();
//       const Userlastname2 = new User({ last_name : req.body.search.toLowerCase() });
//       Userlastname2.encryptFieldsSync();
     
//         User.find({ $and: [{ type: req.body.type },
//           {$or: [{ first_name: req.body.search }, { first_name: Userfirstname.first_name },{ first_name: Userfirstname1.first_name },{ first_name: Userfirstname2.first_name }, { email: Useremail.email },
//             { last_name: req.body.search },{ last_name: req.body.search.toLowerCase() },{ last_name: req.body.search.toUpperCase() },{ first_name: req.body.search.toLowerCase() },{ first_name: req.body.search.toUpperCase() },
//              { last_name: Userlastname.last_name },{ email: req.body.search },{ email: Useremail1.email },{ email: Useremail2.email }, { last_name: Userlastname1.last_name }, { last_name: Userlastname2.last_name },
//              { last_name: req.body.search.toLowerCase() },{ last_name: req.body.search.toUpperCase() }, { email: req.body.search.toLowerCase() },{ email: req.body.search.toUpperCase() }]
//           }] },function (err, data) {
//           if (err && !data) {
//             console.log("err", err)
//             res.json({ status: 200, hassuccessed: false, message: "specialities not found", error: err })
//           } else {
//             res.json({ status: 200, hassuccessed: true, data: data })
//           }
//         })
//   }
//   else{
//       res.json({
//           status: 200,
//           hassuccessed: false,
//           msg: "Please send type and search data",
//         });
//   }  
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       msg: "Authentication required.",
//     });
//   }
// });


router.post("/allSearchusers", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
  if(req.body.type && req.body.search){
    User.find({ type: req.body.type }).then((data) => {
      let serach_value = SearchUser(req.body.search, data )
      res.json({ status: 200, hassuccessed: true, message: "search data found", data: serach_value })
    })
  }
  else{
      res.json({
          status: 200,
          hassuccessed: false,
          msg: "Please send type and search data",
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

router.post("/allHospitalusers", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
  if(req.body.institue_id && req.body.type && req.body.search){
    User.find({ institute_id:req.body.institue_id, type:req.body.type }).then((data) => {
      console.log("data",data)
      let serach_value = SearchUser(req.body.search, data )
      res.json({ status: 200, hassuccessed: true, message: "search data found", data: serach_value })
    })
  }
  else{
      res.json({
          status: 200,
          hassuccessed: false,
          msg: "Please send type and search data",
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

function SearchUser (searchKey, searchInto) {
  return searchInto.filter(user => {

    searchKey = searchKey.toLowerCase()
      let email = user.email.toLowerCase().search(searchKey)
      let name = `${user.first_name} ${user.last_name}`
      name = name.toLowerCase().search(searchKey)
      if (name > -1) {
          return user
      }
      else if (email > -1) {
          return user
      }
      else {
          return false
      }
  })
};

function forEachPromise(items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}

module.exports = router;
