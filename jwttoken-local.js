const fs   = require('fs');
const jwt   = require('jsonwebtoken');
var config =require('./config/config')
// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = fs.readFileSync('./keys/privatekey.key', 'utf8');
var publicKEY  = fs.readFileSync('./keys/publickey.key', 'utf8');  


module.exports = {
 sign: (payload) => {
  /*
   sOptions = {
    issuer: "Authorizaxtion/Resource/This server",
    subject: "iam@user.me", 
    audience: "Client_Identity" // this should be provided by client
   }
  */
  // Token signing options
  var signOptions = {
      issuer:  config.issuer,
      subject:  config.subject,
      audience:  config.audience,
      expiresIn:  "30d",    // 30 days validity
      algorithm:  "RS256"    
  };
  return jwt.sign(payload, privateKEY, signOptions);
},
verify: (token) => {
  var verifyOptions = {
      issuer:  config.issuer,
      subject:  config.subject,
      audience:  config.audience,
      expiresIn:  "30d",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     return false;
   }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}