import { Outlet } from "react-router-dom"
import Topbar from "@/components/common/Topbar/Topbar";
import Navbar from "../components/common/Navbar/Navbar"
import Footer from "../components/common/Footer/Footer"

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Topbar />
            <Navbar />
            <div className=" flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default Layout