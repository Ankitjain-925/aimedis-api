var express = require("express");
let router = express.Router();
var User = require("../schema/user.js");
var Institute = require("../schema/institute");
var jwtconfig = require("../jwttoken");

router.put("/institute/:institute_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.updateOne(
      { _id: req.params.institute_id },
      req.body,
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "something went wrong",
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

router.get("/institute/:institute_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.findOne(
      { _id: req.params.institute_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "institute is not found",
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

router.delete("/AddGroup/:institute_id/:group_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.updateOne(
      { _id: req.params.institute_id },
      { $pull: { institute_groups: { _id: req.params.group_id } } },
      { multi: true },
      function (err, userdata) {
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
            message: "Deleted Successfully",
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

router.put("/AddGroup/:institute_id/:group_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.findOneAndUpdate(
      {
        _id: req.params.institute_id,
        "institute_groups._id": req.params.group_id,
      },
      {
        $set: {
          "institute_groups.$": req.body,
        },
      },
      function (err, doc) {
        if (err && !doc) {
          res.json({ 
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Group Institute is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Group Institute is updated",
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

router.put("/AddGroup/:institute_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Institute.findOneAndUpdate(
      {
        _id: req.params.institute_id,
      },
      { $push: { institute_groups: req.body } },
      { safe: true, upsert: true },
      function (err, doc) {
        if (err && !doc) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          if (doc.nModified == "0") {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Group Institute is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Group Institute is added",
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

router.put("/associatedTo/:userid", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      {
        _id: req.params.userid,
        assosiated_by: { $elemMatch: { institute_id: req.body.institute_id } },
      },
      function (err2, userdata2) {
        if (err2) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "something went wrong",
            error: err2,
          });
        } else {
          if (userdata2.length != 0) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Already associated with the institute",
              error: err2,
            });
          } else {
            User.findOneAndUpdate(
              { _id: req.params.userid },
              { $push: { assosiated_by: req.body } },
              { upsert: true },
              function (err2, updatedata) {
                if (err2 && !updatedata) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "something went wrong",
                    error: err2,
                  });
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    message: "user associated with institute successfully",
                  });
                }
              }
            );
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

router.delete("/associatedTo/:user_id/:institute_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      User.updateOne(
        { _id: req.params.user_id },
        { $pull: { assosiated_by: { institute_id: req.params.institute_id } } },
        { multi: true },
        function (err, doc) {
          if (err && !doc) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong",
              error: err,
            });
          } else {
            if (doc.nModified == "0") {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "User/ Institute is not found",
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "User associated with the hopital admin",
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
  }
);

router.put("/assignedHouse/:userid", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      {
        _id: req.params.userid,
        houses: { $elemMatch: { value: req.body.value } },
      },
      function (err2, userdata2) {
        if (err2) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "something went wrong",
            error: err2,
          });
        } else {
          if (userdata2.length != 0) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "House already exist",
              error: err2,
            });
          } else {
            User.findOneAndUpdate(
              { _id: req.params.userid },
              { $push: { houses: req.body } },
              { upsert: true },
              function (err2, updatedata) {
                if (err2 && !updatedata) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "something went wrong",
                    error: err2,
                  });
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    message: "House is assigned",
                  });
                }
              }
            );
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

router.delete("/assignedHouse/:userid/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.updateOne(
      { _id: req.params.userid },
      { $pull: { houses: { value: req.params.house_id } } },
      { multi: true },
      function (err, userdata) {
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
            message: "Deleted Successfully",
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

router.get("/GetProfessional/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  var finalArray = []
  var arr1 = []
  var final = []
  if (legit) {
    User.find(
      {
        $or : [{type: 'doctor'}, {type : 'nurse'}],
        houses: { $elemMatch: { value: req.params.house_id } },
      },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
            error: err,
          });
        } else {
          Institute.find({
            'institute_groups.houses.house_id': req.params.house_id
          })
            .exec(function (err, data) {
              if (data) {
                data.forEach(function (dataa) {
                  dataa.institute_groups.forEach(function (data1) {
                    data1.houses.forEach(function (data2) {
                      if (data2.house_id == req.params.house_id ) {                                          
                            final.push(data2)
                      }
                    });
                  });
                });
                 arr1.push(userdata) 
                 finalArray = [...arr1, ...final];
                res.json({
                  status: 200,
                  hassuccessed: true,
                  msg: "Successfully Fetched",
                  data: finalArray
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

module.exports = router;
