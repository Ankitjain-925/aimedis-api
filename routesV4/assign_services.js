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
         res.status(200).json({
         message: 'service assign successfully',
         newBook:result
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