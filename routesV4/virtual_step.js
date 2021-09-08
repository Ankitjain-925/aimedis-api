require("dotenv").config();
var express = require("express");
let router = express.Router();
var virtual_step = require("../schema/virtual_step.js");
var virtual_cases = require("../schema/virtual_cases.js");
var jwtconfig = require("../jwttoken");
var fullinfo = [], newDatafull=[];

router.put("/AddStep/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_step.updateOne(
      { house_id: req.params.house_id },
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

router.post("/AddStep", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  if (legit) {
      virtual_step.findOne({house_id: req.body.house_id}, function (err, userdata) {
        if (err && !user_data) {
          res.json({ status: 200, message: "Something went wrong.", error: err });
        }
      else{
          if(userdata){
            virtual_step.updateOne(
              { house_id: req.body.house_id },
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
          }
          else{
            var Virtual_Steps = new virtual_step(req.body);
            Virtual_Steps.save(function (err, user_data) {
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
          }
      }
    })
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

// router.delete("/AddStep/:step_id", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     virtual_step.findByIdAndRemove(req.params.step_id, function (err, data) {
//       if (err) {
//         res.json({
//           status: 200,
//           hassuccessed: false,
//           message: "Something went wrong.",
//           error: err,
//         });
//       } else {
//         res.json({
//           status: 200,
//           hassuccessed: true,
//           message: "Speciality is Deleted Successfully",
//         });
//       }
//     });
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

router.get('/GetStep/:house_id', function (req, res, next) {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  if (legit) {
    newDatafull = [];
    virtual_step.findOne({house_id: req.params.house_id}, function (err, userdata) {
          if (err && !userdata) {
              res.json({ status: 200, hassuccessed: false, message: "step not found", error: err })
          } else {
            if(userdata){
              if(userdata.steps && userdata.steps.length>0){
                forEachPromise(userdata.steps, getCaes).then((data)=>{
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    message: "Steps is found",
                    data: newDatafull,
                  });
                })
              }
              else
              {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  message: "Steps is found",
                  data: []
                });
              }
            }
            else{
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Steps is found",
                data: []
              });
            }
       
              // forEachPromise(userdata, getCaes).then((data)=>{
              //   res.json({
              //     status: 200,
              //     hassuccessed: true,
              //     message: "Steps is found",
              //     data: newDatafull,
              //   });
              // })
          }
      })
  } else {
      res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
  }
})

router.get('/GetInfo/:house_id', function (req, res, next) {
      const token = (req.headers.token)
      let legit = jwtconfig.verify(token)
      if (legit) {
         virtual_step.count({_id: req.params.house_id}, function( err, count){
          console.log( "Number of beds:", count );
      }), function (err, userdata) {
              if (err && !userdata) {
                  res.json({ status: 200, hassuccessed: false, message: "Info not found", error: err })
              } else {
                  res.json({ status: 200, hassuccessed: true, data: userdata })
              }
          }
      } else {
          res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
      }
  })



// router.post("/Case_numbers/:step_id", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     virtual_step.updateOne(
//       { _id: req.params.step_id },
//       { $push: { case_numbers: req.body } },
//       { safe: true, upsert: true },
//       function (err, doc) {
//         if (err && !doc) {
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             message: "Something went wrong",
//             error: err,
//           });
//         } else {
//           if (doc.nModified == "0") {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "step is not found",
//             });
//           } else {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "Case is added",
//             });
//           }
//         }
//       }
//     );
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

// router.put("/Case_numbers/:step_id/:case_id", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     virtual_step.updateOne(
//       {
//         _id: req.params.step_id,
//         "case_numbers.case_id": req.params.case_id,
//       },
//       {
//         $set: {
//           "case_numbers.$": req.body,
//         },
//       },
//       function (err, doc) {
//         if (err && !doc) {
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             message: "Something went wrong",
//             error: err,
//           });
//         } else {
//           if (doc.nModified == "0") {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "step is not found",
//             });
//           } else {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "case is updated",
//             });
//           }
//         }
//       }
//     );
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

// router.delete("/Case_numbers/:step_id/:case_id", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//   if (legit) {
//     virtual_step.updateOne(
//       { _id: req.params.step_id },
//       { $pull: { case_numbers: { case_id: req.params.case_id } } },
//       { multi: true },
//       function (err, doc) {
//         if (err && !doc) {
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             message: "Something went wrong",
//             error: err,
//           });
//         } else {
//           if (doc.nModified == "0") {
//             res.json({
//               status: 200,
//               hassuccessed: false,
//               message: "step is not found",
//             });
//           } else {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "case is deleted",
//             });
//           }
//         }
//       }
//     );
//   } else {
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       message: "Authentication required.",
//     });
//   }
// });

