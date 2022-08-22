require("dotenv").config();
var express = require("express");
let router = express.Router();
const user = require("../schema/user.js");
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
    }else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Authentication required.",
      });
    }
});


router.post("/AddVideoUserAccount", function (req, res, next) {
    const token = req.headers.token;
    let   legit = jwtconfig.verify(token);
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
  }else{
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication Required.",
    });
  }
});




  router.get("/DoctorList", async(req, res) => {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      try{
    console.log(res)
    user.find({type: 'doctor', first_name:{ $exists:true }})
    .then(result => {
      res.status(200).json({
        newbook:result
      
      });
    })
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


  module.exports = router;                                                                            