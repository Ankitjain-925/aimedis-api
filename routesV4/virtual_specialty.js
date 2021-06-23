require('dotenv').config();
var express = require('express');
let router = express.Router();
var Virtual_Specialty = require('../schema/virtual_specialty.js');
var virtual_Case = require('../schema/virtual_cases.js');
var virtual_Task = require('../schema/virtual_tasks.js');
var virtual_Service = require('../schema/virtual_services.js');
var virtual_Invoice = require('../schema/virtual_invoice.js');
var User = require('../schema/user.js')
var Institute = require('../schema/institute.js');
var jwtconfig = require('../jwttoken');
var fullinfo = [];
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
                res.json({ status: 200, hassuccessed: true, message: 'Specialty is updated', data: userdata })
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

router.get('/AddSpecialty/:house_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Virtual_Specialty.find({ house_id: req.params.house_id }, function (err, userdata) {
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
                res.json({ status: 200, hassuccessed: true, message: 'Task is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/GetAllTask/:house_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Task.find({ house_id: req.params.house_id }, function (err, userdata) {
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
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, message: 'Task is not found' })
                }
                else {
                        res.json({ status: 200, hassuccessed: true, message: 'Comment is added' })
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
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, message: 'Task is not found' })
                }
                else {
                    res.json({ status: 200, hassuccessed: true, message: 'Comment is updated' })
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
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong', error: err })
            } else {
                if (doc.nModified == '0') {
                    res.json({ status: 200, hassuccessed: false, message: 'Comment is not found' })
                }
                else {
                        res.json({ status: 200, hassuccessed: true, message: 'Comment is deleted' })
                    }
                }
            });
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/AddService/:service_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Service.findByIdAndRemove(req.params.service_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Service is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddService/:service_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Service.updateOne({ _id: req.params.service_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Service is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/AddService', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var Virtual_Services = new virtual_Service(req.body);
        Virtual_Services.save(function (err, user_data) {
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

router.get('/GetService/:house_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Service.find({house_id: req.params.house_id}, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "services not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/AddInvoice/:bill_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Invoice.findByIdAndRemove(req.params.bill_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Invoice is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/AddInvoice/:bill_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Invoice.updateOne({ _id: req.params.bill_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Invoice is updated', data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/AddInvoice', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var virtual_Invoices = new virtual_Invoice(req.body);
        virtual_Invoices.save(function (err, user_data) {
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

router.get('/AddInvoice/:house_id/:status', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var search = { house_id: req.params.house_id }
        if(req.params.status !=='all'){
            var search = { house_id: req.params.house_id, status: req.params.status }
        }
        virtual_Invoice.find(search, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "invoice not found", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, data: userdata })
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/infoOfHouses', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        fullInfo = [];
        User.findOne({ _id: legit.id }, function (err, userdata) {
            if (err && !userdata) {
                res.json({ status: 200, hassuccessed: false, message: "user not found", error: err })
            } else {
                if(userdata && userdata.houses && userdata.houses.length>0){
                    forEachPromise(userdata.houses, getfullInfo).then((result) => {
                        res.json({ status: 200, hassuccessed: true, message: 'Houses is found', data: fullInfo })
                    })
                }
            }
        })
    } else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/checkPatient', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: req.body.patient_id },
        function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                var createCase = false;
                if(req.body.pin){
                    console.log('dfgdf', req.body.pin, userdata.pin)
                    createCase = req.body.pin === userdata.pin ? true : false
                }
                else{
                    var pos =  userdata && userdata.assosiated_by.filter((data)=> data.institute_id === req.body.institute_id);
                    createCase = userdata.parent_id === req.body.institute_id ? true : (pos && pos.length>0) ? true : false;
                }
                if(createCase){
                    res.json({ status: 200, hassuccessed: true, message: 'information get successfully', data: userdata });
                }
                else{
                    if(req.body.pin){
                        res.json({ status: 200, hassuccessed: false, message: 'pin is not correct' });
                    }
                    else{
                        res.json({ status: 200, hassuccessed: false, message: 'user is not associated need pin to add' });
                    }
                }  
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/addPatientToVH', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var virtual_Cases = new virtual_Case(req.body);
        virtual_Cases.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Case number is assigned', hassuccessed: true });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.put('/addPatientToVH/:case_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Case.updateOne({ _id: req.params.case_id }, req.body, function (err, userdata) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: "Something went wrong", error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Case is updated', data: userdata })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.delete('/addPatientToVH/:case_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_Case.findByIdAndRemove(req.params.case_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'Case is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.post('/getPatientFromVH:/house_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var virtual_Cases = new virtual_Case(req.body);
        virtual_Cases.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'Case number is assigned', hassuccessed: true });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})


function getfullInfo(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            Institute.findOne({  'institute_groups.houses.house_id' : data.value }).exec()
            .then(function (doc3) {
                pos = fullinfo.filter((data)=> data._id === doc3._id);
                if(pos && pos.length === 0)
                {
                    fullInfo.push(doc3)
                }
                resolve(fullInfo);
            })
        });
    });
}

function forEachPromise(items, fn) {
    return items.reduce(function (promise, item) {
        return promise.then(function () {
            return fn(item);
        });
    }, Promise.resolve());
}
module.exports = router;