"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeader } from "../context/headerContext";

const Header = () => {
  const { isFixed, isVisible, headerLogoRef } = useHeader(); // Get values from context

  return (
    <header
      className={`w-full bg-white p-4 py-12 flex justify-between items-center shadow-md transition-all duration-500 ${
        isFixed ? "fixed top-0 z-50" : "relative"
      }`}
    >
      <div className="flex items-center gap-4 px-5">
        <div ref={headerLogoRef} className={`w-[50px] transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <Image src="/animation.svg" alt="Header Logo" width={50} height={50} priority />
        </div>
        <h1 className="text-xl font-bold text-[#2F4F83]">University Portal Technology</h1>
      </div>
      <nav className="flex font-semibold gap-10">
        <Link href="/" className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          Home
        </Link>
        <Link href="/sign-in" className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          Sign In
        </Link>
        <Link href="/contact" className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
