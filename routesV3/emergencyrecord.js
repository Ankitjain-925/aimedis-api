var express = require('express');
let router = express.Router();
const multer = require("multer");
var user = require('../schema/user.js');
var prescription = require('../schema/prescription')
var jwtconfig = require('../jwttoken');
var base64 = require('base-64');
const uuidv1 = require('uuid/v1');
var dateTime = require('node-datetime');
var trackrecord1 = [];
var trackrecord2 = [];
//get the emergency record of the patient
router.get('/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var diagnosis = [];
        var medication = [];
        var allergy = [];
        var doctor= [];
        user.findOne({ _id: req.params.UserId },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    if (legit.type !=='patient') {
                        if(doc)
                        {
                            // if (doc.Rigt_management[0] && doc.Rigt_management[0].emergency_access == 'yes') {
                                let promise = new Promise(function (resolve, reject) {
                                if(doc.family_doc[0])
                                { 
                                    user.findOne({ _id: doc.family_doc[0] }).then((docor) => {
                                        console.log(docor);
                                       if(docor != null){doctor.push(docor);}
                                      }).catch((err) => {
                                        res.json({ status: 200, hassuccessed: false, msg: 'Family Doctor not find' })
                                      });    
                                }
                                if (doc.track_record.length > 0) {
                                    doc.track_record.forEach((element, index) => {
                                        // if (element.emergency == true) {
                                            if(element.type=='diagnosis')
                                            {
                                                diagnosis.push(element);
                                            }
                                            if(element.allergy && element.allergy===true)
                                            {
                                                allergy.push(element);
                                            }
                                            if(element.type=='medication')
                                            {
                                                medication.push(element);
                                            }   
                                        // }
                                    });
                                }
                                
                                setTimeout(() => resolve(), 500);
                            });
                            promise.then(() => {
                                var personal_info = {_id: doc._id, profile_id: doc.profile_id, first_name: doc.first_name, last_name: doc.last_name, birthday: doc.birthday, email : doc.email, mobile : doc.mobile}
                                var contact_partner ={name : doc.emergency_contact_name, number: doc.emergency_number,email: doc.emergency_email, relation : doc.emergency_relation}
                                var statusbyp, remarksbyp, options;
                               
                                if(doc.organ_donor && doc.organ_donor.length>0)
                                {
                                    if(doc.organ_donor[0].selectedOption)
                                    {
                                        if(doc.organ_donor[0].selectedOption == 'yes_to_all')
                                        {
                                            statusbyp = 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead'
                                            options =''
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'exclude_some')
                                        {
                                            statusbyp = 'Transplantation of organ / tissues of mine after doctors have pronounced me dead accept for following organ / tissues'
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'include_some')
                                        {
                                            statusbyp = 'Transplantation of organ / tissues of mine after doctors have pronounced me dead only for following organ / tissues'
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'not_allowed')
                                        {
                                            statusbyp = 'NOT allow a transplantation of any of my organs or tissues'
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'decided_by_following')
                                        {
                                            statusbyp = 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead YES or NO shall be decided by the following person'
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else
                                        {
                                            statusbyp = 'Nothing'
                                            options = ''
                                        }
                                    }
                                   if(doc.organ_donor[0].free_remarks) 
                                   {remarksbyp = doc.organ_donor[0].free_remarks;}
                                   else { remarksbyp = ''} 
                                }
                                else {
                                    statusbyp = 'Nothing'
                                    remarksbyp = ''
                                    options =''
                                }
                                var donar = {remarks :remarksbyp, status : statusbyp , options: options}
                                console.log(donar, 'donorrr')
                                res.json({ status: 200, hassuccessed: true, msg: 'Data is found', diagnosisdata: diagnosis, medicationdata : medication,allergydata : allergy,doctor: doctor, personal_info: personal_info, donardata: donar,contact_partner :contact_partner})
                            })   
                            // }
                            // else {
                            //     res.json({ status: 200, hassuccessed: false, msg: 'No authority access to get inforamtion' })
                            // }
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'No authority access to get inforamtion' })
                        }   
                    } 
                    else
                    {
                      if(req.params.UserId == legit.id)
                      {
                        let promise = new Promise(function (resolve, reject) {
                            if(doc.family_doc[0])
                            {
                                user.findOne({ _id: doc.family_doc[0] }).then((docor) => {
                                    console.log(docor);
                                   if(docor != null){doctor.push(docor);}
                                  }).catch((err) => {
                                    res.json({ status: 200, hassuccessed: false, msg: 'Family Doctor not find' })
                                  });    
                            }
                            if (doc.track_record.length > 0) {
                                doc.track_record.forEach((element, index) => {
                                    // if (element.emergency == true) {
                                        if(element.type=='diagnosis')
                                        {
                                            diagnosis.push(element);
                                        }
                                        if(element.allergy && element.allergy===true)
                                        {
                                            allergy.push(element);
                                        }
                                        if(element.type=='medication')
                                        {
                                            console.log('medication')
                                            medication.push(element);
                                        }   
                                    // }
                                });
                            }
                            setTimeout(() => resolve(), 500);
                        });
                        promise.then(() => {
                            console.log('doc.emergency_relation1' , doc.emergency_relation)
                            var contact_partner ={name : doc.emergency_contact_name, number: doc.emergency_number,email: doc.emergency_email, relation : doc.emergency_relation}
                            var statusbyp, remarksbyp, options;
                          
                            if(doc.organ_donor && doc.organ_donor.length>0)
                            {
                                if(doc.organ_donor[0].selectedOption)
                                {
                                    if(doc.organ_donor[0].selectedOption == 'yes_to_all')
                                    {
                                        statusbyp = 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead'
                                        options =''
                                    }
                                    else if(doc.organ_donor[0].selectedOption == 'exclude_some')
                                    {
                                        statusbyp = 'Transplantation of organ / tissues of mine after doctors have pronounced me dead accept for following organ / tissues'
                                        options = doc.organ_donor[0].OptionData 
                                    }
                                    else if(doc.organ_donor[0].selectedOption == 'include_some')
                                    {
                                        statusbyp = 'Transplantation of organ / tissues of mine after doctors have pronounced me dead only for following organ / tissues'
                                        options = doc.organ_donor[0].OptionData 
                                    }
                                    else if(doc.organ_donor[0].selectedOption == 'not_allowed')
                                    {
                                        statusbyp = 'NOT allow a transplantation of any of my organs or tissues'
                                    }
                                    else if(doc.organ_donor[0].selectedOption == 'decided_by_following')
                                    {
                                        statusbyp = 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead YES or NO shall be decided by the following person'
                                        options = doc.organ_donor[0].OptionData 
                                    }
                                    else
                                    {
                                        statusbyp = 'Nothing'
                                        options = ''
                                    }
                                }
                               if(doc.organ_donor[0].free_remarks) 
                               {remarksbyp = doc.organ_donor[0].free_remarks;}
                               else { remarksbyp = ''} 
                            }
                            else {
                                statusbyp = 'Nothing'
                                remarksbyp = ''
                                options =''
                            }
                            var donar = {remarks :remarksbyp, status : statusbyp , options: options}
                            res.json({ status: 200, hassuccessed: true, msg: 'Data is found', diagnosisdata: diagnosis, medicationdata : medication, allergydata: allergy,doctor: doctor,  donardata: donar, contact_partner:contact_partner})
                        })   
                    }   
                }
            }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/getTrack/:UserId', function (req, res, next) {
    trackrecord1 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
            user.find({ _id: req.params.UserId },
                function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                    } else {
                        if(doc && doc.length>0)
                        {
                            doc[0].track_record.sort(mySorter);
                            if (doc[0].track_record.length > 0) {
                                forEachPromise(doc[0].track_record, getAlltrack)
                                    .then((result) => {
                                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: trackrecord1 })
                                    })
    
                            }
                            else {
                                res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                            }  
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                        }  
                   
                    }
                })
        
       
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/ArchivegetTrack/:UserId', function (req, res, next) {
    trackrecord2 = [];
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
            user.find({ _id: req.params.UserId },
                function (err, doc) {
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
                    } else {
                        if(doc && doc.length>0)
                        {
                            doc[0].track_record.sort(mySorter);
                            if (doc[0].track_record.length > 0) {
                                forEachPromise(doc[0].track_record, getArAlltrack)
                                    .then((result) => {
                                        res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: trackrecord2 })
                                    })
    
                            }
                            else {
                                res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                            }  
                        }
                        else {
                            res.json({ status: 200, hassuccessed: false, msg: 'No data' })
                        }  
                   
                    }
                })
        
       
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.put('/AddstoredPre/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var ids = { track_id: uuidv1() };
        var full_record = { ...ids, ...req.body.data }
        if(req.query.addtopatient && req.query.addtopatient==='true')
        {
            user.updateOne({$or: [{ profile_id: req.body.data.patient_id }, { alies_id: req.body.data.patient_id }] },
                { $push: { track_record: full_record } },
                { safe: true, upsert: true },
                function (err, doc) {
                    if (err && !doc) {
                        console.log('Something went wrong',  err )
                    } else {
                        console.log( doc, 'track is updated' )
                        }
                    });
        }
      
        user.updateOne({ profile_id: req.params.UserId },
            { $push: { track_record: full_record } },
            { safe: true, upsert: true },
            function (err, doc) {
                if (err && !doc) {
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                } else {
                    if (doc.nModified == '0') {
                        res.json({ status: 200, hassuccessed: false, msg: 'User is not found' })
                    }
                    else {
                        res.json({ status: 200, hassuccessed: true, msg: 'track is updated' })
                    }
                }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.get('/getLocationPharmacy/:radius', function (req, res, next) {
    user.find({
        area: {
            $near: {
                $maxDistance: Number(req.params.radius),
                $geometry: {
                    type: "Point",
                    coordinates: [Number(req.query.longitude), Number(req.query.Latitude)]
                }
            }
        }, type : 'pharmacy'
    }, 'profile_id _id first_name last_name').find((error, Userinfo) => {
        if (error) {
            res.json({ status: 200, hassuccessed: false, error: error })
        } else {
            res.json({ status: 200, hassuccessed: false, data: Userinfo })
        }
    })
})

router.get('/getPharmacy/search/:name', function (req, res, next) {
    console.log('dfsdfd', req.params)
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
    user.find({ type: 'pharmacy', $or: [{first_name : { $regex: '.*' + req.params.name + '.*', $options: 'i' }}, {alies_id : { $regex: '.*' + req.params.name + '.*', $options: 'i' }},{profile_id : { $regex: '.*' + req.params.name + '.*', $options: 'i' }}]},'profile_id _id first_name last_name',
        function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'User is not found', error: err })
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'User is found', data: doc })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})
 
