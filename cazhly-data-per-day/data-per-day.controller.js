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
        res.status(201).json({message:'Data added successfully!', data})
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.get('/get_data', verifyToken, async (req, res) => {

    const date = req.body.date
   const newData = await DataService.getData(date)

    try{

        if(newData === {} || !newData){
            return res.status(404).send({error: "No data found!"})
        }

        res.status(200).send(newData)
    }
    catch(e) {
        res.status(400).send(e.message)
    }
    
})

router.get('/get_between', verifyToken, async (req, res) => {
    const firstDate = req.body.firstDate
    const lastDate = req.body.lastDate

    const newData = await DataService.getBetweenData(firstDate, lastDate)

    try{

        if(newData === [] || !newData){
            return res.status(404).send({error: "No data found!"})
        }

        res.status(200).send(newData)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = router