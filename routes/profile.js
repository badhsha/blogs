const router = require('express').Router();
const auth = require('../middlewares/auth');
const User = require('../models/User');

router.get('/profile', auth, async (req, res) => {
    return res.json({
        message: 'User',
        data: {
            user: req.user
        }
    });
});

module.exports = router;