const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const cors = require('cors');
const multer = require('multer');
const expressFileUpload = require('express-fileupload');
const {fileIsValid} = require('util/FileUtils');
const jwt = require('jsonwebtoken');
const {verifyToken} = require('util/AuthToken');
const {tokenExpiry} = require('config');
const {validateField} = require('util/TextUtils');


// routes
router.post('/register', register);
router.get('/all', verifyToken, getAll);
router.get('/current', verifyToken, getCurrent);
router.get('/user_detail', verifyToken, getById);
router.put('/update', verifyToken, update);
router.delete('/delete', verifyToken, _delete);
router.get('/login', loginUser);

module.exports = router;


function register(req, res, next) {
    if (req.files)
        fileIsValid(req.files.profile_image);
    userService.create(req.body, req.files)
        .then(() => {
            res.status(200).json({"message": "account created"})
        })
        .catch(err => {
            next(err);
            //res.status(500).json({"message": err.message});
        });
}

function loginUser(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    let error = "";
    if (email === null || email === undefined)
        error = "email is required,";
    if (password === null || password === undefined)
        error += "password required";
    if (error !== "")
        throw error;
    const user = {
        email: req.body.email
    };
    jwt.sign(user,
        'secretKey',
        {expiresIn: tokenExpiry},
        (error, token) => {
            res.json({message: "Login Successfull", token: token})
        });
}


function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json({user_list: users}))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    console.log(req.body);
    userService.getById(req.body.uid)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


function update(req, res, next) {

    console.log(req.body);
    if (!validateField(req.body.uid))
        throw "Uid is required";
    if (req.files)
        fileIsValid(req.files.profile_image);
    userService.update(req.body, req.files)
        .then(() => res.json({"message": "account updated"}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.body.id)
        .then(() => res.json({"message": "User deleted"}))
        .catch(err => next(err));
}
