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
    var answerspatients = new answerspatient(req.body);
    answerspatients.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        virtual_Case.findOneAndUpdate({ patient_id: req.body.patient_id, inhospital: false, viewQuestionaire: true, house_id: req.body.house_id }, {
          $set: {
            submitQuestionaire: true, viewQuestionaire: false
          }
        },function (err, data) {
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
    answerspatient.find(
      { house_id: req.params.house_id },
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
          console.log("userdata",userdata)
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
    const house_id = req.params.house_id;
    const messageToSearchWith = new questionaire({ house_id });
    messageToSearchWith.encryptFieldsSync();
    questionaire.find(
      { house_id: messageToSearchWith.house_id },
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
