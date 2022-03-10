var express = require("express");
let router = express.Router();
var virtual_cases = require("../schema/virtual_cases.js");
var virtual_tasks = require("../schema/virtual_tasks");
var Virtual_Specialty = require("../schema/virtual_specialty.js");
const { encrypt, decrypt } = require("./Cryptofile.js");
// var User = require("../schema/user.js");
var user = require("../schema/user");
const uuidv1 = require("uuid/v1");
var jwtconfig = require("../jwttoken");
const { resolveContent } = require("nodemailer/lib/shared");
var mongoose = require('mongoose');

// const User = require("../schema/user.js");
var fullinfo = [];

router.put("/AddRoom/:Case_Id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var changes = {
      room: req.body.room,
      bed: req.body.bed,
      wards: req.body.wards,
    };
    virtual_cases.updateOne(
      { _id: req.params.Case_Id },
      changes,
      function (err, userdata) {
        res.json({
          status: 200,
          hassuccessed: true,
          message: "Information is updated",
          data: userdata,
        });
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

router.get("/AddCase/:speciality_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
  virtual_cases.findOne(
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
  if (legit) {
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
} else {
  res.json({
    status: 200,
    hassuccessed: false,
    message: "Authentication required.",
  });
}
});

router.put("/verifiedbyPatient/:case_id", function (req, res, next) {
 if(req.body.verifiedbyPatient){
  console.log('sdsdfsdfsd111')
  virtual_cases.updateOne(
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
        if (userdata.nModified == "0") {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Case is not found",
          });
        } 
        else{
          res.json({
            status: 200,
            hassuccessed: true,
            message: "case is updated",
            data: userdata,
          });
        }
      }
    }
  );
 }
 else{
  virtual_cases.findOne(
    {_id: req.params.case_id},
    function (err, userdata) {
      if (err) {
        console.log("err",err)
        res.json({
          status: 200,
          hassuccessed: false,
          message: "Something went wrong.",
          error: err,
        });
      } else {
        if (userdata) {
  virtual_cases.findByIdAndRemove(
    { _id: req.params.case_id },
    function (err, doc) {
      console.log('doc', doc)
      if (err && !doc) {
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
            msg: "case is deleted",
          });
        
      }
    })

  }
  else{
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Case is not found",
    });
  }
 }

});
 }
})

router.post("/AddCase", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_cases.findOne(
      { patient_id: req.body.patient_id, inhospital: { $eq: true }, house_id: req.body.house_id },
      function (err, userdata) {
        try{

        if (err) {
          console.log("err",err)
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: err,
          });
        } else {
            console.log("userdata",userdata)
          if (userdata) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "case is already exist in hospital",
            });
          } else {
            var Virtual_Cases = new virtual_cases(req.body);
            Virtual_Cases.save(function (err, user_data) {
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
                  data: user_data._id,
                });
              }
            });
          }
        
        }
      }catch(err){
        res.json({
          status: 200,
          message: "Something went wrong.",
          error: err,
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

router.post("/checkbedAvailabilityByWard", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var beds = [];
  newArray = [];

  //  if (legit) {
  virtual_cases.find(
    {
      "wards._id": req.body.ward_id,
      "speciality._id": req.body.specialty_id,
      "house_id": req.body.house_id,
      inhospital: true
    },
    function (err, userdata) {
      if (err && !userdata) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        Virtual_Specialty.findOne(
          { _id: req.body.specialty_id },
          function (err, userdata1) {
            if (err && !userdata1) {
              res.json({ status: 200, message: "", error: err });
            } else {
              newArray = [];
              beds = returnNumberofBedOnWard(userdata1, req.body.ward_id)
              beds.forEach((item, index) => {
              var NewUsers= userdata.filter((elem)=>(elem.rooms && elem.rooms._id === item.room_id.toString())) 
              console.log('NewUsers', NewUsers)
              for (var i = 1; i <= item.bed; i++) {

                if (!NewUsers.some(e => {
                  console.log('e.bed', e.bed, i );
                  return (e.bed == i)})) {
                  newArray.push(i);
                }
              }
            })
            console.log('newArray',newArray)
              res.json({
                status: 200,
                message: "Available beds found",
                hassuccessed: true,
                data:newArray && newArray.length> 0 ? newArray.length : 0,
              });
            }
          }
        );
      }
    }
  );
});

function returnNumberofBedOnWard(array, ward_id) {
  let ward = array.wards && array.wards.find(e => e._id == ward_id);
  var beds = [];
  if(ward && ward.rooms && ward.rooms.length>0){
    ward.rooms.forEach((item, index) => {
      let bed = item.no_of_bed ? parseInt(item.no_of_bed) : 0;
      beds.push({ room_id: item._id, bed: bed })
    })
  }
  return beds;
}

//check the availablity of the bed in particular specialty, ward, and room, and house
router.post("/checkbedAvailability", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var bed = 0;
  newArray = [];
  //  if (legit) {
  virtual_cases.find(
    {
      "wards._id": req.body.ward_id,
      "speciality._id": req.body.specialty_id,
      "rooms._id": req.body.room_id,
      "house_id": req.body.house_id,
      inhospital: true
    },
    function (err, userdata) {
      if (err && !userdata) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        try{
        Virtual_Specialty.findOne(
          { _id: req.body.specialty_id },
          function (err, userdata1) {
            if (err && !userdata1) {
              res.json({ status: 200, message: "", error: err });
            } else {
              newArray = [];
              bed = returnNumberofBed(userdata1, req.body.ward_id, req.body.room_id)
              for (var i = 1; i <= bed; i++) {
                if (!userdata.some(e => e.bed == i)) {
                  newArray.push(i);
                }
              }
              res.json({
                status: 200,
                message: "Available beds found",
                hassuccessed: true,
                data: newArray,
              });
            }
          }
        );
      }catch(e){
        res.json({ status: 200, message: "Something went wrong.", error: err });
      }
    }
    }
  );
});

