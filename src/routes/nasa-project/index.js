const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

const nasaProjectRouter = express.Router();

nasaProjectRouter.use('/planets', planetsRouter);
nasaProjectRouter.use('/launches', launchesRouter);

module.exports = nasaProjectRouter;
