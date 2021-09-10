var express = require("express");
let router = express.Router();
var virtual_cases = require("../schema/virtual_cases.js");
var Virtual_Specialty = require("../schema/virtual_specialty.js");
var User = require("../schema/user.js");
var jwtconfig = require("../jwttoken");
const User = require("../schema/user.js");
var fullinfo = [];

router.put("/AddRoom/:Room_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.body.room && req.body.bed) {
      var changes = { room: req.body.room, bed: req.body.bed }
    }
    virtual_cases.updateOne(
      { _id: req.params.room_id },
      changes,
      function (err, userdata) {
        if (req.body.room) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "something went wrong",
            error: err,
          });
        } else {
          if (req.body.bed) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Bed is updated",
              error: err,
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Room is updated",
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

router.put("/AddCase/:speciality_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  // if (legit) {
  virtual_cases.updateOne(
    { _id: req.params.speciality_id },
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
          message: "case is updated",
          data: userdata,
        });
      }
    }
  ); 

  router.post("/AddCase", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_cases.findOne({patient_id: req.body.patient_id, inhospital : true }, function (err, userdata) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          console.log('user+dia')
          if(userdata){
            res.json({
              status: 200,
              hassuccessed: false,
              message: "case is already exist in hospital",
            });
          }
          else{
            var Virtual_Cases = new virtual_cases(req.body);
            Virtual_Cases.save(function (err, user_data) {
              if (err && !user_data) {
                res.json({ status: 200, message: "Something went wrong.", error: err });
              } else {
                console.log('user_data._id', user_data._id, user_data)
                res.json({
                  status: 200,
                  message: "Added Successfully",
                  hassuccessed: true,
                  data: user_data._id
                });
              }
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

router.post("/checkbedAvailability", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_cases.find(
      {"wards._id":req.body.ward_id,
      "specialty._id":req.body.specialty_id,
        "room._id":req.body.room_id,
        "house._id":req.body.house_id },function (err, userdata){
          if(err && !userdata){
            res.json({ status: 200, message: "Something went wrong.", error: err });
          }
          else{
            console.log('userdata', userdata)
            Virtual_Specialty.find({_id: req.body.specialty_id},function (err, userdata){
              if(err && !userdata){
                res.json({ status: 200, message: "", error: err }); 
              }
            })

            }
        }
        )
  }
})
      
      
      
       

// router.post('/Patient/:patient_id/:pin', function (req, res, next) {
//   const token = (req.headers.token)
//   let legit = jwtconfig.verify(token)
//   if (legit) {
//     User.findOne({_id: req.body.patient_id }, function (err, userdata) {
//       if (userdata) {
//         (userdata.pin == req.body.pin)
//         res.json({ status: 200, hassuccessed: true, data: userdata })
//       } else {
//         res.json({ status: 200, hassuccessed: false, message: 'pin is not correct' })
//       }
//     })
//   } else {
//     res.json({ status: 200, hassuccessed: false, message: 'user not exist' })
//   }
// })



module.exports = router;