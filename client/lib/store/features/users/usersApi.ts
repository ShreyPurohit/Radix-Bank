import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ITransactions } from "@/lib/interfaces";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const loginUserApi = createAsyncThunk(
    'users/login',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendUrl}login`, { method: "POST", body: formData, credentials: 'include' })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { user, bankBalance, walletBalance } = await response.json()

            if (!user) throw new Error('Invalid user/password')
            return { user, bankBalance, walletBalance } as { user: { Username: string, Id: string }, bankBalance: number, walletBalance: number }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const alreadyLoggedIn = createAsyncThunk(
    'users/alreadyLoggedIn',
    async (thunkApi, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendUrl}alreadyloggeduser`, { credentials: 'include' })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { user } = await response.json()
            console.log('user', user);

            return user
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const logoutUsersApi = createAsyncThunk(
    'users/logoutUser',
    async (thunkApi, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            let { loggedInUser } = state.users
            const response = await fetch('http://localhost:4000/logout', { credentials: 'include' })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            if (response.ok) {
                loggedInUser = null
            } else {
                console.error('Failed to log out');
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const addToWalletApi = createAsyncThunk(
    'users/addtoWallet',
    async (formData: FormData, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            let { loggedInUser } = state.users
            if (!loggedInUser) return
            formData.append("user", loggedInUser.split(' ')[0])
            const response = await fetch(`${backendUrl}addToWallet`, { credentials: 'include', method: "POST", body: formData })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { payment, total } = await response.json()
            return { payment, total } as { payment: number, total: number }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const getUserNameAndIDApi = createAsyncThunk(
    'users/nameID',
    async (thunkApi, { rejectWithValue }) => {
        try {
            const response = await fetch(`${backendUrl}usernamelist`, { credentials: "include" })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { userlist } = await response.json()

            return userlist
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const sendMoneyApi = createAsyncThunk(
    'users/sendMoney',
    async (formData: FormData, { rejectWithValue, getState }) => {
        try {
            const state = getState() as RootState
            let { loggedInUser } = state.users
            if (!loggedInUser) return
            formData.append("user", loggedInUser.split(' ')[0])
            const response = await fetch(`${backendUrl}sendMoney`, { credentials: 'include', body: formData, method: "POST" })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { message, amount } = await response.json()
            return amount
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const getMyTransactions = createAsyncThunk(
    'users/myTransactions',
    async (thunkApi, { rejectWithValue, getState }) => {
        const state = getState() as RootState
        let { loggedInUser } = state.users
        try {
            const response = await fetch(`${backendUrl}myTransactions`, { method: "POST", credentials: 'include', body: loggedInUser?.split(' ')[0] })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { myTransactions } = await response.json()
            return myTransactions as ITransactions[]
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

export { alreadyLoggedIn, loginUserApi, logoutUsersApi, addToWalletApi, getUserNameAndIDApi, sendMoneyApi, getMyTransactions }