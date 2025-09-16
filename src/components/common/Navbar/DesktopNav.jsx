import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Logo from "@/components/common/Logo";
import UserNav from "@/components/common/Navbar/UserNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {

    const THRESHOLD = 200;
    const diff = y - lastY.current;

    setScrolled(y > 10);

    if (y > THRESHOLD && diff > 0) {
      // เลื่อนลงเกิน threshold → ซ่อน
      setHidden(true);
    } else if (diff < 0 && y < THRESHOLD) {
      // เลื่อนขึ้น → โชว์กลับมา
      setHidden(false);
    }

    lastY.current = y;
  });

  return (
    <motion.div
      initial={false}
      animate={hidden ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={[
        "fixed inset-x-0 z-40",
        scrolled ? "top-2" : "top-[32px] md:top-[40px]",
      ].join(" ")}
    >
      {/* safe area */}
      <div className="pointer-events-none h-2 md:h-4 pt-[env(safe-area-inset-top)]" />

      {/* container */}
      <div
        className={[
          "mx-auto w-full max-w-6xl px-2 md:px-4",
          !scrolled
            ? "rounded-none bg-transparent backdrop-blur-0 ring-0 shadow-none"
            : "rounded-full bg-white ring-1 ring-black/10 shadow-lg",
        ].join(" ")}
      >
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
                  <Link to="/catalog">Products</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            <UserNav />
            <div className="w-2" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
