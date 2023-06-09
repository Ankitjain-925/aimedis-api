require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
  require("mongoose-field-encryption").fieldEncryption;

var MarketingSchema = new Schema(
  {
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
    email: {
      type: String,
      required: true,
      unique: false,
    },
  },
  { strict: false }
);

MarketingSchema.index({ area: "2dsphere" });

MarketingSchema.plugin(mongooseFieldEncryption, {
  fields: ["first_name", "last_name", "email"],
  secret: process.env.SOME_32BYTE_BASE64_STRING,
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});
var Marketing = mongoose.model("marketing_user", MarketingSchema);
module.exports = Marketing;
