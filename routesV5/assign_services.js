require("dotenv").config();
var express = require("express");
let router = express.Router();
var assigned_Service = require("../schema/assigned_service.js");
var Appointments =  require("../schema/appointments.js")
var virtual_Task =  require("../schema/virtual_tasks.js")
const moment = require("moment");
var CheckRole = require("../middleware/middleware")

var jwtconfig = require("../jwttoken");

router.post("/Addassignservice", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
  var assigndata = new assigned_Service(req.body)
  assigndata.save(function (err, user_data) {
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
  }else{
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.put("/Updateassignservice/:_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    assigned_Service.updateOne(
      { _id: req.params._id },
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
            message: "Assignservice is updated",
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

router.delete("/Deleteassignservice/:_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    assigned_Service.findByIdAndRemove(
      req.params._id,
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
            message: "Assignservice is Deleted Successfully",
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

router.get("/getAssignedServices/:house_id",CheckRole("get_assignedservice"), function (req, res, next) {
      const token = req.headers.token;
      let legit = jwtconfig.verify(token);
      if (legit) {
        try{
        let house_id =req.params.house_id
        const messageToSearchWith = new assigned_Service({house_id });
        console.log(messageToSearchWith)
        messageToSearchWith.encryptFieldsSync();
        assigned_Service.find(
          {$or:[ {house_id: req.params.house_id},{house_id: messageToSearchWith.house_id}] },
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
      
function mySorter(a, b) {
  if (a.created_at && b.created_at) {
    var x = a.created_at.toLowerCase();
    var y = b.created_at.toLowerCase();
    return x > y ? -1 : x < y ? 1 : 0;
  } else {
    return -1;
  }
}

function mySorter1(a, b) {
  if (a.date && b.date) {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
  } else {
    return -1;
  }
}

router.get("/getAllactivities/:user_id/:profile_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    doctor_id = req.params.user_id;
    const AppointToSearchWith = new Appointments({ doctor_id });
    AppointToSearchWith.encryptFieldsSync();
    if (legit) {
      var arr1 = [];
      var arr2 = [];
      var arr3 = [];
      var finalArray = [];
try{
      Appointments.find({
        $or: [
          { doctor_id: doctor_id },
          { doctor_id: AppointToSearchWith.doctor_id },
        ]
      },
        function (err, userdata1) {
          if (err && !userdata1) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
              error: err,
            });
          } else {
            assigned_Service.find({ $or:[{"assinged_to.user_id": doctor_id},{"assinged_to.staff":req.params.profile_id}] },
              function (err, userdata2) {
                if (err && !userdata2) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "Something went wrong",
                    error: err,
                  });
                } else {
                  virtual_Task.find(
                    {
                      $and:[
                      {$or:[{"assinged_to.user_id": doctor_id},{"assinged_to.staff":req.params.profile_id}]},
                      {$or: [{ is_decline: { $exists: false } }, { is_decline: false }]},
                      ]
                    },
                    function (err, userdata3) {
                    
                      if (err && !userdata3) {
                        res.json({
                          status: 200,
                          hassuccessed: false,
                          message: "Something went wrong",
                          error: err,
                        });
                      } else {
                        for (i = 0; i < userdata1.length; i++) {

                          let today = new Date().setHours(0, 0, 0, 0);

                          let data_d = new Date(userdata1[i].date).setHours(0, 0, 0, 0);

                          if (moment(data_d).isSameOrAfter(today)) {
                            // userdata1.sort(mySorter);
                            arr1.push(userdata1[i])
                          }

                        }

                        for (i = 0; i < userdata2.length; i++) {

                          let today2 = new Date().setHours(0, 0, 0, 0);

                          let data_d2 = new Date(userdata2[i].due_on.date).setHours(0, 0, 0, 0);

                          if (moment(data_d2).isSameOrAfter(today2)) {
                            // userdata2.sort(mySorter);
                            arr2.push(userdata2[i])
                          }
                        }

                        

                        for (i = 0; i < userdata3.length; i++) {
                          // if (userdata3[i].task_type == "sick_leave") {
                          //   let today = new Date().setHours(0, 0, 0, 0);
                          //   let data_d = new Date(userdata3[i].date).setHours(0, 0, 0, 0);
                          //   if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
                          //     // userdata3.sort(mySorter);
                          //     arr3.push(userdata3[i])
                          //   }
                          // }
                          let today = new Date().setHours(0, 0, 0, 0);
                          let data_d = new Date(userdata3[i].due_on.date).setHours(0, 0, 0, 0);
                          if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
            
                            arr3.push(userdata3[i])
                          }
                          if (moment(data_d).isBefore(today) && userdata3[i].status !== "done") {
            
                            arr3.push(userdata3[i])
                          }
                        }

                        finalArray = [...arr1, ...arr2, ...arr3];

                        finalArray.sort(mySorter1);
                        res.json({ status: 200, hassuccessed: true, data: finalArray });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
      } catch {
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
  }
);


module.exports = router;