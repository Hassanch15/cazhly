const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//**************************************************
const schema = new Schema({
//**************************************************
    item_name: {type: String, required: true},
    item_selling_price: {type: Number},
    user_id: {type: String, required: true},
    item_rent_price: {type: String},
    item_detail: {type: String, required: true},
    item_images: [{type: String, required: true}],
    is_for_lend: {type: Boolean},
    is_for_sell: {type: Boolean},
    category_id: {type: String, required: true},
    product_rating: {type: Number},
    createdDate: {type: Date, default: Date.now}
});

//**************************************************
schema.set('toJSON', {
//**************************************************

    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        delete ret.id
    }
});


module.exports = mongoose.model('Product', schema);
