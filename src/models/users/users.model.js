const { StatusCodes } = require('http-status-codes');

const userCollection = require('./users.mongo');

async function createNewUser(userBody) {
    if (await userCollection.isEmailTaken(userBody.email)) {
        throw new Error(`Error code: ${StatusCodes.BAD_REQUEST} - 'Email already taken'`);
    }
    return userCollection.create(userBody);
}

async function getAllUsers() {
    const users = userCollection.find({}, {
        _id: 0,
        __v: 0,
    });
    if (users) {
        throw new Error(`Error code: ${StatusCodes.BAD_REQUEST} - 'Something went wrong with fetching users'`);
    }
    return users;
}

async function getUserById(id) {
    return userCollection.findById(id);
}

async function deleteUserById(userId) {
    const user = await getUserById(userId);
    if (!user) {
        throw new Error(`${StatusCodes.NOT_FOUND} -> 'User not found'`);
    }
    await user.remove();
    return user;
}

async function updateUserById(userId, updateBody) {
    const user = await getUserById(userId);
    if (!user) {
        throw new Error(`${StatusCodes.NOT_FOUND}, 'User not found'`);
    }
    if (updateBody.email && (await userCollection.isEmailTaken(updateBody.email, userId))) {
        throw new Error(`${StatusCodes.BAD_REQUEST}, 'Email already taken'`);
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
}

async function getUserByEmail(email) {
    return userCollection.findOne({ email });
}

module.exports = {
    createNewUser,
    deleteUserById,
    getAllUsers,
    getUserByEmail,
    getUserById,
    updateUserById,
};
