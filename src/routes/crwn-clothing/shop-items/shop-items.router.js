const express = require('express');

const { httpGetAllSectionsWithItems } = require('./shop-items.controller');

const shopItemsRouter = express.Router();

shopItemsRouter.get('/', httpGetAllSectionsWithItems);

module.exports = shopItemsRouter;
