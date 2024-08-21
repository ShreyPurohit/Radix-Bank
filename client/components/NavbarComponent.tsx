import Link from "next/link"
import LogoutComponent from "./LogoutComponent"

const NavBarComponent = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href={"/wallet"}>Wallet Balance</Link>
                </li>
                <li>
                    <Link href={"/wallet/add-funds"}>
                        Add Funds
                    </Link>
                </li>
                <li>
                    <Link href={"/wallet/send-money"}>
                        Send Money
                    </Link>
                </li>
                <li>
                    <Link href={"/wallet/transaction-history"}>
                        Transaction History
                    </Link>
                </li>
                <li>
                    <LogoutComponent />
                </li>
            </ul>
        </nav>
    )
}

export default NavBarComponent