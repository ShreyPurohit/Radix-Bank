import { createSlice } from "@reduxjs/toolkit";
import extraReducers from "./usersExtraReducers";
import { IUserState } from "@/lib/interfaces";

const initialState: IUserState = {
    loggedInUser: null,
    loading: false,
    error: null,
    myBalance: 0,
    myWalletBalance: 0,
    myTransactions: []
}

export const userSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {},
    extraReducers
})

export const { } = userSlice.actions
export default userSlice.reducer