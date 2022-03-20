const express = require('express');

const sectionsRouter = require('./sections/sections.router');
const shopItemsRouter = require('./shop-items/shop-items.router');

const crwnClothingRouter = express.Router();

crwnClothingRouter.use('/sections', sectionsRouter);
crwnClothingRouter.use('/shop-items', shopItemsRouter);

module.exports = crwnClothingRouter;
