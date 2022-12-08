var express = require("express");
let router = express.Router();
const institute = require("../schema/institute.js")
var User = require("../schema/user.js");

var uuidv1 = require('uuid/v1');
var jwtconfig = require("../jwttoken");
var fullinfo = [];


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
                    final.push(data3)
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
  try {
    if (legit) {
      let staff = req.body.staff;  
      if(staff && staff.length>0){
        let patient_en = staff.map((element) => {
          var VirtualtToSearchWith = new User({ profile_id: element });
          VirtualtToSearchWith.encryptFieldsSync();
          return VirtualtToSearchWith.profile_id;
        });
  
        let final_house_id = [...patient_en, ...staff];
        User.find({ profile_id: { $in: final_house_id } })
          .exec()
          .then(function (doc5) {
            if (doc5) {
              var userlists = doc5.map((element) => {
                return ({user_id: element._id, profile_id: element.profile_id, alies_id: element.alies_id, image: element.image, first_name: element.first_name, last_name: element.last_name});
              });
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "Successfully Fetched",
                data: userlists
              });
            }
            else {
              res.json({
                status: 200,
                hassuccessed: true,
                msg: "No data available",
                data: []
              });
            }
          })
        }
        else{
          res.json({
            status: 200,
            hassuccessed: false,
            msg: "there is no staff",
          });
        }
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
    if (data) {
      var staff = data.staff;
      if(staff && staff.length>0){
      let patient_en = staff.map((element) => {
        var VirtualtToSearchWith = new User({ profile_id: element });
        VirtualtToSearchWith.encryptFieldsSync();
        return VirtualtToSearchWith.profile_id;
      });

      let final_house_id = [...patient_en, ...staff];
      User.find({ profile_id: { $in: final_house_id } })
        .exec()
        .then(function (doc5) {
          if (doc5) {
            var userlists = doc5.map((element) => {
              return ({user_id: element._id, profile_id: element.profile_id, alies_id: element.alies_id, image: element.image, first_name: element.first_name, last_name: element.last_name});
            });
            data.staff = userlists;
            fullinfo.push(data);
            resolve(fullinfo);
          }
          else {
            fullinfo.push(data);
            resolve(fullinfo);
          }
        })
      }
      else{
        fullinfo.push(data);
        resolve(fullinfo);
      }
    }
    else {
      resolve(fullinfo);
    }

  });

}


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


router.put("/UpdateTeam/:house_id/:staff_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.updateOne(
        {
          'institute_groups.houses.teammember.staff_id': req.params.staff_id
        },
        {
          $set: {
            'institute_groups.$.houses.$[e1].teammember.$[e2].ward_id': req.body.ward_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].speciality_id': req.body.speciality_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].staff': req.body.staff,
          }
        },
        { "arrayFilters": [{ "e1.house_id": req.params.house_id }, { "e2.staff_id": req.params.staff_id }] },
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

module.exports = router;   