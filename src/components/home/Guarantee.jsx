const Guarantees = () => {
  const items = [
    {
      id: "materials",
      icon: "✅", // จะใช้ react-icons ก็ได้
      title: "Premium Materials",
      desc: "Crafted for safety, built to last",
    },
    {
      id: "moneyback",
      icon: "📅",
      title: "Money-Back Guarantee",
      desc: "30 day return policy*",
    },
    {
      id: "support",
      icon: "📞",
      title: "Dedicated Customer Support",
      desc: "Product experts on call*",
    },
  ];

  return (
    <section className="w-full bg-[#818cf8] rounded-2xl ring-1 ring-black/10 p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-3 text-black">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-black/70">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guarantees;
