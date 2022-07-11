require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
  require("mongoose-field-encryption").fieldEncryption;

const PaitentList = new mongoose.Schema(
  {
    profile_id: {
      type: String,
      required: false,
      unique: false,
    },
  },
  { strict: false }
);

PaitentList.plugin(mongooseFieldEncryption, {
  fields: ["profile_id"],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

const insuranceList = new mongoose.Schema(
  {
    insurance: {
      type: String,
      required: false,
      unique: false,
    },
    insurance_number: {
      type: String,
      required: false,
      unique: false,
    },
    insurance_type: {
      type: String,
      required: false,
      unique: false,
    },
    insurance_country: {
      type: String,
      required: false,
      unique: false,
    },
  },
  { strict: false }
);

insuranceList.plugin(mongooseFieldEncryption, {
  fields: [
    "insurance_country",
    "insurance_country",
    "insurance_number",
    "insurance",
  ],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

const FavDocList = new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: false,
      unique: false,
    },
    profile_id: {
      type: String,
      required: false,
      unique: false,
    },
    type: {
      type: String,
      required: false,
      unique: false,
    },
  },
  { strict: false }
);

FavDocList.plugin(mongooseFieldEncryption, {
  fields: ["profile_id", "doctor"],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

Rigt_managementList = new mongoose.Schema(
  {
    emergency_access: {
      type: String,
      required: false,
      unique: false,
    },
    opt: {
      type: String,
      required: false,
      unique: false,
    },
    opt_set: {
      type: String,
      required: false,
      unique: false,
    },
    opt_until: {
      type: String,
      required: false,
      unique: false,
    },
  },
  { strict: false }
);

Rigt_managementList.plugin(mongooseFieldEncryption, {
  fields: ["opt_set", "opt", "emergency_access"],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

var UserSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      unique: false,
    },
    profile_id: {
      type: String,
      required: false,
      unique: true,
    },
    alies_id: {
      type: String,
      required: false,
      unique: false,
    },
    parent_id: {
      type: String,
      required: false,
      unique: false,
    },
    first_name: {
      type: String,
      required: false,
      unique: false,
    },
    last_name: {
      type: String,
      required: false,
      unique: false,
    },
    nick_name: {
      type: String,
      required: false,
      unique: false,
    },
    title: {
      type: String,
      required: false,
      unique: false,
    },
    sex: {
      type: String,
      required: false,
      unique: false,
    },
    birthday: {
      type: String,
      required: false,
      unique: false,
    },
    language: { type: Array },
    street: {
      type: String,
      required: false,
      unique: false,
    },
    city: {
      type: String,
      required: false,
      unique: false,
    },
    area: { type: Object },
    address: {
      type: String,
      required: false,
      unique: false,
    },
    speciality: { type: Array },
    subspeciality: { type: Array },
    phone: {
      type: String,
      required: false,
      unique: false,
    },
    mobile: {
      type: String,
      required: false,
      unique: false,
    },
    fax: {
      type: String,
      required: false,
      unique: false,
    },
    website: {
      type: String,
      required: false,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      unique: false,
    },
    we_offer: { type: Object },
    marital_status: {
      type: Object,
      required: false,
      unique: false,
    },
    image: {
      type: String,
      required: false,
      unique: false,
    },
    insurance: [insuranceList],
    fav_doctor: [FavDocList],
    family_doc: { type: Array },
    aimedis_doc: { type: Array },
    roles: { type: Array },
    marital_status: {
      type: Object,
      required: false,
      unique: false,
    },
    emergency_contact_name: {
      type: String,
      required: false,
      unique: false,
    },
    emergency_number: {
      type: String,
      required: false,
      unique: false,
    },
    emergency_email: {
      type: String,
      required: false,
      unique: false,
    },
    track_record: {
      type: Array,
      required: false,
      unique: false,
    },
    membership: {
      type: Array,
      required: false,
      unique: false,
    },
    Rigt_management: [Rigt_managementList],
    logWrongPass: {
      type: Number,
      required: false,
      unique: false,
    },
    pin: {
      type: Number,
      required: false,
      unique: false,
    },
    private_appointments: {
      type: Array,
      required: false,
      unique: false,
    },
    days_for_practices: {
      type: Array,
      required: false,
      unique: false,
    },
    online_appointment: {
      type: Array,
      required: false,
      unique: false,
    },
    weoffer_text: {
      type: String,
      required: false,
      unique: false,
    },
    latest_info: {
      type: String,
      required: false,
      unique: false,
    },
    usertoken: {
      type: String,
      required: false,
      unique: false,
    },
    verified: {
      type: String,
      required: false,
      unique: false,
    },
    organ_donor: {
      type: Array,
      required: false,
      unique: false,
    },
    paid_services: {
      type: Array,
      required: false,
      unique: false,
    },
    licence_detail: {
      type: String,
      required: false,
      unique: false,
    },
    licence: {
      type: Array,
      required: false,
      unique: false,
    },
    institute_id: {
      type: Array,
      required: false,
      unique: false,
    },
    createdate: {
      type: String,
      required: false,
      unique: false,
    },
    isblock: {
      type: Boolean,
      required: false,
      unique: false,
    },
    institute_name: {
      type: String,
      required: false,
      unique: false,
    },
    documents: {},
    authyId: {
      type: String,
      required: false,
      unique: false,
    },
    is2fa: {
      type: Boolean,
      required: false,
      unique: false,
    },
    myPatient: [PaitentList],
    houses: {
      type: Array,
      required: false,
      unique: false,
    },
    assosiated_by: {
      type: Array,
      required: false,
      unique: false,
    },
    current_available: {
      type: Boolean,
      required: false,
      unique: false,
    },
    sickleave_appointment: {
      type: Array,
      required: false,
      unique: false,
    },
    newsletter_last_update_date: {
      type: String,
      required: false,
      unique: false,
    },
    aimedis_health_newletter: {
      type: Boolean,
      required: false,
      unique: false,
    },
  },
  { strict: false },
  { timestamps: true },
  { autoIndex: false }
);


UserSchema.plugin(mongooseFieldEncryption, {
  fields: [
    "institute_name",
    "email",
    "first_name",
    "last_name",
    "weoffer_text",
    "latest_info",
    "emergency_number",
    "emergency_email",
    "emergency_contact_name",
    "fax",
    "website",
    "phone",
    "city",
    "address",
    "sex",
    "birthday",
    "mobile",
    "profile_id",
    "alies_id",
    "latest_info",
    "createdate",
    "newsletter_last_update_date",
  ],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

UserSchema.index({ area: '2dsphere' });
var User = mongoose.model("User", UserSchema);
module.exports = User;
