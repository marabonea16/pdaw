"use client";

import Image from "next/image";
import Link from "next/link";
import { useHeader } from "../context/headerContext";
import { useSession } from "next-auth/react"; 


const Header = () => {
  const { isFixed, isVisible, headerLogoRef } = useHeader(); // Get values from context
  const { data: session } = useSession();

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
        <Link href={session ? "/dashboard" : "/"} className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          Home
        </Link>
        <Link href={session ? "/profile" : "/sign-in"} className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          {session ? "Profile" : "Sign In"}
        </Link>
        <Link href="/about-us" className="text-[#2F4F83] hover:text-gray-400 transition-colors">
          About Us
        </Link>
      </nav>
    </header>
  );
};

export default Header;
