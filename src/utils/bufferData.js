async function getChunkedData(chunkedData) {
    try {
        const bufferData = Buffer.concat(chunkedData);
        return JSON.parse(bufferData);
    } catch (error) {
        console.error(`Chunked data failed be parsed at bufferData: ${error}`);
    }
}

module.exports = getChunkedData;
