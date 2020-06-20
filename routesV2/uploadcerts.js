
var aws = require('aws-sdk');
var express = require('express');
let router = express.Router();

router.get('/sign_s3', (req, res) => {

var params = {
  Bucket: 'aimedisfirstbucket', // your bucket name,
  Key: req.query.find // path to the object you're looking for
}

aws.config.update({
  region: 'ap-south-1',
  accessKeyId: 'AKIASQXDNWERH3C6MMP5',
  secretAccessKey: 'SUZCeBjOvBrltj/s5Whs1i1yuNyWxHLU31mdXkyC'
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
  // Configure aws with your accessKeyId and your secretAccessKey
  aws.config.update({
    region: 'ap-south-1', // Put your aws region here
    accessKeyId: 'AKIASQXDNWERH3C6MMP5',
    secretAccessKey: 'SUZCeBjOvBrltj/s5Whs1i1yuNyWxHLU31mdXkyC'
  })

  const S3_BUCKET = 'aimedisfirstbucket'
  var fileName = Date.now()+'-'+ req.body.fileName;
  if(req.body.folders)
  {
    var fileName = req.body.folders+Date.now()+'-'+ req.body.fileName;
  }
 
  const fileType = req.body.fileType;
  console.log('req.body', req.body)
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
      console.log(err);
      res.json({success: false, error: err})
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}.${fileType}`
    };
    // Send it all back
    console.log("Response FROM AWS S3", data );
    res.json({success:true, data:{returnData}});
  });
})
module.exports = router;
