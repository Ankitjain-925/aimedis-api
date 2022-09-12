require("dotenv").config();
var express = require("express");
let router = express.Router();
const user = require("../schema/user.js");
var Video_Conference = require("../schema/doctor_feedback");
const vidchat = require("../schema/vid_chat_account.js")
const Cappointment = require("../schema/conference_appointment.js")
var jwtconfig = require("../jwttoken");
const { encrypt, decrypt } = require("./Cryptofile.js");
const { constructFromObject } = require("@mailchimp/mailchimp_marketing/src/ApiClient.js");
const Video_chat_Account = require("../schema/vid_chat_account.js");
var base64 = require('base-64');

router.post("/getuserchat", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  console.log(legit)
  if (legit) {

    const messageToSearchWith = new vidchat({ patient_id: req.body._id });
    messageToSearchWith.encryptFieldsSync();
    vidchat.find(
      {
        patient_id: { $in: [req.body._id, messageToSearchWith.patient_id] }
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
            console.log(userdata.length)

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
});


router.post("/AddVideoUserAccount", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  console.log(legit)
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
            res.json({ status: 200, hassuccessed: true, data: "User Already Register" })
          } else {
            const data = {
              email: legit.email || req.body.email,
              patient_id: legit.patient_id || req.body.patient_id,
              reg_amount: legit.reg_amount || req.body.reg_amount,
              password: legit.password || req.body.password,
              username: legit.username || req.body.username,
              is_payment: legit.is_payment || req.body.is_payment,
              prepaid_talktime: legit.prepaid_talktime || req.body.prepaid_talktime,
              status: legit.stauts || req.body.status,
              type: "video_conference"
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
                res.status(500).json({
                  reeor: err
                })
              })
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
})


router.post("/AppointmentBook", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  console.log(legit)
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
});

router.get("/Get_Doctor/:data", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const VirtualtToSearchWith1 = new user({ alies_id: req.params.data, email: req.params.data, profile_id: req.params.data, speciality: req.params.data, first_name: req.params.data, last_name: req.params.data });
    VirtualtToSearchWith1.encryptFieldsSync();
    user.find({
      type: "doctor",
      $or: [
        { alies_id: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { alies_id: { $regex: '.*' + VirtualtToSearchWith1.alies_id + '.*', $options: 'i' } },
        { email: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { email: { $regex: '.*' + VirtualtToSearchWith1.email + '.*', $options: 'i' } },
        { profile_id: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { profile_id: { $regex: '.*' + VirtualtToSearchWith1.profile_id + '.*', $options: 'i' } },
        { speciality: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { speciality: { $regex: '.*' + VirtualtToSearchWith1.speciality + '.*', $options: 'i' } },
        { first_name: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { first_name: { $regex: '.*' + VirtualtToSearchWith1.first_name + '.*', $options: 'i' } },
        { last_name: { $regex: '.*' + req.params.data + '.*', $options: 'i' } },
        { last_name: { $regex: '.*' + VirtualtToSearchWith1.last_name + '.*', $options: 'i' } }
        ]
    }, function (err, data1) {
      console.log(err)
      if (err) {
        res.json({ status: 200, hassuccessed: true, error: err });
      } else {
        res.json({ status: 200, hassuccessed: true, data: data1 });
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
})

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
});

router.get("/getfeedbackfordoctor/:doctor_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Video_Conference
      .find({ doctor_id: req.params.doctor_id })
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
});

router.post("/UsernameLogin", function (req, res, next) {
  var username = req.body.username.toLowerCase();
  var password = req.body.password;
  const VirtualtToSearchWith1 = new vidchat({ username, password });
  VirtualtToSearchWith1.encryptFieldsSync();
  if (req.body.username == "" || req.body.password == "") {
    res.json({
      status: 400,
      message: "username and password fields should not be empty",
      hassuccessed: false,
    });
  } else {
    vidchat
      .findOne({ username: { $in: [req.body.username, VirtualtToSearchWith1.username] } })
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
});

router.post("/managePrepaid", async (req, res) => {
  const { manage_for, _id, prepaid_min, paid_amount_data, used_talktime_data } = req.body;
  if (manage_for == "add") {
    let response = await vidchat.findByIdAndUpdate({ _id }, { "prepaid_talktime_min": prepaid_min, $push: { "paid_amount_obj": encrypt(JSON.stringify(paid_amount_data)) } })
    if (response) {
      res.json({ status: 200, hassuccessed: true, data: response });
    } else {
      res.json({
        status: 400,
        hassuccessed: false,
        message: "Something went wrong",
      });
    }
  } else if (manage_for == 'use') {
    let response = await vidchat.findByIdAndUpdate({ _id }, { "prepaid_talktime_min": prepaid_min, $push: { "used_talktime": encrypt(JSON.stringify(used_talktime_data)) } })
    if (response) {
      res.json({ status: 200, hassuccessed: true, data: response });
    } else {
      res.json({
        status: 400,
        hassuccessed: false,
        message: "Something went wrong",
      });
    }
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

module.exports = router;                                                                            