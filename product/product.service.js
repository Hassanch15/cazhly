const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const category = db.Category;
const product = db.Product;
const path = require('path');
const {validateField} = require('util/TextUtils');
module.exports = {
    getAllPost,
    getNewsById,
    createNewsPost,
    getProdyctById,
    getHomeProduct,
    updateProduct
};

async function getAllPost(req) {

    console.log(req);
    const resPerPage = parseInt(req.item_per_page); // results per page
    const page = parseInt(req.current_page) || 1; // Page
    const filter = {};
    if (validateField(req.maximum_sell_price)) {
        filter.item_selling_price = {$lte: parseInt(req.maximum_sell_price)}
    }
    if (validateField(req.maximum_rent_price)) {
        filter.item_rent_price = {$lte: parseInt(req.maximum_rent_price)}
    }

    return await product.find(filter)
        .skip((resPerPage * page) - resPerPage)
        .limit(resPerPage);
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
    if ((!validateField(postParam.is_for_sell) || postParam.is_for_sell == 0) &&
        (!validateField(postParam.is_for_lend) || postParam.is_for_lend == 0)) {
        throw "please select product is for lend or sell";
    }
    if (postParam.is_for_lend == 1
        && (postParam.item_rent_price === undefined || postParam.item_rent_price === 0)) {
        throw "please add rent price";
    }
    if (postParam.is_for_sell == 1
        && (postParam.item_selling_price === undefined || postParam.item_selling_price === 0)) {
        throw "please add selling price";
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
            const randomId = getRandomString();
            const fileName = "public/uploads/products/" + newProduct._id + "_" + randomId + extension;
            let url = "/uploads/products/" + newProduct._id + "_" + randomId + extension;
            urlArray.push(url);
            await item_image.mv(fileName);
        }
        postParam.item_images = urlArray;
        Object.assign(newProduct, postParam);
        await newProduct.save();
    }

}

function getRandomString() {
    const r = Math.random().toString(36).substring(7);
    return r;
}

async function updateProduct(postParam, files) {


    if (postParam.is_for_lend == 1
        && (postParam.item_rent_price === undefined || postParam.item_rent_price === 0)) {
        throw "please add rent price";
    }
    if (postParam.is_for_sell == 1
        && (postParam.item_selling_price === undefined || postParam.item_selling_price === 0)) {
        throw "please add selling price";
    }

    console.log(postParam.product_id);
    let newProduct = await product.findById(postParam.product_id);


    let totalDeletedImages = 0;
    let totalInsertedImages = validateField(files) ? files.item_images.length : 0;
    if (validateField(postParam.deleted_images)) {
        totalDeletedImages = postParam.deleted_images.split(",").length;
    }
    let imageSum;
    if (validateField(files)) {
        imageSum = newProduct.item_images.length - totalDeletedImages + totalInsertedImages;
        console.log("image sum" + imageSum);
        if (imageSum > 3) {
            throw "already 3 images are added,delete one first";
        }
    }

    if (validateField(postParam.deleted_images)) {
        const glob = require('glob');
        const fs = require('fs');
        const deletedImagesArray = postParam.deleted_images.split(",");
        console.log(deletedImagesArray);
        deletedImagesArray.forEach((file) => {
            try {
                fs.unlinkSync("public" + file);
            } catch (e) {
            }
        });
    }
    if (!newProduct)
        throw "Product not found";
    let urlArray = [];
    if (validateField(files)) {
        let itemImagesArray = files.item_images;
        for (let i = 0; i < itemImagesArray.length; i++) {
            console.log("loop started" + newProduct._id);
            let item_image = itemImagesArray[i];
            const extension = path.extname(item_image.name);
            const randomId = getRandomString();
            const fileName = "public/uploads/products/" + newProduct._id + "_" + randomId + extension;
            let url = "/uploads/products/" + newProduct._id + "_" + randomId + extension;
            urlArray.push(url);
            await item_image.mv(fileName);
        }

    }
    const previousUrl = newProduct.item_images;
    console.log("previous url" + previousUrl);
    previousUrl.forEach((url) => {
        const deletedImages = postParam.deleted_images;
        if (!validateField(deletedImages) || deletedImages.indexOf(url) === -1)
            urlArray.push(url);
    });
    postParam.item_images = urlArray;
    Object.assign(newProduct, postParam);
    await newProduct.save();
}


