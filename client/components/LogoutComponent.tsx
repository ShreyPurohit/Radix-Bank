'use client'

import { logoutUsersApi } from "@/lib/store/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const LogoutComponent = () => {
    const { loggedInUser } = useAppSelector((state) => state.users)
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = async () => {
        const toastID = toast.loading("Logging Out...");
        const resultAction = await dispatch(logoutUsersApi());
        if (logoutUsersApi.fulfilled.match(resultAction)) {
            toast.success("Logged Out Successfully", { id: toastID });
        }
        router.push('/login');
    };

    if (!isClient) return null;

    return (
        <>
            {
                loggedInUser
                    ? <button id="btnlogout" onClick={handleLogout}>LOGOUT USER</button>
                    : <Link href={"/login"}>Login</Link>
            }
        </>
    );
};

export default LogoutComponent;