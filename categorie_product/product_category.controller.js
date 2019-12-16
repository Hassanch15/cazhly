const express = require('express');
const router = express.Router();
const product_category_service = require('./product_category.service');
const cors = require('cors');
const multer = require('multer');


// routes
// router.post('/uploadImage', uploadImage);
router.post('/add', addCategory);
router.put('/update', updateCategories);
router.get('/all', getAll);

module.exports = router;

function addCategory(req, res, next) {
    console.log(req);
    product_category_service.addNewCategory(req.body)
        .then(() => res.json({"message": "Category added"}))
        .catch(err => next(err));
}

function uploadImage(req, res, next) {

    let imageUrl;
    const storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            imageUrl = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
            cb(null, imageUrl);
        }
    });

    const upload = multer({ //multer settings
        storage: storage
    }).single('file');

    /** API path that will upload the files */
    //  router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }

        res.json({error_code: 0, err_desc: null, imageName: imageUrl});
    });
    // });

}

function getAll(req, res, next) {
    product_category_service.getAllCategories()
        .then(posts => res.json(posts))
        .catch(err => next(err));
}


function updateCategories(req, res, next) {
    product_category_service.updateCategories(req.body.id, req.body)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

