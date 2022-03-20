const express = require('express');

const {
    httpCreateNewUser,
    httpDeleteUser,
    httpGetAllUsers,
    httpUpdateUserById,
} = require('./users.controller');

const userRouter = express.Router();

userRouter.post('/', httpCreateNewUser);
userRouter.get('/', httpGetAllUsers);

userRouter.delete('/:userId', httpDeleteUser);
userRouter.put('/:userId', httpUpdateUserById);

module.exports = userRouter;
