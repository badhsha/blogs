const router = require('express').Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const schema = Joi.object({
    name: Joi.string().required().max(255),
    email: Joi.string().required().email().max(255),
    password: Joi.string().required().min(8).max(255)
});

router.post('/register', async (req, res) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
        return res.status(422).json({
            message: validation.error.details[0].message
        });
    }

    const isEmailExist = await User.exists({ email: req.body.email });

    if (isEmailExist) {
        return res.status(422).json({
            message: 'Email is already exist.'
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: 'publisher'
    });

    try {
       const data = await user.save();
       const token = jwt.sign({_id: data._id}, process.env.TOKEN_SECRET);

        return res.json({
            message: 'Registration successfully done.',
            data: {
                user: data,
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

module.exports = router;