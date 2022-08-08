require("dotenv").config();
var express = require("express");
let router = express.Router();
var assigned_Service = require("../schema/assigned_service.js");
var appontment =  require("../schema/appointments.js")
var task =  require("../schema/virtual_tasks.js")
const moment = require("moment");

var jwtconfig = require("../jwttoken");


router.post("/Addassignservice", async (req, res, next) => {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  if (legit) {
  const assigndata = new assigned_Service(req.body)
  assigndata.save()
    .then(result => {
         res.json({
         status: 200,
         msg: 'service assign successfully',
         data:result,
         hassuccessed: true
         })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        reeor: err
      })
    })
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

  
router.get("/getAssignedServices/:house_id", function (req, res, next) {
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


router.get("/getAllactivities/:user_id", async (req, res, next) => {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      try{
      var arr1 = [];
      var ll = [];
      var appointment=[];
      let user_id = req.params.user_id
        const messageToSearchWith = new assigned_Service({user_id });
        console.log(messageToSearchWith)
        messageToSearchWith.encryptFieldsSync();

        let doctor_id = req.params.doctor_id
        const messageToSearchWith1 = new appontment({doctor_id });
        console.log(messageToSearchWith1)
        messageToSearchWith1.encryptFieldsSync();

        let user_id1 = req.params.user_id
        const messageToSearchWith2 = new task({user_id1 });
        console.log(messageToSearchWith2)
        messageToSearchWith2.encryptFieldsSync();

       const data1 = await assigned_Service.find(
        {
          $or:[ {"assinged_to.user_id": req.params.user_id},{"user_id.user_id": messageToSearchWith.user_id}]  
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
               return userdata;
          } } 
      );
      const data2 = await task.find(
        {
          $or:[ {"assinged_to.user_id": req.params.user_id},{"user_id.user_id": messageToSearchWith.user_id1}]   
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
               return userdata;           
          }
         }        
      );
      const data3 = await appontment.find(
        {
          $or:[ {"doctor_id.doctor_id": req.params.user_id},{"doctor_id.doctor_id": messageToSearchWith.doctor_id}]    
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
               return userdata;              
          } }
      );
      ll=[...data1.sort(mySorter),...data2.sort(mySorter)]
      appointment=[...data3.sort(mySorter)]
      for (i = 0; i < appointment.length; i++) {
        let today = new Date().setHours(0, 0, 0, 0);
        let data_d = new Date(appointment[i].date).setHours(0, 0, 0, 0);
        if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
          arr1.push(appointment[i])          
        }
      }
      for (i = 0; i < ll.length; i++) {
        let today = new Date().setHours(0, 0, 0, 0);
        let data_d = new Date(ll[i].due_on.date).setHours(0, 0, 0, 0);
        if (moment(data_d).isAfter(today) || (moment(data_d).isSame(today))) {
          arr1.push(ll[i])        
        }
      }
      res.json({ status: 200, hassuccessed: true, data: arr1 });
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
  }
);

module.exports = router;