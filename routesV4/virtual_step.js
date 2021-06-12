require('dotenv').config();
var express = require('express');
let router = express.Router();
var Virtual_Specialty = require('../schema/virtual_specialty.js');
var virtual_Case = require('../schema/virtual_cases.js');
var virtual_Task = require('../schema/virtual_tasks.js');
var virtual_Service = require('../schema/virtual_services.js');
var virtual_Invoice = require('../schema/virtual_invoice.js');
var virtual_step = require('../schema/virtual_step.js');
var User = require('../schema/user.js')
var Institute = require('../schema/institute.js');
var jwtconfig = require('../jwttoken');
var fullinfo = [];
router.put('/AddStep/:step_id', function (req, res, next) {
    const token = (req.headers.token)
    virtual_step.updateOne({ _id: req.params.step_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Specialty is updated', data: userdata })
            }
        })
    })
router.post('/AddStep', function (req, res, next) {
    const token = (req.headers.token)
    var Virtual_Steps = new virtual_step(req.body);
        Virtual_Steps.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Added Successfully', hassuccessed: true });
            }
        })
    
    })

    router.delete('/AddStep/:step_id', function (req, res, next) {
         virtual_step.findByIdAndRemove(req.params.step_id, function (err, data) {
              if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err })
                } else {
                    res.json({ status: 200, hassuccessed: true, message: 'Speciality is Deleted Successfully' })
                }
            })
        
    })  
    
    router.get('/GetStep/:house_id:', function (req, res, next) {

        virtual_step.find({ house_id: req.params.house_id }, function (err, userdata) {
                if (err && !userdata) {
                    res.json({ status: 200, hassuccessed: false, message: "something went wrong", error: err })
                } else {
                    res.json({ status: 200, hassuccessed: true, data: userdata })
                }
            })
        })

         
        router.post('/Case_numbers/:step_id', function (req, res, next) {
             virtual_step.updateOne({ _id: req.params.step_id },
                    { $push: { case_numbers: req.body } },
                    { safe: true, upsert: true },
                    function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
                    } else {
                        if (doc.nModified == '0') {
                            res.json({ status: 200, hassuccessed: true, message: 'step is not found' })
                        }
                        else {
                            res.json({ status: 200, hassuccessed: true, message: 'Case is added' })
                        }
                        }
                    });
        }) 
        
        router.put('/Case_numbers/:step_id/:case_id', function (req, res, next) {
            virtual_step.updateOne(
                    {
                        '_id': req.params.step_id,
                        'case_numbers.case_id': req.params.case_id
                    },
                    {
                        $set: {
                            'case_numbers.$': req.body
                        }
                    },
                    function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
                    } else {
                        if (doc.nModified == '0') {
                            res.json({ status: 200, hassuccessed: true, message: 'step is not found' })
                        }
                        else {
                            res.json({ status: 200, hassuccessed: true, message: 'case is updated' })
                        }
                    }
                });
           
        })

        router.delete('/Case_numbers/:step_id/:case_id', function (req, res, next) {
             virtual_step.updateOne({ _id: req.params.step_id },
                { $pull: { case_numbers: { comment_id: req.params.comment_id } } },
                { multi: true },
                function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
                    } else {
                        if (doc.nModified == '0') {
                            res.json({ status: 200, hassuccessed: false, message: 'step is not found' })
                        }
                        else {
                            res.json({ status: 200, hassuccessed: true, message: 'case is deleted' })
                        }
                    
                    }

                });
            
        })
        
 module.exports = router;