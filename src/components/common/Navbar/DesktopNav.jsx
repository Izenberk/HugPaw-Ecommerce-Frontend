import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import UserNav from "@/components/common/Navbar/UserNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false); // <- ใหม่
  const lastY = useRef(0);

  useEffect(() => {
    const THRESHOLD = 500; // เลื่อนลงเกินเท่านี้ค่อยเริ่มซ่อน

    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 10);

      // ถ้าเลื่อนลงและเกิน threshold -> ซ่อน
      if (y > lastY.current && y > THRESHOLD) {
        setHidden(true);
      } else {
        // เลื่อนขึ้น หรืออยู่ใกล้บนสุด -> โชว์
        if (y < lastY.current || y < 10) setHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 z-40",
        // ขยับตำแหน่งใต้ Topbar เหมือนเดิม
        scrolled ? "top-2" : "top-[32px] md:top-[40px]",
        // ซ่อน/โชว์ด้วยแอนิเมชัน
        "transition-[top,transform,opacity] duration-300 will-change-transform",
        hidden ? "-translate-y-[120%] opacity-0 pointer-events-none" : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      {/* safe area (iOS notch) + spacing */}
      <div className="pointer-events-none h-2 md:h-4 pt-[env(safe-area-inset-top)]" />

      {/* PILL CONTAINER */}
      <div
        className={[
          "mx-auto w-full max-w-6xl px-2 md:px-4 transition-all duration-300",
          !scrolled
            ? "rounded-none bg-transparent backdrop-blur-0 ring-0 shadow-none"
            : "rounded-full bg-white supports-[backdrop-filter]:bg-white/60 backdrop-blur-md ring-1 ring-black/10 shadow-lg",
        ].join(" ")}
      >
        {/* NAV ROW */}
        <div
          className={[
            "flex items-center gap-6 transition-all duration-300",
            scrolled ? "h-14 px-3" : "h-16 px-0",
          ].join(" ")}
        >
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <Link to="/" aria-label="Home" className="inline-flex items-center">
              <Logo className="block h-8 w-auto align-middle" />
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

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            {/* <SearchBox className="hidden xl:block w-64" /> */}
            <UserNav />
            <Link
              to="/catalog"
              className="inline-flex items-center rounded-full px-5 py-2
                         bg-blue-600 text-white font-medium transition-all duration-300
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
