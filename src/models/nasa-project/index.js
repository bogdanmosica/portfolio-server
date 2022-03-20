const { loadPlanetsData } = require('./planets/planets.model');
const { loadLaunchesSpaceXData } = require('./launches/launches.model');

const loadNasaProjectData = async () => {
    await loadPlanetsData();
    await loadLaunchesSpaceXData();
};

module.exports = loadNasaProjectData;
