'use client'

import { useAppSelector } from "@/lib/store/hooks";

const WalletPage = () => {
    const { loading, myBalance, myWalletBalance } = useAppSelector((state) => state.users);

    const renderWalletBalance = () => {

        if (myWalletBalance <= 0 || myWalletBalance == null) {
            return <p id="walletbalance" className="text-red-600">Wallet not found for the employee.</p>;
        }

        return <p id="walletbalance" className="text-green-500 text-xl">Wallet Balance:{myWalletBalance}</p>;
    };

    const renderAccountBalance = () => {
        if (myBalance <= 0 || myBalance == null) {
            return <p id="accountbalance" className="text-red-600">Account Balance:0</p>;
        }

        return <p id="accountbalance" className="text-stone-600 text-xl">Account Balance:{myBalance}</p>;
    };

    return (
        <>
            <h1>Wallet Balance</h1>
            <div className="flex flex-col md:w-1/2 lg-w-3/4 m-auto p-5 md:mt-5 border border-black drop-shadow-md text-center gap-5">
                {loading || !myBalance ? <h1>Loading...</h1> :
                    <>
                        <div>
                            {renderWalletBalance()}
                        </div>
                        <div>
                            {renderAccountBalance()}
                        </div>
                    </>
                }
            </div >
        </>
    );
}

export default WalletPage;