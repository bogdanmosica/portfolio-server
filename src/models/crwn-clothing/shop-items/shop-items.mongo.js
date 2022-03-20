const mongoose = require('mongoose');

const shopItemSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const shopItemsData = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    routeName: {
        type: String,
        required: true,
    },
    items: {
        type: [shopItemSchema],
        required: true,
    },
});

module.exports = mongoose.model('ShopItem', shopItemsData);