router.get('/pharmacyPrescription/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var storedPrescriptions = [];
        user.findOne({ _id: req.params.UserId}, function (err, doc) {
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
            } else {
                if (doc.track_record.length > 0) {
                    doc.track_record.forEach((element, index) => {
                        if(element.type==='prescription')
                        {
                            storedPrescriptions.push(element)
                        }
                    }) 
                }
                else 
                {
                    storedPrescriptions = [];
                }
                data = {first_name: doc.first_name, last_name: doc.last_name, _id: doc._id, profile_id: doc.profile_id, email: doc.email, track_record: storedPrescriptions }
                res.json({ status: 200, hassuccessed: true, msg: 'Data is found', data : data })
            }
        })
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

function getArAlltrack(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            user.findOne({_id: data.created_by}).exec()
            .then(function(doc3){
                var new_data = data;
                if (doc3.last_name) {
                    var created_by = doc3.first_name + ' ' + doc3.last_name;
                }
                else {
                    var created_by = doc3.first_name;
                }
                new_data.created_by_temp = created_by;
                new_data.created_by_image = doc3.image;
                return new_data;
             
            }).then(function(new_data){
                if(data.patient_id)
                {
                     user.findOne({profile_id: data.patient_id}).exec()
                    .then(function(doc5){
                        if(doc5)
                        {
                            var new_data = data;
                            if (doc5.last_name) {
                                var patient_name = doc5.first_name + ' ' + doc5.last_name;
                            }
                            else {
                                var patient_name = doc5.first_name;
                            }
                            new_data.patient_name = patient_name;
                            new_data.patient_alies_id= doc5.alies_id;
                            new_data.patient_default_id = doc5._id
                            new_data.patient_image = doc5.image;
                        }
                        return new_data;
                    })
                } 
                if(data.archive)
                {
                    trackrecord2.push(new_data);
                }
                
                resolve(trackrecord2);
            })
        });
    });
}

function getAlltrack(data) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            user.findOne({_id: data.created_by}).exec()
            .then(function(doc3){
                var new_data = data;
                if(doc3){
                    if (doc3.last_name) {
                        var created_by = doc3.first_name + ' ' + doc3.last_name;
                    }
                    else {
                        var created_by = doc3.first_name;
                    }
                    new_data.created_by_temp = created_by; 
                    new_data.created_by_image = doc3.image;
                }
                return new_data;
            }).then(function(new_data){
                if(data.patient_id)
                {
                     user.findOne({profile_id: data.patient_id}).exec()
                    .then(function(doc5){
                        console.log('Here1',doc5)
                        if(doc5)
                        {

                            console.log('Here11', )
                            var new_data = data;
                            if (doc5.last_name) {
                                var patient_name = doc5.first_name + ' ' + doc5.last_name;
                            }
                            else {
                                var patient_name = doc5.first_name;
                            }
                            new_data.patient_name = patient_name;
                            new_data.patient_alies_id= doc5.alies_id;
                            new_data.patient_default_id = doc5._id
                            new_data.patient_image = doc5.image;
                            console.log('Here12', new_data)
                            return new_data;
                        }
                        else{
                            console.log('Her33')
                            return new_data;  
                        }
                    })
                }
                if(!data.archive)
                {
                    console.log('erer',)
                    trackrecord1.push(new_data);
                }
                
                resolve(trackrecord1);
            })
        });
    });
}

function mySorter(a, b) {
    var x = a.datetime_on.toLowerCase();
    var y = b.datetime_on.toLowerCase();
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
}
module.exports = router;