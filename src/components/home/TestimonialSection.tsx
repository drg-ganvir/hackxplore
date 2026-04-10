import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { testimonialsData } from "@/data/mockData";

export function TestimonialSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Hear from students and professionals who found opportunities through HackXplore.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonialsData.map((t) => (
            <Card key={t.id} className="border-primary/20 overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-shadow duration-300 bg-card/60">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="relative mb-3">
                  <Quote className="h-7 w-7 text-primary/20 absolute -top-1 -left-1" />
                  <p className="italic text-sm text-muted-foreground pt-5 line-clamp-4">{t.text}</p>
                </div>
                <div className="mt-auto pt-4 flex items-center gap-3 border-t border-border/50">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={t.image} alt={t.name} />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role}{t.company ? `, ${t.company}` : ""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
