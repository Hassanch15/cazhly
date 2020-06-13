const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('config')

//***************************************************************
const schema = new Schema({
    uid: {type: String, unique: true, required: true},
    username: {type: String, required: true, trim: true, maxlength : 15},
    password: {type: String, required: true, minlength : 8},
    email: {type: String, unique: true, required: true},
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
