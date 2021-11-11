const jwt = require('jsonwebtoken');
const User = require("../models/User");

module.exports = async function (req, res, next) {
    let token = req.header('Authorization');

    if (! token) {
        res.status(401).json({
            message: 'Un-Authenticated.'
        });
    }

    try {
        token = token.replace('Bearer ', '');
        const userId = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findOne({_id: userId});

        if (! user) {
            res.status(401).json({
                message: 'Un-Authenticated.'
            });
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({
            message: 'Un-Authenticated.'
        });
    }
}