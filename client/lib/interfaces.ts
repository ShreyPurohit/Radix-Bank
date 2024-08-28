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

export interface IUserListData {
    _id: string,
    EmployeeId: number,
    FirstName: string,
    LastName: string
}

export interface ITransactonComponentProps {
    currentPage: number,
    handlePagePrevious: (e: React.MouseEvent<HTMLButtonElement>) => void
    totalPages: number,
    handlePageNext: (e: React.MouseEvent<HTMLButtonElement>) => void,
    handleLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    currLimit: number
}