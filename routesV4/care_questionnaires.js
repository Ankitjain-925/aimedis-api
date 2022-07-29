require("dotenv").config();
var express = require("express");
let router = express.Router();
var CareModel = require("../schema/care_questionnaire.js");
var VirtualModel = require("../schema/virtual_cases.js")
var User = require("../schema/user.js")
var jwtconfig = require("../jwttoken");


router.post("/AddQuestionnaire", async(req, res, next) => {
    try{
    const bookdata = new CareModel(req.body)
    const createdata =await bookdata.save()
    res.status(200).send(createdata)
  }catch(err){
    res.status(400).send(err)
  }
  });


                          

router.get("/GetCaredata/:house_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      let house_id =req.params.house_id
      const messageToSearchWith = new VirtualModel({house_id });
      console.log(messageToSearchWith)
      messageToSearchWith.encryptFieldsSync();
      VirtualModel.find(
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


  router.get("/GetCareNurse/:nurse_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      let nurse_id =req.params.nurse_id
      const messageToSearchWith = new CareModel({nurse_id });
      messageToSearchWith.encryptFieldsSync();
      CareModel.find(
        {$or:[ {nurse_id: req.params.nurse_id},{nurse_id: messageToSearchWith.nurse_id}] },
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


  router.get("/GetCarePatient/:patient_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      let patient_id =req.params.patient_id
      const messageToSearchWith = new CareModel({patient_id });
      messageToSearchWith.encryptFieldsSync();
      CareModel.find(
        {$or:[ {patient_id: req.params.patient_id},{patient_id:messageToSearchWith.patient_id}] },
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

 