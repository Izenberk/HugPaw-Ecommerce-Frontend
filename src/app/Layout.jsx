import { Outlet, ScrollRestoration } from "react-router-dom";
import Topbar from "../components/common/Topbar/Topbar";
import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";
import BackToTop from "@/components/common/BackToTop";
import { ToastViewport } from "@/lib/toast";

const Layout = () => {
  return (
    <div className="">
      <header>
        <Topbar />
        <Navbar />
      </header>

      {/* Push content below (Topbar + Navbar height) */}
      <main className="pt-[96px] md:pt-[100px]">
        <ScrollRestoration />
        <Outlet />
      </main>

      <Footer />
      <ToastViewport />
      <BackToTop />
    </div>
  );
};

export default Layout;
