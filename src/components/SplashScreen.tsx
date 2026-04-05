import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show the splash screen for 2.5 seconds before starting the exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Generate ambient background fairy lights
  const backgroundSparkles = Array.from({ length: 40 }).map((_, i) => ({
    id: `bg-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.2,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1.5,
  }));

  // Generate burst sparkles for the exit animation
  const burstSparkles = Array.from({ length: 60 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 40 + 10; // distance in vmin
    return {
      id: `burst-${i}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: Math.random() * 0.8 + 0.4,
    };
  });

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 overflow-hidden"
        >
          {/* Ambient background fairy lights */}
          {backgroundSparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              animate={{ 
                opacity: [0.1, 0.8, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: sparkle.duration,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: "easeInOut"
              }}
              className="absolute w-1.5 h-1.5 bg-amber-100 rounded-full shadow-[0_0_8px_rgba(253,230,138,0.8)]"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
              }}
            />
          ))}

          {/* The Couple Photo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-amber-200/30 shadow-[0_0_60px_rgba(253,230,138,0.15)]"
          >
            <img 
              src="/couple.png" 
              alt="The Couple" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if the user hasn't uploaded the image yet
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </motion.div>

          {/* Burst sparkles that only appear on exit */}
          {burstSparkles.map((sparkle) => (
             <motion.div
                key={sparkle.id}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                exit={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, sparkle.scale, 0],
                  x: `${sparkle.x}vmin`, 
                  y: `${sparkle.y}vmin` 
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute z-20 w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_15px_rgba(253,230,138,1)]"
              />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
