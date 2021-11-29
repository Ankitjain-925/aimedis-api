var express = require("express");
let router = express.Router();
var Virtual_Specialty = require("../schema/virtual_specialty.js");
var virtual_Case = require("../schema/virtual_cases.js");
var virtual_Task = require("../schema/virtual_tasks.js");
var virtual_Service = require("../schema/virtual_services.js");
var virtual_Invoice = require("../schema/virtual_invoice.js");
var User = require("../schema/user.js");
var Institute = require("../schema/institute.js");
var Appointments = require("../schema/appointments");
var virtual_step = require("../schema/virtual_step");
var jwtconfig = require("../jwttoken");
const { TrunkInstance } = require("twilio/lib/rest/trunking/v1/trunk");
var fullinfo = [];
var Appoint = [];
router.delete("/AddSpecialty/:specialty_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_Specialty.findByIdAndRemove(
      req.params.specialty_id,
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
            message: "Speciality is Deleted Successfully",
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

router.put("/AddSpecialty/:specialty_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_Specialty.updateOne(
      { _id: req.params.specialty_id },
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

router.post("/AddSpecialty", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var Virtual_Specialtys = new Virtual_Specialty(req.body);
    Virtual_Specialtys.save(function (err, user_data) {
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

router.get("/AddSpecialty/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    Virtual_Specialty.find(
      { house_id: req.params.house_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
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

router.post("/AddTask", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var Virtual_tasks = new virtual_Task(req.body);
    Virtual_tasks.save(function (err, user_data) {
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

router.delete("/AddTask/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.findByIdAndRemove(req.params.task_id, function (err, data) {
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
          message: "Task is Deleted Successfully",
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

router.put("/AddTask/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.updateOne(
      { _id: req.params.task_id },
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
            message: "Task is updated",
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

router.get("/GetAllTask/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { house_id: req.params.house_id, archived: { $ne: true } },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
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

router.get("/GetAllArchivedTask/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { house_id: req.params.house_id, archived: { $eq: true } },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
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

router.get("/AddTask/:task_ids", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.findOne(
      { _id: req.params.task_ids },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
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

router.get("/PatientsTask/:patient_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    const messageToSearchWith = new virtual_Task({
      patient_id: req.params.patient_id,
    });
    messageToSearchWith.encryptFieldsSync();
    virtual_Task.find(
      { patient_id: messageToSearchWith.patient_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
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

router.get("/ProfessionalTask/:patient_profile_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Task.find(
      { "assinged_to.profile_id": req.params.patient_profile_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong",
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

router.post("/ProfessionalTaskComment/:task_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    req.body.comment_id =
      req.params.task_id + "_" + req.body.comment_by + "_" + Date.now();
    virtual_Task.updateOne(
      { _id: req.params.task_id },
      { $push: { comments: req.body } },
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
              message: "Task is not found",
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Comment is added",
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

router.put(
  "/ProfessionalTaskComment/:task_id/:comment_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_Task.updateOne(
        {
          _id: req.params.task_id,
          "comments.comment_id": req.params.comment_id,
        },
        {
          $set: {
            "comments.$": req.body,
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
                message: "Task is not found",
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Comment is updated",
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

router.delete(
  "/ProfessionalTaskComment/:task_id/:comment_id",
  function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_Task.updateOne(
        { _id: req.params.task_id },
        { $pull: { comments: { comment_id: req.params.comment_id } } },
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
                message: "Comment is not found",
              });
            } else {
              res.json({
                status: 200,
                hassuccessed: true,
                message: "Comment is deleted",
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

router.delete("/AddService/:service_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Service.findByIdAndRemove(
      req.params.service_id,
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
            message: "Service is Deleted Successfully",
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

router.put("/AddService/:service_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Service.updateOne(
      { _id: req.params.service_id },
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
            message: "Service is updated",
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

router.post("/AddService", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var Virtual_Services = new virtual_Service(req.body);
    Virtual_Services.save(function (err, user_data) {
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

router.get("/GetService/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Service.find(
      { house_id: req.params.house_id },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "services not found",
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

router.delete("/AddInvoice/:bill_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Invoice.findByIdAndRemove(req.params.bill_id, function (err, data) {
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
          message: "Invoice is Deleted Successfully",
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

router.put("/AddInvoice/:bill_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Invoice.updateOne(
      { _id: req.params.bill_id },
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
            message: "Invoice is updated",
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

router.post("/AddInvoice", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var virtual_Invoices = new virtual_Invoice(req.body);
    virtual_Invoices.save(function (err, user_data) {
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

router.get("/AddInvoice/:house_id/:status", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var search = { house_id: req.params.house_id };
    if (req.params.status !== "all") {
      var search = {
        house_id: req.params.house_id,
        "status.value": req.params.status,
      };
    }
    virtual_Invoice.find(search, function (err, userdata) {
      if (err && !userdata) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "invoice not found",
          error: err,
        });
      } else {
        res.json({ status: 200, hassuccessed: true, data: userdata });
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

router.get("/infoOfHouses", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    fullInfo = [];
    User.findOne({ _id: legit.id }, function (err, userdata) {
      if (err && !userdata) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "user not found",
          error: err,
        });
      } else {
        if (userdata && userdata.houses && userdata.houses.length > 0) {
          forEachPromise(userdata.houses, getfullInfo).then((result) => {
            res.json({
              status: 200,
              hassuccessed: true,
              message: "Houses is found",
              data: fullInfo,
            });
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

router.post("/checkPatient", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    if (req.body.patient_id) {
      const profile_id = req.body.patient_id;
      const messageToSearchWith = new User({ profile_id });
      messageToSearchWith.encryptFieldsSync();
      const alies_id = req.body.patient_id;
      const messageToSearchWith1 = new User({ alies_id });
      messageToSearchWith1.encryptFieldsSync();
      User.findOne(
        {
          $or: [
            { profile_id: messageToSearchWith.profile_id },
            { alies_id: messageToSearchWith1.alies_id },
            { profile_id: req.body.patient_id },
            { alies_id: req.body.patient_id },
          ],
        },
        function (err, userdata) {
          if (err) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Something went wrong.",
              error: err,
            });
          } else {
            if (userdata) {
              var createCase = false;
              if (req.body.pin) {
                createCase = req.body.pin == userdata.pin ? true : false;
              } else {
                var pos =
                  userdata &&
                  userdata.assosiated_by.filter(
                    (data) => data.institute_id === req.body.institute_id
                  );
                createCase =
                  userdata.parent_id === req.body.institute_id
                    ? true
                    : pos && pos.length > 0
                    ? true
                    : false;
              }
              if (createCase) {
                res.json({
                  status: 200,
                  hassuccessed: true,
                  message: "information get successfully",
                  data: userdata,
                });
              } else {
                if (req.body.pin) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "pin is not correct",
                  });
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    message: "user is not associated need pin to add",
                  });
                }
              }
            } else {
              res.json({
                status: 200,
                hassuccessed: false,
                message: "patient is not exist",
              });
            }
          }
        }
      );
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        message: "Please enter patient id",
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

router.post("/addPatientToVH", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    var virtual_Cases = new virtual_Case(req.body);
    virtual_Cases.save(function (err, user_data) {
      if (err && !user_data) {
        res.json({ status: 200, message: "Something went wrong.", error: err });
      } else {
        res.json({
          status: 200,
          message: "Case number is assigned",
          hassuccessed: true,
          data: user_data._id,
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

router.put("/addPatientToVH/:case_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.updateOne(
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
          res.json({
            status: 200,
            hassuccessed: true,
            message: "Case is updated",
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

router.delete("/addPatientToVH/:case_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.findByIdAndRemove(req.params.case_id, function (err, data) {
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
          message: "Case is Deleted Successfully",
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

router.get("/getPatientFromVH/:house_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    virtual_Case.find(
      { $and: [{ house_id: req.params.house_id }, { inhospital: true }] },
      function (err, user_data) {
        if (err && !user_data) {
          res.json({
            status: 200,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          res.json({
            status: 200,
            message: "Get the patients",
            hassuccessed: true,
            data: user_data,
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

router.get("/getAppointTask/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      { "houses.value": req.params.House_id, type: "doctor" },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
            error: err,
          });
        } else {
          Promise.all([
            virtualAppointment(userdata),
            virtualTask(req.params.House_id),
          ]).then((list1) => {
            var flatArray = Array.prototype.concat.apply([], list1);
            console.log("dsfgsdfsdfsdf",flatArray);
            res.json({
              status: 200,
              hassuccessed: true,
              data: flatArray,
            });
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

router.get("/getAppointTask1/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
    User.find(
      { "houses.value": req.params.House_id, type: "doctor" },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "specialities not found",
            error: err,
          });
        } else {
          virtualTask(req.params.House_id).then((list) => {
            res.json({ status: 200, hassuccessed: true, data: list });
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

router.get("/statisticstopinfo/:House_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);

  if (legit) {
    Promise.all([
      virtualCase(req.params.House_id),
      User_Case(req.params.House_id),
      User_Case1(req.params.House_id),
    ]).then((count, list, list1) => {
      res.json({ status: 200, hassuccessed: true, data: count, list, list1 });
    });
  } else {
    res.json({
      status: 200,
      hassuccessed: false,
      message: "Authentication required.",
    });
  }
});

router.get("/stasticsrightinfo/:House_id", function (req, res, next) {
  virtual_step.find(
    { house_id: req.params.House_id },
    function (err, userdata) {
      if (err) {
        res.json({
          status: 200,
          hassuccessed: false,
          message: "specialities not found",
          error: err,
        });
      } else {
        let step_count = userdata.map((element) => element.steps);
        let count = step_count[0].map((element) => {
          return {
            step_name: element.step_name,
            counts: element.case_numbers ? element.case_numbers.length : 0,
          };
        });
        res.json({ status: 200, hassuccessed: true, data: count });
      }
    }
  );
});

function User_Case(House_id) {
  return new Promise((resolve, reject) => {
    User.countDocuments(
      { "houses.value": House_id, type: "doctor" },
      function (err, userdata) {
        if (err) {
          reject(err);
        } else {
          resolve(userdata);
        }
      }
    );
  });
}

function User_Case1(House_id) {
  return new Promise((resolve, reject) => {
    User.countDocuments(
      { "houses.value": House_id, type: "nusre" },
      function (err, userdata) {
        if (err) {
          reject(err);
        } else {
          resolve(userdata);
        }
      }
    );
  });
}
function virtualCase(House_id) {
  return new Promise((resolve, reject) => {
    virtual_Case.countDocuments(
      { house_id: House_id, inhospital: true },
      function (err, count) {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      }
    );
  });
}

function virtualTask(house_id) {
  return new Promise((resolve, reject) => {
    virtual_Task.find({ house_id: house_id }, function (err, list) {
      if (err) {
        reject(err);
      } else {
        console.log('tasklist', list)
        var finaldata = [...list];
        resolve(finaldata);
      }
    });
  });
}

function virtualAppointment(userdata) {
  return new Promise((resolve, reject) => {
    Appoint = [];
    forEachPromise(userdata, getApointsDoctor).then((result) => {
      console.log("Appoint", Appoint);
      resolve(Appoint);
    });
  });
}

function getApointsDoctor(user) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      if (user) {
        const AppointToSearchWith = new Appointments({ doctor_id: user._id });
        AppointToSearchWith.encryptFieldsSync();
        Appointments.find(
          {
            $or: [
              { doctor_id: user._id },
              { doctor_id: AppointToSearchWith.doctor_id },
            ],
          },
          function (err, list1) {
            if (err) {
              reject(err);
            } else {
              if (list1) {
                console.log("list1", list1);
                Appoint = [...Appoint, ...list1];
                console.log("finalAppoint", Appoint);
                resolve(Appoint);
              }
            }
          }
        );
      } else {
        console.log("I am here");
        resolve(Appoint);
      }
    });
  });
}

function getfullInfo(data) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      Institute.findOne({ "institute_groups.houses.house_id": data.value })
        .exec()
        .then(function (doc3) {
          pos = fullinfo.filter((data) => data._id === doc3._id);
          if (pos && pos.length === 0) {
            fullInfo.push(doc3);
          }
          resolve(fullInfo);
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
