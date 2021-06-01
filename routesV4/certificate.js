var express = require('express');
var router = express.Router();
const multer = require("multer");
var user = require('../schema/user');
var prescription = require('../schema/prescription');
var sickcertificate = require('../schema/sick_certificate');
var jwtconfig = require('../jwttoken');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const pdf = require('html-pdf');
const {promisify} = require('util');
const read = promisify(require('fs').readFile);
const handlebars = require('handlebars');

//for certificate
router.get('/DoctorUsersSc', function (req, res, next) {
    const token = (req.headers.token)
    let   legit = jwtconfig.verify(token)
    if (legit) {
        user.find({type : 'doctor','paid_services.description': 'prescription', 'we_offer.Offer_online_sick_certificates': true}, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
            } else {
                res.json({status: 200, hassuccessed: true, data : Userinfo});
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/DoctorUsersP', function (req, res, next) {
    const token = (req.headers.token)
    let   legit = jwtconfig.verify(token)
    if (legit) {
        user.find({type : 'doctor', 'paid_services.description': 'prescription' ,'we_offer.Offer_online_prescription': true}, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
            } else {
                res.json({status: 200, hassuccessed: true, data : Userinfo});
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

// router.get('/allprescriptions', function (req, res, next) {
//     const token = (req.headers.token)
//     let   legit = jwtconfig.verify(token)
//     if (legit) {
//         prescription.find({patient_id : legit.id , status: 'accept'}, function (err, Userinfo) {
//             if (err) {
//                 res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
//             } else {
//                 res.json({status: 200, hassuccessed: true, data : Userinfo});
//             }
//         });
//     }
//     else {
//         res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
//     }
// })

// router.get('/allsickcertificates', function (req, res, next) {
//     const token = (req.headers.token)
//     let   legit = jwtconfig.verify(token)
//     if (legit) {
//         prescription.find({patient_id : legit.id , status: 'accept'}, function (err, Userinfo) {
//             if (err) {
//                 res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
//             } else {
//                 res.json({status: 200, hassuccessed: true, data : Userinfo});
//             }
//         });
//     }
//     else {
//         res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
//     }
// })
module.exports = router;