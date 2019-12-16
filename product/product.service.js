const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const category = db.Category;
const product = db.Product;
const path = require('path');
module.exports = {
    getAllPost,
    getNewsById,
    createNewsPost,
    getProdyctById,
    getHomeProduct
};

async function getAllPost() {
    return await product.find().select('-hash');
}


async function getProdyctById(user_id) {
    return await product.find({user_id: user_id}).select('-hash');
}


async function getHomeProduct() {
    const categoriesList = await category.find();
    let response = [];
    console.log(categoriesList);

    for (const index in categoriesList) {
        const category = categoriesList[index];
        const productArray = [];
        const productList = await product.find({category_id: category._id}).select("-hash");
        category._id = undefined;
        category.id = undefined;
        delete category['id'];
        const categoryProducts = {category: category, productList: productList};
        response.push(categoryProducts);
    }
    return await response;
}


async function getNewsById(id) {
    return await product.findById(id).select('-hash');
}

async function createNewsPost(postParam, files) {
    if ((postParam.is_for_sell === null || postParam.is_for_sell === 0) &&
        (postParam.is_for_lend === null || postParam.is_for_lend === 0)) {
        throw "please select product is for lend or sell";
    }
    if (postParam.is_for_lend == 1
        && (postParam.item_rent_price === undefined || postParam.item_rent_price === 0)) {
        throw "please add rent price";
    }
    if (postParam.is_for_sell === 1
        && (postParam.item_selling_price === undefined || postParam.item_selling_price === 0)) {
        throw "please add selling price";
    }
    if (postParam.is_for_lend === true
        && (postParam.item_rent_price === undefined || postParam.item_rent_price === 0)) {
        throw "please add rent price";
    }
    let newProduct = new product(postParam);
    await newProduct.save();
    const urlArray = [];
    let itemImagesArray = files.item_images;
    if (files !== null && files !== undefined) {
        for (let i = 0; i < itemImagesArray.length; i++) {
            console.log("loop started" + newProduct._id);
            let item_image = itemImagesArray[i];
            const extension = path.extname(item_image.name);
            const fileName = "public/uploads/products/" + newProduct._id + "_" + i + extension;
            let url = "/uploads/products/" + newProduct._id + "_" + i + extension;
            urlArray.push(url);
            await item_image.mv(fileName);
        }
        postParam.item_images = urlArray;
        Object.assign(newProduct, postParam);
        await newProduct.save();
    }

}




