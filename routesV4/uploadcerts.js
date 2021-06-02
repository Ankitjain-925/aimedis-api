
require('dotenv').config();
var aws = require('aws-sdk');
var express = require('express');
var re = require('../regions.json')
let router = express.Router();
const axios = require("axios");
router.get('/sign_s3', (req, res) => {
if(req.query.bucket && req.query.bucket!=='undefined' && req.query.bucket !=='')
{
  var bucket = req.query.bucket;
}
else 
{
  var bucket = 'aimedisfirstbucket';
}
var data = re.regions && re.regions.length>0 && re.regions.filter((value, key) =>
value.bucket === bucket);
var params = {
  Bucket:bucket, // your bucket name,
  Key: req.query.find // path to the object you're looking for
}
aws.config.update({
  region: data[0].region,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: "v4",
})
var s3 = new aws.S3({apiVersion: '2006-03-01'});

s3.getSignedUrl('getObject', params, function(err, url){
  if (err){
    res.json({hassuccessed: false, error: err, msg: 'Something went wrong.' })
      //return err;
  }
  else 
  {
    res.json({hassuccessed:true, data: url , msg : 'successfully update'});
  }
 
});
})

router.post('/sign_s3', (req, res) => {

  if(req.body.bucket && req.body.bucket!=='undefined' && req.body.bucket !=='')
  {
    var bucket = req.body.bucket;
  }
  else 
  {
    var bucket = 'aimedisfirstbucket';
  }
  var data1 = re.regions && re.regions.length>0 && re.regions.filter((value, key) =>
  value.bucket === bucket);
  // Configure aws with your accessKeyId and your secretAccessKey
  aws.config.update({
    region: data1[0].region, // Put your aws region here
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
  })

  const S3_BUCKET = bucket
  var fileName = Date.now()+'-'+ req.body.fileName;
  if(req.body.folders)
  {
    var fileName = req.body.folders+Date.now()+'-'+ req.body.fileName;
  }
 
  const fileType = req.body.fileType === 'pdf'? 'application/pdf' :req.body.fileType;

// Set up the payload of what we are sending to the S3 api
const s3Params = {
    Bucket: S3_BUCKET,
    Key:  fileName +'.'+ fileType,
    Expires: 500,
    ContentType: fileType,
    ACL: 'authenticated-read'
  };

  s3 = new aws.S3({apiVersion: '2006-03-01'});

// Make a request to the S3 API to get a signed URL which we can use to upload our file
s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      res.json({success: false, error: err})
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}.${fileType}`
    };
    // Send it all back
    res.json({success:true, data:{returnData}});
  });
})

module.exports = router;