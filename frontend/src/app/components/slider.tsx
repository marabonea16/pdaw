'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SliderProps {
  slides: string[];
  interval?: number;
}

const Slider = ({ slides, interval = 5000 }: SliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (

    <div className="absolute inset-0 w-full h-full flex overflow-hidden">
      <AnimatePresence>
        {slides.map((slide, index) =>
          index === currentIndex ? (
            <motion.img
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.4, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute w-full h-full object-cover fade-edge"
            />
          ) : null
        )}
      </AnimatePresence>
    </div>

  );
};

export default Slider;