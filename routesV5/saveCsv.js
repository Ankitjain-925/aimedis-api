var express = require("express");
let router = express.Router();
var metadata = require("../schema/metadata");

const csv = require("csv-parser");
const fs = require("fs");

router.get("/", function (req, res, next) {
  fs.createReadStream("try.csv")
    .pipe(csv())
    .on("data", (row) => {
      metadata.updateOne(
        { _id: "5cf74de2e735721e90701ab5" },
        { $push: { ICD_code: row } },
        { safe: true, upsert: true },
        function (err, doc) {
          if (err && !doc) {
            res.json({
              status: 200,
              hassuccessed: false,
              msg: "Something went wrong",
              error: err,
            });
          } else {
            console.log("pending");
          }
        }
      );
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
    });
});

module.exports = router;
