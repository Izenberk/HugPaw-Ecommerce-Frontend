import { Outlet } from "react-router-dom"
import Navbar from "../components/common/Navbar/Navbar"
import Footer from "../components/common/Footer/Footer"



const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <div className="flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout