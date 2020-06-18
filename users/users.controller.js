const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const {fileIsValid} = require('util/FileUtils');
const {verifyToken} = require('util/AuthToken');
const {validateField} = require('util/TextUtils');
const UserModel = require('./user.model')

// routes
//***************************************************************
router.post('/register', register);
router.get('/all', verifyToken, getAll);
router.get('/data', verifyToken, getById);
router.put('/update', verifyToken, update);
router.delete('/delete', verifyToken, _delete);
router.post('/login', loginUser);
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
        .then((user) => {
            res.status(201).json({"message": "account created",user})
        })
        .catch( err => {
            if (validateField(req.body.uid)) {
                if(req.body.password.length < 8){
                    res.status(400).json({"error": "Required password minimum length is 8" } )
                    return 
                }
                
                res.status(400).json({"error": err})
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

            if(userResponse===false){
                return res.status(401).json({"Error": "Invalid Email or Password"})
            }
            res.status(200).json(userResponse)
        })
        .catch(err => {
            next(err);
            res.status(500).json({"message": err.message});
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

router.patch('/currency/:uid',verifyToken, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['symbol','code','country']
    const isAllowed = updates.every( update => allowedUpdates.includes(update))

    if(!isAllowed){
        return res.status(400).send({error: 'Invalid Update!'})
    }

    try{
        const newData = await UserModel.findOneAndUpdate({uid:req.params.uid}, req.body, {new: true, runValidators: true})
        if(!newData){
            return res.status(404).send({error: "Profile not found for update!!"})
        }

        await newData.save()
        res.send(newData)
    }
    catch(e) {
        res.status(400).send(e)
    }
})


//***************************************************************
module.exports = router;
//***************************************************************