import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HeroSplit({
  title,
  subtitle,
  cta,
  imageSrc,
  imageAlt,
}) {
  const renderTitle = () => {
    if (Array.isArray(title)) {
      return (
        <span className="space-y-1 md:space-y-2">
          {title.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </span>
      );
    }
    return title;
  };

  return (
    <section
      className="flex items-center"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MOBILE image */}
          <div className="block lg:hidden w-full h-auto object-cover">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* TEXT */}
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              {renderTitle()}
            </h1>
            {subtitle ? (
              <p className="mt-3 text-muted-foreground max-w-prose">
                {subtitle}
              </p>
            ) : null}
            {cta?.href && cta?.label ? (
              <div className="mt-6">
                <Link
              to="/catalog"
              className="inline-flex items-center rounded-full px-5 py-2
                         bg-blue-600 text-white font-medium transition-all duration-300
                         hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600"
            >
              Discover Now
            </Link>
              </div>
            ) : null}
          </div>

          {/* DESKTOP image  */}
          <div className="hidden lg:block px-6 py-10">
            <div className="h-[360px] md:h-[420px] rounded-xl overflow-hidden">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
