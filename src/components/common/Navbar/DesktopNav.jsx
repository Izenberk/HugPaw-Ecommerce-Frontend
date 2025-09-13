import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import SearchBox from "@/components/common/Navbar/SearchBox";
import UserNav from "@/components/common/Navbar//UserNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 z-40 transition-[top] duration-300
      ${scrolled ? "top-2" : "top-[32px] md:top-[40px]"}`}
    >
      {/* safe area (iOS notch) + spacing */}
      <div className="pointer-events-none h-2 md:h-4 pt-[env(safe-area-inset-top)]" />

      {/* PILL CONTAINER */}
      <div
        className={[
          "mx-auto w-full max-w-6xl px-2 md:px-4 transition-all duration-300",
          // ขณะยังไม่เลื่อน: แบน/ใสไม่มีกรอบ
          !scrolled &&
            "rounded-none bg-transparent backdrop-blur-0 ring-0 shadow-none",
          // เมื่อเลื่อน: ทรง pill + เบลอ + เงา + ขอบบาง
          scrolled &&
            "rounded-full bg-white supports-[backdrop-filter]:bg-white/60 backdrop-blur-md ring-1 ring-black/10 shadow-lg",
        ].join(" ")}
      >
        {/* NAV ROW */}
        <div
          className={[
            "flex h-16 items-center gap-6 transition-all duration-300", // h-16 + items-center ช่วยให้แถวสูงคงที่และจัดกลางแนวตั้ง
            scrolled ? "h-14 px-3" : "px-0",
          ].join(" ")}
        >
          {/* LEFT: Logo + primary nav */}
          <div className="flex items-center gap-6">
            {/* Logo ต้องเป็น block/inline-flex เพื่อไม่เกาะ baseline */}
            <Link to="/" aria-label="Home" className="inline-flex items-center">
              <Logo className="block h-8 w-auto align-middle" />
              {/* ถ้า Logo รับ className ได้ ให้ส่ง block/align-middle เข้าไป */}
            </Link>

            <nav aria-label="Primary" className="hidden md:block self-center">
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    to="/catalog"
                    className="
              relative inline-flex items-center leading-none
              after:content-[''] after:absolute after:left-0 after:-bottom-1
              after:h-[2px] after:w-0 after:bg-current after:transition-[width] after:duration-300
              hover:after:w-full
            "
                  >
                    Products
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* RIGHT: secondary links + CTA / User */}
          <div className="flex items-center gap-6">
            <UserNav />
            <Link
              to="/get-started"
              className="inline-flex items-center rounded-full px-5 py-2
                 bg-blue-500 text-white font-medium leading-none
                 transition-all duration-300
                 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
