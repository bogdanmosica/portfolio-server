const express = require('express');

const { httpGetAllSections } = require('./sections.controller');

const sectionsRouter = express.Router();

sectionsRouter.get('/', httpGetAllSections);

module.exports = sectionsRouter;
