const { insuranceLang } = require("./insurance");
const { doctorLang } = require("./doctor");
const { emergencyLang } = require("./emergency");
const { hospitalLang } = require("./hospital");
const { nurseLang } = require("./nurse");
const { patientLang } = require("./patient");
const { pharmacyLang } = require("./pharmacy");
const { therapistLang } = require("./therapist");
const { common } = require("./common");
const langFile = {
  ...insuranceLang,
  ...doctorLang,
  ...emergencyLang,
  ...hospitalLang,
  ...nurseLang,
  ...patientLang,
  ...pharmacyLang,
  ...therapistLang,
  ...common,
};
module.exports.getLanguage = (lang = "", key) => {
  if (langFile[key]) {
    if (langFile[key][lang]) {
      return langFile[key][lang];
    } else if (langFile[key].en) {
      return langFile[key].en;
    } else {
      return "";
    }
  } else {
    return "";
  }
};
