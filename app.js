require('dotenv').config();
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/database');
var user = require('./schema/user.js');
let router = express.Router();
var cors = require('cors')
var jwtconfig = require('./jwttoken');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
const uuidv1 = require('uuid/v1');
var base64 = require('base-64');
var cron = require('node-cron');
const { MongoTools, MTOptions } = require("node-mongotools")
var mongoTools = new MongoTools();
const axios = require("axios");

var moment = require('moment');
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.set('debug', true);

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


////////////admin+main/////////////
const appAdmin = express();

appAdmin.use(express.static(path.join(__dirname, './build/admin')));
app.use(express.static(path.join(__dirname, './build/main')));
////////////admin+main+end/////////////


// cron.schedule('*/1 * * * *', () => {
//   mongoTools.rotation({
//     uri: config.database, 
//     dropboxToken: process.env.DBT,
//     path: "BackupDB", 
//     rotationDryMode: true,
//     rotationWindowsDays: 3 }
//  )
//   .then((success) => {
//     if(success && success.filesystem && success.filesystem.cleanedFiles && success.filesystem.cleanedFiles.length){
//       var new_arr = success.filesystem.cleanedFiles.slice(0, success.filesystem.cleanedFiles.length-7)
//       console.log('new_arr', new_arr)
//       new_arr.forEach(function(item,index){
//           console.log(item);
//           if (fs.existsSync(item)){
//               fs.unlinkSync(item, function(err) {
//                 if (err) {
//                   throw err
//                 } else {
//                   const options = {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" ,
//                     "Authorization" : "Bearer "+process.env.DBT
//                   },
//                     data: {"path": item},
//                     url: "https://api.dropboxapi.com/2/files/delete_v2",
//                   };
//                   axios(options)
//                     .then((rr) => {
//                       console.log('eeee', rr.data);
//                     })
//                     .catch((e) => {
//                       console.log('errrr', e);
//                     });
//                   console.log("Successfully deleted the file.")
//                 }
//               });
//           }else{
//               console.log('file not found');
//           }
//         })
//       // success.filesystem.cleanedFiles.forEach(element => {
//       //     fs.unlink(element, function(err) {
//       //       if (err) {
//       //         throw err
//       //       } else {
              
//       //         console.log("Successfully deleted the file.")
//       //       }
//       //     })
//       // });
//     }
//   })
//   .catch((err) => console.error("error", err) );
// });

// cron.schedule('*/1 * * * *', () => {
// //  mongoTools.mongodump({ uri: config.database,
// //  path: 'BackupDB',
// //  dropboxToken: process.env.DBT, 
// // })
// // .then((success) =>{ console.info("success", success) 
// // })
// // .catch((err) => console.error("error", err) );
//  mongoTools.list({ uri: config.database,
//  path: 'BackupDB',
//  dropboxToken: process.env.DBT, })
// .then((success) => console.info("success", success) )
// .catch((err) => console.error("error", err) );
// });


//app.use(express.static(path.join(__dirname, 'public')));

var UserData    = require('./routes/UserTrack');
var UserProfile = require('./routes/userProfile');
var SaveCSV     = require('./routes/saveCsv');
var emergency_record = require('./routes/emergencyrecord');
var rightinfo   = require('./routes/rightsideinfo');
var stripeCheckout = require('./routes/stripeCheckout')
var lms_stripeCheckout = require('./routes/lms_stripeCheckout')
var lms = require('./routes/lms')
var certificate = require('./routes/certificate')
var adminse = require('./routes/superadmin')

var UserData2    = require('./routesV2/UserTrack');
var UserProfile2 = require('./routesV2/userProfile');
var SaveCSV2    = require('./routesV2/saveCsv');
var emergency_record2 = require('./routesV2/emergencyrecord');
var rightinfo2   = require('./routesV2/rightsideinfo');
var stripeCheckout2 = require('./routesV2/stripeCheckout')
var lms_stripeCheckout2 = require('./routesV2/lms_stripeCheckout')
var lms2 = require('./routesV2/lms')
var certificate2 = require('./routesV2/certificate')
var adminse2 = require('./routesV2/superadmin')
var Uploadcerts = require('./routesV2/uploadcerts')
var bloackchain = require("./routesV2/blockchain");
var cronPrecess = require("./routesV2/cron")


var UserData3    = require('./routesV4/UserTrack');
var UserProfile3 = require('./routesV4/userProfile');
var SaveCSV3    = require('./routesV4/saveCsv');
var emergency_record3 = require('./routesV4/emergencyrecord');
var rightinfo3   = require('./routesV4/rightsideinfo');
var stripeCheckout3 = require('./routesV4/stripeCheckout')
var lms_stripeCheckout3 = require('./routesV4/lms_stripeCheckout')
var lms3 = require('./routesV4/lms')
var certificate3 = require('./routesV4/certificate')
var adminse3 = require('./routesV4/superadmin')
var Uploadcerts3 = require('./routesV4/uploadcerts')
var bloackchain3 = require("./routesV4/blockchain");
var cronPrecess3 = require("./routesV4/cron")

