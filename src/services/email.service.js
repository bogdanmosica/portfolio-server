const nodemailer = require('nodemailer');
require('dotenv').config();

const {
    EMAIL_SMTP,
    NODE_ENV,
    EMAIL_FROM,
} = process.env;

const transport = nodemailer.createTransport(EMAIL_SMTP);

if (NODE_ENV !== 'test') {
    transport
        .verify()
        .then(() => { return console.warn('Connected to email server'); })
        .catch(() => { return console.error('Unable to connect to email server. Make sure you have configured the SMTP options in .env'); });
}

const sendEmail = async (to, subject, text) => {
    const msg = {
        from: EMAIL_FROM, to, subject, text,
    };
    await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await sendEmail(to, subject, text);
};

module.exports = {
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
};
