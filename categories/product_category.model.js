const mongoose = require('mongoose');
const config = require('config.json');
const Schema = mongoose.Schema;
const schema = new Schema({
    category_name: {type: String, required: true},
    category_image: {type: String},
});
schema.set('toJSON', {
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        ret.category_id = ret._id;
        delete ret._id;
        ret.category_image = config.baseUrl + ret.category_image;
    }
});
module.exports = mongoose.model('ProductCategory', schema);
