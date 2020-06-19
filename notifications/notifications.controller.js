const express = require('express')
const router = express.Router()
const { verifyToken } = require('util/AuthToken')

const NotificationModel = require('./notifications.model')
const e = require('express')

// ******************** Routes *****************
router.post('/add_notifications/:uid',verifyToken, async(req, res) => {

        const notifications = new NotificationModel({
            ...req.body,
            uid: req.params.uid

        })

        try{
            await notifications.save()
            res.status(201).send(notifications)
        }
        catch(e) {
            res.status(400).send(e)
        }
})

router.get('/get_notifications', verifyToken, async (req,res) => {
    const userId = req.body.uid
    const notifications = await NotificationModel.findOne({uid: userId})

    try{
        if(!notifications){
            return res.status(404).send({error: "No notification found!"})
        }
        res.status(202).send(notifications)
    }
    catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router