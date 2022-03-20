const { StatusCodes } = require('http-status-codes');

// * Services
const {
    sendResetPasswordEmail,
    sendVerificationEmail,
} = require('../../services/email.service');

// * User model
const { createUser } = require('../../models/users/users.model');

// * Token model
const {
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken,
} = require('../../models/token/token.model');

// * Authentication model
const {
    loginUserWithEmailAndPassword,
    logoutUser,
    refreshAuthentication,
    resetPassword,
    verifyEmail,
} = require('../../models/auth/auth.model');

async function httpRegisterUser(req, res) {
    const user = await createUser(req.body);
    const tokens = await generateAuthTokens(user);
    res.status(StatusCodes.CREATED).json({ user, tokens });
}

async function httpLoginUser(req, res) {
    const { email, password } = req.body;
    const user = await loginUserWithEmailAndPassword(email, password);
    const tokens = await generateAuthTokens(user);
    res.status(StatusCodes.CREATED).json({ user, tokens });
}

async function httpLogoutUser(req, res) {
    const { refreshToken } = req.body;
    await logoutUser(refreshToken);
    res.status(StatusCodes.NO_CONTENT).send();
}

async function httpRefreshToken(req, res) {
    const { refreshToken } = req.body;
    const tokens = await refreshAuthentication(refreshToken);
    res.status(StatusCodes.OK).json({ ...tokens });
}

async function httpForgotPassword(req, res) {
    const { email } = req.body;
    const resetPasswordToken = await generateResetPasswordToken(email);
    await sendResetPasswordEmail(email, resetPasswordToken);
    res.status(StatusCodes.NO_CONTENT).send();
}

async function httpResetPassword(req, res) {
    await resetPassword(req.query.token, req.body.password);
    res.status(StatusCodes.NO_CONTENT).send();
}

async function httpSendVerificationEmail(req, res) {
    const { email } = req.body;
    const verifyEmailToken = await generateVerifyEmailToken(req.user);
    await sendVerificationEmail(email, verifyEmailToken);
    res.status(StatusCodes.NO_CONTENT).send();
}

async function httpVerifyEmail(req, res) {
    const { token } = req.body;
    await verifyEmail(token);
    res.status(StatusCodes.NO_CONTENT).send();
}

module.exports = {
    httpForgotPassword,
    httpLoginUser,
    httpLogoutUser,
    httpRefreshToken,
    httpRegisterUser,
    httpResetPassword,
    httpSendVerificationEmail,
    httpVerifyEmail,
};
