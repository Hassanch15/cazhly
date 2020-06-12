const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const {fileIsValid} = require('util/FileUtils');
const {verifyToken} = require('util/AuthToken');
const {validateField} = require('util/TextUtils');

// routes
//***************************************************************
router.post('/register', register);
router.get('/all', verifyToken, getAll);
router.get('/user_detail', verifyToken, getById);
router.put('/update', verifyToken, update);
router.delete('/delete', verifyToken, _delete);
router.post('/login', loginUser);
//***************************************************************


//***************************************************************
module.exports = router;
//***************************************************************


//***************************************************************
function register(req, res, next)
//***************************************************************
{
    if (req.files) {
        if (req.files.profile_image.mimetype != "image/jpeg"
            && req.files.profile_image.mimetype != "image/png"
            && req.files.profile_image.mimetype != "image/jpg") {
            throw "Only PNG/JPEG is supported " + req.files.profile_image.mimetype + " jphg implemented";
        }
    } else
        throw "image is required";


    userService.create(req.body, req.files)
        .then(() => {
            res.status(200).json({"message": "account created"})
        })
        .catch( err => {
            if (validateField(req.body.uid)) {
                console.log("uid " + req.body.uid);
                console.log("uid enter");
                res.status(400).json({"error": err.message})
            }
            next(err);
            res.status(500).json({"message": err.message});
        });
}

//***************************************************************
function loginUser(req, res, next)
//***************************************************************
{
    const email = req.body.email;
    const password = req.body.password;
    let error = "";
    if (email === null || email === undefined)
        error = "email is required,";
    if (password === null || password === undefined)
        error += "password required";
    if (error !== "")
        throw error;
    userService.login(req.body)
        .then((userResponse) => {
            res.status(400).json(userResponse)
        })
        .catch(err => {
            next(err);
            //res.status(500).json({"message": err.message});
        });

}


//***************************************************************
function getAll(req, res, next)
//***************************************************************
{
    userService.getAll()
        .then(users => res.json({user_list: users}))
        .catch(err => next(err));
}


//***************************************************************
function getById(req, res, next)
//***************************************************************
{
    console.log(req.body);
    if (!validateField(req.body.uid))
        throw "uid is required";
    userService.getById(req.body.uid)
        .then(user => user ? res.json({
            message: "user detail",
            user_detail: user
        }) : res.sendStatus(404))
        .catch(err => next(err));
}


//***************************************************************
function update(req, res, next)
//***************************************************************
{
    console.log(req.body);
    if (!validateField(req.body.uid))
        throw "Uid is required";
    if (req.files)
        fileIsValid(req.files.profile_image);
    userService.update(req.body, req.files)
        .then(() => res.json({"message": "account updated"}))
        .catch(err => next(err));
}

//***************************************************************
function _delete(req, res, next)
//***************************************************************
{
    userService.delete(req.body.id)
        .then(() => res.json({"message": "User deleted"}))
        .catch(err => next(err));
}
