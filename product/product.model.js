const mongoose = require('mongoose');
const {baseUrl} = require('config');
const Schema = mongoose.Schema;

//**************************************************
const schema = new Schema({
//**************************************************
    item_name: {type: String, required: true},
    item_selling_price: {type: Number, default: 0},
    user_id: {type: String, required: true},
    item_rent_price: {type: Number, default: 0},
    item_detail: {type: String, required: true},
    item_images: [{type: String, required: true}],
    is_for_lend: {type: Number, default: 0},
    is_for_sell: {type: Number, default: 0},
    category_id: {type: String, required: true},
    product_rating: {type: Number},
    createdDate: {type: Date, default: Date.now}
});

//**************************************************
schema.set('toJSON', {
//**************************************************
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        delete ret.id;
        const urlArray = ret.item_images;
        for (let i = 0; i < urlArray.length; i++) {
            urlArray[i] = {
                url: baseUrl + urlArray[i],
                id: urlArray[i]
            };
        }
        ret.item_images = urlArray;
    }
});


module.exports = mongoose.model('Product', schema);
