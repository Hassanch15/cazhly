function fileIsValid(reqFile) {
    if (reqFile.mimetype != "image/jpeg" && reqFile.mimetype != "image/png") {
        throw "Only PNG/JPEG is supported";
    }
}

function multiplefileIsValid(req, reqFiles) {
    try {
        reqFiles.forEach((file) => {
            if (file.mimetype != "image/jpeg" && file.mimetype != "image/png") {
                throw "Only PNG/JPEG is supported";
            }
        });
    } catch (e) {
        fileIsValid(req, reqFiles);
        req.files.item_images = [];
        req.files.item_images.push(reqFiles);
    }

}


function deleteFileIfExist(id) {
    console.log(id);
    const glob = require('glob');
    const fs = require('fs');
    glob("**/*" + id + ".*", null, function (er, files) {
        if (files) {
            files.forEach((file) => {
                fs.unlink(file, function (error) {
                });
            });
        }
        return;
    });
}


module.exports = {fileIsValid, multiplefileIsValid, deleteFileIfExist};
