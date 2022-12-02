var express = require("express");
let router = express.Router();
const institute = require("../schema/institute.js")
var User = require("../schema/user.js");
var uuidv1 = require('uuid/v1');
var jwtconfig = require("../jwttoken");
// var nodemailer = require("nodemailer");
// const {
//   EMAIL,
//   generateTemplate,
// } = require("../emailTemplate/index.js");
// var transporter = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: 25,
//   secure: false,
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//   },
// });

router.get("/GetTeam/:house_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var final = []
  fullinfo = [];
  try {
    if (legit) {
      institute.findOne({
        'institute_groups.houses.house_id': req.params.house_id
      })
        .exec(function (err, data) {
          if (data) {
            data.institute_groups.forEach(function (data1) {
              data1.houses.forEach(function (data2) {
                if (data2.house_id == req.params.house_id) {
                  data2.teammember.forEach(function (data3) {
                    data3.staff.forEach(function (data4) {
                      final.push(data4)
                    });
                  });
                }
              });
            });
            forEachPromise(final, getfull).then((result) => {
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "Successfully Fetched",
                data: fullinfo
              });
            })
          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
            });
          }
        })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});



router.post("/GetTeamStaff", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  fullinfo = [];
  try {
    if (legit) {
      forEachPromise(req.body.staff, getfull).then((result) => {
        res.json({
          status: 200,
          hassuccessed: true,
          msg: "Successfully Fetched",
          data: fullinfo
        });
      })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

function forEachPromise(items, fn) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item);
    });
  }, Promise.resolve());
}

function getfull(data) {
  return new Promise((resolve, reject) => {
    try {
      if (data) {
        const VirtualtToSearchWith = new User({ profile_id: data });
        VirtualtToSearchWith.encryptFieldsSync();
        User.findOne({
          $or: [

            { profile_id: data },
            { profile_id: VirtualtToSearchWith.profile_id },

          ],
        })
          .exec()
          .then(function (doc5) {
            if (doc5) {
              fullinfo.push(doc5)
              resolve(fullinfo);
            }
            else {
              resolve(fullinfo);
            }
          })
      }
      else {
        resolve(fullinfo);
      }
    } catch (error) {
      console.log(error)
      resolve(data);
    }
  });

}



router.get("/GetTeamGroup/:house_id/:staff_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var final = []
  try {
    if (legit) {
      institute.find({
        'institute_groups.houses.house_id': req.params.house_id
      })
        .exec(function (err, data) {
          if (data) {
            data.forEach(function (dataa) {
              dataa.institute_groups.forEach(function (data1) {
                data1.houses.forEach(function (data2) {
                  if (data2.house_id == req.params.house_id) {
                    let final_data2 = data2.teammember.filter(item => item.staff_id == req.params.staff_id)
                    final.push(final_data2)
                  }
                });

              });
            });
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "Successfully Fetched",
              data: final
            });

          } else {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              data: final
            });
          }
        })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});




router.post("/AddGroup", function (req, res) {

  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.findOne({
        'institute_groups.houses.teammember.team_name': req.body.team_name
      })
        .exec(function (err, data) {
          if (data) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Group Already Exist",
            });
          } else {
            const userdata = {
              ward_id: req.body.ward_id,
              speciality_id: req.body.speciality_id,
              team_name: req.body.team_name,
              staff: req.body.staff,
              staff_id: uuidv1()
            }
            institute.updateOne(
              {
                'institute_groups.houses.house_id': req.body.house_id
              },
              {
                $push: {
                  'institute_groups.$.houses.$[e].teammember': userdata
                }
              },
              { "arrayFilters": [{ "e.house_id": req.body.house_id }] },
              function (err, data) {
                if (err && !data) {
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
                    msg: "Group add successfully",
                    data: data,
                  });
                }
              }
            );
          }
        })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
      });
    }
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.put("/UpdateTeam/:house_id/:team_name", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.updateOne(
        {
          'institute_groups.houses.teammember.team_name': req.params.team_name
        },
        {
          $set: {
            'institute_groups.$.houses.$[e1].teammember.$[e2].ward_id': req.body.ward_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].speciality_id': req.body.speciality_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].staff': req.body.staff,
          }
        },
        { "arrayFilters": [{ "e1.house_id": req.params.house_id }, { "e2.team_name": req.params.team_name }] },
        function (err, data) {
          if (err && !data) {
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
              msg: "Group  Updated",
              data: data,
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

router.delete("/DeleteTeam/:house_id/:staff_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.updateOne(
        {
          'institute_groups.houses.teammember.staff_id': req.params.staff_id
        },
        {
          $pull: {
            "institute_groups.$[].houses.$[].teammember": { staff_id: req.params.staff_id }
          }
        },
        function (err, data) {
          if (err && !data) {
            console.log("err", err)
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
              msg: "Group  Delete Successfully",
              data: data,
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
  } catch (err) {
    res.json({
      status: 200,
      hassuccessed: false,
      msg: "Some thing went wrong.",
    });
  }
});

// router.post("/FormMail", function (req, res) {
//   try {
//     var sendData = "Dear Admin," + "<br/>";
//     "Here is the new Aimedis Staff request from the " +
//       req.body.type +
//       req.body.first_name +
//       req.body.last_name +
//       // req.body.email +
//       // req.body.dob +
//       // req.body.address +
//       // req.body.city +
//       // req.body.country +
//       // req.body.PlaceOfBirth +

//       "<br/>" +
//       "Please check the list of requests from the list page. Please update the status of request also accordingly.";
//     generateTemplate(
//       EMAIL.generalEmail.createTemplate("en", { title: "", content: sendData }),

//       (error, html) => {
//         if (req.body.email !== "") {
//           let mailOptions = {
//             from: "contact@aimedis.com",
//             to: "suhel.webnexus@gmail.com",
//             subject: "User Data",
//             html: html,
//           };
//           let sendmail = transporter.sendMail(mailOptions);
//           if (sendmail) {
//             res.json({
//               status: 200,
//               message: "Mail sent Successfully",
//               hassuccessed: true,
//             });
//           } else {
//             res.json({
//               status: 200,
//               msg: "Mail is not sent",
//               hassuccessed: false,
//             });
//           }
//         } else {
//           res.json({ status: 200, msg: "Mail is not sent", hassuccessed: false });
//         }
//       }
//     );
//   } catch (err) {
//     assert.isNotOk(err, 'Promise error');
//     done();
//     res.json({
//       status: 200,
//       hassuccessed: false,
//       msg: "Some thing went wrong.",
//     });
//   }
// });


// router.get("/sv/:team_name", async(req, res, next)=> {
//   try{
//   console.log(req.params.id);
//   const getdtata = await institute.findOne({'institute_groups.houses.teammember':{$elemMatch: {'institute_groups.houses.teammember.team_name': req.params.team_name}}}).pretty();
//   res.status(200).send(getdtata)
//   console.log(getdtata.length)
//   }

// catch(err){
//   res.status(400).send(err)
// }
// })

module.exports = router;   