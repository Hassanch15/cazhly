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
    const glob = require('glob');
    const fs = require('fs');
    const files = glob.sync("**/*" + id + ".*", null);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            fs.unlinkSync(files[i]);
        }
    }
}


module.exports = {fileIsValid, multiplefileIsValid, deleteFileIfExist};
