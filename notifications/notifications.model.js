const mongoose = require('mongoose')
const Schema = mongoose.Schema


const notifications = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, required: true},
    isNotifyDaily: {type: Boolean, required: true}
})

notifications.methods.toJSON = function(){

    const data = this
    const dataObject = data.toObject()

    return dataObject
}

module.exports = mongoose.model('Notifications', notifications)