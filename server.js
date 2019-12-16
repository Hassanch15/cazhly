require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('db_helper/jwt');
const errorHandler = require('db_helper/error-handler');
const fs = require('fs')
var path = require('path');
var upload = require('express-fileupload');

app.use(express.static('./public')); 		// set the static files location /public/img will be /img for users
//app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload());
app.use(bodyParser.urlencoded({extended: true}));
// use JWT auth to secure the api
//app.use(jwt());

// api routes
app.use('/user', require('./users/users.controller'));
app.use('/product', require('./product/product.controller'));
app.use('/category', require('./categories/product_category.controller'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
process.on('uncaughtException', function (err) {
    console.log(err);
})
app.use(errorHandler);
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
