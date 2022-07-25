require("dotenv").config();
var express = require("express");
let router = express.Router();
var assigned_Service = require("../schema/assigned_service.js");


var jwtconfig = require("../jwttoken");


router.post("/Addassignservice", async(req, res, next) => {
 
    const assigndata = new assigned_Service(req.body)
    assigndata.save()
    .then(result => {
         res.status(200).json({
         message: 'service assign successfully',
         newBook:result
    })
  })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          reeor:err
        })
      })
     } );

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

module.exports = router;