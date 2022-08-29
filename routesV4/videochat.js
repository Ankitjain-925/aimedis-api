require("dotenv").config();
var express = require("express");
let router = express.Router();
const user = require("../schema/user.js");
var Video_Conference = require("../schema/pictureevaluation_feedback");
const vidchat = require("../schema/vid_chat_account.js")
const Cappointment = require("../schema/conference_appointment.js")
var jwtconfig = require("../jwttoken");


router.post("/getuserchat", function(req, res, next)  {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    console.log(legit)
    if (legit) {
      let patient_id = req.body._id
      let email = req.body.email
      const messageToSearchWith = new user({patient_id,email});
      messageToSearchWith.encryptFieldsSync();
      user.find(
        {$or:[ {_id: req.body._id},{patient_id: messageToSearchWith._id},{email: messageToSearchWith.email} ]},
        function (err, userdata) {
          if (err && ! userdata) {
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
           data:result,
           hassuccessed: true
         })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          reeor: err
        })
      })
    }else{
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication Required.",
      });
    }
});

router.post("/AppointmentBook", function (req, res, next) {
  const token = req.headers.token;
  let   legit = jwtconfig.verify(token);
  console.log(legit)
  if (legit) {     
    const Videodata = new Cappointment(req.body)
    Videodata.save()
    .then(result => {
         res.json({
         status: 200,
         msg: 'Appointment Book Successfully',
         data:result,
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