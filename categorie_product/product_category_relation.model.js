const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product_category_relation = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    product_list: [{type: Schema.Types.ObjectId, ref: 'Person'}]
}, {
    versionKey: false // You should be aware of the outcome after set to false
});
Product_category_relation.set('toJSON', {virtuals: true});
module.exports = mongoose.model('ProductCategoryRelation', Product_category_relation);
