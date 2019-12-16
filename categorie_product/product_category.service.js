const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('db_helper/db');
const Category = db.Category;

module.exports = {
    getAllCategories,
    updateCategories,
    addNewCategory,
};

async function getAllCategories() {
    return await Category.find().select('-hash');
}

async function updateCategories(id, parameter) {
    const category = await Category.findById(id);
    // validate
    if (id === undefined || id === "")
        throw 'Id required';
    if (!category) throw 'Category not found';
    // copy userParam properties to user
    Object.assign(category, parameter);
    await category.save();
}

async function addNewCategory(postParam) {
    const category = new Category(postParam);
    await category.save();
}




