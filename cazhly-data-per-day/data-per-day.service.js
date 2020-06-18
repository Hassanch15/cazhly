const DataPerDayModel = require('./data-per-day.model')

const getData = async (date) => {
    const givenDate = new Date(date)
    const data = await DataPerDayModel.find({ date: givenDate })

    let totalHours = 0
    let totalCashAmount = 0
    let totalCreditCardAmount = 0
    let totalCash = 0

    data.forEach(data => {
        totalHours = data.hoursWorked + totalHours
        totalCashAmount = data.cashAmount + totalCashAmount
        totalCreditCardAmount = data.creditCardAmount + totalCreditCardAmount
    })

    totalCash = totalCashAmount + totalCreditCardAmount

    const newData = {
        givenDate,
        "hours": totalHours,
        "cashAmount": totalCashAmount,
        "creditCardAmount": totalCreditCardAmount,
        "totalCash": totalCash
    }

    return newData
}

module.exports = {
    getData
}