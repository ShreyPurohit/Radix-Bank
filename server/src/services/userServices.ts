import { Context } from "koa";
import { encrypt } from "../lib/cookieAuth";
import BankAccountModel from "../model/BankAccountSchema";
import EmployeeModel from "../model/EmployeeSchema";
import UserModel from "../model/UserSchema";
import WalletModel from "../model/WalletSchema";

const loginService = async (username: string, password: string, ctx: Context) => {
    try {
        const user = await UserModel.findOne({ Username: username })
        if (!user) {
            ctx.status = 404
            ctx.body = { message: "User Not Found" }
            ctx.throw(new Error("User Not Found"))
        }
        if (user && user.Password !== password) {
            ctx.status = 400
            ctx.body = { message: "Invalid Username/Password" }
            ctx.throw(new Error("Invalid Username/Password"))
        }

        const BankDetails = await BankAccountModel.findOne({ EmployeeId: user.Id })
        const WalletDetails = await WalletModel.findOne({ EmployeeId: user.Id })
        const cookieValue = encrypt(JSON.stringify({ username, password, bankBalance: BankDetails?.Balance, walletBalance: WalletDetails?.Balance }))

        ctx.status = 200
        ctx.cookies.set('loggedIn', cookieValue, { path: "/" })
        ctx.body = { message: "User Logged in Successfully", user, bankBalance: BankDetails?.Balance, walletBalance: WalletDetails?.Balance }
    } catch (error) {
        console.error(error);
    }
}

const addToWallet = async (amount: string, username: string, ctx: Context) => {
    try {
        const user = await UserModel.findOne({ Username: username })
        const walletPayment = await WalletModel.findOne({ EmployeeId: user?.Id })
        const bankAmount = await BankAccountModel.findOne({ EmployeeId: user?.Id })
        if (!bankAmount) {
            return
        }
        if (bankAmount.Balance < Number(amount)) {
            ctx.status = 400
            ctx.body = { message: "Insufficient funds in the bank account." }
            return
        }
        if (walletPayment) {
            walletPayment.Balance += Number(amount)
            bankAmount.Balance -= Number(amount)
            await walletPayment.save()
            await bankAmount.save()
            ctx.status = 200
            ctx.body = { message: "Payment Added To Wallet", payment: walletPayment.Balance }
        } else {
            await WalletModel.create({
                WalletId: user?.Id,
                EmployeeId: user?.Id,
                Balance: amount
            })
            bankAmount.Balance -= Number(amount)
            await bankAmount.save()
            ctx.status = 201
            ctx.body = { message: "Payment Created And Added To Wallet", payment: amount }
        }
    } catch (error) {
        console.error(error);
    }
}

const getUserNameAndIDService = async (ctx: Context) => {
    try {
        const userlist = await EmployeeModel.find().select('-__v -Email')
        ctx.status = 200
        ctx.body = { message: "User List Fetched Successfully", userlist }
    } catch (error) {
        console.error(error);
    }
}

const sendMoneyService = async (recieverID: string, senderName: string, amount: string, ctx: Context) => {
    try {
        const user = await UserModel.findOne({ Username: senderName }).select('Id')
        const senderWalletMoney = await WalletModel.findOne({ EmployeeId: user?.Id }).select('Balance')
        if (!senderWalletMoney) { return }
        if (senderWalletMoney.Balance < Number(amount)) {
            ctx.status = 400
            ctx.body = { message: "Insufficient funds" }
            return
        }
        const recieverWallet = await WalletModel.findOne({ WalletId: recieverID })
        if (!recieverWallet) {
            ctx.status = 400
            ctx.body = { message: "Wallet not exist" }
            return
        }
        senderWalletMoney.Balance -= Number(amount)
        await senderWalletMoney.save()
        recieverWallet.Balance += Number(amount)
        await recieverWallet.save()
        ctx.status = 200
        ctx.body = { message: "Payment Made Successfully" }
    } catch (error) {
        console.error(error);
    }
}

export { addToWallet, getUserNameAndIDService, loginService, sendMoneyService };
