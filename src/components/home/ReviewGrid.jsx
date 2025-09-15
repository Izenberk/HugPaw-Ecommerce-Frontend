import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function ReviewGrid({
  title = "Review",
  subtitle = "Check out what our HugPaw Community has to say",
  items = [],
}) {
  return (
    <section>
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-12 md:py-16">
        {/* Heading + subheading */}
        <div className="mb-6 md:mb-8 flex flex-col items-center text-center gap-2">
          <h1 className="title-text">{title}</h1>
          {subtitle ? (
            <p className="subtitle-text">{subtitle}</p>
          ) : null}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((r) => {
            const rating = Math.max(0, Math.min(5, Number(r.stars) || 0));
            const initials = (r.name || "U")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Card key={r.id} className="rounded-2xl h-full">
                <CardContent className="p-5 md:p-6 flex flex-col gap-3">
                  {/* Author + Name + Stars */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={r.avatarUrl} alt={r.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {r.name}
                      </div>
                      {r.role ? (
                        <div className="text-xs text-muted-foreground truncate">
                          {r.role}
                        </div>
                      ) : null}
                      {/* Stars */}
                      <div
                        className="flex items-center gap-0.5 mt-1"
                        aria-label={`Rating: ${rating} out of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            strokeWidth={2}
                            className={
                              i < rating
                                ? "text-muted-foreground/70 fill-current"
                                : "text-muted-foreground/30"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed text-foreground/90 line-clamp-6">
                    “{r.quote}”
                  </p>

                  {/* Review image */}
                  {r.imageSrc ? (
                    <img
                      src={r.imageSrc}
                      alt={r.imageAlt || `Review from ${r.name}`}
                      className="mt-3 w-full rounded-lg object-cover aspect-[4/3]"
                    />
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
