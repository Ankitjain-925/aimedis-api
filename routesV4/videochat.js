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
    
      if(req.body.alies_id) {
        condition["alies_id"] ={ $in: [req.body.alies_id,  VirtualtToSearchWith1.alies_id]} ; 
      }
      if(req.body.email) {
        condition["email"] = { $in: [req.body.email,  VirtualtToSearchWith1.email]}; 
      }
      if(req.body.profile_id) {
        condition["profile_id"] ={ $in: [req.body.profile_id,  VirtualtToSearchWith1.profile_id]} 
      }
      if(req.body.speciality) {
        condition["speciality"] ={ $in: [req.body.speciality,  VirtualtToSearchWith1.speciality]} ; 
      }
      if(req.body.first_name) {
        condition["first_name"] =  { $in: [req.body.first_name,  VirtualtToSearchWith1.first_name]}; 
      }
      if(req.body.last_name) {
        condition["last_name"] =  { $in: [req.body.last_name,  VirtualtToSearchWith1.last_name]}; 
      } 
      user.find(condition,  function (err, data1) {
        console.log(data1)
        if (err) {
          console.log("err", err)
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

  module.exports = router;                                                                            