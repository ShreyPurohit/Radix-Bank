'use client'
 
import { walletDetailsApi } from "@/lib/store/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
 
const NotificationComponent = () => {
    const dispatch = useAppDispatch();
    const { loggedInUser, error } = useAppSelector((state) => state.users);
    const [notification, setNotification] = useState<string | null>(null);
 
    useEffect(() => {
        if (loggedInUser) {
            const room = loggedInUser.split(' ')[1];
            socket.emit('join room', { to: room });
        }
    }, [loggedInUser]);
 
    useEffect(() => {
        const handleNotification = (message: string) => {
            setNotification(message);
            setTimeout(() => setNotification(null), 5000);
        };
 
        socket.on('personal-notification', handleNotification);
        socket.on('reciever-notification', handleNotification);
 
        return () => {
            socket.off('personal-notification', handleNotification);
            socket.off('reciever-notification', handleNotification);
        };
    }, []);
 
    useEffect(() => {
        const fetchWalletDetails = async () => {
            try {
                await dispatch(walletDetailsApi());
            } catch (err) {
                console.error("Failed to fetch wallet details", err);
            }
        };
 
        if (notification) {
            fetchWalletDetails();
        }
    }, [notification, dispatch]);
 
    useEffect(() => {
        if (error) {
            setNotification(error);
            setTimeout(() => setNotification(null), 5000);
        }
    }, [error]);
 
    return (
        <>
            {notification && (
                <div id="notification" className="w-full py-3 text-xl text-center bg-blue-300">
                    {notification}
                </div>
            )}
        </>
    );
};
 
export default NotificationComponent;