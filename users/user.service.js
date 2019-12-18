const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const User = db.User;
const {mongoose, ObjectId} = require('mongoose');
const path = require('path');
const fs = require('fs');
const {deleteFileIfExist} = require('util/FileUtils');
module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await User.find().select('-id');
}

async function getById(uid) {
    const userDetail = await User.findOne({uid: uid}).select('-id');
    if (!userDetail)
        throw "user not found";
    return userDetail;
}

async function create(userParam, file) {
    // validate
    let profile_image;
    let fileName;
    if (file && file !== null && file !== undefined) {

        profile_image = file.profile_image;
        const extension = path.extname(profile_image.name);
        fileName = "public/uploads/users/" + userParam.uid + extension;
        url = "/uploads/users/" + userParam.uid + extension;
        userParam.profile_image = url;
    }
    if (await User.findOne({email: userParam.email})) {
        console.log("email taken");
        throw 'Email "' + userParam.email + '" is already taken';
    }
    const user = new User(userParam);
    console.log(fileName);
    console.log(profile_image);
    await user.save();
    if (file !== null && file !== undefined)
        await profile_image.mv(fileName);
}


async function update(userParam, file) {

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

async function _delete(id) {
    // console.log(await User.findById(id));
    if (id === undefined || id === "")
        throw 'Id required';
    const user = await User.findById(id);
    if (!user) {
        throw 'User  not exist';
    }
    await User.findByIdAndRemove(id);
}
