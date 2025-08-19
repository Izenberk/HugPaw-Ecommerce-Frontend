import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export default function ReviewGrid({
  title = "Review",
  subtitle = "Check out what our HugPaw Community has to say",
  items = [],
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      {/* Heading + subheading */}
      <div className="mb-4 flex flex-col md:flex-row md:items-baseline md:gap-3 items-center text-center md:text-left">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        {subtitle ? (
          <p className="text-xs md:text-sm text-muted-foreground max-w-md mx-auto md:mx-0">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((r) => {
          const rating = Math.max(0, Math.min(5, Number(r.stars) || 0));
          return (
            <Card key={r.id} className="h-full rounded-2xl">
              <CardContent className="p-4 md:p-6 space-y-3">
                {/* Author + Name */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9">
                    <AvatarImage src={r.avatarUrl} alt={r.name} />
                    <AvatarFallback>
                      {(r.name || "U")
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{r.name}</div>
                    {r.role ? (
                      <div className="text-xs text-muted-foreground">
                        {r.role}
                      </div>
                    ) : null}
                    {/* Stars ใต้ชื่อ */}
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed">“{r.quote}”</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
