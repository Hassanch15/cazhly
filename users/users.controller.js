const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const cors = require('cors');
const multer = require('multer');
const expressFileUpload = require('express-fileupload');
const {fileIsValid} = require('util/FileUtils');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    }, filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png")
        cb(null, true);
    else
        cb(new Error("Image is not uploaded"), false);
};


// routes
router.post('/register', register);
router.get('/all', getAll);
router.get('/current', getCurrent);
router.get('/user_detail', getById);
router.put('/update', update);
router.delete('/delete', _delete);
module.exports = router;


/*function register(req, res, next) {
    const upload = multer({storage: storage, fileFilter: fileFilter}).single('profile_image');

    upload(req, res, function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        req.file.originalname = "usman";
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (!req.file) {
            return res.send('Please select an image to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        console.log(req.file);
        if (req.file === undefined) {
            throw "imag required";
        }
        userService.create(req.body, req.file === undefined ? "" : req.file.path)
            .then(() => {

                res.status(200).json({"message": "account created"})
            })
            .catch(err => {
                next(err);
                //res.status(500).json({"message": err.message});
            });
    });
}*/

function register(req, res, next) {
    fileIsValid(req, req.files.profile_image);
    userService.create(req.body, req.files)
        .then(() => {
            res.status(200).json({"message": "account created"})
        })
        .catch(err => {
            next(err);
            //res.status(500).json({"message": err.message});
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
    fileIsValid(req, req.files.profile_image)
    userService.update(req.body.id, req.body, req.files)
        .then(() => res.json({"message": "account updated"}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.body.id)
        .then(() => res.json({"message": "User deleted"}))
        .catch(err => next(err));
}
