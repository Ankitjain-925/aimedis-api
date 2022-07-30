require("dotenv").config();
var express = require("express");
let router = express.Router();
var assigned_Service = require("../schema/assigned_service.js");


var jwtconfig = require("../jwttoken");


router.post("/Addassignservice", async(req, res, next) => {
  try{
    const assigndata = new assigned_Service(req.body)
    assigndata.save()
    .then(result => {
         res.json({
         status: 200,
         msg: 'service assign successfully',
         data:result,
         hassuccessed: true
    })
  });
}
catch (err) {
  res.json({
    status: 200,
    hassuccessed: false,
    msg: "Something went wrong",
  });
}
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

  
  
router.get("/getAssignedServices/:house_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
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
    } else {
      res.json({
        status: 200,   
        hassuccessed: false,
        message: "Authentication required.",
      });
    }
});
    


module.exports = router;