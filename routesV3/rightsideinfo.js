var express = require('express');
var router = express.Router();
const multer = require("multer");
var user = require('../schema/user');
var prescription= require('../schema/prescription');
var jwtconfig = require('../jwttoken');
const uuidv1 = require('uuid/v1');
var sick_certificate = require('../schema/sick_certificate');
var appointment = require('../schema/appointments')

//Get patient info
var trackrecord1 = [];
router.get('/patient', function (req, res, next) {
    trackrecord1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var upcoming_appointment,blood_sugar,last_dia,info,last_dv,last_con,weight_bmi,sick_certificates,prescriptions,laboratory_result,blood_pressure;
    if (legit) {
        user.find(
            {
                '_id':legit.id,    
            },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                }  else {
                    if(doc && doc.length>0)
                    {
                        let promise = new Promise(function (resolve, reject) {
                        appointment.aggregate(
                            [
                                { $addFields: {
                                    Appointdate: {
                                      $dateFromString: { dateString: "$date", format: "%m-%d-%Y" }
                                    } 
                                  }},
                                  { $match: {
                                    patient: legit.id,
                                    Appointdate: {
                                      $gte: new Date(),
                                    }
                                  }},
                            ],
                            function(err,resultsss) {
                                upcoming_appointment = resultsss
                                setTimeout(() => resolve(upcoming_appointment), 500);
                            }
                        ) 
                      
                    });
                    promise.then((upcoming_appointment) => {
              
                        doc[0].track_record.sort(mySorter);
                        if (doc[0].track_record.length > 0) {
                           
                            var myFilterData1 = doc[0].track_record.filter((value, key) =>
                            value.type === 'diagnosis');
                            last_dia = myFilterData1[0];
                    
                            var myFilterData2 = doc[0].track_record.filter((value, key) =>
                                value.type === 'doctor_visit');
                                last_dv = myFilterData2;
                                if(myFilterData2.length>2)
                                {
                                    last_dv = myFilterData2.filter((value, key) =>
                                    key < 2 );
                                }
                               
                            var myFilterData3 = doc[0].track_record.filter((value, key) =>
                                value.type === 'condition_pain');
                                last_con = myFilterData3[0];
                            
                            var myFilterData4 = doc[0].track_record.filter((value, key) =>
                                value.type ==='weight_bmi');
                                weight_bmi = myFilterData4;

                            var myFilterData5 = doc[0].track_record.filter((value, key) =>
                                value.type ==='prescription');
                                prescriptions = myFilterData5;
                                if(myFilterData5.length>2)
                                {
                                    prescriptions = myFilterData5.filter((value, key) =>
                                    key < 2 );
                                }
                        
                            var myFilterData6 = doc[0].track_record.filter((value, key) =>
                                value.type ==='sick_certificate');
                                sick_certificates = myFilterData6;
                                if(myFilterData6.length>2)
                                {
                                    sick_certificates = myFilterData6.filter((value, key) =>
                                    key < 2 );
                                }
                            var myFilterData7 = doc[0].track_record.filter((value, key) =>
                                value.type ==='blood_pressure');
                                blood_pressure = myFilterData7;

                            var myFilterData9 = doc[0].track_record.filter((value, key) =>
                                value.type ==='blood_sugar');
                                blood_sugar = myFilterData9;

                            var myFilterData8 = doc[0].track_record.filter((value, key) =>
                            value.type ==='laboratory_result' && value.lab_parameter.value ==='Creatinine');
                                laboratory_result = myFilterData8;
                                
                            }
                            if(last_dv && last_dv.length>0)
                            {
                                forEachPromise(last_dv, getAlltrack)
                                .then((result) => {
                                    info ={birthday: doc[0].birthday, last_name: doc[0].last_name, first_name: doc[0].first_name , image:doc[0].image, profile_id: doc[0].profile_id}
                                    res.json({status: 200, hassuccessed: true, data : {info: info, last_dia: last_dia, last_dv: trackrecord1, last_con:last_con, weight_bmi: weight_bmi, 
                                    upcoming_appointment: upcoming_appointment,prescriptions: prescriptions, blood_sugar: blood_sugar, sick_certificates : sick_certificates, blood_pressure : blood_pressure, laboratory_result : laboratory_result}})
                                })
                            }
                            else{
                                info ={birthday: doc[0].birthday, last_name: doc[0].last_name, first_name: doc[0].first_name , image:doc[0].image, profile_id: doc[0].profile_id}
                                res.json({status: 200, hassuccessed: true, data : {info: info, last_dia: last_dia, last_dv: trackrecord1, last_con:last_con, weight_bmi: weight_bmi, 
                                upcoming_appointment: upcoming_appointment,prescriptions: prescriptions, blood_sugar: blood_sugar, sick_certificates : sick_certificates, blood_pressure : blood_pressure, laboratory_result : laboratory_result}})
                            }  
                    })
                }
                else{
                    res.json({status: 200, hassuccessed: true, data : {info: {}, last_dia: [], last_dv: [], last_con:[], weight_bmi: []}})
                }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/patient/:patient_id', function (req, res, next) {
    trackrecord1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var upcoming_appointment,blood_sugar,last_dia,info,last_dv,last_con,weight_bmi,sick_certificates,prescriptions,laboratory_result,blood_pressure;
    if (legit) {
        user.find(
            {
                '_id':req.params.patient_id,    
            },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                }  else {
                    if(doc && doc.length>0)
                    {
                        let promise = new Promise(function (resolve, reject) {
                            appointment.aggregate(
                                [
                                    { $addFields: {
                                        Appointdate: {
                                          $dateFromString: { dateString: "$date", format: "%m-%d-%Y" }
                                        } 
                                      }},
                                      { $match: {
                                        patient: req.params.patient_id,
                                        Appointdate: {
                                          $gte: new Date(),
                                        }
                                      }},
                                ],
                                function(err,resultsss) {
                                    upcoming_appointment = resultsss
                                    setTimeout(() => resolve(upcoming_appointment), 500);
                                }
                            ) 
                          
                        });
                        promise.then((upcoming_appointment) => {
                        doc[0].track_record.sort(mySorter);
                        if (doc[0].track_record.length > 0) {
                            var myFilterData1 = doc[0].track_record.filter((value, key) =>
                            value.type === 'diagnosis');
                            last_dia = myFilterData1[0];
                    
                        var myFilterData2 = doc[0].track_record.filter((value, key) =>
                            value.type === 'doctor_visit');
                            last_dv = myFilterData2;
                            if(myFilterData2.length>2)
                            {
                                last_dv = myFilterData2.filter((value, key) =>
                                key < 2 );
                            }
                            forEachPromise(last_dv, getAlltrack)
                            .then((result) => {
                                var last_dv1 =  trackrecord1;
                            })
                            
                        var myFilterData3 = doc[0].track_record.filter((value, key) =>
                            value.type === 'condition_pain');
                            last_con = myFilterData3[0];
                        
                        var myFilterData4 = doc[0].track_record.filter((value, key) =>
                            value.type ==='weight_bmi');
                            weight_bmi = myFilterData4;

                        var myFilterData5 = doc[0].track_record.filter((value, key) =>
                            value.type ==='prescription');
                            prescriptions = myFilterData5;
                            if(myFilterData5.length>2)
                            {
                                prescriptions = myFilterData2.filter((value, key) =>
                                key < 2 );
                            }
                       
                        var myFilterData6 = doc[0].track_record.filter((value, key) =>
                            value.type ==='sick_certificate');
                            sick_certificates = myFilterData6;
                            if(myFilterData5.length>2)
                            {
                                sick_certificates = myFilterData2.filter((value, key) =>
                                key < 2 );
                            }
                        var myFilterData7 = doc[0].track_record.filter((value, key) =>
                            value.type ==='blood_pressure');
                            blood_pressure = myFilterData7;

                        var myFilterData9 = doc[0].track_record.filter((value, key) =>
                            value.type ==='blood_sugar');
                            blood_sugar = myFilterData9;

                        var myFilterData8 = doc[0].track_record.filter((value, key) =>
                        value.type ==='laboratory_result' && value.lab_parameter.value ==='Creatinine');
                            laboratory_result = myFilterData8;
                        
                        }
                    info ={birthday: doc[0].birthday, last_name: doc[0].last_name, first_name: doc[0].first_name , image:doc[0].image, profile_id: doc[0].profile_id}
                    res.json({status: 200, hassuccessed: true, data : {info: info, last_dia: last_dia, last_dv: trackrecord1, last_con:last_con, weight_bmi: weight_bmi, 
                        upcoming_appointment: upcoming_appointment, prescriptions: prescriptions, blood_sugar: blood_sugar, sick_certificates : sick_certificates, blood_pressure : blood_pressure, laboratory_result : laboratory_result}})
                })
            }
                else{
                    res.json({status: 200, hassuccessed: true, data : {info: {}, last_dia: [], last_dv: [], last_con:[], weight_bmi: []}})
                }
            }  
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}

function getAlltrack(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            user.findOne({$or: [{profile_id: data.doctor_id}, {alies_id: data.doctor_id}]}).exec()
            .then(function(doc3){
                if(doc3){
                    var new_data = data;
                    if(doc3.image)
                    {
                        new_data.image = doc3.image;
                    }
                    return new_data;
                }
                else{
                    var new_data = data;
                    return new_data;
                }
                
            }).then(function(new_data){
                trackrecord1.push(new_data);
                resolve(trackrecord1);
            })
        });
    });
}

