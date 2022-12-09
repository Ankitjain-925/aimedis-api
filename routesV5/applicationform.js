require("dotenv").config();
var express = require("express");
let router = express.Router();
var application_forms = require("../schema/applicationform.js");
var jwtconfig = require("../jwttoken");

router.post("/Addapplicationform", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try{
    if (legit) {
        var adddata = new application_forms(req.body)
        adddata.save(function (err, user_data) {
            if (err && !user_data) {
                res.json({ status: 200,  hassuccessed: false, message: "Something went wrong.", error: err });
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

router.delete('/deleteApplicationForm/:FormId', function (req, res, next) {
    application_forms.findOneAndRemove({ _id: req.params.FormId }, function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'ApplicationForm is Deleted' });
        }
    })
})

module.exports = router;