const fs = require('fs');
const path = require('path');

const sectionsCollection = require('./sections.mongo');
const getChunkedData = require('../../../utils/bufferData');

async function saveSection(section) {
    try {
        await sectionsCollection.updateOne({ id: section.id }, section, {
            upsert: true,
        });
    } catch (error) {
        console.error(`Could not save CrwnShop section. Error: ${error}`);
    }
}

async function getAllSections() {
    await sectionsCollection.find({}, {
        _id: 0,
        __v: 0,
    });
}

function loadSectionsData() {
    return new Promise((resolve, reject) => {
        const chunkData = [];
        fs.createReadStream(path.join(__dirname, '..', '..', '..', '..', 'data', 'crwn-clothing', 'sections_data.json'))
            .on('data', (data) => {
                chunkData.push(data);
            })
            .on('error', (error) => {
                console.error(error);
                reject();
            })
            .on('end', async () => {
                const { sectionsData } = await getChunkedData(chunkData);
                sectionsData.forEach(async (section) => {
                    await saveSection(section);
                });
                resolve();
            });
    });
}

module.exports = {
    loadSectionsData,
    getAllSections,
};
