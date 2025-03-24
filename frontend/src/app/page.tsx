"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AnimatedSVG from "./components/animatedSVG"
import { useState, useEffect, useMemo  } from "react";
import { useHeader } from "./context/headerContext";
import Link from "next/link";
import Slider from "./components/slider";

const slides = ["/images/1.jpeg", "/images/2.jpeg", "/images/3.jpeg", "/images/4.jpeg", "/images/5.jpeg", "/images/6.jpeg", "/images/7.jpeg"];

export default function Home() {
  const [hideFirstSection, setHideFirstSection] = useState<boolean | null>(null);
  const { isVisible, setIsFixed, setIsVisible, headerLogoRef} = useHeader();

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem("hasAnimated") === "true";
    setHideFirstSection(hasAnimated);
  }, []);
  
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50); 
  }, []);
  
  const debounce = (func: Function, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const smoothScrollTo = debounce((element: HTMLElement) => {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const targetY = element.getBoundingClientRect().top + window.scrollY - 2 * headerHeight - 20;
  
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 4000; // 4 seconds for a slow scroll
    const fps = 60; // 60 frames per second
    const totalFrames = (duration / 1000) * fps;
    let frame = 0;
  
    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startY + distance * easedProgress);
  
      if (frame >= totalFrames) clearInterval(interval);
    }, 1000 / fps);
  }, 50);


  const handleAnimationComplete = () => {
    setIsVisible(true);
    const nextSection = document.getElementById("next-section");
  
    if (nextSection) {
      setTimeout(() => {
        sessionStorage.setItem("hasAnimated", "true");
        setHideFirstSection(true);
        setTimeout(() => {
          setIsFixed(true);
        }, 1000);
        setTimeout(() => {
          smoothScrollTo(nextSection);
        }, 1200);
      }, 500);
    }
  };

  if (hideFirstSection === null) return null;



  return (
    <div className="flex flex-col ">
      <main className="flex flex-col  items-center justify-center flex-grow gap-16 font-[family-name:var(--font-geist-sans)]">
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
                layout: { duration: 1, type: "spring", stiffness: 100 }
              }}
              className="flex justify-center items-center min-h-screen pt-70"
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
        <section
          id="next-section"
          className="text-center mt-[17px] w-full flex items-center justify-center"
          style={{
            position: "relative",
            overflow: "hidden",
            height: "100vh", 
            maxWidth: "100%",
            padding: "0",
            margin: "0",
          }}
        >
          <div 
            style={{
              position: "absolute",
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}>
            <Slider slides={slides} />
          </div>
          <div style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0",
              margin: "0",
            }}>
            <h2 className="text-5xl font-bold mt-4  text-[#2F4F83]">Welcome to University Portal</h2>           
            <div className="flex gap-4 items-center py-10 justify-center flex-col sm:flex-row">
              <Link
                className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center font-bold
                bg-background text-[#2F4F83] gap-2 hover:bg-[#2F4F83] hover:text-background h-24 sm:h-64 px-4 sm:px-8"
                href="/students"
              >
                <Image
                  className="dark:invert"
                  src="/students.svg"
                  alt="Student Icon"
                  width={70}
                  height={70}
                />
                For Students
              </Link>
              <Link
               className="rounded-md border border-solid border-transparent transition-colors flex items-center justify-center font-bold
                bg-background text-[#2F4F83] gap-2 hover:bg-[#2F4F83] hover:text-background h-24 sm:h-64 px-4 sm:px-8"
                href="/teachers"
              >
                <Image
                  className="dark:invert"
                  src="/teachers.svg"
                  alt="Teacher Icon"
                  width={80}
                  height={80}
                />
                For Teachers
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}