const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planets = require('./planets.mongo');

function isHabitable(planet) {
    return planet.koi_disposition === 'CONFIRMED'
        && planet.koi_insol > 0.36
        && planet.koi_insol < 1.11
        && planet.koi_prad < 1.6;
}

async function getAllHabitablePlanets() {
    return planets.find({}, {
        _id: 0,
        __v: 0,
    });
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (error) {
        console.error(`Could not save planet: ${error}`);
    }
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', '..', '..', 'data', 'nasa-project', 'keplar_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                if (isHabitable(data)) {
                    await savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.error(err);
                reject(err);
            })
            .on('end', async () => {
                const countPlanetsFound = (await getAllHabitablePlanets()).length;
                console.warn(`${countPlanetsFound} habitable planets available!`);
                resolve();
            });
    });
}

module.exports = {
    loadPlanetsData,
    getAllHabitablePlanets,
};
