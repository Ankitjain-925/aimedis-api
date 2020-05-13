var express             = require('express');
let router              = express.Router();
const multer            = require("multer");
var User                = require('../schema/user.js');
var Membership          = require('../schema/membership.js')
var Metadata            = require('../schema/metadata')
var Appointment         = require('../schema/appointments')
var DoctrorAppointment  = require('../schema/doctor_appointment')
var Prescription        = require('../schema/prescription')
var Second_opinion      = require('../schema/second_option')
var Sick_certificate    = require('../schema/sick_certificate')
var jwtconfig           = require('../jwttoken');
var base64              = require('base-64');
var dateTime            = require('node-datetime');
var nodemailer          = require('nodemailer');
var moment = require('moment');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'ankita.webnexus@gmail.com',
    pass: 'ankita@30webnexus'
    }
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        console.log('filesss', file),
            cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage }).single("uploadImage");
var upload1 = multer({ storage: storage }).array("UploadDocument", 5);




router.post('/uploadImage', function (req, res, next) {
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err})
            } else if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err})
            }
            else {
                var file_entry = { filename: res.req.file.filename, filetype: req.file.mimetype, url: res.req.file.destination + '/' + res.req.file.filename }
                res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
            }
        })
    }
    else {
    res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post('/sendRegisterationMail',function (req,res,next){
    const token = (req.headers.token)
    var link = 'http://localhost:3000/';
    var mailOptions = {
        from    : 'ankita.webnexus@gmail.com',
        to      :  req.body.email,
        subject : 'Aimedis Registeration',
        html    : '<div>You have registered sucessfully'
        + '<a href="' + link + '?token=' + token + '">click here</a> to login</div>'
        + '<div>If you have any questions, please do not hesitate to contact us via icuservices@aimedis.com.</div>'
        + '<div style="color:#ddd, font-size: 9px;">Aimedis Customer Support <br/> - Aimedis B.V. <br/> Sint Michaëlstraat 45935 BL Steyl<br/> Netherlands - <br/>Aimedis B.V. Netherlands'
        + '<br/>Management board: Michael J. Kaldasch MD, CEO, Ben El Idrissi MD, COO <br/> VAT No.: NL858194478B01</div>'
    };
    var sendmail = transporter.sendMail(mailOptions)
})

//For login the user

router.post('/UserLogin',function (req, res, next) {
    User.findOne({
        email: req.body.email,
    }).exec()
        .then((user_data) => {
            console.log(user_data);
            if (user_data) {
                if (user_data.isblock === true) {
                    res.json({status: 450,hassuccessed: false, message: "User is blocked"})
                }
                else {
                    var decode = base64.encode(req.body.password);
                    if (user_data.password === decode) {
                        let payload = {
                            email : req.body.email,
                            name  : user_data.first_name + " " + user_data.last_name,
                            id    : user_data._id,
                            type  : user_data.type
                        }
                        var token = jwtconfig.sign(payload);
                        res.json({status: 200,message: "Succefully fetched",hassuccessed: true, user: user_data,token: token})
                    }
                    else {
                        res.json({status: 450,message: "Wrong password",hassuccessed: false })
                    }
                }
            }
            else {
                res.json({status: 450,message: "User does'nt exist",hassuccessed: false})
            }
        })
    })

/*-----------------------F-O-R---A-D-D-I-N-G---U-S-E-R-S-------------------------*/

router.post('/AddUser', function (req , res , next) {
    console.log(req.body);
            User.findOne({ email: req.body.email }).exec().then((data1) => {
            if (data1) {
                res.json({ status: 200, message: 'Email is Already exist', hassuccessed: false });
            }else{
                var isblock    = { isblock: false }
                var dt         = dateTime.create();
                var createdate = { createdate: dt.format('Y-m-d H:M:S') }
                var createdby  = { pin : '1234'}
                var enpassword =   base64.encode(req.body.password);
                req.body.password = enpassword;
                datas = { ...req.body,  ...isblock, ...createdate,...createdby}
                var users = new User(datas);
                var user_id;
                users.save(function (err, user_data) {
                    if (err && !user_data) {
                        res.json({ status: 200, message: 'Something went wrong.', error: err });
                    } else {
                        user_id = user_data._id;
                        console.log('dfdfd', user_id);
                        res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true ,data :user_data});
                    }
                })
            }
        });
    })

