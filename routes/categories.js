const router = require('express').Router();
const Joi = require('joi');
const auth = require('../middlewares/auth');
const Category = require('../models/Category');
const permission = require('../permissions/categories');

const schema = Joi.object({
    name: Joi.string().required().max(255)
});

router.get('/categories', auth, permission('view'), async (req, res) => {
    try {
        const data = await Category.find();

        return res.json({
            message: 'Categories',
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

router.post('/categories', auth, permission('create'), async (req, res) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
        return res.status(422).json({
            message: validation.error.details[0].message
        });
    }

    const category = new Category({
        name: req.body.name
    });

    try {
        const data = await category.save();

        return res.json({
            message: 'Category successfully created.',
            data: data
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

router.put('/categories/:id', auth, permission('update'), async (req, res) => {
    const validation = schema.validate(req.body);

    if (validation.error) {
        return res.status(422).json({
            message: validation.error.details[0].message
        });
    }

    try {
        const category = await Category.findOne({ _id: req.params.id });

        if (! category) {
            return res.status(404).json({
                message: 'Category not found.'
            });
        }

        await Category.updateOne(
            { _id: req.params.id },
            {
                name: req.body.name,
                updated_at: Date.now()
            }
        );

        return res.json({
            message: 'Category successfully updated.'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

router.delete('/categories/:id', auth, permission('delete'), async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id });

        if (! category) {
            return res.status(404).json({
                message: 'Category not found.'
            });
        }

        await Category.deleteOne({ _id: req.params.id });

        return res.json({
            message: 'Category successfully deleted.'
        });
    } catch (err) {
        return res.status(500).json({
            message: 'There is an error while establishing database connection.'
        });
    }
});

module.exports = router;