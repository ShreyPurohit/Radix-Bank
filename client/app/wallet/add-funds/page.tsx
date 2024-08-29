'use client'

import ErrorComponent from '@/components/ErrorComponent'
import { validateAmount } from '@/lib/helperFunctions'
import { IAddFundInputs } from '@/lib/interfaces'
import { addToWalletApi } from '@/lib/store/features/users/usersApi'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { socket } from '@/socket'
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
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main>
            <h1 className='mt-2'>Add Funds</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md'>
                <div>
                    <label htmlFor='amount'>Amount</label>
                    <input type="number" id='amount' placeholder='Amount' {...register('Amount', { validate: validateAmount })} />
                    {errors.Amount && (<span className='errordiv'>{errors.Amount.message}</span>)}
                </div>
                <button
                    id='addFundsConfirmButton'
                    disabled={!!errors.Amount}
                    className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:text-white rounded-lg disabled:bg-gray-600">
                    Add Funds
                </button>
                <ErrorComponent />
            </form>
        </main>
    )
}

export default AddFundsPage