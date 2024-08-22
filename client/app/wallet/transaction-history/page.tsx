'use client'

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { useEffect, useState } from "react"
import { getMyTransactions } from "@/lib/store/features/users/usersApi"

const SendMoneyPage = () => {
    const { myTransactions, loggedInUser, totalPages, currentPage } = useAppSelector((state) => state.users)
    const dispatch = useAppDispatch()

    const [currLimit, setCurrLimit] = useState<number>(4)

    useEffect(() => {
        dispatch(getMyTransactions({ page: +(currentPage), limit: currLimit }))
    }, [loggedInUser, currentPage, dispatch])

    useEffect(() => {
        dispatch(getMyTransactions({ page: 1, limit: currLimit }))
    }, [loggedInUser, currLimit, dispatch])

    const formatName = (name: string) => {
        const parts = name.split('_');
        const formattedParts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
        return formattedParts.join(' ');
    }

    const handlePageNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (+(currentPage) < totalPages) {
            dispatch(getMyTransactions({ page: +(currentPage) + 1, limit: currLimit }))
        }
    }

    const handlePagePrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (+(currentPage) > 1) {
            dispatch(getMyTransactions({ page: +(currentPage) - 1, limit: currLimit }))
        }
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = +e.target.value;
        setCurrLimit(newLimit);
    }

    return (
        <main>
            <h1>Transaction History</h1>
            <table className="w-full text-center" id="transactionList">
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Sender Name</th>
                        <th>Receiver Name</th>
                        <th>Amount</th>
                        <th>Timestamp</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {myTransactions.map((transaction) => (
                        <tr key={transaction.transactionId} id={`tr${transaction.senderId}`}>
                            <td>{transaction.transactionId}</td>
                            <td>{formatName(transaction.senderName)}</td>
                            <td>{formatName(transaction.recieverName)}</td>
                            <td>{transaction.amount}</td>
                            <td>
                                {new Date(transaction.timestamp).toLocaleDateString()}{" "}
                                {new Date(transaction.timestamp).toLocaleTimeString()}
                            </td>
                            <td className={`${transaction.senderName === loggedInUser?.split(' ')[0] ? 'text-red-500' : 'text-green-500'}`}>
                                {transaction.senderName === loggedInUser?.split(' ')[0] ? "Debit" : "Credit"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex gap-2 justify-center mt-5">
                <button
                    disabled={+(currentPage) === 1}
                    className="px-3 py-2 bg-slate-200 disabled:bg-gray-500"
                    onClick={handlePagePrevious}
                >
                    Back
                </button>
                <button
                    disabled={+(currentPage) === totalPages}
                    className="px-3 py-2 bg-slate-200 disabled:bg-gray-500"
                    onClick={handlePageNext}
                >
                    Next
                </button>
                <select className='w-max' onChange={handleLimitChange} value={currLimit}>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                    <option value={8}>8</option>
                </select>
            </div>
        </main>
    )
}

export default SendMoneyPage