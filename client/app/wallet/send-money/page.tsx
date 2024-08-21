'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { getUserNameAndIDApi, sendMoneyApi } from '@/lib/store/features/users/usersApi'
import { useEffect, useState } from 'react'

interface ISendMoneyInputs {
    reciepent: string,
    amount: string
}

const SendMoneyPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [userListData, setUserListData] = useState<any[]>([])
    const { loggedInUser, error } = useAppSelector((state) => state.users)

    useEffect(() => {
        const getData = async () => {
            const data = await dispatch(getUserNameAndIDApi())
            setUserListData(data.payload)
        }
        getData()
    }, [])

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
            const toastID = toast.loading("Loading...")
            const resultAction = await dispatch(sendMoneyApi(formData))
            if (sendMoneyApi.fulfilled.match(resultAction)) {
                toast.success("Money Sent Successfully", { id: toastID })
                reset()
                router.push(`/wallet`)
            } else {
                setTimeout(() => {
                    toast.error(error, { id: toastID })
                }, 2000);
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
            <h1>Send Money</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md">
                <div>
                    <label htmlFor="recipient">Recipient</label>
                    <select {...register('reciepent', { required: { value: true, message: "Recipient is required." } })}>
                        {filteredUserList().map((user, index) => (
                            <option key={index} value={user.EmployeeId}>{user.FirstName} {user.LastName}</option>
                        ))}
                    </select>
                    {errors.reciepent && (<span id="recipientError"> {errors.reciepent.message} </span>)}
                </div>
                <div>
                    <label htmlFor='Amount'>Amount</label>
                    <input type="number" placeholder='Amount' {...register('amount', { required: { value: true, message: "Amount is required." }, validate: validateAmount })} />
                    {errors.amount && (<span className='errordiv'> {errors.amount.message} </span>)}
                </div>
                <button id='btnSend' disabled={errors.amount || errors.reciepent ? true : false} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:transition hover:text-white rounded-lg disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:text-black">Send Money</button>
                {error && (
                    <h2 id='notification' className="text-center text-2xl text-amber-700 tracking-wide uppercase">
                        {error}
                    </h2>
                )}
            </form>
        </main>
    )
}

export default SendMoneyPage