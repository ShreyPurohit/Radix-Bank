'use client'

import { logoutUsersApi } from "@/lib/store/features/users/usersApi";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const LogoutComponent = () => {
    const { loggedInUser } = useAppSelector((state) => state.users)
    const router = useRouter();
    const dispatch = useAppDispatch()

    const handleLogout = async () => {
        const toastID = toast.loading("Logging Out...")
        const resultAction = await dispatch(logoutUsersApi())
        if (logoutUsersApi.fulfilled.match(resultAction)) {
            toast.success("Logged Out Successfully", { id: toastID })
        }
        router.push('/login');
    };
    return (
        <>
            {
                loggedInUser
                    ?
                    <button id="btnlogout" onClick={handleLogout}>
                        LOGOUT USER
                    </button>
                    :
                    <Link href={"/login"}>Login</Link>
            }
        </>
    )
}

export default LogoutComponent