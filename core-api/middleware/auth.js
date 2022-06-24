const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: require('find-config')('.env') })

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const admin = decodedToken.admin;
        //verification du userd id avec la requete du user id encode du token
        if (req.body.userId && req.body.userId !== userId && !admin) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};