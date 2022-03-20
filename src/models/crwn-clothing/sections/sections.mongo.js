const mongoose = require('mongoose');

const sectionsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    linkUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Section', sectionsSchema);