//Get doctor info
router.get('/doctor', function (req, res, next) {
    const token = (req.headers.token)
    var prescriptions = 0, patients = 0, sickcertificate = 0,appointments = 0, lastpatient={};
    let legit = jwtconfig.verify(token)
    if (legit) {
        user.find(
            {
                '_id':legit.id,    
            },
            function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                    } else {
                        var info =doc[0];
                        let promise = new Promise(function (resolve, reject) {
                        prescription.count({doctor_id: legit.id},function (err, count) {
                            if(err){}
                            else{
                                console.log(count, 'countsss1')
                                prescriptions = count;
                            }
                        })
                        sick_certificate.count({doctor_id: legit.id},function (err, count) {
                            if(err){}
                            else{
                                console.log(count, 'countsss2')
                                sickcertificate = count;
                            }
                        })
                        appointment.count({doctor_id: legit.id},function (err, count) {
                            if(err){}
                            else{
                                console.log(count, 'countsss3')
                                appointments = count;
                            }
                        })
                        user.count({parent_id: legit.id},function (err, count) {
                            if(err){}
                            else{
                                console.log(count, 'countsss4')
                                patients = count;
                            }
                        })
                        console.log('tttt',sickcertificate,appointments,patients )
                        setTimeout(() => resolve(), 1000);

                    });
                    console.log('tttt11',sickcertificate,appointments,patients )
                    promise.then(()=>{
                        res.json({status: 200, hassuccessed: true, data :{ info: info, prescriptions: prescriptions, sickcertificate:sickcertificate, appointments:appointments,patients:patients}});
                    })
                    }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});


//Get nurse info
router.get('/other', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        // var track_id = {track_id : req.params.TrackId}
        var data = req.body.data
        user.find(
            {
                '_id':legit.id,    
            },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                        var info = doc[0]
                        res.json({status: 200, hassuccessed: true, data : {info: info}});
                    }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

function mySorter(a, b) {
    var x = a.datetime_on.toLowerCase();
    var y = b.datetime_on.toLowerCase();
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}

module.exports = router;