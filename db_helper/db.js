const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
    useCreateIndex: true,
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Product: require('../product/product.model'),
    Category: require('../categories/product_category.model'),
    BorrowSell: require('../borrow_sell/borrow_sell_model')
};
