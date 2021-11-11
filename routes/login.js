const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

router.post('/login', async (req, res) => {
    const validationError = schema.validate(req.body);

    if (validationError.error) {
        return res.status(422).json({
            message: validationError.error.details[0].message
        });
    }

    const user = await User.findOne({ email: req.body.email });

    if (! user) {
        return res.status(401).json({
            message: 'Incorrect email or password.'
        });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (! isValidPassword) {
        return res.status(401).json({
            message: 'Incorrect email or password.'
        });
    }

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    return res.json({
        message: 'Login successfully done.',
        data: {
            user: user,
            token: token
        }
    });
});

module.exports = router;