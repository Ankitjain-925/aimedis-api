require('dotenv').config();
var express = require('express');
let router = express.Router();
var Virtual_Specialty = require('../schema/virtual_specialty.js');
var questionaire = require('../schema/questionaire.js');
var answerspatient = require('../schema/answerspatient.js');
var virtual_Case = require('../schema/virtual_cases.js');
var virtual_Task = require('../schema/virtual_tasks.js');
var virtual_Service = require('../schema/virtual_services.js');
var virtual_Invoice = require('../schema/virtual_invoice.js');
var virtual_step = require('../schema/virtual_step.js');
var User = require('../schema/user.js')
var Institute = require('../schema/institute.js');
var jwtconfig = require('../jwttoken');
var fullinfo = [];

router.post('/AddAnswerspatient', function (req, res, next) {
    var answerspatients = new answerspatient(req.body);
    answerspatients.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Added Successfully', hassuccessed: true });
            }
        })
    
    })

    router.put('/Answer/:answerspatient_id', function (req, res, next) {
        answerspatient.updateOne({ _id: req.params.answerspatient_id }, req.body, function (err, userdata) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
                } else {
                    res.json({ status: 200, hassuccessed: true, message: ' answerspatient is updated', data: userdata })
                }
            })
        })  
        
        router.delete('/Answer/:answerspatient_id', function (req, res, next) {
            answerspatient.findByIdAndRemove({ _id: req.params.answerspatient_id }, req.body, function (err, userdata) {
                    if (err) {
                        res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
                    } else {
                        res.json({ status: 200, hassuccessed: true, message: 'answerspatient is deleted Successfully' })
                    }
                })
            })
            
            router.get('/GetAnswerspatient/:house_id', function (req, res, next) {
                const token = (req.headers.token)
                let legit = jwtconfig.verify(token)
                if (legit) {
                    answerspatient.find({house_id: req.params.house_id}, function (err, userdata) {
                        if (err && !userdata) {
                            res.json({ status: 200, hassuccessed: false, message: "answerspatient not found", error: err })
                        } else {
                            res.json({ status: 200, hassuccessed: true, data: userdata })
                        }
                    })
                } else {
                    res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
                }
            })


    module.exports = router;