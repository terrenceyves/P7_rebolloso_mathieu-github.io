const jwt = require('jsonwebtoken');
const store = require("store2");



exports.checkAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    return decodedToken.admin;
}