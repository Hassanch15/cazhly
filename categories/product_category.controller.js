const express = require('express');
const router = express.Router();
const product_category_service = require('./product_category.service');
const cors = require('cors');
const multer = require('multer');
const {fileIsValid} = require('util/FileUtils');
const {verifyToken} = require('util/AuthToken');
const {validateField} = require('util/TextUtils');


// routes
// router.post('/uploadImage', uploadImage);
router.post('/add', verifyToken, addCategory);
router.put('/update', verifyToken, updateCategories);
router.get('/all', verifyToken, getAll);

module.exports = router;


function addCategory(req, res, next) {
    if (validateField(req.files)) {
        fileIsValid(req, req.files.category_image);
    } else
        throw "image is required";
    product_category_service.addNewCategory(req.body, req.files)
        .then(() => res.json({"message": "Category added"}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    product_category_service.getAllCategories()
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

function updateCategories(req, res, next) {
    fileIsValid(req, req.category_image);
    product_category_service.updateCategories(req.body, req.files)
        .then(() => res.json({message: "categories updated"}))
        .catch(err => next(err));
}

