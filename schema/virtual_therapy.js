require("dotenv").config();
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const mongooseFieldEncryption =
    require("mongoose-field-encryption").fieldEncryption;

var TherapySchema = new Schema(
    {

        house_id: {
            type: String,
            required: false,
            unique: false,
        },
        sequence_list: {
            type: Array,
            required: false,
            unique: false,
        },
        therapy_name: {
            type: String,
            required: false,
            unique: false,
        },

        therapy_description: {
            type: String,
            required: false,
            unique: false,
        },

    },
    { strict: false }
);

TherapySchema.plugin(mongooseFieldEncryption, {

    fields: ["house_id", "therapy_name", "therapy_description"

    ],
    secret: process.env.SOME_32BYTE_BASE64_STRING,
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    },
});
var virtual_therapy = mongoose.model("virtual_therapy", TherapySchema);
module.exports = virtual_therapy;
