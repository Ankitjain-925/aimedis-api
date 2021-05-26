require('dotenv').config();
var express = require('express');
let router = express.Router();
var Virtual_Specialty = require('../schema/virtual_specialty');
var virtual_Task = require('../schema/tasks.js');
var jwtconfig = require('../jwttoken');

router.delete('/AddSpecialty/:specialty_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Virtual_Specialty.findByIdAndRemove(req.params.specialty_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Speciality is Deleted Successfully' });
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
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Specialty is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/AddSpecialty', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var Virtual_Specialtys = new Virtual_Specialty(req.body);
        Virtual_Specialtys.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Added Successfully', hassuccessed: true });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

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
 
router.post('/AddTask', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var Virtual_tasks = new virtual_Task(req.body);
        Virtual_tasks.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Added Successfully', hassuccessed: true });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/AddTask/:task_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.findByIdAndRemove(req.params.task_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Task is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddTask/:task_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {

        virtual_Task.updateOne({ _id: req.params.task_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Task is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/GetAllTask/:virtual_hospital_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.find({ virtual_hospital_id: req.params.virtual_hospital_id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/AddTask/:task_ids', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.findOne({ _id: req.params.task_ids }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/PatientsTask/:patient_profile_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        const messageToSearchWith = new virtual_Task({patient_id: req.params.patient_profile_id });
        messageToSearchWith.encryptFieldsSync();
        virtual_Task.find({ patient_profile_id: messageToSearchWith.patient_profile_id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/ProfessionalTask/:patient_profile_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.find({'assinged_to.profile_id': req.params.patient_profile_id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/ProfessionalTaskComment/:task_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        req.body.comment_id = req.params.task_id+'_'+req.body.comment_by+'_'+Date.now();
        virtual_Task.updateOne({ _id: req.params.task_id },
            { $push: { comments: req.body } },
            { safe: true, upsert: true },
            function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, msg: 'Task is not found' })
                }
                else {
                        res.json({ status: 200, hassuccessed: true, msg: 'comment is added' })
                    }
                }
            });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/ProfessionalTaskComment/:task_id/:comment_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.updateOne(
            {
                '_id': req.params.task_id,
                'comments.comment_id': req.params.comment_id
            },
            {
                $set: {
                    'comments.$': req.body
                }
            },
            function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, msg: 'Task is not found' })
                }
                else {
                        res.json({ status: 200, hassuccessed: true, msg: 'comment is updated' })
                    }
                }
            });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/ProfessionalTaskComment/:task_id/:comment_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.updateOne({ _id: req.params.task_id },
        { $pull: { comments: { comment_id: req.params.comment_id } } },
        { multi: true },
        function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, msg: 'Comment is not found' })
                }
                else {
                        res.json({ status: 200, hassuccessed: true, msg: 'comment is deleted' })
                    }
                }
            });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})
module.exports = router;