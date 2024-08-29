import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { ITransactions } from "@/lib/interfaces";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!

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
            const { user: { bankBalance, id, password, username, walletBalance } } = await response.json()

            return { bankBalance, id, password, username, walletBalance }
        } catch (error: any) {
            return rejectWithValue({ message: error.message })
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
            const { payment, total }: { payment: number, total: number } = await response.json()

            return { payment, total }
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
            const { amount } = await response.json()
            return amount
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const getMyTransactions = createAsyncThunk(
    'users/myTransactions',
    async ({ page, limit }: { page: number, limit: number }, { rejectWithValue, getState }) => {
        const state = getState() as RootState
        let { loggedInUser } = state.users
        try {
            const response = await fetch(`${backendUrl}myTransactions?page=${page}&limit=${limit}`, { method: "POST", credentials: 'include', body: loggedInUser?.split(' ')[0] })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { myTransactions, totalTransactions, totalPages, currentPage } = await response.json()
            return { myTransactions, totalTransactions, totalPages, currentPage } as { myTransactions: ITransactions[], totalTransactions: number, totalPages: number, currentPage: number }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const walletDetailsApi = createAsyncThunk(
    'users/mywallet',
    async (thunkApi, { rejectWithValue, getState }) => {
        const state = getState() as RootState
        const { loggedInUser } = state.users
        try {
            const response = await fetch(`${backendUrl}mywallet`, { method: "POST", credentials: 'include', body: loggedInUser?.split(' ')[0] })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
            const { bankBalance, walletBalance } = await response.json()
            return { bankBalance, walletBalance } as { bankBalance: number, walletBalance: number }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const logoutUsersApi = createAsyncThunk(
    'users/logoutUser',
    async (thunkApi, { rejectWithValue, getState }) => {
        try {
            const response = await fetch('http://localhost:4000/logout', { credentials: 'include' })
            if (response.status.toString().includes('4')) {
                const { message } = await response.json()
                throw new Error(message);
            }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)


export { alreadyLoggedIn, loginUserApi, logoutUsersApi, addToWalletApi, getUserNameAndIDApi, sendMoneyApi, getMyTransactions, walletDetailsApi }