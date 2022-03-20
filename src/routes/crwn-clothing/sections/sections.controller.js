const { StatusCodes } = require('http-status-codes');
const { getAllSections } = require('../../../models/crwn-clothing/sections/sections.model');

async function httpGetAllSections(request, response) {
    const sections = await getAllSections();
    return response.status(StatusCodes.OK).json(sections);
}

module.exports = {
    httpGetAllSections,
};
