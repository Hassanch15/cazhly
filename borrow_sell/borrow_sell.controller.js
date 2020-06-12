const express = require('express');
const router = express.Router();
const bull_sell_service = require('./borrow_sell.service');
const cors = require('cors');
const {fileIsValid} = require('util/FileUtils');
const {verifyToken} = require('util/AuthToken');
const {validateField} = require('util/TextUtils');


// routes
// router.post('/uploadImage', uploadImage);
router.post('/borrow', verifyToken, borrow);
router.get('/all', verifyToken, getAll);
router.get('/getByUid', verifyToken, getByUid);

module.exports = router;


function borrow(req, res, next) {
    bull_sell_service.borrowProduct(req.body)
        .then(() => res.json({"message": "item borrowed"}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    bull_sell_service.getAllBorrwedItems()
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

function getByUid(req, res, next) {
    if (!validateField(req.body.uid)) {
        throw "uid is required";
    }
    bull_sell_service.getBorrowedItemsByUid(req.body)
        .then(posts => res.json(posts))
        .catch(err => next(err));
}



