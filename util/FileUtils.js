function fileIsValid(req, reqFile) {
    if (req.files) {
        if (reqFile.mimetype != "image/jpeg" && reqFile.mimetype != "image/png") {
            throw "Only PNG/JPEG is supported";
        }
    }
}

function multiplefileIsValid(req, reqFiles) {
    if (req.files) {
        try {
            reqFiles.forEach((file) => {
                if (file.mimetype != "image/jpeg" && file.mimetype != "image/png") {
                    throw "Only PNG/JPEG is supported";
                }
            });
        } catch (e) {
            fileIsValid(req, reqFiles)
            req.files.item_images = []
            req.files.item_images.push(reqFiles);
        }

    }
}


module.exports = {fileIsValid, multiplefileIsValid};
