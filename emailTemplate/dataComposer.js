const { getLanguage } = require("./translate/getLanguage");
const fs = require("fs");
const StringBuilder = require("string-builder");
const DATAFORMATE = {
  title: "",
  content: "",
  AimTeam: "",
  Loginvia: "",
  orvisit: "",
};
const getFormatedData = (lang) => {
  let _data = DATAFORMATE;
  _data.Loginvia = getLanguage(lang, "login_via");
  _data.AimTeam = getLanguage(lang, "your_aimedis_team");
  _data.orvisit = getLanguage(lang, "or_visit");
  return _data;
};
class insuranceEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_insurance");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    let content = `${getLanguage(lang, "you_got_new_one")} <br><br>
   ${getLanguage(lang, "please_click_password")} <a href=${
      data.link
    } style="color:#2980b9;text-decoration: underline;font-size:12px" >
   ${getLanguage(lang, "link_rest")}
   </a><br><br>
   ${getLanguage(lang, "is2fa_lost")}
   `;
    let _data = getFormatedData(lang);
    _data.title = `${getLanguage(lang, "dear")} <b>${data.to}</b>`;
    _data.content = content;
    return _data;
  }
}
class patientEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_patient");
    return _data;
  }
  static prescriptionSystem(lang, { patient_name = "", doctor_name = "" }) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_prescription_system");
    let message = getLanguage(lang, "prescrtion_message_pat");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      "",
      "",
      "",
      "",
      "",
      patient_name
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static emergencyAccess(
    lang,
    { patient_name = "", doctor_name = "", doc_profile_id = "", datetime = "" }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_emergency_access");
    let message = getLanguage(lang, "there_was_an_emergancy_access");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      "",
      doc_profile_id,
      datetime,
      "",
      "",
      patient_name
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static appointmentSystem(
    lang,
    {
      patient_name = "",
      doctor_name = "",
      date = "",
      time = "",
      doctor_phone = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_appointment_system");
    let message = getLanguage(lang, "apoointment_message_pat");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      "",
      "",
      time,
      doctor_phone,
      date,
      patient_name
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static sickCeritificateSystem(lang, { patient_name = "", doctor_name = "" }) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_sick_cert_system");
    let message = getLanguage(lang, "sick_cert_message_pat");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      "",
      "",
      "",
      "",
      "",
      patient_name
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static secondOpenionSystem(lang, { patient_name = "", doctor_name = "" }) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_second_opinion_system");
    let message = getLanguage(lang, "second_opinion_message");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      "",
      "",
      "",
      "",
      "",
      patient_name
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}
class doctorEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_doctor");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
  static appointmentSystem(
    lang,
    {
      doctor_name = "",
      calendar_name = "",
      patient_id = "",
      patient_name = "",
      date = "",
      time = "",
      patient_email = "",
      patient_phone = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_appointment_system");
    let message = getLanguage(lang, "apponitment_doctor");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      calendar_name,
      patient_id,
      patient_name,
      date,
      time,
      patient_email,
      patient_phone
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static prescriptionSystem(
    lang,
    {
      doctor_name = "",
      patient_id = "",
      patient_name = "",
      date = "",
      time = "",
      patient_email = "",
      patient_phone = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_prescription_system");
    let message = getLanguage(lang, "prescription_sys_doc");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      patient_id,
      patient_name,
      date,
      time,
      patient_email,
      patient_phone
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static sickCertificateSystem(
    lang,
    {
      doctor_name = "",
      patient_id = "",
      patient_name = "",
      date = "",
      time = "",
      patient_email = "",
      patient_phone = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_sick_cert_system");
    let message = getLanguage(lang, "sickc_system_doc");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      patient_id,
      patient_name,
      date,
      time,
      patient_email,
      patient_phone
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static secondOpenionSystem(
    lang,
    {
      doctor_name = "",
      patient_id = "",
      patient_name = "",
      date = "",
      time = "",
      patient_email = "",
      patient_phone = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_second_opinion_system");
    let message = getLanguage(lang, "second_openion_doc");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      patient_id,
      patient_name,
      date,
      time,
      patient_email,
      patient_phone
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static handledPrescriptionnSystem(
    lang,
    {
      doctor_name = "",
      patient_id = "",
      patient_name = "",
      date = "",
      time = "",
      pharmacy_id = "",
      pharmacy_name = "",
      pharmacy_email = "",
      pharmacy_phone = "",
      handled_date = "",
      handled_time = "",
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_prescription_system");
    let message = getLanguage(lang, "handled_prescription_doc");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      doctor_name,
      patient_id,
      patient_name,
      date,
      time,
      pharmacy_id,
      pharmacy_name,
      pharmacy_email,
      pharmacy_phone,
      handled_date,
      handled_time
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
}

class pharmacyEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_pharmacy");
    return _data;
  }

  static prescriptionSystem(
    lang,
    {
      pharmacy_name = "",
      doctor_name = "",
      doctor_id = "",
      date = "",
      time = "",
      patient_id = "",
      patient_name = "",
      doctor_email = "",
      docor_phone,
    }
  ) {
    let _data = getFormatedData(lang);
    _data.title = getLanguage(lang, "aimedis_prescription_system");
    let message = getLanguage(lang, "prescription_mssg_pharmacy");
    const messageBulider = new StringBuilder();
    messageBulider.appendFormat(
      message,
      patient_id,
      patient_name,
      doctor_name,
      doctor_id,
      time,
      date,
      pharmacy_name,
      doctor_email,
      docor_phone
    );
    _data.content = messageBulider.toString();
    messageBulider.clear();
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}
class therapistEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_therapist");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}
class emergencyEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_emergency");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}

class nursetEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_nurse");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}

class hospitalEmail {
  static welcomeEmail(lang) {
    let _data = getFormatedData(lang);
    _data.title = _data.title = getLanguage(lang, "welcome_title_aimedis");
    _data.content = getLanguage(lang, "welcome_message_hospital");
    return _data;
  }
  static resetPassword(lang, data = { to: "", link: "" }) {
    return insuranceEmail.resetPassword(lang, data);
  }
}
class generalEmail {
  static createTemplate(lang, { title = "", content = "" }) {
    let _data = getFormatedData(lang);
    _data.title = title;
    _data.content = content;
    return _data;
  }
}
const readHTMLFile = function(path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
    if (err) {
      throw err;
      callback(err);
    } else {
      callback(null, html);
    }
  });
};
const EMAIL = {
  therapistEmail,
  patientEmail,
  pharmacyEmail,
  doctorEmail,
  insuranceEmail,
  nursetEmail,
  hospitalEmail,
  emergencyEmail,
  generalEmail,
};
module.exports = {
  readHTMLFile,
  EMAIL,
};

//hospitaliztio,patient,insurance nurse therapistEmail prescriptiondone emergency done
