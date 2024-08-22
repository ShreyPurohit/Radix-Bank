import { IUserState } from "@/lib/interfaces";
import { createSlice } from "@reduxjs/toolkit";
import extraReducers from "./usersExtraReducers";

const initialState: IUserState = {
    loggedInUser: null,
    loading: false,
    error: null,
    myBalance: 0,
    myWalletBalance: 0,
    myTransactions: [],
    totalTransactions: 0,
    totalPages: 0,
    currentPage: 1,
}

export const userSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {},
    extraReducers
})

export const { } = userSlice.actions
export default userSlice.reducer