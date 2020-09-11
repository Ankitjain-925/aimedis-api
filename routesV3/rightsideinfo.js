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
router.get('/patient', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var last_dia,info,last_dv,last_con,weight_bmi,sick_certificates,prescriptions,laboratory_result,blood_pressure;
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
                   console.log('sdasd',doc);
                        doc[0].track_record.sort(mySorter);
                        if (doc[0].track_record.length > 0) {
                                var myFilterData1 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'diagnosis');
                                    console.log('myFilterData1',myFilterData1)
                                    last_dia = myFilterData1[0];
                            
                                var myFilterData2 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'doctor_visit');
                                    console.log('myFilterData2',myFilterData2)
                                    last_dv = myFilterData2[0];
                                
                          
                                var myFilterData3 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'condition_pain');
                                    console.log('myFilterData3',myFilterData3)
                                    last_con = myFilterData3[0];
                                
                                var myFilterData4 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='weight_bmi');
                                    console.log('myFilterData4',myFilterData3)
                                    weight_bmi = myFilterData4[0];

                                var myFilterData5 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='prescription');
                                    console.log('myFilterData5',myFilterData5)
                                    prescriptions = myFilterData5[0];
                               
                                var myFilterData6 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='sick_certificate');
                                    console.log('myFilterData6',myFilterData6)
                                    sick_certificates = myFilterData6[0];
                                
                                var myFilterData7 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='blood_pressure');
                                    console.log('myFilterData7',myFilterData7)
                                    blood_pressure = myFilterData7[0];

                                var myFilterData8 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='laboratory_result' && value.lab_parameter ==='Creatinine');
                                    console.log('myFilterData8',myFilterData8)
                                    laboratory_result = myFilterData8[0];
                            
                            }
                        info ={birthday: doc[0].birthday, last_name: doc[0].last_name, first_name: doc[0].first_name , image:doc[0].image, profile_id: doc[0].profile_id}
                        res.json({status: 200, hassuccessed: true, data : {info: info, last_dia: last_dia, last_dv: last_dv, last_con:last_con, weight_bmi: weight_bmi, 
                            prescriptions: prescriptions, sick_certificates : sick_certificates, blood_pressure : blood_pressure, laboratory_result : laboratory_result}})
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
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    var last_dia,info,last_dv,last_con,weight_bmi;
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
                        doc[0].track_record.sort(mySorter);
                        if (doc[0].track_record.length > 0) {
                                var myFilterData1 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'diagnosis');
                                    console.log('myFilterData1',myFilterData1)
                                    last_dia = myFilterData1[0];
                            
                                var myFilterData2 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'doctor_visit');
                                    console.log('myFilterData2',myFilterData2)
                                    last_dv = myFilterData2[0];
                                
                          
                                var myFilterData3 = doc[0].track_record.filter((value, key) =>
                                    value.type === 'condition_pain');
                                    console.log('myFilterData3',myFilterData3)
                                    last_con = myFilterData3[0];
                                
                                var myFilterData4 = doc[0].track_record.filter((value, key) =>
                                    value.type ==='weight_bmi');
                                    console.log('myFilterData4',myFilterData3)
                                    weight_bmi = myFilterData4[0];
                                }
                        info ={birthday: doc[0].birthday, last_name: doc[0].last_name, first_name: doc[0].first_name , image:doc[0].image}
                        res.json({status: 200, hassuccessed: true, data : {info: info, last_dia: last_dia, last_dv: last_dv, last_con:last_con, weight_bmi: weight_bmi}})
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