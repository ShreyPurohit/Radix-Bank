'use client'

import { ISendMoneyInputs } from '@/lib/interfaces'
import { getUserNameAndIDApi, sendMoneyApi } from '@/lib/store/features/users/usersApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { socket } from '@/socket'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const SendMoneyPage = () => {
    const dispatch = useAppDispatch()
    const [userListData, setUserListData] = useState<any[]>([])
    const { loggedInUser, error } = useAppSelector((state) => state.users)
    const [showNotificationBar, setShowNotificationBar] = useState({ show: false, message: "" })

    useEffect(() => {
        socket.emit('join room', { to: loggedInUser?.split(' ')[1] })
    }, [loggedInUser])

    useEffect(() => {
        const getData = async () => {
            const data = await dispatch(getUserNameAndIDApi())
            setUserListData(data.payload)
        }
        getData()
        socket.on('reciever-notification', (message) => {
            console.log(message);

            setShowNotificationBar({ show: true, message })
            setTimeout(() => {
                setShowNotificationBar({ show: false, message: "" })
            }, 5000);
        })
        return () => {
            socket.off('reciever-notification')
        }
    }, [])

    useEffect(() => {
        setShowNotificationBar({ show: true, message: error! })
        setTimeout(() => {
            setShowNotificationBar({ show: false, message: "" })
        }, 5000);
    }, [error])

    const filteredUserList = () => {
        return ["", ...userListData.filter((user) => user.FirstName.toLowerCase() !== loggedInUser?.split('_')[0])]
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ISendMoneyInputs>({ mode: 'all' })

    const onSubmit: SubmitHandler<ISendMoneyInputs> = async (data: ISendMoneyInputs) => {
        const formData = new FormData()
        formData.append('Recipient', data.reciepent)
        formData.append('Amount', data.amount.toString())
        try {
            if (!loggedInUser) return
            const resultAction = await dispatch(sendMoneyApi(formData))
            if (sendMoneyApi.fulfilled.match(resultAction)) {
                socket.emit('reciever-join', { reciever: data.reciepent, amount: data.amount }, (error: any) => {
                    if (error) { return toast.error(error) }
                    setShowNotificationBar({ show: true, message: `Payment sent: ${data.amount}` })
                    setTimeout(() => {
                        setShowNotificationBar({ show: false, message: "" })
                    }, 5000);
                    console.log('emitted reciever-join notification');
                })
                reset()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const validateAmount = (value: string) => {
        if (!value) {
            return "Amount is required."
        }
        if (+(value) <= 0) {
            return "Amount must be greater than 0."
        }
        if (value.length > 8) {
            return "Amount cannot be more than 8 digits."
        }
        return true
    }

    return (
        <main>
            <div id='notification' className={`${showNotificationBar.show ? 'block' : 'hidden'} w-full py-3 text-xl text-center bg-blue-300`}>{showNotificationBar.message ? showNotificationBar.message : ""}</div>
            <h1>Send Money</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md">
                <div>
                    <label htmlFor="recipient">Recipient</label>
                    <select id='recipientInput' {...register('reciepent', { required: { value: true, message: "Recipient is required." } })}>
                        {filteredUserList().map((user, index) => (
                            <option key={index} value={user.EmployeeId}>
                                {user.FirstName} {user.LastName}
                            </option>
                        ))}
                    </select>
                    {errors.reciepent && (<span id="recipientError"> {errors.reciepent.message} </span>)}
                </div>
                <div>
                    <label htmlFor='amountInput'>Amount</label>
                    <input id='amountInput' type="number" placeholder='Amount' {...register('amount', { required: { value: true, message: "Amount is required." }, validate: validateAmount })} />
                    {errors.amount && (<span className='errordiv'> {errors.amount.message} </span>)}
                </div>
                <button id='btnSend' disabled={errors.amount || errors.reciepent ? true : false} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:transition hover:text-white rounded-lg disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:text-black">Send Money</button>
                {error && (
                    <h2 id='errBalance' className="text-center text-2xl text-amber-700 tracking-wide uppercase">
                        {error}
                    </h2>
                )}
            </form>
        </main>
    )
}

export default SendMoneyPage