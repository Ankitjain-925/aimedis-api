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