/*-----------------------D-E-L-E-T-E---P-A-R-T-I-C-U-L-A-R---U-S-E-R-------------------------*/

router.delete('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findByIdAndRemove(req.params.User_id, function (err, data) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
            } else {
                res.json({ status: 200, hassuccessed: true, message: 'User is Deleted Successfully' });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*-----------------------G-E-T---U-S-E-R-------------------------*/

router.get('/Users/:User_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id: req.params.User_id }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
            } else {
                Userinfo.password = base64.decode(Userinfo.password);
                res.json({status: 200, hassuccessed: true, data : Userinfo});
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

router.get('/Users/getDoc', function (req, res, next) {
    User.find({ type: doctor },function (err, Userinfoonee) {
        if (err) {
            next(err);
        } else {
            res.json(Userinfoonee);
        }
    });
})

/*------U-P-D-A-T-E---U-S-E-R------*/

router.put('/Users/update', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({ _id : legit.id }, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' ,error : err})
            } 
            if(changeStatus){
                var enpassword = base64.encode(req.body.password);
                req.body.password = enpassword;
                User.findByIdAndUpdate({ _id: changeStatus._id },
                req.body ,
                function (err, doc) {   
                    if (err && !doc) {
                        res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                        } else {
                        res.json({ status: 200, hassuccessed: true, message: 'Updated' })
                        }
                    });
                }
            })
        }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.put('/Users/updateImage', function (req,res,next){
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.findOneAndUpdate({_id : legit.id}, {$set:{image : req.body.image}}, {new: true}, (err, doc1) => {
                if (err && !doc1) {
                    res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                }else{
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc1 })
                }
            });
        }else{
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.'})
        }
    })

/*------A-D-D---M-E-M-B-E-R-H-I-P------*/

router.post('/Membership', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        User.findOne({_id: legit.id}, function (err, changeStatus) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' ,error : err})
            } 
            else{
                let user_id = { user_id: legit.id }
                let user_type = { user_type: changeStatus.type }
                datas = { ...req.body,  ...user_type, ...user_id}
                var memberships = new Membership(datas);
                memberships.save(function(err,membershipData){
                    if(err){
                        res.json({ status:200 , hassuccessed:false , message:"something went wrong" , error:err})
                    }else{
                       User.updateOne({ _id: legit.id },{ $push: { membership: membershipData } },
                            { safe: true, upsert: true },  function (err, doc) {   
                            if (err && !doc) {
                                res.json({ status : 200, hassuccessed : false, message : 'update data failed' ,error : err})
                                } else {
                                res.json({ status : 200, hassuccessed : true, message : 'Updated',data : doc})
                            }
                        });
                    }
                })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
    }
})

/*------U-P-D-A-T-E---U-S-E-R---M-E-M-B-E-R-S-H-I-P------*/

router.put('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Membership.findByIdAndUpdate({ _id: req.params.Membership_id  },req.body ,function (err, doc) {   
            if (err && !doc) {
                res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                } else {
               // res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc })
                User.findOneAndUpdate({_id: doc.user_id}, {$set:{membership : doc}}, {new: true}, (err, doc1) => {
                    if (err && !doc1) {
                        res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                    }else{
                        res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc1 })
                    }
                });
            }
        });
    }
    else {
        res.json({ status : 200, hassuccessed : false, message : 'Authentication required.' })
    }
})

/*----------G-E-T---M-E-M-B-E-R-S-H-I-P---------*/

