const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const Category = db.Category;
const path = require('path');
const fs = require('fs');
const {deleteFileIfExist} = require('util/FileUtils');
module.exports = {
    getAllCategories,
    updateCategories,
    addNewCategory,
};

async function getAllCategories() {
    return await Category.find().select('-hash');
}

async function updateCategories(parameter, file) {
    category_id = parameter.category_id;
    if (category_id === undefined || category_id === "")
        throw 'category id required';
    const category = await Category.findById(category_id);
    // validate
    let fileName;
    let categories_image;
    if (file !== null && file !== undefined) {
        categories_image = file.category_image;
        const extension = path.extname(categories_image.name);
        fileName = "public/uploads/categories/" + category_id + extension;
        deleteFileIfExist("uploads/categories/" + category_id);
        url = "/uploads/categories/" + category_id + extension;
        parameter.category_image = url;
    }

    console.log("after if");
    if (!category) throw 'Category not found';
    // copy userParam properties to user
    Object.assign(category, parameter);
    if (file !== null && file !== undefined) {
        await categories_image.mv(fileName);
    }
    await category.save();
}

async function addNewCategory(postParam, files) {

    const category = new Category(postParam);
    await category.save();
    let category_image;
    let fileName;
    if (files !== null && files !== undefined) {
        category_image = files.category_image;
        const extension = path.extname(category_image.name);
        fileName = "public/uploads/categories/" + category._id + extension;
        let url = "/uploads/categories/" + category._id + extension;
        category.category_image = url;
        console.log("filename" + fileName);
        await category_image.mv(fileName);
        Object.assign(category, category);
        await category.save();
    }


}




