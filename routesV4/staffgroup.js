var express = require("express");
let router = express.Router();
const institute = require("../schema/institute.js")
var uuidv1 = require('uuid/v1');
var jwtconfig = require("../jwttoken");

router.post("/AddTeam/:house_id", function (req, res) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.findOne({
        'institute_groups.houses.teammember.team_name': req.body.team_name
      })
        .exec(function (err, data) {
          if (data) {
            res.json({
              status: 200,
              hassuccessed: false,
              message: "Group Already Exist",
            });
          } else {
            const userdata = {
              ward_id: req.body.ward_id,
              speciality_id: req.body.speciality_id,
              team_name: req.body.team_name,
              staff: req.body.staff,
              staff_id: uuidv1()
            }
            institute.updateOne(
              {
                'institute_groups.houses.house_id': req.params.house_id
              },
              {
                $push: {
                  'institute_groups.$.houses.$[e].teammember': userdata
                }
              },
              { "arrayFilters": [{ "e.house_id": req.params.house_id }] },
              function (err, data) {
                if (err && !data) {
                  res.json({
                    status: 200,
                    hassuccessed: false,
                    msg: "Something went wrong",
                    error: err,
                  });
                } else {
                  res.json({
                    status: 200,
                    hassuccessed: true,
                    msg: "Group add successfully",
                    data: data,
                  });
                }
              }
            );
          }
        })
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
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

router.put("/UpdateTeam/:house_id/:team_name", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.updateOne(
        {
          'institute_groups.houses.teammember.team_name': req.params.team_name
        },
        {
          $set: {
            'institute_groups.$.houses.$[e1].teammember.$[e2].ward_id': req.body.ward_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].speciality_id': req.body.speciality_id,
            'institute_groups.$.houses.$[e1].teammember.$[e2].staff': req.body.staff,
          }
        },
        { "arrayFilters": [{ "e1.house_id": req.params.house_id }, { "e2.team_name": req.params.team_name }] },
        function (err, data) {
          if (err && !data) {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "Group  Updated",
              data: data,
            });

          }
        }
      );
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
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

router.delete("/DeleteTeam/:house_id/:staff_id", function (req, res, next) {
  const token = req.headers.token;
  let legit = jwtconfig.verify(token);
  try {
    if (legit) {
      institute.updateOne(
        {
          'institute_groups.houses.teammember.staff_id': req.params.staff_id
        },
        {
          $pull: {
            "institute_groups.$[].houses.$[].teammember": { staff_id: req.params.staff_id }
          }
        },
        function (err, data) {
          if (err && !data) {
            console.log("err", err)
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          } else {
            res.json({
              status: 200,
              hassuccessed: true,
              msg: "Group  Delete Successfully",
              data: data,
            });

          }
        }
      );
    } else {
      res.json({
        status: 200,
        hassuccessed: false,
        msg: "Authentication required.",
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