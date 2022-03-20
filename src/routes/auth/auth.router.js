const express = require('express');

const {
    httpForgotPassword,
    httpLoginUser,
    httpLogoutUser,
    httpRefreshToken,
    httpRegisterUser,
    httpResetPassword,
    httpSendVerificationEmail,
    httpVerifyEmail,
} = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', httpRegisterUser);
authRouter.post('/login', httpLoginUser);
authRouter.post('/logout', httpLogoutUser);
authRouter.post('/refresh-tokens', httpRefreshToken);
authRouter.post('/forgot-password', httpForgotPassword);
authRouter.post('/reset-password', httpResetPassword);
authRouter.post('/send-verification', httpSendVerificationEmail);
authRouter.post('/verify-email', httpVerifyEmail);

module.exports = authRouter;
