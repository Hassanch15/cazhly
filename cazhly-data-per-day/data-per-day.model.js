const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const data = new Schema({
    date: {type: Date, required: true},
    cashAmount: {type: Number, required: true},
    creditCardAmount: {type: Number, required: true},
    hoursWorked: {type: Number, required: true}
    // owner : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     required : true,
    //     ref : 'User'
    // }

}, {timestamps:true})

data.methods.toJSON = function(){

    const data = this
    const dataObject = data.toObject()

    return dataObject
}

module.exports = mongoose.model('DataPerDay', data)