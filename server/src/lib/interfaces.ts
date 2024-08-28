import { Document } from "mongoose"

export interface IBankAccountSchema extends Document {
    BankAccountId: number,
    EmployeeId: number,
    BankName: string,
    AccountNumber: string,
    Balance: number
}

export interface IEmployeeSchema extends Document {
    EmployeeId: number,
    FirstName: string,
    LastName: string,
    Email: string
}

export interface ITransactionSchema extends Document {
    TransactionId: number,
    SenderId: number,
    ReceiverId: number,
    Amount: number,
    Timestamp: Date
}

export interface IUserSchema extends Document {
    Id: number,
    Username: string,
    Password: string,
}

export interface IWalletSchema extends Document {
    WalletId: number,
    EmployeeId: number,
    Balance: number,
    CreatedDate: Date,
    UpdatedDate: Date,
}