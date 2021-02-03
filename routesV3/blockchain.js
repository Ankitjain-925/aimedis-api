var express = require("express");
var router = express.Router();
const { promisify } = require("util");
const read = promisify(require("fs").readFile);
const axios = require("axios");
//for certificate
router.post("/dataManager", function(req, res, next) {
  //   var options = {
  let { path, data, method, headers } = req.body;
  let baseUrl = "http://h2873135.stratoserver.net:2999/api/";
  const options = { 
    method: method ? method : "POST",
    headers: headers ? headers : { "Content-Type": "application/json" },
    data: data ? JSON.stringify(data) : null,
    url: `${baseUrl}${path}`,
    maxContentLength: 100000000,
    maxBodyLength: 1000000000
  };
  axios(options)
    .then((rr) => {
      if(path ==='dataManager/update/patient'){
        console.log('rr',  rr)
      }
      res.send(rr.data);
    })
    .catch((e) => {
      if(path ==='dataManager/update/patient'){
        console.log('rrer',  e)
      }
      res.send(e);
    });
});

module.exports = router;
