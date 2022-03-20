const { StatusCodes } = require('http-status-codes');
const { getAllSectionsWithItems } = require('../../../models/crwn-clothing/shop-items/shop-items.model');

async function httpGetAllSectionsWithItems(request, response) {
    const sections = await getAllSectionsWithItems();
    return response.status(StatusCodes.OK).json(sections);
}

module.exports = {
    httpGetAllSectionsWithItems,
};
