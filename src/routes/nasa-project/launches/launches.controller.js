const { StatusCodes } = require('http-status-codes');

const {
    abortLaunchById,
    getAllLaunches,
    getAllSpaceXLaunches,
    launchWithIdExists,
    scheduleNewLaunch,
} = require('../../../models/nasa-project/launches/launches.model');

const {
    getPagination,
} = require('../../../utils/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches({ skip, limit });

    return res.status(StatusCodes.OK).json(launches);
}

async function httpGetAllSpaceXLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllSpaceXLaunches({ skip, limit });

    return res.status(StatusCodes.OK).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    // Validation;
    const {
        launchDate,
        mission,
        rocket,
        target,
    } = launch;

    if (!launchDate
        || !mission
        || !rocket
        || !target
    ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Missing required launch property',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(launch.launchDate)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Invalid launch date',
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(StatusCodes.CREATED).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await launchWithIdExists(launchId);
    if (!existsLaunch) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: 'Launch not found!',
        });
    }
    const abortedLaunch = await abortLaunchById(launchId);

    if (!abortedLaunch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Launch not aborted!',
        });
    }
    return res.status(StatusCodes.OK).json({
        ok: true,
    });
}

module.exports = {
    httpAbortLaunch,
    httpAddNewLaunch,
    httpGetAllLaunches,
    httpGetAllSpaceXLaunches,
};
