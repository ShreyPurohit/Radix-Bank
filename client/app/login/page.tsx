'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { loginUserApi } from '@/lib/store/features/users/usersApi'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ILoginInputs {
    username: string,
    password: string
}

const LoginPage = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { error, loading, loggedInUser } = useAppSelector((state) => state.users)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ILoginInputs>({ mode: 'all' })

    const onSubmit: SubmitHandler<ILoginInputs> = async (data: ILoginInputs) => {
        const formData = new FormData()
        formData.append('Username', data.username)
        formData.append('Password', data.password)
        try {
            const toastID = toast.loading("Logging In...")
            const resultAction = await dispatch(loginUserApi(formData))
            if (loginUserApi.fulfilled.match(resultAction)) {
                toast.success("Logged In Successfully", { id: toastID })
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

    return (
        <main className="md:w-3/4 m-auto md:h-0">
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 md:border border-black drop-shadow-md">
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id='username' placeholder='User Name' {...register('username', { required: { value: true, message: "Username is required" } })} />
                    {errors.username && (<span id="usernameErr"> {errors.username.message} </span>)}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' placeholder='Password' {...register('password', { required: { value: true, message: "Password is required" } })} />
                    {errors.password && (<span id="passwordErr"> {errors.password.message} </span>)}
                </div>
                <button id='btnSubmit' disabled={errors.username || errors.password ? true : false} className="px-4 py-2 bg-slate-400 hover:bg-slate-600 hover:transition hover:text-white rounded-lg disabled:bg-gray-600 disabled:hover:bg-gray-600">Login</button>
            </form>
        </main>
    )
}

export default LoginPage