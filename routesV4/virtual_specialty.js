require('dotenv').config();
var express = require('express');
let router = express.Router();
var User = require('../schema/user.js');
var Virtual_Specialty = require('../schema/virtual_specialty')
var jwtconfig = require('../jwttoken');

router.delete('/AddSpecialty/:specialty_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Virtual_Specialty.findByIdAndRemove(req.params.specialty_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Certificate is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddSpecialty/:specialty_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {

        Virtual_Specialty.updateOne({ _id: req.params.specialty_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Specialty is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------M-Y---P-A-T-I-E-N-T-S----------*/
router.post('/AddSpecialty', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var Virtual_Specialtys = new Virtual_Specialty(req.body);
        Virtual_Specialtys.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Added Successfully', hassuccessed: true, data: user_data });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*----------A-P-P-O-I-N-T-M-E-N-T-S----------*/

router.get('/AddSpecialty/:virtual_hospital_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Virtual_Specialty.find({ virtual_hospital_id: req.params.virtual_hospital_id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "specialities not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


module.exports = router;