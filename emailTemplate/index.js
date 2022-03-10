const handlebars = require("handlebars");
const fs = require("fs");
const { readHTMLFile, EMAIL } = require("./dataComposer");
const { getLanguage } = require("./translate/getLanguage");
handlebars.registerHelper("editmode", function(floorplan, options) {
  return floorplan ? options.fn(this) : options.inverse(this);
});
const generateTemplate = (data = {}, cb = () => null) => {
  const fileRead = fs.readFileSync(__dirname + "/index.html",
            {encoding:'utf8', flag:'r'});
  let template = null;
  template = require("handlebars").compile(fileRead);
  let htmlToSend = template(data);
    cb(null, htmlToSend);
};
const getSubject = (lang, key) => {
  return getLanguage(lang, key);
};
const SUBJECT_KEY = {
  welcome_title_aimedis: "welcome_title_aimedis",
  reset_password: "reset_password",
  aimedis_prescription_system: "aimedis_prescription_system",
  aimedis_emergency_access: "aimedis_emergency_access",
  aimedis_appointment_system: "aimedis_appointment_system",
  aimedis_sick_cert_system: "aimedis_sick_cert_system",
  aimedis_second_opinion_system: "aimedis_second_opinion_system",
};
module.exports = {
  generateTemplate,
  EMAIL,
  SUBJECT_KEY,
  getSubject,
};
