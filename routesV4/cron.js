var express = require('express');
var config = require('../config/database');
let router = express.Router();
const { MongoTools, MTOptions } = require("node-mongotools")
var mongoTools = new MongoTools();

router.post('/', (req, res) => {
    mongoTools.mongorestore({   
        uri: config.database,
        dumpFile: req.body.filepath,
        dropBeforeRestore: true
    })
    .then((success) => {
    console.info("success", success.message);
    if (success.stderr) {
    //  console.info("stderr:\n", success.stderr);// mongorestore binary write details on stderr
        res.json({ status: 200, message: 'Successfully restored', data :success.stderr, hassuccessed: true });
    }
    })
    .catch((err) =>   res.json({ status: 200, message: 'Something went wrong.', error: err }) )
})

module.exports = router;