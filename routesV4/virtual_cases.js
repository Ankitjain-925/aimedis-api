var express = require("express");
let router = express.Router();
var virtual_cases = require("../schema/virtual_cases.js");
var jwtconfig = require("../jwttoken");
var fullinfo = [];
router.put("/AddRoom/:Room_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      if(req.body.room && req.body.bed){
        var changes = {room : req.body.room , bed: req.body.bed}
      } 
      virtual_cases.updateOne(
        { _id: req.params.room_id },
       changes,
        function (err, userdata) {
          if (req.body.room) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "something went wrong",
              error: err,
            });
          } else {
            if(req.body.bed){
                 res.json({
                status: 200,
                hassuccessed: false,
                message: "Bed is updated",
                error: err,
                 });
            } else {
                res.json({
                status: 200,
                hassuccessed: true,
                message: "Room is updated",
                data: userdata,
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

  module.exports = router;