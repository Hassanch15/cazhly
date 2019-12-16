const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    phone_number: {type: String, required: true},
    created_date: {type: Date, default: Date.now},
    profile_image: {type: String, required: false}
});
schema.set('toJSON', {
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        delete ret._id;
        ret.profile_image = "localhost:3000" + ret.profile_image;
        //console.log("user" + ret.toString());
    }
});
module.exports = mongoose.model('User', schema);
