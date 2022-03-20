/* eslint-disable no-console */
const http = require('http');

require('dotenv').config();

const app = require('./app');

const { mongoConnect } = require('./utils/mongo');

const loadNasaProjectData = require('./models/nasa-project');
const loadCrwdClothingData = require('./models/crwn-clothing');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();

    await loadNasaProjectData();
    await loadCrwdClothingData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();
