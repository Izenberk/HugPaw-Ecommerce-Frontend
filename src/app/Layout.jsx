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
      <main className="pt-6 md:pt-[30px]">
        <ScrollRestoration />
        {/* <div style={{ width: "1000px" }} >xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br /> xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br />xxx<br /></div> */}
        <Outlet />
      </main>

      <Footer />
      <ToastViewport />
      <BackToTop />
    </div>
  );
};

export default Layout;
