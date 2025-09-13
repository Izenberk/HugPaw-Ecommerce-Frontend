import { Outlet, ScrollRestoration } from "react-router-dom";
import Topbar from "../components/common/Topbar/Topbar";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import { ToastViewport } from "@/lib/toast";

const Layout = () => {
  return (
    <div className="">
      <header>
        <Topbar />
        <Navbar />
      </header>

      {/* Push content below (Topbar + Navbar height) */}
      <main className="flex-1 pt-[120px] md:px-[100px]">
        <ScrollRestoration />
        <Outlet />
      </main>

      <Footer />
      <ToastViewport />
    </div>
  );
};

export default Layout;
