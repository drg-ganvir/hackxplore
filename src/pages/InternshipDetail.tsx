
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { internshipsData } from "@/data/mockData";
import { InternshipCard } from "@/types";
import { MovingBubbles } from "@/components/ui/moving-bubbles";

export default function InternshipDetail() {
  const { id } = useParams();
  const [internship, setInternship] = useState<InternshipCard | undefined>(undefined);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (id) {
      const foundInternship = internshipsData.find(internship => internship.id === id);
      setInternship(foundInternship);
    }
  }, [id]);
  
  if (!internship) {
    return (
      <>
        <Navbar />
        <main className="flex-1 container py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Internship Not Found</h1>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the internship you were looking for.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <MovingBubbles />
      <Navbar />
      
      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Internship Details */}
          <div className="md:col-span-1">
            <h1 className="text-3xl font-bold mb-4">{internship.title}</h1>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Company</h2>
              <p>{internship.company}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Location</h2>
              <p>{internship.location}</p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary/10 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>
            
            {/* Deadline information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Application Deadline</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{new Date(internship.applicationDeadline).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            
            {/* Apply Button */}
            <Button asChild className="mt-8 gradient-button">
              <a href={internship.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          
          {/* Internship Description */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p>{internship.description}</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