router.get('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Membership.findOne({ _id: req.params.Membership_id }, function (err, Userinfo) {
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

/*----------D-E-L-E-T-E---M-E-M-B-E-R-S-H-I-P----------*/

router.delete('/Membership/:Membership_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit   = jwtconfig.verify(token)
        if (legit) {
            var memId = req.params.Membership_id;
            Membership.findByIdAndRemove(req.params.Membership_id, function (err, data) {
            if (err) {
                res.json({ status : 200, hassuccessed : false, message : 'Something went wrong.' , error : err });
            } else {
                    User.updateOne({ _id : legit.id },
                    { $pull : { membership : { _id : memId }}},
                    { multi : true },
                    function (err, doc) {
                        if (err && !doc) {
                            res.json({ status : 200, hassuccessed : false, msg : 'Something went wrong', error : err })
                        } else {
                            if (doc.nModified == '0') {
                                res.json({ status : 200, hassuccessed : false, msg : ' record is not found' })
                            }else {
                                res.json({ status : 200, hassuccessed : true, msg : 'membership is deleted' })
                            }
                        }
                    });
                }
            });
        } else {
            res.status(401).json({ status : 200, hassuccessed : false, msg : 'Authentication required.' })
        }
    });

    /*-----------M-E-T-E-D-A-T-A----------*/
    
    router.post('/Metadata', function (req, res, next) {
        var Metadatas = new Metadata(req.body);
        Metadatas.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true ,data :user_data});
            }
        })
    })


    router.put('/Metdata/:Metdata_id', function(req,res,next){
        Metadata.findByIdAndUpdate({_id : req.params.Metadata_id}, { $push: { speciality : req.body.speciality } },
            { safe: true, upsert: true },function( err , updatedata){
            if( err && !updatedata){
                res.json({ status : 200 ,hassuccessed : false ,message : "something went wrong" , error : err })
            }else{
                res.json({ status : 200 , hassuccessed : true ,message : "user updated" ,data : userdata})
            }
        })
    })

    router.get('/Metadata', function (req, res, next) {
            Metadata.find(function (err, Metadatas) {
                if (err) {
                    next(err);
                } else {
                    res.json(Metadatas);
                }
            });
        })
   
    /*---------R-I-S-K---M-A-N-A-G-E-M-E-N-T----------*/
    
    router.put('/Rigt_management', function(req,res,next){
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            User.findOne({ _id : legit.id }, function( err , userdata ){
                if(err){
                    res.json({ status : 200, hassuccessed : false ,message : "user not found" , error : err})
                }else{
                    User.findByIdAndUpdate({_id : userdata._id},{ $set : { Rigt_management : req.body } }
                        ,function( err , updatedata ){
                        if(err && !updatedata ){
                            res.json({ status : 200 , hassuccessed : false , message : "something went wrong" , error : err})
                        }else{
                            res.json({ status: 200 , hassuccessed : true , message : "user updated" , data : userdata })
                        }
                    })
                }
            })
        }
    })
    /*----------O-R-G-A-N---D-O-N-O-R----------*/

    router.put('/organDonor', function(req,res,next){
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            User.findOne({ _id : legit.id }, function( err , userdata ){
                if(err){
                    res.json({ status : 200, hassuccessed : false ,message : "user not found" , error : err})
                }else{
                    User.findByIdAndUpdate({_id : userdata._id},{ $set : { organ_donor : req.body } }
                        ,function( err , updatedata ){
                        if(err && !updatedata ){
                            res.json({ status : 200 , hassuccessed : false , message : "something went wrong" , error : err})
                        }else{
                            res.json({ status: 200 , hassuccessed : true , message : "user updated" , data : userdata })
                        }
                    })
                }
            })
        }
    })

    /*----------O-R-G-A-N---D-O-N-O-R---E-N-D-S----------*/

   /*-----------R-E-G-I-S-T-R-A-T-I-O-N----------*/

   router.post('/Registration',function(req,res,next){
       var users =new User(req.body);
       var enpassword = base64.encode(req.body.password);
       req.body.password = enpassword;
       users.save(function(err, data){
           if(err && !data){
               res.json({status : 200, hassuccessed :false,message : "something went wrong" ,error:err})
           }else{
               res.json({status:200 ,hassuccessed:false,message: "saved successfully" })
           }
       })
    })

    /*----------P-R-E-S-C-C-R-I-P-T-I-O-N----------*/

    router.post('/Prescription',function(req,res,next){
        var prescriptions = new Prescription(req.body)
        prescriptions.save(function(err,data){
            if(err && !data){
                res.json({status:200,hassuccessed:false,message:"something went wrong",error : err})
            }else{
                res.json({status : 200,hassuccessed:true,message:"success"})
            }
        })
    })
    router.post('/Prescription',function(req,res,next){
        var prescription = new Prescription(req,body)
        prescription.save(function(err,data){
            if(err && !data){
                res.json({status:200,hassuccessed:false,message:"something went wrong",error : err})
            }else{
                res.json({status : 200 ,hassuccessed:true,message : "no success"})
            }
        })
    })

    router.get('/Prescription/:Prescription_id', function (req, res, next) {
       const token = (req.headers.token)
       let legit   = jwtconfig.verify(token)
       if (legit) {
           Prescription.findOne({ _id: req.params.Prescription_id }, function (err, data) {
               if (err) {
                   res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
               } else {
                   res.json({status: 200, hassuccessed: true, data : data});
               }
            });
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })


    router.delete('/Prescription/:Prescription_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Prescription.findByIdAndRemove(req.params.Prescription_id, function (err, data) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    res.json({ status: 200, hassuccessed: true, message: 'Prescription is Deleted Successfully' });
                }
            });
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.get('/GetPrescription', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Prescription.find({ doctor_id: legit.id , status :'free'}, function (err, Userinfo) {
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

    router.put('/GetPrescription/:Prescription_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            Prescription.findOne({ _id : req.params.Prescription_id }, function( err , userdata ){
                if(err){
                    res.json({ status: 200, hassuccessed: false ,message: " not found" , error: err})
                }else{
                    Prescription.findOneAndUpdate({_id : userdata._id}, {$set: {status: req.body.status}},{new: true}, function( err , updatedata ){
                        if(err && !updatedata){
                            res.json({ status: 200 , hassuccessed: false , message: "something went wrong" , error: err})
                        }else{
                            res.json({ status: 200 , hassuccessed: true , message: "user updated" , data: userdata })
                        }
                    })
                }
            })
        }else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    /*----------S-I-C-K---C-E-R-T-I-F-I-C-A-T-E----------*/

    router.post('/SickCertificate',function(req,res,next){
        var SickCertificate = new Sick_certificate(req.body)
        SickCertificate.save(function(err,data){
            if(err && !data){
                res.json({ status:200 , hassuccessed:false , message:"something went wrong", error : err })
            }else{
                res.json({ status : 200 , hassuccessed:true , message:"success" })
            }
        })
    })


    router.get('/SickCertificate/:sick_certificate_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Sick_certificate.findOne({ _id: req.params.sick_certificate_id }, function (err, data) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    res.json({status: 200, hassuccessed: true, data : data});
                }
            });
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.delete('/SickCertificate/:sick_certificate_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Sick_certificate.findByIdAndRemove(req.params.sick_certificate_id, function (err, data) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    res.json({ status: 200, hassuccessed: true, message: 'Certificate is Deleted Successfully' });
                }
            });
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.get('/GetSickCertificate', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            Sick_certificate.find({ doctor_id: legit.id }, function (err, Userinfo) {
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

    router.put('/GetSickCertificate/:sick_certificate_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            Sick_certificate.findOne({ _id : req.params.sick_certificate_id }, function( err , userdata ){
                if(err){
                    res.json({ status: 200, hassuccessed: false ,message: "user not found" , error: err})
                }else{
                    Sick_certificate.findOneAndUpdate({_id : userdata._id}, {$set: {status: req.body.status}},{new: true}, function( err , updatedata ){
                        if(err && !updatedata){
                            res.json({ status: 200 , hassuccessed: false , message: "something went wrong" , error: err})
                        }else{
                            res.json({ status: 200 , hassuccessed: true , message: "user updated" , data: userdata })
                        }
                    })
                }
            })
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    /*----------M-Y---P-A-T-I-E-N-T-S----------*/
    router.get('/Mypatients', function (req, res, next) {
        const token = (req.headers.token)
        let   legit = jwtconfig.verify(token)
        if (legit) {
            User.find({ parent_id : legit.id ,type : 'patient'}, function (err, Userinfo) {
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

    router.delete('/Mypatients/:patient_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if (legit) {
            console.log(req.params.patient_id);
            User.findByIdAndRemove(req.params.patient_id, function (err, data) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    res.json({ status: 200, hassuccessed: true, message: 'User is Deleted Successfully' });
                }
            });
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    /*----------A-P-P-O-I-N-T-M-E-N-T-S----------*/

    router.get('/Appointments',function(req,res,next){
        const token =(req.headers.token)
        let legit =jwtconfig.verify(token)
        if(legit){
            Appointment.find({ doctor_id : legit.id }, function( err , userdata ){
                if(err && !userdata){
                    res.json({ status: 200, hassuccessed: false ,message: "user not found" , error: err})
                }else{
                   res.json({status:200 , hassuccessed :true , data : userdata})
                }
            })
        }else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.post('/Appointments/Addappontments',function(req,res,next){
        console.log(req.body);
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if (legit) {
            var Appointments = new Appointment(req.body);
            Appointments.save(function (err, data) {
                if (err && !data) {
                    res.json({ status: 200, message: 'Something went wrong.', error: err });
                } else {
                    res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true ,data :data});
                }
            })
        }
        else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

    router.put('/Appointments/:Appointments_id', function(req,res,next){
        const token   =  req.headers.token
        let legit =jwtconfig.verify(token)
        if(legit){
            Appointment.findOneAndUpdate({_id : req.params.Appointments_id}, {$set: {status: req.body.status}},{new: true}, function( err , updatedata ){
                if(err && !updatedata){
                    res.json({ status: 200 , hassuccessed: false , message: "something went wrong" , error: err})
                }else{
                    res.json({ status: 200 , hassuccessed: true , message: "updated" , data: updatedata })
                }
            })
        }
    })

    router.post('/Mypatients/create_patient', function(req,res,next){
        count = token = req.headers.token
        let legit =jwtconfig.verify(token)
        if(legit){
            User.findOne({ email: req.body.email }).exec().then((data1) => {
                if (data1) {
                    res.json({ status: 200, message: 'Email is Already exist', hassuccessed: false });
                }else{
                    var parent_id  = {parent_id : legit.id}
                    var enpassword = base64.encode(req.body.password);
                    req.body.password = enpassword;
                    datas = { ...req.body,...parent_id}
                    var users = new User(datas);
                    var user_id;
                    users.save(function (err, user_data) {
                        if (err && !user_data) {
                            res.json({ status: 200, message: 'Something went wrong.', error: err });
                        } else {
                            user_id = user_data._id;
                            console.log('dfdfd', user_id);
                            res.json({ status: 200, message: 'User is added Successfully', hassuccessed: true ,data :user_data});
                        }
                    })
                }
            });
        }
    })

    router.post('/Second_opinion', function(req,res,next){
        count = token = req.headers.token
        let legit =jwtconfig.verify(token)
        if(legit){
            var user_id  = {user_id : legit.id}
            datas = { ...req.body , ...user_id }
            var Second_opinions = new Second_opinion(datas);
            Second_opinions.save(function (err, user_data) {
                if (err && !user_data) {
                    res.json({ status: 200, message: 'Something went wrong.', error: err });
                } else {
                    res.json({ status: 200, message: 'Added Successfully', hassuccessed: true ,data :user_data});
                }
            })
        }
    })

    router.post('/Second_opinion/UploadDocument', function (req, res, next) {
        const token = ( req.headers.token )
        let   legit = jwtconfig.verify(token)
        console.log(legit.id,'navdeep')
        if (legit) {
            upload1(req, res, function (err) {
                console.log('1');
                if (err instanceof multer.MulterError){
                    console.log('2');
                    res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
                } else if (err){
                    console.log('3');
                    res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
                }else {
                    console.log('4');
                    var file_entry = [];
                    res.req.files.forEach((item, index) => {
                        file_entry.push({ filename: item.filename, filetype: item.mimetype, url: item.destination + '/' + item.filename })
                    })
                    res.json({ status: 200, hassuccessed: true, msg: 'image is uploaded', data: file_entry })
                }
            })
        }
        else {
            res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
        }
    });

    /*----------D-O-C-T-O-R---A-P-P-O-I-N-T-M-E-N-T---S-C-H-E-D-U-L-E----------*/
    
    router.put('/private_appointments/:doctor_id', function (req,res,next){
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.findOneAndUpdate({_id: req.params.doctor_id}, {$set:{private_appointments : req.body}}, {new: true}, (err, doc1) => {
                if (err && !doc1) {
                    res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                }else{
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc1 })
                }
            });
        }else{
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.'})
        }
    })

    router.put('/DaysforPractices/:doctor_id', function (req,res,next){
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.findOneAndUpdate({_id: req.params.doctor_id}, {$set:{days_for_practices : req.body}}, {new: true}, (err, doc1) => {
                if (err && !doc1) {
                    res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                }else{
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc1 })
                }
            });
        }else{
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.'})
        }
    })

    router.put('/onlineAppointments/:doctor_id', function (req,res,next){
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.findOneAndUpdate({_id: req.params.doctor_id}, {$set:{online_appointment : req.body}}, {new: true}, (err, doc1) => {
                if (err && !doc1) {
                    res.json({ status: 200, hassuccessed: false, message: 'update data failed' ,error : err})
                }else{
                    res.json({ status: 200, hassuccessed: true, message: 'Updated', data :doc1 })
                }
            });
        }else{
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.'})
        }
    })
 
    /*----------E-N-D----------*/    

    /*-----------G-E-T---D-O-C-T-O-R-S----------*/
    
    router.get('/DoctorUsers', function (req, res, next){
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.find({type:'doctor',first_name:{$exists:true}}, function (err, Userinfo) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    res.json({status: 200, hassuccessed: true, data : Userinfo});
                }
            });
        }
    })

    // router.get('/FavDoctor', function (req, res, next){
    //     const token = (req.headers.token)
    //     let legit   = jwtconfig.verify(token)
    //     if(legit){
    //         User.find({type:'doctor',first_name:{ $exists:true }}, function (err, Userinfo) {
    //             if (err) {
    //                 res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
    //             } else {
    //                 //res.json({status: 200, hassuccessed: true, data : Userinfo});
    //                 User.findOne({ _id : legit.id }, function( err1 , userdata ){
    //                     if(userdata.fav_doctor.length > 0){
    //                         for(let i=0 ; i<userdata.fav_doctor.length ; i++){
                                
    //                         }
    //                     }else{
    //                         res.json({status: 200, hassuccessed: true, data : Userinfo});
    //                     }
    //                 })
    //             }
    //         });
    //     }
    // })

    function getTimeStops(start, end ,timeslots){
        var startTime = moment(start, 'HH:mm');
        var endTime = moment(end, 'HH:mm');
        var timeslot = parseInt(timeslots,10)
        
        if( endTime.isBefore(startTime) ){
          endTime.add(1, 'day');
        }
        var timeStops = [];
        while(startTime <= endTime){
          timeStops.push(new moment(startTime).format('HH:mm'));
          startTime.add(timeslot, 'minutes');
        }
        return timeStops;
    }

    router.get('/DoctorAppointments', function (req, res, next) {
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if(legit){
            User.find({ type:'doctor',first_name:{$exists:true} }, function (err, Userinfo) {
                if (err) {
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                } else {
                    var finalArray =[];
                    let monday,tuesday,wednesday,thursday,friday,saturday,sunday
                    for(let i = 0 ;i < Userinfo.length ; i++ ){
                        var user =[];
                        var online_users =[];
                        for(let j =0; j<Userinfo[i].private_appointments.length; j++){
                            if(Userinfo[i].private_appointments[j].monday_start,Userinfo[i].private_appointments[j].monday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 monday    = getTimeStops(Userinfo[i].private_appointments[j].monday_start,Userinfo[i].private_appointments[j].monday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].tuesday_start,Userinfo[i].private_appointments[j].tuesday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 tuesday   = getTimeStops(Userinfo[i].private_appointments[j].tuesday_start,Userinfo[i].private_appointments[j].tuesday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].wednesday_start,Userinfo[i].private_appointments[j].wednesday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 wednesday = getTimeStops(Userinfo[i].private_appointments[j].wednesday_start,Userinfo[i].private_appointments[j].wednesday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].thursday_start,Userinfo[i].private_appointments[j].thursday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 thursday  = getTimeStops(Userinfo[i].private_appointments[j].thursday_start,Userinfo[i].private_appointments[j].thursday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].friday_start,Userinfo[i].private_appointments[j].friday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 friday    = getTimeStops(Userinfo[i].private_appointments[j].friday_start,Userinfo[i].private_appointments[j].friday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].saturday_start,Userinfo[i].private_appointments[j].saturday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 saturday  = getTimeStops(Userinfo[i].private_appointments[j].saturday_start,Userinfo[i].private_appointments[j].saturday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            if(Userinfo[i].private_appointments[j].sunday_start,Userinfo[i].private_appointments[j].sunday_end,Userinfo[i].private_appointments[j].duration_of_timeslots){
                                 sunday    = getTimeStops(Userinfo[i].private_appointments[j].sunday_start,Userinfo[i].private_appointments[j].sunday_end,Userinfo[i].private_appointments[j].duration_of_timeslots)
                            }
                            user.push({monday ,tuesday,wednesday,thursday,friday,saturday,sunday})
                        }
                        for(let k =0; k<Userinfo[i].online_appointment.length; k++){
                            if(Userinfo[i].online_appointment[k].monday_start,Userinfo[i].online_appointment[k].monday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 monday    = getTimeStops(Userinfo[i].online_appointment[k].monday_start,Userinfo[i].online_appointment[k].monday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].tuesday_start,Userinfo[i].online_appointment[k].tuesday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 tuesday   = getTimeStops(Userinfo[i].online_appointment[k].tuesday_start,Userinfo[i].online_appointment[k].tuesday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].wednesday_start,Userinfo[i].online_appointment[k].wednesday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 wednesday = getTimeStops(Userinfo[i].online_appointment[k].wednesday_start,Userinfo[i].online_appointment[k].wednesday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].thursday_start,Userinfo[i].online_appointment[k].thursday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 thursday  = getTimeStops(Userinfo[i].online_appointment[k].thursday_start,Userinfo[i].online_appointment[k].thursday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].friday_start,Userinfo[i].online_appointment[k].friday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 friday    = getTimeStops(Userinfo[i].online_appointment[k].friday_start,Userinfo[i].online_appointment[k].friday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].saturday_start,Userinfo[i].online_appointment[k].saturday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 saturday  = getTimeStops(Userinfo[i].online_appointment[k].saturday_start,Userinfo[i].online_appointment[k].saturday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            if(Userinfo[i].online_appointment[k].sunday_start,Userinfo[i].online_appointment[k].sunday_end,Userinfo[i].online_appointment[k].duration_of_timeslots){
                                 sunday    = getTimeStops(Userinfo[i].online_appointment[k].sunday_start,Userinfo[i].online_appointment[k].sunday_end,Userinfo[i].online_appointment[k].duration_of_timeslots)
                            }
                            online_users.push({monday ,tuesday,wednesday,thursday,friday,saturday,sunday})
                        }
                        finalArray.push({
                            data:Userinfo[i],
                            appointments:user,
                            online_appointment:online_users
                        })
                    }
                    res.json({status: 200, hassuccessed: true, data : finalArray});
                }
            });
        }
    })

    router.get('/DoctorProfile/:doctor_id', function (req, res, next) {
        User.findOne({ _id:req.params.doctor_id }, function (err, Userinfo) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
            } else {
                res.json({status: 200, hassuccessed: true, data : Userinfo});
            }
        });
    })

    /*----------E-N-D----------*/ 

    /*----------S-T-R-I-P-E---P-A-Y-M-E-N-T----------*/
    router.put('/paid_services', function(req,res,next){
        console.log(req,'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            User.findOne({ _id : legit.id }, function( err , userdata ){
                if(err){
                    res.json({ status : 200, hassuccessed : false ,message : "user not found" , error : err})
                }else{
                    User.findByIdAndUpdate({_id : userdata._id},{ $push : { paid_services : req.body } }
                        ,function( err , updatedata ){
                        if(err && !updatedata ){
                            res.json({ status : 200 , hassuccessed : false , message : "something went wrong" , error : err})
                        }else{
                            res.json({ status: 200 , hassuccessed : true , message : "user updated" , data : userdata })
                        }
                    })
                }
            })
        }
    })

    /*----------A-D-D---F-A-V-O-I-R-I-T-E---D-O-C-T-O-R----------*/

    router.put('/AddFavDoc', function(req,res,next){
        const token = (req.headers.token)
        let legit = jwtconfig.verify(token)
        if(legit){
            User.findOne({ _id : legit.id }, function( err , userdata ){
                if(err){
                    res.json({ status : 200, hassuccessed : false ,message : "user not found" , error : err})
                }else{
                    User.find({ profile_id : req.body.doctor  }, function( err1 , userdata1 ){
                        if(err1){
                            res.json({ status : 200 , hassuccessed : false ,message : "Invalid doctor Id" , error : err1})
                        }else{
                            User.find({ fav_doctor : {doctor : req.body.doctor}}, function( err2 , userdata2 ){
                                if(err2){
                                    res.json({ status : 200 , hassuccessed : false , message : "something went wrong" , error : err})
                                }else{
                                    if(userdata2 !=''){
                                        res.json({ status : 200 , hassuccessed : false , message : "Doctor already exists" , error : err})
                                    }else{
                                        User.findByIdAndUpdate( { _id : userdata._id },{ $push : { fav_doctor : req.body } }
                                            ,function( err2 , updatedata ){
                                            if(err2 && !updatedata ){
                                                res.json({ status : 200 , hassuccessed : false , message : "something went wrong" , error : err})
                                            }else{
                                                res.json({ status: 200 , hassuccessed : true , message : "user updated" , data : userdata })
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    /*-----------------------D-E-L-E-T-E---F-A-V-O-U-R-I-T-E---D-O-C-T-O-R-------------------------*/

    router.delete('/favDocs/:User_id', function (req, res, next) {
        const token = (req.headers.token)
        let legit   = jwtconfig.verify(token)
        if (legit) {
            User.update({ _id : legit.id } , { $pull: {  fav_doctor:{doctor :  req.params.User_id} } },
                { multi: true },
                function( err , userdata ){
                if(err){
                    res.json({ status: 200, hassuccessed: false, message: 'Something went wrong.' , error: err});
                }else{
                    res.json({ status: 200, hassuccessed: true, message: 'Deleted Successfully' });
                }
            })
        }else {
            res.json({ status: 200, hassuccessed: false, message: 'Authentication required.' })
        }
    })

module.exports = router;