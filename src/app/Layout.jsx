import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Fixed navbar on top */}
        <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur border-b">
            <Navbar />
        </header>

        {/* Push content below the fixed navbar (adjust pt-14 to your navbar height) */}
        <main className="flex-1 pt-[80px] md:px-[100px]">
            {/* Scroll restoration (back/forward = restore; new nav can pair with TopOnNavigate below) */}
            <ScrollRestoration/>
            <Outlet />
        </main>

        <Footer />
        </div>
    );
};

export default Layout;