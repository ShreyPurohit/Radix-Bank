'use client'

import { useAppSelector } from "@/lib/store/hooks"
import { useEffect, useState } from 'react';

const WalletPage = () => {
    const { loading, myBalance, myWalletBalance } = useAppSelector((state) => state.users);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) { return null }

    const renderWalletBalance = () => {
        if (loading) {
            return <h1>Loading...</h1>;
        }

        if (myWalletBalance <= 0 || myWalletBalance == null) {
            return <span className="not-italic text-stone-600">Wallet not found for the employee.</span>;
        }

        return <span className="not-italic text-green-500">Wallet Balance:{myWalletBalance}</span>;
    };

    const renderAccountBalance = () => {
        if (myBalance <= 0 || myBalance == null) {
            return <span className="not-italic text-stone-600">Account Balance:0</span>;
        }

        return <span className="not-italic text-stone-600">Account Balance:{myBalance}</span>;
    };

    return (
        <div className="flex flex-col md:w-1/2 m-auto p-5 gap-5 md:mt-5 border border-black drop-shadow-md text-center">
            <h1>Wallet Balance</h1>
            <p id="walletbalance">
                {renderWalletBalance()}
            </p>
            <p id="accountbalance">
                {renderAccountBalance()}
            </p>
        </div>
    );
}

export default WalletPage;