const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        max: 255
    },
    description: {
        type: String,
        max: 510
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    publisher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Blog', blogSchema);