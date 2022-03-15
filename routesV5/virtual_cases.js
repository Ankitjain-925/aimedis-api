var express = require("express");
let router = express.Router();
var virtual_cases = require("../schema/virtual_cases.js");
var virtual_tasks = require("../schema/virtual_tasks");
var Virtual_Specialty = require("../schema/virtual_specialty.js");
const { encrypt, decrypt } = require("./Cryptofile.js");
// var User = require("../schema/user.js");
var user = require("../schema/user");
const uuidv1 = require("uuid/v1");
var jwtconfig = require("../jwttoken");
const { resolveContent } = require("nodemailer/lib/shared");
var mongoose = require('mongoose');

// const User = require("../schema/user.js");
var fullinfo = [];
var CheckRole=require("./../middleware/middleware")

router.put("/AddRoom/:Case_Id",CheckRole("add_room"), function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      var changes = {
        room: req.body.room,
        bed: req.body.bed,
        wards: req.body.wards,
      };
      virtual_cases.updateOne(
        { _id: req.params.Case_Id },
        changes,
        function (err, userdata) {
          res.json({
            status: 200,
            hassuccessed: true,
            message: "Information is updated",
            data: userdata,
          });
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

  router.post("/checkbedAvailabilityByWard",CheckRole("add_ward") ,function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    var beds = [];
    newArray = [];
  
    //  if (legit) {
    virtual_cases.find(
      {
        "wards._id": req.body.ward_id,
        "speciality._id": req.body.specialty_id,
        "house_id": req.body.house_id,
        inhospital: true
      },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({ status: 200, message: "Something went wrong.", error: err });
        } else {
          Virtual_Specialty.findOne(
            { _id: req.body.specialty_id },
            function (err, userdata1) {
              if (err && !userdata1) {
                res.json({ status: 200, message: "", error: err });
              } else {
                newArray = [];
                beds = returnNumberofBedOnWard(userdata1, req.body.ward_id)
                beds.forEach((item, index) => {
                var NewUsers= userdata.filter((elem)=>(elem.rooms && elem.rooms._id === item.room_id.toString())) 
                console.log('NewUsers', NewUsers)
                for (var i = 1; i <= item.bed; i++) {
  
                  if (!NewUsers.some(e => {
                    console.log('e.bed', e.bed, i );
                    return (e.bed == i)})) {
                    newArray.push(i);
                  }
                }
              })
              console.log('newArray',newArray)
                res.json({
                  status: 200,
                  message: "Available beds found",
                  hassuccessed: true,
                  data:newArray && newArray.length> 0 ? newArray.length : 0,
                });
              }
            }
          );
        }
      }
    );
  });
  router.post("/checkbedAvailability",CheckRole("add_bed"),function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    var bed = 0;
    newArray = [];
    //  if (legit) {
    virtual_cases.find(
      {
        "wards._id": req.body.ward_id,
        "speciality._id": req.body.specialty_id,
        "rooms._id": req.body.room_id,
        "house_id": req.body.house_id,
        inhospital: true
      },
      function (err, userdata) {
        if (err && !userdata) {
          res.json({ status: 200, message: "Something went wrong.", error: err });
        } else {
          try{
          Virtual_Specialty.findOne(
            { _id: req.body.specialty_id },
            function (err, userdata1) {
              if (err && !userdata1) {
                res.json({ status: 200, message: "", error: err });
              } else {
                newArray = [];
                bed = returnNumberofBed(userdata1, req.body.ward_id, req.body.room_id)
                for (var i = 1; i <= bed; i++) {
                  if (!userdata.some(e => e.bed == i)) {
                    newArray.push(i);
                  }
                }
                res.json({
                  status: 200,
                  message: "Available beds found",
                  hassuccessed: true,
                  data: newArray,
                });
              }
            }
          );
        }catch(e){
          res.json({ status: 200, message: "Something went wrong.", error: err });
        }
      }
      }
    );
  });  

  function returnNumberofBedOnWard(array, ward_id) {
    let ward = array.wards && array.wards.find(e => e._id == ward_id);
    var beds = [];
    if(ward && ward.rooms && ward.rooms.length>0){
      ward.rooms.forEach((item, index) => {
        let bed = item.no_of_bed ? parseInt(item.no_of_bed) : 0;
        beds.push({ room_id: item._id, bed: bed })
      })
    }
    return beds;
  }
  function returnNumberofBed(array, ward_id, room_id) {
    if(array){
      let ward = array.wards && array.wards.find(e => e._id == ward_id);
      let room = ward && ward.rooms && ward.rooms.find(e => e._id == room_id)
      let bed = room.no_of_bed ? parseInt(room.no_of_bed) : 0;
      return bed;
    }
    else{
      return 0;
    }
  }

  module.exports = router;