const config = require('config.json');
const jwt = require('jsonwebtoken');
const db = require('db_helper/db');
const User = db.User;
const {mongoose, ObjectId} = require('mongoose');
const path = require('path');
const fs = require('fs');
const {deleteFileIfExist} = require('util/FileUtils');
const {validateField} = require('util/TextUtils');
const {firebase, admin} = require('admin');
const {tokenExpiry} = require('config');
const {validate} = require('email-validator');
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
//***************************************************************
module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    login
};

//***************************************************************


//***************************************************************
async function getAll()
//***************************************************************
{
    return await User.find().select('-id');
}

//***************************************************************
async function getById(uid)
//***************************************************************
{
    const userDetail = await User.findOne({uid: uid}).select('-id');
    if (!userDetail)
        throw "user not found";
    return userDetail;
}


//***************************************************************
async function create(userParam, file)
//***************************************************************
{
    // validate
    let profile_image;
    let fileName;
    const id = randomString(15)

    if (!validateField(userParam.email)) {
        throw "email is required";
    }
    if (!validateField(userParam.password)) {
        throw "password is required";
    }
    if (!mailformat.test(userParam.email))
        throw "Invalid Email Format!";

    userParam.uid = id
    

    if (file && file !== null && file !== undefined) {
        profile_image = file.profile_image;
        const extension = path.extname(profile_image.name);
        fileName = "public/uploads/users/" + userParam.uid + extension;
        url = "/uploads/users/" + userParam.uid + extension;
        userParam.profile_image = url;
        console.log('test1')
    }
    if (await User.findOne({email: userParam.email})) {
        console.log("email taken");
        console.log('test2')
        throw 'Email "' + userParam.email + '" is already taken';
        
    }

    user = new User(userParam);
    console.log("user");
    await user.save();
    if (file !== null && file !== undefined)
        {await profile_image.mv(fileName);
            console.log('test3')}

            return user
}


//***************************************************************
async function login(userParam)
//***************************************************************
{
    const email = userParam.email;
    const password = userParam.password;
    const user = {
        email: email,
        password: password
    }

    const userDetail = await User.findOne({email: email, password:password});

    if(userDetail === null){
        return false
    }

    const token = jwt.sign(user,
        'secretKey',
        {expiresIn: tokenExpiry});

    return {message: "Login Successfull", token: token, user_detail: userDetail};

}

//***************************************************************
async function update(userParam, file)
//***************************************************************
{

    const user = await User.findOne({uid: userParam.uid});
    let profile_image;
    let fileName;
    deleteFileIfExist("uploads/users/" + userParam.uid);
    if (file !== null && file !== undefined) {
        profile_image = file.profile_image;
        const extension = path.extname(profile_image.name);
        fileName = "public/uploads/users/" + userParam.uid + extension;
        url = "/uploads/users/" + userParam.uid + extension;
        userParam.profile_image = url;
    }

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({username: userParam.username})) {
        throw 'Email "' + userParam.username + '" is already taken';
    }
    // copy userParam properties to user
    Object.assign(user, userParam);
    await user.save();
    if (file !== null && file !== undefined)
        await profile_image.mv(fileName);
}

//***************************************************************
async function _delete(id)
//***************************************************************
{
    // console.log(await User.findById(id));
    if (id === undefined || id === "")
        throw 'Id required';
    const user = await User.findById(id);
    if (!user) {
        throw 'User  not exist';
    }
    await User.findByIdAndRemove(id);
}

// Random String
function randomString(len) {
    charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
}