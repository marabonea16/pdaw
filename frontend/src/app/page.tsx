"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AnimatedSVG from "./components/animatedSVG";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const headerLogoRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hideFirstSection, setHideFirstSection] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const smoothScrollTo = (element: HTMLElement) => {
    const targetY = element.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1000; // 1.5 seconds for a smoother effect
    let startTime: number | null = null;
  
    // Smooth cubic Bezier easing function (similar to easeInOutCubic)
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
  
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
  
      window.scrollTo(0, startY + distance * easedProgress);
  
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    };
  
    requestAnimationFrame(step);
  };


  const handleAnimationComplete = () => {
    setIsVisible(true);
    const nextSection = document.getElementById("next-section");
    
    // Add a timeout to allow the first section's exit transition to complete
    if (nextSection) {
      setTimeout(() => {
        smoothScrollTo(nextSection);
        setHideFirstSection(true);
      }, 1000);  // Adjust timing if necessary, should match exit transition duration
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white text-[#2F4F83] w-full p-4 py-7 flex justify-between items-center">
        <div className="flex items-center gap-4 px-5">
          <div ref={headerLogoRef} className={`w-[50px] ${isVisible ? '' : 'opacity-0'}`}>
            <img src="/animation.svg" alt="Header Logo" className="w-[50px] h-[50px]" />
          </div>
          <h1 className="text-xl font-bold">University Portal Technology</h1>
        </div>
        <nav className="flex font-semibold gap-8">
          <a href="/" className="hover:text-gray-400 transition-colors">Home</a>
          <a href="/about" className="hover:text-gray-400 transition-colors">About</a>
          <a href="/contact" className="hover:text-gray-400 transition-colors">Contact</a>
        </nav>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <AnimatePresence>
          {!hideFirstSection && (
            <motion.section
              id="first-section"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: isVisible ? 0 : 1, scale: isVisible ? 0.95 : 1, height: isVisible ? 0 : "100vh" }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{
                duration: 1, 
                ease: "easeInOut", 
                // Optional: Adding some layout transition settings for smoother disappearance
                layout: { duration: 0.5, type: "spring", stiffness: 100 }
              }}
              className="flex justify-center items-center min-h-screen"
            >
              <div className="flex items-center gap-4 transform -translate-y-50">
                <AnimatedSVG headerLogoRef={headerLogoRef} onAnimationComplete={handleAnimationComplete} />
                <div className="relative flex justify-center items-center">
                  <h1 className="text-[100px] sm:text-[200px] font-extrabold text-[#2F4F83]">
                    UPT
                  </h1>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <section id="next-section" className="text-center sm:text-left">
          <h2 className="text-4xl font-bold mt-4">Welcome to University Portal</h2>
          <p className="text-lg mt-2">Connecting Students and Teachers</p>
          <h2 className="text-2xl font-semibold mb-4">About Us</h2>
          <p className="text-sm">
            Our university portal is designed to facilitate seamless communication and collaboration between students and teachers. Access course materials, submit assignments, and stay updated with the latest announcements.
          </p>
        </section>
        <section className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/students"
          >
            <Image
              className="dark:invert"
              src="/file.svg"
              alt="Student Icon"
              width={20}
              height={20}
            />
            For Students
          </a>
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/teachers"
          >
            <Image
              className="dark:invert"
              src="/file.svg"
              alt="Teacher Icon"
              width={20}
              height={20}
            />
            For Teachers
          </a>
        </section>
      </main>
      <footer className="bg-gray-800 text-white w-full p-4 flex justify-center items-center">
        <p>&copy; 2025 University Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}