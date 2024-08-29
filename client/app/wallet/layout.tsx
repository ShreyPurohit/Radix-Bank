import NavBarComponent from "@/components/NavbarComponent";
import NotificationComponent from "@/components/NotificationComponent";

const WalletLayoutPage = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="md:w-3/4 m-auto h-screen border bg-slate-50">
            <nav className="border-double border-b-4 border-b-slate-500 bg-stone-100 mt-2"> <NavBarComponent /> </nav>
            <section>
                <NotificationComponent />
                {children}
            </section>
        </main>
    );
};

export default WalletLayoutPage;