var UserData4    = require('./routesV4/UserTrack');
var UserProfile4 = require('./routesV4/userProfile');
var SaveCSV4    = require('./routesV4/saveCsv');
var emergency_record4 = require('./routesV4/emergencyrecord');
var rightinfo4   = require('./routesV4/rightsideinfo');
var stripeCheckout4 = require('./routesV4/stripeCheckout');
var lms_stripeCheckout4 = require('./routesV4/lms_stripeCheckout');
var lms4 = require('./routesV4/lms');
var certificate4 = require('./routesV4/certificate');
var adminse4 = require('./routesV4/superadmin');
var Uploadcerts4 = require('./routesV4/uploadcerts');
var bloackchain4 = require("./routesV4/blockchain");
var cronPrecess4 = require("./routesV4/cron");
var vspecialty4 = require("./routesV4/virtual_specialty");
var vstep4 = require("./routesV4/virtual_step");
var questionaire4 = require("./routesV4/questionaire");
var vcases4 = require("./routesV4/virtual_cases");
var hadmin4 = require("./routesV4/h_admin")
var comet4 = require("./routesV4/cometUserList");

app.use('/api/v1/User', UserData);
app.use('/api/v1/UserProfile', UserProfile);
app.use('/api/v1/SaveCSV', SaveCSV);
app.use('/api/v1/stripeCheckout', stripeCheckout);
app.use('/api/v1/lms_stripeCheckout', lms_stripeCheckout);
app.use('/api/v1/emergency_record', emergency_record);
app.use('/api/v1/rightinfo', rightinfo);
app.use('/api/v1/lms', lms);
app.use('/api/v1/certificate', certificate);
app.use('/api/v1/admin', adminse);

app.use('/api/v2/User', UserData2);
app.use('/api/v2/UserProfile', UserProfile2);
app.use('/api/v2/SaveCSV', SaveCSV2);
app.use('/api/v2/stripeCheckout', stripeCheckout2);
app.use('/api/v2/lms_stripeCheckout', lms_stripeCheckout2);
app.use('/api/v2/emergency_record', emergency_record2);
app.use('/api/v2/rightinfo', rightinfo2);
app.use('/api/v2/lms', lms2);
app.use('/api/v2/certificate', certificate2);
app.use('/api/v2/admin', adminse2);
app.use('/api/v2/aws', Uploadcerts);
app.use("/api/v2/blockchain", bloackchain);
app.use("/api/v2/cron", cronPrecess)


app.use('/api/v3/User', UserData3);
app.use('/api/v3/UserProfile', UserProfile3);
app.use('/api/v3/SaveCSV', SaveCSV3);
app.use('/api/v3/stripeCheckout', stripeCheckout3);
app.use('/api/v3/lms_stripeCheckout', lms_stripeCheckout3);
app.use('/api/v3/emergency_record', emergency_record3);
app.use('/api/v3/rightinfo', rightinfo3);
app.use('/api/v3/lms', lms3);
app.use('/api/v3/certificate', certificate3);
app.use('/api/v3/admin', adminse3);
app.use('/api/v3/aws', Uploadcerts3);
app.use("/api/v3/blockchain", bloackchain3);
app.use("/api/v3/cron", cronPrecess3)


app.use('/api/v4/User', UserData4);
app.use('/api/v4/UserProfile', UserProfile4);
app.use('/api/v4/SaveCSV', SaveCSV4);
app.use('/api/v4/stripeCheckout', stripeCheckout4);
app.use('/api/v4/lms_stripeCheckout', lms_stripeCheckout4);
app.use('/api/v4/emergency_record', emergency_record4);
app.use('/api/v4/rightinfo', rightinfo4);
app.use('/api/v4/lms', lms4);
app.use('/api/v4/certificate', certificate4);
app.use('/api/v4/admin', adminse4);
app.use('/api/v4/aws', Uploadcerts4);
app.use("/api/v4/blockchain", bloackchain4);
app.use("/api/v4/cron", cronPrecess4);
app.use("/api/v4/vh", vspecialty4);
app.use("/api/v4/step", vstep4);
app.use("/api/v4/questionaire", questionaire4);
app.use("/api/v4/cases", vcases4);
app.use("/api/v4/hospitaladmin", hadmin4);
app.use("/api/v4/cometUserList", comet4)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

////////////admin+main/////////////
appAdmin.use((err, req, res, next) => {
  console.log('er1r', err)
  // return res.sendFile(path.resolve( __dirname, 'build/admin' , 'index.html'));
});
appAdmin.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use('/admin', appAdmin);
////////////admin+main+end/////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handler
app.use(function(err, req, res, next) {
  //  return res.sendfile(path.resolve(__dirname,'build/main', 'index.html'));
  console.log('err', err)
  return err;
});

app.listen(5000, () => {
    console.log('Server started on port 5000');
});

// module.exports = app;