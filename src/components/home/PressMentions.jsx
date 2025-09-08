import Marquee from "react-fast-marquee";

export default function PressMentions() {
  const pressItems = [
    {
      id: "uncrate",
      logo: "uncrate",
      quote: "Proven, high-impact formula.",
    },
    {
      id: "cosmopolitan",
      logo: "COSMOPOLITAN",
      quote:
        "Thanks to its smart packaging, the formula stays in tip-top shape for longer.",
    },
    {
      id: "sundaytimes",
      logo: "THE SUNDAY TIMES",
      quote:
        "I was less inclined to doomscroll and felt more productive.",
    },
    {
      id: "standard",
      logo: "THE STANDARD",
      quote: "The best super supplements to take!",
    },
  ];

  return (
    <section className="w-full bg-[#F7FAEE] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Marquee
          pauseOnHover
          gradient={true}
          gradientColor={[247, 250, 238]}
          gradientWidth={80}
          speed={40}
        >
          {pressItems.map((item) => (
            <div
              key={item.id}
              className="mx-12 w-[250px] sm:w-[300px] text-center"
            >
              <div className="mb-3">
                <span className="block font-semibold text-xl sm:text-2xl tracking-tight">
                  {item.logo}
                </span>
              </div>
              <p className="text-neutral-800 font-medium text-base sm:text-lg leading-snug">
                {item.quote}
              </p>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