// router.put(
//   "/id_numbers/cases/:fromstep_id/:tostep_id",
//   function (req, res, next) {
//     const token = req.headers.token;
//     let legit = jwtconfig.verify(token);
//     if (legit) {
//       virtual_step.updateOne(
//         { _id: req.params.fromstep_id },
//         { $pull: { case_numbers: { case_id: req.body.case_id } } },
//         { multi: true },
//         function (err, doc) {
//           virtual_step.updateOne(
//             { _id: req.params.tostep_id },
//             { $push: { id_numbers: req.body } },
//             { safe: true, upsert: true },
//             function (err, doc) {
//               if (err && !doc) {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "Something went wrong",
//                   error: err,
//                 });
//               } else {
//                 if (doc.nModified == "0") {
//                   res.json({
//                     status: 200,
//                     hassuccessed: true,
//                     message: "step is not found",
//                   });
//                 } else {
//                   res.json({
//                     status: 200,
//                     hassuccessed: true,
//                     message: "Case is moved between steps",
//                   });
//                 }
//               }
//             }
//           );
//         }
//       );
//     } else {
//       res.json({
//         status: 200,
//         hassuccessed: false,
//         message: "Authentication required.",
//       });
//     }
//   }
// );

// router.put(
//   "/Patient/:fromstep_id/:tostep_id",
//   function (req, res, next) {
//     const token = req.headers.token;
//     let legit = jwtconfig.verify(token);
//     // if (legit) {
//       virtual_step.updateOne(
//         { _id: req.params.fromstep_id },
//         { $pull: { patient: { step_id: req.body.step_id } } },
//         { multi: true },
//         function (err, doc) {
//           virtual_step.updateOne(
//             { _id: req.params.tostep_id },
//             { $push: {patient: req.body } },
//             { safe: true, upsert: true },
//             function (err, doc) {
//               if (err && !doc) {
//                 res.json({
//                   status: 200,
//                   hassuccessed: false,
//                   message: "Something went wrong",
//                   error: err,
//                 });
//               } else {
//                 if (doc.nModified == "0") {
//                  res.json({
//                     status: 200,
//                     hassuccessed: true,
//                     message: "step is not found",
//                   });
//                 } else {
//                   res.json({
//                     status: 200,
//                     hassuccessed: true,
//                     message: "patient is moved between steps",
//                   });
//                 }
//               }
//             }
//           );
//         }
//       );
//     // } else {
//     //   res.json({
//     //     status: 200,
//     //     hassuccessed: false,
//     //     message: "Authentication required.",
//     //   });
// });
  

// router.delete("/Patient/:step_id", function (req, res, next) {
//   const token = req.headers.token;
//   let legit = jwtconfig.verify(token);
//    if (legit) {
//     virtual_step.updateOne(
//       { _id: req.params.step_id },
//       { $pull: { patient: { step_id: req.params.step_id } } },
//       { multi: true },
//       function (err, doc) {
//         if (err && !doc) {
//           res.json({
//             status: 200,
//             hassuccessed: false,
//             message: "Something went wrong",
//             error: err,
//           });
//         } else {
//           if (doc.nModified == "0") {
//             res.json({
//               status: 200,
//               hassuccessed: false,
//               message: "step is not found",
//             });
//           } else {
//             res.json({
//               status: 200,
//               hassuccessed: true,
//               message: "patient is removed",
//             });
//           }
//         }
//       }
//     );
//    } else {
//      res.json({
//        status: 200,
//        hassuccessed: false,
//        message: "Authentication required.",
//      });
//     }
// })

function getCaes(data1){
  console.log('dataaaaa', data1)
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
      fullinfo = [];
      if(data1.case_numbers && data1.case_numbers.length>0){
        forEachPromise(data1.case_numbers, getfullInfo).then((data)=>{
          var finald = data1;
          finald.case_numbers = data;
            newDatafull.push(finald);
            resolve(newDatafull);
        })
      }
      else{
        newDatafull.push(data1);
        resolve(newDatafull);
      }
  })
  })
}

function getfullInfo(data) {
  console.log('data34d', data)
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      virtual_cases.findOne({ _id: data.case_id })
        .exec()
        .then(function (doc3) {
          if(doc3){
            fullinfo.push(doc3);
            }
          resolve(fullinfo);
        });
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
