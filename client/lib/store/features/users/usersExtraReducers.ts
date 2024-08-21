import { alreadyLoggedIn, loginUserApi, addToWalletApi, sendMoneyApi } from "./usersApi";
import { IUserState } from "./userSlice";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

const extraReducers = (builder: ActionReducerMapBuilder<IUserState>) => {
    // Checking And Updating Already Logged In User On Refresh----------------------------  
    builder.addCase(alreadyLoggedIn.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.loggedInUser = `${action.payload.username}`
        state.myBalance = action.payload.bankBalance
        state.myWalletBalance = action.payload.walletBalance
    })
    builder.addCase(alreadyLoggedIn.pending, (state) => {
        state.loading = true
    })
    builder.addCase(alreadyLoggedIn.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Fetch Already Logged In User"
    })

    // Login User Api----------------------------  
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.loggedInUser = `${action.payload.user.Username}`
        state.myBalance = action.payload.bankBalance
        state.myWalletBalance = action.payload.walletBalance
    })
    builder.addCase(loginUserApi.pending, (state) => {
        state.loading = true
    })
    builder.addCase(loginUserApi.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Login User"
    })

    // Add To Wallet Api--------------------------------
    builder.addCase(addToWalletApi.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.myWalletBalance = action.payload
        state.myBalance -= action.payload
    })
    builder.addCase(addToWalletApi.pending, (state) => {
        state.loading = true
    })
    builder.addCase(addToWalletApi.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Add To Wallet"
    })

    // Send Money API-------------------------------------
    builder.addCase(sendMoneyApi.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
    })
    builder.addCase(sendMoneyApi.pending, (state) => {
        state.loading = true
    })
    builder.addCase(sendMoneyApi.rejected, (state, action) => {
        debugger
        state.loading = false
        state.error = String(action.payload) || "Failed To Add To Wallet"
    })
}

export default extraReducers