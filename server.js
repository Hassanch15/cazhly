require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('db_helper/jwt');
const errorHandler = require('db_helper/error-handler');
const fs = require('fs');
const path = require('path');
const upload = require('express-fileupload');
const passport = require('passport')
const cookieSession = require('cookie-session')
const keys = require('./config.json');
const { RequesterBuilder } = require('grpc');
require('./users/oauth-user.model')
require('./users/user.service')

//use to render static content like (html/images/files etc) .these files should be in public folder

app.use(bodyParser.json())

//use cookie sessions
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY || keys.cookieKey],
    sameSite: 'none'
}))

app.use(passport.initialize())
app.use(passport.session())

//allow API access on Local Host
app.use(cors());

//use to render static content like (html/images/files etc) .these files should be in public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./public'))

//middle ware for file uploading (express-file-upload)
app.use(upload());

//middle use to parse url parameter into body parameter
app.use(bodyParser.urlencoded({ extended: true }));

// use JWT auth to secure the api
//app.use(jwt());

// api routes

//user related operations  routes
app.use('/user', require('./users/users.controller'));

//product related operations  routes
app.use('/product', require('./product/product.controller'));

//category related operations  routes
app.use('/category', require('./categories/product_category.controller'));

//borrow related operations  routes
app.use('/borrow_sell', require('./borrow_sell/borrow_sell.controller'));


//if no routes define return render html file (index.hmtl
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Google Authenticate router  ***************
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }))
app.get('/auth/google/callback',
    passport.authenticate('google',
        {
            successRedirect: "/",
            failureRedirect: '/fail'
        }))

//Facebook auth routes ***************
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }))
app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/',
            failureRedirect: '/fail'
        })
)
app.get('/fail', (req, res) => {
    res.send("Failed attempt");
})

//handle error during api call
app.use(errorHandler);

// start server

//host configuration
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
//start server
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
