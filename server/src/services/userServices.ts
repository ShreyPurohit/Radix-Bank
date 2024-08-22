import { Context } from "koa";
import { encrypt } from "../lib/cookieAuth";
import BankAccountModel from "../model/BankAccountSchema";
import EmployeeModel from "../model/EmployeeSchema";
import TransactionModel from "../model/TransactionSchema";
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
        const cookieValue = encrypt(JSON.stringify({ username, password, bankBalance: BankDetails?.Balance, walletBalance: WalletDetails?.Balance, id: user.Id }))

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
            ctx.body = { message: "Payment Added To Wallet", payment: walletPayment.Balance, total: bankAmount.Balance }
        } else {
            await WalletModel.create({
                WalletId: user?.Id,
                EmployeeId: user?.Id,
                Balance: amount
            })
            bankAmount.Balance -= Number(amount)
            await bankAmount.save().then(() => {
                ctx.status = 201
                ctx.body = { message: "Payment Created And Added To Wallet", payment: amount, total: bankAmount.Balance }
            })
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
        if (!senderWalletMoney) {
            ctx.status = 400
            ctx.body = { message: "Wallet not exist" }
            return
        }
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
        const transId = await TransactionModel.countDocuments()
        await TransactionModel.create({
            TransactionId: transId + 1,
            SenderId: user?.Id,
            ReceiverId: recieverID,
            Amount: Number(amount)
        })
        ctx.status = 200
        ctx.body = { message: "Payment Made Successfully", amount: senderWalletMoney.Balance }
    } catch (error) {
        console.error(error);
    }
}

const fetchTransactionsService = async (user: string, page: string, limit: string, ctx: Context) => {
    try {
        const dbuser = await UserModel.findOne({ Username: user }).select('Id')
        const myTransactions = await TransactionModel.aggregate([
            {
                $match: {
                    $or: [
                        { SenderId: dbuser?.Id, },
                        { ReceiverId: dbuser?.Id, },
                    ],
                },
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "SenderId",
                    foreignField: "Id",
                    as: "senderDetails",
                },
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "ReceiverId",
                    foreignField: "Id",
                    as: "receiverDetails",
                },
            },
            {
                $unwind: { path: "$senderDetails" },
            },
            {
                $unwind: { path: "$receiverDetails" },
            },
            {
                $project:
                {
                    _id: 0,
                    senderId: "$senderDetails.Id",
                    transactionId: "$TransactionId",
                    senderName: "$senderDetails.Username",
                    recieverName: "$receiverDetails.Username",
                    amount: "$Amount",
                    timestamp: "$Timestamp",
                },
            },
        ]).skip((+(page) - 1) * +(limit)).limit(+(limit))
        const totalTransactions = await TransactionModel.countDocuments()
        const totalPages = totalTransactions % 4 == 0 ? Math.floor(totalTransactions / +(limit)) : Math.ceil(totalTransactions / +(limit))
        ctx.status = 200
        ctx.body = { message: "My Payments History Fetched Successfully", myTransactions, totalTransactions, totalPages, currentPage: page }
    } catch (error) {
        console.error(error);
    }
}
export { addToWallet, fetchTransactionsService, getUserNameAndIDService, loginService, sendMoneyService };