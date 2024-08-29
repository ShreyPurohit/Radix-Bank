'use client'

import { ISendMoneyInputs, IUserListData } from '@/lib/interfaces'
import { getUserNameAndIDApi, sendMoneyApi } from '@/lib/store/features/users/usersApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { socket } from '@/socket'
import { useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import ErrorComponent from '@/components/ErrorComponent'

const useFilteredUserList = (userListData: IUserListData[], loggedInUser: string) => {
    return useMemo(() => {
        const loggedInUserFirstName = loggedInUser ? loggedInUser.split('_')[0].toLowerCase() : ""
        return [
            { EmployeeId: "", FirstName: "Select", LastName: "User" },
            ...userListData.filter(user => user.FirstName.toLowerCase() !== loggedInUserFirstName)
        ]
    }, [userListData, loggedInUser])
}

const SendMoneyPage = () => {
    const dispatch = useAppDispatch()
    const { loggedInUser } = useAppSelector((state) => state.users)
    const [userListData, setUserListData] = useState<IUserListData[]>([])
    const [notification, setNotification] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserList = async () => {
            const resultAction = await dispatch(getUserNameAndIDApi())
            setUserListData(resultAction.payload)
        }
        fetchUserList()
    }, [dispatch])

    const filteredUserList = useFilteredUserList(userListData, loggedInUser!)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ISendMoneyInputs>({ mode: 'all' })

    const onSubmit: SubmitHandler<ISendMoneyInputs> = async (data) => {
        if (!loggedInUser) return

        const formData = new FormData()
        formData.append('Recipient', data.reciepent)
        formData.append('Amount', data.amount.toString())

        try {
            const resultAction = await dispatch(sendMoneyApi(formData))
            if (sendMoneyApi.fulfilled.match(resultAction)) {
                socket.emit('reciever-join', { reciever: data.reciepent, amount: data.amount }, (error: any) => {
                    if (error) return toast.error(error)
                    setNotification(`Payment sent: ${data.amount}`)
                    setTimeout(() => setNotification(null), 5000)
                })
                reset()
            }
        } catch (err) {
            console.error(err)
        }
    }

    const validateAmount = (value: string) => {
        const numValue = Number(value)
        return !value ? "Amount is required." : numValue <= 0 ? "Amount must be greater than 0." : value.length > 8 ? "Amount cannot exceed 8 digits" : true
    }

    return (
        <main>
            {notification && <div id='notification' className="w-full py-3 text-xl text-center bg-blue-300">{notification}</div>}
            <h1>Send Money</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md">
                <div>
                    <label htmlFor="recipientInput">Recipient</label>
                    <select id='recipientInput' {...register('reciepent', { required: { value: true, message: "Recipient is required." } })}>
                        {filteredUserList.map((user, index) => (
                            <option key={index} value={user.EmployeeId}>
                                {user.FirstName} {user.LastName}
                            </option>
                        ))}
                    </select>
                    {errors.reciepent && (<span id="recipientError">{errors.reciepent.message}</span>)}
                </div>
                <div>
                    <label htmlFor='amountInput'>Amount</label>
                    <input id='amountInput' type="number" placeholder='Amount' {...register('amount', { required: { value: true, message: "Amount is required." }, validate: validateAmount })} />
                    {errors.amount && (<span className='errordiv'>{errors.amount.message}</span>)}
                </div>
                <button id='btnSend' disabled={!!errors.amount || !!errors.reciepent} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:text-white rounded-lg disabled:bg-gray-600">Send Money</button>
                <ErrorComponent />
            </form>
        </main>
    )
}

export default SendMoneyPage