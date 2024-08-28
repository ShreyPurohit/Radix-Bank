import { Context } from 'koa';
import { encrypt } from '../lib/cookieAuth';
import BankAccountModel from '../model/BankAccountSchema';
import EmployeeModel from '../model/EmployeeSchema';
import TransactionModel from '../model/TransactionSchema';
import UserModel from '../model/UserSchema';
import WalletModel from '../model/WalletSchema';

const loginService = async (username: string, password: string, ctx: Context): Promise<void> => {
    try {
        const user = await UserModel.findOne({ Username: username });
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User Not Found' };
            return;
        }
        if (user.Password !== password) {
            ctx.status = 400;
            ctx.body = { message: 'Invalid Username/Password' };
            return;
        }

        const [bankDetails, walletDetails] = await Promise.all([
            BankAccountModel.findOne({ EmployeeId: user.Id }),
            WalletModel.findOne({ EmployeeId: user.Id })
        ]);

        const cookieValue = encrypt(JSON.stringify({
            username,
            password,
            bankBalance: bankDetails?.Balance,
            walletBalance: walletDetails?.Balance,
            id: user.Id
        }));

        ctx.status = 200;
        ctx.cookies.set('loggedIn', cookieValue, { path: '/' });
        ctx.body = {
            message: 'User Logged in Successfully',
            user,
            bankBalance: bankDetails?.Balance,
            walletBalance: walletDetails?.Balance
        };
    } catch (error) {
        console.error('Login Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const addToWallet = async (amount: string, username: string, ctx: Context): Promise<void> => {
    try {
        const user = await UserModel.findOne({ Username: username });
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'User Not Found' };
            return;
        }

        const [wallet, bankAccount] = await Promise.all([
            WalletModel.findOne({ EmployeeId: user.Id }),
            BankAccountModel.findOne({ EmployeeId: user.Id })
        ]);

        if (!bankAccount || bankAccount.Balance < Number(amount)) {
            ctx.status = 400;
            ctx.body = { message: 'Insufficient funds in the bank account.' };
            return;
        }

        if (wallet) {
            wallet.Balance += Number(amount);
            bankAccount.Balance -= Number(amount);
            await Promise.all([wallet.save(), bankAccount.save()]);
            ctx.status = 200;
            ctx.body = { message: 'Payment Added To Wallet', payment: wallet.Balance, total: bankAccount.Balance };
        } else {
            await WalletModel.create({
                WalletId: user.Id,
                EmployeeId: user.Id,
                Balance: Number(amount)
            });
            bankAccount.Balance -= Number(amount);
            await bankAccount.save();
            ctx.status = 201;
            ctx.body = { message: 'Payment Created And Added To Wallet', payment: amount, total: bankAccount.Balance };
        }
    } catch (error) {
        console.error('Add To Wallet Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const getUserNameAndIDService = async (ctx: Context): Promise<void> => {
    try {
        const userlist = await EmployeeModel.find().select('-__v -Email');
        ctx.status = 200;
        ctx.body = { message: 'User List Fetched Successfully', userlist };
    } catch (error) {
        console.error('Fetch User List Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const sendMoneyService = async (receiverID: string, senderName: string, amount: string, ctx: Context): Promise<void> => {
    try {
        const user = await UserModel.findOne({ Username: senderName }).select('Id');
        if (!user) {
            ctx.status = 404;
            ctx.body = { message: 'Sender Not Found' };
            return;
        }

        const [senderWallet, receiverWallet] = await Promise.all([
            WalletModel.findOne({ EmployeeId: user.Id }).select('Balance'),
            WalletModel.findOne({ WalletId: receiverID })
        ]);

        if (!senderWallet) {
            ctx.status = 400;
            ctx.body = { message: 'Sender Wallet Not Found' };
            return;
        }
        if (senderWallet.Balance < Number(amount)) {
            ctx.status = 400;
            ctx.body = { message: 'Insufficient Funds' };
            return;
        }
        if (!receiverWallet) {
            ctx.status = 400;
            ctx.body = { message: 'Receiver Wallet Not Found' };
            return;
        }

        senderWallet.Balance -= Number(amount);
        receiverWallet.Balance += Number(amount);

        await Promise.all([
            senderWallet.save(),
            receiverWallet.save(),
            TransactionModel.create({
                TransactionId: await TransactionModel.countDocuments() + 1,
                SenderId: user.Id,
                ReceiverId: receiverID,
                Amount: Number(amount)
            })
        ]);
        ctx.status = 200;
        ctx.body = { message: 'Payment Made Successfully', amount: senderWallet.Balance };
    } catch (error) {
        console.error('Send Money Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

const fetchTransactionsService = async (user: string, page: string, limit: string, ctx: Context): Promise<void> => {
    try {
        const dbUser = await UserModel.findOne({ Username: user }).select('Id');
        if (!dbUser) {
            ctx.status = 404;
            ctx.body = { message: 'User Not Found' };
            return;
        }

        const [myTransactions, totalTransactions] = await Promise.all([
            TransactionModel.aggregate([
                {
                    $match: {
                        $or: [
                            { SenderId: dbUser.Id },
                            { ReceiverId: dbUser.Id }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'SenderId',
                        foreignField: 'Id',
                        as: 'senderDetails'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'ReceiverId',
                        foreignField: 'Id',
                        as: 'receiverDetails'
                    }
                },
                { $unwind: '$senderDetails' },
                { $unwind: '$receiverDetails' },
                {
                    $project: {
                        _id: 0,
                        senderId: '$senderDetails.Id',
                        transactionId: '$TransactionId',
                        senderName: '$senderDetails.Username',
                        recieverName: '$receiverDetails.Username',
                        amount: '$Amount',
                        timestamp: '$Timestamp'
                    }
                }
            ]).skip((+page - 1) * +limit).limit(+limit),
            TransactionModel.countDocuments({
                $or: [
                    { SenderId: dbUser.Id },
                    { ReceiverId: dbUser.Id }
                ]
            })
        ]);

        const totalPages = Math.ceil(totalTransactions / +limit);
        ctx.status = 200;
        ctx.body = {
            message: 'My Payments History Fetched Successfully',
            myTransactions,
            totalTransactions,
            totalPages,
            currentPage: page
        };
    } catch (error) {
        console.error('Fetch Transactions Error:', error);
        ctx.status = 500;
        ctx.body = { message: 'Internal Server Error' };
    }
};

export { addToWallet, fetchTransactionsService, getUserNameAndIDService, loginService, sendMoneyService };