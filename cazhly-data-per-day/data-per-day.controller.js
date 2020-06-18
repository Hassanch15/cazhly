const express = require('express')
const router = new express.Router()
const { verifyToken } = require('util/AuthToken')

const DataPerDayModel = require('./data-per-day.model')
const DataService = require('./data-per-day.service')

// Route ********
router.post('/add_data', verifyToken,async (req, res) => {

    const data = new DataPerDayModel({
        ...req.body
    })

    try {
        await data.save()
        res.status(202).json({message:'Data added successfully!', data})
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/get_data', verifyToken, async (req, res) => {

    const date = req.body.date
   const newData = await DataService.getData(date)

    try{
        res.status(200).send(newData)
    }
    catch(e) {
        res.status(400).send(e.message)
    }
    
})

module.exports = router