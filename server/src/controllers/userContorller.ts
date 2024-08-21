import { Context } from "koa"
import { decrypt } from "../lib/cookieAuth"
import { loginService, addToWallet, getUserNameAndIDService, sendMoneyService, fetchTransactionsService } from "../services/userServices"

const alreadyLoggedController = (ctx: Context) => {
    const cookie = ctx.cookies.get('loggedIn')

    if (!cookie) {
        ctx.status = 404
        ctx.body = { message: "No User Logged In" }
        return
    }

    const authToken = cookie;
    const decryptedUser = decrypt(authToken);
    const user = JSON.parse(decryptedUser);

    ctx.status = 200
    ctx.body = { message: "User logged in", user }
}

const loginController = async (ctx: Context) => {
    try {
        const { Username, Password } = ctx.request.body
        if (!Username || !Password) {
            ctx.status = 400
            ctx.body = { message: "Invalid Data" }
            return
        }
        await loginService(Username, Password, ctx)
    } catch (error) {
        console.error(error);
    }
}

const logoutController = async (ctx: Context) => {
    const cookie = ctx.cookies.get('loggedIn')

    if (!cookie) {
        ctx.status = 404
        ctx.body = { message: "No User Logged In" }
        return
    }
    ctx.cookies.set('loggedIn', "", { maxAge: -1, path: '/' })
    ctx.status = 200
    ctx.body = { message: "Loggout Successfully" }
}

const addToWalletController = async (ctx: Context) => {
    const { Amount, user } = ctx.request.body
    try {
        await addToWallet(Amount, user, ctx)
    } catch (error) {
        console.error(error);
    }
}

const getUserNameAndIDController = async (ctx: Context) => {
    try {
        await getUserNameAndIDService(ctx)
    } catch (error) {
        console.error(error);
    }
}

const sendMoneyController = async (ctx: Context) => {
    const { Recipient, Amount, user } = ctx.request.body
    try {
        await sendMoneyService(Recipient, user, Amount, ctx)
    } catch (error) {
        console.error(error);
    }
}

const fetchTransactionsController = async (ctx: Context) => {
    try {
        const user = ctx.request.body
        await fetchTransactionsService(user, ctx)
    } catch (error) {
        console.error(error);
    }
}

export { alreadyLoggedController, loginController, logoutController, addToWalletController, getUserNameAndIDController, sendMoneyController, fetchTransactionsController }
