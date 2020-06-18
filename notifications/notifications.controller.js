const express = require('express')
const router = express.Router()

const NotificationModel = require('./notifications.model')
const e = require('express')

// ******************** Routes *****************
router.post('/add_notifications', async(req, res) => {

        const notifications = new NotificationModel({
            ...req.body
        })

        try{
            await notifications.save()
            res.status(201).send(notifications)
        }
        catch(e) {
            res.status(400).send(e)
        }
})

module.exports = router