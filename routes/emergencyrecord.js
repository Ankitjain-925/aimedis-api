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
                                    console.log('doc.family_doc[0]', doc.family_doc[0])
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
                                var personal_info = {_id: doc._id, profile_id: doc.profile_id, first_name: doc.first_name, last_name: doc.last_name, birthday: doc.birthday}
                                var contact_partner ={name : doc.emergency_contact_name, number: doc.emergency_number,email: doc.emergency_email}
                                var statusbyp, remarksbyp, options;
                                if(doc.organ_donor && doc.organ_donor.length>0)
                                {
                                    if(doc.organ_donor[0].selectedOption)
                                    {
                                        if(doc.organ_donor[0].selectedOption == 'yes_to_all')
                                        {
                                            statusbyp = {label_en : 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead',
                                            label_pt : 'Transplante de um ou mais órgãos / tecidos meus depois que os médicos me declararam morto',
                                            label_nl : 'Transplantatie van een of meer organen / weefsels van mij nadat doktoren mij dood hebben verklaard',
                                            label_rs : 'Трансплантация одного или нескольких моих органов / тканей после того, как врачи констатировали мою смерть',
                                            label_de : 'Transplantation eines oder mehrerer Organe / Gewebe von mir, nachdem Ärzte mich für tot erklärt haben',
                                            label_sw : 'Kupandikiza kiungo / tishu moja yangu au zaidi baada ya madaktari kutangaza kuwa nimekufa',
                                            label_sp : 'Trasplante de uno o más órganos / tejidos míos después de que los médicos me declararon muerto',
                                            label_ch :  '在医生宣布我死亡后，我的一个或多个器官/组织的移植',
                                        }
                                            options =''
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'exclude_some')
                                        {
                                            statusbyp = {label_en : 'Transplantation of organ / tissues of mine after doctors have pronounced me dead accept for following organ / tissues',
                                            label_pt : 'Transplante de órgãos / tecidos meus depois que os médicos me declararam morto aceito para os seguintes órgãos / tecidos',
                                            label_nl : 'Transplantatie van orgaan / weefsels van mij nadat doktoren mij dood hebben verklaard, accepteren voor het volgen van orgaan / weefsels',
                                            label_rs : 'Трансплантация моего органа / тканей после того, как врачи объявили меня мертвым, согласны на следующие органы / ткани',
                                            label_de : 'Die Transplantation von Organen / Geweben von mir, nachdem Ärzte mich für tot erklärt haben, akzeptiert für folgende Organe / Gewebe',
                                            label_sw : 'Upandikizaji wa chombo / tishu za mgodi baada ya madaktari kutamka kuwa nimekufa kukubali kwa kufuata chombo / tishu',
                                            label_sp : 'Trasplante de órganos / tejidos míos después de que los médicos me hayan declarado muerto aceptar para los siguientes órganos / tejidos',
                                            label_ch :  '在医生宣布我死亡接受以下器官/组织后，我的器官/组织的移植',}
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'include_some')
                                        {
                                            statusbyp = {label_en :'Transplantation of organ / tissues of mine after doctors have pronounced me dead only for following organ / tissues',
                                            label_pt : 'Transplante de órgãos / tecidos meus depois que os médicos me declararam morto apenas pelos seguintes órgãos / tecidos',
                                            label_nl : 'Transplantatie van orgaan / weefsels van mij nadat doktoren mij dood hebben verklaard, alleen voor het volgen van orgaan / weefsels',
                                            label_rs : 'Трансплантация моего органа / тканей после того, как врачи объявили меня мертвым, только для следующих органов / тканей',
                                            label_de : 'Transplantation von Organen / Geweben von mir, nachdem Ärzte mich nur für folgende Organe / Gewebe für tot erklärt haben',
                                            label_sw : 'Kupandikiza kiungo / tishu za mgodi baada ya madaktari kutangaza kuwa nimekufa tu kwa kufuata chombo / tishu',
                                            label_sp : 'Trasplante de órganos / tejidos míos después de que los médicos me hayan declarado muerto solo por los siguientes órganos / tejidos',
                                            label_ch :  '在医生宣布我仅因以下器官/组织死亡后，我的器官/组织的移植',}
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'not_allowed')
                                        {
                                            statusbyp = {label_en :'NOT allow a transplantation of any of my organs or tissues',
                                            label_pt : 'NÃO permitir o transplante de nenhum dos meus órgãos ou tecidos',
                                            label_nl : 'GEEN transplantatie van mijn organen of weefsels toestaan',
                                            label_rs : 'НЕ разрешать трансплантацию любого из моих органов или тканей',
                                            label_de : 'Erlaube KEINE Transplantation meiner Organe oder Gewebe',
                                            label_sw : 'USiruhusu upandikizaji wa viungo vyangu vyovyote au tishu',
                                            label_sp : 'NO permitir un trasplante de ninguno de mis órganos o tejidosd me dead',
                                            label_ch :  '不允许移植我的任何器官或组织',}
                                        }
                                        else if(doc.organ_donor[0].selectedOption == 'decided_by_following')
                                        {
                                            statusbyp = {label_en : 'Transplantation of one or more organ / tissues of mine after doctors have pronounced me dead YES or NO shall be decided by the following person',
                                            label_pt : 'O transplante de um ou mais órgãos / tecidos meus após os médicos me declararem morto SIM ou NÃO será decidido pela seguinte pessoa',
                                            label_nl : 'Transplantatie van een of meer organen / weefsels van mij nadat doktoren mij dood hebben verklaard JA of NEE wordt beslist door de volgende persoon',
                                            label_rs : 'Решение о трансплантации одного или нескольких моих органов / тканей после того, как врачи объявили меня умершим ДА или НЕТ, принимает следующий человек',
                                            label_de : 'Die Transplantation eines oder mehrerer Organe / Gewebe von mir, nachdem Ärzte mich für tot erklärt haben JA oder NEIN, wird von der folgenden Person entschieden',
                                            label_sw : 'Kupandikiza kiungo / tishu moja yangu au zaidi baada ya madaktari kutangaza kuwa nimekufa NDIYO au HAPANA kutaamuliwa na mtu ifuatayo',
                                            label_sp : 'El trasplante de uno o más órganos / tejidos míos después de que los médicos me hayan declarado muerto SÍ o NO lo decidirá la siguiente persona',
                                            label_ch :  '在医生宣布我已死亡后，我的一个或多个器官/组织的移植应由以下人员决定',}
                                            options = doc.organ_donor[0].OptionData 
                                        }
                                        else
                                        {
                                            statusbyp = {label_en : 'Nothing',
                                            label_pt : 'Nada',
                                            label_nl : 'Niets',
                                            label_rs : 'Ничего',
                                            label_de : 'Nichts',
                                            label_sw : 'Hakuna kitu',
                                            label_sp : 'Nada',
                                            label_ch :  '没有',}
                                            options = ''
                                        }
                                    }
                                   if(doc.organ_donor[0].free_remarks) 
                                   {remarksbyp = doc.organ_donor[0].free_remarks;}
                                   else { remarksbyp = ''} 
                                }
                                else {
                                    statusbyp = {label_en : 'Nothing',
                                            label_pt : 'Nada',
                                            label_nl : 'Niets',
                                            label_rs : 'Ничего',
                                            label_de : 'Nichts',
                                            label_sw : 'Hakuna kitu',
                                            label_sp : 'Nada',
                                            label_ch :  '没有',}
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
                                console.log('doc.family_doc[0]', doc.family_doc[0])
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
                            var contact_partner ={name : doc.emergency_contact_name, number: doc.emergency_number,email: doc.emergency_email}
                            var statusbyp, remarksbyp, options;
                            console.log('dddd')
                            if(doc.organ_donor && doc.organ_donor.length>0)
                            {
                                console.log('doc.organ_donor[0]',doc.organ_donor[0])
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

router.put('/AddstoredPre/:UserId', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var ids = { track_id: uuidv1() };
        var full_record = { ...ids, ...req.body.data }
        if(req.query.addtopatient && req.query.addtopatient==='true')
        {
            user.updateOne({ profile_id: req.body.data.patient_id },
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
    user.find({ type: 'pharmacy', first_name : { $regex: '.*' + req.params.name + '.*', $options: 'i' }},'profile_id _id first_name last_name',
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

function getAlltrack(data) {
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
                return new_data;
             
            }).then(function(new_data){
                if(data.review_by)
                {
                     user.findOne({_id: data.review_by}).exec()
                    .then(function(doc5){
                        var new_data = data;
                        if (doc5.last_name) {
                            var reviewed_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var reviewed_by = doc5.first_name;
                        }
                        new_data.review_by_temp = reviewed_by;
                        return new_data;
                    
                    })
                }
                if(data.emergency_by)
                {
                    user.findOne({_id: data.emergency_by}).exec()
                    .then(function(doc5){
                        console.log('ttttt112',doc5);
                        var new_data = data;
                        if (doc5.last_name) {
                            var emergency1_by = doc5.first_name + ' ' + doc5.last_name;
                        }
                        else {
                            var emergency1_by = doc5.first_name;
                        }
                        new_data.emergency_by_temp = emergency1_by;
                        return new_data;
                    })
                    
                } 
                if(!data.archive)
                {
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