'use client'

import { useRef } from "react"
import { Provider } from "react-redux"
import { AppStore, centralStore } from "@/lib/store/store"
import { alreadyLoggedIn } from "@/lib/store/features/users/usersApi"

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        storeRef.current = centralStore()
        const getLoginUser = async () => {
            try {
                const resultAction = await storeRef.current?.dispatch(alreadyLoggedIn())
                if (alreadyLoggedIn.fulfilled.match(resultAction)) {
                    console.log("Found Logged In User");
                }
            } catch (error: any) {
                console.log("No User Logged In");
                console.log(error.message)
            }
        }
        getLoginUser()
    }

    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}

export default StoreProvider