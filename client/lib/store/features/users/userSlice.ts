import { createSlice } from "@reduxjs/toolkit";
import extraReducers from "./usersExtraReducers";

export interface IUserState {
    loggedInUser: string | null,
    loading: boolean,
    error: string | null,
    myBalance: number,
    myWalletBalance: number
}

const initialState: IUserState = {
    loggedInUser: null,
    loading: false,
    error: null,
    myBalance: 0,
    myWalletBalance: 0
}

export const userSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {},
    extraReducers
})

export const { } = userSlice.actions
export default userSlice.reducer