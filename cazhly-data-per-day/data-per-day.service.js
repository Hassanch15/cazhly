const DataPerDayModel = require('./data-per-day.model')

//***************** Services ******************

//fetch all the data from db
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
        "date": givenDate.toString(),
        "hours": totalHours,
        "cashAmount": totalCashAmount,
        "creditCardAmount": totalCreditCardAmount,
        "totalCash": totalCash
    }

    return newData
}

//fetch all the data between given dates from db
const getBetweenData = async (firstDate, lastDate) => {

   const date1 = new Date(firstDate)
   const date2 = new Date(lastDate) 
   const dataArray = []
   const dataDb = await DataPerDayModel.find()


   dataDb.forEach(data => {
       if( date1 < data.date && date2 > data.date){
           dataArray.push(data)
       }

   })

   return dataArray



}

module.exports = {
    getData,
    getBetweenData
}