function returnNumberofBed(array, ward_id, room_id) {
  if(array){
    let ward = array.wards && array.wards.find(e => e._id == ward_id);
    let room = ward && ward.rooms && ward.rooms.find(e => e._id == room_id)
    let bed = room.no_of_bed ? parseInt(room.no_of_bed) : 0;
    return bed;
  }
  else{
    return 0;
  }
}

router.get("/GetInfo/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_cases.aggregate(
      [
        {
          $match: {
            _id: req.params.house_id,
            inhospital: true,
          },
        },
        {
          $group: {
            _id: "$bed",
            count: { $sum: 1 },
          },
        },
      ],
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "Something went wrong",
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

//API For Discharge Patient

router.put("/Discharge/:patient_id/:admin_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_cases.updateOne(
      { patient_id: req.params.patient_Id, },
      { inhospital: false },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "something went wrong",
            error: err,
          });
        } else {
          var ids = { track_id: uuidv1() };
          // req.body.data.created_by = encrypt(req.params.admin_id);
          // req.body.data._enc_created_by = true;
          var full_record = { ...ids, ...req.body.data };
          user.updateOne(
            { _id: req.params.patient_Id, },
            { $push: { track_record: full_record } },
            { safe: true, upsert: true },
            function (err, userdata) {
              if (err && !userdata) {
                res.json({
                  status: 200,
                  hassuccessed: false,
                  message: "something went wrong",
                  error: err,
                });
              } else {
                res.json({ status: 200, hassuccessed: true, message: "successfully discharge", data: userdata });
              }
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

// Api for Get  patient
router.get('/patient/:patient_id', function (req, res, next) {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  if (legit) {
  newDatafull = [];
  virtual_cases.findOne({ patient_id: req.params.patient_id, inhospital: { $eq: true } }, function (err, userdata) {
    if (err && !userdata) {
      res.json({ status: 200, hassuccessed: false, message: "patient not found", error: err })
      } else {
        if(userdata){
     let tasks = new Promise((resolve, reject) => {
      var ids = userdata._id.toString();
      virtual_tasks.aggregate([
        { "$facet": {
          "total_task": [
            { "$match" : {case_id: ids,  status: { "$exists": true,  }}},
            { "$count": "total_task" },
          ],
          "done_task": [
            { "$match" : {case_id: ids,  status: "done"}},
            { "$count": "done_task" }
          ]
        }},
        { "$project": {
          "total_task": { "$arrayElemAt": ["$total_task.total_task", 0] },
          "done_task": { "$arrayElemAt": ["$done_task.done_task", 0] }
        }}
      ], function (err, results) {
        resolve(results)
    })
    }).then((data3)=>{
     if(data3 && data3.length>0){
      userdata.done_task = data3[0].done_task;
      userdata.total_task = data3[0].total_task;
          res.json({
            status: 200,
            hassuccessed:true,
            message: "successfully fetch",
            data: userdata
          });
        }
        else{
          res.json({
            status: 200,
            hassuccessed:true,
            message: "successfully fetch",
            data: userdata
          });
        }
      
      }).catch((message)=>{
        res.json({
          status: 200,
          hassuccessed:true,
          message: "Patient is not found",
        })
      })
     }
     else{
      res.json({
        status: 200,
        hassuccessed:true,
        message: "Patient is not found",
      })
    }
  }
})
  } else {
    res.json({
      status: 200,
      hassuccessed:true,
      message: "Authentication required",
    })
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
