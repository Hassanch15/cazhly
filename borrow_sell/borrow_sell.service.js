const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const BorrowSell = db.BorrowSell;
const path = require('path');
const fs = require('fs');
const {deleteFileIfExist} = require('util/FileUtils');
module.exports = {
    getAllBorrwedItems: getAllBorrwedItems,
    borrowProduct: borrowProduct,
    getBorrowedItemsByUid: getBorrowedItemsByUid
};

async function getAllBorrwedItems() {
    return await BorrowSell.find().populate('product_id');
}

async function getBorrowedItemsByUid(postParam) {
    return await BorrowSell.find({uid: postParam.uid}).populate('product_id');
}

async function borrowProduct(postParam) {
    const borrowSell = new BorrowSell(postParam);
    await borrowSell.save();
}




