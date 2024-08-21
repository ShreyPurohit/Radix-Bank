'use client'

import { useRef } from "react"
import { Provider } from "react-redux"
import { AppStore, centralStore } from "@/lib/store/store"
import { alreadyLoggedIn } from "@/lib/store/features/users/usersApi"

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
        storeRef.current = centralStore()
        storeRef.current.dispatch(alreadyLoggedIn())
    }
    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}

export default StoreProvider