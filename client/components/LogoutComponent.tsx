'use client'

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { logoutUsersApi } from "@/lib/store/features/users/usersApi";

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
            {loggedInUser
                ?
                <button id="logoutBtn" onClick={handleLogout}>
                    LOGOUT USER
                </button>
                :
                <Link href={"/login"}>Login</Link>
            }
        </>
    )
}

export default LogoutComponent