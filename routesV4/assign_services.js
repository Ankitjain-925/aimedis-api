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


module.exports = router;