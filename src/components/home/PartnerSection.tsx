import React from "react";
import { partnerLogos } from "@/data/mockData";

export function PartnerSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Our Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            We collaborate with industry leaders and top organizations to bring you the best opportunities.
          </p>
        </div>

        <div className="rounded-xl border border-primary/10 bg-card/50 backdrop-blur-md overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 items-center justify-items-center">
            {partnerLogos.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 flex items-center justify-center h-10 sm:h-14 w-full"
              >
                <PartnerLogo name={partner.name} logo={partner.logo} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerLogo({ name, logo }: { name: string; logo: string }) {
  const [error, setError] = React.useState(false);
  if (error || !logo) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground font-semibold text-sm sm:text-base">
        <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">
          {name.charAt(0)}
        </div>
        {name}
      </div>
    );
  }
  return (
    <img
      src={logo}
      alt={name}
      className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity dark:invert dark:opacity-60 dark:hover:opacity-90"
      onError={() => setError(true)}
    />
  );
}
