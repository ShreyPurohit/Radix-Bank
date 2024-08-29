import { IUserState } from "@/lib/interfaces";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { addToWalletApi, alreadyLoggedIn, getMyTransactions, loginUserApi, sendMoneyApi, walletDetailsApi } from "./usersApi";

const extraReducers = (builder: ActionReducerMapBuilder<IUserState>) => {
    // Checking And Updating Already Logged In User On Refresh----------------------------  
    builder.addCase(alreadyLoggedIn.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.loggedInUser = `${action.payload.username} ${action.payload.id}`
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
        state.loggedInUser = `${action.payload.user.Username} ${action.payload.user.Id}`
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
        state.myWalletBalance = action.payload!.payment
        state.myBalance = action.payload!.total
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
        state.myWalletBalance = action.payload
    })
    builder.addCase(sendMoneyApi.pending, (state) => {
        state.loading = true
    })
    builder.addCase(sendMoneyApi.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Add To Wallet"
    })

    // Fetch Transactions API-------------------------------------
    builder.addCase(getMyTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.myTransactions = action.payload.myTransactions
        state.currentPage = action.payload.currentPage
        state.totalPages = action.payload.totalPages
        state.totalTransactions = action.payload.totalTransactions
    })
    builder.addCase(getMyTransactions.pending, (state) => {
        state.loading = true
    })
    builder.addCase(getMyTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Fetch My Transactions"
    })

    // Update Wallet Details
    builder.addCase(walletDetailsApi.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.myBalance = action.payload.bankBalance
        state.myWalletBalance = action.payload.walletBalance
    })
    builder.addCase(walletDetailsApi.pending, (state) => {
        state.loading = true
    })
    builder.addCase(walletDetailsApi.rejected, (state, action) => {
        state.loading = false
        state.error = String(action.payload) || "Failed To Fetch My Wallet Details"
    })
}

export default extraReducers