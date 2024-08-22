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
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<IAddFundInputs>({ mode: "all" })

    const [showNotificationBar, setShowNotificationBar] = useState({ show: false, message: "" })

    useEffect(() => {
        socket.on('personal-notification', (message) => {
            setShowNotificationBar({ show: true, message })
            setTimeout(() => {
                setShowNotificationBar({ show: false, message: "" })
            }, 5000);
        })
        return () => {
            socket.off('personal-notification')
        }
    }, [socket])

    useEffect(() => {
        setShowNotificationBar({ show: true, message: error! })
        setTimeout(() => {
            setShowNotificationBar({ show: false, message: "" })
        }, 5000);
    }, [error])

    const onSubmit: SubmitHandler<IAddFundInputs> = async (data: IAddFundInputs) => {
        const formData = new FormData()
        formData.append('Amount', data.Amount)
        try {
            const resultAction = await dispatch(addToWalletApi(formData));
            if (addToWalletApi.fulfilled.match(resultAction)) {
                socket.emit('personal-join', { username: loggedInUser?.split(' ')[0], amount: data.Amount }, (error: any) => {
                    if (error) { return toast.error(error) }
                    console.log('emitted personal-send notification');
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
            <h1 className='mt-2'>Add Funds</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md'>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input type="number" id='amount' placeholder='Amount' {...register('Amount', { required: { value: true, message: "Amount is required." }, validate: validateAmount })} />
                </div>
                <button id='addFundsConfirmButton' disabled={errors.Amount ? true : false} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:transition hover:text-white rounded-lg disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:text-black">Add Funds</button>
                {errors.Amount && (<span className='errordiv'> {errors.Amount.message} </span>)}
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