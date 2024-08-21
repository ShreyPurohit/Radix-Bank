import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/users/userSlice'

export const centralStore = () => {
    return configureStore({
        reducer: {
            users: userReducer
        }
    })
}

export type AppStore = ReturnType<typeof centralStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']