var express = require("express");
let router = express.Router();
var questionaire = require("../schema/questionaire.js");
var answerspatient = require("../schema/answerspatient.js");
var virtual_Case = require("../schema/virtual_cases.js");
var jwtconfig = require("../jwttoken");
var fullinfo = [];

router.post("/AddAnswerspatient", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      const patient_id = req.body.patient_id;
      const house_id = req.body.house_id;
      const messageToSearchWith = new virtual_Case({ patient_id })
      messageToSearchWith.encryptFieldsSync();
      const messageToSearchWith1 = new virtual_Case({ house_id })
      messageToSearchWith1.encryptFieldsSync();
      var answerspatients = new answerspatient(req.body);
      console.log("1")
      answerspatients.save(function (err, user_data) {
        if (err && !user_data) {
          res.json({ status: 200, message: "Something went wrong.", error: err });
        } else {
          console.log("112")
          virtual_Case.findOneAndUpdate({ patient_id: { $in: [req.body.patient_id, messageToSearchWith.patient_id] }, inhospital: false, viewQuestionaire: true, house_id: { $in: [req.body.house_id, messageToSearchWith1.house_id] } }, {
            $set: {
              submitQuestionaire: true, viewQuestionaire: false
            }
          }, function (err, data) {
            if (err && !data) {
              res.json({ status: 200, message: "Something went wrong.", error: err });
            }
            else {
              res.json({
                status: 200,
                message: "Added Successfully",
                hassuccessed: true,
              });
            }
          })
        }
      });
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
});

router.put("/Answer/:answerspatient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      answerspatient.updateOne(
        { _id: req.params.answerspatient_id },
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
              message: " answerspatient is updated",
              data: userdata,
            });
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
});

router.delete("/Answer/:answerspatient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      answerspatient.findByIdAndRemove(
        { _id: req.params.answerspatient_id },
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
              message: "answerspatient is deleted Successfully",
            });
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
});

router.get("/GetAnswerspatient/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      let house_id = req.params.house_id
      const messageToSearchWith = new answerspatient({ house_id });
      messageToSearchWith.encryptFieldsSync();
      answerspatient.find(
        { $or: [{ house_id: req.params.house_id }, { house_id: messageToSearchWith.house_id }] },
        function (err, userdata) {
          if (err && !userdata) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "answerspatient not found",
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
});

router.post("/AddQuestionaire", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      var questionaires = new questionaire(req.body);
      questionaires.save(function (err, user_data) {
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
});

router.put("/Question/:questionaire_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        questionaire.updateOne(
            { _id: req.params.questionaire_id },
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
                        message: "Questionaire is updated",
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

router.get("/GetQuestionaire/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    try {
      const house_id = req.params.house_id;
      const messageToSearchWith = new questionaire({ house_id });
      messageToSearchWith.encryptFieldsSync();
      questionaire.find(
        { $or: [{ house_id: messageToSearchWith.house_id }, { house_id: house_id }] },
        function (err, userdata) {
          if (err && !userdata) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "questionaire not found",
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
});

// router.get('/GetQuestionaire/:house_id', function (req, res, next) {
//     const token = (req.headers.token)
//     let legit = jwtconfig.verify(token)
//     if (legit) {
//         questionaire.find({house_id: req.params.house_id}, function (err, userdata) {
//             if (err && !userdata) {
//                 res.json({ status: 200, hassuccessed: false, message: "questionaire not found", error: err })
//             } else {
//                 res.json({ status: 200, hassuccessed: true, data: userdata })
//             }
//         })
//     } else {
//         res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
//     }
// })


module.exports = router;
