const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config')
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

//***************************************************************
const schema = new Schema({
    uid: {type: String, unique: true, required: true},
    username: {type: String, required: true, trim: true, maxlength : 15},
    password: {type: String, required: true, minlength : 8},
    email: {type: String, unique: true, required: true, validate(value) {
        if(!mailformat.test(value)) {
            throw new Error('Invalid Email')
        }
    } },
    phone_number: {type: Number, required: true, trim: true},
    created_date: {type: Date, default: Date.now},
    profile_image: {type: String, required: false}
});
//***************************************************************

//***************************************************************
schema.set('toJSON', {
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        delete ret._id;
        ret.profile_image = config.baseUrl + ret.profile_image;
    }
});
//***************************************************************

//***************************************************************
module.exports = mongoose.model('User', schema);
//***************************************************************
