const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(bearerToken, 'secretKey', (error, authData) => {
            if (error) {
                res.sendStatus(403);
            } else
                next();
        });

    } else {
        res.sendStatus(403)
    }
}

module.exports = {verifyToken};
