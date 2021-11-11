const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('../middlewares/auth');
const Blog = require('../models/Blog');
const permission = require('../permissions/blogs');

const schema = Joi.object({
    title: Joi.string().required().max(255),
    description: Joi.string().required().max(510),
    category: Joi.objectId()
});

router.get('/blogs', auth, permission('view'), async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === 'admin') {
            filter = { publisher: req.user._id };
        }

        const data = await Blog.find( filter ).populate('category').populate('publisher');

        return res.json({
            message: 'Blogs',
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

router.post('/blogs', auth, permission('create'), async (req, res) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
        return res.status(422).json({
            message: validation.error.details[0].message
        });
    }

    const blog = new Blog({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        publisher: req.user._id
    });

    try {
        const data = await blog.save();

        return res.json({
            message: 'Blog successfully created.',
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.',
            error: err
        });
    }
});

router.put('/blogs/:id', auth, permission('update'), async (req, res) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
        return res.status(422).json({
            message: validation.error.details[0].message
        });
    }

    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (! blog) {
            return res.status(404).json({
                message: 'Blog not found.'
            });
        }

        if ((req.user.role === 'publisher') && (blog.publisher.toString() !== req.user._id.toString())) {
            return res.status(401).json({
                message: 'This action is Un-Authorized'
            });
        }

        await Blog.updateOne(
            { _id: req.params.id },
            {
                title: req.body.title,
                description: req.body.description,
                category: req.body.category,
                publisher: req.user._id,
                updated_at: Date.now()
            }
        );

        return res.json({
            message: 'Blog successfully updated.'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

router.delete('/blogs/:id', auth, permission('delete'), async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (! blog) {
            return res.status(404).json({
                message: 'Blog not found.'
            });
        }

        if ((req.user.role === 'publisher') && (blog.publisher.toString() !== req.user._id.toString())) {
            return res.status(401).json({
                message: 'This action is Un-Authorized'
            });
        }

        await Blog.deleteOne({ _id: req.params.id });

        return res.json({
            message: 'Blog successfully deleted.'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

module.exports = router;