const jwt = require('jsonwebtoken');
const moment = require('moment');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const tokenCollection = require('./token.mongo');
const { getUserByEmail } = require('../users/users.model');
const { tokenTypes } = require('../../config/tokens');

const {
    JWT_SECRET,
    JWT_ACCESS_EXPIRATION_MINUTES,
    JWT_REFRESH_EXPIRATION_DAYS,
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
} = process.env;

function generateToken(userId, expires, type, secret = JWT_SECRET) {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
    };
    return jwt.sign(payload, secret);
}

async function saveToken(token, userId, expires, type, blacklisted = false) {
    const tokenDoc = await tokenCollection.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
}

async function verifyToken(token, type) {
    const payload = jwt.verify(token, JWT_SECRET);
    const tokenDoc = await tokenCollection.findOne({
        token, type, user: payload.sub, blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
}

async function generateAuthTokens(user) {
    const accessTokenExpires = moment().add(JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
}

async function generateResetPasswordToken(email) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error(`${StatusCodes.NOT_FOUND} -> 'No users found with this email'`);
    }
    const expires = moment().add(JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
}

async function generateVerifyEmailToken(user) {
    const expires = moment().add(JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 'minutes');
    const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
}

module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
};
