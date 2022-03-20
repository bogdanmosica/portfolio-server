const fs = require('fs');
const path = require('path');

const shopItemsCollection = require('./shop-items.mongo');
const getChunkedData = require('../../../utils/bufferData');

async function saveItemData(item) {
    try {
        await shopItemsCollection.updateOne({ id: item.id }, item, {
            upsert: true,
        });
    } catch (error) {
        console.error(`Could not save CrwnShop shop item: ${error}`);
    }
}

async function getAllSectionsWithItems() {
    await shopItemsCollection.find({}, {
        _id: 0,
        __v: 0,
    });
}

function loadShopItemsData() {
    const chunkData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', '..', '..', 'data', 'crwn-clothing', 'shop_data.json'))
            .on('data', (data) => {
                chunkData.push(data);
            })
            .on('error', (error) => {
                console.error(error);
                reject();
            })
            .on('end', async () => {
                const { itemsData } = await getChunkedData(chunkData);
                itemsData.forEach(async (item) => {
                    await saveItemData(item);
                });
                resolve();
            });
    });
}

module.exports = {
    loadShopItemsData,
    getAllSectionsWithItems,
};
