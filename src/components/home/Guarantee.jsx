import { BadgeCheck, CalendarCheck, PackageOpen, Info, TrainTrackIcon, TruckElectricIcon, TruckIcon } from "lucide-react";

export default function Guarantee() {
  const Guarantees = [
    {
      icon: <BadgeCheck className="h-8 w-8" />,
      title: "Premium Materials",
      text: "Crafted for safety, built to last",
    },
    {
      icon: <CalendarCheck className="h-8 w-8" />,
      title: "Money-Back Guarantee",
      text: "30 day return policy*",
    },
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: "Fast & caring delivery",
      text: "Quick shipping with secure packaging",

    },
    {
      icon: <PackageOpen className="h-8 w-8" />,
      title: "Dedicated Customer Support",
      text: "Product experts on call*",
    },
  ];

  return (
    <section className="bg-lime-200 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Guarantees.map((g) => (
          <div key={g.title} className="flex items-start gap-4">
            {g.icon}
            <div>
              <h3 className="font-semibold">{g.title}</h3>
              <p className="text-sm text-gray-700">{g.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* มุมขวา Info icon */}
      <div className="absolute top-4 right-4">
        <Info className="h-5 w-5" />
      </div>
    </section>
  );
}
