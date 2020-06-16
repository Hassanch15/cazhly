const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config.json')

const userSchema = new Schema({
    uid: {type: String},
    username: {type: String},
    email: {type: String},
    profile_image: {type: String}
})

//***************************************************************
userSchema.set('toJSON', {
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        delete ret._id;
        ret.profile_image = config.baseUrl + ret.profile_image;
    }
})

//***************************************************************
userSchema.methods.toJSON = function(){

    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

module.exports = mongoose.model('OauthUser', userSchema)