import { useEffect, useRef } from "react";

interface BubbleProps {
  numBubbles?: number;
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  colors?: string[];
  opacity?: number;
  frameRate?: number; // Controls animation speed
  floatEffect?: boolean; // Add slight floating effect
}

export function MovingBubbles({
  numBubbles = 20,
  minSize = 20,
  maxSize = 60,
  minSpeed = 0.5,
  maxSpeed = 2,
  colors = ['#674cd7', '#33ccff', '#9b87f5'],
  opacity = 0.2,
  frameRate = 30, // Lower frameRate means slower updates
  floatEffect = true,
}: BubbleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();
    
    // Listen for window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Create bubbles
    const bubbles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      angle?: number; // For float effect
      amplitude?: number; // For float effect
      frequency?: number; // For float effect
      originalX?: number; // For float effect
      originalY?: number; // For float effect
    }[] = [];
    
    for (let i = 0; i < numBubbles; i++) {
      const radius = Math.random() * (maxSize - minSize) + minSize;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      const bubble = {
        x,
        y,
        radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
        speedY: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
      };
      
      // Add float effect properties if enabled
      if (floatEffect) {
        bubble.originalX = x;
        bubble.originalY = y;
        bubble.angle = Math.random() * Math.PI * 2;
        bubble.amplitude = Math.random() * 1.5 + 0.5; // Range: 0.5-2
        bubble.frequency = Math.random() * 0.02 + 0.01; // Range: 0.01-0.03
      }
      
      bubbles.push(bubble);
    }
    
    // Animation loop with controlled frame rate
    const animate = (timestamp: number) => {
      // Control frame rate
      const elapsed = timestamp - lastUpdateRef.current;
      const interval = 1000 / frameRate;
      
      if (elapsed > interval) {
        lastUpdateRef.current = timestamp - (elapsed % interval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw bubbles
        bubbles.forEach((bubble) => {
          if (floatEffect && bubble.originalX !== undefined && bubble.angle !== undefined) {
            // Use sine wave movement for more natural floating motion
            bubble.angle += bubble.frequency!;
            
            // Calculate position with sine wave offset
            bubble.x = bubble.originalX + Math.cos(bubble.angle) * bubble.amplitude! * 10;
            bubble.y = bubble.originalY! + Math.sin(bubble.angle) * bubble.amplitude! * 5;
          } else {
            // Traditional linear movement
           const deltaSeconds = elapsed / 1000; // elapsed time since last update in seconds
            bubble.x += bubble.speedX * deltaSeconds * 60; // 60 is a base multiplier for "normal" feeling
            bubble.y += bubble.speedY * deltaSeconds * 60;
            
            // Bounce off walls with dampened speed
            if (bubble.x < bubble.radius || bubble.x > canvas.width - bubble.radius) {
              bubble.speedX *= -0.95; // Slight dampening for more natural movement
              // Ensure bubble stays in bounds
              if (bubble.x < bubble.radius) bubble.x = bubble.radius;
              if (bubble.x > canvas.width - bubble.radius) bubble.x = canvas.width - bubble.radius;
            }
            
            if (bubble.y < bubble.radius || bubble.y > canvas.height - bubble.radius) {
              bubble.speedY *= -0.95; // Slight dampening
              // Ensure bubble stays in bounds
              if (bubble.y < bubble.radius) bubble.y = bubble.radius;
              if (bubble.y > canvas.height - bubble.radius) bubble.y = canvas.height - bubble.radius;
            }
          }
          
          // Draw bubble
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          
          // Convert opacity to hex
          const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.fillStyle = bubble.color + opacityHex;
          ctx.fill();
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [numBubbles, minSize, maxSize, minSpeed, maxSpeed, colors, opacity, frameRate, floatEffect]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
