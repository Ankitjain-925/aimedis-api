require('dotenv').config();
var express = require('express');
let router = express.Router();
var cometUsers = require('../schema/cometuserlist')
var jwtconfig = require('../jwttoken');

router.delete('/:uid', function (req, res, next) {
    cometUsers.findOneAndDelete({uid: req.params.uid}, function (err, data) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, message: 'Certificate is Deleted Successfully' });
        }
    }); 
})

router.put('/:uid', function (req, res, next) {
    cometUsers.updateOne({ uid: req.params.uid }, req.body, function (err, userdata) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, message: " not found", error: err })
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'Comet User is updated', data: userdata })
        }
    })
})

/*----------M-Y---P-A-T-I-E-N-T-S----------*/
router.post('/', function (req, res, next) {
    cometUsers.updateOne({ uid: req.body.uid }, req.body, { upsert: true, new: true, setDefaultsOnInsert: true }, function (error, result) {
        if (error) {
            res.json({ status: 200, message: 'Something went wrong.', error: err });
        }
        else {
            console.log('dfsfsd', result);
            res.json({ status: 200, message: 'Added Successfully', hassuccessed: true, data: result });
        }
    });
    // cometUserss.save(function (err, user_data) {
    //     if (err && !user_data) {
    //         res.json({ status: 200, message: 'Something went wrong.', error: err });
    //     } else {
    //         res.json({ status: 200, message: 'Added Successfully', hassuccessed: true, data: user_data });
    //     }
    // })
})

/*----------A-P-P-O-I-N-T-M-E-N-T-S----------*/

router.post('/GetAllUser', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        cometUsers.find({ uid: {$in : req.body.list}  }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "Users not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


module.exports = router;