"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface HeaderContextProps {
  isFixed: boolean;
  isVisible: boolean;
  setIsFixed: (value: boolean) => void;
  setIsVisible: (value: boolean) => void;
  headerLogoRef: React.RefObject<HTMLDivElement>;
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined);

export const HeaderProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname(); 
    const isHomePage = pathname === "/";
  
    const [isFixed, setIsFixed] = useState(!isHomePage);
    const [isVisible, setIsVisible] = useState(!isHomePage);
    const headerLogoRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedIsFixed = sessionStorage.getItem("isFixed");
        const storedIsVisible = sessionStorage.getItem("isVisible");
  
        setIsFixed(storedIsFixed ? JSON.parse(storedIsFixed) : !isHomePage);
        setIsVisible(storedIsVisible ? JSON.parse(storedIsVisible) : !isHomePage);
      }
    }, [isHomePage]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("isFixed", JSON.stringify(isFixed));
        sessionStorage.setItem("isVisible", JSON.stringify(isVisible));
      }
    }, [isFixed, isVisible]);
  

  return (
    <HeaderContext.Provider value={{ isFixed, isVisible, setIsFixed, setIsVisible, headerLogoRef }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

export default HeaderContext;