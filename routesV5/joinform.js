require("dotenv").config();
var express = require("express");
let router = express.Router();
var join_forms = require("../schema/joinform.js");
var jwtconfig = require("../jwttoken");

router.post("/Addjoinform", function (req, res, next) {
    const token = req.headers.token;
    let legit = jwtconfig.verify(token);
    try{
    if (!legit) {
        var adddata = new join_forms(req.body)
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

router.delete('/deleteJoinForm/:FormId', function (req, res, next) {
    join_forms.findOneAndRemove({ _id: req.params.FormId }, function (err, data12) {
        if (err) {
            res.json({ status: 200, hassuccessed: false, msg: 'Something went wrong.', error: err });
        } else {
            res.json({ status: 200, hassuccessed: true, msg: 'JoinForm is Deleted' });
        }
    })
})

module.exports = router;