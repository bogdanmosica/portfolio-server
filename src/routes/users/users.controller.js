const { StatusCodes } = require('http-status-codes');

const {
    createNewUser,
    deleteUserById,
    getAllUsers,
    updateUserById,
} = require('../../models/users/users.model');

async function httpCreateNewUser(req, res) {
    return res.status(StatusCodes.OK).json(await createNewUser(req.body));
}

async function httpGetAllUsers(req, res) {
    return res.status(StatusCodes.OK).json(await getAllUsers());
}

async function httpDeleteUser(req, res) {
    const { userId } = req.params;
    return res.status(StatusCodes.OK).json(await deleteUserById(userId));
}

async function httpUpdateUserById(req, res) {
    const { userId } = req.params;
    return res.status(StatusCodes.OK).json(await updateUserById(userId, req.body));
}

module.exports = {
    httpCreateNewUser,
    httpDeleteUser,
    httpGetAllUsers,
    httpUpdateUserById,
};
