import { Context } from 'koa';
import { decrypt } from '../lib/cookieAuth';
import {
    addToWallet,
    fetchTransactionsService,
    fetchUserWalletService,
    getUserNameAndIDService,
    loginService,
    sendMoneyService
} from '../services/userServices';

const alreadyLoggedController = (ctx: Context) => {
    const cookie = ctx.cookies.get('loggedIn');

    if (!cookie) {
        ctx.status = 404;
        ctx.body = { message: 'No User Logged In' };
        return;
    }

    try {
        const decryptedUser = decrypt(cookie);
        const user = JSON.parse(decryptedUser);
        ctx.status = 200;
        ctx.body = { message: 'User logged in', user };
    } catch (error) {
        console.error('Decryption Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const fetchWalletDetailsController = async (ctx: Context) => {
    try {
        const username = ctx.request.body
        await fetchUserWalletService(username, ctx)
    } catch (error) {
        console.error('Wallet Details Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
}

const loginController = async (ctx: Context) => {
    const { Username, Password } = ctx.request.body;

    if (!Username || !Password) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid Data' };
        return;
    }

    try {
        await loginService(Username, Password, ctx);
    } catch (error) {
        console.error('Login Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const logoutController = (ctx: Context) => {
    const cookie = ctx.cookies.get('loggedIn');

    if (!cookie) {
        ctx.status = 404;
        ctx.body = { message: 'No User Logged In' };
        return;
    }

    try {
        ctx.cookies.set('loggedIn', '', { maxAge: -1, path: '/' });
        ctx.status = 200;
        ctx.body = { message: 'Logged Out Successfully' };
    } catch (error) {
        console.error('Logout Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const addToWalletController = async (ctx: Context) => {
    const { Amount, user } = ctx.request.body;

    if (!Amount || !user) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid Data' };
        return;
    }

    try {
        await addToWallet(Amount, user, ctx);
    } catch (error) {
        console.error('Add To Wallet Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const getUserNameAndIDController = async (ctx: Context) => {
    try {
        await getUserNameAndIDService(ctx);
    } catch (error) {
        console.error('Fetch User List Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const sendMoneyController = async (ctx: Context) => {
    const { Recipient, Amount, user } = ctx.request.body;

    if (!Recipient || !Amount || !user) {
        ctx.status = 400;
        ctx.body = { message: 'Invalid Data' };
        return;
    }

    try {
        await sendMoneyService(Recipient, user, Amount, ctx);
    } catch (error) {
        console.error('Send Money Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const fetchTransactionsController = async (ctx: any) => {
    const user = ctx.request.body;
    const page = ctx.request.query.page || '1';
    const limit = ctx.request.query.limit || '4';

    if (!user) {
        ctx.status = 400;
        ctx.body = { message: 'User is required' };
        return;
    }

    try {
        await fetchTransactionsService(user, page, limit, ctx);
    } catch (error) {
        console.error('Fetch Transactions Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

export {
    addToWalletController, alreadyLoggedController, fetchTransactionsController, getUserNameAndIDController, loginController,
    logoutController, sendMoneyController, fetchWalletDetailsController
};
