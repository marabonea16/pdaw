"use client";

import { Calendar, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const { data: session } = useSession();
    const pathname = usePathname();

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col justify-between transition-all">
            <div className="p-5">
                <h2 className="text-xl font-bold mt-24 mb-4 p-2 text-gray-700">Dashboard</h2>
                {(session?.user?.role == 'superadmin' || session?.user?.role == 'admin') && (
                    <nav className="space-y-4">
                        <Link href="/add-user" 
                            className={`flex items-center gap-2 p-2 font-medium rounded
                            ${pathname === "/add-user" ? "bg-gray-200 text-[#1d2c4b]" : "text-[#2F4F83] hover:bg-gray-200"}`}>
                            <User size={20} /> Add User
                        </Link>
                        <Link href="/all-users" 
                            className={`flex items-center gap-2 p-2 font-medium rounded
                            ${pathname === "/all-users" ? "bg-gray-200 text-[#1d2c4b]" : "text-[#2F4F83] hover:bg-gray-200"}`}>
                            <Calendar size={20} /> All Users
                        </Link>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
