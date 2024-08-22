export interface ITransactions {
    senderId: string,
    transactionId: number,
    senderName: string,
    recieverName: string,
    amount: number,
    timestamp: Date
}

export interface IUserState {
    loggedInUser: string | null,
    loading: boolean,
    error: string | null,
    myBalance: number,
    myWalletBalance: number,
    myTransactions: ITransactions[]
    totalTransactions: number,
    totalPages: number,
    currentPage: number,
}

export interface ILoginInputs {
    username: string,
    password: string
}

export interface IAddFundInputs {
    Amount: string
}

export interface ISendMoneyInputs {
    reciepent: string,
    amount: string
}
