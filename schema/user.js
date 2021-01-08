var mongoose = require('mongoose');
var Schema   = mongoose.Schema;


var UserSchema = new Schema({
    type:{
        type: String,
        required: true,
        unique: false
    },
    profile_id:{
      type: String,
      required: false,
      unique: true
    },
    alies_id:{
      type: String,
      required: false,
      unique: false
    },
    parent_id: {
       type: String,
       required: false,
       unique: false
    },
    first_name: {
       type: String,
       required: false,
       unique: false
    },
    last_name: {
       type: String,
       required: false,
       unique: false
    },
    nick_name: {
       type: String,
       required: false,
       unique: false
    },
    title: {
       type: String,
       required: false,
       unique: false
    },
    sex: {
       type: String,
       required: false,
       unique: false
    },
    birthday: {
       type: String,
       required: false,
       unique: false
    },
    language:{   type : Array    },
    street: {
       type: String,
       required: false,
       unique: false
    },
    city: {
       type: String,
       required: false,
       unique: false
    },
    area: { type : Object },
    address: {
       type: String,
       required: false,
       unique: false
    },
    speciality :{ type : Array },
    subspeciality : { type: Array },
    phone: {
       type: String,
       required: false,
       unique: false
       
    },
    mobile: {
       type: String,
       required: false,
       unique: false
    },
    fax: {
       type: String,
       required: false,
       unique: false
    },
    website: {
       type: String,
       required: false,
       unique: false
    },
    email: {
       type: String,
       required: true,
       unique: false
    },
    password: {
       type: String,
       required: true,
       unique: false
    },
    we_offer:{   type : Object   },
    image: {
       type: String,
       required: false,
       unique: false
    },
    insurance  : {type : Array},
    fav_doctor : {type : Array},
    family_doc : {type : Array},
    aimedis_doc: {type : Array},
    marital_status:{
       type: String,
       required: false,
       unique: false
    },
    emergency_contact_name:{
       type: String,
       required: false,
       unique: false
    },
    emergency_number:{
       type: String,
       required: false,
       unique: false
    },
    emergency_email:{
       type: String,
       required: false,
       unique: false
    },
    track_record:{
       type: Array,
       required: false,
       unique: false
    },
    membership:{
        type: Array,
        required: false,
        unique: false
    },
    Rigt_management:{
        type: Array,
        required: false,
        unique: false
    },
    pin:{
        type: Number,
        required: false,
        unique: false
    },
    private_appointments:{
        type: Array,
        required: false,
        unique: false
    },
    days_for_practices:{
        type: Array,
        required: false,
        unique: false
    },
    online_appointment:{
        type: Array,
        required: false,
        unique: false
    },
    weoffer_text:{
        type: String,
        required: false,
        unique: false
    },
    latest_info:{
        type: String,
        required: false,
        unique: false
    },
    usertoken:{
        type: String,
        required: false,
        unique: false
    },
    verified:{
        type: String,
        required: false,
        unique: false
    },
    organ_donor:{
        type: Array,
        required: false,
        unique: false
    },
    paid_services:{
        type: Array,
        required: false,
        unique: false
    },
    licence_detail:{
        type: String,
        required: false,
        unique: false
    },
    licence:{
        type: Array,
        required: false,
        unique: false
    },
    institute_id:{
        type: String,
        required: false,
        unique: false   
    },
    createdate : {
        type: String,
        required: false,
        unique: false  
    },
    isblock :{
        type : Boolean,
        required: false,
        unique: false
    },
    institute_name:{
        type: String,
        required: false,
        unique: false  
    },
    documents:{},
    authyId:{
      type: String,
      required: false,
      unique: false  
  },
   is2fa: {
   type: Boolean,
   required: false,
   unique: false
   },
   myPatient: {
   type: Array,
   required: false,
   unique: false
   }
},
{ strict: false },
{ timestamps : true }
);

UserSchema.index({ area : '2dsphere' });
var User = mongoose.model('User', UserSchema);
module.exports = User;
 