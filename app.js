require("dotenv").config();
var express = require("express");
var path = require("path");
//var cookieParser = require('cookie-parser');
var logger = require("morgan");
var mongoose = require("mongoose");
var config = require("./config/database");
var user = require("./schema/user.js");
let router = express.Router();
var cors = require("cors");
var jwtconfig = require("./jwttoken");
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = require("./swagger.json");
const uuidv1 = require("uuid/v1");
var base64 = require("base-64");
var cron = require("node-cron");
const { MongoTools, MTOptions } = require("node-mongotools");
var mongoTools = new MongoTools();
const axios = require("axios");
var CryptoJS = require("crypto-js");

var moment = require("moment");
mongoose.connect(config.database, { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.set("debug", true);

var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
////middleware///////
// router.use(CheckRole)

////////////admin+main/////////////
const appAdmin = express();

appAdmin.use(express.static(path.join(__dirname, "./build/admin")));
app.use(express.static(path.join(__dirname, "./build/main")));

const server = require("http").createServer(app)
const io = require("socket.io")(server, {
  transports: ['polling'],
  cors: {
    origin: "*"
  }

})
////////////admin+main+end/////////////


io.on('connection', (socket) => {
  console.log('A user is connected');

  socket.on("update", (data) => {
    console.log("data", data)
    socket.broadcast.emit("data_shown", data)
  });
  socket.on("addpatient", (data) => {
    console.log("addpatient", data)
    socket.broadcast.emit("email_accept", data)
  });
  socket.on("decline", (data) => {
    console.log("decline", data)
    socket.broadcast.emit("email_decline", data)
  })

})

// cron.schedule("*/1 * * * *", () => {
//   mongoTools
//     .list({
//       uri: "mongodb://localhost/aimedis_enc_demo",
//       path: "BackupDB",
//       dropboxToken: process.env.DBT,
//     })
//     .then((success) => {
//       if (success.dropbox && success.dropbox.length > 0) {
//         console.log('success.dropbox',success.dropbox)
//         var removingData = success.dropbox.filter(
//           (data, index) => index < success.dropbox.length - 6
//         );
//         if (removingData && removingData.length > 0) {
//           removingData.forEach((item, index) => {
//             var data = JSON.stringify({
//               path: item,
//             });

//             var config = {
//               method: "post",
//               url: "https://api.dropboxapi.com/2/files/delete_v2",
//               headers: {
//                 Authorization:
//                   `Bearer ${process.env.DBT}`,
//                 "Content-Type": "application/json",
//               },
//               data: data,
//             };

//             axios(config)
//               .then(function (response) {
//                 console.log("done index", JSON.stringify(response.data));
//               })
//               .catch(function (error) {
//                 console.log(error);
//               });
//           });
//         }
//       }
//     })
//     .catch((err) => console.error("error", err));
// });
// cron.schedule('*/1 * * * *', () => {
// mongoTools
//     .mongorestore({
//       uri: config.database,
//       dumpFile: '/BackupDB/aimedis__2022-05-05_120000.gz',
//       dropBeforeRestore: true,
//       dropboxToken: process.env.DBT,
//     })
//     .then((success) => {
//       console.info("success", success);
//       // if (success) {
//       //   //  console.info("stderr:\n", success.stderr);// mongorestore binary write details on stderr
//       //   // res.json({
//       //   //   status: 200,
//       //   //   message: "Successfully restored",
//       //   //   data: success.stderr,
//       //   //   hassuccessed: true,
//       //   // });
//       //   console.log('success', success)
//       //        }
//     }).catch((e)=>{
//         console.log("e",e)
//     });
// })
// cron.schedule('*/1 * * * *', () => {
//  mongoTools.mongodump({ uri: config.database,
//  path: 'BackupDB',
//  dropboxToken: process.env.DBT,
// })
// .then((success) =>{ console.info("success", success)
// })
// .catch((err) => console.error("error", err) );
// //  mongoTools.list({ uri: config.database,
// //  path: 'BackupDB',
// //  dropboxToken: process.env.DBT, })
// // .then((success) => console.info("success", success) )
// // .catch((err) => console.error("error", err) );
// });

//app.use(express.static(path.join(__dirname, 'public')));

// var AuthCheck = function (req, res, next) {
//   if(req.headers.authorization){


//     if(req.headers.authorization==="Aimedis23")
//     {
//       console.log('Hew1')
//       next();
//     }
//     else{
//       console.log('Hew2')
//       return res.send({
//         status: 401,
//         hassuccessed: false,
//         msg: "Authentication required.",
//       })
//     }
//   }
// else{
//   console.log('Hew3')
//   return res.send({
//     status: 401,
//     hassuccessed: false,
//     msg: "Authentication required.",
//   })
// }
// }

// app.use(AuthCheck);

var UserData = require("./routes/UserTrack");
var UserProfile = require("./routes/userProfile");
var SaveCSV = require("./routes/saveCsv");
var emergency_record = require("./routes/emergencyrecord");
var rightinfo = require("./routes/rightsideinfo");
var stripeCheckout = require("./routes/stripeCheckout");
var lms_stripeCheckout = require("./routes/lms_stripeCheckout");
var lms = require("./routes/lms");
var certificate = require("./routes/certificate");
var adminse = require("./routes/superadmin");

var UserData2 = require("./routesV2/UserTrack");
var UserProfile2 = require("./routesV2/userProfile");
var SaveCSV2 = require("./routesV2/saveCsv");
var emergency_record2 = require("./routesV2/emergencyrecord");
var rightinfo2 = require("./routesV2/rightsideinfo");
var stripeCheckout2 = require("./routesV2/stripeCheckout");
var lms_stripeCheckout2 = require("./routesV2/lms_stripeCheckout");
var lms2 = require("./routesV2/lms");
var certificate2 = require("./routesV2/certificate");
var adminse2 = require("./routesV2/superadmin");
var Uploadcerts = require("./routesV2/uploadcerts");
var bloackchain = require("./routesV2/blockchain");
var cronPrecess = require("./routesV2/cron");

var UserData3 = require("./routesV4/UserTrack");
var UserProfile3 = require("./routesV4/userProfile");
var SaveCSV3 = require("./routesV4/saveCsv");
var emergency_record3 = require("./routesV4/emergencyrecord");
var rightinfo3 = require("./routesV4/rightsideinfo");
var stripeCheckout3 = require("./routesV4/stripeCheckout");
var lms_stripeCheckout3 = require("./routesV4/lms_stripeCheckout");
var lms3 = require("./routesV4/lms");
var certificate3 = require("./routesV4/certificate");
var adminse3 = require("./routesV4/superadmin");
var Uploadcerts3 = require("./routesV4/uploadcerts");
var bloackchain3 = require("./routesV4/blockchain");
var cronPrecess3 = require("./routesV4/cron");
// var bk = require("./routesV4/bk");

var UserData4 = require("./routesV4/UserTrack");
var UserProfile4 = require("./routesV4/userProfile");
var SaveCSV4 = require("./routesV4/saveCsv");
var emergency_record4 = require("./routesV4/emergencyrecord");
var rightinfo4 = require("./routesV4/rightsideinfo");
var stripeCheckout4 = require("./routesV4/stripeCheckout");
var lms_stripeCheckout4 = require("./routesV4/lms_stripeCheckout");
var lms4 = require("./routesV4/lms");
var certificate4 = require("./routesV4/certificate");
var adminse4 = require("./routesV4/superadmin");
var Uploadcerts4 = require("./routesV4/uploadcerts");
var bloackchain4 = require("./routesV4/blockchain");
var cronPrecess4 = require("./routesV4/cron");
var vspecialty4 = require("./routesV4/virtual_specialty");
var vstep4 = require("./routesV4/virtual_step");
var questionaire4 = require("./routesV4/questionaire");
var vcases4 = require("./routesV4/virtual_cases");
var hadmin4 = require("./routesV4/h_admin");
var comet4 = require("./routesV4/cometUserList");
var merketing = require("./routesV4/marketing");
var vactive= require("./routesV4/virtual_active")
var market = require("./routesV4/marketing")

var UserData5 = require("./routesV5/UserTrack");
var UserProfile5 = require("./routesV5/userProfile");
var SaveCSV5 = require("./routesV5/saveCsv");
var emergency_record5 = require("./routesV5/emergencyrecord");
var rightinfo5 = require("./routesV5/rightsideinfo");
var stripeCheckout5 = require("./routesV5/stripeCheckout");
var lms_stripeCheckout5 = require("./routesV5/lms_stripeCheckout");
var lms5 = require("./routesV5/lms");
var certificate5 = require("./routesV5/certificate");
var adminse5 = require("./routesV5/superadmin");
var Uploadcerts5 = require("./routesV5/uploadcerts");
var bloackchain5 = require("./routesV5/blockchain");
var cronPrecess5 = require("./routesV5/cron");
var vspecialty5 = require("./routesV5/virtual_specialty");
var vstep5 = require("./routesV5/virtual_step");
var questionaire5 = require("./routesV5/questionaire");
var vcases5 = require("./routesV5/virtual_cases");
var hadmin5= require("./routesV5/h_admin");
var comet5 = require("./routesV5/cometUserList");
var merketing5 = require("./routesV5/marketing");

app.use("/api/v1/User", UserData);
app.use("/api/v1/UserProfile", UserProfile);
app.use("/api/v1/SaveCSV", SaveCSV);
app.use("/api/v1/stripeCheckout", stripeCheckout);
app.use("/api/v1/lms_stripeCheckout", lms_stripeCheckout);
app.use("/api/v1/emergency_record", emergency_record);
app.use("/api/v1/rightinfo", rightinfo);
app.use("/api/v1/lms", lms);
app.use("/api/v1/certificate", certificate);
app.use("/api/v1/admin", adminse);

app.use("/api/v2/User", UserData2);
app.use("/api/v2/UserProfile", UserProfile2);
app.use("/api/v2/SaveCSV", SaveCSV2);
app.use("/api/v2/stripeCheckout", stripeCheckout2);
app.use("/api/v2/lms_stripeCheckout", lms_stripeCheckout2);
app.use("/api/v2/emergency_record", emergency_record2);
app.use("/api/v2/rightinfo", rightinfo2);
app.use("/api/v2/lms", lms2);
app.use("/api/v2/certificate", certificate2);
app.use("/api/v2/admin", adminse2);
app.use("/api/v2/aws", Uploadcerts);
app.use("/api/v2/blockchain", bloackchain);
app.use("/api/v2/cron", cronPrecess);

app.use("/api/v3/User", UserData3);
app.use("/api/v3/UserProfile", UserProfile3);
app.use("/api/v3/SaveCSV", SaveCSV3);
app.use("/api/v3/stripeCheckout", stripeCheckout3);
app.use("/api/v3/lms_stripeCheckout", lms_stripeCheckout3);
app.use("/api/v3/emergency_record", emergency_record3);
app.use("/api/v3/rightinfo", rightinfo3);
app.use("/api/v3/lms", lms3);
app.use("/api/v3/certificate", certificate3);
app.use("/api/v3/admin", adminse3);
app.use("/api/v3/aws", Uploadcerts3);
app.use("/api/v3/blockchain", bloackchain3);
app.use("/api/v3/cron", cronPrecess3);

app.use("/api/v4/User", UserData4);
app.use("/api/v4/UserProfile", UserProfile4);
app.use("/api/v4/SaveCSV", SaveCSV4);
app.use("/api/v4/stripeCheckout", stripeCheckout4);
app.use("/api/v4/lms_stripeCheckout", lms_stripeCheckout4);
app.use("/api/v4/emergency_record", emergency_record4);
app.use("/api/v4/rightinfo", rightinfo4);
app.use("/api/v4/lms", lms4);
app.use("/api/v4/certificate", certificate4);
app.use("/api/v4/admin", adminse4);
app.use("/api/v4/aws", Uploadcerts4);
app.use("/api/v4/blockchain", bloackchain4);
app.use("/api/v4/cron", cronPrecess4);
app.use("/api/v4/vh", vspecialty4);
app.use("/api/v4/step", vstep4);
app.use("/api/v4/questionaire", questionaire4);
app.use("/api/v4/cases", vcases4);
app.use("/api/v4/hospitaladmin", hadmin4);
app.use("/api/v4/cometUserList", comet4);
app.use("/api/v4/marketing", merketing);
app.use("/api/v4/vactive",vactive)

app.use("/api/v5/User", UserData5);
app.use("/api/v5/UserProfile", UserProfile5);
app.use("/api/v5/SaveCSV", SaveCSV5);
app.use("/api/v5/stripeCheckout", stripeCheckout5);
app.use("/api/v5/lms_stripeCheckout", lms_stripeCheckout5);
app.use("/api/v5/emergency_record", emergency_record5);
app.use("/api/v5/rightinfo", rightinfo5);
app.use("/api/v5/lms", lms5);
app.use("/api/v5/certificate", certificate5);
app.use("/api/v5/admin", adminse5);
app.use("/api/v5/aws", Uploadcerts5);
app.use("/api/v5/blockchain", bloackchain5);
app.use("/api/v5/cron", cronPrecess5);
app.use("/api/v5/vh", vspecialty5);
app.use("/api/v5/step", vstep5);
app.use("/api/v5/questionaire", questionaire5);
app.use("/api/v5/cases", vcases5);
app.use("/api/v5/hospitaladmin", hadmin5);
app.use("/api/v5/cometUserList", comet5);
app.use("/api/v5/marketing", merketing5);
// app.use("/api/v4/bk", bk)

// app.use("/api/v4/vh",CheckRole,vspecialty4);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

////////////admin+main/////////////
appAdmin.use((err, req, res, next) => {
  console.log("er1r", err);
  // return res.sendFile(path.resolve( __dirname, 'build/admin' , 'index.html'));
});
appAdmin.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use("/admin", appAdmin);
////////////admin+main+end/////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  //  return res.sendfile(path.resolve(__dirname,'build/main', 'index.html'));
  console.log("err", err);
  return err;
});

server.listen(5000, () => {
  console.log("Server started on port 5000");
});

// module.exports = app;
