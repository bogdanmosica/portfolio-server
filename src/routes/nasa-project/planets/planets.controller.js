const { StatusCodes } = require('http-status-codes');

const { getAllHabitablePlanets } = require('../../../models/nasa-project/planets/planets.model');

async function httpGetAllHabitablePlanets(req, res) {
    return res.status(StatusCodes.OK).json(await getAllHabitablePlanets());
}

module.exports = {
    httpGetAllHabitablePlanets,
};
