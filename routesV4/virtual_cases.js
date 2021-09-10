var express = require("express");
let router = express.Router();
var virtual_cases = require("../schema/virtual_cases.js");
var Virtual_Specialty = require("../schema/virtual_specialty.js");
var User = require("../schema/user.js");
var jwtconfig = require("../jwttoken");
// const User = require("../schema/user.js");
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
})

router.put("/AddCase/:speciality_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  // if (legit) {
  virtual_cases.updateOne(
    { _id: req.params.speciality_id },
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
          message: "case is updated",
          data: userdata,
        });
      }
    }
  );
})

  router.post("/AddCase", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
      virtual_cases.findOne({patient_id: req.body.patient_id, inhospital : { $eq: true } }, function (err, userdata) {
        if (err) {
          res.json({
            status: 200,
            hassuccessed: false,
            message: "Something went wrong.",
            error: err,
          });
        } else {
          console.log('user+dia')
          if(userdata){
            res.json({
              status: 200,
              hassuccessed: false,
              message: "case is already exist in hospital",
            });
          }
          else{
            var Virtual_Cases = new virtual_cases(req.body);
            Virtual_Cases.save(function (err, user_data) {
              if (err && !user_data) {
                res.json({ status: 200, message: "Something went wrong.", error: err });
              } else {
                console.log('user_data._id', user_data._id, user_data)
                res.json({
                  status: 200,
                  message: "Added Successfully",
                  hassuccessed: true,
                  data: user_data._id
                });
              }
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

router.post("/checkbedAvailability", function (req, res, next) {
   const token = req.headers.token;
   let legit = jwtconfig.verify(token);
   var bed = "11", newArray=[];
    //  if (legit) {
      virtual_cases.find( 
        {"wards._id":req.body.ward_id,
         "specialty._id":req.body.specialty_id,
         "room._id":req.body.room_id,
         "house._id":req.body.house_id,
        },function (err, userdata){
             if(err && !userdata){
             res.json({ status: 200, message: "Something went wrong.", error: err });
             }
           else{
           console.log('userdata', userdata)
              Virtual_Specialty.findOne({_id: req.body.specialty_id},function (err, userdata){
                if(err && !userdata){
                 res.json({ status: 200, message: "", error: err }); 
                 }
                 else{
                   var occumpiedbed = [{bed: "1"}, {bed: "5"}, {}]
                    bed=parseInt(bed);
                    for(var i=1; i<=bed; i++){
                      occumpiedbed.map((item)=>{                      
                        if(parseInt(item.bed) !== i){
                          console.log('parseInt',i)
                          if(newArray.indexOf(i)){
                            newArray.push(i)
                          }
                         
                        }
                        // console.log('111', newArray)
                        
                      }) 
                      // console.log('222', newArray)  
                    }
                    // console.log('333', newArray)
                    
                //  console.log(array);
                  // for(var i=0;i<array.length;i++){
                  // if(array[i] == 2)
                  //   {continue;}
                  //   console.log(array[i]);
                  // }
                  


                   }       
           })
  
               }
           }
             )
        
        
    // }
    // else{
    //   console.log('dfsdzfsdfsdfs')
    // }
})

router.get('/GetInfo/:house_id', function (req, res, next) {
  const token = (req.headers.token)
  let legit = jwtconfig.verify(token)
  if (legit) {
    virtual_cases.aggregate(
      [
          {
              $match: {
                _id: req.params.house_id,inhospital : true
              }
          },
          {
              $group: {
                  _id: "$bed",
                  count: { $sum: 1 },

              }
          }
      ],
      function (err, userdata) {
          if (err && !userdata) {
             res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong' }) 
            }else { res.json({ status: 200, hassuccessed: true, data: userdata }) };
      }
  )
    
 } else {
      res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
  }
})
  
      
      
      
       

// router.post('/Patient/:patient_id/:pin', function (req, res, next) {
//   const token = (req.headers.token)
//   let legit = jwtconfig.verify(token)
//   if (legit) {
//     User.findOne({_id: req.body.patient_id }, function (err, userdata) {
//       if (userdata) {
//         (userdata.pin == req.body.pin)
//         res.json({ status: 200, hassuccessed: true, data: userdata })
//       } else {
//         res.json({ status: 200, hassuccessed: false, message: 'pin is not correct' })
//       }
//     })
//   } else {
//     res.json({ status: 200, hassuccessed: false, message: 'user not exist' })
//   }
// })



module.exports = router;