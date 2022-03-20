const express = require('express');

const nasaProjectRouter = require('./nasa-project');
const crwnClothingRouter = require('./crwn-clothing');
const coffeeConnoisseurRouter = require('./coffee-connoisseur');
const authenticationRouter = require('./auth/auth.router');

const routes = express.Router();

routes.use('/nasa-project/v1', nasaProjectRouter);
routes.use('/crwn-clothing/v1', crwnClothingRouter);
routes.use('/coffee-connoisseur/v1', coffeeConnoisseurRouter);
routes.use('/authentication/v1', authenticationRouter);

module.exports = routes;
