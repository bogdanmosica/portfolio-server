const { loadSectionsData } = require('./sections/sections.model');
const { loadShopItemsData } = require('./shop-items/shop-items.model');

const loadCrwdClothingData = async () => {
    await loadSectionsData();
    await loadShopItemsData();
};

module.exports = loadCrwdClothingData;
