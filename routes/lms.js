let express = require("express"),
    router = express.Router(),
    multer = require("multer"),
    jwtconfig = require('../jwttoken'),
    app = express(),
    Schema = require("../schema/lms_schema");
    Wishlist = require("../schema/wishlist_schema");
    var Payment             = require("../schema/payment_schema");
var lmsSchema = new Schema();



var lmsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/lmsFile')
    },
    filename: function (req, file, cb) {
        console.log('filesss', file),
            cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: lmsStorage }).single("uploadFile");

router.post("/addLms", (req, res) => {
    console.log("789455reqiuest", req.body);
    var lmsSchema = new Schema(req.body)
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        lmsSchema.save((err, result) => {
            if (result) {
                res.json({ status: 200, hassuccessed: true, msg: 'Successfully data Uploaded !', result: result })
            } else {
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in Inserting data', error: err })
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post("/getVideoList", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Schema.find({ permission: {$elemMatch: { $in :  [req.body.user_type] } }}, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})
router.post("/getFilteredVideoList", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Schema.find({ permission: {$elemMatch: { $in :  [req.body.user_type] } }, topic: {$elemMatch: { $in :  [req.body.keyword] } }}, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post("/getlanguageBasedVideoList", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Schema.find({ permission: {$elemMatch: { $in :  [req.body.user_type] } }, language : req.body.language } ,function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post("/addtowishlist", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        var data = {user_id : req.body.user_id, attachment : req.body.attachment, teaser : req.body.teaser, userName: req.body.userName, userType: req.body.userType, email: req.body.email,courseId : req.body.courseId, courseTitle:req.body.courseTitle, courseDesc : req.body.courseDesc, price: req.body.price}
        var wishlists = new Wishlist(data);
       
        wishlists.save(
            (err) => {
              if (err) { res.status(200).json({ mess: 'Error at Saving Data!', success: false, data: err }); }
              else {
                Wishlist.find({user_id : req.body.user_id }, function (err, result) {
                    if (err) {
                        res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
                    } else {
                        res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
                    }
                });
              }
            });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post("/getWishlist", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        
        Wishlist.find({user_id : req.body.user_id }, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post('/uploadFile', function (req, res, next) {
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        upload(req, res, function (err, data) {
            if (err instanceof multer.MulterError) {
                res.json({ status: 200, hassuccessed: false, msg: 'Problem in uploading the file', error: err })
            } else if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong', error: err })
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


router.get("/getAllLms", (req, res, next) => {
    const token = (req.headers.token)
    console.log('token', token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Schema.find({}, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all course', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})


// Model.update(query, { name: 'jason bourne' }, options, callback);
router.post("/editLms/:_id", (req, res) => {
    const token = (req.headers.token)
    console.log('token', token, req.params._id)
    let legit = jwtconfig.verify(token)
    console.log("Edit 124563", req.body)
    if (legit) {
        Schema.updateOne({_id: req.params._id}, req.body).then(data => {
            res.json({ status: 200, hassuccessed: true, msg: 'Course Data updated Successfully.', Data: data })
        }).catch(err=>{
            res.json({ status: 200, hassuccessed: false, msg: 'Something went Wrong.', Error:err })
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})
router.get("/getWishlist", (req, res) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Wishlist.find({}, (err, data) => {
            if (data) {
                console.log("Dataa", data)
                res.json({ status: 200, hassuccessed: true, msg: 'Course Wishlist Fetched Successfully.!',  data })
            } else {
                console.log("Error", err);
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong..' })
            }
        })
    }
    else { res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' }) }
})


router.delete('/removeLms/:Id', function (req, res, next) {
    let legit = jwtconfig.verify(req.headers.token)
    if (legit) {
        console.log('console params', req.params)
    Schema.findOneAndRemove({_id : req.params.Id} , function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'Course is Deleted' });
        }
    })
}
else { res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' }) }

})

router.get("/getOrderHistory/:id", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Payment.find({user_id : req.params.user_id }, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.post("/getOrderHistory", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Payment.find({user_id : req.body.user_id }, function (err, result) {
            if (err) {
                res.json({ status: 200, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})

router.get("/getOrderHistory", (req, res, next) => {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        Payment.find({}, function (err, result) {
            if (err) {
                res.json({ status: 400, message: 'Something went wrong', hassuccessed: false, err: err });
            } else {
                res.json({ status: 200, message: 'Get all succussfully', hassuccessed: true, data: result });
            }
        });
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
})


module.exports = router;

