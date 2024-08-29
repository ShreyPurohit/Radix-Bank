'use client'

import { walletDetailsApi } from "@/lib/store/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

const NotificationComponent = () => {
    const dispatch = useAppDispatch()
    const { loggedInUser, error } = useAppSelector((state) => state.users)
    const [notification, setNotification] = useState<string | null>(null)

    useEffect(() => {
        socket.emit('join room', { to: loggedInUser?.split(' ')[1] })
    }, [loggedInUser])

    useEffect(() => {
        socket.on('personal-notification', (message) => {
            setNotification(message)
            setTimeout(() => setNotification(null), 5000)
        })
        socket.on('reciever-notification', (message) => {
            setNotification(message)
            setTimeout(() => setNotification(null), 5000)
        })
        return () => {
            socket.off('personal-notification')
            socket.off('reciever-notification')
        }
    }, [])

    useEffect(() => {
        const fetchMyWalletDetails = async () => { await dispatch(walletDetailsApi()) }
        fetchMyWalletDetails()
    }, [notification])

    useEffect(() => {
        setNotification(error)
        setTimeout(() => { setNotification(null) }, 5000);
    }, [error])

    return (
        <>
            {notification && <div id='notification' className="w-full py-3 text-xl text-center bg-blue-300">{notification}</div>}
        </>
    )
}

export default NotificationComponent