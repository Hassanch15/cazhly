const mongoose = require('mongoose');
const config = require('config.json');
const Schema = mongoose.Schema;

const schema = new Schema({
    started_date: {type: Number, required: true},
    uid: {type: String, required: true},
    ended_date: {type: Number, required: true},
    product_id: {type: Schema.Types.ObjectId, ref: 'Product', required: true}
});
schema.set('toJSON', {
    versionKey: false,// You should be aware of the outcome after set to false,
    transform: function (doc, ret) {
        ret.borrrow_id = ret._id;
        delete ret._id;
    }
});
module.exports = mongoose.model('BorrowSell', schema);
