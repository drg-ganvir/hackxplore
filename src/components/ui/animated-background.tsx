
import { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 30;
    
    // Clean up existing particles
    const existingParticles = container.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Set random size, position and opacity
      const size = Math.random() * 10 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
      
      // Set animation
      particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite alternate`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(particle);
    }
  }, []);

  return (
    <div ref={containerRef} className="animated-bg relative min-h-screen">
      {children}
    </div>
  );
}
