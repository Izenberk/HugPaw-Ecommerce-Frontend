import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ReviewGrid({ title, items }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((r) => (
          <Card key={r.id} className="h-full">
            <CardContent className="p-6">
              <div className="text-xs mb-2">★★★★★</div>
              <p className="text-sm">“{r.quote}”</p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={r.avatarUrl} />
                  <AvatarFallback>{r.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{r.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
