"use client";
import { Roboto } from 'next/font/google';
import Sidebar from '@/Component/Admin/Sidebar';
import { useState, useEffect } from "react";

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
});

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSidebarToggle = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex flex-1 overflow-hidden">

            <Sidebar onToggleSidebar={handleSidebarToggle} />


            <div
                className={`flex-1 transition-all duration-300 overflow-auto ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
            >
                {children}
            </div>
        </div>

    );
}
