'use client'

import { IAddFundInputs } from '@/lib/interfaces'
import { addToWalletApi } from '@/lib/store/features/users/usersApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { socket } from '@/socket'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

const AddFundsPage = () => {
    const dispatch = useAppDispatch()
    const { error, loggedInUser } = useAppSelector((state) => state.users)
    const [notification, setNotification] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IAddFundInputs>({ mode: "all" })

    useEffect(() => {
        socket.on('personal-notification', (message) => {
            setNotification(message)
            setTimeout(() => { setNotification(null) }, 5000)
        })
        return () => { socket.off('personal-notification') }
    }, [socket])

    useEffect(() => {
        setNotification(error)
        setTimeout(() => {
            setNotification(null)
        }, 5000);
    }, [error])

    const onSubmit: SubmitHandler<IAddFundInputs> = async (data) => {
        const formData = new FormData()
        formData.append('Amount', data.Amount)
        try {
            const resultAction = await dispatch(addToWalletApi(formData))
            if (addToWalletApi.fulfilled.match(resultAction)) {
                socket.emit('personal-join', { username: loggedInUser?.split(' ')[0], amount: data.Amount }, (error: any) => {
                    if (error) return toast.error(error)
                })
                reset()
            } else if (error) {
                setNotification(error)
                setTimeout(() => setNotification(null), 5000)
            }
        } catch (err) {
            console.error(err)
        }
    }

    const validateAmount = (value: string) => {
        const numValue = Number(value)
        return !value ? "Amount is required." : numValue <= 0 ? "Amount must be greater than 0." : value.length > 8 ? "Amount cannot be more than 8 digits." : true
    }

    return (
        <main>
            {notification && <div id='notification' className="w-full py-3 text-xl text-center bg-blue-300">{notification}</div>}
            <h1 className='mt-2'>Add Funds</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md'>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input type="number" id='amount' placeholder='Amount' {...register('Amount', { validate: validateAmount })} />
                    {errors.Amount && (<span className='errordiv'>{errors.Amount.message}</span>)}
                </div>
                <button id='addFundsConfirmButton' disabled={!!errors.Amount} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:text-white rounded-lg disabled:bg-gray-600">Add Funds</button>
                {error && (
                    <h2 id='errBalance' className="text-center text-2xl text-amber-700 tracking-wide uppercase">
                        {error}
                    </h2>
                )}
            </form>
        </main>
    )
}

export default AddFundsPage