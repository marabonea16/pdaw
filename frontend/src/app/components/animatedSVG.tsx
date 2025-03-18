"use client"; 

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";


export default function AnimatedSVG({ headerLogoRef, onAnimationComplete }: { headerLogoRef: React.RefObject<HTMLDivElement | null>, onAnimationComplete: () => void }) {
  const [animate, setAnimate] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const svgRef = useRef<HTMLDivElement>(null);
  const [animationValues, setAnimationValues] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const calculateAnimationValues = () => {
      if (svgRef.current && headerLogoRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const logoRect = headerLogoRef.current.getBoundingClientRect();
       
        const x = logoRect.left - svgRect.left - 75;
        const y = logoRect.top - svgRect.top - 140;

        setAnimationValues({ x, y });
      }
    };
    calculateAnimationValues(); 
    return () => {
      };
  }, [headerLogoRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  const xValue = 0;
  const yValue = -65;

  const handleAnimationComplete = () => {
    setIsVisible(false); 
    onAnimationComplete(); 
  };

  return (
    <div className="relative flex flex-col justify-center items-center">
      <motion.div
        ref={svgRef}
        initial={{ scale: 1, opacity: 1, x: xValue, y: yValue, rotate: 0 }}
        animate={{ scale: 0.25, opacity: 1, x: animationValues.x, y: animationValues.y, rotate: 360 } }
        transition={{ duration: 3, ease: "easeInOut" }}
        onAnimationComplete={handleAnimationComplete}
        className="absolute w-[100px] sm:w-[200px] h-[100px] sm:h-[200px] "
        > 
        <Image
          src="/animation.svg"
          alt="Animated SVG"
          width={200}
          height={200}
          className={`${isVisible ? '' : 'opacity-0'}`}
        />
      </motion.div>
    </div>
  );
}