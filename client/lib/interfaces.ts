export interface ITransactions {
    senderId: string,
    transactionId: number,
    senderName: string,
    recieverName: number,
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
}