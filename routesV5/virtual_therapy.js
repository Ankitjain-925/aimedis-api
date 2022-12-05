require("dotenv").config();
var express = require("express");
let router = express.Router();
var virtual_therapys = require("../schema/virtual_therapy.js");
var assigned_Service = require("../schema/assigned_service.js");
var virtual_Task = require("../schema/virtual_tasks.js");
var User = require("../schema/user");
var jwtconfig = require("../jwttoken");
var fullinfo = [], newDatafull = [];
var CheckRole = require("./../middleware/middleware")
const { encrypt, decrypt } = require("./Cryptofile.js");


router.get("/Gettherapy/:_id/", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.get("/GettherapyHouse/:house_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
        if (legit) {
            let house_id = req.params.house_id;
            const VirtualtToSearchWith = new virtual_therapys({ house_id });
            VirtualtToSearchWith.encryptFieldsSync();
            virtual_therapys.find(
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.get("/Gettherapy_search/:house_id/:data", function (req, res) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    var final
    try {
        if (legit) {
            let house_id = req.params.house_id;
            const VirtualtToSearchWith = new virtual_therapys({ house_id });
            VirtualtToSearchWith.encryptFieldsSync();
            virtual_therapys.find(
                {
                    $or: [
                        { house_id: req.params.house_id },
                        { house_id: { $exists: true, $eq: VirtualtToSearchWith.house_id } },
                    ],
                },
                function (err, data1) {
                    if (err) {
                        res.json({ status: 200, hassuccessed: true, error: err });
                    } else {
                        console.log(data1)
                        var final = data1.filter((element) => {
                            if (element.disease_name.includes(req.params.data) || element.therapy_name.includes(req.params.data)) {
                                return element
                            }
                        })
                        res.json({ status: 200, hassuccessed: true, data: final })
                    }
                }
            )
        } else {
            res.json({
                status: 200,
                hassuccessed: false,
                message: "Authentication required.",
            });
        }
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.put("/Updatetherapy/:_id", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

//remove track record
router.delete('/Deletetherapy/:_id', function (req, res, next) {
    const token = (req.headers.token)
    let legit = jwtconfig.verify(token)
    try {
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.post("/AddTherapy", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
        if (legit) {
            var adddata = new virtual_therapys(req.body)
            adddata.save(function (err, user_data) {
                if (err && !user_data) {
                    res.json({ status: 200, hassuccessed: false, message: "Something went wrong.", error: err });
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.post("/AssignTherapyToPatient", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
        if (legit) {
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
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

router.post("/SaveTherapy", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try {
        if (legit) {

            req.body.sequence_list.forEach(function (data1) {
                if (data1.type == "tasks") {

                    const userdata = {
                        ...data1,
                        house_id: req.body.house_id,
                        patient: req.body.patient,
                        therapy_id: req.body.therapy_id,
                        therapy_name: req.body.therapy_name,
                        status: req.body.status,
                        due_on: req.body.due_on,
                        assigned_to: req.body.assigned_to,
                    }

                    var adddata = new virtual_Task(userdata)
                    adddata.save();
                }
                if (data1.type == "assigned_services") {
                    const userdata = {
                        ...data1,
                        house_id: req.body.house_id,
                        patient: req.body.patient,
                        therapy_id: req.body.therapy_id,
                        therapy_name: req.body.therapy_name,
                        status: req.body.status,
                        due_on: req.body.due_on,
                        assigned_to: req.body.assigned_to,
                    }
                    var adddata = new assigned_Service(userdata)
                    adddata.save();
                }
            })

            res.json({
                status: 200,
                message: "Added Successfully",
                hassuccessed: true,
            });

        } else {
            res.json({
                status: 200,
                hassuccessed: false,
                message: "Authentication required.",
            });
        }
    } catch (err) {
        res.json({
            status: 200,
            hassuccessed: false,
            msg: "Some thing went wrong.",
        });
    }
});

module.exports = router;