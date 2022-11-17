require("dotenv").config();
var express = require("express");
let router = express.Router();
var virtual_therapys = require("../schema/virtual_therapy.js");
var jwtconfig = require("../jwttoken");
var fullinfo = [], newDatafull = [];
var CheckRole = require("./../middleware/middleware")

router.get("/Gettherapy/:_id/", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        virtual_therapys.findOne(

            { _id: req.params._id },

            function (err, userdata) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong",
                        error: err,
                    });
                } else {
                    res.json({
                        status: 200,
                        hassuccessed: true,
                        message: "Successfully Fetched",
                        data: userdata,
                    });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            message: "Authentication required.",
        });
    }
});

router.get("/Gettherapy/:house_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        let house_id = req.params.house_id;
        const VirtualtToSearchWith = new virtual_therapys({ house_id });
        VirtualtToSearchWith.encryptFieldsSync();
        virtual_therapys.findOne(
            {
                $or: [

                    { house_id: req.params.house_id },
                    { house_id: { $exists: true, $eq: VirtualtToSearchWith.house_id } },

                ],

            },


            function (err, userdata) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong",
                        error: err,
                    });
                } else {
                    res.json({
                        status: 200,
                        hassuccessed: true,
                        message: "Successfully Fetched",
                        data: userdata,
                    });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            message: "Authentication required.",
        });
    }
});

router.put("/Updatetherapy/:_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (legit) {
        virtual_therapys.updateOne(
            { _id: req.params._id },
            req.body,
            function (err, userdata) {
                if (err) {
                    res.json({
                        status: 200,
                        hassuccessed: false,
                        message: "Something went wrong",
                        error: err,
                    });
                } else {
                    res.json({
                        status: 200,
                        hassuccessed: true,
                        message: "Updated Successfully",
                        data: userdata,
                    });
                }
            }
        );
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            message: "Authentication required.",
        });
    }
});

//remove track record
router.delete('/Deletetherapy/:_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    if (legit) {
        virtual_therapys.findOneAndRemove({ _id: req.params._id }, function (err, data12) {
            if (err) {
                res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
            } else {
                res.json({ status: 200, hassuccessed: true, msg: 'Deleted Successfully' });
            }
        })
    }
    else {
        res.json({ status: 200, hassuccessed: false, msg: 'Authentication required.' })
    }
});

router.post("/Addtherapy", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    if (!legit) {
        var adddata = new virtual_therapys(req.body)
        adddata.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200, message: "Something went wrong.", error: err });
            } else {
                res.json({
                    status: 200,
                    message: "Added Successfully",
                    hassuccessed: true,
                });
            }
        });
    } else {
        res.json({
            status: 200,
            hassuccessed: false,
            message: "Authentication required.",
        });
    }
});

module.exports = router;