'use client'

import { useAppSelector } from "@/lib/store/hooks"

const WalletPage = () => {
    const { loading, myBalance, myWalletBalance } = useAppSelector((state) => state.users)

    return (
        <>
            <h1>Wallet Balance</h1>
            <div className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 border border-black drop-shadow-md text-center">
                {loading ? <h1>Loading...</h1> :
                    <>
                        <p id="walletbalance">
                            {myWalletBalance <= 0 || myWalletBalance === null || myWalletBalance === undefined ? (
                                <span className="not-italic text-stone-600">Wallet not found for the employee.</span>
                            ) : (
                                <span className="not-italic text-green-500">Wallet Balance:{myWalletBalance}</span>
                            )}
                        </p>
                        <p id="accountbalance">
                            {myBalance <= 0 || myBalance === null || myBalance === undefined ? (
                                <span className="not-italic text-stone-600">Account Balance:0</span>
                            ) : (
                                <span className="not-italic text-stone-600">Account Balance:{myBalance}</span>
                            )}
                        </p>
                    </>
                }
            </div>
        </>
    );
}

export default WalletPage