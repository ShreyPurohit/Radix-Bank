'use client'

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { useEffect } from "react"
import { getMyTransactions } from "@/lib/store/features/users/usersApi"

const SendMoneyPage = () => {
    const { myTransactions, loggedInUser } = useAppSelector((state) => state.users)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getMyTransactions())
    }, [loggedInUser])

    return (
        <main>
            <h1>Transaction History</h1>
            <table className="w-full text-center" id="transactionList">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Sender Name</th>
                        <th>Reciever Name</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {myTransactions.map((transaction) => (
                        <tr key={transaction.transactionId} id={`tr${transaction.senderId}`}>
                            <td>{transaction.transactionId}</td>
                            <td>{transaction.senderName}</td>
                            <td>{transaction.recieverName}</td>
                            <td>{transaction.amount}</td>
                            <td>
                                {transaction.timestamp.toString().split('T')[0]}{" "}
                                {transaction.timestamp.toString().split('T')[1].split('.')[0]}
                            </td>
                            <td className={`${transaction.senderName === loggedInUser?.split(' ')[0] ? 'text-red-500' : 'text-green-500'}`}>
                                {transaction.senderName === loggedInUser?.split(' ')[0] ? "Debit" : "Credit"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

export default SendMoneyPage