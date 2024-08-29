'use client'

import { useAppSelector } from "@/lib/store/hooks"
import { useState, useEffect } from "react"

const ErrorComponent = () => {
    const { error } = useAppSelector((state) => state.users)
    const [errors, setErrors] = useState<string | null>("")

    useEffect(() => {
        if (error) {
            setErrors(error);
            setTimeout(() => setErrors(null), 5000);
        }
    }, [error]);

    return (
        <>
            {errors && (
                <h2 id='errBalance' className="text-center text-2xl text-amber-700 tracking-wide uppercase">
                    {errors}
                </h2>
            )}
        </>
    )
}

export default ErrorComponent