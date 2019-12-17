const express = require('express');
const router = express.Router();
const productService = require('./product.service');
const cors = require('cors');
const multer = require('multer');
const {multiplefileIsValid} = require('util/FileUtils');
const {verifyToken} = require('util/AuthToken');


//**************************************************
// routes
router.post('/create', verifyToken, create);
router.get('/getPostedProduct', verifyToken, getPostedProductById);
router.get('/getProductDetail/:id', verifyToken, getById);
router.get('/getHomeProduct', verifyToken, getHomeProducts);
//**************************************************


//**************************************************
module.exports = router;
//**************************************************


//**************************************************
function create(req, res, next)
//**************************************************
{
    if (!req.files)
        throw "product contains atleast one image";
    multiplefileIsValid(req, req.files.item_images);
    productService.createNewsPost(req.body, req.files)
        .then(() => res.json({"message": "Product added"}))
        .catch(err => next(err));
}


//**************************************************
function getAll(req, res, next)
//**************************************************
{
    productService.getAllPost()
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

//**************************************************
function getHomeProducts(req, res, next)
//**************************************************
{
    productService.getHomeProduct()
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

//**************************************************
function getPostedProductById(req, res, next)
//**************************************************
{
    productService.getProdyctById(req.body.user_id)
        .then(posts => res.json(posts))
        .catch(err => next(err));
}

//**************************************************
function getById(req, res, next)
//**************************************************
{
    productService.getNewsById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

