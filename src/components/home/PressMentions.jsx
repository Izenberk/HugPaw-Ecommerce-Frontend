import Marquee from "react-fast-marquee";
import { PawPrint, Newspaper, Tv, Radio } from "lucide-react"; // 👈 import icons

export default function PressMentions() {
  const pressItems = [
    {
      id: "Pet-Lover",
      logo: "PET-LOVER",
      icon: PawPrint, // 👈 ใส่ icon component
      quote: "A must-have brand for owners who truly care about their furry friends.",
    },
    {
      id: "Modern Living",
      logo: "MODERN LIVING",
      icon: Tv,
      quote: "Their feeders and collars combine functionality with modern style.",
    },
    {
      id: "sundaytimes",
      logo: "THE SUNDAY TIMES",
      icon: Newspaper,
      quote: "I was less inclined to doomscroll and felt more productive.",
    },
    {
      id: "Tech4Pets",
      logo: "TECH4PETS",
      icon: Radio,
      quote: "Innovative solutions for pet care that every pet owner should know about.",
    },
  ];

  return (
    <section className="bg-[#e5eaff] w-full py-8 sm:py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Marquee
          pauseOnHover
          gradient
          gradientColor={[247, 250, 238]}
          gradientWidth={80}
          speed={40}
        >
          {pressItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="mx-12 w-[250px] sm:w-[300px] text-center"
              >
                <div className="mb-3 flex items-center justify-center gap-2">
                  {Icon && <Icon className="h-6 w-6 text-gray-700" />}
                  <span className="block font-semibold text-md sm:text-xl tracking-tight">
                    {item.logo}
                  </span>
                </div>
                <p className="text-neutral-800 text-base sm:text-md leading-snug">
                  {item.quote}
                </p>
              </div>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}