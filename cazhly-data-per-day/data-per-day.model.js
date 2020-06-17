const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const data = new Schema({
    date: {type: Date, required},
    cashAmount: {type: Number, required},
    creditCardAmount: {type: Number, required},
    hoursWorked: {type: Number, required},
    payPerHour: {type: Number, required}

})

module.exports = mongoose.model('DataPerDay', data)