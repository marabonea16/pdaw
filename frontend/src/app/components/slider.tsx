'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Image {
  id: number;
  url: string;
}

const Slider = () => {
  const interval = 5000; 
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/images/slider', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => response.json())
      .then((data: Image[])=> {
        const imageUrls = data.map((image: Image) => image.url);
        setImages(imageUrls);
      })
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  console.log(images);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (

    <div className="absolute inset-0 w-full h-full flex overflow-hidden">
      <AnimatePresence>
        {images.map((imageUrl, index) =>
          index === currentIndex ? (
            <motion.img
              key={index}
              src={`http://localhost:8000${imageUrl}`}
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