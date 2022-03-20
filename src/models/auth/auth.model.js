const { StatusCodes } = require('http-status-codes');

const {
    getUserByEmail,
    updateUserById,
    getUserById,
} = require('../users/users.model');
const tokenCollection = require('../token/token.mongo');
const {
    verifyToken,
    generateAuthTokens,
} = require('../token/token.model');
const { tokenTypes } = require('../../config/tokens');

async function loginUserWithEmailAndPassword(email, password) {
    const user = await getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new Error(`${StatusCodes.UNAUTHORIZED} -> 'Incorrect email or password'`);
    }
    return user;
}

async function logoutUser(refreshToken) {
    const refreshTokenDoc = await tokenCollection.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new Error(`${StatusCodes.NOT_FOUND} -> 'Not found, something went wrong'`);
    }
    await refreshTokenDoc.remove();
}

async function refreshAuthentication(refreshToken) {
    try {
        const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
        const user = await getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return generateAuthTokens(user);
    } catch (error) {
        throw new Error(`${StatusCodes.UNAUTHORIZED} -> 'Please authenticate'`);
    }
}

async function resetPassword(resetPasswordToken, newPassword) {
    try {
        const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
        const user = await getUserById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await updateUserById(user.id, { password: newPassword });
        await tokenCollection.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    } catch (error) {
        throw new Error(`${StatusCodes.UNAUTHORIZED} -> 'Password reset failed'`);
    }
}

async function verifyEmail(verifyEmailToken) {
    try {
        const verifyEmailTokenDoc = await verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await getUserById(verifyEmailTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await tokenCollection.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
        await updateUserById(user.id, { isEmailVerified: true });
    } catch (error) {
        throw new Error(`${StatusCodes.UNAUTHORIZED} -> 'Email verification failed'`);
    }
}

module.exports = {
    loginUserWithEmailAndPassword,
    logoutUser,
    refreshAuthentication,
    resetPassword,
    verifyEmail,
};
