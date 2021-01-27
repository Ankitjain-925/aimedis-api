var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require("multer");
var mongoose = require('mongoose');
var config = require('../aimedis1/config/database');
var user = require('./schema/user.js');
let router = express.Router();
var cors = require('cors')
var jwtconfig = require('./jwttoken');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('../aimedis1/swagger.json');
const uuidv1 = require('uuid/v1');
var base64 = require('base-64');

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


var UserData3    = require('./routesV3/UserTrack');
var UserProfile3 = require('./routesV3/userProfile');
var SaveCSV3    = require('./routesV3/saveCsv');
var emergency_record3 = require('./routesV3/emergencyrecord');
var rightinfo3   = require('./routesV3/rightsideinfo');
var stripeCheckout3 = require('./routesV3/stripeCheckout')
var lms_stripeCheckout3 = require('./routesV3/lms_stripeCheckout')
var lms3 = require('./routesV3/lms')
var certificate3 = require('./routesV3/certificate')
var adminse3 = require('./routesV3/superadmin')
var Uploadcerts3 = require('./routesV3/uploadcerts')
var bloackchain3 = require("./routesV3/blockchain");


var UserData4    = require('./routesV4/UserTrack');
var UserProfile4 = require('./routesV4/userProfile');
var SaveCSV4    = require('./routesV4/saveCsv');
var emergency_record4 = require('./routesV4/emergencyrecord');
var rightinfo4   = require('./routesV4/rightsideinfo');
var stripeCheckout4 = require('./routesV4/stripeCheckout')
var lms_stripeCheckout4 = require('./routesV4/lms_stripeCheckout')
var lms4 = require('./routesV4/lms')
var certificate4 = require('./routesV4/certificate')
var adminse4 = require('./routesV4/superadmin')
var Uploadcerts4 = require('./routesV4/uploadcerts')
var bloackchain4 = require("./routesV4/blockchain");
var cronPrecess4 = require("./routesV4/cron")



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
app.use("/api/v4/cron", cronPrecess4)


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

////////////admin+main/////////////
appAdmin.use((req, res, next) => {
  return res.sendFile(path.resolve( __dirname, './build/admin' , 'index.html'));
});
appAdmin.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use('/admin', appAdmin);
////////////admin+main+end/////////////

//catch 404 and forward to error handler
app.use(function(req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});


  // error handler
app.use(function(err, req, res, next) {
    return res.sendfile(path.resolve(__dirname,'./build/main', 'index.html'));
});





// app.listen(5000, () => {
//     console.log('Server started on port 5000');
// });

 module.exports = app;